import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Card, message, Spin, Table, Tag } from "antd";
import { Container, Row, Col } from "react-bootstrap";
import Logo from "../Reports/Imgs/Logo.png";
import LogoBanner from "../Reports/Imgs/image.png";
import { GetNoteBookForm, updateTeacherReflationFeedback } from "../../redux/Form/noteBookSlice";
import { getAllTimes, getUserId } from "../../Utils/auth";
import { useNavigate } from "react-router-dom";
import { CreateActivityApi } from "../../redux/Activity/activitySlice";

const TableCard = React.memo(({ title, dataSource }) => (
  <Card title={title} className="mt-4">
    <Table
      pagination={false}
      dataSource={dataSource}
      columns={[
        {
          title: "Questions",
          dataIndex: "question",
          key: "question",
          render: (text) => <p className="mb-0">{text}</p>,
        },
        {
          title: "Answer",
          dataIndex: "answer",
          key: "answer",
          render: (text) => (
            <Tag
              color={
                text === "1"
                  ? "yellow"
                  : text === "2"
                  ? "blue"
                  : text === "3"
                  ? "green"
                  : "red"
              }
            >
              {text}
            </Tag>
          ),
        },
        {
          title: "Remarks",
          dataIndex: "remark",
          key: "remark",
          render: (text) => <span>{text}</span>,
        },
      ]}
    />
  </Card>
));

function NotebookComplete() {
  const { id: Id } = useParams();
  const dispatch = useDispatch();
  const { formDataList, isLoading } = useSelector((state) => state.notebook);

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (Id) {
      dispatch(GetNoteBookForm(Id));
    }
  }, [Id, dispatch]);

  useEffect(() => {
    if (formDataList?.teacherReflationFeedback) {
      setInputValue(formDataList.teacherReflationFeedback);
    }
  }, [formDataList]);


const navigate = useNavigate();
const handleSubmit =  () => {
    if (Id && inputValue.trim()) {
      dispatch(updateTeacherReflationFeedback({ id: Id, data: { reflation: inputValue } }))
        .then(async(res)  => {
          if (res?.payload?.success) {
            const userInfo = res?.payload?.form?.grenralDetails
            const activity = {
              observerMessage: `${getUserId()?.name} has completed the Notebook Checking Proforma Reflection Feedback For ${userInfo?.className} | ${userInfo?.Subject} | ${userInfo?.Section}.`,
              teacherMessage: `You have completed the Notebook Checking Proforma Reflection Feedback For ${userInfo?.className} | ${userInfo?.Subject} | ${userInfo?.Section}.`,
              route: `/notebook-checking-proforma/report/${res?.payload?.form?._id}`,
              date: new Date(),
              reciverId: userInfo?.NameofObserver,
              senderId: getUserId()?.id,
              fromNo: 3,
              data: res?.payload?.form
            };
      
            const activitiRecord = await dispatch(CreateActivityApi(activity));
            if (!activitiRecord?.payload?.success) {
              message.error("Error on Activity Record");
            }

            navigate(`/notebook-checking-proforma/report/${Id}`);
          } else {
            console.log("Unexpected response:", res);
          }
        })
        .catch((error) => {
          console.error("Error updating teacher Reflection feedback:", error);
        });
    }
  };
  

  const keyObject = [
    "Maintenance Of Notebooks",
    "Quality Of Opportunities",
    "Quality Of Teacher Feedback",
    "Quality Of Learner",
  ];

  const getField = (field, type = "ObserverForm") =>
    formDataList?.[type]?.[field];

  return (
    <div className="ms-5 lh-sm py-4 position-relative">
      {isLoading && (
        <div className="LoaderWrapper">
          <Spin size="large" className="position-absolute" />
        </div>
      )}
      <Container>
        <Row className="justify-content-start align-items-start">
          <Col md={12}>
            <div className="d-flex gap-4 justify-content-center mb-4">
              <img src={Logo} width={100} height={100} alt="Logo" />
              <img src={LogoBanner} width={400} height={100} alt="Banner" />
            </div>
          </Col>

          <Col md={12}>
            <div className="p-4 rounded border mb-4">
              <h5>General Details</h5>
              <div className="d-flex gap-3 mb-4">
                <p className="m-0">
                  Name Of Observer:{" "}
                  <b>{formDataList?.grenralDetails?.NameofObserver?.name}</b>
                </p>
                <p className="m-0">
                  Grade: <b>{formDataList?.grenralDetails?.className}</b>
                </p>
                <p className="m-0">
                  Section: <b>{formDataList?.grenralDetails?.Section}</b>
                </p>
                <p className="m-0">
                  Subject: <b>{formDataList?.grenralDetails?.Subject}</b>
                </p>
                <p className="m-0">
                  Date Of Observation:{" "}
                  <b>
                    {
                      getAllTimes(
                        formDataList?.grenralDetails?.DateOfObservation
                      ).formattedDate2
                    }
                  </b>
                </p>
              </div>

              <h5>Observer Notebook</h5>
              <div className="d-flex gap-3 mb-4">
                <p className="m-0">
                  Absentees: <b>{formDataList?.NotebooksObserver?.Absentees}</b>
                </p>
                <p className="m-0">
                  Class Strength:{" "}
                  <b>{formDataList?.NotebooksObserver?.ClassStrength}</b>
                </p>
                <p className="m-0">
                  Defaulters:{" "}
                  <b>{formDataList?.NotebooksObserver?.Defaulters}</b>
                </p>
                <p className="m-0">
                  Notebooks Submitted:{" "}
                  <b>{formDataList?.NotebooksObserver?.NotebooksSubmitted}</b>
                </p>
              </div>

              <h5>Teacher Notebook</h5>
              <div className="d-flex gap-3">
                <p className="m-0">
                  Absentees: <b>{formDataList?.NotebooksTeacher?.Absentees}</b>
                </p>
                <p className="m-0">
                  Class Strength:{" "}
                  <b>{formDataList?.NotebooksTeacher?.ClassStrength}</b>
                </p>
                <p className="m-0">
                  Defaulters:{" "}
                  <b>{formDataList?.NotebooksTeacher?.Defaulters}</b>
                </p>
                <p className="m-0">
                  Notebooks Submitted:{" "}
                  <b>{formDataList?.NotebooksTeacher?.NotebooksSubmitted}</b>
                </p>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <h3>Observer Response</h3>
          </Col>
          <Col md={6} className="mt-4">
            <h3>Teacher Response</h3>
          </Col>

          <Col md={6}>
            {keyObject.map((title, index) => (
              <TableCard
                key={index}
                title={title}
                dataSource={getField(
                  Object.keys(formDataList?.ObserverForm || {})[index]
                )}
              />
            ))}
          </Col>

          <Col md={6}>
            {keyObject.map((title, index) => (
              <TableCard
                key={index + 4}
                title={title}
                dataSource={getField(
                  Object.keys(formDataList?.TeacherForm || {})[index],
                  "TeacherForm"
                )}
              />
            ))}
          </Col>

          <Col md={4}>
            <Card title="Observer Feedback" className="mt-4">
              <p>{formDataList?.observerFeedback}</p>
            </Card>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col md={8} className="justify-content-start align-items-start">
            <h5 className="mb-3">Teacher Reflection</h5>
            <textarea
              name="reflation"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your thoughts or Reflection"
              className="form-control w-75"
              rows={5}
              style={{ resize: "none" }}
            ></textarea>
          </Col>
          <Col md={12} className="justify-content-start align-items-start mt-4">
            <Button type="primary" size="large" onClick={handleSubmit}>
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default NotebookComplete;
