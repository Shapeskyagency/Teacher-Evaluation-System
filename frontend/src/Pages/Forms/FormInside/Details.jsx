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
import { getCreateClassSection, GetObserverList } from "../../../redux/userSlice";
import { questions } from "../../../Components/normalData";
import { CreateActivityApi } from "../../../redux/Activity/activitySlice";
const { Option } = Select;
const Details = () => {
  const [form] = Form.useForm();
  const [formDetails, setFormDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [selfAssessmentScore, setSelfAssessmentScore] = useState(0);
  const [ObserverID, setObserverID] = useState("");
  const [sectionState,setSectionState] =useState();
  const Id = useParams().id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const GetUserAccess = getUserId()?.access;
  const isLoading2 = useSelector((state) => state?.Forms?.loading);
  const [betaLoading,setBetaLoading] =useState(false);
  const [appnewData,setAppnewData] =useState(null);
  const [newData,setNewData] =useState(false);
  const CurrectUserRole = getUserId().access;
  const ObserverList = useSelector((state) => state.user.GetObserverLists);
  


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

  // Fetch form details
  useEffect(() => {
    setIsLoading(true);
    fetchClassData()
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
  const [totalCountMein, setTotalCountMein] = useState(0);
  const type= "teacherForm"

  useEffect(() => {
    if (!formDetails || !formDetails[type]) return;

    const validValues2 = ["Yes", 'Sometimes'];
    const Assesscount = Object.values(formDetails[type]).filter(value =>
        validValues2.includes(value)
      ).length;

    const validValues = ["Yes", "No", 'Sometimes']; // Include these values
    const count = Object.values(formDetails[type]).filter(value =>
      validValues.includes(value)
    ).length;

    setTotalCount(count);
  }, [formDetails, type]);

 



  const onFinish = async (values) => {
    if (!Id || !GetUserAccess) {
      message.error("Invalid form submission!");
      return;
    }
  
    let payload = {
      id: Id,
      data: {}
    };
  
    // Assign payload based on user role and form status
    if (GetUserAccess === UserRole[1] && !formDetails?.isCoordinatorComplete) {
      payload.data = {
        isCoordinatorComplete: true,
        observerForm: values,
      };
    } else if (GetUserAccess === UserRole[2] && !formDetails?.isTeacherComplete) {
      payload.data = {
        isTeacherComplete: true,
        teacherForm: values,
      };
  
      if (formDetails.isObserverInitiation) {
        payload.data = {
          ...payload.data,
          className: values?.className,
          date: values?.date,
          Section: values?.section,
        };
      }
    } else {
      message.error("You do not have permission to complete this form!");
      return;
    }
  
    
    setIsLoading(true);
    try {
      // Dispatch form submission
      const res = await dispatch(GetSingleFormComplete(payload));
      
      if (res.payload.message) {
        setIsLoading(false);
        setAppnewData(res?.payload?.form);
        message.success("Form submitted successfully!");
        // Activity object
    const receiverId =  UserRole[2] === getUserId().access ? res?.payload?.form?.coordinatorID?._id || res?.payload?.form?.userId?._id : formDetails?.teacherID?._id || formDetails?.userId?._id;
    const observerMessage = payload?.data?.className
      ? `${res?.payload?.form?.teacherID?.name || res?.payload?.form?.userId?.name} has completed the Fortnightly Monitor Form for ${res?.payload?.form?.className} | ${res?.payload?.form?.section}`
      : UserRole[1] === getUserId().access ? `You have completed the Fortnightly Monitor Form for ${formDetails?.className} | ${formDetails?.section}` :
      `${formDetails?.teacherID?.name || formDetails?.userId?.name } has completed the Fortnightly Monitor Form for ${formDetails?.className} | ${formDetails?.section}`
      ;
  
    const teacherMessage = payload?.data?.className
      ? `You have completed the Fortnightly Monitor Form for ${res?.payload?.form?.className} | ${res?.payload?.form?.section}`
      : UserRole[1] === getUserId().access ? `${formDetails?.coordinatorID?.name || formDetails?.userId?.name} has completed the Fortnightly Monitor Form for ${formDetails?.className} | ${formDetails?.section}`:
      `You have completed the Fortnightly Monitor Form for ${formDetails?.className} | ${formDetails?.section}`
      ;
  
        const activity = {
          observerMessage,
          teacherMessage,
          route: `/fortnightly-monitor/report/${Id}`,
          date: new Date(),
          reciverId: receiverId,
          senderId: getUserId()?.id,
          fromNo: 1,
          data: res.payload,
        };
      
        const activitiRecord = await dispatch(CreateActivityApi(activity));
        if (!activitiRecord?.payload?.success) {
          message.error("Error on Activity Record");
        }
        navigate(`/fortnightly-monitor/report/${Id}`);
      } else {
        throw new Error(res.payload.message || "Error submitting the form.");
      }

    
  
     
    } catch (error) {
      message.error(error.message);
    }
  };
  
  // Calculate self-assessment score
  const calculateScore = () => {
    const values = form.getFieldsValue();
    let score = 0;
  
    questions.forEach((key) => {
      const answer = values[key?.key];
      if (answer === "Yes") score += 1;       // Add 1 for "Yes"
      else if (answer === "No") score += 0;   // No points for "No"
      else if (answer === "Sometimes") score += 0.5; // Add 0.5 for "0.5"
      // Ignore "N/A" (or any undefined answer)
    });
    setSelfAssessmentScore(score);
    getTotalScorevalu(values)
  };


  const getTotalScorevalu = (formValue) =>{
  
    const validValues = ["Yes", "No", 'Sometimes']; // Include these values
    const count = Object.values(formValue).filter(value =>
      validValues.includes(value)
    ).length;
    setTotalCountMein(count)
  }


  const getTotalScore = (type) => {
    if (!formDetails) return 0;

    // Count "Yes", "Sometimes", and "No" as 1
    const validValues = ["Yes", "Sometimes", "No"];
    const scores = Object.values(formDetails[type]).reduce((sum, value) => {
      return sum + (validValues.includes(value) ? 1 : 0); // Add 1 if value matches
    }, 0);

    return scores; // Return total score
  };

  const getSelfAssemnetScrore = (type) => {
    if (!formDetails) return 0;
    const validValues = { Yes: 1, Sometimes: 0.5 };
    const scores = Object.values(formDetails[type]).reduce((sum, value) => {
      return sum + (validValues[value] || 0); // Add score if value matches, otherwise add 0
    }, 0);
    return scores ;
  };
  // Questions to dynamically render

  const disableFutureDates = (current) => {
    // Get the current date without the time part
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to 00:00:00 to compare only the date

    // Disable dates that are in the future
    return current && current.toDate() > today;
  };

  const SideQuestion = document.querySelectorAll("#SideQuestion");
  const heights = Array.from(SideQuestion).map((element) => element.offsetHeight);


  const SectionSubject = (value) => {
    if (value) {
      const filteredData = newData?.filter((data) => data?._id === value);
      if (filteredData?.length > 0) {
        setSectionState(filteredData[0]); // Set the filtered data to sectionState
      }
    }
  
    return []; // Return an empty array if the value is falsy
  };
  

  return (
    <div className="container mt-3">
      {isLoading ? (
        <div className="LoaderWrapper">
                 <Spin size="large" className="position-absolute" />
               </div>
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
                              {/* <Input placeholder="Enter Class (e.g., 10th)" /> */}
                              <Select
                                      showSearch
                                      placeholder="Select a Class"
                                      onChange={(value)=>SectionSubject(value)}
                                      options={newData?.map((item) => ({
                                        key: item._id, // Ensure unique key
                                        id: item._id, 
                                        value: item._id,
                                        label: item.className,
                                      }))}
                                      filterOption={(input, option) =>
                                        option.label.toLowerCase().includes(input.toLowerCase())
                                      }
                                    />
                            </Form.Item>
                
                            <Form.Item
                              label="Section"
                              name="section"
                              rules={[{ required: true, message: "Please enter a section!" }]}
                            >
                              {/* <Input placeholder="Enter Section (e.g., A, B)" /> */}
                              <Select
                                  showSearch
                                  placeholder="Select a Section"
                                  options={sectionState?.sections?.map((item) => ({
                                    key: item._id, // Ensure unique key
                                    id: item._id,
                                    value: item.name,
                                    label: item.name,
                                  }))}
                                  filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                  }
                                />
                
                            </Form.Item>
                

            <div className="d-flex gap-3 align-items-center justify-content-between">
              <Form.Item
                className="w-100"
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please select a date!" }]}
              >
                <DatePicker className="w-100" format="YYYY-MM-DD"  disabledDate={disableFutureDates} />
              </Form.Item>
              {CurrectUserRole === UserRole[2] && (
                <>
                  <Form.Item
                  className="w-100"
                    label="Coordinator ID"
                    name="coordinatorID"
                    rules={[
                      {
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
                {questions?.map((field, index) => {
                  return (
                    <div id="SideQuestion" className="mb-3 border p-3 py-2 rounded shadow-sm " key={field?.key}>
                      <Form.Item
                         className="w-75 mb-2"
                        name={field?.key}
                        label={
                          <p
                            className="mb-0 fs-6"
                            style={{ color: "rgb(52 52 52 / 64%)" }}
                          >
                            {field?.name
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </p>
                        }
                        rules={[
                          {
                            required: true,
                            message: `Please select an option for ${field?.name}.`,
                          },
                        ]}
                      >
                        <Radio.Group
                        size="small"
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
                    {(GetUserAccess === UserRole[2] &&
                      !formDetails?.isCoordinatorComplete) ||
                    (GetUserAccess === UserRole[1] &&
                      !formDetails?.isTeacherComplete) ? (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    ) : (
                      ""
                    )}
                   
                    {GetUserAccess === UserRole[1] &&
                      formDetails?.isTeacherComplete && (
                       <>{questions?.map((item, index) => {
                       
                            return (
                              <>
                              <div  style={{heighteight:heights[index]}} className="mb-3 border  py-2 rounded shadow-sm p-2" key={index+1}>
                              <div style={{marginBottom:"0.6rem"}}>
                              <p
                            className="mb-0 fs-6 "
                            style={{ color: "rgb(52 52 52 / 64%)" }}
                          >
                            {item?.name
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </p>
                          <div className={`alert ${formDetails?.teacherForm[item.key] === "Yes" ? "alert-success": formDetails?.teacherForm[item.key] === "No" ? "alert-danger" : formDetails?.teacherForm[item.key] === "N/A"?"alert-primary":formDetails?.teacherForm[item.key] === "Sometimes"&&"alert-warning"} 
                          py-1  mb-0`}
                          
                          style={{width:"fit-content",fontSize:"16px"}}>
                            <span> {formDetails?.teacherForm[item.key]}</span></div>
                              </div>
                              </div>
                             
                              </>
                            );
                          })}

                        <div  className="mb-3 border p-3 rounded shadow-sm" >
                              <h3
                            className="mb-0 fs-5"
                            style={{ color: "rgb(52 52 52 / 64%)" }}
                          >
                         Self Assesment
                          </h3>
                          <div className={` py-0 mt-3`}
                          
                          style={{width:"fit-content"}}>

                            <span> {getSelfAssemnetScrore('teacherForm') || "NA"} Out of {getTotalScore('teacherForm')}</span></div>
                              </div>
                        </>
                      )}
                      
                </div>
   
             </Col>
            </Row>

            {/* Self-assessment score */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={12}>
              <h4 className="mb-3 mt-4"> {getUserId().access === UserRole[1] ? "Observer Score" : "Self Assessment Score:" } {selfAssessmentScore} Out of {totalCountMein}</h4>
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
