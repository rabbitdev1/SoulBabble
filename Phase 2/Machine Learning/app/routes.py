import joblib
import numpy as np
from keras.models import load_model
from flask import Blueprint, render_template, request, redirect, url_for, jsonify

# Inisialisasi Flask
main = Blueprint('main', __name__)

# Memuat model, TfidfVectorizer, dan LabelEncoder
model = load_model('app/models/emotion_tracking_model.keras')  # Memuat model
vectorizer = joblib.load('app/models/vectorizer.pkl')  # Memuat TfidfVectorizer
label_encoder = joblib.load('app/models/label_encoder.pkl')  # Memuat LabelEncoder

# Data input
data = {
    "Level_Emosi": ["Sangat Buruk", "Buruk", "Netral", "Baik", "Sangat Baik"],
    "sumber_emosi": [
        "Sekolah", "Keluarga", "Teman", "Lingkungan", "Pekerjaan", "Kesehatan", "Keuangan", 
        "Cinta", "Relasi Sosial", "Kegiatan Ekstrakurikuler", "Media Sosial", "Kebebasan Pribadi", 
        "Pendidikan", "Keluarga Besar", "Masyarakat", "Hobi", "Perjalanan", "Kreativitas", "Komunitas", 
        "Budaya", "Kepercayaan Diri", "Teknologi", "Aktivitas Fisik", "Kesenian", "Kebudayaan", "Kebijakan Publik",
        "Kesehatan Mental", "Kehidupan", "Pengalaman",
    ],
    "Tipe_Emosi": [
        "Kecewa", "Frustrasi", "Bingung", "Bahagia", "Cemas", "Marah", "Kesal", "Sedih",
        "Tertarik", "Optimis", "Tenang", "Gembira", "Puas", "Nyaman", "Bergairah", "Aneh",
        "Euforis", "Tertantang", "Penuh Harapan", "Terinspirasi", "Panik", "Rindu", "Takut",
        "Senyum", "Terharu", "Bersyukur", "Malu", "Tersenyum", "Terkejut", "Gugup", "Gemas", "Terluka",
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
@main.route("/", methods=["GET", "POST"])
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

# Rute untuk menyimpan pertanyaan
@main.route("/save", methods=["POST"])
def save_question():
    predicted_questions = request.form.getlist("predicted_question")
    
    if predicted_questions:
        # Simpan pertanyaan (misalnya di file atau database)
        for question in predicted_questions:
            print(f"Pertanyaan disimpan: {question}")
        # Anda bisa menambahkan kode untuk menyimpan pertanyaan ke database atau file jika diperlukan
    
    # Setelah pertanyaan disimpan, redirect ke halaman utama
    return redirect(url_for('main.index'))

# Rute untuk menampilkan JSON setelah pengguna mengisi inputan
@main.route("/get_json", methods=["POST"])
def get_json():
    level_emosi = request.form["level_emosi"]
    tipe_emosi = request.form["tipe_emosi"]
    sumber_emosi = request.form["sumber_emosi"]
    
    # Melakukan prediksi dan memecah pertanyaan
    predicted_questions = predict_question(level_emosi, tipe_emosi, sumber_emosi)
    
    # Membuat response JSON
    response = {
        "level_emosi": level_emosi,
        "tipe_emosi": tipe_emosi,
        "sumber_emosi": sumber_emosi,
        "predicted_questions": predicted_questions
    }
    
    return jsonify(response)  # Mengembalikan JSON

