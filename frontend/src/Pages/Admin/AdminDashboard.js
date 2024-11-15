import { DeleteFilled } from '@ant-design/icons';
import { Button, Card, Space, Table } from 'antd'
import React, { useMemo } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllTimes } from '../../Utils/auth';

function AdminDashboard() {

  const UserLists = useSelector((state) => state?.user?.data);


  const columns = useMemo(() => [
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
      title: 'Custom Id',
      dataIndex: 'customId',
      key: 'customId',
    },
    {
      title: 'Created At',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (text) => <a>{getAllTimes(text).formattedDate}</a>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/users/${record?._id}`}>
            <Button key={record?._id} className='bg-primary text-white' >View</Button>
          </Link>
          
            
        </Space>
      ),
    },
  ], []);
  return (
<Container>
  <Row className='my-3'>
    <Col md={4}>
    <Card >
      <h2>Total Users</h2>
      <p className='fs-3'>0</p>
    </Card>
    </Col>
    <Col md={4}>
    <Card >
      <h2>Pending Forms Users</h2>
      <p className='fs-3'>0</p>
    </Card>
    </Col>
    <Col md={4}>
    <Card >
      <h2>Filled Forms</h2>
      <p className='fs-3'>0</p>
    </Card>
    </Col>
  </Row>
  <Row>
    <Col >
    <Table showSizeChanger={false} dataSource={Array.isArray(UserLists) && UserLists.slice().reverse()} columns={columns} rowKey="employeeId" />
    </Col>
  </Row>
</Container>
  )
}

export default AdminDashboard