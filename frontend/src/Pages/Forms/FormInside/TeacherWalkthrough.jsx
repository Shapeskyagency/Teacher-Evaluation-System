import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  GetWalkThroughForm,
  TeacherWalkThroughComplete,
} from "../../../redux/Form/classroomWalkthroughSlice";
import { getUserId } from "../../../Utils/auth";
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  message,
  Radio,
  Spin,
} from "antd";
import { Col, Container, Row } from "react-bootstrap";
import TextArea from "antd/es/input/TextArea";

function TeacherWalkthrough() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const FormId = useParams()?.id;

  const { isLoading, formDataList } = useSelector(
    (state) => state?.walkThroughForm
  );
  const [form] = Form.useForm();
  const Fectch = async () => {
    const data = await dispatch(GetWalkThroughForm(FormId));
    const { isTeacherCompletes } = data?.payload;
    if (isTeacherCompletes) {
      navigate(`/classroom-walkthrough/report/${FormId}`);
    } else {
      message.success("Add your feedback");
    }
  };
  useEffect(() => {
    if (FormId) {
      Fectch();
    }
  }, [dispatch, FormId]);

  const renderRadioFormItem = ({ name, label, question, isTextArea }) => (
    <>
      <Form.Item
        name={[...name, "answer"]}
        label={<h5 className="text-gray">{label}</h5>}
        rules={[{ required: true, message: "Please select an answer!" }]}
      >
        <>
          <TextArea rows={4} placeholder="Enter Your Feedback" />
        </>
      </Form.Item>
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
          <Card className="mb-3 shadow-sm">
            {renderRadioFormItem({
              name: [namePrefix, index],
              label: question,
              question,
              isTextArea: true,
            })}
          </Card>
        </Col>
      ))}
    </>
  );

  const handleNext = () => {
    form
      .validateFields()
      .then((values) => {
        setFormData((prev) => ({ ...prev, ...values }));
        handleSubmit({ ...formData, ...values });
      })
      .catch(() => message.error("Please complete all required fields."));
  };

  const handleSubmit = async (data) => {
    const payload = {
      data: { isTeacherCompletes: true, TeacherFeedback: data.TeacherFeedback },
      id: FormId,
    };

    const response = await dispatch(TeacherWalkThroughComplete(payload));
    if (response?.payload?.message) {
      message.success(response?.payload?.message);
      navigate(`/classroom-walkthrough/report/${FormId}`);
    } else {
      message.error(response?.payload?.message);
    }
  };

  return (
    <Container className="mt-3">
      {isLoading && (
        <div className="LoaderWrapper bg-opacity-100">
          <Spin size="large" className="position-absolute" />
        </div>
      )}
      <Row>
        <Col md={5}>
          <Form form={form} layout="vertical">
            {renderSections(
              "Feedback",
              ["What went well?", "Areas that need work"],
              "TeacherFeedback"
            )}
            <Button type="primary" onClick={handleNext}>
              {" "}
              Submit
            </Button>
          </Form>
        </Col>
        <Col md={7}>
          <Card title="Observer Response">
            <Descriptions bordered column={1}>
              <Descriptions.Item label={"Name"}>
                {formDataList?.grenralDetails?.NameoftheVisitingTeacher?.name}
              </Descriptions.Item>
              <Descriptions.Item label={"Date Of Observation"}>
                {formDataList?.grenralDetails?.DateOfObservation}
              </Descriptions.Item>
              <Descriptions.Item label={"Class"}>
                {formDataList?.grenralDetails?.className}
              </Descriptions.Item>
              <Descriptions.Item label={"Section"}>
                {formDataList?.grenralDetails?.Section}
              </Descriptions.Item>
              <Descriptions.Item label={"Subject"}>
                {formDataList?.grenralDetails?.Subject}
              </Descriptions.Item>
              <Descriptions.Item label={"Topic"}>
                {formDataList?.grenralDetails?.Topic}
              </Descriptions.Item>
              {formDataList?.essentialAggrements?.map((item, index) => (
                <Descriptions.Item key={index} label={item?.question}>
                  {item?.answer}
                </Descriptions.Item>
              ))}
              {formDataList?.planingAndPreparation?.map((item, index) => (
                <Descriptions.Item key={index} label={item?.question}>
                  {item?.answer}
                </Descriptions.Item>
              ))}
              {formDataList?.classRoomEnvironment?.map((item, index) => (
                <Descriptions.Item key={index} label={item?.question}>
                  {item?.answer}
                </Descriptions.Item>
              ))}
              {formDataList?.instruction?.map((item, index) => (
                <Descriptions.Item key={index} label={item?.question}>
                  {item?.answer}
                </Descriptions.Item>
              ))}
              {formDataList?.ObserverFeedback?.map((item, index) => (
                <Descriptions.Item key={index} label={item?.question}>
                  {item?.answer}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TeacherWalkthrough;
