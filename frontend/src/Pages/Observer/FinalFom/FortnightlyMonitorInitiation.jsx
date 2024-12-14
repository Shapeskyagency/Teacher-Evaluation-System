import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Select, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserId } from "../../../Utils/auth";
import { UserRole } from "../../../config/config";
import { GetTeacherList } from "../../../redux/userSlice";
import { FormInitiationAction, GetFormsOne } from "../../../redux/Form/fortnightlySlice";

const { Option } = Select;

function FortnightlyMonitorInitiation() {

    const [loading, setLoading] = useState(false);
    const [isCoordinator, setIsCoordinator] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const CurrectUserRole = getUserId().access;
  
    const TeachersList = useSelector((state) => state.user.GetTeachersLists);
    const ObserverList = useSelector((state) => state.user.GetObserverLists);
  
    useEffect(() => {
      dispatch(GetTeacherList());
      if(CurrectUserRole === UserRole[2]){
        setIsTeacher(false);
        setIsCoordinator(true)
      }
      if(CurrectUserRole === UserRole[1]){
        setIsTeacher(true);
        setIsCoordinator(false)
      }
    }, [dispatch]);
  
    const handleSubmit = async (values) => {

        console.log(values)

      const payload = {
        isTeacher: values?.isTeacher|| isTeacher,
        teacherIDs: values?.teacherIDs || "",
      };
      

      console.log(payload)
  
      setLoading(true);
      try {
        const response = await dispatch(FormInitiationAction(payload)).unwrap();
        console.log(response?.form);
        message.success(response?.message);
        form.resetFields(); // Reset the form fields after submission
        navigate(`/fortnightly-monitor`);
        dispatch(GetFormsOne());
      } catch (error) {
        message.error("Error creating Fortnightly Monitor");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
  return (
    <div
    className="create-form m-auto pb-5 pt-5"
    style={{ maxWidth: "400px" }}
  >
    <Spin spinning={loading}>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          isCoordinator: false,
          isTeacher: false,
        }}
      >
      

        <div className="d-flex gap-3 align-items-center justify-content-between">
          {CurrectUserRole === UserRole[1] && (
            <>
           
              <Form.Item
              className="w-100"
                label="Teacher ID"
                name="teacherIDs"
                rules={[
                  { required: true, message: "Please select a Teacher!" },
                ]}
              >
                <Select
                mode="multiple"
                allowClear
                  showSearch
                  placeholder="Select a Teacher"
                  options={TeachersList?.map((item) => ({
                    value: item._id,
                    label: item.name,
                  }))}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
              <Form.Item
              hidden
                className="w-100"
                label="Teachers"
                name="isTeacher"
              >
                <Select
                  onChange={(value) => {
                    setIsTeacher(true);
                    setIsCoordinator(false); // Disable Coordinator when Teacher is selected
                    form.resetFields(["coordinatorID"]); // Reset coordinator-related fields
                  }}
                  disabled={isCoordinator} // Disable if Coordinator is selected
                >
                  <Option value={false}>No</Option>
                  <Option value={true}>Yes</Option>
                </Select>
              </Form.Item>
            </>
          )}
        </div>

        {CurrectUserRole === UserRole[0] && (
          <>
            <div className="d-flex gap-3 align-items-center justify-content-between">
              <Form.Item
                className="w-100"
                label="Coordinator"
                name="isCoordinator"
              >
                <Select
                  onChange={(value) => {
                    setIsCoordinator(value);
                    setIsTeacher(false); // Disable Teacher when Coordinator is selected
                    form.resetFields(["teacherID"]); // Reset teacher-related fields
                  }}
                >
                  <Option value={false}>No</Option>
                  <Option value={true}>Yes</Option>
                </Select>
              </Form.Item>

              <Form.Item
                className="w-100"
                label="Teachers"
                name="isTeacher"
              >
                <Select
                  onChange={(value) => {
                    setIsTeacher(value);
                    setIsCoordinator(false); // Disable Coordinator when Teacher is selected
                    form.resetFields(["coordinatorID"]); // Reset coordinator-related fields
                  }}
                  disabled={isCoordinator} // Disable if Coordinator is selected
                >
                  <Option value={false}>No</Option>
                  <Option value={true}>Yes</Option>
                </Select>
              </Form.Item>
            </div>

            {isCoordinator && (
              <Form.Item
                label="Coordinator ID"
                name="coordinatorID"
                rules={[
                  {
                    required: true,
                    message: "Please select a Coordinator!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select a Coordinator"
                  options={ObserverList?.map((item) => ({
                    value: item._id,
                    label: item.name,
                  }))}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            )}

            {isTeacher && (
              <Form.Item
                label="Teacher ID"
                name="teacherID"
                rules={[
                  { required: true, message: "Please select a Teacher!" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select a Teacher"
                  options={TeachersList?.map((item) => ({
                    value: item._id,
                    label: item.name,
                  }))}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            )}
          </>
        )}

        <Button type="primary" htmlType="submit" disabled={loading}>
          {loading ? "initiating Form..." : "initiate"}
        </Button>
      </Form>
    </Spin>
  </div>
  )
}

export default FortnightlyMonitorInitiation