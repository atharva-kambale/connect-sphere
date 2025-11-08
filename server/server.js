// server/server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const { errorHandler } = require('./middleware/errorMiddleware.js');
const cors = require('cors'); // 1. --- IMPORT CORS (NEW) ---

// --- Import Routes ---
const userRoutes = require('./routes/userRoutes.js');
const listingRoutes = require('./routes/listingRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');

dotenv.config();
connectDB();

const app = express();

// --- 2. USE CORS (NEW) ---
// This MUST be near the top, before your routes
app.use(cors());
// -------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- Use Routes ---
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/upload', uploadRoutes);

// Use the error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});