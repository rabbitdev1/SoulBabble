from fastapi import FastAPI

from model import prediksi
from dotenv import main
import os

main.load_dotenv()


app = FastAPI()

@app.get("/")
def index():
    return {"msg":"Mainpage !"}

@app.post("/predict")
def predictor(st):
    result = prediksi(st)
    return {"msg":result}


import uvicorn
port = os.environ.get("PORT", 8080)
print(f"Listening to http://localhost:{port}")
uvicorn.run(app, host='localhost',port=port)