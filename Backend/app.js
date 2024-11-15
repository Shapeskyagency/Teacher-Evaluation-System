const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
require('dotenv').config();
const cors = require('cors')
const app = express();
app.use(cors({
    // credentials: true,
    origin: ['https://teacher-evaluation-system-nine.vercel.app',"http://localhost:3000"],  // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  // Allow these HTTP methods
    allowedHeaders: 'Content-Type,Authorization',  // Allow these headers
}));


// app.use(cors())

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter)

module.exports = app;
