// server/routes/uploadRoutes.js

const express = require('express');
const multer = require('multer');
const { storage } = require('../utils/cloudinaryStorage.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Initialize multer with our Cloudinary storage
const upload = multer({ storage: storage });

// Create the upload route
// This will handle POST requests to '/api/upload'
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  
  // 'req.file.path' is the secure URL from Cloudinary
  res.status(200).json({
    message: 'Image uploaded successfully',
    imageUrl: req.file.path,
  });
});

module.exports = router;