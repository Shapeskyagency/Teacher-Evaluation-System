import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Card, Spin, Table, Tag } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Container, Row, Col } from 'react-bootstrap';
import ReactPDF from '@react-pdf/renderer';
import Logo from './Imgs/Logo.png';
import LogoBanner from './Imgs/image.png';
import { GetNoteBookForm } from '../../redux/Form/noteBookSlice';
import NoteBookDoc from './Documents/NoteBookDoc';
import { getAllTimes } from '../../Utils/auth';

const TableCard = React.memo(({ title, dataSource }) => (
  <Card title={title} className='mt-4'>
    <Table
      pagination={false}
      dataSource={dataSource}
      columns={[
        {
          title: 'Questions',
          dataIndex: 'question',
          key: 'question',
          render: (text) => <p className="mb-0">{text}</p>,
        },
        {
          title: 'Answer',
          dataIndex: 'answer',
          key: 'answer',
          render: (text) => (
            <Tag color={text === '1' ? 'yellow' : text === '2' ? 'blue' : text === '3' ? 'green' : 'red'}>
              {text}
            </Tag>
          ),
        },
      ]}
    />
  </Card>
));

function NotebookPDF() {
  const { id: Id } = useParams();
  const dispatch = useDispatch();
  const { formDataList, isLoading } = useSelector((state) => state.notebook);

  const downloadPDF = useCallback(async () => {
    const blob = await ReactPDF.pdf(<NoteBookDoc data={formDataList} />).toBlob();
    const url = URL.createObjectURL(blob);

    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `notebook-checking-proforma-${Id}.pdf`;
    link.click();

    // Clean up the object URL
    URL.revokeObjectURL(url);
  }, [formDataList, Id]);

  useEffect(() => {
    if (Id) {
      dispatch(GetNoteBookForm(Id));
    }
  }, [Id, dispatch]);

  const keyObject = [
    'Maintenance Of Notebooks',
    'Quality Of Opportunities',
    'Quality Of Teacher Feedback',
    'Quality Of Learner',
  ];

  const getField = (field, type = 'ObserverForm') => formDataList?.[type]?.[field];

  return (
    <div className="ms-5 lh-sm py-4 position-relative">
      {isLoading && (
        <div className="LoaderWrapper">
          <Spin size="large" className="position-absolute" />
        </div>
      )}
      <Button type="primary" onClick={downloadPDF}>
        <DownloadOutlined /> Download PDF
      </Button>

      <Container>
        <Row className='justify-content-start align-items-start'>
          <Col md={12}>
            <div className='d-flex gap-4 justify-content-center mb-4'>
              <img src={Logo} width={100} height={100} alt="Logo" />
              <img src={LogoBanner} width={400} height={100} alt="Banner" />
            </div>
          </Col>

          <Col md={12}>
            <div className='p-4 rounded border mb-4'>
              <h5>General Details</h5>
              <div className='d-flex gap-3 mb-4'>
                <p className='m-0'>
                  Name Of Observer: <b>{formDataList?.grenralDetails?.NameofObserver?.name}</b>
                </p>
                <p className='m-0'>
                  Grade: <b>{formDataList?.grenralDetails?.className}</b>
                </p>
                <p className='m-0'>
                  Section: <b>{formDataList?.grenralDetails?.Section}</b>
                </p>
                <p className='m-0'>
                  Subject: <b>{formDataList?.grenralDetails?.Subject}</b>
                </p>
                <p className='m-0'>
                  Date Of Observation: <b>{getAllTimes(formDataList?.grenralDetails?.DateOfObservation).formattedDate2}</b>
                </p>
              </div>

              <h5>Observer Notebook</h5>
              <div className='d-flex gap-3'>
                <p className='m-0'>
                  Absentees: <b>{formDataList?.NotebooksObserver?.Absentees}</b>
                </p>
                <p className='m-0'>
                  Class Strength: <b>{formDataList?.NotebooksObserver?.ClassStrength}</b>
                </p>
                <p className='m-0'>
                  Defaulters: <b>{formDataList?.NotebooksObserver?.Defaulters}</b>
                </p>
                <p className='m-0'>
                  Notebooks Submitted: <b>{formDataList?.NotebooksObserver?.NotebooksSubmitted}</b>
                </p>
              </div>
            </div>
          </Col>

          <Col md={12}>
            <h3>Observer Response</h3>
          </Col>

          <Col md={8}>
            {keyObject.map((title, index) => (
              <TableCard
                key={index}
                title={title}
                dataSource={getField(Object.keys(formDataList?.ObserverForm || {})[index])}
              />
            ))}
          </Col>

          <Col md={4}>
            <Card title="Observer Feedback" className='mt-4'>
              <p>{formDataList?.observerFeedback}</p>
            </Card>
          </Col>

          <Col md={12} className='mt-4'>
            <h3>Teacher Response</h3>
          </Col>

          <Col md={8}>
            {keyObject.map((title, index) => (
              <TableCard
                key={index + 4}
                title={title}
                dataSource={getField(Object.keys(formDataList?.TeacherForm || {})[index], 'TeacherForm')}
              />
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default NotebookPDF;
