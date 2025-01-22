const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { Server } = require('socket.io');
const http = require('http');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const Message = require('./models/Chat/Message.models');
const connectDb = require('./config');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://192.168.43.34:8081', // Adjust the origin if needed
    methods: ['GET', 'POST'],
  },
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dkfakg7mw',
  api_key: '472725881526577',
  api_secret: 'j5oQTkwakGjAq8jLCcDGiO2s7jM',
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// Database connection and routes
connectDb()
  .then(() => {
    // Define API routes
    app.use('/api/users', require('./routes/userRegistration.routes'));
    app.use('/api/chat/doctorsRegistration', require('./routes/Chat/doctorsRegistration.routes'));
    app.use('/api/ai/skinType', require('./routes/AI/SkinType.routes'));

    // Middleware for socket authentication
    io.use((socket, next) => {
      const token = socket.handshake.auth.token; // Token sent via `auth` in handshake
      if (!token) {
        return next(new Error('Authentication error: Token not provided'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.senderId = decoded.id; // Attach the sender ID to the socket object
        next();
      } catch (err) {
        next(new Error('Authentication error: Invalid or expired token'));
      }
    });

    // Real-Time Chat - Socket handler
    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}, Sender ID: ${socket.senderId}`);

      // Send Message Event
      socket.on('sendMessage', async (data) => {
        try {
          const senderId = socket.senderId; // Sender ID from authenticated socket
          const { receiver, text, timestamp } = data;
          console.log('Sender:', senderId);
          console.log('Receiver:', receiver);

          // Validate IDs
          if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiver)) {
            console.error('Invalid sender or receiver ID');
            return;
          }

          // Save the message to the database
          const message = new Message({
            sender: senderId,
            receiver,
            content: text,
            timestamp,
          });

          await message.save();
          console.log('Message saved');

          // Emit the saved message back to the sender
          socket.emit('messageSaved', message);

          // Emit the message to the receiver
          io.to(receiver).emit('newMessage', message);
        } catch (err) {
          console.error('Error in sendMessage:', err);
        }
      });

      // Disconnect Event
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });

    // Start server
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });
