import { Button, Card, DatePicker, Form, Input, message, Radio, Select, Spin } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import CommonStepper from "../../Components/CommonStepper";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCreateClassSection, GetTeacherList } from "../../redux/userSlice";
import { getUserId } from "../../Utils/auth";
import { EditUpdateClassForm, GetWalkThroughForm } from "../../redux/Form/classroomWalkthroughSlice";
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

function OB_WalkthroughEdit() {
  const [currStep, setCurrStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const FormId = useParams()?.id;
  const { loading, GetTeachersLists } = useSelector((state) => state?.user);
  const { isLoading, formDataList } = useSelector((state) => state?.walkThroughForm);
  const [newData, setNewData] = useState([]);

   const fetchClassData = async () => {
      try {
        const res = await dispatch(getCreateClassSection());
        if (res?.payload?.success) {
          setNewData(res?.payload?.classDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } else {
          message.error('Failed to fetch class data.');
        }
      } catch (error) {
        console.error('Error fetching class data:', error);
        message.error('An error occurred while fetching class data.');
      } 
    };

  // Fetching Data
  useEffect(() => {
    if (FormId) {
      dispatch(GetWalkThroughForm(FormId));
      dispatch(GetTeacherList());
      fetchClassData();
    }
  }, [FormId, dispatch]);

  // Set initial values for the form
  useEffect(() => {
    if (formDataList) {
      form.setFieldsValue({
        NameoftheVisitingTeacher: formDataList?.grenralDetails?.NameoftheVisitingTeacher?.id,
        DateOfObservation: formDataList?.grenralDetails?.DateOfObservation ? moment(formDataList?.grenralDetails?.DateOfObservation) : null,
        className: formDataList?.grenralDetails?.className,
        Section: formDataList?.grenralDetails?.Section,
        Subject: formDataList?.grenralDetails?.Subject,
        Topic: formDataList?.grenralDetails?.Topic,
        LessonTakenBy: formDataList?.grenralDetails?.LessonTakenBy,
        // Add other fields as necessary
      });
    }
  }, [formDataList]);

  const yesNoNAOptions = useMemo(() => ["1", "2", "3", "4", "N/A"], []);

  const steps = useMemo(
    () => [
      { title: "General Details" },
      { title: "Walkthrough Details" },
      { title: "Final" },
    ],
    []
  );

  // Dynamic Rendering Helpers
  const renderRadioFormItem = ({ name, label, question, isTextArea }) => (
    <>
      <Form.Item
        name={[...name, "answer"]}
        label={<h5 className="text-gray">{label}</h5>}
        rules={[{ required: true, message: "Please select an answer!" }]}
      >
        {isTextArea ? (
          <>
            <TextArea rows={4} placeholder="Enter Your Feedback" />
          </>
        ) : (
          <Radio.Group
            options={yesNoNAOptions.map((value) => ({
              label: value,
              value: value,
            }))}
            optionType="button"
            buttonStyle="solid"
          />
        )}
      </Form.Item>
      <Form.Item  className="hidden" hidden name={[...name, "question"]} initialValue={question}>
        <Input />
      </Form.Item>
    </>
  );

  const renderSections = (title, questions, namePrefix) => (
    <>
      <Col md={8}>
        <h2 className="mb-3 px-3 py-3 rounded-3 text-primary" style={{ background: "#f7f7f7" }}>
          {title}
        </h2>
      </Col>
      {questions.map((question, index) => (
        <Col md={8} key={`${namePrefix}${index}`}>
          <Card className="mb-3 shadow-sm">
            {renderRadioFormItem({
              name: [namePrefix, index],
              label: question,
              question,
              isTextArea: currStep === 2
            })}
          </Card>
        </Col>
      ))}
    </>
  );

 const generalDetails = useMemo(
    () => [
      { name: "DateOfObservation", label: "Date of Observation", type: "date" },
      {
        name: "className",
        label: "Class Name / Section",
        type: "select",
        options: newData?.map((item) => ({
          id: item._id,
          name: item.className,
        })),
      },
      { name: "Subject", label: "Subject", type: "select", options: ["Math", "Science", "History"] },
      { name: "Topic", label: "Topic", type: "input" },
    ],
    [GetTeachersLists, newData]
  );

  const renderGeneralDetails = () => (
    <>
      <Col md={6} className="mt-5">
        {generalDetails.map(({ name, label, type, options }) => (
             <Form.Item
               key={name}
               name={name}
               label={<h5 className="text-gray">{label}</h5>}
               rules={[
                 {
                   required: true,
                   message: `Please provide a valid ${label.toLowerCase()}!`,
                 },
               ]}
             >
               {type === "select" ? (
                 <Select
                   size="large"
                   className="general-details-select"
                   placeholder={`Select ${label.toLowerCase()}`}
                 >
                   {options?.map((option) => (
                     <Option
                       key={option?.id || option}
                       value={option?.id || option}
                     >
                       {option?.name || option}
                     </Option>
                   ))}
                 </Select>
               ) : type === "date" ? (
                 <DatePicker
                   size="large"
                   className="general-details-datepicker w-100"
                   placeholder={`Select ${label.toLowerCase()}`}
                 />
               ) : (
                 <Input
                   size="large"
                   className="general-details-input"
                   placeholder={`Enter ${label.toLowerCase()}`}
                 />
               )}
             </Form.Item>
           ))}
      </Col>
    </>
  );

  const renderWalkthroughDetails = () => (
    <>
      {renderSections("Essential Agreements", [
        "Teacher uses gender-neutral vocabulary and is sensitive to caste/class/gender in society.",
        "Teacher has established classroom rules and procedures, clear to both teacher and learners.",
        "Learners speak only when permitted (control with teacher).",
        "Student misbehavior is addressed promptly to maintain class focus.",
        "Teacher manages support roles well, including responses, praise, and decorum.",
      ], "essentialAggrements")}
      {renderSections("Planning and Preparation", [
        "Teacher displays extensive and deep knowledge of her discipline.",
        "Teacher's approach is interdisciplinary and contextual.",
        "Learning Outcomes are clear, actionable and permit viable methods of assessment.",
        "Teacher's conduct of the lesson is aligned with the expected Learning Outcomes.",
        "Teacher has adequate audio-visual aids / resources to share with the learners.",
        "Teacher creates opportunities for students to refer to text book, presentations and other required resources.",
        "Timings were managed well throughout the class."
      ], "planingAndPreparation")}

      {renderSections("Classroom Environment", [
        "Classroom interactions among the teacher and individual students are highly respectful; active listening is encouraged .",
        "Teacher displays awareness of her students' backgrounds, cultures, skills, knowledge proficiency, interests and special needs.",
        "Teacher ensures that all students receive opportunities to respond to questions.",
        "Student thinking is visible through display of responses and doubts.",
        "Teacher uses positive reinforcement in the form of smileys, stickers and verbal appreciation."
      ], "classRoomEnvironment")}

      {renderSections("Instruction", [
        "Appropriate Pre-Read/Pre-Watch was assigned as prior knowledge test.",
        "Teacher's instructions are clear and well paced.",
        "Teacher's instruction is coherent and takes students from surface to deep learning.",
        "Teacher has included BIG Question, Think lines and HOTS to stimulate and challenge student thinking.",
        "Questions/situations posed by the teacher relate to children's real life context or lend to invoking responses from children's experience.",
        "Self and Peer Assessment by students is used to monitor progress.",
        "Activities/Assessment are fully aligned with learning outcomes.",
        "Instruction is differentiated appropriately.",
        "Teacher provides good Feed forward such that it enables student learning.",
        "Teacher recapitulates the lesson /topic and checks for the attainment of the learning outcomes."
      ], "instruction")}
    </>
  );

  const renderFinalDetails = () => (
    <>
      {renderSections("Feedback", ["What went well?", "Areas that need work"], "ObserverFeedback")}
    </>
  );

  const handleNext = () => {
    form
      .validateFields()
      .then((values) => {
        setFormData((prev) => ({ ...prev, ...values }));
        if (currStep < steps.length - 1) {
          setCurrStep((prev) => prev + 1);
        } else {
          handleSubmit({ ...formData, ...values });
        }
      })
      .catch(() => message.error("Please complete all required fields."));
  };

  const handleSubmit = async (data) => {
    const payload={
        id: FormId,
        data:data
    }
    const response = await dispatch(EditUpdateClassForm(payload));
    if (response?.payload?.success) {
      message.success(response?.payload?.message);
      navigate(`/classroom-walkthrough/report/${response?.payload?.updatedForm?._id}`);
    } else {
      message.error(response?.payload?.message);
    }
  };

  return (
    <Container>
      <Row className="flex-column">
        <Col md={12} className="mb-4">
          <CommonStepper steps={steps} current={currStep} />
        </Col>
        <Col md={12}>
          <Spin spinning={loading || isLoading}>
            <Form form={form} layout="vertical" initialValues={formDataList}>
              <Row >{currStep === 0 ? renderGeneralDetails() : currStep === 1 ? renderWalkthroughDetails() : renderFinalDetails()}</Row>
              <div className="mt-3 d-flex justify-content-between">
                {currStep > 0 && <Button onClick={() => setCurrStep((prev) => prev - 1)}>Back</Button>}
                <Button type="primary" onClick={handleNext}>
                  {currStep < steps.length - 1 ? "Next" : "Submit"}
                </Button>
              </div>
            </Form>
          </Spin>
        </Col>
      </Row>
    </Container>
  )
}

export default OB_WalkthroughEdit