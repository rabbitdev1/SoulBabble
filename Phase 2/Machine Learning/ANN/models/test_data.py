import joblib
import numpy as np
from tensorflow.keras.models import load_model  # Menggunakan tensorflow.keras

# Langkah 1: Memuat Model, TfidfVectorizer, dan LabelEncoder
model = load_model('app/models/emotion_tracking_model.keras')  # Memuat model
vectorizer = joblib.load('app/models/vectorizer.pkl')  # Memuat TfidfVectorizer
label_encoder = joblib.load('app/models/label_encoder.pkl')  # Memuat LabelEncoder

# Langkah 2: Fungsi untuk Melakukan Prediksi
def predict_question(level_emosi, tipe_emosi, sumber_emosi):
    # Gabungkan Level_Emosi, Tipe_Emosi, dan Sumber_Emosi menjadi satu input
    input_text = f"{level_emosi} {tipe_emosi} {sumber_emosi}"
    
    # Ubah input_text menjadi fitur numerik menggunakan TfidfVectorizer
    input_features = vectorizer.transform([input_text]).toarray()
    
    # Prediksi kelas dengan model
    predicted_class = model.predict(input_features)
    
    # Ambil indeks kelas dengan probabilitas tertinggi
    predicted_class_index = np.argmax(predicted_class, axis=1)[0]
    
    # Pemetaan kembali ke pertanyaan analisis dengan LabelEncoder
    predicted_question = label_encoder.inverse_transform([predicted_class_index])[0]
    
    return predicted_question

# Langkah 3: Contoh Data Test (Input baru)
test_data = [
    ("Sangat Buruk", "Kecewa", "Sekolah"),
    ("Sedang", "Marah", "Sekolah"),
    ("Baik", "Bahagia", "Sekolah"),
    ("Sangat Buruk", "Cemas", "Sekolah"),
    ("Baik", "Senang", "Sekolah")
]

# Langkah 4: Mencetak Prediksi untuk Setiap Input
for level_emosi, tipe_emosi, sumber_emosi in test_data:
    predicted_question = predict_question(level_emosi, tipe_emosi, sumber_emosi)
    print(f"Input: ({level_emosi}, {tipe_emosi}, {sumber_emosi}) => Prediksi Pertanyaan: {predicted_question}")
