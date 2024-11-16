import React, { useState } from 'react';
import { Card, Button } from 'antd';
import { Container, Row as BootstrapRow, Col as BootstrapCol } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // For page redirection

// Mock data for notifications
const notifications = [
  { id: 1, class: '10th', section: 'A', date: '2024-11-17', teacherName: 'Teacher 1' },
  { id: 2, class: '12th', section: 'B', date: '2024-11-18', teacherName: 'Teacher 2' },
];

function ObserverDashboard() {
  const [pendingCount, setPendingCount] = useState(notifications.length); // Based on mock data

  return (
    <Container>
      <BootstrapRow className="my-3">
        <BootstrapCol md={4}>
          <Card>
            <h2>Pending</h2>
            <p className="fs-3 bg-success-subtle px-3 rounded-5" style={{ width: "fit-content" }}>
              {pendingCount}
            </p>
          </Card>
        </BootstrapCol>
      </BootstrapRow>

      {/* To-Do Items (Notification List) */}
      <BootstrapRow className="my-3">
        <BootstrapCol>
          <Card title="To-Do Items" style={{ minHeight: '300px' }}>
            <ul>
              {notifications.map((task) => (
                <li key={task.id}>
                  <Card>
                    <h4>
                      {`Class: ${task.class} | Section: ${task.section} | Date: ${task.date} | Teacher: ${task.teacherName}`}
                    </h4>
                    <Link to={`/fortnightly-monitor/${task.id}`}>
                      <Button type="primary">Fill Form</Button>
                    </Link>
                  </Card>
                </li>
              ))}
            </ul>
          </Card>
        </BootstrapCol>
      </BootstrapRow>
    </Container>
  );
}

export default ObserverDashboard;
