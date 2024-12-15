import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Select, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetObserverList, GetTeacherList } from "../redux/userSlice";
import { CreateFormOne, GetFormsOne } from "../redux/Form/fortnightlySlice";
import { getUserId } from "../Utils/auth";
import { UserRole } from "../config/config";

const { Option } = Select;

function BasicDetailsForm() {
  const [loading, setLoading] = useState(false);
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const CurrectUserRole = getUserId().access;

  const TeachersList = useSelector((state) => state.user.GetTeachersLists);
  const ObserverList = useSelector((state) => state.user.GetObserverLists);

  const disableFutureDates = (current) => {
    // Get the current date without the time part
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to 00:00:00 to compare only the date

    // Disable dates that are in the future
    return current && current.toDate() > today;
  };


  useEffect(() => {
    dispatch(GetTeacherList());
    dispatch(GetObserverList());
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
    const payload = {
      className: values?.className,
      section: values?.section,
      date: values?.date,
      isCoordinator: values?.isCoordinator || isCoordinator,
      coordinatorID: values?.coordinatorID || "",
      isTeacher: values?.isTeacher|| isTeacher,
      teacherID: values?.teacherID || "",
    };

    setLoading(true);
    try {
      const response = await dispatch(CreateFormOne(payload)).unwrap();
      console.log(response?.form);
      message.success(response?.message);
      form.resetFields(); // Reset the form fields after submission
      navigate(`/fortnightly-monitor/create/${response?.form?._id}`);
      dispatch(GetFormsOne());
    } catch (error) {
      message.error("Error creating Fortnightly Monitor");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <h2 className='mb-5 pt-5 text-center'>Let's Start Creating....!</h2> */}

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
            <Form.Item
              label="Class"
              name="className"
              rules={[{ required: true, message: "Please enter a class!" }]}
            >
              <Input placeholder="Enter Class (e.g., 10th)" />
            </Form.Item>

            <Form.Item
              label="Section"
              name="section"
              rules={[{ required: true, message: "Please enter a section!" }]}
            >
              <Input placeholder="Enter Section (e.g., A, B)" />
            </Form.Item>

            <div className="d-flex gap-3 align-items-center justify-content-between">
              <Form.Item
                className="w-100"
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please select a date!" }]}
              >
                <DatePicker className="w-100" format="YYYY-MM-DD"  disabledDate={disableFutureDates}/>
              </Form.Item>
              {CurrectUserRole === UserRole[2] && (
                <>
                  <Form.Item
                  className="w-100"
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
                  <Form.Item
                  hidden
                    className="w-100"
                    label="Coordinator"
                    name="isCoordinator"
                  >
                    <Select
                      onChange={(value) => {
                        setIsCoordinator(true);
                        setIsTeacher(false); // Disable Teacher when Coordinator is selected
                        form.resetFields(["teacherID"]); // Reset teacher-related fields
                      }}
                    >
                      <Option value={false}>No</Option>
                      <Option value={true}>Yes</Option>
                    </Select>
                  </Form.Item>
                </>
              )}

              {CurrectUserRole === UserRole[1] && (
                <>
               
                  <Form.Item
                  className="w-100"
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
              {loading ? "Creating Form..." : "Create Form"}
            </Button>
          </Form>
        </Spin>
      </div>
    </>
  );
}

export default BasicDetailsForm;
