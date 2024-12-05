import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { Col, Row } from "react-bootstrap";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetFormsOne, GetObserverFormsOne } from "../../redux/Form/fortnightlySlice";
import BasicDeatilsForm from "../../Components/BasicDeatilsForm";
import { FormcolumnsForm1 } from "../../Components/Data";
import { UserRole } from "../../config/config";
import { getUserId } from "../../Utils/auth";

const FortnightlyMonitor = () => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Role = getUserId().access

  // Default `forms` to an empty array to avoid errors
  const forms = useSelector((state) => state?.Forms?.getAllForms || []);
  const [sortedForms, setSortedForms] = useState([]);

  // Fetch forms only once
  useEffect(() => {
    if(Role === UserRole[1]){
      dispatch(GetObserverFormsOne());
    }else if(Role === UserRole[2]){
      dispatch(GetFormsOne());
    }
  }, [dispatch]);

  // Sort forms when they change
  useEffect(() => {
    if (Array.isArray(forms)) {
      const sortedData = [...forms].sort((a, b) => {
        if (a.isTeacherComplete === b.isTeacherComplete) {
          return 0; // No change in order if both are the same
        }
        return a.isTeacherComplete ? 1 : -1; // Place `false` first
      });
      setSortedForms(sortedData);
    }
  }, [forms]);


  const renderForms = (title) => (
    <>
      <h3>{title}</h3>
      <Table
        columns={FormcolumnsForm1}
        dataSource={sortedForms}
        rowKey="id" // Ensure a unique key for each row
        bordered
        scroll={{
          x: "max-content", // Makes the table horizontally scrollable for mobile
        }}
        pagination={{
          pageSize: 5, // Limits rows per page for better mobile UX
          responsive: true,
        }}
      />
    </>
  );

  return (
    <div className="container py-4">
      <Row>
        <Col>
        <div className='pb-0 pt-0' style={{ padding: "16px" }}>
       
          {getUserId().access === UserRole[2] && (
            <Button
              onClick={() => navigate("/fortnightly-monitor/create")}
              type="primary"
              icon={<PlusCircleOutlined />}
              size="large"
            >
              New Form
            </Button>
          )}
        
          {renderForms("All Forms")}
          </div>
        </Col>
      </Row>

    </div>
  );
};

export default FortnightlyMonitor;
