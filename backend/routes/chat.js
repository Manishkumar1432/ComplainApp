const express = require('express');
const auth = require('../middleware/auth');
const ChatMessage = require('../models/ChatMessage');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const messages = await ChatMessage.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('sender', 'name email');

    res.json(messages.reverse());
  } catch (err) {
    console.error('Fetch chat messages error:', err.message);
    res.status(500).json({ msg: 'Server error while fetching chat messages' });
  }
});

router.post('/', auth, async (req, res) => {
  const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';

  if (!message) {
    return res.status(400).json({ msg: 'Message is required' });
  }

  try {
    const chatMessage = new ChatMessage({
      sender: req.user.id,
      message,
    });

    await chatMessage.save();
    await chatMessage.populate('sender', 'name email');

    res.status(201).json(chatMessage);
  } catch (err) {
    console.error('Create chat message error:', err.message);
    res.status(500).json({ msg: 'Server error while sending message' });
  }
});

module.exports = router;
