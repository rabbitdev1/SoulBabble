import joblib
import numpy as np
from keras.models import load_model
from flask import Flask, render_template, request

# Inisialisasi Flask
app = Flask(__name__)

# Memuat model, TfidfVectorizer, dan LabelEncoder
model = load_model('models/emotion_tracking_model.h5')  # Memuat model
vectorizer = joblib.load('models/vectorizer.pkl')  # Memuat TfidfVectorizer
label_encoder = joblib.load('models/label_encoder.pkl')  # Memuat LabelEncoder

# Data input
data = {
    "Level_Emosi": ["Sangat Buruk", "Buruk", "Netral", "Baik", "Sangat Baik"],
    "Sumber_Emosi": "Sekolah",
    "Tipe_Emosi": [
        "Kecewa", "Frustrasi", "Bingung", "Bahagia", "Cemas", "Marah", "Kesal", "Sedih",
        "Tertarik", "Optimis", "Tenang", "Gembira", "Puas", "Nyaman", "Bergairah", "Aneh",
        "Euforis", "Tertantang", "Penuh Harapan", "Terinspirasi", "Panik", "Rindu", "Takut",
        "Senyum", "Terharu", "Bersyukur", "Malu", "Tersenyum", "Terkejut", "Gugup"
    ]
}

# Fungsi untuk Melakukan Prediksi
def predict_question(level_emosi, tipe_emosi, sumber_emosi):
    input_text = f"{level_emosi} {tipe_emosi} {sumber_emosi}"
    input_features = vectorizer.transform([input_text]).toarray()
    
    # Prediksi kelas dengan model
    predicted_class = model.predict(input_features)
    
    # Ambil indeks kelas dengan probabilitas tertinggi
    predicted_class_index = np.argmax(predicted_class, axis=1)[0]
    
    # Pemetaan kembali ke pertanyaan analisis dengan LabelEncoder
    predicted_question = label_encoder.inverse_transform([predicted_class_index])[0]
    
    # Memecah pertanyaan menjadi beberapa bagian berdasarkan tanda "|"
    split_questions = predicted_question.split(" | ")
    
    return split_questions

# Rute utama (homepage)
@app.route("/", methods=["GET", "POST"])
def index():
    predicted_questions = None
    
    if request.method == "POST":
        # Mendapatkan input dari form
        level_emosi = request.form["level_emosi"]
        tipe_emosi = request.form["tipe_emosi"]
        sumber_emosi = request.form["sumber_emosi"]
        
        # Melakukan prediksi dan memecah pertanyaan
        predicted_questions = predict_question(level_emosi, tipe_emosi, sumber_emosi)
    
    # Menampilkan halaman
    return render_template("index.html", data=data, predicted_questions=predicted_questions)

# Menjalankan aplikasi Flask
if __name__ == "__main__":
    app.run(debug=True)
