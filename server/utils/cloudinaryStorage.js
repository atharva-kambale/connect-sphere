// server/utils/cloudinaryStorage.js

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ConnectSphere', // This will create a 'ConnectSphere' folder in Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg'], // Restrict file types
    transformation: [{ width: 800, height: 800, crop: 'limit' }], // Resize images
  },
});

module.exports = {
  cloudinary,
  storage,
};