import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "antd";
import { getRecentActivities } from "../../redux/Activity/activitySlice";

const { Title, Text } = Typography;

const RecentActivity = [
  {
    id: 1,
    type: "Fortnightly Monitor",
    user: "John Doe",
    action: "Created new report",
    subject: "Mathematics - Grade 10",
    time: "2 hours ago",
    status: "Completed",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 2,
    type: "Classroom Walkthrough",
    user: "Sarah Johnson",
    action: "Updated report",
    subject: "Science - Grade 9",
    time: "4 hours ago",
    status: "In Progress",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: 3,
    type: "Notebook Checking",
    user: "Mike Wilson",
    action: "Completed review",
    subject: "English - Grade 11",
    time: "1 day ago",
    status: "Completed",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 4,
    type: "Weekly Learning Checklist",
    user: "Alice Brown",
    action: "Started new checklist",
    subject: "History - Grade 12",
    time: "1 day ago",
    status: "In Progress",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

const stats = [
  {
    title: "Fortnightly Monitor",
    value: 24,
    change: "+12% this month",
    pending: 3,
    color: "#E6F7FF",
  },
  {
    title: "Classroom Walkthrough",
    value: 18,
    change: "+5% this month",
    pending: 5,
    color: "#FFF7E6",
  },
  {
    title: "Notebook Checking",
    value: 32,
    change: "+8% this month",
    pending: 7,
    color: "#F0F5FF",
  },
  {
    title: "Weekly Learning Checklist",
    value: 45,
    change: "+15% this month",
    pending: 4,
    color: "#F9F0FF",
  },
];

const ObserverDashboard = () => {
  const dispatch = useDispatch();
  const { activities: dynamicActivities, loading } = useSelector(
    (state) => state.activity
  );

  useEffect(() => {
    dispatch(getRecentActivities()).then((res) => {
      console.log("API Response:", res.payload);
    });
  }, [dispatch]);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6">
          <div className="flex mb-3 flex-md-row flex-wrap">
            {stats.map((stat, index) => (
              <div className="col-lg-3 col-md-6 col-1 px-2 mb-3 flex">
                <div
                  className="p-3 rounded-md w-100 "
                  key={index}
                  style={{ background: stat.color }}
                >
                  <div className="flex gap-2 justify-between">
                    <div className="d-flex flex-col">
                      <Title level={5}>{stat.title}</Title>
                      <Title level={4} className="m-0">
                        {stat.value}
                      </Title>
                    </div>
                    <div className="d-flex justify-between flex-col">
                      <Text style={{ fontSize: "10px" }}>{stat.change}</Text>
                      <Text style={{ fontSize: "10px" }}>
                        Pending: {stat.pending}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Recent Activity Section */}
          <div className="mb-4">
            <Title level={4} className="text-gray-700">
              Fortnightly Monitor Recent Activity
            </Title>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="text-center p-4">Loading...</div>
            ) : dynamicActivities.length === 0 ? (
              <div className="text-center p-4 text-gray-500">
                No recent activities found.
              </div>
            ) : (
              dynamicActivities.map((activity, index) => (
                <div
                  key={activity._id || index}
                  className="p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`bg-green-50 text-green-600 text-sm font-medium px-2 py-1 rounded`}
                      >
                        {activity.type || "Activity"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {activity.createdAt
                          ? new Date(activity.createdAt).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                    <span className="text-sm text-green-600">
                      {activity.status || "Completed"}
                    </span>
                  </div>

                  {/* Display Message for Each Activity Dynamically */}
                  {activity.form1?.message && (
                    <div className="text-green-600 text-sm mt-2">
                      <strong>Message:</strong> {activity.form1.message}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObserverDashboard;
