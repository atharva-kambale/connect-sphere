// server/server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const { errorHandler } = require('./middleware/errorMiddleware.js');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// --- Import Security/Sanitization Modules (NEW) ---
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
// --- End Security Imports ---

const Message = require('./models/messageModel.js');
const Conversation = require('./models/conversationModel.js');

// --- Import API Routes ---
const userRoutes = require('./routes/userRoutes.js');
const listingRoutes = require('./routes/listingRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const conversationRoutes = require('./routes/conversationRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');

// --- Initial Setup ---
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      // For Production, we will update this to your Vercel URL
      'https://connect-sphere-lime.vercel.app', 
    ],
    methods: ['GET', 'POST'],
  },
});

// --- Socket.io Logic (Unchanged) ---
io.on('connection', (socket) => {
  console.log(`New WebSocket connection: ${socket.id}`);

  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room: ${roomName}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const { listingId, participants, room, senderId, message } = data;

      const newMessage = new Message({
        room: room,
        sender: senderId,
        content: message,
      });
      const savedMessage = await newMessage.save();

      let conversation = await Conversation.findOne({
        listing: listingId,
        participants: { $all: participants },
      });

      if (conversation) {
        conversation.lastMessage = savedMessage._id;
        await conversation.save();
      } else {
        await Conversation.create({
          listing: listingId,
          participants: participants,
          lastMessage: savedMessage._id,
        });
      }

      socket.to(room).emit('receive_message', data);
      console.log(`Message saved in room ${room}`);

    } catch (error) {
      console.error('CRITICAL ERROR in send_message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// --- EXPRESS MIDDLEWARE (SECURITY HARDENING) ---
// 1. HTTP Security Headers
app.use(helmet()); 

// 2. Body Parser
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS attacks
app.use(express.urlencoded({ extended: false }));

// 3. Data Sanitization (NoSQL Query Injection Prevention)
app.use(mongoSanitize());

// 4. Prevent Parameter Pollution (HPP)
app.use(hpp()); 

// 5. CORS (Allow frontend access)
app.use(cors()); 

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
app.use('/api/reviews', reviewRoutes);

// --- Error Handler ---
app.use(errorHandler);

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});