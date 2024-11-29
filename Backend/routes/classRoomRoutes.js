const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createForm, getSignleForm, TeacherContinueForm } = require('../controllers/classroomWalkthrough');

router.post('/create',authMiddleware, createForm);
router.get('/get/:id',authMiddleware, getSignleForm);
router.post('/teacher/:id',authMiddleware, TeacherContinueForm);


module.exports = router;