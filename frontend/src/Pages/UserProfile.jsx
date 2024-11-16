import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Avatar,
  Typography,
  message,
  Spin,
  Row,
  Col,
} from "antd";
import { UserOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { GetSignleUser, UpdateUser } from "../redux/userSlice";
import { getUserId } from "../Utils/auth";

const { Title } = Typography;

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const userId = getUserId().id;

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await dispatch(GetSignleUser(userId));
        setUserData(response.payload); // Assuming `payload` contains user data
      } catch (error) {
        message.error("Failed to fetch user data.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch, userId]);

  // Enable edit mode
  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue(userData);
  };

  // Save updated profile
  const handleSave = async () => {
    try {
      const currentValues = await form.validateFields(); // Get the current form values
      const updatedData = Object.keys(currentValues).reduce((acc, key) => {
        if (currentValues[key] !== userData[key]) {
          acc[key] = currentValues[key]; // Include only updated fields
        }
        return acc;
      }, {});

      if (Object.keys(updatedData).length > 0) {
        // Ideally, call an API or dispatch an action to update the user profile
        const id = userId;
        await dispatch(UpdateUser({ id, ...updatedData }));
        setUserData((prevData) => ({ ...prevData, ...updatedData }));
        message.success("Profile updated successfully!");
      } else {
        message.info("No changes made to the profile.");
      }

      setIsEditing(false); // Exit edit mode
    } catch (error) {
      message.error("Please fix the errors in the form.");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card
      style={{
        maxWidth: 400,
        margin: "auto",
        marginTop: "20px",
        marginBottom: 24,
      }}
      cover={
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Avatar
            className="Bg-Temp"
            size={100}
            icon={userData?.name?.slice(0, 1) || <UserOutlined />}
          />
          <Title level={4} style={{ marginTop: "10px" }}>
            {userData?.name || "User Name"}
          </Title>
        </div>
      }
      actions={[
        isEditing ? (
          <>
            <Button icon={<SaveOutlined />} onClick={handleSave} type="primary">
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </>
        ) : (
          <Button icon={<EditOutlined />} onClick={handleEdit}>
            Edit Profile
          </Button>
        ),
      ]}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={userData}
        disabled={!isEditing}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Name is required!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required!" },
                { type: "email", message: "Enter a valid email address!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Phone"
              name="mobile"
              rules={[
                { required: true, message: "Phone number is required!" },
                {
                  pattern: /^\d{10}$/,
                  message:
                    "Enter a valid 10 digit phone number (e.g., 0123456789).",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Designation"
              name="designation"
              rules={[{ required: true, message: "Designation is required!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default UserProfile;
