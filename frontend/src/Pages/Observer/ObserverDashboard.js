import React, { useEffect, useState } from 'react';
import { Card, Button, Tag, Table } from 'antd';
import { Container, Row as BootstrapRow, Col as BootstrapCol, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // For page redirection
import { useDispatch, useSelector } from 'react-redux';
import { getAllTimes, getUserId } from '../../Utils/auth';
import { Formcolumns1 } from '../../Components/Data';
import { GetcreatedBy } from '../../redux/Form/classroomWalkthroughSlice';


function ObserverDashboard() {
  const dispatch= useDispatch()
  const userID = getUserId().id;
  const { isLoading, GetForms } = useSelector((state) => state?.walkThroughForm);
  useEffect(()=>{
    dispatch(GetcreatedBy())
  },[dispatch])


  return (
    <Container>
    <BootstrapRow className="my-3">
      <BootstrapCol md={4}>
        <Link to={'/fortnightly-monitor'} className='text-decoration-none'>
        <Card className='shadow-sm mb-3'>
          <h3 className='mb-3'>Fortnightly Monitor</h3>
          <p className="fs-5 bg-primary-subtle px-3 rounded-5 text-primary" style={{ width: "fit-content" }}>
            {FormData?.length} invitation
          </p>
        </Card>
        </Link>
      </BootstrapCol>
      <BootstrapCol md={4}>
        <Link to={'/fortnightly-monitor'} className='text-decoration-none'>
        <Card className='shadow-sm mb-3'>
          <h3 className='mb-3'>Classroom Walkthrough</h3>
          <p className="fs-5 bg-primary-subtle px-3 rounded-5 text-primary" style={{ width: "fit-content" }}>
            0 invitation
          </p>
        </Card>
        </Link>
      </BootstrapCol>
      <BootstrapCol md={4}>
        <Link to={'/fortnightly-monitor'} className='text-decoration-none'>
        <Card className='shadow-sm mb-3'>
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
      columns={Formcolumns1}
      dataSource={GetForms}
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
      columns={Formcolumns1}
      dataSource={GetForms}
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
      columns={Formcolumns1}
      dataSource={GetForms}
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
  
  </Container>
  );
}

export default ObserverDashboard;
