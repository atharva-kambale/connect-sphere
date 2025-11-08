// server/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // The options { useNewUrlParser, useUnifiedTopology } are no longer needed
    // in modern versions of Mongoose. We can simplify the connection.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;