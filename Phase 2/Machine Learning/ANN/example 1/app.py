from flask import Flask, render_template, request, jsonify
import numpy as np
from tensorflow.keras.models import load_model
import json
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)

# Memuat model yang sudah dilatih
model = load_model('models/trained_model.h5')

# Memuat data dari file JSON
with open('models/data_latih.json', 'r') as json_file:
    data = json.load(json_file)

# Menggunakan LabelEncoder untuk encoding data
encoder_emosi = LabelEncoder()
encoder_emosi.fit(data['emosi'])
encoder_emosi_positif = LabelEncoder()
encoder_emosi_positif.fit(data['emosi_positif'])
encoder_emosi_negatif = LabelEncoder()
encoder_emosi_negatif.fit(data['emosi_negatif'])
encoder_sumber = LabelEncoder()
encoder_sumber.fit(data['sumber'])
encoder_rekomendasi = LabelEncoder()
encoder_rekomendasi.fit(data['rekomendasi'])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Menerima input dari pengguna
    emosi = request.form['emosi']
    emosi_positif = request.form.getlist('emosi_positif')  # Menggunakan getlist untuk emosi positif yang bisa lebih dari satu
    emosi_negatif = request.form.getlist('emosi_negatif')  # Menggunakan getlist untuk emosi negatif
    sumber = request.form['sumber']
    
    # Encoding input pengguna
    emosi_encoded = encoder_emosi.transform([emosi])[0]
    emosi_positif_encoded = encoder_emosi_positif.transform(emosi_positif)
    emosi_negatif_encoded = encoder_emosi_negatif.transform(emosi_negatif)
    sumber_encoded = encoder_sumber.transform([sumber])[0]
    
    # Menyiapkan data untuk prediksi
    X_input = np.array([emosi_encoded] + list(emosi_positif_encoded) + list(emosi_negatif_encoded) + [sumber_encoded])
    X_input = X_input.reshape(1, -1)  # Mengubah bentuk agar sesuai dengan input model
    
    # Prediksi rekomendasi
    prediction = model.predict(X_input)
    recommended_index = np.argmax(prediction)  # Mengambil indeks rekomendasi dengan probabilitas tertinggi
    recommendation = encoder_rekomendasi.inverse_transform([recommended_index])[0]

    return render_template('index.html', recommendation=recommendation)

if __name__ == '__main__':
    app.run(debug=True)
