// index.js
const express = require('express');
const mysql = require('mysql');
/// const bodyParser = require('body-parser');
///const authRoutes = require('./routes/auth');

const app = express();
////const port = 3000;

app.use(express.json());
const port = process.env.PORT || 3000
////app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/:users", async (req, res) => {
  const query = "SELECT * FROM users WHERE username = ?";
  Pool.query(query, [req.params.users], (error, results) => {
    if (!results[0]) {
      res.json({ status: "Not found!"});
    } else {
      res.json(results[0]);
    }
  });
});

const pool = mysql.createPool({
  ////host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
});
