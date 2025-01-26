import React, { useEffect, useMemo, useState } from "react";
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
import { getCreateClassSection, GetObserverList } from "../../../redux/userSlice";
import { BsEmojiFrown, BsEmojiNeutral, BsEmojiSmile } from "react-icons/bs";
import { CreateNoteBookForm, GetNoteBookForm } from "../../../redux/Form/noteBookSlice";
import { getUserId } from "../../../Utils/auth";
import { UserRole } from "../../../config/config";



const { Option } = Select;


const NoteBookDetails = () => {
  const [currStep, setCurrStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [newData, setNewData] = useState([]);
  const [sectionState, setSectionState] = useState([]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const FormId = useParams()?.id
  const { loading, GetObserverLists } = useSelector((state) => state?.user);
  //   const {isLoading,formDataList} = useSelector((state)=>state?.walkThroughForm)
// Fetch notebook form details
const fetchNoteBookForm = async () => {
  try {
    const response = await dispatch(GetNoteBookForm(FormId));
    const { isTeacherComplete, createdBy, isObserverComplete } = response?.payload;
    const userId = getUserId().id;
    const userAccess = getUserId().access;

    if (
      (isTeacherComplete && createdBy?._id === userId && userAccess === UserRole[2]) ||
      (isObserverComplete && createdBy?._id === userId && userAccess === UserRole[1])
    ) {
      navigate(`/notebook-checking-proforma/report/${FormId}`);
    } else {
      message.error("Something went wrong!");
    }
  } catch (error) {
    console.error("Error fetching notebook form:", error);
    message.error("Failed to fetch notebook form details.");
  }
};

// Fetch class and section data
const fetchClassData = async () => {
  try {
    const response = await dispatch(getCreateClassSection());
    if (response?.payload?.success) {
      setNewData(
        response?.payload?.classDetails.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
    } else {
      message.error("Failed to fetch class data.");
    }
  } catch (error) {
    console.error("Error fetching class data:", error);
    message.error("An error occurred while fetching class data.");
  }
};

useEffect(() => {
  fetchClassData();
  if (FormId) {
    fetchNoteBookForm();
  } else {
    dispatch(GetObserverList());
  }
}, [dispatch, FormId]);

const disableFutureDates = (current) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return current && current.toDate() > today;
};

  const steps = [
    { title: "General Details" },
    { title: "Final" },
  ];

  const yesNoNAOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "N/A", label: "N/A" },
  ];


  const SectionSubject = (value) => {
    if (value) {
      const filteredData = newData.filter((data) => data?._id === value);
      if (filteredData.length > 0) {
        setSectionState(filteredData[0]);
      }

    }

    return []; // Return an empty array if value is falsy
  };





  const generalDetailsConfig = useMemo(
    () => [
      {
        name: "NameofObserver",
        label: "Name of Observer",
        type: "select",
        options: GetObserverLists?.map((item) => ({
          id: item?._id,
          value: item?._id,
          name: item?.name,
        })),
        list: "Observer",
      },
      { name: "DateOfObservation", label: "Date of Observation", type: "date" },
      {
        name: "className",
        label: "Class Name",
        type: "select",
        options: newData?.map((item) => ({
          id: item._id,
          value: item?._id,
          name: item.className,
        })),
      },
      {
        name: "Section",
        label: "Section",
        type: "select",
        options: sectionState?.sections?.map((item) => ({
          id: item._id,
          value: item?.name,
          name: item.name,
        })),
      },
      {
        name: "Subject",
        label: "Subject",
        type: "select",
        options: sectionState?.subjects?.map((item) => ({
          id: item._id,
          value: item?.name,
          name: item.name,
        })),
      },
      { name: "ClassStrength", label: "Class Strength", type: "input" },
      { name: "NotebooksSubmitted", label: "Notebooks Submitted", type: "input" },
      { name: "Absentees", label: "Absentees", type: "input" },
      { name: "Defaulters", label: "Defaulters", type: "input" },
    ], [GetObserverLists, newData, sectionState]
  );

  const renderFormItem = ({ name, label, type, options, list }) => {
    const inputProps = {
      select: (
        <Select size="large" placeholder={`Select ${label.toLowerCase()}`} onChange={(value) => SectionSubject(value)}>
          {options?.map((option) => (
            <Option
              key={option?.id || option}
              value={option?.value || option}
            >
              {option?.name || option}
            </Option>
          ))}
        </Select>
      ),
      date: (
        <DatePicker
          size="large"
          className="w-100"
          placeholder={`Select ${label.toLowerCase()}`}
          disabledDate={disableFutureDates}
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
      <div key={item.name}>
        {renderFormItem(item)}
      </div>
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
          <Form.Item
          hidden={!showRemark}
            name={[...name, "remark"]}
            rules={[{ required: false }]}
            style={{ marginTop: "1rem" }}
          >
            <Input.TextArea rows={3} placeholder="Add your remark here" />
          </Form.Item>
      </div>
    );
  };

  const renderMaintenanceQuestions = () => (
    <>
      <Col md={12}>
        <h2
          className="mb-3 px-3 py-3 rounded-3 text-primary"
          style={{ background: "#f7f7f7" }}
        >
          Maintenance Of Notebooks
        </h2>
      </Col>
      {Questions["maintenanceOfNotebooks"].map((question, index) => (
        <Col md={12} key={`maintenanceOfNotebooks-${index}`}>
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
      <Col md={12}>
        <h2
          className="mb-3 px-3 py-3 rounded-3 text-primary"
          style={{ background: "#f7f7f7" }}
        >
          Quality Of Oppurtunities
        </h2>
      </Col>
      {Questions["qualityOfOppurtunities"].map((question, index) => (
        <Col md={12} key={`qualityOfOppurtunities-${index}`}>
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
      <Col md={12}>
        <h2
          className="mb-3 px-3 py-3 rounded-3 text-primary"
          style={{ background: "#f7f7f7" }}
        >
          Quality Of TeacherFeedback
        </h2>
      </Col>
      {Questions["qualityOfTeacherFeedback"].map((question, index) => (
        <Col md={12} key={`qualityOfTeacherFeedback-${index}`}>
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
      <Col md={12}>
        <h2
          className="mb-3 px-3 py-3 rounded-3 text-primary"
          style={{ background: "#f7f7f7" }}
        >
          Quality Of Learner
        </h2>
      </Col>
      {Questions["qualityOfLearner"].map((question, index) => (
        <Col md={12} key={`qualityOfLearner-${index}`}>
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
    if (data?.payload?.status) {
      message.success(data?.payload?.message);
      navigate(`/notebook-checking-proforma/report/${data?.payload?.form?._id}`)
    } else {
      message.success(data?.payload?.message);
    }
  };

  const [assessmentScore, setAssessmentScore] = useState(0);
  const [outOfScore, setOutOfScore] = useState(0);

  const calculateSelfAssessmentScore = (formValues) => {
    let count = 0; // Initialize score count
    let outOfCount = 0; // Initialize total count

    // Array of keys to iterate over
    const keyObject = [
      'maintenanceOfNotebooks',
      'qualityOfOppurtunities',
      'qualityOfTeacherFeedback',
      'qualityOfLearner',
    ];

    keyObject.forEach((key) => {
      const answers = formValues[key] || []; // Safely get the answers array

      answers.forEach((item) => {
        if (item?.answer) {
          // Increment score and outOfCount based on answer
          const score = item.answer === 'N/A' ? 0 : parseInt(item.answer);
          if (score >= 1 && score <= 3) {
            count += score;
            outOfCount += 3;
          }
        }
      });
    });

    // Update states with the calculated values
    setOutOfScore(outOfCount);
    setAssessmentScore(count);
  };
const getPercentafe =(get, from)=>{
 const numberVal = get / from * 100;
 return numberVal || '0'
}

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
          <Form form={form} layout="vertical" className="w-100" onValuesChange={(changedValues, allValues) => {
            calculateSelfAssessmentScore(allValues); // Trigger the calculation
          }} >
            <Container className="mt-5">
              <Row className="justify-content-start  align-items-start">
                <Col md={6} className="overflow-auto" style={{ height: "80vh" }}>

                  {currStep === 0 && renderGeneralDetails()}
                  {currStep === 1 && (
                    <>
                      {renderMaintenanceQuestions()}
                      {renderQualityOfOppurtunities()}
                      {renderQualityOfTeacherFeedback()}
                      {renderQualityOfLearner()}
                    </>
                  )}

                  {currStep === 2 && (
                    <>

                    </>
                  )}
                </Col>
                <Col md={6}>
                  <Card>
                    <h4>Assement Score: {assessmentScore} Out Of {outOfScore} </h4>
                    <h6>Precentage {getPercentafe(assessmentScore,outOfScore)}%</h6>
                  </Card>
                </Col>

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
