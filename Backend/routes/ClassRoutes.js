const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createClassDetail, getAllClassDetails, getClassDetailById, updateClassDetailById, deleteClassDetailById } = require('../controllers/ClassDetailsController');

router.post('/create',authMiddleware, createClassDetail);
router.get('/get',authMiddleware, getAllClassDetails);
router.get('/get/:id',authMiddleware, getClassDetailById);
router.put('/update/:id',authMiddleware, updateClassDetailById);
router.delete('/delete/:id',authMiddleware, deleteClassDetailById);



module.exports = router;