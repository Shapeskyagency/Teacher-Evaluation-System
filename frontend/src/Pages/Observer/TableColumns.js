import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

export const FormOne_Columns = [
  {
    title: "Observer Name",
    dataIndex: "coordinatorID",
    key: "coordinatorID",
    sorter: (a, b) => (a.coordinatorID?.name || "").localeCompare(b.coordinatorID?.name || ""),
    render: (coordinator) => <span>{coordinator?.name || "N/A"}</span>,
  },
  {
    title: "Teacher Name",
    dataIndex: "teacherID",
    key: "teacherID",
    sorter: (a, b) => (a?.name || "").localeCompare(b.teacherID?.name || ""),
    render: (user) => <span>{user?.name || "N/A"}</span>,
  },
  {
    title: "Class Name",
    dataIndex: "className",
    key: "className",
    sorter: (a, b) => (a.className || "").localeCompare(b.className || ""),
    filters: [
      { text: "Class A", value: "Class A" },
      { text: "Class B", value: "Class B" },
      { text: "Class C", value: "Class C" },
    ],
    onFilter: (value, record) => record.className === value,
    render: (text) => <span>{text || "N/A"}</span>,
  },
  {
    title: "Section",
    dataIndex: "section",
    key: "section",
    filters: [
      { text: "A", value: "A" },
      { text: "B", value: "B" },
      { text: "C", value: "C" },
    ],
    onFilter: (value, record) => record.section === value,
    render: (text) => <span>{text || "N/A"}</span>,
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    sorter: (a, b) => new Date(a.date) - new Date(b.date),
    render: (date) => <span>{date ? new Date(date).toLocaleDateString() : "N/A"}</span>,
  },
  {
    title: "Teacher Status",
    dataIndex: "isTeacherComplete",
    key: "isTeacherComplete",
    filters: [
      { text: "Completed", value: true },
      { text: "Not Completed", value: false },
    ],
    onFilter: (value, record) => record.isTeacherComplete === value,
    render: (isComplete) => (
      <span 
        style={{
          color: isComplete ? 'green' : 'red', 
          padding: '2px 6px',
          borderRadius: '4px'
        }}
      >
        {isComplete ? "COMPLETED" : "NOT COMPLETED"}
      </span>
    ),
  },
  {
    title: "Observer Status",
    dataIndex: "isCoordinatorComplete",
    key: "isCoordinatorComplete",
    filters: [
      { text: "Completed", value: true },
      { text: "Not Completed", value: false },
    ],
    onFilter: (value, record) => record.isCoordinatorComplete === value,
    render: (isComplete) => (
      <span 
        style={{
          color: isComplete ? 'green' : 'red', 
          padding: '2px 6px',
          borderRadius: '4px'
        }}
      >
        {isComplete ? "COMPLETED" : "NOT COMPLETED"}
      </span>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (text, record) => (
      <Link
        to={`/fortnightly-monitor/report/${record._id}`}
      >
        <button
          className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors"
        >
          View Report
        </button>
      </Link>
    ),
  },
];
