const Activity = require("../models/Activity");

// Recent Activities Fetch Karne Ka Function
const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching activities", error });
  }
};

module.exports = { getRecentActivities };
