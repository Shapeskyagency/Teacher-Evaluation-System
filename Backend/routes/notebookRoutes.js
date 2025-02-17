const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createForm, getSignleForm, updateObserverFields, GetcreatedByID, GetObseverForm, EditUpdateNotebook, createInitiate, GetNootbookForms, updateTeacherReflationFeedback, ReminderFormThree } = require('../controllers/NotebookCheckingController');


router.post('/create', authMiddleware, createForm);
router.post('/createInitiate', authMiddleware, createInitiate);
router.get('/get/:id', authMiddleware, getSignleForm);
router.post('/observer/:id', authMiddleware, updateObserverFields);
router.get('/get', authMiddleware, GetcreatedByID);
router.get('/observer/get', authMiddleware, GetObseverForm);
router.put('/observer/edit/:id', authMiddleware, EditUpdateNotebook);
router.get('/get-all', authMiddleware, GetNootbookForms);
router.put('/teacher/reflation/:id', updateTeacherReflationFeedback);
router.post('/reminder/:id', authMiddleware, ReminderFormThree);


module.exports = router;