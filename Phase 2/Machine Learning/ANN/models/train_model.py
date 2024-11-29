import numpy as np
import json
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from sklearn.preprocessing import LabelEncoder

# Memuat data dari file JSON
with open('models/data_latih.json', 'r') as json_file:
    data = json.load(json_file)

# Menggunakan LabelEncoder untuk encoding data
encoder_emosi = LabelEncoder()
encoder_emosi_positif = LabelEncoder()
encoder_emosi_negatif = LabelEncoder()
encoder_sumber = LabelEncoder()
encoder_rekomendasi = LabelEncoder()

# Meng-encode data
emosi_encoded = encoder_emosi.fit_transform(data['emosi'])
emosi_positif_encoded = encoder_emosi_positif.fit_transform(data['emosi_positif'])
emosi_negatif_encoded = encoder_emosi_negatif.fit_transform(data['emosi_negatif'])
sumber_encoded = encoder_sumber.fit_transform(data['sumber'])
rekomendasi_encoded = encoder_rekomendasi.fit_transform(data['rekomendasi'])

# Verifikasi ukuran data
print(f"Emosi Encoded: {len(emosi_encoded)}")
print(f"Emosi Positif Encoded: {len(emosi_positif_encoded)}")
print(f"Emosi Negatif Encoded: {len(emosi_negatif_encoded)}")
print(f"Sumber Encoded: {len(sumber_encoded)}")
print(f"Rekomendasi Encoded: {len(rekomendasi_encoded)}")

# Verifikasi konsistensi data
assert len(emosi_encoded) == len(emosi_positif_encoded) == len(emosi_negatif_encoded) == len(sumber_encoded) == len(rekomendasi_encoded), "Jumlah data tidak konsisten!"

# Menyiapkan Data untuk Model
X = np.array(list(zip(emosi_encoded, emosi_positif_encoded, emosi_negatif_encoded, sumber_encoded)))  
y = np.array(rekomendasi_encoded)  # Target adalah rekomendasi

# Verifikasi ukuran X dan y
print(f"Shape of X: {X.shape}")
print(f"Shape of y: {y.shape}")

# Membuat Model ANN
model = Sequential()
model.add(Dense(16, input_dim=4, activation='relu'))  # 4 input: emosi, emosi positif, emosi negatif, sumber
model.add(Dense(8, activation='relu'))
model.add(Dense(len(np.unique(rekomendasi_encoded)), activation='softmax'))  # Jumlah kelas rekomendasi

# Kompilasi Model
model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

# Melatih Model
model.fit(X, y, epochs=100, batch_size=2)

# Menyimpan Model
model.save('models/trained_model.h5')

print("Model telah dilatih dan disimpan.")
