const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for messages (fallback when MongoDB is not available)
let inMemoryMessages = [];

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp';
let isMongoConnected = false;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    isMongoConnected = true;
  })
  .catch(err => {
    console.log('MongoDB not available, using in-memory storage');
    console.log('To use MongoDB, ensure it is running or use MongoDB Atlas');
    isMongoConnected = false;
  });

// Message Schema
const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Helper functions for message storage
const saveMessage = async (messageData) => {
  if (isMongoConnected) {
    const newMessage = new Message(messageData);
    return await newMessage.save();
  } else {
    // In-memory storage
    const message = {
      ...messageData,
      timestamp: new Date(),
      _id: Date.now().toString()
    };
    inMemoryMessages.push(message);
    // Keep only last 50 messages in memory
    if (inMemoryMessages.length > 50) {
      inMemoryMessages = inMemoryMessages.slice(-50);
    }
    return message;
  }
};

const getMessages = async () => {
  if (isMongoConnected) {
    return await Message.find().sort({ timestamp: 1 }).limit(50);
  } else {
    return inMemoryMessages.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }
};

// Routes
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await getMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { username, message } = req.body;
    const newMessage = await saveMessage({ username, message });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: isMongoConnected ? 'MongoDB' : 'In-Memory',
    timestamp: new Date()
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    socket.username = username;
    socket.broadcast.emit('userJoined', username);
    console.log(`${username} joined the chat`);
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { username, message } = data;
      const newMessage = await saveMessage({ username, message });
      
      // Emit to all connected clients
      io.emit('newMessage', newMessage);
      console.log(`Message from ${username}: ${message}`);
    } catch (error) {
      socket.emit('error', error.message);
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      socket.broadcast.emit('userLeft', socket.username);
      console.log(`${socket.username} left the chat`);
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database: ${isMongoConnected ? 'MongoDB' : 'In-Memory Storage'}`);
  console.log(`Visit http://localhost:3000 to use the chat app`);
});