import React, { useEffect, useState } from 'react'
import { Button, Input, Space, Table, Tag } from 'antd';
import {Container} from 'react-bootstrap'
import { DownloadOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { GetUserList } from '../../redux/userSlice';
import {useDispatch, useSelector} from "react-redux"
import { getAllTimes } from '../../Utils/auth';
const columns = [
  {
    title: 'Employee Id',
    dataIndex: 'employeeId',
    key: 'employeeId',
  },
   {
    title: 'Access',
    dataIndex: 'access',
    key: 'access',
    render: (text) => <a >{text}</a>,
  },
  {
    title: 'Custom Id',
    dataIndex: 'customId',
    key: 'customId',
  },
  {
    title: 'Created At',
    key: 'createdAt',
    dataIndex: 'createdAt',
    render: (text) => <a >{getAllTimes(text).formattedDate}</a>,
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        {/* <a> {record.name}</a> */}
        <a><Tag color={'volcano'} key={record}>Delete </Tag></a>
      </Space>
    ),
  },
];

function Users() {
  const [size, setSize] = useState('large');
  const dispatch =useDispatch();
  useEffect(()=>{
dispatch(GetUserList())

  },[])

  const UserLists = useSelector((state)=>state?.user?.data);

  return (
    <div>
     <Container>
    <div className='d-flex gap-3 py-4 col-md-4'>
    <Button type="primary" icon={<PlusCircleOutlined />} size={size}>
            Create New User
          </Button>
    <Input prefix={<SearchOutlined/>} placeholder='Search' />
    </div>
     <Table 
     dataSource={UserLists} 
     columns={columns} />
     </Container> 
     
    </div>
  )
}

export default Users