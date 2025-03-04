import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCreateClassSection,
  GetObserverList,
  GetTeacherList,
  initiateFromObserver,
  UpdateFromObserver,
} from "../../redux/userSlice";
import { useParams, useSearchParams } from "react-router-dom";
import { Form, Select, Button, Input, Radio, message, Space } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import { getUserId } from "../../Utils/auth";
import "./Weekly4Form.css"; // Import custom CSS for animation
import { UserRole } from "../../config/config";
import TextArea from "antd/es/input/TextArea";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { CreateActivityApi } from "../../redux/Activity/activitySlice";

function Weekly4Form() {
  const [isInitiate, setIsInitiate] = useState(false);
  const [thankYou, setThankYou] = useState(false);
  const dispatch = useDispatch();
  const { GetTeachersLists, GetObserverLists } = useSelector(
    (state) => state.user
  );
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [classList, setClassList] = useState();
  const [ObsereverId, setObsereverId] = useState();
  const FormId = useParams().id;

  const GetImportantDetails = async () => {
    const cls = await dispatch(getCreateClassSection());
    if (cls?.payload?.success) {
      setClassList(cls?.payload?.classDetails);
    }
  };

  useEffect(() => {
    const initiateValue = searchParams.get("Initiate");
    if (UserRole[1] === getUserId().access && initiateValue === "true") {
      setIsInitiate(true);
    } else {
      GetImportantDetails();
    }
  }, [searchParams]);

  useEffect(() => {
    if (isInitiate) {
      dispatch(GetTeacherList());
    } else {
      dispatch(GetObserverList());
    }
  }, [isInitiate, dispatch]);

  const yesNoNAOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
    { value: "N/A", label: "N/A" },
  ];

  const [sectionArry, SetSectionArry] = useState();
  const onChnageSection = (value) => {
    if (value) {
      const data = classList.filter((item) => item._id === value);
      SetSectionArry(data[0]?.sections);
    }
  };

  const RenderRadioFormItem = ({
    name,
    label,
    question,
    selectBox,
    inputBox,
    classSelection,
  }) => {
    return (
      <>
        <h5 className="text-gray">{label}</h5>
        {selectBox && (
          <>
            <Form.List
              name={[...name, "sections"]}
              rules={[
                {
                  validator: async (_, sections) => {
                    if (!sections || sections.length < 1) {
                      return Promise.reject(
                        new Error("At least one section is required")
                      );
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Row
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      className="g-3"
                    >
                      <Col xs={12} md={4}>
                        <Form.Item
                          {...restField}
                          name={[name, "classId"]}
                          fieldKey={[fieldKey, "classId"]}
                          rules={[
                            {
                              required: true,
                              message: "Please enter a class ID",
                            },
                          ]}
                        >
                          <Select
                            allowClear
                            showSearch
                            placeholder="Select a Class"
                            options={classList?.map((item) => ({
                              value: item?._id,
                              label: `${item?.className}`,
                            }))}
                            onChange={(v) => onChnageSection(v)}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={12} md={4}>
                        <Form.Item
                          {...restField}
                          name={[name, "section"]}
                          fieldKey={[fieldKey, "section"]}
                          rules={[
                            {
                              required: true,
                              message: "Please enter a section",
                            },
                          ]}
                        >
                          <Select
                            allowClear
                            showSearch
                            placeholder="Select a Section"
                            options={sectionArry?.map((item) => ({
                              value: item?.name,
                              label: `${item?.name}`,
                            }))}
                          />
                        </Form.Item>
                      </Col>

                      <Col xs={12} md={4}>
                        <Form.Item
                          {...restField}
                          name={[name, "answer"]}
                          fieldKey={[fieldKey, "answer"]}
                          rules={[
                            {
                              required: true,
                              message: "Please select an answer",
                            },
                          ]}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Radio.Group
                              size="middle"
                              options={yesNoNAOptions}
                              optionType="button"
                              buttonStyle="solid"
                            />
                            <MinusCircleOutlined style={{ marginLeft: "5px", cursor: "pointer" }} onClick={() => remove(name)} />
                          </div>
                        </Form.Item>
                      </Col>

                    </Row>
                  ))}

                  {fields.length < 5 && (
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Section
                      </Button>
                    </Form.Item>
                  )}
                </>
              )}
            </Form.List>
          </>
        )}
        {inputBox ? (
          <>
            <Form.Item
              name={[...name, "answer"]}
              // label={}
              rules={[{ required: true, message: "Please select an answer!" }]}
            >
              <Radio.Group
                size="large"
                options={yesNoNAOptions}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>

            <Form.Item
              className="mb-0"
              name={[...name, "textArea"]}
              // label={}
              rules={[{ required: true, message: "Please select an answer!" }]}
            >
              <TextArea placeholder="" />
            </Form.Item>
          </>
        ) : (
          classSelection && (
            <Form.Item
              className="mb-0"
              name={[...name, "answer"]}
              // label={}
              rules={[{ required: true, message: "Please select an answer!" }]}
            >
              <Radio.Group
                size="large"
                options={yesNoNAOptions}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
          )
        )}

        <Form.Item
          className="hidden"
          hidden
          name={[...name, "question"]}
          initialValue={question}
        >
          <Input />
        </Form.Item>
      </>
    );
  };

  const renderSections = (title, questions, namePrefix) => (
    <>
      <Col md={12}>
        <h2
          className="mb-3 px-3 py-3 rounded-3 text-primary"
          style={{ background: "#f7f7f7" }}
        >
          {title}
        </h2>
      </Col>
      {questions.map((question, index) => (
        <Col md={12} key={`${namePrefix}${index}`}>
          <div className="mb-3 shadow-sm p-3">
            <RenderRadioFormItem
              classSelection={index < 2 ? true : false}
              inputBox={index >= 3 ? true : false}
              selectBox={index === 2 ? true : false}
              name={[namePrefix, index]}
              label={question}
              question={question}
            />
          </div>
        </Col>
      ))}
    </>
  );

  const handleSubmit = async (values) => {
    const basePayload = {
      ...values,
      date: new Date(),
    };

    try {
      if (isInitiate) {
        // Case: Initiate
        const payload = {
          ...basePayload,
          isInitiated: {
            status: true,
            Observer: getUserId()?.id,
          },
        };

        const res = await dispatch(initiateFromObserver(payload));
        if (res?.payload?.success) {
          const userInfo=res?.payload?.data[0]?.teacherId
          const activity = {
            observerMessage: `You have Initiated the Learning Progress Checklist.`,
            teacherMessage: `${getUserId()?.name} has Initiated the Learning Progress Checklist.`,
            route: `/weekly4form/create/${res?.payload?.data[0]?._id}`,
            date: new Date(),
            reciverId: userInfo,
            senderId: getUserId()?.id,
            fromNo: 4,
            data: res?.payload?.data
          };

          const activitiRecord = await dispatch(CreateActivityApi(activity));
          if (!activitiRecord?.payload?.success) {
            message.error("Error on Activity Record");
          }
          setThankYou(true);
          setTimeout(() => (window.location.href = "/weekly4form"), 3000);
        } else {
          message.error("Something went wrong!");
        }
      } else if (FormId === undefined) {
        // Case: Create new entry when FormId is undefined
        const payload = {
          ...basePayload,
          dateOfSubmission: new Date(),
          isCompleted: true,
          isInitiated: {
            status: false,
            Observer: ObsereverId,
          },
        };

        const res = await dispatch(initiateFromObserver(payload));
        if (res.payload.success) {

          const userInfo=res?.payload?.data?.isInitiated?.Observer
          const activity = {
            observerMessage: `You have complete the Learning Progress Checklist.`,
            teacherMessage: `${getUserId()?.name} has been complete the Learning Progress Checklist.`,
            route: `/weekly4form/report/${res?.payload?.data?._id}`,
            date: new Date(),
            reciverId: userInfo,
            senderId: getUserId()?.id,
            fromNo: 4,
            data: res?.payload?.data
          };

          const activitiRecord = await dispatch(CreateActivityApi(activity));
          if (!activitiRecord?.payload?.success) {
            message.error("Error on Activity Record");
          }

          // setThankYou(true);
          // setTimeout(() => (window.location.href = "/weekly4form"), 1000);
        } else {
          message.error("Something went wrong!");
        }
      } else {
        // Case: Update existing entry
        const payload = {
          id: FormId,
          data: {
            ...basePayload,
            dateOfSubmission: new Date(),
            isCompleted: true,
          },
        };

        const res = await dispatch(UpdateFromObserver(payload));
        if (res?.payload?.isCompleted) {

          const userInfo=res?.payload?.isInitiated?.Observer?._id
          const activity = {
            observerMessage: `${getUserId()?.name} has been completed your initiated Learning Progress Checklist Form.`,
            teacherMessage: `You have complete the Learning Progress Checklist initiated by ${res?.payload?.isInitiated?.Observer?.name}.`,
            route: `/weekly4form/report/${res?.payload?._id}`,
            date: new Date(),
            reciverId: userInfo,
            senderId: getUserId()?.id,
            fromNo: 4,
            data: res?.payload
          };

          const activitiRecord = await dispatch(CreateActivityApi(activity));
          if (!activitiRecord?.payload?.success) {
            message.error("Error on Activity Record");
          }

          // window.location.href = "/weekly4form"; 
        } else {
          message.error("Something went wrong!");
        }
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      message.error("An unexpected error occurred!");
    }
  };

  return (
    <div>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {isInitiate ? (
          <Container className="w-100 py-5">
            {thankYou ? (
              <Row
                className="justify-content-center align-items-center"
                style={{ height: "80vh" }}
              >
                <Col md={6}>
                  <h1 className="fade-in">Form Successfully Initiated!</h1>
                  <p className="fade-in">Redirecting you...</p>
                </Col>
              </Row>
            ) : (
              <Row
                className="justify-content-center align-items-center"
                style={{ height: "80vh" }}
              >
                <Col md={4}>
                  <Form.Item
                    className="w-100"
                    label="Teacher ID"
                    name="teacherId"
                    rules={[
                      { required: true, message: "Please select a Teacher!" },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      showSearch
                      placeholder="Select a Teacher"
                      options={GetTeachersLists?.map((item) => ({
                        value: item._id,
                        label: item.name,
                      }))}
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                  <Button type="primary" htmlType="submit" className="mt-0">
                    Submit
                  </Button>
                </Col>
              </Row>
            )}
          </Container>
        ) : (
          <Container>
            <Row>
              <Col md={6}>
                {FormId === undefined && (
                  <>
                    <h6>Select Observer</h6>
                    <Select
                      className="w-100 mb-4"
                      mode="multiple"
                      allowClear
                      showSearch
                      placeholder="Select a Observer"
                      onChange={(value) => setObsereverId(value)}
                      options={GetObserverLists?.map((item) => ({
                        value: item._id,
                        label: item.name,
                      }))}
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </>
                )}

                {renderSections(
                  "Learning Progress Checklist",
                  [
                    "I have completed last week's plan.",
                    "I have uploaded experiential/active Lesson Plan for the next week that includes triggers/visual or auditory stimulus.",
                    "My last corrected work is not beyond a fortnight.",
                    "Names of Detained Students with Class.",
                    "Name of I Care Forms filled along with reason",
                  ],
                  "FormData"
                )}
              </Col>
              <Button type="primary" htmlType="submit" className="mt-0">
                Submit
              </Button>
            </Row>
          </Container>
        )}
      </Form>
    </div>
  );
}

export default Weekly4Form;
