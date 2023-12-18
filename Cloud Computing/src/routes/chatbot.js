// chatbot.js

const express = require('express');
const router = express.Router();
const db = require('./chat');

// Send message
router.post('/send_message', async (req, res) => {
  const { user_id, message } = req.body;

  try {
    const response = await db.sendMessage(user_id, message);
    res.status(200).json({ message: 'Message sent successfully', response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get response
router.post('/get_response', async (req, res) => {
  const { user_id, message } = req.body;

  try {
    const response = await db.getResponse(user_id, message);
    res.status(200).json({ message: 'Response retrieved successfully', response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
