import joblib
import numpy as np
from keras.models import load_model

# Memuat model dan objek yang telah disimpan
model = load_model('models/emotion_tracking_model.h5')  # Memuat model
vectorizer = joblib.load('models/vectorizer.pkl')  # Memuat TfidfVectorizer
label_encoder = joblib.load('models/label_encoder.pkl')  # Memuat LabelEncoder

def predict_question(level_emosi, tipe_emosi, sumber_emosi):
    # Gabungkan input menjadi satu kalimat
    input_text = f"{level_emosi} {tipe_emosi} {sumber_emosi}"
    
    # Transformasi input menjadi fitur numerik
    input_features = vectorizer.transform([input_text]).toarray()
    
    # Prediksi kelas menggunakan model
    predicted_class = model.predict(input_features)
    
    # Dapatkan indeks kelas dengan probabilitas tertinggi
    predicted_class_index = np.argmax(predicted_class, axis=1)[0]
    
    # Pemetaan kembali ke pertanyaan analisis menggunakan LabelEncoder
    predicted_question = label_encoder.inverse_transform([predicted_class_index])[0]
    
    return predicted_question
