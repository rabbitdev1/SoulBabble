import streamlit as st
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras import layers, models
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import json
import matplotlib.pyplot as plt

# Load Dataset
@st.cache
def load_data(file_path="./dataset.JSON"):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

# Prepare the data
def prepare_data(data):
    user_ids = []
    item_titles = []
    ratings = []

    user_encoder = LabelEncoder()
    item_encoder = LabelEncoder()

    for entry in data:
        user_id = entry["userID"]
        for recommendation in entry["recommendation"]:
            item_title = recommendation["title"]
            user_ids.append(user_id)
            item_titles.append(item_title)
            ratings.append(np.random.randint(1, 6))  # Random ratings for demonstration

    user_ids = user_encoder.fit_transform(user_ids)
    item_titles = item_encoder.fit_transform(item_titles)

    df = pd.DataFrame({
        'userID': user_ids,
        'itemID': item_titles,
        'rating': ratings
    })

    return df, user_encoder, item_encoder

# Build the model
def build_model(embedding_size, dropout_rate, learning_rate):
    user_input = layers.Input(shape=(1,))
    item_input = layers.Input(shape=(1,))

    user_embedding = layers.Embedding(len(user_encoder.classes_), embedding_size)(user_input)
    item_embedding = layers.Embedding(len(item_encoder.classes_), embedding_size)(item_input)

    user_vec = layers.Flatten()(user_embedding)
    item_vec = layers.Flatten()(item_embedding)

    concat = layers.concatenate([user_vec, item_vec])

    x = layers.Dense(128, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.01))(concat)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(dropout_rate)(x)

    x = layers.Dense(64, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.01))(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(dropout_rate)(x)

    output = layers.Dense(1)(x)

    model = models.Model(inputs=[user_input, item_input], outputs=output)
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=learning_rate), loss='mse')
    return model

# Interactive UI
st.title("Interactive Recommendation System")

# Load data
data = load_data()
df, user_encoder, item_encoder = prepare_data(data)

# Sidebar for parameter configuration
st.sidebar.title("Training Parameters")
embedding_size = st.sidebar.slider("Embedding Size", 10, 100, 50)
dropout_rate = st.sidebar.slider("Dropout Rate", 0.1, 0.9, 0.7)
epochs = st.sidebar.slider("Epochs", 1, 100, 10)
batch_size = st.sidebar.slider("Batch Size", 8, 128, 32)
learning_rate = st.sidebar.slider("Learning Rate", 0.0001, 0.01, 0.001, format="%.4f")

# Display dataset
st.write("Dataset Preview:")
st.dataframe(df.head())

# Split data
X = df[['userID', 'itemID']]
y = df['rating']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
st.write("Training the Model...")
model = build_model(embedding_size, dropout_rate, learning_rate)

history = model.fit(
    [X_train['userID'], X_train['itemID']], y_train,
    epochs=epochs,
    batch_size=batch_size,
    validation_data=([X_test['userID'], X_test['itemID']], y_test),
    verbose=0
)

# Plot training and validation loss
st.write("Training and Validation Loss:")
fig, ax = plt.subplots()
ax.plot(history.history['loss'], label='Training Loss', color='blue')
ax.plot(history.history['val_loss'], label='Validation Loss', color='orange')
ax.legend()
st.pyplot(fig)

# Generate recommendations
st.sidebar.title("Generate Recommendations")
user_id_input = st.sidebar.text_input("Enter User ID:", "35")
emotion_input = st.sidebar.text_input("Enter Emotion (e.g., Senang, Bahagia):", "Senang")

def generate_recommendations(user_id, emotion_dominant):
    # Cari data pengguna di dataset berdasarkan user_id
    user_data = None
    for entry in data:
        if entry["userID"] == user_id:
            user_data = entry
            break

    # Jika user tidak ditemukan
    if user_data is None:
        return {"msgEmotion": "User tidak ditemukan", "recommendation": []}

    # Mengambil emotionDominant dari dataset
    emotion_dominant_data = user_data["emotionDominant"]  # Emosi dominan dari dataset
    msg_emotion = user_data["msgEmotion"]  # Pesan emosi dari dataset

    # Mencocokkan emosi input dengan emosi dominan yang ada di dataset
    matched_emotions = []
    for emotion in emotion_dominant:
        emotion_lower = emotion.strip().lower()
        
        # Cek apakah emosi input ada di dalam emotionDominant
        if emotion_lower in [e.lower() for e in emotion_dominant_data]:
            matched_emotions.append(f"Emosi '{emotion}' cocok dengan data emosi dominan.")

    # Gabungkan emosi yang cocok ke dalam pesan jika ada
    if matched_emotions:
        msg_emotion =  msg_emotion
    else:
        # Jika tidak ada emosi yang cocok, gunakan msgEmotion dari dataset langsung
        msg_emotion = msg_emotion

    # Mengonversi user_id menjadi bentuk numerik
    recommendations = []
    try:
        user_id_num = user_encoder.transform([user_id])[0]  # Konversi user ID menjadi numerik
    except ValueError as e:
        print(f"Error converting user_id: {e}")
        return {"msgEmotion": "Emosi tidak dikenali", "recommendation": []}

    # Mengambil item yang direkomendasikan berdasarkan prediksi rating
    item_ids = np.arange(len(item_encoder.classes_))  # Daftar ID item
    predicted_ratings = model.predict([np.full_like(item_ids, user_id_num), item_ids])  # Prediksi rating

    # Urutkan item berdasarkan rating yang diprediksi
    top_items = item_ids[np.argsort(predicted_ratings.flatten())[-5:]]  # Ambil 5 item terbaik

    seen_titles = set()

    # Menambahkan item yang direkomendasikan
    for item_id in top_items:
        item_title = item_encoder.inverse_transform([item_id])[0]
        for entry in data:
            for recommendation in entry['recommendation']:
                if recommendation["title"] == item_title and item_title not in seen_titles:
                    recommendations.append({
                        "title": recommendation["title"],
                        "image": recommendation["image"],
                        "desc": recommendation["desc"],
                        "type": recommendation["type"]
                    })
                    seen_titles.add(item_title)
                    break

    return {
        "msgEmotion": msg_emotion,
        "recommendation": recommendations[:5]  # Mengembalikan 5 rekomendasi teratas
    }

if st.sidebar.button("Get Recommendations"):
    recommendations = generate_recommendations(user_id_input, emotion_input.split(","))
    st.write(f"Emotion Message: {recommendations['msgEmotion']}")
    st.write("Recommendations:")
    st.table(pd.DataFrame(recommendations["recommendation"]))
