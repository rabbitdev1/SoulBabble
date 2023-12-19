import tensorflow as tf
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from helper2 import *
header = ['a']
datarespon = pd.read_csv("chatbot\data_respon.csv", header=None, names=header)
datatag = pd.read_csv("chatbot\data_tag.csv", header=None, names=header)
datarespon=datarespon['a'].values
datatag = datatag['a'].values
model = tf.keras.models.load_model("chatbot\my_model.h5")

tokenize = token("chatbot\Tokenize.pkl")
label = labelencode("chatbot\encoder.pkl")

def prediksi(teks : str):
    text = cleaning(teks)
    input_sequence = tokenize.texts_to_sequences([teks])
    input_padded = pad_sequences(input_sequence, maxlen=17)
    predicted_emotion = model.predict(input_padded)
    predicted_emotion_label = label.inverse_transform(np.argmax(predicted_emotion, axis=1))[0]
    relevant_responses = [response for i, response in enumerate(datarespon) if datatag[i] == label.transform([predicted_emotion_label])[0]]
    if len(relevant_responses) > 0:
        selected_response = np.random.choice(relevant_responses)
    else:
        selected_response = "Maaf, saya tidak memiliki respons untuk emosi ini."
    return selected_response