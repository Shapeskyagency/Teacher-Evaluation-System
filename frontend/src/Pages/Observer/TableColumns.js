import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

export const FormOne_Columns = [
  {
    title: "Observer Name",
    dataIndex: "coordinatorID",
    key: "coordinatorID",
    render: (coordinator) => <span>{coordinator?.name || "N/A"}</span>, // Display "N/A" if no coordinator name
  },
  {
    title: "Teacher Name",
    dataIndex: "userId",
    key: "userId",
    render: (user) => <span>{user?.name || "N/A"}</span>, // Display "N/A" if no teacher name
  },
  {
    title: "Class Name",
    dataIndex: "className",
    key: "className",
    render: (text) => <span>{text || "N/A"}</span>, // Display "N/A" if no class name
  },
  {
    title: "Section",
    dataIndex: "section",
    key: "section",
    render: (text) => <span>{text || "N/A"}</span>, // Display "N/A" if no section
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (date) => <span>{date ? new Date(date).toLocaleDateString() : "N/A"}</span>, // Display "N/A" if no date
  },
  {
    title: "Teacher Status",
    dataIndex: "isTeacherComplete",
    key: "isTeacherComplete",
    render: (isComplete) => (
      <span 
        style={{
          color: isComplete ? 'green' : 'red', 
          backgroundColor: 'transparent',
          padding: '2px 6px',
          borderRadius: '4px'
        }}
      >
        {isComplete ? "COMPLETED" : "NOT COMPLETED"}
      </span>
    ), // Render status based on `isTeacherComplete`
  },
  {
    title: "Observer Status",
    dataIndex: "isCoordinatorComplete",
    key: "isCoordinatorComplete",
    render: (isComplete) => (
      <span 
        style={{
        textWrap:"nowrap",
          color: isComplete ? 'green' : 'red', 
          backgroundColor: 'transparent',
          padding: '2px 6px',
          borderRadius: '4px'
        }}
      >
        {isComplete ? "COMPLETED" : "NOT COMPLETED"}
      </span>
    ), // Render status based on `isCoordinatorComplete`
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (text, record) => (
      <Link
        className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors"
        to={`/fortnightly-monitor/report/${record._id}`}
      >
       <button
       className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors"
       > View Report</button>
      </Link>
    ), // Action to view the report
  },
];
