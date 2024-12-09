from app import create_app

# Membuat aplikasi menggunakan factory function
app = create_app()

if __name__ == "__main__":
    # Menjalankan aplikasi Flask pada localhost dengan debug mode aktif
    app.run(debug=True)
