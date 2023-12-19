from fastapi import FastAPI

from model1 import prediksi
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=os.getenv("HOST", "localhost"), port=int(os.getenv("PORT", 8080)), log_level="debug")