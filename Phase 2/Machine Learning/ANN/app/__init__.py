from flask import Flask

# Membuat instance aplikasi Flask
app = Flask(__name__)

# Mengimpor rute setelah aplikasi dibuat untuk menghindari circular import
from app.routes import *
