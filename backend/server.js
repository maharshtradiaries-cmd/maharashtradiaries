const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://maharashtra-diaries.vercel.app'] // Replace with actual production URL
    : true, // Allow all in development
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/otp', require('./routes/otp'));
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/trips', require('./routes/trips'));


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Maharashtra Diaries API is running!' });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/maharashtra_diaries';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    console.log(`📦 Database: ${MONGODB_URI}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Make sure MongoDB is running. If using MongoDB Compass, ensure the connection is active.');
  });

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
