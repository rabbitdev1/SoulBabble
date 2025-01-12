import json
import random
import os

# Data input yang telah diperbarui dengan fokus pada latar tempat
data = {
    "Level_Emosi": ["Sangat Buruk", "Buruk", "Netral", "Baik", "Sangat Baik"],
    "sumber_emosi": [
        "Sekolah",
        "Rumah",
        "Kantor",
        "Kampus",
        "Taman",
        "Kafe",
        "Gym",
        "Museum",
        "Pantai",
        "Perpustakaan",
        "Pertemuan",
        "Restoran",
        "Transportasi Umum",
        "Tempat Ibadah",
        "Pasar",
        "Event",
        "Lokasi Olahraga",
        "Studio Seni",
        "Kantor Pemerintah",
        "Kegiatan Sosial",
        "Bandara",
        "Stadion",
        "Pusat Perbelanjaan",
        "Bioskop",
        "Hotel",
        "Kantor Pos",
        "Pelabuhan",
        "Pabrik",
        "Gedung Serbaguna",
        "Stasiun Kereta",
        "Gedung Pertunjukan",
        "Balai Kota",
        "Terminal Bus",
        "Rumah Sakit",
        "Apotek",
        "Gudang",
        "Arena Konser",
        "Kuil",
        "Hutan",
        "Desa",
        "Perkebunan",
        "Pulau",
        "Bukit",
        "Danau",
        "Sungai",
        "Taman Nasional",
        "Zona Industri",
        "Pusat Kebugaran",
        "Kedai Buku",
        "Galeri Seni",
        "Pusat Teknologi",
        "Laboratorium",
        "Pusat Komunitas",
        "Tempat Parkir",
        "Lapangan Terbuka",
        "Arena Skate",
        "Pusat Konferensi",
        "Kios",
        "Warung",
        "Kantor Cabang",
        "Studio Musik",
        "Taman Bermain",
        "Pusat Kebudayaan"
    ],
    "Tipe_Emosi": [
        "Kecewa", "Frustrasi", "Bingung", "Bahagia", "Cemas", "Marah", "Kesal", "Sedih",
        "Tertarik", "Optimis", "Tenang", "Gembira", "Puas", "Nyaman", "Bergairah", "Aneh",
        "Euforis", "Tertantang", "Penuh Harapan", "Terinspirasi", "Panik", "Rindu", "Takut",
        "Senyum", "Terharu", "Bersyukur", "Malu", "Tersenyum", "Terkejut", "Gugup", "Gemas", "Terluka",
    ] 
}

# Dictionary untuk pertanyaan berdasarkan Tipe_Emosi
tipe_emosi_questions = {
    "Kecewa": [
        "Bagaimana kamu bisa mengatasi rasa kecewa setelah situasi yang tidak sesuai harapan di {sumber_emosi}?",
        "Apa yang seharusnya bisa diubah untuk menghindari perasaan kecewa di {sumber_emosi}?"
    ],
    "Frustrasi": [
        "Bagaimana kamu mengatasi rasa frustrasi saat mengalami hambatan di {sumber_emosi}?",
        "Ketika merasa frustrasi di {sumber_emosi}, apa yang bisa kamu lakukan untuk mengurangi perasaan itu?"
    ],
    "Bingung": [
        "Jika kamu merasa bingung tentang situasi di {sumber_emosi}, apa yang kamu lakukan untuk mencari kejelasan?",
        "Bagaimana kamu bisa mengatasi kebingungan di {sumber_emosi} agar bisa mengambil keputusan dengan lebih baik?"
    ],
    "Bahagia": [
        "Ketika kamu merasa bahagia di {sumber_emosi}, apa yang ingin kamu lakukan untuk membagikan kebahagiaan itu?",
        "Apa yang membuat kamu merasa bahagia di {sumber_emosi}, dan bagaimana kamu bisa menjaga perasaan itu?"
    ],
    "Cemas": [
        "Apa yang membuat kamu merasa cemas saat berada di {sumber_emosi}, dan bagaimana kamu menghadapinya?",
        "Bagaimana cara kamu mengurangi kecemasan saat menghadapi tugas atau ujian di {sumber_emosi}?"
    ],
    "Marah": [
        "Ketika marah di {sumber_emosi}, bagaimana kamu bisa mengontrol perasaan itu agar tidak merugikan diri sendiri?",
        "Apa yang bisa kamu lakukan untuk meredakan rasa marah saat situasi di {sumber_emosi} membuatmu marah?"
    ],
    "Kesal": [
        "Jika merasa kesal di {sumber_emosi}, apa cara terbaik yang kamu lakukan untuk meredakan perasaan itu?",
        "Bagaimana kamu mengelola rasa kesal saat situasi tidak berjalan sesuai yang diharapkan di {sumber_emosi}?"
    ],
    "Sedih": [
        "Apa yang membuat kamu merasa sedih di {sumber_emosi}, dan bagaimana cara kamu menghadapinya?",
        "Bagaimana kamu bisa mengatasi perasaan sedih di {sumber_emosi} agar tidak mempengaruhi keseharianmu?"
    ],
    "Tertarik": [
        "Ketika kamu merasa tertarik dengan sesuatu di {sumber_emosi}, bagaimana kamu bisa mengeksplorasi lebih lanjut minat tersebut?",
        "Apa yang membuat kamu merasa tertarik di {sumber_emosi}, dan bagaimana kamu bisa memanfaatkannya untuk perkembangan diri?"
    ],
    "Optimis": [
        "Bagaimana kamu bisa mempertahankan perasaan optimis saat menghadapi tantangan di {sumber_emosi}?",
        "Apa yang membuat kamu merasa optimis di {sumber_emosi}, dan bagaimana kamu menjaga pandangan positif tersebut?"
    ],
    "Tenang": [
        "Apa yang bisa kamu lakukan untuk tetap tenang saat dihadapkan pada situasi yang menegangkan di {sumber_emosi}?",
        "Bagaimana cara kamu mempertahankan ketenangan ketika banyak hal yang harus diselesaikan di {sumber_emosi}?"
    ],
    "Gembira": [
        "Apa yang membuat kamu merasa gembira di {sumber_emosi}, dan bagaimana kamu bisa membagikan kebahagiaan itu?",
        "Bagaimana perasaan gembira kamu di {sumber_emosi} bisa menginspirasi orang lain?"
    ],
    "Puas": [
        "Ketika merasa puas dengan pencapaian di {sumber_emosi}, bagaimana kamu bisa merayakannya?",
        "Apa yang kamu lakukan untuk mempertahankan rasa puas setelah menyelesaikan tugas di {sumber_emosi}?"
    ],
    "Nyaman": [
        "Apa yang membuat kamu merasa nyaman di {sumber_emosi}, dan bagaimana kamu bisa menjaga kenyamanan itu?",
        "Ketika merasa nyaman di {sumber_emosi}, apa langkah-langkah yang kamu ambil untuk mempertahankan suasana tersebut?"
    ],
    "Bergairah": [
        "Bagaimana kamu bisa memanfaatkan perasaan bergairah di {sumber_emosi} untuk mencapai tujuan yang lebih besar?",
        "Apa yang membuat kamu merasa bergairah di {sumber_emosi}, dan bagaimana kamu bisa menyalurkan semangat itu ke hal positif?"
    ],
    "Aneh": [
        "Apa yang membuat kamu merasa aneh di {sumber_emosi}, dan bagaimana kamu bisa menerima perasaan tersebut?",
        "Bagaimana kamu menghadapi perasaan aneh di {sumber_emosi} agar tidak mengganggu keseharianmu?"
    ],
    "Euforis": [
        "Ketika kamu merasa euforis di {sumber_emosi}, bagaimana kamu bisa menikmati perasaan itu dengan bijaksana?",
        "Apa yang membuat kamu merasa euforis di {sumber_emosi}, dan bagaimana kamu bisa tetap menjaga keseimbangan emosional?"
    ],
    "Tertantang": [
        "Bagaimana kamu bisa memanfaatkan rasa tertantang di {sumber_emosi} untuk mengembangkan dirimu lebih jauh?",
        "Apa yang membuat kamu merasa tertantang di {sumber_emosi}, dan bagaimana kamu bisa menghadapinya dengan lebih percaya diri?"
    ],
    "Penuh Harapan": [
        "Ketika merasa penuh harapan di {sumber_emosi}, bagaimana kamu bisa membuat harapan itu menjadi kenyataan?",
        "Apa yang bisa kamu lakukan untuk mempertahankan rasa penuh harapan di {sumber_emosi}?"
    ],
    "Terinspirasi": [
        "Apa yang menginspirasi kamu di {sumber_emosi}, dan bagaimana kamu bisa menggunakan inspirasi itu untuk mencapai tujuan?",
        "Ketika kamu merasa terinspirasi di {sumber_emosi}, bagaimana kamu bisa mengubah inspirasi itu menjadi tindakan konkret?"
    ],
    "Panik": [
        "Apa yang menyebabkan kamu merasa panik di {sumber_emosi}, dan bagaimana kamu bisa menenangkan diri?",
        "Bagaimana kamu bisa mengatasi rasa panik di {sumber_emosi} agar tidak mengganggu aktivitas lainnya?"
    ],
    "Rindu": [
        "Apa yang kamu rindukan di {sumber_emosi}, dan bagaimana kamu bisa mengatasi rasa rindu itu?",
        "Ketika merasa rindu di {sumber_emosi}, apa yang bisa kamu lakukan untuk meredakan perasaan tersebut?"
    ],
    "Takut": [
        "Apa yang membuat kamu merasa takut di {sumber_emosi}, dan bagaimana cara kamu menghadapinya?",
        "Bagaimana kamu bisa mengatasi ketakutan di {sumber_emosi} untuk tetap bergerak maju?"
    ],
    "Senyum": [
        "Apa yang membuat kamu tersenyum di {sumber_emosi}, dan bagaimana kamu bisa menjaga senyuman itu?",
        "Bagaimana kamu bisa membuat orang lain tersenyum saat berada di {sumber_emosi}?"
    ],
    "Terharu": [
        "Apa yang membuat kamu terharu di {sumber_emosi}, dan bagaimana kamu bisa berbagi perasaan itu dengan orang lain?",
        "Ketika kamu merasa terharu di {sumber_emosi}, bagaimana cara kamu mengekspresikan perasaan itu dengan tulus?"
    ],
    "Bersyukur": [
        "Apa yang membuat kamu merasa bersyukur di {sumber_emosi}, dan bagaimana kamu bisa menunjukkan rasa terima kasih itu?",
        "Bagaimana cara kamu meningkatkan rasa bersyukur dalam kehidupan sehari-hari di {sumber_emosi}?"
    ],
    "Terkejut": [
        "Apa yang membuat kamu merasa terkejut di {sumber_emosi}, dan bagaimana kamu bisa merespons perasaan tersebut dengan tenang?",
        "Bagaimana kamu bisa mengatasi perasaan terkejut di {sumber_emosi} agar tidak mengganggu tindakan selanjutnya?"
    ],
    "Gugup": [
        "Ketika kamu merasa gugup di {sumber_emosi}, apa yang bisa kamu lakukan untuk mengendalikan perasaan tersebut?",
        "Apa yang membuat kamu merasa gugup di {sumber_emosi}, dan bagaimana cara kamu mengatasi kecemasan itu dengan lebih baik?"
    ],
    "Gemas": [
        "Apa yang membuat kamu merasa gemas di {sumber_emosi}, dan bagaimana kamu bisa menyalurkan perasaan itu dengan cara yang positif?",
        "Ketika merasa gemas di {sumber_emosi}, apa yang bisa kamu lakukan untuk tidak terbawa emosi negatif dari perasaan tersebut?"
    ],
    "Terluka": [
        "Apa yang membuat kamu merasa terluka di {sumber_emosi}, dan bagaimana kamu bisa sembuh dari perasaan itu?",
        "Bagaimana kamu bisa mengatasi rasa terluka di {sumber_emosi} tanpa membiarkan perasaan itu menghalangi kemajuanmu?"
    ],
    "Malu": [
        "Apa yang membuat kamu merasa malu di {sumber_emosi}, dan bagaimana kamu bisa mengatasi perasaan itu?",
        "Bagaimana kamu bisa mengurangi rasa malu di {sumber_emosi} agar tidak menghambat interaksi sosialmu?"
    ],
    "Tersenyum": [
        "Apa yang membuat kamu merasa tersenyum di {sumber_emosi}, dan bagaimana kamu bisa menjaga senyuman itu?",
        "Bagaimana kamu bisa membuat orang lain tersenyum saat berada di {sumber_emosi}?"
    ],
}

# Pastikan direktori output ada
os.makedirs('models/ANN/', exist_ok=True)

# Fungsi untuk menghasilkan pertanyaan analisis berdasarkan Level_Emosi dan Tipe_Emosi
def generate_questions(level_emosi, tipe_emosi, sumber_emosi):
    questions = [
        f"Apa yang membuat kamu merasa {tipe_emosi.lower()} di {sumber_emosi}?",
        f"Apa yang bisa menyebabkan perasaan {tipe_emosi.lower()} kamu di {sumber_emosi}?",
        f"Bagaimana situasi di {sumber_emosi} mempengaruhi perasaan kamu yang {tipe_emosi.lower()}?",
    ]

    # Menyesuaikan pertanyaan berdasarkan Level_Emosi
    if level_emosi in ["Sangat Buruk", "Buruk"]:
        questions.append(random.choice([
            f"Bagaimana perasaan {level_emosi.lower()} ini mempengaruhi keseharianmu di {sumber_emosi}?",
            f"Apa langkah yang dapat kamu ambil untuk memperbaiki perasaan {level_emosi.lower()} di {sumber_emosi}?"
        ]))
    elif level_emosi in ["Baik", "Sangat Baik"]:
        questions.append(random.choice([
            f"Apa yang membuat kamu merasa {level_emosi.lower()} di {sumber_emosi}, dan bagaimana kamu bisa mempertahankannya?",
            f"Bagaimana perasaan {level_emosi.lower()} ini memotivasi kamu di {sumber_emosi}?"
        ]))
    elif level_emosi == "Netral":
        questions.append(random.choice([
            f"Apa yang bisa meningkatkan atau menurunkan perasaan netral kamu di {sumber_emosi}?",
            f"Bagaimana kamu bisa mengubah perasaan netral di {sumber_emosi} menjadi lebih positif atau negatif?"
        ]))

    # Menambahkan pertanyaan berdasarkan Tipe_Emosi dari dictionary
    if tipe_emosi in tipe_emosi_questions:
        pertanyaan = random.choice(tipe_emosi_questions[tipe_emosi])
        questions.append(pertanyaan.format(sumber_emosi=sumber_emosi))
    else:
        # Jika Tipe_Emosi tidak ada di dictionary, tambahkan pertanyaan default
        questions.append(f"Bagaimana kamu mengelola perasaan {tipe_emosi.lower()} di {sumber_emosi}?")

    return questions

# Menghasilkan kombinasi Level_Emosi, Tipe_Emosi, dan Sumber_Emosi serta Pertanyaan_Analisis
output = []
for level in data["Level_Emosi"]:
    for tipe in data["Tipe_Emosi"]:
        for sumber in data["sumber_emosi"]:
            pertanyaan_analisis = generate_questions(level, tipe, sumber)
            output.append({
                "Level_Emosi": level,
                "Tipe_Emosi": tipe,
                "Sumber_Emosi": sumber,
                "Pertanyaan_Analisis": pertanyaan_analisis
            })

# Menyimpan hasil ke dalam file JSON
output_file = 'models/ANN/data_set.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Data berhasil disimpan ke {output_file}")
