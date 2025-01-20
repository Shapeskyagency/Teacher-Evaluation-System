import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { GetNoteBookForm, ObserverNotebookComplete } from '../../../redux/Form/noteBookSlice';
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  message,
  Radio,
  Spin,
  Tag,
} from "antd";
import { Col, Container, Row, Table } from "react-bootstrap";
import TextArea from "antd/es/input/TextArea";
import { getAllTimes } from '../../../Utils/auth';
import { BsEmojiFrown, BsEmojiNeutral, BsEmojiSmile } from 'react-icons/bs';
import './css/Walkthrough.css'
function ObserverNotebook() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const FormId = useParams()?.id;

  const { isLoading, formDataList } = useSelector(
    (state) => state?.notebook
  );
  const [form] = Form.useForm();
  const Fectch = async () => {
    const data = await dispatch(GetNoteBookForm(FormId));
    const { isObserverComplete } = data?.payload;
    if (isObserverComplete) {
      navigate(`/notebook-checking-proforma/report/${FormId}`);
    } else {
      message.success("Add your feedback");
    }
  };
  useEffect(() => {
    if (FormId) {
      Fectch();
    }
  }, [dispatch, FormId]);

  const yesNoNAOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "N/A", label: "N/A" },
  ];

  const generalDetailsConfig = [
    { name: "ClassStrength", label: "Class Strength", type: "input" },
    { name: "NotebooksSubmitted", label: "Notebooks Submitted", type: "input" },
    { name: "Absentees", label: "Absentees", type: "input" },
    { name: "Defaulters", label: "Defaulters", type: "input" },
    // { name: "observerFeedback", label: "Observer Feedback", type: "textarea" },
  ];


  const generalDetailsConfig2 = [

    { name: "observerFeedback", label: "Observer Feedback", type: "textarea" },
  ];
  const renderFormItem = ({ name, label, type }) => {

    const inputProps = {
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
        label={<h5 className="text-gray" style={{ fontSize: 20 }}>{label}</h5>}
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
      <Col md={3} key={item.name}>
        {renderFormItem(item)}
      </Col>
    ));

  const renderGeneralDetails2 = () =>
    generalDetailsConfig2.map((item) => (
      <Row>
        <Col md={12} key={item.name}>
          {renderFormItem(item)}
        </Col>
      </Row>
    ));


  const RenderRadioFormItem = ({ name, label, question, isTextArea }) => {
    const [showRemark, setShowRemark] = useState(false);
    return (

      <>
        <Form.Item
          className='mb-0 '
          name={[...name, "answer"]}
          // label={<h6 className="text-gray" style={{ fontSize: 16 }}>{label}</h6>}
          rules={[{ required: true, message: "Please select an answer!" }]}
        >
          <>
            <Radio.Group
            size="middle"
              className="radio-button-box"
              options={yesNoNAOptions.map((value) => ({
                label: value.label,
                value: value.value,
              }))}
              optionType="button"
              buttonStyle="solid"
            />
          </>
        </Form.Item>
        <Button
          className='mt-2'
          type="link"
          onClick={() => setShowRemark(!showRemark)}
          style={{ padding: 0 }}
        >
          {showRemark ? "Hide Remark" : "Add Remark"}
        </Button>
        <Form.Item
          className="hidden"
          hidden
          name={[...name, "question"]}
          initialValue={question}
        >
          <Input />
        </Form.Item>
        {showRemark && (
          <Form.Item
            name={[...name, "remark"]}
            rules={[{ required: false }]}
            style={{ marginTop: "1rem" }}
          >
            <Input.TextArea rows={3} placeholder="Add your remark here" />
          </Form.Item>
        )}
      </>

    );
  }

  const renderSections = (title, questions, namePrefix) => (
    <>


      <Col md={12}>
        <h2
          className="mb-3 px-3 py-3 rounded-3 text-primary"
          style={{ background: "#f7f7f7" }}
        >
          {title}
        </h2>
        <Table className='table-responsive' style={{tableLayout: 'fixed'}} bordered hover>
          <thead>
            <tr >
              <th style={{width: 500}}>Questions</th>
              <th style={{width: 200}}>Options</th>
              <th style={{width: 100}}>Responses</th>
              <th style={{width: 100}}>Remarks</th>
            </tr>
          </thead>
         
    </Table>
      </Col>
      {questions?.map((question, index) => (

        <Col md={12} key={`${namePrefix}${index}`} className=''>
           <Table className='table-responsive shadow-sm rounded overflow-hidden border' style={{tableLayout: 'fixed'}} hover>
           <tbody>
        <tr>
          <td style={{width: 500}}><h6>{question}</h6></td>
          <td style={{width: 200}}> <RenderRadioFormItem question={question} name={[namePrefix, index]}
                label={question}
                isTextArea={true} /></td>
          <td style={{width: 100}}>{formDataList?.TeacherForm?.[namePrefix]?.[index]?.answer ?? "No response available"}</td>
          <td style={{width: 100}}>{formDataList?.TeacherForm?.[namePrefix]?.[index]?.remark ?? "No response available"}</td>
        </tr>
      </tbody>
         
    </Table>
          {/* <div className='Question-Wraaper px-2 mb-5'>
            <div className='Question-andInput py-2'>
              <RenderRadioFormItem question={question} name={[namePrefix, index]}
                label={question}
                isTextArea={true} />
            </div>
            <div className='responseDiv'>
              Response: 
              {formDataList?.TeacherForm?.[namePrefix]?.[index]?.answer ?? "No response available"}
            </div>

          </div> */}
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
    const response = await dispatch(ObserverNotebookComplete(payload));
    if (response?.payload?.message) {
      message.success(response?.payload?.message);
      navigate(`/notebook-checking-proforma/report/${FormId}`);
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
      <Form form={form} layout="vertical">
        <Row>

          <Col md={12}>
            <div className="basicDetailsWrapper mb-4 py-2">
              <h3 className='mt-2 mb-3'>Teacher Response</h3>
              <div className="grid-wrapper flex-md-nowrap flex-wrap">
                <div className="sect1">
                  <p><span className="bold">Name:</span> {formDataList?.grenralDetails?.NameofObserver?.name}</p>
                  <p><span className="bold">Date Of Observation:</span> {getAllTimes(formDataList?.grenralDetails?.DateOfObservation).formattedDate2}</p>
                  {/* <p><span className="bold">Class:</span> {formDataList?.grenralDetails?.className}</p>
                      <p><span className="bold">Section:</span> {formDataList?.grenralDetails?.Section}</p>
                      <p><span className="bold">Subject:</span> {formDataList?.grenralDetails?.Subject}</p> */}
                </div>
                <div className="sect1">
                  <p><span className="bold">Absentees:</span>  {formDataList?.NotebooksTeacher?.Absentees}</p>
                  <p><span className="bold">Class Strength:</span>{formDataList?.NotebooksTeacher?.ClassStrength}</p>
                  <p><span className="bold">Defaulters:</span>{formDataList?.NotebooksTeacher?.Defaulters}</p>
                  <p><span className="bold">Notebooks Submitted:</span>{formDataList?.NotebooksTeacher?.NotebooksSubmitted}</p>
                </div>
              </div>
            </div>
          </Col>
          {renderGeneralDetails()}

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
          {renderSections(
            "Quality Of Learner",
            [
              "I have checked / addressed the common misconceptions",
              "I have given remarks if the answers are copied or if there are common errors.",
            ],

            "qualityOfLearner"
          )}

          {renderGeneralDetails2()}

          <Button size="large" className='px-4' style={{ width: "fit-content" }} type="primary" onClick={handleNext}>
            {" "}
            Submit
          </Button>
        </Row>
      </Form>
    </Container>
  );
}

export default ObserverNotebook