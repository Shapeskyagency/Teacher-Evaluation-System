import React, { useEffect, useState } from "react";
import CommonStepper from "../../../Components/CommonStepper";
import { Col, Container, Row } from "react-bootstrap";
import { DatePicker, Select, Button, Form, message, Input, Card, Radio, Spin } from "antd";
import "./DetailsWalkthrough.css"; // Import CSS for scroll customization
import TextArea from "antd/es/input/TextArea";
import { CreateWalkThrough, GetWalkThroughForm } from "../../../redux/Form/classroomWalkthroughSlice";
import { useDispatch, useSelector } from "react-redux";
import { GetTeacherList } from "../../../redux/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { getUserId } from "../../../Utils/auth";
const { Option } = Select;

function DetailsWalkthrough() {
  const [currStep, setCurrStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const FormId = useParams()?.id
  const {loading,GetTeachersLists} = useSelector((state)=>state?.user)
  const {isLoading,formDataList} = useSelector((state)=>state?.walkThroughForm)

  const Fectch = async () =>{
    const data = await dispatch(GetWalkThroughForm(FormId));
    const {isObserverCompleted,createdBy } = data?.payload
    if(isObserverCompleted && createdBy?._id === getUserId().id){
      navigate(`/classroom-walkthrough/report/${FormId}`)
    }else{
     message.error("Somthing went worng!")
    }
   }
  useEffect(()=>{
    if(FormId){
      Fectch()
    } else{
    dispatch(GetTeacherList());
    }

  },[dispatch])

  const steps = [
    { title: "General Details" },
    { title: "Walkthrough Details" },
    { title: "Final" },
  ];

  const capitalizeFirstLetter = (str) => {
    return str
      .split(' ') // Split the string into an array of words
      ?.map(word => {
        // Capitalize the first letter and keep the rest lowercase
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' '); // Join the words back into a string
  };
  
  const yesNoNAOptions = ["1", "2", "3", "4", "N/A"];

  const RadioFormItem = ({ name, label, question, TextAreaa, answer }) => (
    <Form.Item
      name={name}
      label={<h5 className="text-gray">{label}</h5>} // Fixed typo here
      rules={[{ required: true, message: "Please provide an answer!" }]}
    >
      {TextAreaa === true ? (
        <TextArea
          rows={4}
          placeholder="Enter Your Feedback"
          // value={answer && question ? `${question}: ${answer}` : ''} // Display question with answer if available
        />
      ) : (
        <Radio.Group
          options={yesNoNAOptions?.map((value) => ({
            label: value,
            value: JSON.stringify({ question, answer: value }), // Stringify the question-answer pair
          }))}
          optionType="button"
          buttonStyle="solid"
        />
      )}
    </Form.Item>
  );
  


  const renderGeneralDetails = () => (
    <>
      {[
        { name: "NameoftheVisitingTeacher", label: "Name of the Visiting Teacher", type: "select", options: GetTeachersLists, List: "Teacher" },
        { name: "DateOfObservation", label: "Date of Observation", type: "date" },
        { name: "className", label: "Class Name", type: "select", options: ["Class 1", "Class 2", "Class 3"] },
        { name: "Section", label: "Section", type: "select", options: ["A", "B", "C"] },
        { name: "Subject", label: "Subject", type: "select", options: ["Math", "Science", "History"] },
        { name: "Topic", label: "Topic", type: "input" },
        { name: "LessonTakenBy", label: "Lesson Taken By", type: "select", options: ["Teacher A", "Teacher B"] },
      ].map(({ name, label, type, options, List }) => (
        <Col md={6} key={name}>
          <Form.Item
            name={name}
            label={<h5 className="text-gray">{label}</h5>}
            rules={[{ required: true, message: `Please provide a valid ${label.toLowerCase()}!` }]}
          >
            {type === "select" ? (
              List === "Teacher" ? (
                // Assuming GetTeachersLists is an array of teacher objects
                <Select size="large" placeholder={`Select ${label.toLowerCase()}`}>
                  {options?.map((option) => (
                    <Option key={option?._id || option} value={option?._id || option}>
                      {option?.name || option}
                    </Option>
                  ))}
                </Select>
              ) : (
                <Select size="large" placeholder={`Select ${label.toLowerCase()}`}>
                  {options?.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              )
            ) : type === "date" ? (
              <DatePicker size="large" className="w-100" placeholder={`Select ${label.toLowerCase()}`} />
            ) : (
              <Input size="large" placeholder={`Enter ${label.toLowerCase()}`} />
            )}
          </Form.Item>
        </Col>
      ))}
    </>
  );
  

  const renderWalkthroughDetails = () => (
    <>
      <Col md={8}>
        <h2 className="mb-3 px-3 py-3 rounded-3 text-primary" style={{background:"#f7f7f7"}}>Essential Agreements</h2>
      </Col>
      {[
        "Teacher uses gender-neutral vocabulary and is sensitive to caste/class/gender in society.",
        "Teacher has established classroom rules and procedures, clear to both teacher and learners.",
        "Learners speak only when permitted (control with teacher).",
        "Student misbehavior is addressed promptly to maintain class focus.",
        "Teacher manages support roles well, including responses, praise, and decorum.",
      ].map((question, index) => (
        <Col md={8} key={`essentialAgreements${index}`}>
          <Card className="mb-3 shadow-sm">
            <RadioFormItem
              name={["essentialAggrements", index]}
              label={question}
              question={question}
            />
          </Card>
        </Col>
      ))}

      <Col md={8}>
      <h2 className="mb-3 px-3 py-3 rounded-3 text-primary" style={{background:"#f7f7f7"}}>Planning and Preparation</h2>
      </Col>

      {[
        "Teacher displays extensive and deep knowledge of her discipline.",
        "Teacher's approach is interdisciplinary and contextual.",
        "Learning Outcomes are clear, actionable and permit viable methods of assessment.",
        "Teacher's conduct of the lesson is aligned with the expected Learning Outcomes.",
        "Teacher has adequate audio-visual aids / resources to share with the learners.",
        "Teacher creates opportunities for students to refer to text book, presentations and other required resources.",
        "Timings were managed well throughout the class."
      ].map((question, index) => (
        <Col md={8} key={`planingAndPreparation${index}`}>
          <Card className="mb-3 shadow-sm">
            <RadioFormItem
              name={["planingAndPreparation", index]}
              label={question}
              question={question}
            />
          </Card>
        </Col>
      ))}

      <Col md={8}>
      <h2 className="mb-3 px-3 py-3 rounded-3 text-primary" style={{background:"#f7f7f7"}}>Classroom Environment</h2>
      </Col>

      {[
        "Classroom interactions among the teacher and individual students are highly respectful; active listening is encouraged .",
        "Teacher displays awareness of her students' backgrounds, cultures, skills, knowledge proficiency, interests and special needs.",
        "Teacher ensures that all students receive opportunities to respond to questions.",
        "Student thinking is visible through display of responses and doubts.",
        "Teacher uses positive reinforcement in the form of smileys, stickers and verbal appreciation."
      ].map((question, index) => (
        <Col md={8} key={`classRoomEnvironment${index}`}>
          <Card className="mb-3 shadow-sm">
            <RadioFormItem
              name={["classRoomEnvironment", index]}
              label={question}
              question={question}
            />
          </Card>
        </Col>
      ))}

<Col md={8}>
<h2 className="mb-3 px-3 py-3 rounded-3 text-primary" style={{background:"#f7f7f7"}}>Instruction</h2>
      </Col>

      {[
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
      ].map((question, index) => (
        <Col md={8} key={`instruction${index}`}>
          <Card className="mb-3 shadow-sm">
            <RadioFormItem
              name={["instruction", index]}
              label={question}
              question={question}
            />
          </Card>
        </Col>
      ))}
    </>
  );

  const renderFinalDetails = () => (
    <>
    <Col md={8}>
<h2 className="mb-3 px-3 py-3 " >{capitalizeFirstLetter(`ACADEMIC HEAD / COORDINATOR'S / HOD'S FEEDBACK `)}</h2>
      </Col>

      {[
  "What went well?",
  "Areas that need some work",
].map((question, index) => (
  <Col md={8} key={`ObserverFeedback${index}`}>
    <Card className="mb-3 shadow-sm">
      <RadioFormItem
        TextAreaa={true} // Fixed typo here from TextAreaa to TextArea
        name={[`ObserverFeedback`,question]} // Use a string name for unique identification
        label={question}
        question={question}
      />
    </Card>
  </Col>
))}
    </>
  );

  const renderStepContent = () => {
    switch (currStep) {
      case 0:
        return renderGeneralDetails();
      case 1:
        return renderWalkthroughDetails();
      case 2:
        return renderFinalDetails();
      default:
        return null;
    }
  };

  const handleNext = () => {
    form.validateFields().then((values) => {
      // Merge the new values with the existing formData
      setFormData((prevFormData) => ({ ...prevFormData, ...values }));
  
      // If it's not the last step, just move to the next step
      if (currStep < steps.length - 1) {
        setCurrStep(currStep + 1);
      } else {
        // If it's the last step, submit the data
        handleSubmit({ ...formData, ...values });
      }
    }).catch(() => {
      // Display an error message if form validation fails
      message.error("Please complete all required fields.");
    });
  };
  

  const handleBack =  () => setCurrStep(currStep - 1);

  const handleSubmit = async (finalData) => {
    const data = await dispatch(CreateWalkThrough(finalData))
    if(data?.payload?.status){
      message.success(data?.payload?.message);
      navigate(`/classroom-walkthrough/report/${data?.payload?.form?._id}`)
    }else{
      message.success(data?.payload?.message);
    }
  };

  return (
    <div className="container ">
      <Row className="flex-column">
      <Col md={12} className="sticky-stepper z-0">
        <div className="sticky-top bg-white w-100 p-3 ">
          <CommonStepper currentStep={currStep} steps={steps} />
        </div>
      </Col>
      <Col md={12} className="scrollable-form position-relative">
      {(loading || isLoading) && <div className="LoaderWrapper" >
<Spin size="large" className="position-absolute" />
</div>}
        <Form form={form} layout="vertical" className="w-100">
          <Container className="mt-5">
            <Row className="justify-content-start flex-column align-items-start lh-base  ">
              {renderStepContent()}
              <Col md={currStep === 0 ? 6 : 8} className="mt-3 d-flex justify-content-between  bg-white py-5   bottom-0 pt-0">
                
                  <Button size="large" disabled={currStep > 0 ? false:true} className="px-5" type="default" onClick={handleBack}>
                    Back
                  </Button>
                
                <Button size="large" className="px-5" type="primary" onClick={handleNext}>
                  {currStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </Col>
    </Row>

     
    </div>
  );
}

export default DetailsWalkthrough;
