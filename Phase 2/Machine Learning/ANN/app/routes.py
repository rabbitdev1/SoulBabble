# from flask import render_template, request
# from app import create_app
# from app.predict import predict_question

# app = create_app()

# @app.route('/', methods=['GET', 'POST'])
# def index():
#     if request.method == 'POST':
#         # Mengambil data dari form
#         level_emosi = request.form['level_emosi']
#         tipe_emosi = request.form['tipe_emosi']
#         sumber_emosi = request.form['sumber_emosi']
        
#         # Prediksi pertanyaan berdasarkan input
#         predicted_question = predict_question(level_emosi, tipe_emosi, sumber_emosi)
        
#         return render_template('index.html', predicted_question=predicted_question)
    
#     return render_template('index.html', predicted_question=None)

from flask import render_template
from app import app  # Mengimpor objek app yang sudah diinisialisasi di __init__.py

# Rute untuk halaman utama
@app.route('/')
def home():
    return render_template('index.html')  # Template index.html ada di dalam folder app/
