import json
import random
# Data input
data = {
    "Level_Emosi": ["Sangat Buruk", "Buruk", "Netral", "Baik", "Sangat Baik"],
    "sumber_emosi": [
        "Sekolah", "Keluarga", "Pertemanan", "Lingkungan", "Pekerjaan", "Kesehatan", "Keuangan", 
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

# Fungsi untuk menghasilkan pertanyaan analisis berdasarkan tipe emosi
def generate_questions(tipe_emosi, sumber_emosi):
    # Pertanyaan dasar yang akan diubah
    questions = [
        f"Apa yang membuat kamu merasa {tipe_emosi.lower()} di {sumber_emosi}?",
        f"Apa yang bisa menyebabkan perasaan {tipe_emosi.lower()} kamu di {sumber_emosi}?",
        f"Bagaimana situasi di {sumber_emosi} mempengaruhi perasaan kamu yang {tipe_emosi.lower()}?",
        f"Apa yang mempengaruhi perasaan {tipe_emosi.lower()} kamu di {sumber_emosi}?"
    ]
   
# Menyesuaikan pertanyaan untuk tipe emosi tertentu
    if tipe_emosi == "Kecewa":
        questions.append(random.choice([
            f"Bagaimana kamu bisa mengatasi rasa kecewa setelah situasi yang tidak sesuai harapan di {sumber_emosi}?",
            f"Apa yang seharusnya bisa diubah untuk menghindari perasaan kecewa di {sumber_emosi}?"
        ]))
    elif tipe_emosi == "Frustrasi":
        questions.append(random.choice([
            f"Bagaimana kamu mengatasi rasa frustrasi saat mengalami hambatan di {sumber_emosi}?",
            f"Ketika merasa frustrasi di {sumber_emosi}, apa yang bisa kamu lakukan untuk mengurangi perasaan itu?"
        ]))
    elif tipe_emosi == "Bingung":
        questions.append(random.choice([
            f"Jika kamu merasa bingung tentang situasi di {sumber_emosi}, apa yang kamu lakukan untuk mencari kejelasan?",
            f"Bagaimana kamu bisa mengatasi kebingungan di {sumber_emosi} agar bisa mengambil keputusan dengan lebih baik?"
        ]))
    elif tipe_emosi == "Bahagia":
        questions.append(random.choice([
            f"Ketika kamu merasa bahagia di {sumber_emosi}, apa yang ingin kamu lakukan untuk membagikan kebahagiaan itu?",
            f"Apa yang membuat kamu merasa bahagia di {sumber_emosi}, dan bagaimana kamu bisa menjaga perasaan itu?"
        ]))
    elif tipe_emosi == "Cemas":
        questions.append(random.choice([
            f"Apa yang membuat kamu merasa cemas saat berada di {sumber_emosi}, dan bagaimana kamu menghadapinya?",
            f"Bagaimana cara kamu mengurangi kecemasan saat menghadapi tugas atau ujian di {sumber_emosi}?"
        ]))
    elif tipe_emosi == "Marah":
        questions.append(random.choice([
            f"Ketika marah di {sumber_emosi}, bagaimana kamu bisa mengontrol perasaan itu agar tidak merugikan diri sendiri?",
            f"Apa yang bisa kamu lakukan untuk meredakan rasa marah saat situasi di {sumber_emosi} membuatmu marah?"
        ]))
    elif tipe_emosi == "Kesal":
        questions.append(random.choice([
            f"Jika merasa kesal di {sumber_emosi}, apa cara terbaik yang kamu lakukan untuk meredakan perasaan itu?",
            f"Bagaimana kamu mengelola rasa kesal saat situasi tidak berjalan sesuai yang diharapkan di {sumber_emosi}?"
        ]))
    elif tipe_emosi == "Sedih":
        questions.append(random.choice([
            f"Apa yang membuat kamu merasa sedih di {sumber_emosi}, dan bagaimana cara kamu menghadapinya?",
            f"Bagaimana kamu bisa mengatasi perasaan sedih di {sumber_emosi} agar tidak mempengaruhi keseharianmu?"
        ]))
    elif tipe_emosi == "Tertarik":
        questions.append(random.choice([
            f"Ketika kamu merasa tertarik dengan sesuatu di {sumber_emosi}, bagaimana kamu bisa mengeksplorasi lebih lanjut minat tersebut?",
            f"Apa yang membuat kamu merasa tertarik di {sumber_emosi}, dan bagaimana kamu bisa memanfaatkannya untuk perkembangan diri?"
        ]))
    elif tipe_emosi == "Optimis":
        questions.append(random.choice([
            f"Bagaimana kamu bisa mempertahankan perasaan optimis saat menghadapi tantangan di {sumber_emosi}?",
            f"Apa yang membuat kamu merasa optimis di {sumber_emosi}, dan bagaimana kamu menjaga pandangan positif tersebut?"
        ]))
    elif tipe_emosi == "Tenang":
        questions.append(random.choice([
            f"Apa yang bisa kamu lakukan untuk tetap tenang saat dihadapkan pada situasi yang menegangkan di {sumber_emosi}?",
            f"Bagaimana cara kamu mempertahankan ketenangan ketika banyak hal yang harus diselesaikan di {sumber_emosi}?"
        ]))
    elif tipe_emosi == "Gembira":
        questions.append(random.choice([
            f"Apa yang membuat kamu merasa gembira di {sumber_emosi}, dan bagaimana kamu bisa membagikan kebahagiaan itu?",
            f"Bagaimana perasaan gembira kamu di {sumber_emosi} bisa menginspirasi orang lain?"
        ]))
    elif tipe_emosi == "Puas":
        questions.append(random.choice([
            f"Ketika merasa puas dengan pencapaian di {sumber_emosi}, bagaimana kamu bisa merayakannya?",
            f"Apa yang kamu lakukan untuk mempertahankan rasa puas setelah menyelesaikan tugas di {sumber_emosi}?"
        ]))
    elif tipe_emosi == "Nyaman":
        questions.append(random.choice([
            f"Apa yang membuat kamu merasa nyaman di {sumber_emosi}, dan bagaimana kamu bisa menjaga kenyamanan itu?",
            f"Ketika merasa nyaman di {sumber_emosi}, apa langkah-langkah yang kamu ambil untuk mempertahankan suasana tersebut?"
        ]))
    elif tipe_emosi == "Bergairah":
        questions.append(random.choice([
            f"Bagaimana kamu bisa memanfaatkan perasaan bergairah di {sumber_emosi} untuk mencapai tujuan yang lebih besar?",
            f"Apa yang membuat kamu merasa bergairah di {sumber_emosi}, dan bagaimana kamu bisa menyalurkan semangat itu ke hal positif?"
        ]))
    elif tipe_emosi == "Aneh":
        questions.append(random.choice([
            f"Apa yang membuat kamu merasa aneh di {sumber_emosi}, dan bagaimana kamu bisa menerima perasaan tersebut?",
            f"Bagaimana kamu menghadapi perasaan aneh di {sumber_emosi} agar tidak mengganggu keseharianmu?"
        ]))
    elif tipe_emosi == "Euforis":
        questions.append(random.choice([
            f"Ketika kamu merasa euforis di {sumber_emosi}, bagaimana kamu bisa menikmati perasaan itu dengan bijaksana?",
            f"Apa yang membuat kamu merasa euforis di {sumber_emosi}, dan bagaimana kamu bisa tetap menjaga keseimbangan emosional?"
        ]))
    elif tipe_emosi == "Tertantang":
        questions.append(random.choice([
            f"Bagaimana kamu bisa memanfaatkan rasa tertantang di {sumber_emosi} untuk mengembangkan dirimu lebih jauh?",
            f"Apa yang membuat kamu merasa tertantang di {sumber_emosi}, dan bagaimana kamu bisa menghadapinya dengan lebih percaya diri?"
        ]))
    elif tipe_emosi == "Penuh Harapan":
        questions.append(random.choice([
            f"Ketika merasa penuh harapan di {sumber_emosi}, bagaimana kamu bisa membuat harapan itu menjadi kenyataan?",
            f"Apa yang bisa kamu lakukan untuk mempertahankan rasa penuh harapan di {sumber_emosi}?"
        ]))
    elif tipe_emosi == "Terinspirasi":
        questions.append(random.choice([
            f"Apa yang menginspirasi kamu di {sumber_emosi}, dan bagaimana kamu bisa menggunakan inspirasi itu untuk mencapai tujuan?",
            f"Ketika kamu merasa terinspirasi di {sumber_emosi}, bagaimana kamu bisa mengubah inspirasi itu menjadi tindakan konkret?"
        ]))
    elif tipe_emosi == "Panik":
        questions.append(random.choice([
            f"Apa yang menyebabkan kamu merasa panik di {sumber_emosi}, dan bagaimana kamu bisa menenangkan diri?",
            f"Bagaimana kamu bisa mengatasi rasa panik di {sumber_emosi} agar tidak mengganggu aktivitas lainnya?"
        ]))
    elif tipe_emosi == "Rindu":
        questions.append(random.choice([
            f"Apa yang kamu rindukan di {sumber_emosi}, dan bagaimana kamu bisa mengatasi rasa rindu itu?",
            f"Ketika merasa rindu di {sumber_emosi}, apa yang bisa kamu lakukan untuk meredakan perasaan tersebut?"
        ]))
    elif tipe_emosi == "Takut":
        questions.append(random.choice([
            f"Apa yang membuat kamu merasa takut di {sumber_emosi}, dan bagaimana cara kamu menghadapinya?",
            f"Bagaimana kamu bisa mengatasi ketakutan di {sumber_emosi} untuk tetap bergerak maju?"
        ]))
    elif tipe_emosi == "Senyum":
        questions.append(random.choice([
            f"Apa yang membuat kamu tersenyum di {sumber_emosi}, dan bagaimana kamu bisa menjaga senyuman itu?",
            f"Bagaimana kamu bisa membuat orang lain tersenyum saat berada di {sumber_emosi}?"
        ]))
    elif tipe_emosi == "Terharu":
        questions.append(random.choice([
            f"Apa yang membuat kamu terharu di {sumber_emosi}, dan bagaimana kamu bisa berbagi perasaan itu dengan orang lain?",
            f"Ketika kamu merasa terharu di {sumber_emosi}, bagaimana cara kamu mengekspresikan perasaan itu dengan tulus?"
        ]))
    elif tipe_emosi == "Bersyukur":
        question = random.choice([
            f"Apa yang membuat kamu merasa bersyukur di {sumber_emosi}, dan bagaimana kamu bisa menunjukkan rasa terima kasih itu?",
            f"Bagaimana cara kamu meningkatkan rasa bersyukur dalam kehidupan sehari-hari di {sumber_emosi}?"
        ])
        questions.append(question)
    elif tipe_emosi == "Terkejut":
        question = random.choice([
            f"Apa yang membuat kamu merasa terkejut di {sumber_emosi}, dan bagaimana kamu bisa merespons perasaan tersebut dengan tenang?",
            f"Bagaimana kamu bisa mengatasi perasaan terkejut di {sumber_emosi} agar tidak mengganggu tindakan selanjutnya?"
        ])
        questions.append(question)
    elif tipe_emosi == "Gugup":
        question = random.choice([
            f"Ketika kamu merasa gugup di {sumber_emosi}, apa yang bisa kamu lakukan untuk mengendalikan perasaan tersebut?",
            f"Apa yang membuat kamu merasa gugup di {sumber_emosi}, dan bagaimana cara kamu mengatasi kecemasan itu dengan lebih baik?"
        ])
        questions.append(question)
    elif tipe_emosi == "Gemas":
        question = random.choice([
            f"Apa yang membuat kamu merasa gemas di {sumber_emosi}, dan bagaimana kamu bisa menyalurkan perasaan itu dengan cara yang positif?",
            f"Ketika merasa gemas di {sumber_emosi}, apa yang bisa kamu lakukan untuk tidak terbawa emosi negatif dari perasaan tersebut?"
        ])
        questions.append(question)
    elif tipe_emosi == "Terluka":
        question = random.choice([
            f"Apa yang membuat kamu merasa terluka di {sumber_emosi}, dan bagaimana kamu bisa sembuh dari perasaan itu?",
            f"Bagaimana kamu bisa mengatasi rasa terluka di {sumber_emosi} tanpa membiarkan perasaan itu menghalangi kemajuanmu?"
        ])
        questions.append(question)
    
    return questions

# Menghasilkan kombinasi Level_Emosi, Tipe_Emosi, dan Pertanyaan_Analisis
output = []
for level in data["Level_Emosi"]:
    for tipe in data["Tipe_Emosi"]:
        for sumber in data["sumber_emosi"]:  # Menggunakan loop untuk setiap sumber emosi
            pertanyaan_analisis = generate_questions(tipe, sumber)
            output.append({
                "Level_Emosi": level,
                "Tipe_Emosi": tipe,
                "Sumber_Emosi": sumber,
                "Pertanyaan_Analisis": pertanyaan_analisis
            })

# Menyimpan hasil ke dalam file JSON
output_file = 'models/ANN/generated_emotions_with_questions.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Data berhasil disimpan ke {output_file}")
