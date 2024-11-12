const express = require('express');
const {createUser, getAllUsers} = require('../controllers/userController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')


router.post('/create', authMiddleware, createUser);
router.get('/get', authMiddleware, getAllUsers);


module.exports = router;