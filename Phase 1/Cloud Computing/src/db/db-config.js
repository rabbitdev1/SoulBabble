const mysql = require('mysql2');
const dotenv = require("dotenv");
const { DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 3306
  });
  
  // Koneksi ke database
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
    } else {
      console.log('Connected to database bot');
    }
  });