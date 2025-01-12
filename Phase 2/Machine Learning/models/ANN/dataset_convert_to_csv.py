import json
import csv
import random
from tabulate import tabulate  # Pastikan Anda telah menginstalnya
import os

# Fungsi untuk mengonversi JSON ke CSV dan menampilkan tabel
def json_to_csv(json_file, csv_file, display_limit=5):
    # Cek apakah file JSON ada
    if not os.path.exists(json_file):
        print(f"File JSON tidak ditemukan: {json_file}")
        return

    # Membuka dan membaca data JSON dari file
    with open(json_file, 'r', encoding='utf-8') as file:
        data_json = json.load(file)
    print(f"Data JSON berhasil dibaca dari {json_file}")

    # Menyiapkan data untuk tabel
    tabel_data = []

    # Membuka file CSV untuk menulis
    with open(csv_file, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        
        # Menulis header CSV
        writer.writerow(["Level_Emosi", "Tipe_Emosi", "Sumber_Emosi", "Pertanyaan_Analisis"])
        print("Header CSV berhasil ditulis.")
        
        # Menyiapkan data untuk ditampilkan sebagai tabel dan ditulis ke CSV
        for i, item in enumerate(data_json):
            # Menggabungkan pertanyaan menjadi string tunggal dengan pemisah " | "
            pertanyaan_str = " | ".join(item.get("Pertanyaan_Analisis", []))
            
            # Menulis data dalam format CSV
            writer.writerow([
                item.get("Level_Emosi", ""),
                item.get("Tipe_Emosi", ""),
                item.get("Sumber_Emosi", ""),
                pertanyaan_str,
            ])
            
            # Menambahkan data untuk ditampilkan sebagai tabel (batasi panjang pertanyaan)
            tabel_data.append([
                item.get("Level_Emosi", ""),
                item.get("Tipe_Emosi", ""),
                item.get("Sumber_Emosi", ""),
                pertanyaan_str[:60] + "..." if len(pertanyaan_str) > 60 else pertanyaan_str,
            ])

            # Menampilkan data yang sedang diproses di terminal
            print(f"Menambahkan data ke-{i+1} ke CSV.")

    # Memastikan bahwa ada cukup data untuk diacak
    if len(tabel_data) < display_limit:
        display_limit = len(tabel_data)
        print(f"Jumlah data kurang dari {display_limit}. Menampilkan semua data.")

    # Memilih 5 item acak dari tabel_data
    tabel_data_limited = random.sample(tabel_data, display_limit)
    
    # Menampilkan data dalam bentuk tabel di terminal menggunakan tabulate
    print("\nTabel Data yang Diproses (5 item acak):")
    print(tabulate(tabel_data_limited, headers=["Level_Emosi", "Tipe_Emosi", "Sumber_Emosi", "Pertanyaan_Analisis"], tablefmt="pretty"))

# Path ke file JSON dan file CSV yang ingin dibuat
json_file_path = 'models/ANN/data_set.json'  # Ganti dengan path file JSON Anda
csv_file_path = 'models/ANN/data_set.csv'    # Nama file CSV yang ingin dibuat

# Menyimpan JSON ke dalam file CSV dan menampilkan tabel
json_to_csv(json_file_path, csv_file_path)
print("\nFile CSV berhasil dibuat!")
