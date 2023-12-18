// chat.js

const mysql = require('mysql2/promise');
const dbConfig = require('../db/db-config');

const pool = mysql.createPool(dbConfig);

exports.sendMessage = async (user_id, message) => {
  const sql = `INSERT INTO chat (sbuser_id, message) VALUES (?, ?)`;
  const [result] = await pool.execute(sql, [user_id, message]);
  return result;
};

exports.getResponse = async (user_id, message) => {
  const sql = `SELECT * FROM chat WHERE sbuser_id = ? AND message = ?`;
  const [rows] = await pool.execute(sql, [user_id, message]);
  return rows;
};
