// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const dotenv = require('dotenv');

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

// GET route to retrieve and calculate mood
app.get('/mood/:sbuser_id', (req, res) => {
  const sbuser_id = req.params.sbuser_id;

  const sql = `
    SELECT AVG(mood) AS average_mood
    FROM community
    WHERE sbuser_id = ?;
  `;

  db.query(sql, [sbuser_id], (err, result) => {
    if (err) {
      console.error('Error retrieving mood:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const averageMood = result[0].average_mood || 0;
      res.json({ average_mood: averageMood });
    }
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
