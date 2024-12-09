# %% Step 0: Import
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import classification_report
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Input
from tensorflow.keras.optimizers import Adam
from keras.callbacks import EarlyStopping
import joblib
import re
import nltk
import tensorflow as tf

# Unduh stopwords dan wordnet untuk Bahasa Indonesia
nltk.download('stopwords')
nltk.download('wordnet')

from nltk.corpus import stopwords
stopwords_indonesia = stopwords.words('indonesian')
from nltk.stem import WordNetLemmatizer

# Pastikan TensorFlow sudah terinstal dengan benar
print(tf.__version__)

# %% Step 1: Membaca data dari CSV
data = pd.read_csv('../../models/ANN/data_set.csv')

# Menampilkan data pertama untuk memastikan formatnya
print(f"Jumlah data: {data.shape[0]} baris dan {data.shape[1]} kolom")
print(data.head())

# Memastikan tidak ada nilai NaN atau duplikat di dalam dataset
print(f"Data yang memiliki nilai NaN setelah pembersihan: \n{data.isnull().sum()}")

# %% Step 2: Menyiapkan data untuk model
# Menggabungkan Level_Emosi, Tipe_Emosi, dan Sumber_Emosi menjadi satu kolom input
data['Input_Text'] = data['Level_Emosi'] + " " + data['Tipe_Emosi'] + " " + data['Sumber_Emosi']

# Fungsi preprocessing untuk teks bahasa Indonesia
lemmatizer = WordNetLemmatizer()

def preprocess_text(text):
    # Menghapus karakter yang tidak relevan dan menurunkan semua huruf menjadi kecil
    text = re.sub(r'[^a-zA-Z\s]', '', text.lower())
    # Menghapus stopwords dan melakukan lemmatization
    text = ' '.join([lemmatizer.lemmatize(word) for word in text.split() if word not in stopwords_indonesia])
    return text

# Terapkan preprocessing ke kolom Input_Text
data['Input_Text'] = data['Input_Text'].apply(preprocess_text)

# %% Step 3: Feature Extraction using TfidfVectorizer
vectorizer = TfidfVectorizer(max_features=2000, ngram_range=(1, 2), stop_words=stopwords_indonesia)
X = vectorizer.fit_transform(data['Input_Text']).toarray()

# %% Step 4: Encoding target labels (Pertanyaan_Analisis) to numeric labels
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(data['Pertanyaan_Analisis'])  # Target yang ingin diprediksi (pertanyaan analisis)

# Cek distribusi kelas
print("Distribusi kelas (Pertanyaan_Analisis):")
print(data['Pertanyaan_Analisis'].value_counts())

# %% Step 5: Hapus kelas dengan hanya satu data
# Temukan kelas yang hanya memiliki satu data
kelas_jarang = data['Pertanyaan_Analisis'].value_counts()[data['Pertanyaan_Analisis'].value_counts() == 1].index

# Hapus kelas tersebut dari data
data = data[~data['Pertanyaan_Analisis'].isin(kelas_jarang)]

# Cek kembali distribusi kelas setelah penghapusan
print("\nDistribusi kelas setelah menghapus kelas dengan satu data:")
print(data['Pertanyaan_Analisis'].value_counts())

# %% Step 6: Membagi data menggunakan train_test_split (Stratified)

# Cek distribusi kelas setelah pembersihan
kelas_baru = data['Pertanyaan_Analisis'].value_counts()

# Hapus kelas yang memiliki hanya satu data (jika ada)
kelas_jarang = kelas_baru[kelas_baru == 1].index
if len(kelas_jarang) > 0:
    print(f"Kelas yang memiliki hanya satu data: {kelas_jarang}")
    # Gabungkan kelas yang hanya memiliki satu data menjadi satu kelas baru: 'Lainnya'
    data['Pertanyaan_Analisis'] = data['Pertanyaan_Analisis'].replace(kelas_jarang, 'Lainnya')

# Cek distribusi kelas setelah penggabungan kelas yang jarang
kelas_baru = data['Pertanyaan_Analisis'].value_counts()
print(f"Distribusi kelas setelah penggabungan kelas dengan satu data: \n{kelas_baru}")

# Pastikan kelas yang tersisa cukup untuk pembagian
if kelas_baru.min() < 2:
    print("Ada kelas yang masih memiliki kurang dari 2 data setelah penggabungan. Pembagian data tidak bisa dilakukan.")
else:
    # Pembagian data menggunakan train_test_split dengan stratify untuk menjaga distribusi kelas
    X = vectorizer.fit_transform(data['Input_Text']).toarray()
    y = label_encoder.fit_transform(data['Pertanyaan_Analisis'])  # Target yang ingin diprediksi (pertanyaan analisis)

    test_size = max(0.2, 1460 / len(data))  # Menentukan test_size lebih besar atau sama dengan jumlah kelas

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=42, stratify=y  # Sesuaikan test_size sesuai dengan jumlah kelas
    )

    print("\nDistribusi kelas setelah pembagian train dan test:")
    print(pd.Series(y_train).value_counts())
    print(pd.Series(y_test).value_counts())

# %% Step 7: Build Neural Network Model (ANN)
def build_model(input_shape):
    model = Sequential()
    model.add(Input(shape=(input_shape,)))  # Menentukan bentuk input berdasarkan jumlah fitur
    model.add(Dense(512, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(256, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(128, activation='relu'))
    model.add(Dense(len(set(y)), activation='softmax'))  # Jumlah kelas (pertanyaan)

    model.compile(loss='sparse_categorical_crossentropy', optimizer=Adam(learning_rate=0.001), metrics=['accuracy'])
    return model

# %% Step 8: Train the Model with Early Stopping
early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
model = build_model(X_train.shape[1])

model.fit(X_train, y_train, epochs=50, batch_size=16, validation_data=(X_test, y_test), callbacks=[early_stopping])

# %% Step 9: Evaluate the Model
score = model.evaluate(X_test, y_test)
print(f"Model Accuracy: {score[1]*100:.2f}%")

y_pred = model.predict(X_test).argmax(axis=1)

# Identifikasi kelas yang ada dalam y_test dan y_pred
y_test_classes = set(y_test)
y_pred_classes = set(y_pred)

# Cek kelas yang hilang
missing_classes = y_test_classes - y_pred_classes
print(f"Kelas yang tidak terdeteksi dalam prediksi: {missing_classes}")

# Sesuaikan target_names dengan kelas yang ada dalam y_test
target_names = label_encoder.classes_

# Gunakan parameter 'labels' dalam classification_report untuk mengatasi ketidaksesuaian jumlah kelas
print(classification_report(y_test, y_pred, target_names=target_names, labels=label_encoder.transform(target_names[:len(y_pred_classes)])))

# %% Step 10: Save Model, TfidfVectorizer, and LabelEncoder for future use
model.save("../../app/models/emotion_tracking_model.keras")
joblib.dump(vectorizer, '../../app/models/vectorizer.pkl')  # Menyimpan TfidfVectorizer
joblib.dump(label_encoder, '../../app/models/label_encoder.pkl')  # Menyimpan LabelEncoder

print("Model, TfidfVectorizer, dan LabelEncoder berhasil disimpan!")
