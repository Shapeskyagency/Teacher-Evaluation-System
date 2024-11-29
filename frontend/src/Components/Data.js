import { Space, Tag } from "antd";
import { Link } from "react-router-dom";
import { AppstoreAddOutlined, FormOutlined, PieChartOutlined, UserAddOutlined, UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { SiGoogleclassroom } from "react-icons/si";
export const Menu ={
    Superadmin:[
        {name:"Dashboard", route:"/dashboard",icon:<AppstoreAddOutlined />},
        {name:"Reports", route:"/reports",icon:<PieChartOutlined />},
        {name:"User", route:"/users",icon:<UserAddOutlined />},
        {name:"Profile", route:"/profile",icon:<UserOutlined />},
        {label:"Forms"},
        {name:"Fortnightly Monitor", route:"/fortnightly-monitor",icon:<FormOutlined />},
    ],
    Observer:[
        {name:"Dashboard", route:"/dashboard"},
        {name:"Reports", route:"/reports"},
        {name:"Profile", route:"/profile",icon:<UserOutlined />},
        {label:"Forms"},
        {name:"Fortnightly Monitor", route:"/fortnightly-monitor",icon:<FormOutlined />},
        {name:"Classroom Walkthrough", route:"/classroom-walkthrough",icon:<SiGoogleclassroom />},
    ],
    Teacher:[
        {name:"Dashboard", route:"/dashboard"},
        {name:"Reports", route:"/reports"},
        {name:"Profile", route:"/profile",icon:<UserOutlined />},
        {label:"Forms"},
        {name:"Fortnightly Monitor", route:"/fortnightly-monitor",icon:<FormOutlined />},
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



// export const FormColumn =[
//   {
//     title: 'Form Name',
//     dataIndex: 'formName',
//     key: 'formName',
//   },
// ]