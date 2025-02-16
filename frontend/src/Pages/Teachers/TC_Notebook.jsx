import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button,
    Card,
    Form,
    Input,
    message,
    Radio,
    Select,
    Tag,
  } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import TextArea from "antd/es/input/TextArea";
import { BsEmojiFrown, BsEmojiNeutral, BsEmojiSmile } from 'react-icons/bs';
import { EditNoteBook, GetNoteBookForm } from '../../redux/Form/noteBookSlice';
import { getAllTimes } from '../../Utils/auth';
import { getCreateClassSection } from '../../redux/userSlice';

const {Option} = Select;

function TC_Notebook() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
   const [sectionState, setSectionState]= useState([]);
  const [newData,setNewData] = useState()
  const FormId = useParams()?.id;

  const { isLoading, formDataList } = useSelector(
    (state) => state?.notebook
  );

  const [form] = Form.useForm();
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

  const Fectch = async () => {
    const data = await dispatch(GetNoteBookForm(FormId));
    // Set initial form values
    form.setFieldsValue({
      ...data.payload,
      ...data.payload?.grenralDetails,
      ...data.payload?.NotebooksTeacher,
      maintenanceOfNotebooks: data.payload?.TeacherForm?.maintenanceOfNotebooks,
      qualityOfOppurtunities: data.payload?.TeacherForm?.qualityOfOppurtunities,
      qualityOfTeacherFeedback: data.payload?.TeacherForm?.qualityOfTeacherFeedback,
      qualityOfLearner: data.payload?.TeacherForm?.qualityOfLearner,
      observerFeedback: data.payload?.observerFeedback,
      isTeacherComplete:true
    });
  };

  useEffect(() => {
    if (FormId) {
      fetchClassData();
      Fectch();
    }
  }, [dispatch, FormId]);


  const yesNoNAOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "N/A", label: "N/A" },
  ];

  // const generalDetailsConfig = [
  //   { name: "ClassStrength", label: "Class Strength", type: "input" },
  //   { name: "NotebooksSubmitted", label: "Notebooks Submitted", type: "input" },
  //   { name: "Absentees", label: "Absentees", type: "input" },
  //   { name: "Defaulters", label: "Defaulters", type: "input" },
  // ];

  const SectionSubject = (value) => {
    if (value) {
      const filteredData = newData?.filter((data) => data?._id === value);
      if (filteredData?.length > 0) {
        setSectionState(filteredData[0]); // Set the filtered data to sectionState
      }
    }
  
    return []; // Return an empty array if the value is falsy
  };
  

const generalDetailsConfig = useMemo(
    () => [
      {
        name: "className",
        label: "Class Name / Section",
        type: "select",
        options: newData?.map((item) => ({
          id: item._id,
          name: item.className,
        })),
      },
      { name: "Section", label: "Section", type: "select", 
        options:  sectionState?.sections?.map((item) => ({
          id: item._id,
          value: item?.name,
          name: item.name,
        })),
        
      },
      { name: "Subject", label: "Subject", type: "select", options: sectionState?.subjects?.map((item) => ({
        id: item._id,
        value: item?.name,
        name: item.name,
      })), },
      { name: "Topic", label: "Topic", type: "input" },
      { name: "ClassStrength", label: "Class Strength", type: "input" },
    { name: "NotebooksSubmitted", label: "Notebooks Submitted", type: "input" },
    { name: "Absentees", label: "Absentees", type: "input" },
    { name: "Defaulters", label: "Defaulters", type: "input" },
    ],
    [newData,sectionState]
  );
//   const generalDetailsConfig2 = [
//     { name: "observerFeedback", label: "Observer Feedback", type: "textarea" },
//   ];

  const renderFormItem = ({ name, label, type,options }) => {
    const inputProps = {
      select:(
        <Select
        size="large"
        className="general-details-select"
        placeholder={`Select ${label.toLowerCase()}`}
        onChange={name === "className" ? (value) => SectionSubject(value) : () => {}}
      >
        {options?.map((option) => (
          <Option
            key={option?.id || option}
            value={name === "className" ? option?.id : option?.name}
          >
            {option?.name || option}
          </Option>
        ))}
      </Select>
      ),
      input: (
        <Input size="large" placeholder={`Enter ${label.toLowerCase()}`} />
      ),
      textarea: (
        <TextArea size="large" placeholder={`Enter ${label.toLowerCase()}`} />
      )
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
    generalDetailsConfig?.map((item) => (
      <Row key={item.name}>
        <Col md={12}>
          {renderFormItem(item)}
        
        </Col>
      </Row>
    ));

//   const renderGeneralDetails2 = () =>
//     generalDetailsConfig2?.map((item) => (
//       <Row key={item.name}>
//         <Col md={12}>
//           {renderFormItem(item)}
//         </Col>
//       </Row>
//     ));

  // const RenderRadioFormItem = ({ name, label, question, isTextArea }) => {
  //   const [showRemark, setShowRemark] = useState(false);

  //   return (
  //     <>
  //       <Form.Item
  //         className='mb-0'
  //         name={[...name, "answer"]}
  //         label={<h5 className="text-gray">{label}</h5>}
  //         rules={[{ required: true, message: "Please select an answer!" }]}
  //       >
  //         <Radio.Group
  //           size='large'
  //           options={yesNoNAOptions.map((value) => ({
  //             label: value.label,
  //             value: value.value,
  //           }))}
  //           optionType="button"
  //           buttonStyle="solid"
  //         />
  //       </Form.Item>
  //       <Button
  //         className='mt-2'
  //         type="link"
  //         onClick={() => setShowRemark(!showRemark)}
  //         style={{ padding: 0 }}
  //       >
  //         {showRemark ? "Hide Remark" : "Add Remark"}
  //       </Button>
  //       <Form.Item
  //         className="hidden"
  //         hidden
  //         name={[...name, "question"]}
  //         initialValue={question}
  //       >
  //         <Input />
  //       </Form.Item>
  //       {showRemark && (
  //         <Form.Item
  //           name={[...name, "remark"]}
  //           rules={[{ required: false }]}
  //           style={{ marginTop: "1rem" }}
  //         >
  //           <Input.TextArea rows={3} placeholder="Add your remark here" />
  //         </Form.Item>
  //       )}
  //     </>
  //   );
  // }

    const RenderRadioFormItem = ({ name, question }) => {
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
      {questions?.map((question, index) => (
        <Col md={12} key={`${namePrefix}${index}`}>
          <Card className="mb-3 shadow-sm">
            <RenderRadioFormItem question={question} name={[namePrefix, index]}
              label={question}
              isTextArea={true} />
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
      data,
      id: FormId,
    };

      const response = await dispatch(EditNoteBook(payload));
      if(response?.payload && response?.payload?.success) {
        navigate('/notebook-checking-proforma');
      message.success(response?.payload?.message);
  };
  };

   const [totalScore, setTotalScore] = useState(0);
   const [numOfParameters, setNumOfParameters] = useState(0);
   const [percentageScore, setPercentageScore] = useState(0);
   const [getOutOfScore, setGetOutOfScore] = useState(0);
   const [grade, setGrade] = useState("");
  
    const validValues = ["1", "2", "3"]; 
    const calculateSelfAssessmentScore = () => {
      // // Array of keys to iterate over
      const keyObject = [
        'maintenanceOfNotebooks',
        'qualityOfOppurtunities',
        'qualityOfTeacherFeedback',
        'qualityOfLearner',
      ];
  
      const formValues = form.getFieldsValue();
      let totalScore = 0; // Total points scored
      let outOfScore = 0; // Maximum possible score based on valid answers
      let numOfParametersNA = 0; // Counter for "N/A" answers
    
      keyObject.forEach((section) => {
        if (formValues[section]) {
          formValues[section].forEach((item) => {
            const answer = item?.answer;
    
            // Only consider valid answers for both totalScore and outOfScore
            if (validValues?.includes(answer)) {
              totalScore += parseInt(answer, 10); // Accumulate score
              outOfScore += 4; // Increment max score (4 points per question)
            }
    
            // Count "N/A" answers
            if (["N/A", "NA", "N"].includes(answer)) {
              numOfParametersNA++; // Increment the count for "N/A"
            }
          });
        }
      });
    
      setTotalScore(totalScore); // Set total score
      setGetOutOfScore(outOfScore); // Set maximum possible score
      setNumOfParameters(numOfParametersNA); // Update state with total "N/A" answers
    
      // Calculate percentage
      const percentage = outOfScore > 0 ? (totalScore / outOfScore) * 100 : 0;
      setPercentageScore(parseFloat(percentage.toFixed(2))); // Set percentage
    
      // Determine grade
      const grade =
        percentage >= 90
          ? "A"
          : percentage >= 80
          ? "B"
          : percentage >= 70
          ? "C"
          : percentage >= 60
          ? "D"
          : "F";
      setGrade(grade); // Set grade
    
      // Update form values
      form.setFieldsValue({
        totalScores: totalScore,
        scoreOutof: outOfScore,
        percentageScore: percentage,
        Grade: grade,
        NumberofParametersNotApplicable: numOfParametersNA, // Add the N/A count
      });
    
  
    };
  const getPercentafe =(get, from)=>{
   const numberVal = get / from * 100;
   return numberVal || '0'
  }
  return (
    <Container className="mt-3">
      <Row>
        <Col md={7}>
          <Form form={form} layout="vertical" onValuesChange={(changedValues, allValues) => {
            calculateSelfAssessmentScore(allValues); // Trigger the calculation
          }} >
            <div className='overflow-auto px-3' style={{height:"90vh"}}>
            <div className="mb-5">
              <h3 className="mb-4">Maintenance Of Notebooks</h3>
              <Form.Item
              hidden
          className='mb-0'
          name="isTeacherComplete"
          initialValue={true}
        >
          <Radio.Group
          
            size='large'
            options={[true, false].map((value) => ({
              label: value,
              value: value,
            }))}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>

              {renderGeneralDetails()}
            </div>
            <div className="mb-5 pb-3">
              {renderSections(
                "Maintenance Of Notebooks",
                [
                  "I have checked that NBs are in a good physical condition.",
                  "I have checked that the work presentation is neat.",
                  "I have ensured that the work of the learners is complete.",
                  "I have checked the appropriateness of Headings / CW / HW.",
                  "There is no scribbling on the last page/any pages thereof.",
                  "I have ensured that the child has implemented the previous feedback and done the correction work.",
                ],
                "maintenanceOfNotebooks"
              )}
            </div>
            <div className="mb-5 pb-3">
              {renderSections(
                "Quality Of Oppurtunities",
                [
                  "I have provided HOTs and VBQs with every chapter.",
                  "I have made app. remarks about the quality of answers.",
                  "I have developed vocab of students (pre-post activities).",
                  "I have taken up at least 2 CSPs fortnightly with clear LOs.",
                  "The quality questions given by me offer a scope for original thinking by learners.",
                  "The writing tasks / questions given by me provide a scope for independent encounters.",
                ],
                "qualityOfOppurtunities"
              )}
            </div>
            <div className="mb-5 pb-3">
              {renderSections(
                "Quality Of Teacher Feedback",
                [
                  "I have provided timely and regular feedback.",
                  "I have corrected all the notebook work.",
                  "I have provided positive reinforcement.",
                  "I have provided personalized feedback.",
                  "My feedback provides learners directions for improvement.",
                  "My feedback facilitates learners with clear directions on what good work looks like.",
                ],
                "qualityOfTeacherFeedback"
              )}
            </div>
            <div className="mb-5 pb-3">
              {renderSections(
                "Quality Of Learner",
                [
                  "I have checked / addressed the common misconceptions",
                  "I have given remarks if the answers are copied or if there are common errors.",
                ],
                "qualityOfLearner"
              )}
            </div>
            </div>
            {/* <div>
              {renderGeneralDetails2()}
            </div> */}
            <Button size="large" type="primary" onClick={handleNext}>
              {" "}
              Submit
            </Button>
          </Form>
        </Col>
        <Col md={5}>
        <h5>Total Score: {totalScore}</h5>
          <h5>Out of: {getOutOfScore}</h5>
          <h5>Percentage: {percentageScore}%</h5>
          <h5>Grade: {grade}</h5>
          <h5>Number Of Parameters: {numOfParameters}</h5>
        </Col>
    
      </Row>
    </Container>
  )
}

export default TC_Notebook;