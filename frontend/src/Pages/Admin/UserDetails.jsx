import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { GetSignleUser, UpdateUser } from "../../redux/userSlice"; // Assuming an update action is available
import { Card, Spin, Descriptions, Row, Col, Button, Input, message } from "antd";
import { UserRole } from "../../config/config";

const UserDetails = () => {
  const [userData, setUserData] = useState(null);
  const [editStatus, setEditStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modifiedData, setModifiedData] = useState({});
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await dispatch(GetSignleUser(id));
        setUserData(res.payload);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, dispatch]);

  const renderEditableField = (label, value, fieldKey, validationRules) => {
    return editStatus ? (
      <Input
        defaultValue={value || ""}
        placeholder={label}
        onBlur={(e) => handleFieldChange(fieldKey, e.target.value, validationRules)}
        style={{ width: "100%" }}
      />
    ) : (
      value || "N/A"
    );
  };

  const handleFieldChange = (field, value, validationRules) => {
    // Field validation logic
    const error = validateField(value, validationRules);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error,
    }));

    // Update modified data
    setModifiedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const validateField = (value, rules) => {
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message;
    }
    if (rules.minLength && value.length < rules.minLength) {
      return rules.message;
    }
    return ""; // No error
  };

  const handleEditClick = () => setEditStatus(true);

  const handleUpdateClick = async () => {
    // Check for errors before updating
    const validationErrors = Object.keys(modifiedData).reduce((acc, field) => {
      const rules = getValidationRules(field);
      const error = validateField(modifiedData[field], rules);
      if (error) acc[field] = error;
      return acc;
    }, {});

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      message.error("Please fix validation errors.");
      return;
    }

    try {
      await dispatch(UpdateUser({ id, ...modifiedData }));
      message.success("User details updated successfully.");
      setLoading(true);
      const res = await dispatch(GetSignleUser(id));
      setUserData(res.payload);
      setLoading(false);
      setEditStatus(false);
      setModifiedData({});
      setErrors({});
    } catch (error) {
      message.error("Failed to update user details.");
      console.error(error);
    }
  };

  const getValidationRules = (field) => {
    switch (field) {
      case "mobile":
        return {
          pattern: /^[0-9]{10}$/,
          message: "Mobile number must be 10 digits.",
        };
      case "email":
        return {
          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: "Please enter a valid email address.",
        };
      case "name":
        return {
          minLength: 3,
          message: "Name must be at least 3 characters long.",
        };
      default:
        return {};
    }
  };

  if (loading) {
    return (
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Spin size="large" />
      </Row>
    );
  }

  if (!userData) {
    return (
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Card>
          <p>User not found or an error occurred.</p>
        </Card>
      </Row>
    );
  }

  const renderRoleSpecificFields = (role) => {
    switch (role) {
      case UserRole[1]: // Coordinator Role
        return (
          <>
            <Descriptions.Item label="Coordinator">
              {renderEditableField("Coordinator", userData.coordinator, "coordinator", {})}
            </Descriptions.Item>
            <Descriptions.Item label="Hod">
              {renderEditableField("Hod", userData.hod, "hod", {})}
            </Descriptions.Item>
          </>
        );
      case UserRole[2]: // Teacher Role
        return (
          <>
            <Descriptions.Item label="Mother Teacher">
              {renderEditableField("Mother Teacher", userData.motherTeacher, "motherTeacher", {})}
            </Descriptions.Item>
            <Descriptions.Item label="Subject Teacher">
              {renderEditableField("Subject Teacher", userData.subjectTeacher, "subjectTeacher", {})}
            </Descriptions.Item>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Row justify="center" style={{ marginTop: "2rem" }}>
      <Col span={16}>
        <Card bordered>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>User Details</h4>
            <Button
              type={editStatus ? "primary" : "default"}
              onClick={editStatus ? handleUpdateClick : handleEditClick}
              className="ms-auto d-block"
              style={editStatus ? { backgroundColor: "#1890ff", color: "#fff" } : {}}
            >
              {editStatus ? "Update" : "Edit"}
            </Button>
          </div>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Employee ID">
              {renderEditableField("Employee ID", userData.employeeId, "employeeId", {})}
            </Descriptions.Item>
            <Descriptions.Item label="Full Name">
              {renderEditableField("Full Name", userData.name, "name", { minLength: 3, message: "Name must be at least 3 characters long." })}
              {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {renderEditableField("Email", userData.email, "email", { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Please enter a valid email address." })}
              {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
            </Descriptions.Item>
            <Descriptions.Item label="Mobile">
              {renderEditableField("Mobile", userData.mobile, "mobile", { pattern: /^[0-9]{10}$/, message: "Mobile number must be 10 digits." })}
              {errors.mobile && <span style={{ color: 'red' }}>{errors.mobile}</span>}
            </Descriptions.Item>
            <Descriptions.Item label="Access Level">
              {renderEditableField("Access Level", userData.access, "access", {})}
            </Descriptions.Item>
            <Descriptions.Item label="Designation">
              {renderEditableField("Designation", userData.designation, "designation", {})}
            </Descriptions.Item>
            {renderRoleSpecificFields(userData.access)}
            <Descriptions.Item label="Class">
              {renderEditableField("Class", userData.sclass, "sclass", {})}
            </Descriptions.Item>
            <Descriptions.Item label="Section">
              {renderEditableField("Section", userData.section, "section", {})}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );
};

export default UserDetails;
