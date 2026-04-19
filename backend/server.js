const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');
const ChatMessage = require('./models/ChatMessage');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.use((socket, next) => {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers['x-auth-token'];

  if (!token) {
    return next(new Error('Unauthorized'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded.user;
    return next();
  } catch (err) {
    return next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  socket.join('global-chat');
  socket.emit('chat:ready', { userId: socket.user.id });

  socket.on('chat:message', async (payload, ack) => {
    const rawMessage = typeof payload?.message === 'string' ? payload.message : '';
    const message = rawMessage.trim();

    if (!message) {
      if (typeof ack === 'function') {
        ack({ ok: false, msg: 'Message is required' });
      }
      return;
    }

    try {
      const savedMessage = new ChatMessage({
        sender: socket.user.id,
        message,
      });

      await savedMessage.save();
      await savedMessage.populate('sender', 'name email');

      const responseMessage = {
        _id: savedMessage._id,
        sender: savedMessage.sender,
        message: savedMessage.message,
        createdAt: savedMessage.createdAt,
      };

      io.to('global-chat').emit('chat:message', responseMessage);

      if (typeof ack === 'function') {
        ack({ ok: true });
      }
    } catch (err) {
      console.error('Realtime chat message error:', err.message);
      if (typeof ack === 'function') {
        ack({ ok: false, msg: 'Could not send message' });
      }
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/chat', require('./routes/chat'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ msg: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));