const express = require('express');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const formRouts = require('./routes/formRoutes');
const classRoomRoutes = require('./routes/classRoomRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const notebookRoutes = require('./routes/notebookRoutes');
const finalFormRoutes = require('./routes/finalFormRoutes');
const ClassRoutes = require('./routes/ClassRoutes');
const Weekly4Routes = require('./routes/Weekly4Routes');
const activityRoutes = require('./routes/activityRoutes');
const wingCoordinatorRoutes = require('./routes/wingCoordinatorRoutes');
const deleteRoutes = require('./routes/deleteRoutes')
require('dotenv').config();
const cors = require('cors');

const app = express();

// Create a basic log file stream (optional but useful)
const logStream = fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' });
const log = (type, ...args) => {
  const message = `[${new Date().toISOString()}] [${type}] ${args.join(' ')}\n`;
  logStream.write(message);
  console[type === 'ERROR' ? 'error' : 'log'](...args);
};

// Global error handlers
process.on('uncaughtException', (err) => {
  log('ERROR', 'Uncaught Exception:', err.stack || err);
  // Optionally exit the process: process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log('ERROR', 'Unhandled Rejection:', reason);
  // Optionally exit the process: process.exit(1);
});

// Connect to MongoDB
connectDB();

// CORS setup
app.use(cors({
  origin: process.env.APP_URL,
  headers: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRouter);
app.use('/api/form', formRouts);
app.use('/api/notification', notificationRoutes);
app.use('/api/classroom-walkthrough', classRoomRoutes);
app.use('/api/notebook-checking-proforma', notebookRoutes);
app.use('/api/wing-coordinator', finalFormRoutes);
app.use('/api/class', ClassRoutes);
app.use('/api', Weekly4Routes);
app.use('/api/activity', activityRoutes);
app.use('/api/wing-coordinator', wingCoordinatorRoutes);
app.use('/api/delete', deleteRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      message: 'Server is healthy',
      uptime: process.uptime(),
      timestamp: new Date(),
    });
  });
  

// Export app
module.exports = app;
