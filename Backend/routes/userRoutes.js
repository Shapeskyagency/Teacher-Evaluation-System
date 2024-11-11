const express = require('express');
const createUser = require('../controllers/userController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')


router.post('/create', authMiddleware, createUser);


module.exports = router;