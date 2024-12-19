import sys
import json
import joblib
import numpy as np
from tensorflow.keras.models import load_model
import os

# Menyembunyikan log TensorFlow dengan mengalihkan stderr
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Mengatur TensorFlow supaya tidak mencetak log
sys.stderr = open(os.devnull, 'w')  # Mengalihkan stderr ke devnull, log tidak akan tercetak

# Memuat model, vectorizer, dan label encoder
model = load_model('app/models/emotion_tracking_model.keras')
vectorizer = joblib.load('app/models/vectorizer.pkl')
label_encoder = joblib.load('app/models/label_encoder.pkl')

def predict_question(level_emosi, tipe_emosi, sumber_emosi):
    input_text = f"{level_emosi} {tipe_emosi} {sumber_emosi}"
    input_features = vectorizer.transform([input_text]).toarray()
    predicted_class = model.predict(input_features)
    predicted_class_index = np.argmax(predicted_class, axis=1)[0]
    predicted_question = label_encoder.inverse_transform([predicted_class_index])[0]
    return predicted_question

if __name__ == "__main__":
    level_emosi = sys.argv[1]
    tipe_emosi = sys.argv[2]
    sumber_emosi = sys.argv[3]

    try:
        result = predict_question(level_emosi, tipe_emosi, sumber_emosi)

        # Hanya mengirim JSON yang diperlukan
        output = {
            "status": 200,
            "msg": "Prediction successful",
            "predicted_question": result
        }
        print(json.dumps(output))  # Output JSON yang bersih

    except Exception as e:
        error_output = {
            "status": 500,
            "msg": str(e)
        }
        print(json.dumps(error_output))
        sys.exit(1)
