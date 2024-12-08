import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from keras.models import Sequential
from keras.layers import Dense, Dropout
from keras.optimizers import Adam
import numpy as np
import joblib

# Langkah 1: Membaca data dari CSV
data = pd.read_csv('models/data_set.csv')

# Menampilkan data pertama untuk memastikan formatnya
print(f"Jumlah data: {data.shape[0]} baris dan {data.shape[1]} kolom")
print(data.head())

# Memastikan tidak ada nilai NaN atau kosong di dalam dataset
print(f"Data yang memiliki nilai NaN: \n{data.isnull().sum()}")

# Langkah 2: Menyiapkan data untuk model
# Menggabungkan Level_Emosi, Tipe_Emosi, dan Sumber_Emosi menjadi satu kolom input
data['Input_Text'] = data['Level_Emosi'] + " " + data['Tipe_Emosi'] + " " + data['Sumber_Emosi']

# Menggunakan TfidfVectorizer untuk mengubah teks menjadi fitur numerik
vectorizer = TfidfVectorizer(max_features=1500)  # Menggunakan 1500 fitur teratas untuk menghindari overfitting
X = vectorizer.fit_transform(data['Input_Text']).toarray()  # Fitur numerik

# Langkah 3: Encoding target (Pertanyaan_Analisis) menjadi label numerik
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(data['Pertanyaan_Analisis'])  # Target yang ingin diprediksi (pertanyaan analisis)

# Langkah 4: Memeriksa jumlah data dan membagi dataset
# Membagi data menjadi training dan testing set (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Langkah 5: Membangun model Neural Network (ANN)
model = Sequential()

# Layer input (dengan 1500 fitur dari TfidfVectorizer)
model.add(Dense(256, input_dim=X_train.shape[1], activation='relu'))
model.add(Dropout(0.3))  # Dropout untuk mengurangi overfitting
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.3))  # Dropout untuk mengurangi overfitting
model.add(Dense(64, activation='relu'))

# Output layer (jumlah pertanyaan analisis)
model.add(Dense(len(set(y)), activation='softmax'))  # Jumlah pertanyaan yang berbeda

# Kompilasi model
model.compile(loss='sparse_categorical_crossentropy', optimizer=Adam(), metrics=['accuracy'])

# Langkah 6: Melatih model
model.fit(X_train, y_train, epochs=50, batch_size=16, validation_data=(X_test, y_test))  # Mengurangi epoch agar sesuai dengan data kecil

# Langkah 7: Evaluasi model
score = model.evaluate(X_test, y_test)
print(f"Model Accuracy: {score[1]*100:.2f}%")

# Menyimpan model untuk penggunaan selanjutnya
model.save("models/emotion_tracking_model.h5")

# Menyimpan TfidfVectorizer dan LabelEncoder untuk penggunaan selanjutnya
joblib.dump(vectorizer, 'models/vectorizer.pkl')  # Menyimpan TfidfVectorizer
joblib.dump(label_encoder, 'models/label_encoder.pkl')  # Menyimpan LabelEncoder

print("Model, TfidfVectorizer, dan LabelEncoder berhasil disimpan!")
