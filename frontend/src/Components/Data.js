import { Space, Tag } from "antd";
import { Link } from "react-router-dom";
import { getAllTimes } from "../Utils/auth";

export const Menu ={
    Superadmin:[
        {name:"Dashboard", route:"/dashboard"},
        {name:"Reports", route:"/reports"},
        {name:"User", route:"/users"},
        {name:"Logout", logout: function(){localStorage.clear(); window.location.replace('/') }},
    ],
    Observer:[
        {name:"Dashboard", route:"/dashboard"},
        {name:"Reports", route:"/reports"},
        {name:"Logout", logout: function(){localStorage.clear(); window.location.replace('/') }},
    ],
    Teacher:[
        {name:"Dashboard", route:"/dashboard"},
        {name:"Reports", route:"/reports"},
        {name:"Logout", logout: function(){localStorage.clear(); window.location.replace('/') }},
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