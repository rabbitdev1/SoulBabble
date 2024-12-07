import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Dropout
import tensorflow as tf
import matplotlib.pyplot as plt

# Memuat data
data = pd.read_csv('models/dataset.csv')

# Label Encoding untuk kolom kategorikal 'emosi', 'sumber', dan 'rekomendasi'
label_encoder_emosi = LabelEncoder()
data['emosi_encoded'] = label_encoder_emosi.fit_transform(data['emosi'])

# Menyimpan kelas-kelas emosi untuk digunakan saat prediksi
np.save('models/emosi_classes.npy', label_encoder_emosi.classes_)

# Label Encoding untuk kolom 'sumber' dan 'rekomendasi'
label_encoder_sumber = LabelEncoder()
data['sumber_encoded'] = label_encoder_sumber.fit_transform(data['sumber'])

label_encoder_rekomendasi = LabelEncoder()
data['rekomendasi_encoded'] = label_encoder_rekomendasi.fit_transform(data['rekomendasi'])

# One-Hot Encoding untuk 'emosi_positif' dan 'emosi_negatif'
mlb_pos = MultiLabelBinarizer()
emosi_positif_encoded = mlb_pos.fit_transform(data['emosi_positif'].apply(lambda x: eval(x)))

mlb_neg = MultiLabelBinarizer()
emosi_negatif_encoded = mlb_neg.fit_transform(data['emosi_negatif'].apply(lambda x: eval(x)))

# Membagi dataset menjadi fitur dan target
X = np.hstack([emosi_positif_encoded, emosi_negatif_encoded])
y_emosi = data['emosi_encoded']
y_sumber = data['sumber_encoded']
y_rekomendasi = data['rekomendasi_encoded']

# Membagi data untuk training dan testing
X_train, X_test, y_train_emosi, y_test_emosi, y_train_sumber, y_test_sumber, y_train_rekomendasi, y_test_rekomendasi = train_test_split(
    X, y_emosi, y_sumber, y_rekomendasi, test_size=0.2, random_state=42)

# Input Layer
input_layer = Input(shape=(X_train.shape[1],))

# Hidden Layers
x = Dense(128, activation='relu')(input_layer)
x = Dropout(0.2)(x)
x = Dense(64, activation='relu')(x)
x = Dropout(0.2)(x)
x = Dense(32, activation='relu')(x)

# Output Layers (multi-output)
output_emosi = Dense(len(label_encoder_emosi.classes_), activation='softmax', name='emosi')(x)
output_sumber = Dense(len(label_encoder_sumber.classes_), activation='softmax', name='sumber')(x)
output_rekomendasi = Dense(len(label_encoder_rekomendasi.classes_), activation='softmax', name='rekomendasi')(x)

# Membuat Model
model = Model(inputs=input_layer, outputs=[output_emosi, output_sumber, output_rekomendasi])

# Menyusun model dengan metrik terpisah untuk masing-masing output
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics={
        'emosi': 'accuracy',
        'sumber': 'accuracy',
        'rekomendasi': 'accuracy'
    }
)

# Melatih model
history = model.fit(
    X_train, 
    {'emosi': y_train_emosi, 'sumber': y_train_sumber, 'rekomendasi': y_train_rekomendasi},
    epochs=100, 
    batch_size=32,
    validation_data=(X_test, {'emosi': y_test_emosi, 'sumber': y_test_sumber, 'rekomendasi': y_test_rekomendasi})
)

# Menyimpan model
model.save('models/emosi_model.h5')

# Menampilkan hasil pelatihan
# plt.plot(history.history['emosi_accuracy'], label='Emosi Training Accuracy')
# plt.plot(history.history['val_emosi_accuracy'], label='Emosi Validation Accuracy')
# plt.legend()
# plt.show()

# Model sudah disimpan sebagai 'models/emosi_model.h5'
