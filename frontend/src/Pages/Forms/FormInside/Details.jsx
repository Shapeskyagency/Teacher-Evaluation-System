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
  Select,
  DatePicker,
  Input,
  Alert,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  GetSingleFormComplete,
  GetSingleFormsOne,
} from "../../../redux/Form/fortnightlySlice";
import { getUserId } from "../../../Utils/auth";
import { useDispatch, useSelector } from "react-redux";
import { UserRole } from "../../../config/config";
import { GetObserverList } from "../../../redux/userSlice";
const { Option } = Select;
const Details = () => {
  const [form] = Form.useForm();
  const [formDetails, setFormDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [selfAssessmentScore, setSelfAssessmentScore] = useState(0);
  const [ObserverID, setObserverID] = useState("");
  const Id = useParams().id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const GetUserAccess = getUserId()?.access;
  const isLoading2 = useSelector((state) => state?.Forms?.loading);
  const [betaLoading,setBetaLoading] =useState(false);
  const CurrectUserRole = getUserId().access;
  const ObserverList = useSelector((state) => state.user.GetObserverLists);
  
  // Fetch form details
  useEffect(() => {
    setIsLoading(true);
 
    dispatch(GetSingleFormsOne(Id))
      .then((response) => {
        setFormDetails(response?.payload);
        setIsLoading(false);
      const {className,date,section} = response.payload
      if(!className || !date || !section){
        dispatch(GetObserverList());
        setBetaLoading(!className || !date || !section)
        message.success("Fill All the data!");
      }
      else if (
        response?.payload?.isCoordinatorComplete && response?.payload?.isTeacherComplete
      ){
        message.success("Form is already submitted!");
        navigate(`/fortnightly-monitor/report/${Id}`);
      }
        else if (
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
  }, [Id, navigate,!ObserverID]);





  // Enum options
  const yesNoNAOptions = ["Yes", "No", "Sometimes", "N/A"];

  const [totalCount, setTotalCount] = useState(0);
  const type= "teacherForm"

  useEffect(() => {
    if (!formDetails || !formDetails[type]) return;

    const validValues2 = ["Yes", 'Sometimes'];
    const Assesscount = Object.values(formDetails[type]).filter(value =>
        validValues2.includes(value)
      ).length;
      // setSelfAssessCount(Assesscount)

    const validValues = ["Yes", "No", 'Sometimes']; // Include these values
    const count = Object.values(formDetails[type]).filter(value =>
      validValues.includes(value)
    ).length;

    setTotalCount(count);
  }, [formDetails, type]);



  // Form submission handler
  const onFinish = (values) => {
    console.log(values)
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
    } else if(GetUserAccess === UserRole[2] && !formDetails?.isTeacherComplete && formDetails.isObserverInitiation){
      
      payload = {
        id: Id,
        data: {
          isTeacherComplete: true,
          teacherForm: values,
          className:values?.className,
          date:values?.date,
          Section:values?.section,
        }
      }

    } else if (
      GetUserAccess === UserRole[2] && !formDetails?.isTeacherComplete
    ) {
      payload = {
        id: Id,
        data: {
          isTeacherComplete: true,
          teacherForm: values
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
      else if (answer === "Sometimes") score += 0.5; // Add 0.5 for "0.5"
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
          <div className="d-flex justify-content-around">
          <h2 className="text-start mb-4 fs-5">Observation is Started</h2>
          <h2 className="text-start mb-4 fs-5">Teacher Response</h2>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={calculateScore} // Trigger score calculation
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={12} lg={12}>
              {betaLoading && (
                <>
                 <Form.Item
              label="Class"
              name="className"
              rules={[{ required: true, message: "Please enter a class!" }]}
            >
              <Input placeholder="Enter Class (e.g., 10th)" />
            </Form.Item>

            <Form.Item
              label="Section"
              name="section"
              rules={[{ required: true, message: "Please enter a section!" }]}
            >
              <Input placeholder="Enter Section (e.g., A, B)" />
            </Form.Item>

            <div className="d-flex gap-3 align-items-center justify-content-between">
              <Form.Item
                className="w-100"
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please select a date!" }]}
              >
                <DatePicker className="w-100" format="YYYY-MM-DD" />
              </Form.Item>
              {CurrectUserRole === UserRole[2] && (
                <>
                  <Form.Item
                  className="w-100"
                    label="Coordinator ID"
                    name="coordinatorID"
                    // initialValue={ObserverID?.name}
                    rules={[
                      {
                        // required: true,
                        message: "Please select a Coordinator!",
                      },
                    ]}
                  >
                    <Select
                    defaultValue={formDetails?.userId?.name}
                    disabled={betaLoading}
                      showSearch
                      placeholder="Select a Coordinator"
                      options={ObserverList?.map((item) => ({
                        value: item._id,
                        label: item.name,
                      }))}
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                  <Form.Item
                  hidden
                    className="w-100"
                    label="Coordinator"
                    name="isCoordinator"
                  >
                    <Select
                      onChange={(value) => {
                        setIsCoordinator(true);
                        form.resetFields(["teacherID"]); // Reset teacher-related fields
                      }}
                    >
                      <Option value={false}>No</Option>
                      <Option value={true}>Yes</Option>
                    </Select>
                  </Form.Item>
                </>
              )}

             
            </div>
                </>
              )}
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
                    {/* <Card
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
                  > */}
                    {(GetUserAccess === UserRole[2] &&
                      !formDetails?.isCoordinatorComplete) ||
                    (GetUserAccess === UserRole[1] &&
                      !formDetails?.isTeacherComplete) ? (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    ) : (
                      ""
                    )}
                    {/* {GetUserAccess === UserRole[2] &&
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
                                <Tag color={formDetails?.observerForm[item] === "Yes" ? "blue":"volcano"}>
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
                      )} */}
                    {GetUserAccess === UserRole[1] &&
                      formDetails?.isTeacherComplete && (
                       <>{   questions?.map((item, index) => {
                            return (
                              <>
                              <Card  className="mb-3 p-0" key={index+1}>
                              <h3
                            className="mb-0 fs-5"
                            style={{ color: "rgb(52 52 52 / 64%)" }}
                          >
                            {item
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </h3>
                          <div className={`alert ${formDetails?.teacherForm[item] === "Yes" ? "alert-success": formDetails?.teacherForm[item] === "No" ? "alert-danger" : formDetails?.teacherForm[item] === "N/A"?"alert-primary":formDetails?.teacherForm[item] === "0.5"&&"alert-warning"} py-0 mt-3`}
                          
                          style={{width:"fit-content"}}>

                            <span> {formDetails?.teacherForm[item]}</span></div>
                              </Card>
                             
                             
                              </>
                            );
                          })}

                            <Card  className="mb-3 p-0" >
                              <h3
                            className="mb-0 fs-5"
                            style={{ color: "rgb(52 52 52 / 64%)" }}
                          >
                         Self Assesment
                          </h3>
                          <div className={` py-0 mt-3`}
                          
                          style={{width:"fit-content"}}>

                            <span> {formDetails?.teacherForm?.selfEvaluationScore} Out of {totalCount}</span></div>
                              </Card>
                        </>
                      )}
                      
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
