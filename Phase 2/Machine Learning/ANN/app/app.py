from app import app  # Mengimpor aplikasi Flask dari __init__.py
import app.routes  # Mengimpor routes setelah aplikasi Flask diinisialisasi

# Jalankan aplikasi jika file ini dijalankan langsung
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
