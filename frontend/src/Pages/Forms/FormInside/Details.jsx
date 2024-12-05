import React, { useEffect, useState } from "react";
import {
  Form,
  InputNumber,
  Row,
  Col,
  message,
  Spin,
  Radio,
  Tag,
  Table,
  Descriptions,
  Card,
  Empty,
  Button,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  GetSingleFormComplete,
  GetSingleFormsOne,
} from "../../../redux/Form/fortnightlySlice";
import { getUserId } from "../../../Utils/auth";
import { useDispatch, useSelector } from "react-redux";
import { UserRole } from "../../../config/config";

const Details = () => {
  const [form] = Form.useForm();
  const [formDetails, setFormDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selfAssessmentScore, setSelfAssessmentScore] = useState(0);
  const Id = useParams().id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const GetUserAccess = getUserId()?.access;
  const isLoading2 = useSelector((state) => state?.Forms?.loading);

  // Fetch form details
  useEffect(() => {
    setIsLoading(true);
    dispatch(GetSingleFormsOne(Id))
      .then((response) => {
        setFormDetails(response.payload);
        setIsLoading(false);
        if (
          GetUserAccess === UserRole[1] && response?.payload?.isCoordinatorComplete
        ) {
          message.success("Form is already submitted!");
          navigate(`/fortnightly-monitor/report/${Id}`);
        }else if (GetUserAccess === UserRole[2] && response?.payload?.isTeacherComplete ){
          message.success("Form is already submitted!");
          navigate(`/fortnightly-monitor/report/${Id}`);
        }
      })
      .catch(() => {
        message.error("Error fetching form details.");
        setIsLoading(false);
      });
  }, [Id, navigate]);

  // Enum options
  const yesNoNAOptions = ["Yes", "No", "0.5", "N/A"];

  // Form submission handler
  const onFinish = (values) => {
    let payload;

    if (
      GetUserAccess === UserRole[1] && !formDetails?.isCoordinatorComplete
    ) {
      payload = {
        id: Id,
        data: {
          isCoordinatorComplete: true,
          observerForm: values,
        },
      };
    } else if (
      GetUserAccess === UserRole[2] && !formDetails?.isTeacherComplete
    ) {
      payload = {
        id: Id,
        data: {
          isTeacherComplete: true,
          teacherForm: values,
        },
      };
    } else {
      message.error("You do not have permission to complete this form!");
      return;
    }


    dispatch(GetSingleFormComplete(payload))
      .then((res) => {
        if (res.payload.message) {
          message.success("Form submitted successfully!");
          navigate(`/fortnightly-monitor/report/${Id}`);
        } else {
          message.error(res.payload.message || "Error submitting the form.");
        }
      })
      .catch(() => {
        message.error("There was an error submitting the form.");
      });
  };

  // Calculate self-assessment score
  const calculateScore = () => {
    const values = form.getFieldsValue();
    let score = 0;
  
    questions.forEach((key) => {
      const answer = values[key];
      if (answer === "Yes") score += 1;       // Add 1 for "Yes"
      else if (answer === "No") score += 0;   // No points for "No"
      else if (answer === "0.5") score += 0.5; // Add 0.5 for "0.5"
      // Ignore "N/A" (or any undefined answer)
    });
  
    setSelfAssessmentScore(score);
    form.setFieldsValue({ selfEvaluationScore: score }); // Update hidden field
  };

  // Questions to dynamically render
  const questions = [
    "classCleanliness",
    "newsUpdate",
    "smileyChart",
    "missionEnglishChart",
    "transportCorner",
    "generalDiscipline",
    "lunchEtiquettes",
    "birthdayChart",
    "unitSyllabusChart",
    "uniformTieBeltShoesICard",
    "classPass",
    "classTeacherTimeTable",
    "participationChart",
    "goodwillPiggyBank",
    "thursdaySpecial",
    "homeworkRegisterAQADRegister",
    "anecdotalRegister",
    "supplementaryReadingRecord",
    "thinkZone",
    "digitalCitizenshipRules",
    "meditation",
  ];

  return (
    <div className="container mt-5">
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <>
          <h2 className="text-start mb-4 fs-5">Observation is Started</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={calculateScore} // Trigger score calculation
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={12} lg={12}>
                {questions.map((field, index) => {
                  return (
                    <div className="mb-3 border p-3 rounded shadow-sm" key={field}>
                      <Form.Item
                        className="w-75"
                        name={field}
                        label={
                          <p
                            className="mb-0 fs-5"
                            style={{ color: "rgb(52 52 52 / 64%)" }}
                          >
                            {field
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </p>
                        }
                        rules={[
                          {
                            required: true,
                            message: `Please select an option for ${field}.`,
                          },
                        ]}
                      >
                        <Radio.Group
                          block
                          options={yesNoNAOptions}
                          optionType="button"
                          buttonStyle="solid"
                        />
                      </Form.Item>
                    </div>
                  );
                })}
              </Col>
              <Col xs={24} sm={12} md={12} lg={12}>
                <div className="sticky-top">
                    <Card
                    title={
                      GetUserAccess === UserRole[2] &&
                      formDetails?.isCoordinatorComplete ? (
                        "Observer Completed Form"
                      ) : GetUserAccess == UserRole[1] &&
                        formDetails?.isTeacherComplete ? (
                        " Teacher Completed Form"
                      ) : (
                        <p className="fs-2 text-center" style={{color:"rgb(119 119 119 / 72%)"}}>No One Filled Form Yet!</p>
                      )
                    }
                  >
                    {(GetUserAccess === UserRole[2] &&
                      !formDetails?.isCoordinatorComplete) ||
                    (GetUserAccess === UserRole[1] &&
                      !formDetails?.isTeacherComplete) ? (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    ) : (
                      ""
                    )}
                    {GetUserAccess === UserRole[2] &&
                      formDetails?.isCoordinatorComplete && (
                        <>
                        <Descriptions bordered column={1}>
                          {questions.map((item, index) => {
                            return (
                              <Descriptions.Item
                              key={index}
                                label={item
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              >
                                <Tag color="blue">
                                  {formDetails?.observerForm[item]}
                                </Tag>
                              </Descriptions.Item>
                            );
                          })}
                           <Descriptions.Item
                                label={"Assement Score"}
                              >
                                <Tag color="blue">
                                  
                                </Tag>
                              </Descriptions.Item>

                              
                        </Descriptions>
                        <p className="mt-4">
                      Assessment Score: {formDetails?.observerForm?.selfEvaluationScore}
                    </p>
                    <p>
                      Total Score:{" "}
                      {Object.keys(formDetails?.observerForm || {}).filter(
                        (key) =>
                          key !== "selfEvaluationScore" &&   key !== "ObservationDates"  && formDetails?.observerForm[key] !== "N/A"
                      ).length}
                    </p>
                     </>
                      )}
                    {GetUserAccess === UserRole[1] &&
                      formDetails?.isTeacherComplete && (
                        <Descriptions bordered column={1}>
                          {questions.map((item, index) => {
                            return (
                              <>
                              <Descriptions.Item
                               key={index}
                                label={item
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              >
                                <Tag color="blue">
                                  {formDetails?.teacherForm[item]}
                                </Tag>
                              </Descriptions.Item>
                             
                              </>
                            );
                          })}
                           <Descriptions.Item
                          
                                label={"Assement Score"}
                              >
                                <Tag color="blue">
                                  {formDetails?.teacherForm.selfEvaluationScore}
                                </Tag>
                              </Descriptions.Item>
                        </Descriptions>
                      )}

                  </Card>
                </div>
              </Col>
            </Row>

            {/* Self-assessment score */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={12}>
              <h4 className="mb-3 mt-4">Self Assessment Score: {selfAssessmentScore}</h4>
                <Form.Item name="selfEvaluationScore" hidden label="Self Assessment Score">
                  <InputNumber
                    value={selfAssessmentScore}
                    disabled
                    className="w-100"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Submit button */}
            <Row>
              <Col span={9}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="w-100">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </div>
  );
};

export default Details;
