import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Space, message, Table, Spin } from 'antd';
import { DeleteFilled, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { CReateClassSection, deleteCreateClassSection, getCreateClassSection } from '../../redux/userSlice';
import { useDispatch } from 'react-redux';
import { Col, Container, Row } from 'react-bootstrap';

function ClassSectionPage() {
  const [newData, setNewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const fetchClassData = async () => {
    setIsLoading(true);
    try {
      const res = await dispatch(getCreateClassSection());
      if (res?.payload?.success) {
        setNewData(res?.payload?.classDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        message.error('Failed to fetch class data.');
      }
    } catch (error) {
      console.error('Error fetching class data:', error);
      message.error('An error occurred while fetching class data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassData();
  }, []);

  const handleSubmit = async (values) => {
    const data = {
      className: values.className,
      sections: values.sections.map((name) => ({ name })),
      subjects: values.subjects.map((name) => ({ name })),
    };
    try {
      const response = await dispatch(CReateClassSection(data));
      if (response.payload.success) {
        message.success(response.payload.message);
        fetchClassData();
        form.resetFields();
      } else {
        message.error(response.payload.message);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('An error occurred.');
    }
  };



  const deleteClass  = async (Records) =>{
    const deleteCls = await dispatch(deleteCreateClassSection(Records?._id));
    if(deleteCls?.payload?.success){
      fetchClassData();
      message.success(deleteCls?.payload?.message)
    }else{
      message.error("Server Error!")
    }
  }

  return (
    <>
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {isLoading && (
        <div className="LoaderWrapper">
          <Spin size="large" className="position-absolute" />
        </div>
      )}
      <h1>Create Class and Sections</h1>
      <Form
        form={form}
        name="class_section_form"
        onFinish={handleSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Class Name"
          name="className"
          rules={[{ required: true, message: 'Please enter the class name' }]}
        >
          <Input placeholder="Enter class name" />
        </Form.Item>

        <div className='d-flex gap-4'>
        <div className='w-50'>
        <Form.List
          name="sections"
          
          rules={[{
            validator: async (_, sections) => {
              if (!sections || sections.length < 1) {
                return Promise.reject(new Error('At least one section is required'));
              }
            },
          }]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space className='w-100' key={key} style={{  marginBottom: 8 }} align="baseline">
                  <Form.Item
                  className='w-100'
                    {...restField}
                    name={[name]}
                    fieldKey={[fieldKey]}
                    rules={[{ required: true, message: 'Please enter a section name' }]}
                  >
                    <Input className='w-100' placeholder="Enter section name" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Sections
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        </div>
      <div className='w-50'>
      <Form.List
          name="subjects"
          rules={[{
            validator: async (_, subjects) => {
              if (!subjects || subjects.length < 1) {
                return Promise.reject(new Error('At least one subjects is required'));
              }
            },
          }]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name]}
                    fieldKey={[fieldKey]}
                    rules={[{ required: true, message: 'Please enter a subjects name' }]}
                  >
                    <Input placeholder="Enter subjects name" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Subjects
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </div>
        </div>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
    <Container>
        <Row className='justify-content-center'>
          <Col md={10}>
            <Table
            className='shadow-sm'
              dataSource={newData}
              columns={[
                {
                  title: 'Class Name',
                  dataIndex: 'className',
                  key: 'className',
                },
                {
                  title: 'Sections',
                  dataIndex: 'sections',
                  key: 'sections',
                  render: (sections) => sections.map((section) => section.name).join(', '),
                },
              
                {
                  title: 'Subjects',
                  dataIndex: 'subjects',
                  key: 'sections',
                  render: (subjects) => subjects.map((subject) => subject.name).join(', '),
                },  
                {
                  title: 'Action',
                  dataIndex: 'action',
                  key: 'action',
                  render: (subjects,record) => 
                    <Button onClick={()=>deleteClass(record)} className='bg-danger text-white' >
                  <DeleteFilled /> Delete
                </Button>
                },
              ]}
              rowKey={(record) => record.id || record._id}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ClassSectionPage;
