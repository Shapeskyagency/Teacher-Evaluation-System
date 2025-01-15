import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllWeeklyFromById } from '../../redux/userSlice';
import { message, Card, Typography, List, Table, Row, Col, Tag } from 'antd';

const { Title, Text } = Typography;

function Weekly4FormReport() {
  const [formData, setFormData] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formId = useParams()?.id;

  useEffect(() => {
    if (!formId) {
      navigate('/weekly4form');
      return;
    }

    let isMounted = true; // Prevent updates if the component unmounts
    const fetchData = async () => {
      try {
        const response = await dispatch(getAllWeeklyFromById(formId));
        if (isMounted) {
          if (response?.payload?.success) {
            setFormData(response.payload.form);
          } else {
            message.error(response?.payload?.message);
            navigate('/weekly4form');
          }
        }
      } catch (error) {
        message.error('Error fetching form data:', error);
        if (isMounted) navigate('/weekly4form');
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup flag on component unmount
    };
  }, [dispatch, formId, navigate]);

  if (!formData) {
    return <div>Loading Weekly4FormReport...</div>;
  }

  const observerDetails = formData?.isInitiated?.Observer || {};
  const tableColumns = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      key: 'answer',
      render: (answer, record) =>
        record?.sections ? (
          <>
            {record?.sections?.map((item) => (
                <Tag color={item?.answer === "Yes"? "green": "red"}>
                  {item?.answer}
               </Tag>
            ))}
          </>
        ) : (
          <Tag color={answer === "Yes"? "green": "red"}>
                  {answer}
               </Tag>
        ),
    },
    {
      title: 'Class Name',
      dataIndex: 'section',
      key: 'section',
      render: (classId, record) =>

        record?.sections ? (
          <>
            {record?.sections?.map((item) => (
                <p className='text-nowrap'>
                  {item?.className} / {item?.section} 
                </p>
            ))}
          </>
        ) : (
          <Text>{classId}</Text>
        ),
    },
    {
      title: 'Additional Info',
      dataIndex: 'textArea',
      key: 'textArea',
      render: (text,record) => (
          <Text>{text || <Tag color={!text && "yellow"}>
          N/A
       </Tag>}</Text>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card>
            <Title level={3}>Weekly Form Report</Title>
          </Card>
        </Col>

        <Col xs={24}>
          <Card>
            <Title level={4}>Observer Details</Title>
            <Text>
              <strong>Name:</strong> {observerDetails.name}
            </Text>
            <br />
            <Text>
              <strong>Email:</strong> {observerDetails.email}
            </Text>
            <br />
            <Text>
              <strong>Mobile:</strong> {observerDetails.mobile}
            </Text>
            <br />
            <Text>
              <strong>Designation:</strong> {observerDetails.designation}
            </Text>
            <br />
            <Text>
              <strong>Coordinator:</strong> {observerDetails.coordinator}
            </Text>
          </Card>
        </Col>

        <Col xs={24}>
          <Card>
            <Title level={4}>Form Details</Title>
            <Text>
              <strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}
            </Text>
            <br />
            <Text>
              <strong>Submission Date:</strong>{' '}
              {new Date(formData.dateOfSubmission).toLocaleDateString()}
            </Text>
            <br />
            <Text>
              <strong>Completed:</strong> {formData.isCompleted ? 'Yes' : 'No'}
            </Text>
          </Card>
        </Col>

        <Col xs={24}>
          <Card>
            <Title level={4}>Responses</Title>
            <Table
              dataSource={formData.FormData}
              columns={tableColumns}
              rowKey={(record) => record.question}
              pagination={false}
              scroll={{ x: true }} // Enable horizontal scrolling on small screens
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Weekly4FormReport;
