import json
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
import matplotlib.pyplot as plt

# 1. Memuat Dataset dari File JSON
with open('models/dataset.json', 'r') as file:
    dataset = json.load(file)

# 2. Membaca data menjadi DataFrame untuk memudahkan pemrosesan
data = pd.DataFrame(dataset)

# 3. Cek tipe data untuk setiap kolom
print("Tipe data sebelum preprocessing:")
print(data.dtypes)

# 4. Mengonversi kolom yang diperlukan menjadi format numerik

# Label Encoding untuk kolom kategorikal 'emosi', 'sumber', dan 'rekomendasi'
label_encoder_emosi = LabelEncoder()
data['emosi_encoded'] = label_encoder_emosi.fit_transform(data['emosi'])

label_encoder_sumber = LabelEncoder()
data['sumber_encoded'] = label_encoder_sumber.fit_transform(data['sumber'])

label_encoder_rekomendasi = LabelEncoder()
data['rekomendasi_encoded'] = label_encoder_rekomendasi.fit_transform(data['rekomendasi'])

# 5. Mengubah Kolom emosi_positif dan emosi_negatif ke Format One-Hot Encoding (Biner)
mlb_pos = MultiLabelBinarizer()
emosi_pos_bin = mlb_pos.fit_transform(data['emosi_positif'])
emosi_pos_columns = mlb_pos.classes_

mlb_neg = MultiLabelBinarizer()
emosi_neg_bin = mlb_neg.fit_transform(data['emosi_negatif'])
emosi_neg_columns = mlb_neg.classes_

# Menambahkan kolom baru ke DataFrame untuk emosi positif dan negatif
emosi_pos_df = pd.DataFrame(emosi_pos_bin, columns=emosi_pos_columns)
emosi_neg_df = pd.DataFrame(emosi_neg_bin, columns=emosi_neg_columns)

# Gabungkan kolom baru dengan data asli
data = pd.concat([data, emosi_pos_df, emosi_neg_df], axis=1)

# 6. Memisahkan Fitur (X) dan Target (y)
X = data.drop(columns=['emosi', 'emosi_encoded', 'rekomendasi', 'rekomendasi_encoded', 'sumber'])
y = data['emosi_encoded']  # Kita akan memprediksi kolom 'emosi'

# Pastikan semua kolom numerik dan valid
X = X.apply(pd.to_numeric, errors='coerce')  # Mengonversi semua kolom X menjadi numerik
X = X.astype(np.float32)  # Mengonversi ke float32 agar bisa diterima oleh TensorFlow
X = X.fillna(0)  # Mengisi nilai NaN dengan 0

# Pastikan target (y) adalah integer
y = y.astype(np.int32)

# 7. Memisahkan Data untuk Training dan Testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"Data latih: {X_train.shape}, Data uji: {X_test.shape}")

# 8. Membangun Model ANN (Artificial Neural Network)
model = Sequential([
    Dense(512, input_dim=X_train.shape[1], activation='relu'),  # Layer pertama yang lebih besar
    Dropout(0.5),  # Regularisasi dropout
    Dense(256, activation='relu'),  # Layer kedua
    Dropout(0.5),
    Dense(128, activation='relu'),  # Layer ketiga
    Dense(64, activation='relu'),   # Layer keempat
    Dense(len(label_encoder_emosi.classes_), activation='softmax')  # Output layer sesuai dengan jumlah kelas emosi
])

# 9. Menyusun Model
optimizer = tf.keras.optimizers.Adam(learning_rate=0.0001)  # Learning rate yang lebih kecil
model.compile(loss='sparse_categorical_crossentropy', optimizer=optimizer, metrics=['accuracy'])

# 10. Melatih Model dengan EarlyStopping
from tensorflow.keras.callbacks import EarlyStopping

early_stopping = EarlyStopping(monitor='val_loss', patience=100, restore_best_weights=True)

history = model.fit(X_train, y_train, epochs=500, batch_size=32, validation_data=(X_test, y_test),)

# 11. Menyimpan Model
model.save('models/emotion_model.h5')

# 12. Evaluasi Model
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Loss: {loss}, Accuracy: {accuracy}")

# Menampilkan grafik akurasi dan loss selama pelatihan
plt.plot(history.history['accuracy'], label='Akurasi Training')
plt.plot(history.history['val_accuracy'], label='Akurasi Validasi')
plt.title('Akurasi Model')
plt.xlabel('Epoch')
plt.ylabel('Akurasi')
plt.legend()
plt.show()

plt.plot(history.history['loss'], label='Loss Training')
plt.plot(history.history['val_loss'], label='Loss Validasi')
plt.title('Loss Model')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.show()
