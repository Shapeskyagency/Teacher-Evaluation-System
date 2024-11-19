const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getNotification } = require('../controllers/notificationController');


router.get('/get', authMiddleware, getNotification);


module.exports = router;