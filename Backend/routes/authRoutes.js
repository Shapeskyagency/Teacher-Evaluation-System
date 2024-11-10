const express = require('express');
const router = express.Router();
const { register, login, requestPasswordReset, resetPassword } = require('../controllers/authController');

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);


router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
module.exports = router;
