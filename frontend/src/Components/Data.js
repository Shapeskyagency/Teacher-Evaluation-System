import { Space, Tag } from "antd";
import { Link } from "react-router-dom";
import { AppstoreAddOutlined, BookFilled, FormOutlined, PieChartOutlined, SignatureOutlined, UserAddOutlined, UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
// import { SiGoogleclassroom } from "react-icons/si";
export const Menu ={
    Superadmin:[
        {name:"Dashboard", route:"/dashboard",icon:<AppstoreAddOutlined />},
        {name:"Reports", route:"/reports",icon:<PieChartOutlined />},
        {name:"User", route:"/users",icon:<UserAddOutlined />},
        {name:"Profile", route:"/profile",icon:<UserOutlined />},
        {label:"Forms"},
        {name:"Fortnightly Monitor", route:"/fortnightly-monitor",icon:<FormOutlined />},
        {name:"Classroom Walkthrough", route:"/classroom-walkthrough",icon:<SignatureOutlined />},
    ],
    Observer:[
        {name:"Dashboard", route:"/dashboard",icon:<AppstoreAddOutlined />},
        {name:"Reports", route:"/reports",icon:<PieChartOutlined />},
        {name:"Profile", route:"/profile",icon:<UserOutlined />},
        {label:"Forms"},
        {name:"Fortnightly Monitor", route:"/fortnightly-monitor",icon:<FormOutlined />},
        {name:"Classroom Walkthrough", route:"/classroom-walkthrough",icon:<SignatureOutlined />},
    ],
    Teacher:[
        {name:"Dashboard", route:"/dashboard",icon:<AppstoreAddOutlined />},
        {name:"Reports", route:"/reports",icon:<PieChartOutlined />},
        {name:"Profile", route:"/profile",icon:<UserOutlined />},
        {label:"Forms"},
        {name:"Fortnightly Monitor", route:"/fortnightly-monitor",icon:<FormOutlined />},
        {name:"Classroom Walkthrough", route:"/classroom-walkthrough",icon:<SignatureOutlined />},
        {name:"Notebook Checking", route:"/notebook-checking-proforma",icon:<BookFilled />},
    ]
}

export const columnsCreate =[
    {
        title: 'Employee Id',
        dataIndex: 'employeeId',
        key: 'employeeId',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Access',
        dataIndex: 'access',
        key: 'access',
        render: (text) => <a>{text}</a>,
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <Link to={`${record._id}`}>
              <Tag color="#4096ff" key={record._id}>Send Email</Tag>
            </Link>
          </Space>
        ),
      },
      
]



export const Formcolumns1 = [
  {
    title: 'Form Title',
    dataIndex: `grenralDetails`, // Accessing the teacher's name
    key: `grenralDetails`,
    render: (text) => <a>Classroom Walkthrough For {text.NameoftheVisitingTeacher.name}</a>,
  },
  {
    title: 'Observation Date',
    dataIndex: 'grenralDetails', // Correctly accessing the DateOfObservation
    key: 'grenralDetails',
    render: (text) => <span>{new Date(text.DateOfObservation).toLocaleDateString()}</span>, // Formatting the date
  },
  {
    title: 'Teacher Status',
    dataIndex: 'isTeacherCompletes', 
    key: 'isTeacherCompletes',
    render: (text) => (
      <Space size="middle">
        {text ?  
        <Tag color="green">
        COMPLETED
       </Tag>
       : <Tag color="volcano">
       NOT COMPLETED
      </Tag>
      }
        
      </Space>
    ),
  },
  {
    title: 'Action',
    dataIndex: 'action', 
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Link className="btn btn-outline-primary" to={`/classroom-walkthrough/report/${record._id}`}>
          View Report
        </Link>
      </Space>
    ),
  },
];

export const Formcolumns2 = [
  {
    title: 'Title',
    dataIndex: `userId`, // Accessing the teacher's name
    key: `userId`,
    render: (text,key) => text?.access === "Observer" && <p className="mb-0 fw-light" key={key}><span className="fw-bold">{text.name}</span> Invited you to Complete <br/> Fortnightly Monitor Form</p>,
  },
  {
    title: 'Action',
    dataIndex: 'action', 
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Link className="btn btn-primary" to={`/fortnightly-monitor/create/${record._id}`}>
        Continue Form
        </Link>
      </Space>
    ),
  },
]