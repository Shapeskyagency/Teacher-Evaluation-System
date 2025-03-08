const express = require('express');
const router = express.Router();
const wingCoordinatorController = require('../controllers/wingCoordinatorController');
const authMiddleware = require('../middleware/authMiddleware');

// CRUD routes
router.post('/', authMiddleware, wingCoordinatorController.createWingCoordinator);
router.get('/', authMiddleware, wingCoordinatorController.getWingCoordinators);
router.get('/:id', authMiddleware, wingCoordinatorController.getWingCoordinatorById);
router.put('/:id', authMiddleware, wingCoordinatorController.updateWingCoordinator);
router.delete('/:id', authMiddleware, wingCoordinatorController.deleteWingCoordinator);

module.exports = router;
 