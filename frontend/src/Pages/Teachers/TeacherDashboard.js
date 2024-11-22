import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllTimes, getUserId } from '../../Utils/auth';
import { GetTodoForms } from '../../redux/Form/fortnightlySlice';
import { Card, Button, Tag } from 'antd';
import { Container, Row as BootstrapRow, Col as BootstrapCol } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // For page redirection

function TeacherDashboard() {
  const dispatch= useDispatch()
  const userID = getUserId().id;
  const FormData = useSelector((state)=>state?.Forms?.GetTodoFormList?.forms) ;
  useEffect(()=>{
    dispatch(GetTodoForms({TeacherID:userID}))
  },[dispatch])

  return (
    <Container>
    <BootstrapRow className="my-3">
      <BootstrapCol md={4}>
        <Card>
          <h2>Pending</h2>
          <p className="fs-3 bg-success-subtle px-3 rounded-5" style={{ width: "fit-content" }}>
            {FormData?.length}
          </p>
        </Card>
      </BootstrapCol>
    </BootstrapRow>

    {/* To-Do Items (Notification List) */}
    <h2>
To-Do Items{" "}
<span className="bg-info px-3 rounded-5 text-white">
  {FormData?.length < 10 ? `0${FormData?.length}` : FormData?.length}
</span>
</h2>
    <BootstrapRow className="my-3">
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
    </BootstrapRow>
  </Container>
  )
}

export default TeacherDashboard