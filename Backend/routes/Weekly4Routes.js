const express = require('express');
const { createWeekly4Form, getAllWeekly4Forms, getWeekly4FormById, updateWeekly4Form, deleteWeekly4Form, getAllweeklyForms } = require('../controllers/Weekly4Controller');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/weekly4Form/create',authMiddleware, createWeekly4Form);
router.get('/weekly4Forms',authMiddleware, getAllWeekly4Forms);
router.get('/weekly4Form/:id',authMiddleware, getWeekly4FormById);
router.put('/weekly4Form/:id',authMiddleware, updateWeekly4Form);
router.delete('/weekly4Form/:id',authMiddleware, deleteWeekly4Form);
router.get('/weekly4Form/get/all',authMiddleware, getAllweeklyForms);

module.exports = router;
