import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllTimes, getUserId } from '../../Utils/auth';
import { GetTodoForms } from '../../redux/Form/fortnightlySlice';
import { Card, Button, Tag, Table } from 'antd';
import { Container, Row as BootstrapRow, Col as BootstrapCol, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // For page redirection
import { Formcolumns2 } from '../../Components/Data';

function TeacherDashboard() {
  const dispatch= useDispatch()
  const userID = getUserId()?.id;
  const FormData = useSelector((state)=>state?.Forms?.GetTodoFormList?.forms) ;
  useEffect(()=>{
    dispatch(GetTodoForms({TeacherID:userID}))
  },[dispatch])


  return (
    <Container>
    <BootstrapRow className="my-3">
      <BootstrapCol md={4}>
        <Link to={'/fortnightly-monitor'} className='text-decoration-none'>
        <Card className='shadow-sm'>
          <h3 className='mb-3'>Fortnightly Monitor</h3>
          <p className="fs-5 bg-primary-subtle px-3 rounded-5 text-primary" style={{ width: "fit-content" }}>
            {FormData?.length} invitation
          </p>
        </Card>
        </Link>
      </BootstrapCol>
      <BootstrapCol md={4}>
        <Link to={'/fortnightly-monitor'} className='text-decoration-none'>
        <Card className='shadow-sm'>
          <h3 className='mb-3'>Classroom Walkthrough</h3>
          <p className="fs-5 bg-primary-subtle px-3 rounded-5 text-primary" style={{ width: "fit-content" }}>
            0 invitation
          </p>
        </Card>
        </Link>
      </BootstrapCol>
      <BootstrapCol md={4}>
        <Link to={'/fortnightly-monitor'} className='text-decoration-none'>
        <Card className='shadow-sm'>
          <h3 className='mb-3'>Notebook Checking</h3>
          <p className="fs-5 bg-primary-subtle px-3 rounded-5 text-primary" style={{ width: "fit-content" }}>
            0 invitation
          </p>
        </Card>
        </Link>
      </BootstrapCol>
    </BootstrapRow>

   <Container>
    <Row>

      <Col md={6}>
      
      <p className='fs-5 mb-2 lh-lg'>Fortnightly Monitor Form To Do Items</p>

<Table
      columns={Formcolumns2}
      dataSource={FormData}
      bordered
      scroll={{
        x: "max-content", // Makes the table horizontally scrollable for mobile
      }}
      pagination={{
        pageSize: 5, // Limits rows per page for better mobile UX
        responsive: true,
      }}
    /></Col>
     <Col md={6}>
      
      <p className='fs-5 mb-2 lh-lg'>Classroom Walkthrough Form To Do Items</p>

<Table
      columns={Formcolumns2}
      dataSource={FormData}
      bordered
      scroll={{
        x: "max-content", // Makes the table horizontally scrollable for mobile
      }}
      pagination={{
        pageSize: 5, // Limits rows per page for better mobile UX
        responsive: true,
      }}
    /></Col>

<Col md={6}>
      
      <p className='fs-5 mb-2 lh-lg'>Notebook Checking Form To Do Items</p>

<Table
      columns={Formcolumns2}
      dataSource={FormData}
      bordered
      scroll={{
        x: "max-content", // Makes the table horizontally scrollable for mobile
      }}
      pagination={{
        pageSize: 5, // Limits rows per page for better mobile UX
        responsive: true,
      }}
    /></Col>
    </Row>

   </Container>
    {/* <h2>
To-Do Items
<span className="bg-info px-3 rounded-5 text-white">
  {FormData?.length < 10 ? `0${FormData?.length}` : FormData?.length}
</span>
</h2> */}
    {/* <BootstrapRow className="my-3">
      <BootstrapCol>
        {FormData?.map((items)=>(
          <Card key={items._id} className="mb-3">
            {console.log(items)}
            <h4>
            Fortnightly Monitor Form
            </h4>
            <p className='text-info'>Assigned to{' '}
              {items.coordinatorID
                ? `Coordinator ${items.coordinatorID?.name}`
                : `Teacher ${items.teacherID?.name}`}</p>
            <Tag className="black">Fiiled Date: {getAllTimes(items.date)?.formattedDate2}</Tag>
            <Tag className="black">Observertion Date: {getAllTimes(items.observerForm.ObservationDates)?.formattedDate2}</Tag>
            <Tag color="green">Class: {items.className.toUpperCase()}</Tag>
            <Tag color="blue">Subject: {items.section.toUpperCase()}</Tag>
              <Link to={`/fortnightly-monitor/create/${items._id}`} className="mt-3 d-block" style={{width:"fit-content"}}>
                <Button type="primary">Continue Form</Button>
              </Link>
          </Card>
        ))}
      
      </BootstrapCol>
    </BootstrapRow> */}
  </Container>
  )
}

export default TeacherDashboard