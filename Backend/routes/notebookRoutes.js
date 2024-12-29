const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createForm, getSignleForm, updateObserverFields, GetcreatedByID, GetObseverForm, EditUpdateNotebook } = require('../controllers/NotebookCheckingController');


router.post('/create', authMiddleware, createForm);
router.get('/get/:id', authMiddleware, getSignleForm);
router.post('/observer/:id', authMiddleware, updateObserverFields);
router.get('/get', authMiddleware, GetcreatedByID);
router.get('/observer/get', authMiddleware, GetObseverForm);
router.put('/observer/edit/:id', authMiddleware, EditUpdateNotebook);


module.exports = router;