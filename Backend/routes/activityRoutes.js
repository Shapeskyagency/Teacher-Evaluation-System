const express = require("express");
const { getRecentActivities, CreateActivityModal, getSingleActivitiesModalById, getRecentActivitiesModal } = require("../controllers/activityController");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/create", authMiddleware, CreateActivityModal);

// GET API to fetch recent activities
router.get("/recent-activities", authMiddleware, getRecentActivities);
router.get("/get", authMiddleware, getRecentActivitiesModal);
router.get("/get/:id", authMiddleware, getSingleActivitiesModalById);

module.exports = router;
