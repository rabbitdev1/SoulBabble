// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const { loadModel } = require('./your_ml_model_util'); // Sesuaikan dengan lokasi utilitas Anda untuk memuat model

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello, Mood Tracker API!');
});

// GET route to retrieve and calculate mood using ML model
app.get('/mood/:sbuser_id', (req, res) => {
  const sbuser_id = req.params.sbuser_id;

  // Ambil data dari tabel community
  const sqlCommunity = `
    SELECT message
    FROM community
    WHERE sbuser_id = ?;
  `;

  db.query(sqlCommunity, [sbuser_id], (err, resultCommunity) => {
    if (err) {
      console.error('Error retrieving community posts:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const communityPosts = resultCommunity.map((row) => row.message);

      // Contoh: Logika perhitungan mood menggunakan model ML (sesuaikan dengan model Anda)
      const moodResult = predictMoodUsingMLModel(communityPosts);

      res.json({ community_posts: communityPosts, mood_result: moodResult });
    }
  });
});

// Fungsi untuk memuat dan menggunakan model ML (sesuaikan dengan model Anda)
function predictMoodUsingMLModel(communityPosts) {
    const mlModel = loadModel(); // Memuat model ML yang telah dilatih
    const inputFeatures = preprocessData(communityPosts); // Sesuaikan dengan preprocessing yang diperlukan
    const predictedMood = mlModel.predict(inputFeatures);
    return predictedMood;
  }

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
