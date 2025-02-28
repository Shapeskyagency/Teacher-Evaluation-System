const express = require("express");
const { getRecentActivities } = require("../controllers/activityController");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET API to fetch recent activities
router.get("/recent-activities", authMiddleware, getRecentActivities);

module.exports = router;
