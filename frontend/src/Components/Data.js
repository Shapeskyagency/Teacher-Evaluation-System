import { Button, Space, Tag } from "antd";
import { Link } from "react-router-dom";
import {
  AppstoreAddOutlined,
  BookFilled,
  FormOutlined,
  PieChartOutlined,
  SignatureOutlined,
  UserAddOutlined,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { getAllTimes, getUserId } from "../Utils/auth";
import { UserRole } from "../config/config";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// import { SiGoogleclassroom } from "react-icons/si";

const Role = getUserId()?.access;

export const Menu = {
  Superadmin: [
    { name: "Dashboard", route: "/dashboard", icon: <AppstoreAddOutlined /> },
    { name: "Reports", route: "/reports", icon: <PieChartOutlined /> },
    { name: "User", route: "/users", icon: <UserAddOutlined /> },
    { name: "Profile", route: "/profile", icon: <UserOutlined /> },
    { label: "Forms" },
    {
      name: "Fortnightly Monitor",
      route: "/fortnightly-monitor",
      icon: <FormOutlined />,
    },
    {
      name: "Classroom Walkthrough",
      route: "/classroom-walkthrough",
      icon: <SignatureOutlined />,
    },
    {
      name: "Notebook Checking",
      route: "/notebook-checking-proforma",
      icon: <BookFilled />,
    },
  ],
  Observer: [
    { name: "Dashboard", route: "/dashboard", icon: <AppstoreAddOutlined /> },
    { name: "Reports", route: "/reports", icon: <PieChartOutlined /> },
    { name: "Profile", route: "/profile", icon: <UserOutlined /> },
    { label: "Forms" },
    {
      name: "Fortnightly Monitor",
      route: "/fortnightly-monitor",
      icon: <FormOutlined />,
    },
    {
      name: "Classroom Walkthrough",
      route: "/classroom-walkthrough",
      icon: <SignatureOutlined />,
    },
    {
      name: "Notebook Checking",
      route: "/notebook-checking-proforma",
      icon: <BookFilled />,
    },
    {
      name: "Wing Coordinator",
      route: "/wing-coordinator",
      icon: <BookFilled />,
    },
  ],
  Teacher: [
    { name: "Dashboard", route: "/dashboard", icon: <AppstoreAddOutlined /> },
    { name: "Reports", route: "/reports", icon: <PieChartOutlined /> },
    { name: "Profile", route: "/profile", icon: <UserOutlined /> },
    { label: "Forms" },
    {
      name: "Fortnightly Monitor",
      route: "/fortnightly-monitor",
      icon: <FormOutlined />,
    },
    {
      name: "Classroom Walkthrough",
      route: "/classroom-walkthrough",
      icon: <SignatureOutlined />,
    },
    {
      name: "Notebook Checking",
      route: "/notebook-checking-proforma",
      icon: <BookFilled />,
    },
  ],
};

export const columnsCreate = [
  {
    title: "Employee Id",
    dataIndex: "employeeId",
    key: "employeeId",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Access",
    dataIndex: "access",
    key: "access",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Link to={`${record._id}`}>
          <Tag color="#4096ff" key={record._id}>
            Send Email
          </Tag>
        </Link>
      </Space>
    ),
  },
];

export const Formcolumns1 = [
  {
    title: UserRole[2] === Role ?"Observer Name": "Teacher Name",
    dataIndex: `grenralDetails`, // Accessing the teacher's name
    key: `grenralDetails`,
    render: (text,record) => (
      <a>{UserRole[2] === Role ? record.createdBy.name : text.NameoftheVisitingTeacher.name}</a>
    ),
  },
  {
    title: "Grade",
    dataIndex: "grenralDetails", // Correctly accessing the DateOfObservation
    key: "grenralDetails",
    render: (text) => (
      <span>{text?.className}</span>
    ), // Formatting the date
  },
  {
    title: "Section",
    dataIndex: "grenralDetails", // Correctly accessing the DateOfObservation
    key: "grenralDetails",
    render: (text) => (
      <span>{text?.Section}</span>
    ), // Formatting the date
  },
  {
    title: "Subject",
    dataIndex: "grenralDetails", // Correctly accessing the DateOfObservation
    key: "grenralDetails",
    render: (text) => (
      <span>{text?.Subject}</span>
    ), // Formatting the date
  },
  {
    title: "Observation Date",
    dataIndex: "grenralDetails", // Correctly accessing the DateOfObservation
    key: "grenralDetails",
    render: (text) => (
      <span>{getAllTimes(text.DateOfObservation)?.formattedDate2}</span>
    ), // Formatting the date
  },

  {
    title: "Class",
    dataIndex: "grenralDetails", // Correctly accessing the DateOfObservation
    key: "grenralDetails",
    render: (text) => <span>{text?.className}</span>, // Formatting the date
  },
  {
    title: Role === UserRole[2] ? "Your Status" : "Teacher Status",
    dataIndex: "isTeacherCompletes",
    key: "isTeacherCompletes",
    render: (text) => (
      <Space size="middle">
        {text ? (
          <Tag color="green">COMPLETED</Tag>
        ) : (
          <Tag color="volcano">NOT COMPLETED</Tag>
        )}
      </Space>
    ),
  },

  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        {(Role === UserRole[2] || Role === UserRole[1]) &&
        record?.isTeacherCompletes &&
        record?.isObserverCompleted ? (
         <>
          <Link
            className="btn btn-primary"
            to={`/classroom-walkthrough/report/${record._id}`}
          >
            View Report
          </Link>
          <Link
          className="btn btn-danger"
          to={`/classroom-walkthrough/edit/${record._id}`}
        >
         Edit
        </Link>
         </>
        ) : (
          Role === UserRole[1] && (
            <Button size="large" className="btn-outline-primary">
              Push Notify
            </Button>
          )
        )}
        {Role === UserRole[2] &&
          ((!record?.isTeacherCompletes && record?.isObserverCompleted) ||
            (!record?.isTeacherCompletes && !record?.isObserverCompleted)) && (
            <Link
              className="btn text-primary"
              to={`/classroom-walkthrough/create/${record._id}`}
            >
              Continue Form
            </Link>
          )}
        {/*       */}
      </Space>
    ),
  },
];

export const Formcolumns2 = [
  {
    title: "Title",
    dataIndex: `userId`, // Accessing the teacher's name
    key: `userId`,
    render: (text, key) =>
      text?.access === "Observer" && (
        <p className="mb-0 fw-light" key={key}>
          <span className="fw-bold">{text.name}</span> Invited you to Complete{" "}
          <br /> Fortnightly Monitor Form
        </p>
      ),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Link
          className="btn btn-primary"
          to={`/fortnightly-monitor/create/${record._id}`}
        >
          Continue Form
        </Link>
      </Space>
    ),
  },
];

export const Formcolumns3 = [
  {
    title: "Form Title",
    dataIndex: `grenralDetails`, // Accessing the teacher's name
    key: `grenralDetails`,
    render: (text) => <a>Notebook Checking For {text.NameofObserver.name}</a>,
  },
  {
    title: "Observation Date",
    dataIndex: "grenralDetails", // Correctly accessing the DateOfObservation
    key: "grenralDetails",
    render: (text) => (
      <span>{new Date(text.DateOfObservation).toLocaleDateString()}</span>
    ), // Formatting the date
  },
  {
    title: "Observer Status",
    dataIndex: "isObserverComplete",
    key: "isObserverComplete",
    render: (text) => (
      <Space size="middle">
        {text ? (
          <Tag color="green">COMPLETED</Tag>
        ) : (
          <Tag color="volcano">NOT COMPLETED</Tag>
        )}
      </Space>
    ),
  },
  {
    title: "Teacher Status",
    dataIndex: "isTeacherComplete",
    key: "isTeacherComplete",
    render: (text) => (
      <Space size="middle">
        {text ? (
          <Tag color="green">COMPLETED</Tag>
        ) : (
          <Tag color="volcano">NOT COMPLETED</Tag>
        )}
      </Space>
    ),
  },

  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        {(Role === UserRole[1] || Role === UserRole[2]) &&
        record?.isTeacherComplete &&
        record?.isObserverComplete ? (
          <Link
            className="btn btn-primary"
            to={`/notebook-checking-proforma/report/${record._id}`}
          >
            View Report
          </Link>
        ) : (
          Role === UserRole[2] && (
            <Button size="large" className="btn-outline-primary">
              Push Notify
            </Button>
          )
        )}
        {Role === UserRole[1] &&
          ((record?.isTeacherComplete && !record?.isObserverComplete) ||
            (!record?.isTeacherComplete && !record?.isObserverComplete)) && (
            <Link
              className="btn text-primary"
              to={`/notebook-checking-proforma/create/${record._id}`}
            >
              Continue Form
            </Link>
          )}
      </Space>
    ),
  },
];


export const FormcolumnsForm1 = [
  {
    title: UserRole[1] === Role ? "Teacher Name" : "Observer Name",
    dataIndex: "teacherID",
    key: "teacherID",
    render: (text, record) => (
      <a>
        {UserRole[1] === Role
          ? record?.teacherID?.name || record?.userId?.name
          : record?.coordinatorID?.name || record?.userId?.name}
      </a>
    ),
  },
  {
    title: "Class Name",
    dataIndex: "className",
    key: "className",
    render: (text) => <a>{text || "N/A"}</a>,
  },
  {
    title: "Section",
    dataIndex: "section",
    key: "section",
    render: (text) => <a>{text || "N/A"}</a>,
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (text) => <a>{getAllTimes(text).formattedDate2 || "N/A"}</a>,
  },
  {
    title: "Teacher Status",
    dataIndex: "isTeacherComplete",
    key: "isTeacherComplete",
    render: (text) => (
      <Space size="middle">
        <Tag color={text ? "green" : "volcano"}>
          {text ? "COMPLETED" : "NOT COMPLETED"}
        </Tag>
      </Space>
    ),
  },
  {
    title: "Observer Status",
    dataIndex: "isCoordinatorComplete",
    key: "isCoordinatorComplete",
    render: (text) => (
      <Space size="middle">
        <Tag color={text ? "green" : "volcano"}>
          {text ? "COMPLETED" : "NOT COMPLETED"}
        </Tag>
      </Space>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (_, record) => {
      const { isTeacherComplete, isCoordinatorComplete, isObserverInitiation } =
        record;
      const currentUserRole = getUserId()?.access;

      if (isTeacherComplete && isCoordinatorComplete) {
        return (
          <>
            <Link
              className="btn btn-primary"
              to={`/fortnightly-monitor/report/${record._id}`}
            >
              View Report
            </Link>
            <Link
              className="btn text-primary"
              to={`/fortnightly-monitor/edit/${record._id}`}
            >
              <Button size="large" color="danger" variant="solid">
                Edit
              </Button>
            </Link>
          </>
        );
      }

      if (
        currentUserRole === UserRole[1] &&
        !isTeacherComplete &&
        !isCoordinatorComplete &&
        !isObserverInitiation
      ) {
        return (
          <Button size="large" className="btn-outline-primary">
            Push Notify
          </Button>
        );
      }

      if (
        currentUserRole === UserRole[2] &&
        !isTeacherComplete &&
        !isCoordinatorComplete &&
        isObserverInitiation
      ) {
        return (
          <Link
            className="btn text-primary"
            to={`/fortnightly-monitor/create/${record._id}`}
          >
            Continue Form
          </Link>
        );
      }

      if (
        currentUserRole === UserRole[2] &&
        isTeacherComplete &&
        !isCoordinatorComplete
      ) {
        return (
          <>
            <Button
              size="large"
              variant="solid"
              color="primary"
              className="me-2"
            >
              Push Notify
            </Button>
            <Link
              className="btn text-primary"
              to={`/fortnightly-monitor/edit/${record._id}`}
            >
              <Button size="large" color="danger" variant="solid">
                Edit
              </Button>
            </Link>
          </>
        );
      }

      if (
        (currentUserRole === UserRole[1] &&
          !isTeacherComplete &&
          !isCoordinatorComplete &&
          isObserverInitiation) ||
        (currentUserRole === UserRole[1] &&
          !isTeacherComplete &&
          isCoordinatorComplete)
      ) {
        return (
          <Button size="large" className="btn-outline-primary">
            Push Notify
          </Button>
        );
      }

      if (
        currentUserRole === UserRole[1] &&
        isTeacherComplete &&
        !isCoordinatorComplete
      ) {
        return (
          <Link
            className="btn text-primary"
            to={`/fortnightly-monitor/create/${record._id}`}
          >
            Continue Form
          </Link>
        );
      }

      return null;
    },
  },
];


// export const FormcolumnsForm1 = [
//   {
//     title: UserRole[1] === Role ? "Teacher Name" : " Observer Name",
//     dataIndex: `teacherID`,
//     key: `teacherID`,
//     render: (text, record) => (
//       <a>{UserRole[1] === Role ? (record?.teacherID?.name || record?.userId?.name) : 
//         (record?.coordinatorID?.name || record?.userId?.name)
//       }
//       </a>
//     )
//   },
//   {
//     title: "Class Name",
//     dataIndex: "className",
//     key: "className",
//     render: (text) => <a>{text || "N/A"}</a>,
//   },
//   {
//     title: "Section",
//     dataIndex: "section",
//     key: "section",
//     render: (text) => <a>{text || "N/A"}</a>,
//   },
//   {
//     title: "Teacher Status",
//     dataIndex: "isTeacherComplete",
//     key: "isTeacherComplete",
//     render: (text) => (
//       <Space size="middle">
//         <Tag color={text ? "green" : "volcano"}>
//           {text ? "COMPLETED" : "NOT COMPLETED"}
//         </Tag>
//       </Space>
//     ),
//   },
//   {
//     title: "Observer Status",
//     dataIndex: "isCoordinatorComplete",
//     key: "isCoordinatorComplete",
//     render: (text) => (
//       <Space size="middle">
//         <Tag color={text ? "green" : "volcano"}>
//           {text ? "COMPLETED" : "NOT COMPLETED"}
//         </Tag>
//       </Space>
//     ),
//   },
//   {
//     title: "Action",
//     dataIndex: "action",
//     key: "action",
//     render: (_, record) => {
//       const { isTeacherComplete, isCoordinatorComplete, isObserverInitiation } =
//         record;
//       const currentUserRole = getUserId()?.access;

//       if (isTeacherComplete && isCoordinatorComplete) {
//         return (
//           <>
//             <Link
//               className="btn btn-primary"
//               to={`/fortnightly-monitor/report/${record._id}`}
//             >
//               View Report
//             </Link>
//             <Link
//               className="btn text-primary"
//               to={`/fortnightly-monitor/edit/${record._id}`}
//             >
//               <Button size="large" color="danger" variant="solid">
//                 Edit
//               </Button>
//             </Link>
//           </>
//         );
//       }

//       if (
//         currentUserRole === UserRole[1] &&
//         !isTeacherComplete &&
//         !isCoordinatorComplete &&
//         !isObserverInitiation
//       ) {
//         return (
//           <Button size="large" className="btn-outline-primary">
//             Push Notify
//           </Button>
//         );
//       }

//       if (
//         currentUserRole === UserRole[2] &&
//         !isTeacherComplete &&
//         !isCoordinatorComplete &&
//         isObserverInitiation
//       ) {
//         return (
//           <Link
//             className="btn text-primary"
//             to={`/fortnightly-monitor/create/${record._id}`}
//           >
//             Continue Form
//           </Link>
//         );
//       }

//       if (
//         currentUserRole === UserRole[2] &&
//         isTeacherComplete &&
//         !isCoordinatorComplete
//       ) {
//         return (
//           <>
//             <Button
//               size="large"
//               variant="solid"
//               color="primary"
//               className="me-2"
//             >
//               Push Notify
//             </Button>
//             <Link
//               className="btn text-primary"
//               to={`/fortnightly-monitor/edit/${record._id}`}
//             >
//               <Button size="large" color="danger" variant="solid">
//                 Edit
//               </Button>
//             </Link>
//           </>
//         );
//       }

//       if (
//         (currentUserRole === UserRole[1] &&
//           !isTeacherComplete &&
//           !isCoordinatorComplete &&
//           isObserverInitiation) ||
//         (currentUserRole === UserRole[1] &&
//           !isTeacherComplete &&
//           isCoordinatorComplete)
//       ) {
//         return (
//           <Button size="large" className="btn-outline-primary">
//             Push Notify
//           </Button>
//         );
//       }

//       if (
//         currentUserRole === UserRole[1] &&
//         isTeacherComplete &&
//         !isCoordinatorComplete
//       ) {
//         return (
//           <Link
//             className="btn text-primary"
//             to={`/fortnightly-monitor/create/${record._id}`}
//           >
//             Continue Form
//           </Link>
//         );
//       }

//       return null;
//     },
//   },
// ];
