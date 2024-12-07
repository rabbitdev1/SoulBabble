import random
import csv
from itertools import combinations
import pandas as pd
import numpy as np

# Data input
emosi = ["sangat buruk", "buruk", "netral", "baik", "sangat baik"]
emosi_positif = ["antusias", "gembira", "bahagia", "takjub"]
emosi_negatif = ["marah", "takut", "stress", "kecewa"]
sumber = ["sekolah", "kantor", "keluarga"]

# Daftar rekomendasi berdasarkan kategori emosi dan sumber
rekomendasi_dict = {
    "positif": {
        "sekolah": [
            "Cobalah berbicara dengan teman-teman di sekolah untuk berbagi kebahagiaan.",
            "Bergabunglah dalam kegiatan ekstrakurikuler yang dapat membuatmu lebih antusias dan gembira.",
            "Luangkan waktu untuk menikmati hobi yang kamu suka setelah pelajaran atau di sela waktu luang.",
            "Jangan lupa untuk bersyukur atas hal-hal positif yang terjadi di kehidupan sekolahmu.",
            "Ajak teman-teman di sekolah untuk merayakan kebahagiaan bersama."
        ],
        "kantor": [
            "Berbicaralah dengan rekan kerja untuk berbagi kebahagiaan dan meningkatkan semangat di tempat kerja.",
            "Lakukan aktivitas fisik di sela waktu kantor untuk meningkatkan produktivitas dan semangat.",
            "Cobalah untuk menjaga suasana hati yang positif dengan memulai hari dengan kebahagiaan.",
            "Berkumpul dengan kolega setelah kerja untuk merayakan pencapaian kecil.",
            "Jangan lupa untuk bersyukur atas kesempatan dan pencapaian di tempat kerja."
        ],
        "keluarga": [
            "Bicarakan kebahagiaanmu dengan keluarga untuk berbagi kebahagiaan dan mempererat ikatan.",
            "Luangkan waktu bersama keluarga untuk melakukan aktivitas yang menyenangkan.",
            "Rayakan kebahagiaanmu dengan makan bersama keluarga.",
            "Bersyukurlah atas dukungan keluarga yang selalu ada.",
            "Berkumpul dengan keluarga untuk merayakan hal-hal positif yang terjadi dalam hidupmu."
        ]
    },
    "negatif": {
        "sekolah": [
            "Cobalah untuk berbicara dengan teman di sekolah untuk meredakan stres dan tekanan.",
            "Lakukan aktivitas fisik seperti olahraga ringan untuk mengurangi ketegangan di sekolah.",
            "Ambil waktu sejenak untuk diri sendiri di ruang yang tenang untuk menenangkan pikiran.",
            "Coba lakukan meditasi atau relaksasi di sela waktu istirahat sekolah untuk mengurangi stres.",
            "Jangan ragu untuk meminta dukungan dari teman atau guru untuk membantu meredakan tekanan."
        ],
        "kantor": [
            "Cobalah untuk berjalan-jalan sebentar di sekitar kantor untuk meredakan stres.",
            "Ambil waktu untuk diri sendiri dan lakukan hobi yang menyenangkan di luar jam kerja.",
            "Bicarakan masalah pekerjaan dengan atasan atau rekan kerja untuk mendapatkan solusi bersama.",
            "Coba lakukan meditasi atau teknik pernapasan di ruang kerja untuk menenangkan pikiran.",
            "Jangan ragu untuk meminta dukungan dari tim atau atasan jika merasa terbebani."
        ],
        "keluarga": [
            "Bicarakan masalah yang sedang kamu hadapi dengan anggota keluarga untuk mendapatkan perspektif yang berbeda.",
            "Luangkan waktu untuk refleksi diri dan berbicara dengan keluarga untuk mendapatkan dukungan moral.",
            "Jangan terburu-buru dalam membuat keputusan penting; diskusikan dengan keluarga agar lebih bijak.",
            "Cobalah untuk menjaga keseimbangan antara pekerjaan dan kehidupan keluarga.",
            "Jangan ragu untuk meminta dukungan dari keluarga jika merasa tertekan atau cemas."
        ]
    },
    "netral": {
        "sekolah": [
            "Ambil napas dalam-dalam dan fokus pada hal-hal positif yang dapat dibagikan dengan teman-teman di sekolah.",
            "Cobalah untuk berpikir jernih dan tidak terburu-buru dalam mengambil keputusan di sekolah.",
            "Luangkan waktu untuk perencanaan dan refleksi diri dalam kegiatan sekolah.",
            "Jangan terburu-buru dalam membuat keputusan penting di sekolah; pastikan keputusan yang diambil sudah matang.",
            "Cobalah untuk menjaga keseimbangan antara pelajaran dan waktu pribadi di sekolah."
        ],
        "kantor": [
            "Ambil napas dalam-dalam dan fokus pada tugas yang ada di kantor untuk meningkatkan produktivitas.",
            "Cobalah untuk berpikir jernih dalam menghadapi masalah di kantor dan jangan terburu-buru mengambil keputusan.",
            "Luangkan waktu untuk merencanakan tugas-tugas kantor dan prioritaskan pekerjaan penting.",
            "Jangan terburu-buru dalam membuat keputusan penting di kantor; pastikan keputusan tersebut tepat.",
            "Cobalah menjaga keseimbangan antara waktu kerja dan istirahat agar tetap produktif dan seimbang."
        ],
        "keluarga": [
            "Ambil napas dalam-dalam dan fokus pada hal-hal positif yang bisa dibicarakan dengan keluarga.",
            "Cobalah untuk berpikir jernih dan tidak terburu-buru dalam mengambil keputusan yang melibatkan keluarga.",
            "Luangkan waktu untuk refleksi diri dan perencanaan bersama keluarga.",
            "Jangan terburu-buru dalam membuat keputusan penting terkait keluarga, diskusikan dengan anggota keluarga lainnya.",
            "Cobalah untuk menjaga keseimbangan antara pekerjaan dan kehidupan keluarga agar keduanya tetap terjaga."
        ]
    }
}

# Fungsi untuk menghasilkan kombinasi positif dan negatif
def get_combinations(values):
    return [list(comb) for r in range(len(values)+1) for comb in combinations(values, r)]

# Fungsi untuk membuat dataset
def create_dataset():
    dataset = []

    emosi_pos_combinations = get_combinations(emosi_positif)
    emosi_neg_combinations = get_combinations(emosi_negatif)

    for emosi_item in emosi:
        for sumber_item in sumber:
            if emosi_item in ["baik", "sangat baik"]:
                emosi_pos_values = emosi_pos_combinations
                emosi_neg_values = get_combinations(emosi_negatif)
                rekomendasi = random.choice(rekomendasi_dict["positif"][sumber_item])
            elif emosi_item in ["buruk", "sangat buruk"]:
                emosi_pos_values = get_combinations(emosi_positif)
                emosi_neg_values = emosi_neg_combinations
                rekomendasi = random.choice(rekomendasi_dict["negatif"][sumber_item])
            else:
                emosi_pos_values = get_combinations(emosi_positif)
                emosi_neg_values = get_combinations(emosi_negatif)
                rekomendasi = random.choice(rekomendasi_dict["netral"][sumber_item])

            for pos_comb in emosi_pos_values:
                for neg_comb in emosi_neg_values:
                    data = {
                        "emosi": emosi_item,
                        "emosi_positif": pos_comb,
                        "emosi_negatif": neg_comb,
                        "sumber": sumber_item,
                        "rekomendasi": rekomendasi
                    }
                    dataset.append(data)

    return dataset

# Membuat dataset
dataset = create_dataset()

# Menyimpan dataset dalam format CSV
with open('models/dataset.csv', 'w', newline='', encoding='utf-8') as csv_file:
    fieldnames = ["emosi", "emosi_positif", "emosi_negatif", "sumber", "rekomendasi"]
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

    writer.writeheader()
    for data in dataset:
        writer.writerow(data)

# Menampilkan konfirmasi
print("Dataset telah disimpan di 'models/dataset.csv'")