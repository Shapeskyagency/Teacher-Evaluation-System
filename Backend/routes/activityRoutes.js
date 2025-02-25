const express = require("express");
const { getRecentActivities } = require("../controllers/activityController");

const router = express.Router();

// GET API to fetch recent activities
router.get("/recent-activities", getRecentActivities);

module.exports = router;
