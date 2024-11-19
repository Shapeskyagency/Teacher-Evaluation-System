import React, { useEffect, useState } from 'react';
import { Button, Card, Empty, Modal, Tag } from 'antd';
import { Col, Row } from 'react-bootstrap';
import { PlusCircleOutlined, EyeFilled } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GetFormsOne } from '../../redux/Form/fortnightlySlice';
import { getAllTimes } from '../../Utils/auth';
import BasicDeatilsForm from '../../Components/BasicDeatilsForm';

const FortnightlyMonitor = () => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const forms = useSelector((state) => state?.Forms?.getAllForms);

  useEffect(() => {
    dispatch(GetFormsOne());
  }, [dispatch]);

  const renderForms = (filterCondition, title, isRecentlyFilled) => (
    <>
      <h3>{title}</h3>
      {forms?.length ? (
        forms
          .filter(filterCondition)
          .map((form) => (
            <Card key={form._id} className="mb-3">
              <h4>
                Assigned to{' '}
                {form.coordinatorID
                  ? `Coordinator ${form.coordinatorID?.name}`
                  : `Teacher ${form.teacherID?.name}`}
              </h4>
              <Tag className="black">Date: {getAllTimes(form.date)?.formattedDate2}</Tag>
              <Tag color="green">Class: {form.className.toUpperCase()}</Tag>
              <Tag color="blue">Subject: {form.section.toUpperCase()}</Tag>

              {isRecentlyFilled ? (
                <Link to={`/fortnightly-monitor/report/${form._id}`} className="mt-3 d-block">
                  <Button icon={<EyeFilled />}>View Report</Button>
                </Link>
              ) : (
                <Link to={`/fortnightly-monitor/create/${form._id}`} className="mt-3 d-block">
                  <Button type="primary">Continue Form</Button>
                </Link>
              )}
            </Card>
          ))
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  );

  return (
    <div className="container py-4">
      <Row>
        <Col>
          <Button
            onClick={() => navigate('/fortnightly-monitor/create')}
            type="primary"
            icon={<PlusCircleOutlined />}
            size="large"
          >
            Create New User
          </Button>

          {renderForms(
            (form) => !form.isTeacherComplete && !form.isCoordinatorComplete,
            'Pending Forms',
            false
          )}

          {renderForms(
            (form) => form.isTeacherComplete || form.isCoordinatorComplete,
            'Recently Filled Forms',
            true
          )}
        </Col>
      </Row>

      <Modal
        width={520}
        footer={null}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        className="w-50"
      >
        <BasicDeatilsForm close={() => setOpenModal(false)} />
      </Modal>
    </div>
  );
};

export default FortnightlyMonitor;
