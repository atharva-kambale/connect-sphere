// server/routes/uploadRoutes.js

const express = require('express');
const multer = require('multer');
const { storage } = require('../utils/cloudinaryStorage.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Initialize multer with our Cloudinary storage
const upload = multer({ storage: storage });

// --- THIS IS THE UPGRADE ---
// We changed .single('image') to .array('images', 5)
// 'images' is the field name we'll use in the frontend.
// 5 is the maximum number of files allowed.
router.post('/', protect, upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  // req.files is now an array. We map over it to get all the URLs.
  const imageUrls = req.files.map((file) => file.path);

  res.status(200).json({
    message: 'Images uploaded successfully',
    imageUrls: imageUrls, // Send back the array of URLs
  });
});
// --- END OF UPGRADE ---

module.exports = router;