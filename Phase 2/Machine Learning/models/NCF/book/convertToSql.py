import json
import random

# Load JSON data
with open('tourism_data.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Prepare SQL INSERT statements
insert_statements = []

for record in data:
    userID = record['userID'].replace("'", "''")  # Escape single quotes
    emotionDominant = ', '.join(record['emotionDominant']).replace("'", "''")  # Escape single quotes
    msgEmotion = record['msgEmotion'].replace("'", "''")  # Escape single quotes

    for rec in record['recommendation']:
        title = rec['title'].replace("'", "''")  # Escape single quotes
        desc = rec['desc'].replace("'", "''")  # Escape single quotes
        image = rec['image'].replace("'", "''")  # Escape single quotes

        # Create recommendedAction as JSON object
        recommended_action = json.dumps({
            "title": title,
            "desc": desc,
            "image": image,
            "msgEmotion": msgEmotion
        }).replace("'", "''")  # Escape single quotes in JSON string

        # Generate random trackingId and journalingId
        tracking_id = random.choice([1, 2])
        journaling_id = random.choice([1, 2])

        # Create SQL statement
        sql = f"INSERT INTO `recommendations`(`id`, `apiKey`, `trackingId`, `journalingId`, `recommendedAction`, `url`, `type`, `createdAt`) VALUES (NULL, '{userID}', {tracking_id}, {journaling_id}, '{recommended_action}', '{image}', 'destinasi', NOW());"
        insert_statements.append(sql)

# Write the SQL statements to a file
with open('insert_statements.sql', 'w', encoding='utf-8') as output_file:
    for statement in insert_statements:
        output_file.write(statement + '\n')

print("SQL statements have been written to insert_statements.sql")
