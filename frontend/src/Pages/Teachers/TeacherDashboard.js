import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UserCircle,
  FileText,
  LayoutDashboard,
  LogOut,
  ClipboardCheck,
  BookOpen,
  ChevronDown,
  Activity,
} from "lucide-react";
import { Card, List, Typography, Tag, Space } from "antd";
import { getRecentActivities, getSingleActivityApi } from "../../redux/Activity/activitySlice";
import { getUserId } from "../../Utils/auth";

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
const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const [FromOne, setFromOne] = useState('');
  const [FromTwo, setFromTwo] = useState('');
  const UserId = getUserId()?.id;
  useEffect(() => {
    const payload = {
      id: UserId,
      fromNo: 1,
    }
    const payload2 = {
      id: UserId,
      fromNo: 2,
    }
    dispatch(getRecentActivities());
      dispatch(getSingleActivityApi(payload)).unwrap().then((res) => {
        setFromOne(res?.activities);
      });
      //
      //  
      dispatch(getSingleActivityApi(payload2)).unwrap().then((res) => {
        setFromTwo(res?.activities);
      }
      );
  }, [dispatch]);


  const recentEntrySort = (activities) =>{
    if (!activities || activities.length === 0) {
      return null; // Return null if array is empty
    }
    
    return [...activities] // Create a copy to avoid mutating the original array
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0]; // Get the most recent entry
  };

  const recentEntry = recentEntrySort(FromOne);
  const recentEntry2 = recentEntrySort(FromTwo);
  return (
    <div className="flex min-h-screen ">
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
          {/* <Space size="middle" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap",marginBottom:20 }}>
       
      </Space> */}
          <div className="bg-white rounded-lg ">
            <div className="border-b px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-400" />
                <h3 className="font-medium">Recent Activity</h3>
              </div>
            </div>
            <div className="p-4 hover:bg-gray-50">
                  <div className="flex  items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-50 text-green-600 text-sm font-medium px-2 py-1 rounded">
                      Fortnightly Monitor
                      </span>
                      <span className="text-sm text-gray-500">
                        {recentEntry?.createdAt === recentEntry?.updatedAt ? (
                          <>
                            Created At:{" "}
                            {new Date(recentEntry?.createdAt).toLocaleString()}
                          </>
                        ) : (
                          <>
                            Last Updated:{" "}
                            {new Date(recentEntry?.updatedAt).toLocaleString()}
                          </>
                        )}
                      </span>
                    </div>
                   
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-700">
                      {recentEntry?.teacherMessage}
                      </span>
                    </div>
                  </div>
                </div>
       
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
