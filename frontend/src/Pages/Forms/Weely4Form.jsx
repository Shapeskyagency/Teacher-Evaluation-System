import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCreateClassSection, GetObserverList, GetTeacherList, initiateFromObserver, UpdateFromObserver } from '../../redux/userSlice';
import { useParams, useSearchParams } from 'react-router-dom';
import { Form, Select, Button, Input, Radio, message } from 'antd';
import { Col, Container, Row } from 'react-bootstrap';
import { getUserId } from '../../Utils/auth';
import './Weekly4Form.css'; // Import custom CSS for animation
import { UserRole } from '../../config/config';
import TextArea from 'antd/es/input/TextArea';

function Weekly4Form() {
  const [isInitiate, setIsInitiate] = useState(false);
  const [thankYou, setThankYou] = useState(false);
  const dispatch = useDispatch();
  const { GetTeachersLists, GetObserverLists } = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [classList, setClassList] = useState();
  const [ObsereverId, setObsereverId] = useState();
  const FormId = useParams().id

  const GetImportantDetails = async () => {
    const cls = await dispatch(getCreateClassSection());
    if (cls.payload.success) {
      setClassList(cls?.payload?.classDetails);
    }
  }

  useEffect(() => {
    const initiateValue = searchParams.get('Initiate');
    if (UserRole[1] === getUserId().access && initiateValue === 'true') {
      setIsInitiate(true);
    } else {
      GetImportantDetails();
    }
  }, [searchParams]);

  useEffect(() => {
    if (isInitiate) {
      dispatch(GetTeacherList());
    }else{
      dispatch(GetObserverList());
    }
  }, [isInitiate, dispatch]);

  const yesNoNAOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
    { value: "N/A", label: "N/A" },
  ];

  const RenderRadioFormItem = ({ name, label, question, selectBox,inputBox}) => (
    <>
      <h5 className="text-gray">{label}</h5>
      {selectBox &&
        <Form.Item name={[...name, "classId"]} >
          <Select
            allowClear
            showSearch
            placeholder="Select an Class"
            options={classList?.map((item) => ({
              value: item?._id,
              label: `Class ${item?.className}`,
            }))}
          />
        </Form.Item>
      }
      {inputBox ? 
        <Form.Item
        className="mb-0"
        name={[...name, "answer"]}
        // label={}
        rules={[{ required: true, message: "Please select an answer!" }]}
      >
        <TextArea placeholder=''/>
      </Form.Item>
      :
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
      }

    
      <Form.Item className="hidden" hidden name={[...name, "question"]} initialValue={question}>
        <Input />
      </Form.Item>


    </>
  );

  const renderSections = (title, questions, namePrefix) => (
    <>
      <Col md={12}>
        <h2 className="mb-3 px-3 py-3 rounded-3 text-primary" style={{ background: "#f7f7f7" }}>
          {title}
        </h2>
      </Col>
      {questions.map((question, index) => (
        <Col md={12} key={`${namePrefix}${index}`}>
          <div className="mb-3 shadow-sm p-3">
            <RenderRadioFormItem inputBox={index === 3 ? true : false} selectBox={index === 2 ? true : false} name={[namePrefix, index]} label={question} question={question} />
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
        if (res.payload.success) {
          setThankYou(true);
          setTimeout(() => (window.location.href = '/weekly4form'), 3000);
        } else {
          message.error('Something went wrong!');
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
          setThankYou(true);
          setTimeout(() => (window.location.href = '/weekly4form'), 3000);
        } else {
          message.error('Something went wrong!');
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
          window.location.href = '/weekly4form';
        } else {
          message.error('Something went wrong!');
        }
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      message.error('An unexpected error occurred!');
    }
  };
  

  
  return (
    <div>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {isInitiate ? (
          <Container className="w-100 py-5">
            {thankYou ? (
              <Row className="justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Col md={6}>
                  <h1 className="fade-in">Form Successfully Initiated!</h1>
                  <p className="fade-in">Redirecting you...</p>
                </Col>
              </Row>
            ) : (
              <Row className="justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Col md={4}>
                  <Form.Item
                    className="w-100"
                    label="Teacher ID"
                    name="teacherId"
                    rules={[{ required: true, message: 'Please select a Teacher!' }]}
                  >
                    <Select
                    mode='multiple'
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
              {FormId === undefined  && (
                <>
                <h6>Select Observer</h6>
                    <Select
                    className='w-100 mb-4'
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
