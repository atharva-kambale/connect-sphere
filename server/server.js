// server/server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const { errorHandler } = require('./middleware/errorMiddleware.js');
const cors = require('cors');

const http = require('http');
const { Server } = require('socket.io');

const Message = require('./models/messageModel.js');
const Conversation = require('./models/conversationModel.js'); // We still need this

// --- Import API Routes ---
const userRoutes = require('./routes/userRoutes.js');
const listingRoutes = require('./routes/listingRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const conversationRoutes = require('./routes/conversationRoutes.js');

// --- Initial Setup ---
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://connect-sphere-lime.vercel.app',
    ],
    methods: ['GET', 'POST'],
  },
});

// --- Socket.io Logic ---
io.on('connection', (socket) => {
  console.log(`New WebSocket connection: ${socket.id}`);

  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room: ${roomName}`);
  });

  // --- THIS IS THE NEW, CORRECTED LOGIC ---
  socket.on('send_message', async (data) => {
    try {
      // 1. Get all the data we need from the payload
      const { listingId, participants, room, senderId, message } = data;

      // 2. Save the new message to the database
      const newMessage = new Message({
        room: room,
        sender: senderId,
        content: message,
      });
      const savedMessage = await newMessage.save();

      // 3. Find (or create) the Conversation
      // This is a simpler, more direct query.
      let conversation = await Conversation.findOne({
        listing: listingId,
        participants: { $all: participants },
      });

      if (conversation) {
        // If it exists, just update its 'lastMessage'
        conversation.lastMessage = savedMessage._id;
        await conversation.save();
      } else {
        // If it doesn't exist, create a new one
        await Conversation.create({
          listing: listingId,
          participants: participants,
          lastMessage: savedMessage._id,
        });
      }
      // --- END OF FIX ---

      // 4. Broadcast the message to the room
      socket.to(room).emit('receive_message', data);
      console.log(`Message saved and sent in room ${room}`);

    } catch (error) {
      // This will now show us any errors
      console.error('CRITICAL ERROR in send_message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// --- Express Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);

// --- Error Handler ---
app.use(errorHandler);

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});