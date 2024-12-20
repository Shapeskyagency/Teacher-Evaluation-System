const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createForm, getSignleForm, TeacherContinueForm, GetcreatedBy, GetTeacherForm } = require('../controllers/classroomWalkthrough');

router.post('/create',authMiddleware, createForm);
router.get('/get/:id',authMiddleware, getSignleForm);
router.post('/teacher/:id',authMiddleware, TeacherContinueForm);
router.get('/get',authMiddleware, GetcreatedBy);
router.get('/teachers/get',authMiddleware, GetTeacherForm);


module.exports = router;