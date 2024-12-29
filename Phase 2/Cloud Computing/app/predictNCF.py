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
        for recommendation in entry["recommendation"]:
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

    early_stopping = tf.keras.callbacks.EarlyStopping(
    monitor='val_loss',
    patience=5,
    restore_best_weights=True,
    min_delta=0.01,
    verbose=1
    )

    def scheduler(epoch, lr):
        if epoch > 5 and epoch % 10 == 0:
            return lr * 0.1
        return lr

    lr_scheduler = tf.keras.callbacks.LearningRateScheduler(scheduler)

    # Train the model with no logging output
    logger.info("Training the model")
    model.fit(
        [X_train['userID'], X_train['itemID']], y_train,
        epochs=50, batch_size=32,
        validation_data=([X_test['userID'], X_test['itemID']], y_test),
        verbose=0,  # Set verbose to 0 to suppress logging
        callbacks=[early_stopping, lr_scheduler]
    )

    # Define recommendation function
    def generate_recommendations(api_key, emotion_dominant):
        user_data = None
        for entry in data:
            if entry["userID"] == api_key:
                user_data = entry
                break

        if user_data is None:
            return {"msgEmotion": "User tidak ditemukan", "recommendation": []}

        emotion_dominant_data = user_data["emotionDominant"]
        msg_emotion = user_data["msgEmotion"]

        matched_emotions = []
        for emotion in emotion_dominant:
            emotion_lower = emotion.strip().lower()
            if emotion_lower in [e.lower() for e in emotion_dominant_data]:
                matched_emotions.append(f"Emosi '{emotion}' cocok dengan data emosi dominan.")

        if matched_emotions:
            msg_emotion = msg_emotion
        else:
            msg_emotion = msg_emotion

        recommendations = []
        try:
            api_key_num = user_encoder.transform([api_key])[0]
        except ValueError as e:
            print(f"Error converting api_key: {e}")
            return {"msgEmotion": "Emosi tidak dikenali", "recommendation": []}

        item_ids = np.arange(len(item_encoder.classes_))
        predicted_ratings = model.predict([np.full_like(item_ids, api_key_num), item_ids])

        top_items = item_ids[np.argsort(predicted_ratings.flatten())[-5:]]

        seen_titles = set()

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
            "recommendation": recommendations[:5]
        }

    if __name__ == "__main__":
        try:
            api_key = sys.argv[1]
            emotion_dominant = sys.argv[2:]
            logger.info(f"Received api_key: {api_key}, emotion_dominant: {emotion_dominant}")
            result = generate_recommendations(api_key, emotion_dominant)
            logger.info("Successfully generated recommendations")
            print(json.dumps(result))  # Ensure this is valid JSON
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
