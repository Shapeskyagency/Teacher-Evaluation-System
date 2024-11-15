import React, { useEffect, useState, useMemo } from 'react';
import { Button, Input, Modal, Space, Table, Tag } from 'antd';
import { Container } from 'react-bootstrap';
import { DownloadOutlined, PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { CreateUserList, GetUserList } from '../../redux/userSlice';
import { getAllTimes } from '../../Utils/auth';
import CreateUserForm from '../../Components/CreateUserForm';
import { Link } from 'react-router-dom';

function Users() {
  const [size, setSize] = useState('large');
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [Payload, setPayload] =useState();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetUserList());
  }, [dispatch]);

  const UserLists = useSelector((state) => state?.user?.data);

  // Memoize the columns to avoid unnecessary re-renders
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
          <Link to={`${record._id}`}> <Tag color="#4096ff" key={record._id}>View </Tag></Link>
          <a>
            <Tag color="volcano" key={record}>
              Delete
            </Tag>
          </a>
        </Space>
      ),
    },
  ], []);

  // Modal Handlers
  const showModal = () => setOpen(true);
  const handleOk = () => {
  
    // console.log(Payload)
    setConfirmLoading(true);
    setOpen(false);
      setConfirmLoading(false);
    // setTimeout(() => {
    //   setOpen(false);
    //   setConfirmLoading(false);
    // }, 2000);
  };
  const handleCancel = () => setOpen(false);

  return (
    <div>
      <Container>
        <div className="d-flex gap-3 py-4 col-md-4">
          <Button onClick={showModal} type="primary" icon={<PlusCircleOutlined />} size={size}>
            Create New User
          </Button>
          <Input prefix={<SearchOutlined />} placeholder="Search" />
        </div>
        <Table dataSource={UserLists} columns={columns} rowKey="employeeId" />
      </Container>
      <Modal
       footer={null}
        title="Create New User"
        open={open}
        confirmLoading={confirmLoading}
      >
        <CreateUserForm onOk={handleOk} onCancel={handleCancel} Payload={setPayload} />
      </Modal>
    </div>
  );
}

export default Users;
