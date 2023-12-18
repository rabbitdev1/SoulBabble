from MySQLdb import Timestamp
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import Text, create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from model import prediksi
import os

load_dotenv()

# Konfigurasi koneksi ke MySQL
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+mysqlconnector://soul:soulbabble@35.212.162.13/babble")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Definisi model tabel
class Community(Base):
    __tablename__ = "community"
    post_id = Column(Integer, primary_key=True, index=True)  # Tambahkan post_id sebagai primary key
    sbuser_id = Column(Integer, index=True)  # Tambahkan kolom user_id
    fullname = Column(String(255))  # Tambahkan kolom fullname
    message = Column(Text)  # Tambahkan kolom message dengan tipe Text
    timestamp = Column(DateTime, default=datetime.utcnow)

app = FastAPI()

# Dependency untuk mendapatkan sesi database
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/predict/{sbuser_id}")
def predictor(sbuser_id: str, db: Session = Depends(get_db)):
    # Mengambil pesan terbaru dari tabel untuk user_id tertentu
    latest_message = db.query(Community).filter(Community.sbuser_id == sbuser_id).order_by(Community.timestamp.desc()).first()

    if not latest_message:
        raise HTTPException(status_code=404, detail=f"No messages found for user_id: {sbuser_id}")

    # Melakukan prediksi menggunakan model
    result = prediksi(latest_message.message)

    return {"msg": result}


import uvicorn
port = os.environ.get("PORT", 8080)
print(f"Listening to http://localhost:{port}")
uvicorn.run(app, host='localhost',port=port)