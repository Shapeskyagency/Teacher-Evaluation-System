import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, InputNumber, Row, Col, message, Spin, Flex } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { GetSingleFormComplete, GetSingleFormsOne } from '../../../redux/Form/fortnightlySlice';
import { getUserId } from '../../../Utils/auth';
import { useDispatch, useSelector } from 'react-redux';

const { Option } = Select;

const Details = () => {
  const [form] = Form.useForm();
  const [totalScore, setTotalScore] = useState(0);
  const [formDetails, setFormDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const Id = useParams().id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading2 = useSelector((state) => state?.Forms?.loading);

  // Fetch form details
  useEffect(() => {
    setIsLoading(true);
    dispatch(GetSingleFormsOne(Id))
      .then((response) => {
        setFormDetails(response.payload);
        setIsLoading(false);
        if (response?.payload?.isCoordinatorComplete || response?.payload?.isTeacherComplete) {
          message.success('Form is already submitted!');
          navigate(`/fortnightly-monitor/report/${Id}`);
        }
      })
      .catch(() => {
        message.error('Error fetching form details.');
        setIsLoading(false);
      });
  }, [Id, navigate]);

  // Enum options
  const yesNoNAOptions = ['Yes', 'No', 'N/A'];

  // Form submission handler
  const onFinish = (values) => {
    const userId = getUserId().id;
    const userAccess = getUserId().access;

    let payload;

    if (
      userId === formDetails?.coordinatorID ||
      (userId === formDetails?.userId && userAccess === 'Observer')
    ) {
      payload = {
        id: Id,
        data: {
          isCoordinatorComplete: true,
          observerForm: values,
        },
      };
    } else if (
      userId === formDetails?.teacherID ||
      (userId === formDetails?.userId && userAccess === 'Teacher')
    ) {
      payload = {
        id: Id,
        data: {
          isTeacherComplete: true,
          teacherForm: values,
        },
      };
    } else {
      message.error('You do not have permission to complete this form!');
      return;
    }

    dispatch(GetSingleFormComplete(payload))
      .then((res) => {
        if (res.payload.success) {
          message.success('Form submitted successfully!');
          navigate('/fortnightly-monitor/report');
        } else {
          message.error(res.message || 'Error submitting the form.');
        }
      })
      .catch(() => {
        message.error('There was an error submitting the form.');
      });
  };

  // Total score calculation
  const calculateTotalScore = () => {
    const scores = form.getFieldValue('totalScore') || 0;
    setTotalScore(scores);
  };

  // Validation rule for numeric fields
  const validateNumber = (_, value) => {
    if (value >= 0 && value <= 100) return Promise.resolve();
    return Promise.reject('Score must be between 0 and 100.');
  };

  // Questions to dynamically render
  const questions = [
    'classCleanliness',
    'newsUpdate',
    'smileyChart',
    'missionEnglishChart',
    'transportCorner',
    'generalDiscipline',
    'lunchEtiquettes',
    'birthdayChart',
    'unitSyllabusChart',
    'uniformTieBeltShoesICard',
    'classPass',
    'classTeacherTimeTable',
    'participationChart',
    'goodwillPiggyBank',
    'thursdaySpecial',
    'homeworkRegisterAQADRegister',
    'anecdotalRegister',
    'supplementaryReadingRecord',
    'thinkZone',
    'digitalCitizenshipRules',
    'meditation',
  ];

  return (
    <div className="container mt-5">
        {isLoading ? <Flex align="center" gap="middle"> <Spin size="large" /></Flex>
        
    :

      <>
      <h2 className="text-center mb-4">Observer/Teacher Form</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={calculateTotalScore}
      >
        {/* Dynamic Question Rows */}
        <Row gutter={[16, 16]}>
          {questions.map((field, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                name={field}
                label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                rules={[{ required: true, message: `Please select an option for ${field}.` }]}
              >
                <Select placeholder="Select an option">
                  {yesNoNAOptions.map((option) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          ))}
        </Row>

        {/* Numeric fields */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              name="totalScore"
              label="Total Score"
              rules={[{ validator: validateNumber }]}
            >
              <InputNumber min={0} max={100} className="w-100" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              name="selfEvaluationScore"
              label="Self Evaluation Score"
              rules={[
                {
                  validator: (_, value) =>
                    value >= 0 && value <= 10
                      ? Promise.resolve()
                      : Promise.reject('Score must be between 0 and 10.'),
                },
              ]}
            >
              <InputNumber min={0} max={10} className="w-100" />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit button */}
        <Row>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-100">
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      </>
      }
    </div>
  );
};

export default Details;
