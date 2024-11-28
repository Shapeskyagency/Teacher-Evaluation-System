import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { Col, Row } from "react-bootstrap";

function ClassroomWalkthrough() {
  return (
    <div className="container py-4">
      <Row>
        <Col>
          <Button
            // onClick={() => navigate("/fortnightly-monitor/create")}
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
