import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ClassroomWalkthrough() {
  const navigate = useNavigate()
  return (
    <div className="container py-4">
      <Row>
        <Col>
          <Button
            onClick={() => navigate("/classroom-walkthrough/create")}
            type="primary"
            icon={<PlusCircleOutlined />}
            size="large"
          >
           Fill New Form
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default ClassroomWalkthrough;
