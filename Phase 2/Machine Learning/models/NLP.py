import re
from collections import Counter
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download stopwords dan WordNet
nltk.download('stopwords')
nltk.download('wordnet')

# Mengambil stopwords dalam bahasa Indonesia
stopwords_indonesia = stopwords.words('indonesian')

# Lemmatizer untuk mengubah kata ke bentuk dasar
lemmatizer = WordNetLemmatizer()

# Data Emosi (dataset yang sudah ada)
data_emosi = {
  "level_emosi": "Sangat Baik",
  "tipe_emosi": "Optimis",
  "sumber_emosi": "Sekolah",
  "predicted_questions": [
    "Apa yang membuat kamu merasa optimis di Sekolah?",
    "Apa yang bisa menyebabkan perasaan optimis kamu di Sekolah?",
    "Bagaimana situasi di Sekolah mempengaruhi perasaan kamu yang optimis?",
    "Apa yang mempengaruhi perasaan optimis kamu di Sekolah?",
    "Bagaimana kamu bisa mempertahankan perasaan optimis saat menghadapi tantangan di Sekolah?",
  ],
 "user_provided_questions": [
    "Aku selalu semangat kalau belajar sesuatu yang baru, apalagi kalau materinya seru! Terus, punya teman-teman yang kompak bikin aku jadi lebih enjoy ngejalanin hari-hari di sekolah.",
    "Salah satunya adalah ketika guru memberikan dukungan dan penjelasan yang jelas, serta ketika ada kesempatan untuk berkembang dan mencoba hal-hal baru. Selain itu, kegiatan ekstrakurikuler juga bikin semangat.",
    "Situasi sekolah yang kondusif dan lingkungan yang mendukung membuat aku lebih mudah untuk tetap optimis. Kalau aku merasa dihargai dan mendapat perhatian dari teman-teman serta guru, itu semakin membuat aku merasa positif.",
    "Perasaan optimis aku di sekolah dipengaruhi oleh hal-hal seperti pencapaian kecil dalam belajar, dukungan dari teman-teman, dan suasana kelas yang menyenangkan. Semua itu membuat aku merasa lebih termotivasi.",
    "Saat menghadapi tantangan, aku mencoba untuk tetap fokus pada solusi dan berpikir positif. Aku juga belajar dari kegagalan dan melihat setiap tantangan sebagai kesempatan untuk tumbuh.",
  ]
}

# Daftar kata kunci untuk masing-masing emosi
emosi_keywords = {
    "Kecewa": ["kecewa", "tidak dihargai", "tidak diakui", "terabaikan", "tidak puas"],
    "Frustrasi": ["frustrasi", "kesal", "tertekan", "jengkel", "geram"],
    "Bingung": ["bingung", "kebingungan", "confused", "terperanjat", "tersesat"],
    "Bahagia": ["bahagia", "senang", "gembira", "senyum", "positif", "tersenyum"],
    "Cemas": ["cemas", "khawatir", "panik", "tertekan", "gelisah"],
    "Marah": ["marah", "kesal", "jengkel", "frustrasi", "geram"],
    "Kesal": ["kesal", "frustrasi", "marah", "geram", "iri"],
    "Sedih": ["sedih", "murung", "terpuruk", "kecewa", "hati hancur"],
    "Tertarik": ["tertarik", "minat", "penasaran", "ingin tahu", "berminat"],
    "Optimis": ["optimis", "penuh harapan", "positif", "percaya diri", "bersemangat"],
    "Tenang": ["tenang", "damai", "relaks", "sejuk", "santai"],
    "Gembira": ["gembira", "senang", "bahagia", "bersemangat", "ceria"],
    "Puas": ["puas", "terpenuhi", "legawa", "bahagia", "senang"],
    "Nyaman": ["nyaman", "betah", "tentram", "senang", "aman"],
    "Bergairah": ["bersemangat", "bergairah", "terinspirasi", "bertekad", "penuh gairah"],
    "Aneh": ["aneh", "ganjil", "luar biasa", "tidak biasa", "unik"],
    "Euforis": ["euforis", "bersemangat", "gembira", "penuh energi", "jubile"],
    "Tertantang": ["tertantang", "bersemangat", "terdorong", "terinspirasi", "tantangan"],
    "Penuh Harapan": ["penuh harapan", "optimis", "percaya diri", "berharap", "terinspirasi"],
    "Terinspirasi": ["terinspirasi", "tergerak", "terdorong", "terpacu", "motivasi"],
    "Panik": ["panik", "cemas", "khawatir", "takut", "bingung"],
    "Rindu": ["rindu", "merindukan", "terasa kosong", "kangen", "kerinduan"],
    "Takut": ["takut", "cemas", "khawatir", "bingung", "tertekan"],
    "Senyum": ["senyum", "tersenyum", "bahagia", "gembira", "positif"],
    "Terharu": ["terharu", "tersentuh", "terpukau", "terimpressed", "terpesona"],
    "Bersyukur": ["bersyukur", "terima kasih", "berterima kasih", "berkat", "syukur"],
    "Malu": ["malu", "canggung", "memalukan", "terhina", "dipermalukan"],
    "Tersenyum": ["tersenyum", "senyum", "bahagia", "gembira", "positif"],
    "Terkejut": ["terkejut", "kaget", "terheran", "terperanjat", "bingung"],
    "Gugup": ["gugup", "cemas", "tertekan", "nervous", "khawatir"],
    "Gemas":["gemas", "tergesa-gesa", "tertekan", "terpuruk", "cemas"],
    "Terluka":["terluka", "terluka", "terpuruk", "tergesa-gesa", "tertekan"],
}

# Fungsi untuk membersihkan teks (menghapus stopwords dan melakukan lemmatization)
def preprocess_text(text):
    # Mengubah kalimat menjadi huruf kecil
    text = text.lower()
    
    # Menghapus tanda baca dan angka
    text = re.sub(r'[^\w\s]', '', text)
    
    # Tokenisasi dan menghapus stopwords serta melakukan lemmatization
    words = text.split()
    processed_words = [
        lemmatizer.lemmatize(word) for word in words if word not in stopwords_indonesia
    ]
    
    return ' '.join(processed_words)

# Fungsi untuk menganalisis emosi dan mengembalikan beberapa emosi dominan
def analisis_emosi(data, top_n=3):
    # Menyusun list kata kunci yang akan digunakan untuk analisis
    user_questions = data['user_provided_questions']
    
    # Menghitung kemunculan kata kunci untuk tiap emosi
    emosi_terdeteksi = []
    
    for question in user_questions:
        question_processed = preprocess_text(question)  # Menghapus stopwords dan melakukan lemmatization
        
        # Pencocokan kata kunci untuk setiap emosi
        for emosi, keywords in emosi_keywords.items():
            count = sum(1 for word in keywords if re.search(r'\b' + re.escape(word) + r'\b', question_processed))
            if count > 0:
                emosi_terdeteksi.extend([emosi] * count)  # Tambahkan emosi yang ditemukan sebanyak jumlah kemunculannya

    # Menentukan beberapa emosi dominan berdasarkan yang paling sering muncul
    if emosi_terdeteksi:
        dominant_emotions = [item[0] for item in Counter(emosi_terdeteksi).most_common(top_n)]
    else:
        dominant_emotions = data['tipe_emosi']  # Jika tidak ada emosi yang terdeteksi

    return dominant_emotions

# Menjalankan analisis untuk 3 emosi dominan
hasil_analisis = analisis_emosi(data_emosi, top_n=3)

# Output hasil analisis emosi
print("Emosi Dominan:", hasil_analisis)
