import json
import csv

# Fungsi untuk mengonversi JSON ke CSV
def json_to_csv(json_file, csv_file):
    # Membuka dan membaca data JSON dari file
    with open(json_file, 'r', encoding='utf-8') as file:
        data_json = json.load(file)
    
    # Membuka file CSV untuk menulis
    with open(csv_file, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        
        # Menulis header CSV
        writer.writerow(["Level_Emosi",  "Tipe_Emosi", "Sumber_Emosi", "Pertanyaan_Analisis"])
        
        # Menulis data
        for item in data_json:
            # Menggabungkan pertanyaan  menjadi string tunggal
            pertanyaan_str = " | ".join(item["Pertanyaan_Analisis"])
            
            # Menulis data dalam format CSV
            writer.writerow([
                item["Level_Emosi"],
                item["Tipe_Emosi"],
                item["Sumber_Emosi"],
                pertanyaan_str,
            ])

# Path ke file JSON dan file CSV yang ingin dibuat
json_file_path = 'models/ANN/data_set.json'  # Ganti dengan path file JSON kamu
csv_file_path = 'models/ANN/data_set.csv'    # Nama file CSV yang ingin dibuat

# Menyimpan JSON ke dalam file CSV
json_to_csv(json_file_path, csv_file_path)
print("File CSV berhasil dibuat!")
