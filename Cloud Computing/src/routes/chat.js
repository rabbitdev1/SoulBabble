const mysql = require('mysql2/promise');
const dbConfig = require('../db/db-config');

const pool = mysql.createPool(dbConfig);

router.post('/sendMessage', async (req, res) => {
    try {
      const { user_id, message } = req.body;
  
      // Simpan pesan ke dalam tabel chat
      const result = await pool.execute(
        'INSERT INTO chat (sbuser_id, message) VALUES (?, ?)',
        [user_id, message]
      );
  
      console.log(result);
      res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

  router.post('/response', async (req, res) => {
    try {
      const { user_id, message } = req.body;
  
      // Dapatkan respons dari database berdasarkan user_id dan message
      const [rows] = await pool.execute('SELECT * FROM chat WHERE sbuser_id = ? AND message = ?', [user_id, message]);
  
      res.status(200).json({ data: rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;