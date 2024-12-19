import sys
import json
import re
from collections import Counter
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk

# Menentukan direktori lokal untuk data NLTK
nltk.data.path.append('./public/nltk_data')

# Mengambil stopwords dalam bahasa Indonesia
try:
    stopwords_indonesia = stopwords.words('indonesian')
except Exception as e:
    raise ValueError("Error loading Indonesian stopwords. Pastikan NLTK sudah dikonfigurasi dengan benar.")

# Lemmatizer untuk mengubah kata ke bentuk dasar
lemmatizer = WordNetLemmatizer()

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
    processed_words = [lemmatizer.lemmatize(word) for word in words if word not in stopwords_indonesia]
    
    return ' '.join(processed_words)

# Fungsi untuk menganalisis emosi dan mengembalikan beberapa emosi dominan
def analisis_emosi(data, top_n=3):
    user_questions = data['user_provided_questions']

    # Menghitung kemunculan kata kunci untuk tiap emosi
    emosi_terdeteksi = []

    for question in user_questions:
        question_processed = preprocess_text(question)

        # Pencocokan kata kunci untuk setiap emosi
        for emosi, keywords in emosi_keywords.items():
            count = sum(1 for word in keywords if re.search(r'\b' + re.escape(word) + r'\b', question_processed))
            if count > 0:
                emosi_terdeteksi.extend([emosi] * count)

    # Menentukan beberapa emosi dominan berdasarkan yang paling sering muncul
    if emosi_terdeteksi:
        dominant_emotions = [item[0] for item in Counter(emosi_terdeteksi).most_common(top_n)]
    else:
        dominant_emotions = data.get('tipe_emosi', ['Tidak ada emosi terdeteksi'])

    return dominant_emotions

if __name__ == "__main__":
    try:
        # Membaca input JSON dari argumen
        input_data_json = sys.argv[1]

        # Memuat JSON string menjadi objek Python (dict)
        input_data = json.loads(input_data_json)
        print("Log: Input Data Diterima =>", input_data, file=sys.stderr)

        # Memastikan bahwa input memiliki struktur yang benar
        if 'user_provided_questions' not in input_data or not isinstance(input_data['user_provided_questions'], list):
            raise ValueError("Input JSON tidak memiliki kunci 'user_provided_questions' atau formatnya salah.")
        
        # Menjalankan analisis emosi
        dominant_emotions = analisis_emosi(input_data)

        # Mengirimkan hasil analisis dalam format JSON
        output_data = {
            "status": 200,
            "dominant_emotions": dominant_emotions,
        }
        print(json.dumps(output_data))

    except Exception as e:
        error_output = {
            "status": 500,
            "error": str(e)
        }
        print(json.dumps(error_output))
        sys.exit(1)
