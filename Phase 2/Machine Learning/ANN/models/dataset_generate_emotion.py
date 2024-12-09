import json

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
        questions.append(f"Bagaimana kamu bisa mengatasi rasa kecewa setelah situasi yang tidak sesuai harapan di {sumber_emosi}?")
        questions.append(f"Apa yang seharusnya bisa diubah untuk menghindari perasaan kecewa di {sumber_emosi}?")
    elif tipe_emosi == "Frustrasi":
        questions.append(f"Bagaimana kamu mengatasi rasa frustrasi saat mengalami hambatan di {sumber_emosi}?")
        questions.append(f"Ketika merasa frustrasi di {sumber_emosi}, apa yang bisa kamu lakukan untuk mengurangi perasaan itu?")
    elif tipe_emosi == "Bingung":
        questions.append(f"Jika kamu merasa bingung tentang situasi di {sumber_emosi}, apa yang kamu lakukan untuk mencari kejelasan?")
        questions.append(f"Bagaimana kamu bisa mengatasi kebingungan di {sumber_emosi} agar bisa mengambil keputusan dengan lebih baik?")
    elif tipe_emosi == "Bahagia":
        questions.append(f"Ketika kamu merasa bahagia di {sumber_emosi}, apa yang ingin kamu lakukan untuk membagikan kebahagiaan itu?")
        questions.append(f"Apa yang membuat kamu merasa bahagia di {sumber_emosi}, dan bagaimana kamu bisa menjaga perasaan itu?")
    elif tipe_emosi == "Cemas":
        questions.append(f"Apa yang membuat kamu merasa cemas saat berada di {sumber_emosi}, dan bagaimana kamu menghadapinya?")
        questions.append(f"Bagaimana cara kamu mengurangi kecemasan saat menghadapi tugas atau ujian di {sumber_emosi}?")
    elif tipe_emosi == "Marah":
        questions.append(f"Ketika marah di {sumber_emosi}, bagaimana kamu bisa mengontrol perasaan itu agar tidak merugikan diri sendiri?")
        questions.append(f"Apa yang bisa kamu lakukan untuk meredakan rasa marah saat situasi di {sumber_emosi} membuatmu kesal?")
    elif tipe_emosi == "Kesal":
        questions.append(f"Jika merasa kesal di {sumber_emosi}, apa cara terbaik yang kamu lakukan untuk meredakan perasaan itu?")
        questions.append(f"Bagaimana kamu mengelola rasa kesal saat situasi tidak berjalan sesuai yang diharapkan di {sumber_emosi}?")
    elif tipe_emosi == "Sedih":
        questions.append(f"Apa yang membuat kamu merasa sedih di {sumber_emosi}, dan bagaimana cara kamu menghadapinya?")
        questions.append(f"Bagaimana kamu bisa mengatasi perasaan sedih di {sumber_emosi} agar tidak mempengaruhi keseharianmu?")
    elif tipe_emosi == "Tertarik":
        questions.append(f"Ketika kamu merasa tertarik dengan sesuatu di {sumber_emosi}, bagaimana kamu bisa mengeksplorasi lebih lanjut minat tersebut?")
        questions.append(f"Apa yang membuat kamu merasa tertarik di {sumber_emosi}, dan bagaimana kamu bisa memanfaatkannya untuk perkembangan diri?")
    elif tipe_emosi == "Optimis":
        questions.append(f"Bagaimana kamu bisa mempertahankan perasaan optimis saat menghadapi tantangan di {sumber_emosi}?")
        questions.append(f"Apa yang membuat kamu merasa optimis di {sumber_emosi}, dan bagaimana kamu menjaga pandangan positif tersebut?")
    elif tipe_emosi == "Tenang":
        questions.append(f"Apa yang bisa kamu lakukan untuk tetap tenang saat dihadapkan pada situasi yang menegangkan di {sumber_emosi}?")
        questions.append(f"Bagaimana cara kamu mempertahankan ketenangan ketika banyak hal yang harus diselesaikan di {sumber_emosi}?")
    elif tipe_emosi == "Gembira":
        questions.append(f"Apa yang membuat kamu merasa gembira di {sumber_emosi}, dan bagaimana kamu bisa membagikan kebahagiaan itu?")
        questions.append(f"Bagaimana perasaan gembira kamu di {sumber_emosi} bisa menginspirasi orang lain?")
    elif tipe_emosi == "Puas":
        questions.append(f"Ketika merasa puas dengan pencapaian di {sumber_emosi}, bagaimana kamu bisa merayakannya?")
        questions.append(f"Apa yang kamu lakukan untuk mempertahankan rasa puas setelah menyelesaikan tugas di {sumber_emosi}?")
    elif tipe_emosi == "Nyaman":
        questions.append(f"Apa yang membuat kamu merasa nyaman di {sumber_emosi}, dan bagaimana kamu bisa menjaga kenyamanan itu?")
        questions.append(f"Ketika merasa nyaman di {sumber_emosi}, apa langkah-langkah yang kamu ambil untuk mempertahankan suasana tersebut?")
    elif tipe_emosi == "Bergairah":
        questions.append(f"Bagaimana kamu bisa memanfaatkan perasaan bergairah di {sumber_emosi} untuk mencapai tujuan yang lebih besar?")
        questions.append(f"Apa yang membuat kamu merasa bergairah di {sumber_emosi}, dan bagaimana kamu bisa menyalurkan semangat itu ke hal positif?")
    elif tipe_emosi == "Aneh":
        questions.append(f"Apa yang membuat kamu merasa aneh di {sumber_emosi}, dan bagaimana kamu bisa menerima perasaan tersebut?")
        questions.append(f"Bagaimana kamu menghadapi perasaan aneh di {sumber_emosi} agar tidak mengganggu keseharianmu?")
    elif tipe_emosi == "Euforis":
        questions.append(f"Ketika kamu merasa euforis di {sumber_emosi}, bagaimana kamu bisa menikmati perasaan itu dengan bijaksana?")
        questions.append(f"Apa yang membuat kamu merasa euforis di {sumber_emosi}, dan bagaimana kamu bisa tetap menjaga keseimbangan emosional?")
    elif tipe_emosi == "Tertantang":
        questions.append(f"Bagaimana kamu bisa memanfaatkan rasa tertantang di {sumber_emosi} untuk mengembangkan dirimu lebih jauh?")
        questions.append(f"Apa yang membuat kamu merasa tertantang di {sumber_emosi}, dan bagaimana kamu bisa menghadapinya dengan lebih percaya diri?")
    elif tipe_emosi == "Penuh Harapan":
        questions.append(f"Ketika merasa penuh harapan di {sumber_emosi}, bagaimana kamu bisa membuat harapan itu menjadi kenyataan?")
        questions.append(f"Apa yang bisa kamu lakukan untuk mempertahankan rasa penuh harapan di {sumber_emosi}?")
    elif tipe_emosi == "Terinspirasi":
        questions.append(f"Apa yang menginspirasi kamu di {sumber_emosi}, dan bagaimana kamu bisa menggunakan inspirasi itu untuk mencapai tujuan?")
        questions.append(f"Ketika kamu merasa terinspirasi di {sumber_emosi}, bagaimana kamu bisa mengubah inspirasi itu menjadi tindakan konkret?")
    elif tipe_emosi == "Panik":
        questions.append(f"Apa yang menyebabkan kamu merasa panik di {sumber_emosi}, dan bagaimana kamu bisa menenangkan diri?")
        questions.append(f"Bagaimana kamu bisa mengatasi rasa panik di {sumber_emosi} agar tidak mengganggu aktivitas lainnya?")
    elif tipe_emosi == "Rindu":
        questions.append(f"Apa yang kamu rindukan di {sumber_emosi}, dan bagaimana kamu bisa mengatasi rasa rindu itu?")
        questions.append(f"Ketika merasa rindu di {sumber_emosi}, apa yang bisa kamu lakukan untuk meredakan perasaan tersebut?")
    elif tipe_emosi == "Takut":
        questions.append(f"Apa yang membuat kamu merasa takut di {sumber_emosi}, dan bagaimana cara kamu menghadapinya?")
        questions.append(f"Bagaimana kamu bisa mengatasi ketakutan di {sumber_emosi} untuk tetap bergerak maju?")
    elif tipe_emosi == "Senyum":
        questions.append(f"Apa yang membuat kamu tersenyum di {sumber_emosi}, dan bagaimana kamu bisa menjaga senyuman itu?")
        questions.append(f"Bagaimana kamu bisa membuat orang lain tersenyum saat berada di {sumber_emosi}?")
    elif tipe_emosi == "Terharu":
        questions.append(f"Apa yang membuat kamu terharu di {sumber_emosi}, dan bagaimana kamu bisa berbagi perasaan itu dengan orang lain?")
        questions.append(f"Ketika kamu merasa terharu di {sumber_emosi}, bagaimana cara kamu mengekspresikan perasaan itu dengan tulus?")
    elif tipe_emosi == "Bersyukur":
        questions.append(f"Apa yang membuat kamu merasa bersyukur di {sumber_emosi}, dan bagaimana kamu bisa menunjukkan rasa terima kasih itu?")
        questions.append(f"Bagaimana cara kamu meningkatkan rasa bersyukur dalam kehidupan sehari-hari di {sumber_emosi}?")
    
    return questions

# Menghasilkan kombinasi Level_Emosi, Tipe_Emosi, dan Pertanyaan_Analisis
output = []
for level in data["Level_Emosi"]:
    for tipe in data["Tipe_Emosi"]:
        pertanyaan_analisis = generate_questions(tipe, data["Sumber_Emosi"])
        output.append({
            "Level_Emosi": level,
            "Tipe_Emosi": tipe,
            "Sumber_Emosi": data["Sumber_Emosi"],
            "Pertanyaan_Analisis": pertanyaan_analisis
        })

# Menyimpan hasil ke dalam file JSON
output_file = 'app/models/generated_emotions_with_questions.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Data berhasil disimpan ke {output_file}")
