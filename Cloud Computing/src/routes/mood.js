const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Konfigurasi koneksi ke database MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

// Endpoint untuk mendapatkan data Mood Tracker
app.get('/mood-tracker', (req, res) => {
  const { sbuser_id, date } = req.query;

  const sql = `
    SELECT c.fullname, t.mood, t.timestamp
    FROM community c
    LEFT JOIN tracker t ON c.post_id = t.post_id
    WHERE c.sbuser_id = ? AND DATE(t.timestamp) = ?
  `;

  db.query(sql, [sbuser_id, date], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).json(result);
    }
  });
});

// Endpoint untuk menyimpan mood ke dalam tabel mood
app.post('/mood', (req, res) => {
  const { sbuser_id, post_id, message_id, fullname, mood, timestamp } = req.body;

  const sql = `
    INSERT INTO mood (sbuser_id, post_id, message_id, fullname, mood, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [sbuser_id, post_id, message_id, fullname, mood, timestamp], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Mood saved successfully');
    }
  });
});

// Menjalankan server pada port yang telah ditentukan
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
