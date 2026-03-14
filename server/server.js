// server/server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const { errorHandler } = require('./middleware/errorMiddleware.js');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const Message = require('./models/messageModel.js');
const Conversation = require('./models/conversationModel.js');
const User = require('./models/userModel.js');
const Notification = require('./models/notificationModel.js');

// --- Import API Routes ---
const userRoutes = require('./routes/userRoutes.js');
const listingRoutes = require('./routes/listingRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const conversationRoutes = require('./routes/conversationRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const notificationRoutes = require('./routes/notificationRoutes.js');

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

// Socket.io "Middleware"
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) { return next(new Error('Authentication error: No token')); }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) { return next(new Error('Authentication error: User not found')); }
    socket.user = user;
    next();
  } catch (error) {
    return next(new Error('Authentication error: Token invalid'));
  }
});

// --- Socket.io Logic ---
io.on('connection', (socket) => {
  console.log(`New WebSocket connection: ${socket.id}`);
  
  socket.join(socket.user._id.toString());
  console.log(`Socket ${socket.id} joined user room: ${socket.user._id}`);
  socket.emit('connected');

  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined chat room: ${roomName}`);
  });

  // --- THIS IS THE FIX ---
  socket.on('send_message', async (data) => {
    try {
      // 'data.senderName' will now be correctly received
      const { listingId, participants, room, senderId, message, senderName } = data;

      // 1. Save Message
      const newMessage = new Message({ room: room, sender: senderId, content: message });
      const savedMessage = await newMessage.save();

      // 2. Find/Create Conversation
      const conversation = await Conversation.findOneAndUpdate(
        { listing: listingId, participants: { $all: participants } },
        { $set: { participants: participants, listing: listingId, lastMessage: savedMessage._id } },
        { upsert: true, new: true }
      );

      // 3. Broadcast to chat room
      // We also send 'senderName' to the chat room
      socket.to(room).emit('receive_message', { ...data, sender: senderName }); 
      
      // 4. Create/Send Notification
      const recipientId = participants.find(id => id !== senderId);
      const chatUrl = `/chat/${listingId}/${participants.sort().join('/')}`;
      
      if (recipientId) {
        const notification = new Notification({
          user: recipientId,
          sender: senderId,
          senderName: senderName, // This value is now correct
          conversation: conversation._id,
          linkUrl: chatUrl,
          message: `New message from ${senderName}: "${message.substring(0, 20)}..."`,
        });
        await notification.save(); // This will no longer fail

        // Send live socket notification
        io.to(recipientId).emit('new_message_notification', {
          message: notification.message,
          linkUrl: chatUrl,
          senderName: senderName,
        });
        console.log(`Notification created and sent to room: ${recipientId}`);
      }
    } catch (error) {
      console.error('CRITICAL ERROR in send_message:', error);
    }
  });
  // --- END OF FIX ---

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// --- Express Middleware (no change) ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

// --- API Routes (no change) ---
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);

// --- Error Handler (no change) ---
app.use(errorHandler);

// --- Start Server (Updated for Render) ---
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});