const express = require('express');
const router = express.Router();
const { register, login, requestPasswordReset, resetPassword, changePassword, FromCount, getFillterForms } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware')

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);


router.post('/request-password-reset', requestPasswordReset);
router.put('/change-password', authMiddleware, changePassword);
router.get('/form-data',authMiddleware, FromCount);
router.post('/getFilteredData',authMiddleware, getFillterForms);


module.exports = router;



