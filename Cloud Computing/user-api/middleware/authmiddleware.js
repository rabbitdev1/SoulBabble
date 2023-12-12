const dotenv = require("dotenv");
// authMiddleware.js
const jwt = require('jsonwebtoken');
// const { secretKey } = require('./config');

function authMiddleware(req, res, next) {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Missing token' });
  }

  // console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
  // try {
  //   let decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = decoded;
  //   next();
  // } catch (error) {
  //   console.error(error.message);
  //   return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  // }
  // let decoded;
  // try {
  //   decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = decoded;
  //   next();
  // } catch (err) {
  //   console.error('JWT verification failed', err);
  //   // Handle the error appropriately in your application
  // }
}

module.exports = authMiddleware;
