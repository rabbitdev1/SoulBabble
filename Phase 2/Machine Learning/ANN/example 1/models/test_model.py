import numpy as np
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
from tensorflow.keras.models import load_model
import pandas as pd
import random

# Load model dan LabelEncoders
model = load_model('models/model.h5')
label_encoder_emosi = LabelEncoder()
label_encoder_emosi.classes_ = np.load('models/emosi_classes.npy', allow_pickle=True)
label_encoder_sumber = LabelEncoder()
label_encoder_rekomendasi = LabelEncoder()

# Memuat dataset untuk mendapatkan rekomendasi
data = pd.read_csv('models/dataset.csv')

# Sample input
sample_input = {
    'emosi': 'netral',
    'emosi_positif': [],
    'emosi_negatif': [],
    'sumber': 'kantor'
}

# Preprocessing input sample
# Label Encoding untuk emosi dan sumber
emosi_encoded = label_encoder_emosi.transform([sample_input['emosi']])[0]
sumber_encoded = label_encoder_sumber.fit_transform([sample_input['sumber']])[0]

# MultiLabel Binarizer untuk emosi positif dan negatif
mlb_pos = MultiLabelBinarizer()
emosi_pos_bin = mlb_pos.fit_transform([sample_input['emosi_positif']])

mlb_neg = MultiLabelBinarizer()
emosi_neg_bin = mlb_neg.fit_transform([sample_input['emosi_negatif']])

# Menggabungkan fitur
X_input = np.hstack([emosi_pos_bin, emosi_neg_bin])

# Cek bentuk input yang diharapkan oleh model
expected_input_shape = model.input_shape[1]
print(f"Dimensi input yang diharapkan oleh model: {expected_input_shape}")

# Periksa bentuk fitur setelah binarizer
print("Bentuk fitur positif:", emosi_pos_bin.shape)
print("Bentuk fitur negatif:", emosi_neg_bin.shape)

# Jika dimensi input masih kurang, tambahkan padding untuk mencocokkan dimensi yang diharapkan
if X_input.shape[1] < expected_input_shape:
    padding = np.zeros((1, expected_input_shape - X_input.shape[1]))
    X_input = np.hstack([X_input, padding])

print(f"Dimensi fitur input setelah padding: {X_input.shape}")

# Prediksi menggunakan model
prediction = model.predict(X_input)

# Mendapatkan hasil emosi yang diprediksi
predicted_class = np.argmax(prediction[0])  # Ambil prediksi dari output pertama (emosi)
predicted_emosi = label_encoder_emosi.classes_[predicted_class]

# Mendapatkan rekomendasi dari dataset CSV
# Filter data sesuai dengan emosi yang diprediksi dan sumber yang diberikan
filtered_data = data[(data['emosi'] == predicted_emosi) & (data['sumber'] == sample_input['sumber'])]

# Ambil rekomendasi yang sesuai
if not filtered_data.empty:
    rekomendasi = filtered_data['rekomendasi'].tolist()  # Mengambil kolom rekomendasi
    selected_recommendation = random.choice(rekomendasi)  # Pilih secara acak rekomendasi
else:
    selected_recommendation = "Tidak ada rekomendasi yang ditemukan."

# Menampilkan hasil
print(f"Prediksi Emosi: {predicted_emosi}")
print(f"Rekomendasi: {selected_recommendation}")
