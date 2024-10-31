// public/database.js
const mongoose = require('mongoose');
const uri = 'mongodb+srv://evanramos1983:Whosane1_@cluster0.xx2f8.mongodb.net/';

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
