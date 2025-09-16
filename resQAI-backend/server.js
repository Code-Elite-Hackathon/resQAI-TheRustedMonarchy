// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// CORS middleware - This is the crucial part for your frontend to connect!
app.use(cors({
  origin: 'http://localhost:5173' // Your frontend's origin
}));

// Mount router
app.use('/api', require('./routes/resqai'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));