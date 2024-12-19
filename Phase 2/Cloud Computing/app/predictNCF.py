import sys
import json
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras import layers, models
from sklearn.preprocessing import LabelEncoder
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger()

# Suppress TensorFlow logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Log the start of the script
logger.info("Script started")

try:
    # Load the dataset
    logger.info("Loading dataset")
    with open("./public/data/dataset.JSON", 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Preprocessing
    logger.info("Preprocessing data")
    api_keys = []
    item_titles = []
    ratings = []

    user_encoder = LabelEncoder()
    item_encoder = LabelEncoder()

    for entry in data:
        api_key = entry["userID"]  # Use API key directly
        for recommendation in entry["reccomendation"]:
            item_title = recommendation["title"]
            api_keys.append(api_key)
            item_titles.append(item_title)
            ratings.append(np.random.randint(1, 6))

    api_keys = user_encoder.fit_transform(api_keys)
    item_titles = item_encoder.fit_transform(item_titles)

    # Create DataFrame
    logger.info("Creating DataFrame")
    df = pd.DataFrame({
        'userID': api_keys,
        'itemID': item_titles,
        'rating': ratings
    })

    X = df[['userID', 'itemID']]
    y = df['rating']

    # Train-test split
    logger.info("Splitting data into train and test sets")
    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Build NCF model
    logger.info("Building model")
    embedding_size = 50
    user_input = layers.Input(shape=(1,))
    item_input = layers.Input(shape=(1,))

    user_embedding = layers.Embedding(len(user_encoder.classes_), embedding_size)(user_input)
    item_embedding = layers.Embedding(len(item_encoder.classes_), embedding_size)(item_input)

    user_vec = layers.Flatten()(user_embedding)
    item_vec = layers.Flatten()(item_embedding)

    concat = layers.concatenate([user_vec, item_vec])

    x = layers.Dense(128, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.01))(concat)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.6)(x)

    x = layers.Dense(64, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.01))(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.6)(x)

    output = layers.Dense(1)(x)
    model = models.Model(inputs=[user_input, item_input], outputs=output)
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.0005), loss='mse')

    # Train the model
    logger.info("Training the model")
    model.fit(
        [X_train['userID'], X_train['itemID']], y_train,
        epochs=1, batch_size=32,
        validation_data=([X_test['userID'], X_test['itemID']], y_test),
        verbose=0
    )

    # Define recommendation function
    def generate_recommendations(api_key, emotion_dominant):
        logger.info("Generating recommendations")
        if isinstance(emotion_dominant, list):
            if all(isinstance(char, str) and len(char) == 1 for char in emotion_dominant):
                emotion_dominant = ''.join(emotion_dominant).strip('[]').replace('"', '').replace(' ', '').split(',')

        emotion_descriptions = {
        "kecewa": "Kamu merasa kecewa karena harapanmu tidak terwujud.",
        "frustrasi": "Kamu merasa kesal dan tidak tahu bagaimana menghadapinya.",
        "bingung": "Kamu merasa bingung dan tidak tahu harus memilih yang mana.",
        "bahagia": "Kamu merasa penuh kebahagiaan dan kegembiraan.",
        "cemas": "Kamu merasa khawatir tentang masa depan atau hal yang belum pasti.",
        "marah": "Kamu merasa marah dan ingin mengubah keadaan.",
        "kesal": "Kamu merasa kesal dan tidak bisa menahan perasaan tersebut.",
        "sedih": "Kamu merasa tertekan dan kehilangan semangat.",
        "tertarik": "Kamu merasa tertarik dan ingin tahu lebih banyak tentang sesuatu.",
        "optimis": "Kamu merasa percaya diri dan berharap yang terbaik untuk masa depan.",
        "tenang": "Kamu merasa tentram dan tidak terpengaruh oleh gangguan.",
        "gembira": "Kamu merasa senang dan penuh semangat.",
        "puas": "Kamu merasa puas dengan apa yang telah tercapai.",
        "nyaman": "Kamu merasa nyaman dan tidak ada hal yang mengganggu.",
        "bergairah": "Kamu merasa penuh energi dan antusiasme.",
        "aneh": "Kamu merasa ada sesuatu yang aneh atau tidak biasa.",
        "euforis": "Kamu merasa sangat bahagia dan penuh dengan kebahagiaan eksternal.",
        "tertantang": "Kamu merasa tertantang untuk mencapai tujuan yang lebih besar.",
        "penuh harapan": "Kamu merasa memiliki harapan yang kuat untuk masa depan.",
        "terinspirasi": "Kamu merasa termotivasi untuk melakukan sesuatu yang besar.",
        "panik": "Kamu merasa cemas dan kehilangan kendali atas situasi.",
        "rindu": "Kamu merasa kangen dan ingin bertemu dengan seseorang atau sesuatu.",
        "takut": "Kamu merasa ketakutan dan khawatir tentang apa yang akan terjadi.",
        "senyum": "Kamu merasa bahagia hingga tidak bisa menahan senyum.",
        "terharu": "Kamu merasa sangat tersentuh dan emosional.",
        "bersyukur": "Kamu merasa berterima kasih atas apa yang ada dalam hidupmu.",
        "malu": "Kamu merasa malu dan tidak ingin berada dalam perhatian.",
        "tersenyum": "Kamu merasa senang hingga tidak bisa menahan untuk tersenyum.",
        "terkejut": "Kamu merasa terkejut dengan kejadian yang tidak terduga.",
        "gugup": "Kamu merasa cemas dan khawatir tentang apa yang akan terjadi.",
        "gemas": "Kamu merasa gemas dan tidak bisa menahan rasa sayang.",
        "terluka": "Kamu merasa terluka baik fisik maupun emosional, dan butuh waktu untuk sembuh."
        }

        valid_emotions = [emotion.lower() for emotion in emotion_dominant if emotion.lower() in emotion_descriptions]
        if valid_emotions:
                dominant_emotion = valid_emotions[0]  # Ambil emosi pertama dari yang valid
                msg_emotion = emotion_descriptions[dominant_emotion]  # Deskripsi untuk emosi dominan
        else:
            msg_emotion = "Emosi tidak dikenal"

        recommendations = []
        if api_key not in user_encoder.classes_:
            raise ValueError("API key not recognized")

        api_key_num = user_encoder.transform([api_key])[0]
        item_ids = np.arange(len(item_encoder.classes_))
        predicted_ratings = model.predict([np.full_like(item_ids, api_key_num), item_ids], verbose=0)
        top_items = item_ids[np.argsort(predicted_ratings.flatten())[-5:]]

        seen_titles = set()
        for item_id in top_items:
            item_title = item_encoder.inverse_transform([item_id])[0]
            for entry in data:
                for recommendation in entry['reccomendation']:
                    if recommendation["title"] == item_title and item_title not in seen_titles:
                        recommendations.append({
                            "title": recommendation["title"],
                            "image": recommendation["image"],
                            "desc": recommendation["desc"]
                        })
                        seen_titles.add(item_title)
                        break

        return {
            "msgEmotion": msg_emotion,
            "recommendations": recommendations[:5]
        }

    # Main entry for Node.js integration
    if __name__ == "__main__":
        try:
            api_key = sys.argv[1]
            emotion_dominant = sys.argv[2:]
            logger.info(f"Received api_key: {api_key}, emotion_dominant: {emotion_dominant}")
            result = generate_recommendations(api_key, emotion_dominant)
            logger.info("Successfully generated recommendations")
            print(json.dumps(result))
        except Exception as e:
            logger.error(f"Error: {str(e)}")
            error_output = {
                "status": 500,
                "msg": str(e)
            }
            print(json.dumps(error_output))
            sys.exit(1)

except Exception as e:
    logger.critical(f"Critical error during script execution: {str(e)}")
    sys.exit(1)
