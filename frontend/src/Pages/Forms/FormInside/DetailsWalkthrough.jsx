import React, { useState } from 'react';
import CommonStepper from '../../../Components/CommonStepper';
import { Col, Container, Row } from 'react-bootstrap';
import { DatePicker, Select, Button, Form, message, Input } from 'antd';

const { Option } = Select;

function DetailsWalkthrough() {
  const [currStep, setCurrStep] = useState(0);
  const [formData, setFormData] = useState({}); // To store data across all steps

  const [form] = Form.useForm();

  const steps = [
    { title: 'General Details' },
    { title: 'Walkthrough Deatils' },
    { title: 'Final ' },
  ];

  const handleNext = () => {
    // Validate current step's fields
    form
      .validateFields()
      .then((values) => {
        // Save current step's data to formData
        setFormData({ ...formData, ...values });

        // If not the last step, proceed to the next
        if (currStep < steps.length - 1) {
          setCurrStep(currStep + 1);
          form.resetFields(); // Clear fields for the next step
        } else {
          // If final step, submit the data
          handleSubmit({ ...formData, ...values });
        }
      })
      .catch(() => {
        message.error('Please complete all required fields.');
      });
  };

  const handleBack = () => {
    setCurrStep(currStep - 1);
  };

  const handleSubmit = (finalData) => {
    // Simulate API call with final form data
    console.log('Submitting data:', finalData);
    message.success('Form submitted successfully!');
  };

  const renderStepContent = () => {
    switch (currStep) {
      case 0:
        return (
          <>
            <Col md={4}>
              <Form.Item
                name="teacher"
                label="Name of the Visiting Teacher"
                rules={[{ required: true, message: 'Please select a teacher!' }]}
              >
                <Select placeholder="Select a teacher">
                  <Option value="Teacher A">Teacher A</Option>
                  <Option value="Teacher B">Teacher B</Option>
                  <Option value="Teacher C">Teacher C</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item
                name="date"
                label="Date of Observation"
                rules={[{ required: true, message: 'Please select a date!' }]}
              >
                <DatePicker className="w-100" placeholder="Select date" />
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item
                name="className"
                label="Class Name"
                rules={[{ required: true, message: 'Please select a class!' }]}
              >
                <Select placeholder="Select a class">
                  <Option value="Class 1">Class 1</Option>
                  <Option value="Class 2">Class 2</Option>
                  <Option value="Class 3">Class 3</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item
                name="section"
                label="Section"
                rules={[{ required: true, message: 'Please select a section!' }]}
              >
                <Select placeholder="Select a section">
                  <Option value="A">A</Option>
                  <Option value="B">B</Option>
                  <Option value="C">C</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item
                name="subject"
                label="Subject"
                rules={[{ required: true, message: 'Please select a subject!' }]}
              >
                <Select placeholder="Select a subject">
                  <Option value="Math">Math</Option>
                  <Option value="Science">Science</Option>
                  <Option value="History">History</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item
                name="topic"
                label="Topic"
                rules={[{ required: true, message: 'Please enter a topic!' }]}
              >
                <Input placeholder="Enter topic" />
              </Form.Item>
            </Col>
            <Col md={4}>
              <Form.Item
                name="lessonTakenBy"
                label="Lesson Taken By"
                rules={[{ required: true, message: 'Please select who took the lesson!' }]}
              >
                <Select placeholder="Select person">
                  <Option value="Teacher A">Teacher A</Option>
                  <Option value="Teacher B">Teacher B</Option>
                </Select>
              </Form.Item>
            </Col>
          </>
        );
        case 1:
            return (
                <>
                    <Col md={12}>
                        <Form.Item
                            name={["essentialAggrements", 0, "ans"]}
                            label="Teacher uses gender-neutral vocabulary and her content is sensitive to caste/class/gender in the society"
                            rules={[{ required: true, message: 'Please provide an answer!' }]}
                        >
                            <Select placeholder="Select answer">
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="4">4</Option>
                                <Option value="N/A">N/A</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col md={12}>
                        <Form.Item
                            name={["essentialAggrements", 1, "ans"]}
                            label="Teacher has established the Classroom rules and procedures and both teacher and learners are clear about them"
                            rules={[{ required: true, message: 'Please provide an answer!' }]}
                        >
                            <Select placeholder="Select answer">
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="4">4</Option>
                                <Option value="N/A">N/A</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col md={12}>
                        <Form.Item
                            name={["essentialAggrements", 2, "ans"]}
                            label="Learners speak only when permitted (Learners are on mute; control with teacher)"
                            rules={[{ required: true, message: 'Please provide an answer!' }]}
                        >
                            <Select placeholder="Select answer">
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="4">4</Option>
                                <Option value="N/A">N/A</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col md={12}>
                        <Form.Item
                            name={["essentialAggrements", 3, "ans"]}
                            label="Student misbehavior is addressed promptly by the teacher/s such that class remains focused on learning"
                            rules={[{ required: true, message: 'Please provide an answer!' }]}
                        >
                            <Select placeholder="Select answer">
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="4">4</Option>
                                <Option value="N/A">N/A</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col md={12}>
                        <Form.Item
                            name={["essentialAggrements", 4, "ans"]}
                            label="Teacher manages the support role well - responding to class responses, awarding praise, managing decorum"
                            rules={[{ required: true, message: 'Please provide an answer!' }]}
                        >
                            <Select placeholder="Select answer">
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="4">4</Option>
                                <Option value="N/A">N/A</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </>
            );
      case 2:
        return (
          <>
            <Col md={4}>
              <Form.Item
                name="finalField1"
                label="Final Field 1"
                rules={[{ required: true, message: 'Please fill this field!' }]}
              >
                <Input placeholder="Enter Final Field 1" />
              </Form.Item>
            </Col>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="Container">
      <Row className='flex-column'>
        <Col md={12}>
        <div className="sticky-top bg-white w-100 p-3">
        <CommonStepper  currentStep={currStep} steps={steps} />
      </div>
      </Col >
        <Col md={12}>
        <Form form={form} layout="vertical" className="w-100">
        <Container className="mt-5">
          <Row className="justify-content-center flex-column align-items-center lh-base">
            {renderStepContent()}
            <Col md={4} className="mt-3 d-flex justify-content-between">
              {currStep > 0 && (
                <Button type="default" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button type="primary" onClick={handleNext}>
                {currStep === steps.length - 1 ? 'Submit' : 'Next'}
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
