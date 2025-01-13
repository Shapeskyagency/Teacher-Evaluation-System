import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button,
    Card,
    Form,
    Input,
    message,
    Radio,
    Tag,
  } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import TextArea from "antd/es/input/TextArea";
import { BsEmojiFrown, BsEmojiNeutral, BsEmojiSmile } from 'react-icons/bs';
import { EditNoteBook, GetNoteBookForm } from '../../redux/Form/noteBookSlice';
import { getAllTimes } from '../../Utils/auth';

function OB_Notebook() {
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
    // Set initial form values
    form.setFieldsValue({
      ...data.payload,
      ...data.payload.grenralDetails,
      ...data.payload.NotebooksObserver,
      maintenanceOfNotebooks: data.payload.TeacherForm.maintenanceOfNotebooks,
      qualityOfOppurtunities: data.payload.TeacherForm.qualityOfOppurtunities,
      qualityOfTeacherFeedback: data.payload.TeacherForm.qualityOfTeacherFeedback,
      qualityOfLearner: data.payload.TeacherForm.qualityOfLearner,
      observerFeedback: data.payload.observerFeedback,
    });
  };

  useEffect(() => {
    if (FormId) {
      Fectch();
    }
  }, [dispatch, FormId]);

  const yesNoNAOptions = [
    { value: "0", label: <BsEmojiSmile size={25} /> },
    { value: "1", label: <BsEmojiNeutral size={25} /> },
    { value: "-1", label: <BsEmojiFrown size={25} /> },
  ];

  const generalDetailsConfig = [
    { name: "ClassStrength", label: "Class Strength", type: "input" },
    { name: "NotebooksSubmitted", label: "Notebooks Submitted", type: "input" },
    { name: "Absentees", label: "Absentees", type: "input" },
    { name: "Defaulters", label: "Defaulters", type: "input" },
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

  const renderGeneralDetails2 = () =>
    generalDetailsConfig2?.map((item) => (
      <Row key={item.name}>
        <Col md={12}>
          {renderFormItem(item)}
        </Col>
      </Row>
    ));

  const RenderRadioFormItem = ({ name, label, question, isTextArea }) => {
    const [showRemark, setShowRemark] = useState(false);

    return (
      <>
        <Form.Item
          className='mb-0'
          name={[...name, "answer"]}
          label={<h5 className="text-gray">{label}</h5>}
          rules={[{ required: true, message: "Please select an answer!" }]}
        >
          <Radio.Group
            size='large'
            options={yesNoNAOptions.map((value) => ({
              label: value.label,
              value: value.value,
            }))}
            optionType="button"
            buttonStyle="solid"
          />
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
      </Col>
      {questions?.map((question, index) => (
        <Col md={12} key={`${namePrefix}${index}`}>
          <Card className="mb-3 shadow-sm">
            <RenderRadioFormItem question name={[namePrefix, index]}
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
  return (
    <Container className="mt-3">
      <Row>
        <Col md={6}>
          <Form form={form} layout="vertical">
            <div className="mb-5">
              <h3 className="mb-4">Maintenance Of Notebooks</h3>
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
            <div>
              {renderGeneralDetails2()}
            </div>
            <Button size="large" type="primary" onClick={handleNext}>
              {" "}
              Submit
            </Button>
          </Form>
        </Col>
    
      </Row>
    </Container>
  )
}

export default OB_Notebook;