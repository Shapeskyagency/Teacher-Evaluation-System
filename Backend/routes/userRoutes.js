const express = require('express');
const {createUser, getAllUsers, getUserById, updateUserById, deleteUserById, BulkUserCreate} = require('../controllers/userController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')


router.post('/create', authMiddleware, createUser);
router.get('/get', authMiddleware, getAllUsers);
router.get('/single/:userId', authMiddleware, getUserById);
router.put('/update/:userId', authMiddleware, updateUserById);
router.delete('/delete/:userId', authMiddleware, deleteUserById);
router.post('/bulk-upload', authMiddleware, BulkUserCreate);


module.exports = router;