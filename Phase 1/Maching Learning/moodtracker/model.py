import tensorflow as tf
from prepare import *
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer


model = tf.keras.models.load_model("my_model.h5")

cv = token("Countvectorizer.pkl")
label = labelencode("encoder.pkl")

def prediksi(teks):
    text = preprocess(teks)
    array = cv.transform([text]).toarray()
    pred = model.predict(array)
    a=np.argmax(pred, axis=1)
    output = label.inverse_transform(a)[0]
    print(output)
    return output