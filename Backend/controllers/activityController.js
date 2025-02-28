// const Activity = require("../models/Activity");

// // Recent Activities Fetch Karne Ka Function
// const getRecentActivities = async (req, res) => {
//   try {
//     const activities = await Activity.find().sort({ createdAt: -1 }).limit(10);
//     res.status(200).json(activities);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching activities", error });
//   }
// };

// module.exports = { getRecentActivities };

const Activity = require("../models/Activity");

const getRecentActivities = async (req, res) => {
  try {
    const userId = req?.user?.id; // JWT Middleware se userId lena

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    // Sirf usi user ki activities fetch karna
    const activities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "Error fetching activities", error });
  }
};

module.exports = { getRecentActivities };

