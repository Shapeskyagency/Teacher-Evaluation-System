const express = require('express');
const router = express.Router();
const { register, login, requestPasswordReset, resetPassword, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware')

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);


router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.put('/change-password', authMiddleware, changePassword);


module.exports = router;



