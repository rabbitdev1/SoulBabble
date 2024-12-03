import json
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
import tensorflow as tf

# Memuat model yang sudah dilatih
model = tf.keras.models.load_model('models/emotion_model.h5')

# 1. Memuat Dataset dari File JSON
with open('models/dataset.json', 'r') as file:
    dataset = json.load(file)

# 2. Membaca data menjadi DataFrame untuk memudahkan pemrosesan
data = pd.DataFrame(dataset)

# 3. Preprocessing sesuai dengan training data

# Label Encoding untuk kolom kategorikal 'emosi', 'sumber', dan 'rekomendasi'
label_encoder_emosi = LabelEncoder()
label_encoder_emosi.fit(data['emosi'])

label_encoder_sumber = LabelEncoder()
label_encoder_sumber.fit(data['sumber'])

mlb_pos = MultiLabelBinarizer()
mlb_pos.fit(data['emosi_positif'])

mlb_neg = MultiLabelBinarizer()
mlb_neg.fit(data['emosi_negatif'])

# 4. Input baru untuk prediksi
test_input = {
    "emosi": "sangat baik",
    "emosi_positif": ["antusias", "bahagia", "takjub"],
    "emosi_negatif": ["marah", "kecewa"],
    "sumber": "kantor"
}

# Preprocessing Input

# Encoding emosi
emosi_test = label_encoder_emosi.transform([test_input['emosi']])

# Encoding sumber
sumber_test = label_encoder_sumber.transform([test_input['sumber']])

# Encoding emosi positif
emosi_pos_test = mlb_pos.transform([test_input['emosi_positif']])

# Encoding emosi negatif
emosi_neg_test = mlb_neg.transform([test_input['emosi_negatif']])

# Gabungkan semua fitur ke dalam array yang siap untuk dimasukkan ke model
test_features = np.hstack([emosi_pos_test, emosi_neg_test, sumber_test.reshape(-1, 1)])

# Pastikan format data float32 sesuai dengan yang digunakan saat training
test_features = test_features.astype(np.float32)

# Periksa jumlah fitur yang dihasilkan dan model input shape
print(f"Jumlah fitur untuk input testing: {test_features.shape[1]}")
print(f"Jumlah fitur yang diharapkan oleh model: {model.input_shape[1]}")

# Jika jumlah fitur tidak cocok, lakukan padding
if test_features.shape[1] < model.input_shape[1]:
    test_features = np.hstack([test_features, np.zeros((test_features.shape[0], model.input_shape[1] - test_features.shape[1]))])  # padding kolom yang kurang

# 5. Prediksi dengan Model
y_pred_test = model.predict(test_features)

# 6. Mengambil kelas yang memiliki probabilitas tertinggi
y_pred_class = np.argmax(y_pred_test, axis=1)

# 7. Menampilkan hasil prediksi emosi
predicted_emosi = label_encoder_emosi.inverse_transform(y_pred_class)
print(f"Prediksi Emosi: {predicted_emosi[0]}")

# 8. Menentukan rekomendasi berdasarkan emosi yang diprediksi
emosi_predicted = predicted_emosi[0]
rekomendasi = data[data['emosi'] == emosi_predicted]['rekomendasi'].values[0]

print(f"Rekomendasi untuk emosi '{emosi_predicted}': {rekomendasi}")
