import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  Select,
  Spin,
} from "antd";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CommonStepper from "../../../Components/CommonStepper";
import { GetObserverList } from "../../../redux/userSlice";
import { BsEmojiFrown, BsEmojiNeutral, BsEmojiSmile } from "react-icons/bs";
import { CreateNoteBookForm, GetNoteBookForm } from "../../../redux/Form/noteBookSlice";
import { getUserId } from "../../../Utils/auth";
import { UserRole } from "../../../config/config";

const NoteBookDetails = () => {
  const [currStep, setCurrStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const FormId = useParams()?.id
  const { loading, GetObserverLists } = useSelector((state) => state?.user);
//   const {isLoading,formDataList} = useSelector((state)=>state?.walkThroughForm)

  const Fectch = async () =>{
    const data = await dispatch(GetNoteBookForm(FormId));
    const {isTeacherComplete,createdBy,isObserverComplete } = data?.payload
    if(isTeacherComplete && createdBy?._id === getUserId().id && getUserId().access === UserRole[2]){
      navigate(`/notebook-checking-proforma/report/${FormId}`)
    }else if(isObserverComplete && createdBy?._id === getUserId().id && getUserId().access === UserRole[1]){
        navigate(`/notebook-checking-proforma/report/${FormId}`)
    }else{
     message.error("Somthing went worng!")
    }
   }

  useEffect(()=>{
    if(FormId){
      Fectch()
    } else{
    dispatch(GetObserverList());
    }

  },[dispatch])

  const steps = [
    { title: "General Details" },
    { title: "Proforma Details" },
    { title: "Final" },
  ];

  const yesNoNAOptions = [
    { value: "0", label: <BsEmojiSmile size={25} /> },
    { value: "1", label: <BsEmojiNeutral size={25} /> },
    { value: "-1", label: <BsEmojiFrown size={25} /> },
  ];

  const generalDetailsConfig = [
    {
      name: "NameofObserver",
      label: "Name of Observer",
      type: "select",
      options: GetObserverLists,
      list: "Observer",
    },
    { name: "DateOfObservation", label: "Date of Observation", type: "date" },
    {
      name: "className",
      label: "Class Name",
      type: "select",
      options: ["Class 1", "Class 2", "Class 3"],
    },
    {
      name: "Section",
      label: "Section",
      type: "select",
      options: ["A", "B", "C"],
    },
    {
      name: "Subject",
      label: "Subject",
      type: "select",
      options: ["Math", "Science", "History"],
    },
    { name: "ClassStrength", label: "Class Strength", type: "input" },
    { name: "NotebooksSubmitted", label: "Notebooks Submitted", type: "input" },
    { name: "Absentees", label: "Absentees", type: "input" },
    { name: "Defaulters", label: "Defaulters", type: "input" },
  ];

  const renderFormItem = ({ name, label, type, options, list }) => {
    const inputProps = {
      select: (
        <Select size="large" placeholder={`Select ${label.toLowerCase()}`}>
          {options?.map((option) =>
            list === "Observer" ? (
              <Select.Option key={option?._id} value={option?._id}>
                {option?.name}
              </Select.Option>
            ) : (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            )
          )}
        </Select>
      ),
      date: (
        <DatePicker
          size="large"
          className="w-100"
          placeholder={`Select ${label.toLowerCase()}`}
        />
      ),
      input: (
        <Input size="large" placeholder={`Enter ${label.toLowerCase()}`} />
      ),
    };

    return (
      <Form.Item
        name={name}
        label={<h5 className="text-gray">{label}</h5>}
        rules={[
          {
            required: true,
            message: `Please provide a valid ${label.toLowerCase()}!`,
          },
        ]}
      >
        {inputProps[type]}
      </Form.Item>
    );
  };

  const renderGeneralDetails = () =>
    generalDetailsConfig.map((item) => (
      <Col md={6} key={item.name}>
        {renderFormItem(item)}
      </Col>
    ));

  const Questions = {
    maintenanceOfNotebooks: [
      "I have checked that NBs are in a good physical condition.",
      "I have checked that the work presentation is neat.",
      "I have ensured that the work of the learners is complete.",
      "I have checked the appropriateness of Headings / CW / HW.",
      "There is no scribbling on the last page/any pages thereof.",
      "I have ensured that the child has implemented the previous feedback and done the correction work.",
    ],
    qualityOfOppurtunities: [
      "I have provided HOTs and VBQs with every chapter.",
      "I have made app. remarks about the quality of answers.",
      "I have developed vocab of students (pre-post activities).",
      "I have taken up at least 2 CSPs fortnightly with clear LOs.",
      "The quality questions given by me offer a scope for original thinking by learners.",
      "The writing tasks / questions given by me provide a scope for independent encounters.",
    ],
    qualityOfTeacherFeedback: [
      "I have provided timely and regular feedback.",
      "I have corrected all the notebook work.",
      "I have provided positive reinforcement.",
      "I have provided personalized feedback.",
      "My feedback provides learners directions for improvement.",
      "My feedback facilitates learners with clear directions on what good work looks like.",
    ],
    qualityOfLearner: [
      "I have checked / addressed the common misconceptions",
      "I have given remarks if the answers are copied or if there are common errors.",
    ],
  };

  const RadioFormItem = ({ name, question }) => {
    const [showRemark, setShowRemark] = useState(false);

    return (
      <div>
        {/* Answer Field */}
        <Form.Item
          name={[...name, "answer"]}
          label={
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="text-gray mb-0">{question}</h5>
            </div>
          }
          rules={[{ required: true, message: "Please select an answer!" }]}
        >
          <Radio.Group
            size="large"
            options={yesNoNAOptions.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>
        <Button
          type="link"
          onClick={() => setShowRemark(!showRemark)}
          style={{ padding: 0 }}
        >
          {showRemark ? "Hide Remark" : "Add Remark"}
        </Button>

        {/* Hidden Question Field */}
        <Form.Item name={[...name, "question"]} initialValue={question} hidden>
          <Input />
        </Form.Item>

        {/* Remark Field */}
        {showRemark && (
          <Form.Item
            name={[...name, "remark"]}
            rules={[{ required: false }]}
            style={{ marginTop: "1rem" }}
          >
            <Input.TextArea rows={3} placeholder="Add your remark here" />
          </Form.Item>
        )}
      </div>
    );
  };

  const renderMaintenanceQuestions = () => (
    <>
      <Col md={8}>
        <h2
          className="mb-3 px-3 py-3 rounded-3 text-primary"
          style={{ background: "#f7f7f7" }}
        >
          Maintenance Of Notebooks
        </h2>
      </Col>
      {Questions["maintenanceOfNotebooks"].map((question, index) => (
        <Col md={8} key={`maintenanceOfNotebooks-${index}`}>
          <Card className="mb-3 shadow-sm">
            <RadioFormItem
              name={["maintenanceOfNotebooks", index]}
              question={question}
            />
          </Card>
        </Col>
      ))}
    </>
  );

  const renderQualityOfOppurtunities = () => (
    <>
      <Col md={8}>
        <h2
          className="mb-3 px-3 py-3 rounded-3 text-primary"
          style={{ background: "#f7f7f7" }}
        >
         Quality Of Oppurtunities
        </h2>
      </Col>
      {Questions["qualityOfOppurtunities"].map((question, index) => (
        <Col md={8} key={`qualityOfOppurtunities-${index}`}>
          <Card className="mb-3 shadow-sm">
            <RadioFormItem
              name={["qualityOfOppurtunities", index]}
              question={question}
            />
          </Card>
        </Col>
      ))}
    </>
  );


  const renderQualityOfTeacherFeedback = () => (
    <>
      <Col md={8}>
        <h2
          className="mb-3 px-3 py-3 rounded-3 text-primary"
          style={{ background: "#f7f7f7" }}
        >
         Quality Of TeacherFeedback
        </h2>
      </Col>
      {Questions["qualityOfTeacherFeedback"].map((question, index) => (
        <Col md={8} key={`qualityOfTeacherFeedback-${index}`}>
          <Card className="mb-3 shadow-sm">
            <RadioFormItem
              name={["qualityOfTeacherFeedback", index]}
              question={question}
            />
          </Card>
        </Col>
      ))}
    </>
  );

  const renderQualityOfLearner = () => (
    <>
      <Col md={8}>
        <h2
          className="mb-3 px-3 py-3 rounded-3 text-primary"
          style={{ background: "#f7f7f7" }}
        >
         Quality Of Learner
        </h2>
      </Col>
      {Questions["qualityOfLearner"].map((question, index) => (
        <Col md={8} key={`qualityOfLearner-${index}`}>
          <Card className="mb-3 shadow-sm">
            <RadioFormItem
              name={["qualityOfLearner", index]}
              question={question}
            />
          </Card>
        </Col>
      ))}
    </>
  );

  const handleNext = () => {
    form
      .validateFields()
      .then((values) => {
        // Merge current step data with existing formData
        setFormData((prev) => ({
          ...prev,
          ...values,
        }));

        // Determine if it's the last step
        const isLastStep = currStep >= steps.length - 1;

        if (isLastStep) {
          handleSubmit({ ...formData, ...values });
        } else {
          setCurrStep((prevStep) => prevStep + 1);
        }
      })
      .catch((errorInfo) => {
        const fieldErrors = errorInfo.errorFields
          .map((field) => field.name)
          .join(", ");
        message.error(`Please complete all required fields`);
      });
  };

  const handleSubmit = async (finalData) => {
    const data = await dispatch(CreateNoteBookForm(finalData))
    if(data?.payload?.status){
      message.success(data?.payload?.message);
      navigate(`/notebook-checking-proforma/report/${data?.payload?.form?._id}`)
    }else{
      message.success(data?.payload?.message);
    }
  };

  return (
    <div className="container">
      <Row className="flex-column">
        <Col md={12} className="sticky-stepper z-0">
          <div className="sticky-top bg-white w-100 p-3">
            <CommonStepper currentStep={currStep} steps={steps} />
          </div>
        </Col>
        <Col md={12} className="scrollable-form position-relative">
        {loading && <div className="LoaderWrapper" >
<Spin size="large" className="position-absolute" />
</div>}
          <Form form={form} layout="vertical" className="w-100">
            <Container className="mt-5">
              <Row className="justify-content-start flex-column align-items-start">
                {currStep === 0 && renderGeneralDetails()}
                {currStep === 1 && (
                  <>
                    {renderMaintenanceQuestions()}
                    {renderQualityOfOppurtunities()}
                    
                  </>
                )}

                {currStep===2&&(
                    <>
                    {renderQualityOfTeacherFeedback()}
                    {renderQualityOfLearner()}
                    </>
                )}

                <Col
                  md={currStep === 0 ? 6 : 8}
                  className="mt-3 d-flex justify-content-between bg-white py-5"
                >
                  <Button
                    size="large"
                    disabled={currStep === 0}
                    className="px-5"
                    type="default"
                    onClick={() => setCurrStep(currStep - 1)}
                  >
                    Back
                  </Button>
                  <Button
                    size="large"
                    className="px-5"
                    type="primary"
                    onClick={handleNext}
                  >
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
};

export default NoteBookDetails;
