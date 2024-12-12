import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Input, Embedding, Flatten, Dense, Concatenate
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam

# Hyperparameters
num_users = 1000      # Jumlah pengguna
num_items = 5000      # Jumlah item
num_moods = 3         # Jumlah mood (sedih, marah, kesal)
embedding_size = 50   # Ukuran embedding
batch_size = 32
epochs = 10

# Generate sample data (random for demonstration)
num_samples = 10000
user_data = np.random.randint(0, num_users, size=num_samples)
item_data = np.random.randint(0, num_items, size=num_samples)
mood_data = np.random.randint(0, num_moods, size=num_samples)
interaction_data = np.random.randint(0, 2, size=num_samples)  # 0 or 1 (like or dislike)

# Input Layer
user_input = Input(shape=(1,), name='user')
item_input = Input(shape=(1,), name='item')
mood_input = Input(shape=(1,), name='mood')

# Embedding Layers
user_embedding = Embedding(num_users, embedding_size)(user_input)
item_embedding = Embedding(num_items, embedding_size)(item_input)
mood_embedding = Embedding(num_moods, embedding_size)(mood_input)

# Flatten the embeddings
user_flat = Flatten()(user_embedding)
item_flat = Flatten()(item_embedding)
mood_flat = Flatten()(mood_embedding)

# Concatenate all embeddings
concat = Concatenate()([user_flat, item_flat, mood_flat])

# Hidden Layers
hidden = Dense(128, activation='relu')(concat)
hidden = Dense(64, activation='relu')(hidden)

# Output Layer
output = Dense(1, activation='sigmoid')(hidden)

# Model
model = Model(inputs=[user_input, item_input, mood_input], outputs=output)

# Compile Model
model.compile(optimizer=Adam(), loss='binary_crossentropy', metrics=['accuracy'])

# Model Summary
model.summary()

# Training the model
model.fit([user_data, item_data, mood_data], interaction_data, epochs=epochs, batch_size=batch_size)

# Function to predict and recommend items based on user mood
def recommend_items_for_user(user_id, mood_id, num_recommendations=10):
    item_scores = []
    for item_id in range(num_items):
        score = model.predict([np.array([user_id]), np.array([item_id]), np.array([mood_id])])
        item_scores.append((item_id, score[0][0]))  # Save item id with predicted score
    
    # Sort the scores in descending order
    item_scores.sort(key=lambda x: x[1], reverse=True)
    return item_scores[:num_recommendations]  # Return top recommendations

# Example: Get recommendations for user_id=1 with mood=2 (kesal)
user_id = 1
mood_id = 2  # Mood: Kesal (upset)
recommendations = recommend_items_for_user(user_id, mood_id)
print("Top Recommendations (Item ID and Score):")
for item_id, score in recommendations:
    print(f"Item ID: {item_id}, Score: {score:.4f}")
