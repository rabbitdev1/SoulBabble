const dotenv = require("dotenv");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const mysql = require("mysql");
const util = require('util');

// Konfigurasi dotenv
dotenv.config();

// Konfigurasi database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { fullname, id_google,email ,photoUrl} = req.body;

    // Simpan data user ke database
    const result = await db.query(
      'INSERT INTO sbusers ( fullname,id_google,email,photoUrl) VALUES ( ?, ?, ?, ?)',
      [fullname, id_google,email,photoUrl]
    );

    // Jika data berhasil disimpan, buat token JWT
    const token = jwt.sign({ identifier: email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token }); // Mengembalikan nilai token sebagai respon
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Membuat query function yang berbasis promise
const query = util.promisify(db.query).bind(db);

// Login
router.post('/login', async (req, res) => {
  try {
    const { id_google } = req.body;

    console.log('Login request received with id_google:', id_google);

    // Cek koneksi ke database
    if (db.state !== 'authenticated') {
      console.error('Database connection is not established');
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Ambil data user dari database berdasarkan ID Google
    const rows = await query('SELECT * FROM sbusers WHERE id_google = ?', [id_google]);

    console.log('Rows:', rows);

    if (!Array.isArray(rows) || rows.length === 0) {
      console.log('Query did not return expected results:', rows);
      return res.status(401).json({ error: 'Google ID not found' });
    }

    // Jika ID Google ditemukan dalam database, buat token JWT
    const token = jwt.sign({ identifier: rows[0].email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  

// Logout
router.post('/logout', authMiddleware, (req, res) => {
    // Di sini, req.user akan berisi informasi user yang diotentikasi
    res.json({ message: 'Logout successful' });
  });

module.exports = router;