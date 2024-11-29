const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});


// Endpoint to get journals
router.get('/get-journal', async (req, res) => {
  try {
    const { fullname } = req.query;

    // Retrieve sbuser_id based on fullname
    const userQuery = 'SELECT sbuser_id FROM sbusers WHERE fullname = ?';
    const userResult = await query(userQuery, [fullname]);

    if (!Array.isArray(userResult) || userResult.length === 0) {
      return res.status(404).send('User not found for the specified fullname');
    }

    const sbuser_id = userResult[0].sbuser_id;

    // Retrieve journals based on sbuser_id
    const journalQuery = `
      SELECT * FROM community
      WHERE sbuser_id = ?
    `;

    const journals = await query(journalQuery, [sbuser_id]);

    if (journals.length === 0) {
      return res.status(404).send('No journals found for the specified fullname');
    }

    res.status(200).json(journals);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Endpoint to post journal
router.post('/post-journal', async (req, res) => {
  try {
    const { fullname, message } = req.body;

    // Retrieve sbuser_id based on fullname
    const userQuery = 'SELECT sbuser_id FROM sbusers WHERE fullname = ?';
    const userResult = await query(userQuery, [fullname]);

    if (!Array.isArray(userResult) || userResult.length === 0) {
      return res.status(404).send('User not found for the specified fullname');
    }

    const sbuser_id = userResult[0].sbuser_id;

    // Insert journaling data into the community table
    const journalQuery = `
      INSERT INTO community (sbuser_id, fullname, message, timestamp)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP())
    `;

    await query(journalQuery, [sbuser_id, fullname, message]);

    res.status(200).send('Journal posted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Membuat query function yang berbasis promise
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = router;
