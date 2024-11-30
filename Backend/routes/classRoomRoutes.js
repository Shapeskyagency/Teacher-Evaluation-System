const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createForm, getSignleForm, TeacherContinueForm, GetcreatedBy } = require('../controllers/classroomWalkthrough');

router.post('/create',authMiddleware, createForm);
router.get('/get/:id',authMiddleware, getSignleForm);
router.post('/teacher/:id',authMiddleware, TeacherContinueForm);
router.get('/get',authMiddleware, GetcreatedBy);


module.exports = router;