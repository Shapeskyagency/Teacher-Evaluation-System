import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecentActivities } from "../../redux/Activity/activitySlice";
import { Activity } from "lucide-react";
import { Typography } from "antd";

const { Title, Text } = Typography;

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

const fallbackRecentActivities = [
  {
    _id: "1",
    title: "Classroom Walkthrough",
    form1: { message: "Reviewed student engagement." },
    createdAt: "2024-02-25T10:30:00",
  },
  {
    _id: "2",
    title: "Notebook Checking",
    form1: { message: "Checked homework completion." },
    createdAt: "2024-02-24T15:45:00",
  },
  {
    _id: "3",
    title: "Weekly Learning Checklist",
    form1: { message: "Monitored student progress." },
    createdAt: "2024-02-23T12:15:00",
  },
];

const ObserverDashboard = () => {
  const dispatch = useDispatch();
  const { activities } = useSelector((state) => state.activity);

  useEffect(() => {
    dispatch(getRecentActivities());
  }, [dispatch]);

  // **Static + Dynamic Merge with Unique Activities**
  const mergedActivities = [
    ...activities,
    ...fallbackRecentActivities.filter(
      (staticActivity) =>
        !activities.some((dynamicActivity) => dynamicActivity.title === staticActivity.title)
    ),
  ];

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6">
          {/* Top Four Cards */}
          <div className="flex mb-3 flex-md-row flex-wrap">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="col-lg-3 col-md-6 col-1 px-2 mb-3 flex"
              >
                <div
                  className="p-3 rounded-md w-100"
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
          <div className="bg-white rounded-lg">
            <div className="border-b px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-400" />
                <h3 className="font-medium">Recent Activity</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {mergedActivities.map((activity) => (
                <div key={activity._id} className="p-4 hover:bg-gray-50">
                  {/* Title Section */}
                  <h4 className="text-sm font-semibold text-blue-600 mb-1">
                    {activity.title}
                  </h4>

                  {/* Message and Time */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 font-medium">
                      {activity.form1.message}
                    </span>
                    <span className="text-sm text-green-500">
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>  
        </div>
      </div>
    </div>
  );
};

export default ObserverDashboard;
