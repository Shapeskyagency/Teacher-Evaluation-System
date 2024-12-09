const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createFormFinal } = require('../controllers/FinalFormController');

router.post('/create',authMiddleware, createFormFinal);


module.exports = router;