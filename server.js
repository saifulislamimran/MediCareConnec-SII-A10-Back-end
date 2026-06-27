const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime(),
    dbState: ['disconnected', 'connected', 'connecting', 'disconnecting'][require('mongoose').connection.readyState]
  });
});

const authRoutes = require('./routes/authRoutes');

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to MediCare Connect API Gateway.');
});

// Routes mount
app.use('/api/auth', authRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
