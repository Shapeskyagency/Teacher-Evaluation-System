import React from 'react';
import { UserCircle, FileText, LayoutDashboard, LogOut, ClipboardCheck, BookOpen, ChevronDown, Activity } from 'lucide-react';
import { Card, List, Typography, Tag, Space } from "antd";

const { Title, Text } = Typography;

const RecentActivity = [
  { 
    id: 1, 
    type: 'Fortnightly Monitor',
    user: 'John Doe',
    action: 'Created new report',
    subject: 'Mathematics - Grade 10',
    time: '2 hours ago',
    status: 'Completed',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 2,
    type: 'Classroom Walkthrough',
    user: 'Sarah Johnson',
    action: 'Updated report',
    subject: 'Science - Grade 9',
    time: '4 hours ago',
    status: 'In Progress',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    id: 3,
    type: 'Notebook Checking',
    user: 'Mike Wilson',
    action: 'Completed review',
    subject: 'English - Grade 11',
    time: '1 day ago',
    status: 'Completed',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 4,
    type: 'Weekly Learning Checklist',
    user: 'Alice Brown',
    action: 'Started new checklist',
    subject: 'History - Grade 12',
    time: '1 day ago',
    status: 'In Progress',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
];

const stats = [
  { title: "Fortnightly Monitor", value: 24, change: "+12% this month", pending: 3, color: "#E6F7FF" },
  { title: "Classroom Walkthrough", value: 18, change: "+5% this month", pending: 5, color: "#FFF7E6" },
  { title: "Notebook Checking", value: 32, change: "+8% this month", pending: 7, color: "#F0F5FF" },
  { title: "Weekly Learning Checklist", value: 45, change: "+15% this month", pending: 4, color: "#F9F0FF" }
];
const ObserverDashboard = () => {
  return (
    <div className="flex min-h-screen ">

      <div className="flex-1 flex flex-col">
   
        <div className="flex-1 p-6">
    <div className='flex mb-3 flex-md-row flex-wrap'>
        {stats.map((stat, index) => (
          <div className='col-lg-3 col-md-6 col-1 px-2 mb-3 flex'>
          <div className='p-3 rounded-md w-100 ' key={index}  style={{ background: stat.color }}>
            <div className='flex gap-2 justify-between'>
            <div className='d-flex flex-col'>
              <Title level={5}>{stat.title}</Title>
            <Title level={4} className='m-0'>{stat.value}</Title></div>
            <div className='d-flex justify-between flex-col'><Text style={{fontSize:'10px'}} >{stat.change}</Text>
            <Text style={{ fontSize:'10px' }}>Pending: {stat.pending}</Text>
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
            <div className="divide-y divide-gray-100">
              {RecentActivity.map(activity => (
                <div key={activity.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`${activity.bgColor} ${activity.color} text-sm font-medium px-2 py-1 rounded`}>
                        {activity.type}
                      </span>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                    <span className={`text-sm ${activity.status === 'Completed' ? 'text-green-600' : 'text-orange-600'}`}>
                      {activity.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-gray-500"> {activity.action}</span>
                      <span className="text-gray-700"> - {activity.subject}</span>
                    </div>
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


