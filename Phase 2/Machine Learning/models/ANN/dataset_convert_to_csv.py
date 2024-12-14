import json
import csv
from tabulate import tabulate

# Fungsi untuk mengonversi JSON ke CSV dan menampilkan tabel
def json_to_csv(json_file, csv_file):
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
        writer.writerow(["Level_Emosi",  "Tipe_Emosi", "Sumber_Emosi", "Pertanyaan_Analisis"])
        print("Header CSV berhasil ditulis.")
        
        # Menyiapkan data untuk ditampilkan sebagai tabel dan ditulis ke CSV
        for i, item in enumerate(data_json):
            # Menggabungkan pertanyaan menjadi string tunggal
            pertanyaan_str = " | ".join(item["Pertanyaan_Analisis"])
            
            # Menulis data dalam format CSV
            writer.writerow([
                item["Level_Emosi"],
                item["Tipe_Emosi"],
                item["Sumber_Emosi"],
                pertanyaan_str,
            ])
            
            # Menambahkan data untuk ditampilkan sebagai tabel
            tabel_data.append([
                item["Level_Emosi"],
                item["Tipe_Emosi"],
                item["Sumber_Emosi"],
                pertanyaan_str[:20]+"...",
            ])

            # Menampilkan data yang sedang diproses di terminal
            print(f"Menambahkan data ke-{i+1} ke CSV.")

    # Batasi hanya 5 baris pertama untuk ditampilkan
    tabel_data_limited = tabel_data[:5]
    
    # Menampilkan data dalam bentuk tabel di terminal menggunakan tabulate
    print("\nTabel Data yang Diproses (5 pertama):")
    print(tabulate(tabel_data_limited, headers=["Level_Emosi", "Tipe_Emosi", "Sumber_Emosi", "Pertanyaan_Analisis"], tablefmt="pretty"))

# Path ke file JSON dan file CSV yang ingin dibuat
json_file_path = 'models/ANN/data_set.json'  # Ganti dengan path file JSON kamu
csv_file_path = 'models/ANN/data_set.csv'    # Nama file CSV yang ingin dibuat

# Menyimpan JSON ke dalam file CSV dan menampilkan tabel
json_to_csv(json_file_path, csv_file_path)
print("\nFile CSV berhasil dibuat!")
