import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Card, Spin, Table, Tag } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { Container, Row, Col } from "react-bootstrap";
import ReactPDF, { PDFViewer } from "@react-pdf/renderer";
import Logo from "./Imgs/Logo.png";
import LogoBanner from "./Imgs/image.png";
import { GetNoteBookForm } from "../../redux/Form/noteBookSlice";
import NoteBookDoc from "./Documents/NoteBookDoc";
import { getAllTimes } from "../../Utils/auth";
import DynamicScroreThree from "../../Components/DynamicScroreThree";
import { useTeacherScores } from "../../Utils/ScoreContext";

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

function NotebookPDF() {
  const { id: Id } = useParams();
  const dispatch = useDispatch();
  const { formDataList, isLoading } = useSelector((state) => state?.notebook);
  // Use the context
  const { scores } = useTeacherScores();
  const downloadPDF = useCallback(async () => {
    const blob = await ReactPDF.pdf(
      <NoteBookDoc data={formDataList}  teacherScoreData={scores} />
    ).toBlob();
    const url = URL.createObjectURL(blob);

    // Trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `notebook-checking-proforma-${Id}.pdf`;
    link.click();

    // Clean up the object URL
    URL.revokeObjectURL(url);
  }, [formDataList, Id]);

  useEffect(() => {
    if (Id) {
      dispatch(GetNoteBookForm(Id));
    }
  }, [Id, dispatch]);

  const keyObject = [
    "Maintenance Of Notebooks",
    "Quality Of Opportunities",
    "Quality Of Teacher Feedback",
    "Quality Of Learner",
  ];



  const getField = (field, type = "ObserverForm") =>
    formDataList?.[type]?.[field];

  return (
    <div className="ms-3 lh-sm py-4 position-relative">
      {isLoading && (
        <div className="LoaderWrapper">
          <Spin size="large" className="position-absolute" />
        </div>
      )}
      <Button type="primary" onClick={downloadPDF}>
        <DownloadOutlined /> Download PDF
      </Button>

      <Container className="justify-center items-start">
      {/* <PDFViewer className="w-full h-[100dvh]">
        <NoteBookDoc data={formDataList} teacherScoreData={scores}/>
        </PDFViewer> */}
        <Row className="justify-content-start align-items-start">
          <Col xs={12} className="text-center mb-2 mt-2">
            <div className="d-flex flex-md-row align-items-center justify-content-center gap-2">
              <img
                src={Logo}
                width={100}
                height={100}
                alt="Logo"
                className="mb-2 mb-md-0"
              />
              <img
                src={LogoBanner}
                width="100%"
                height="auto"
                alt="Banner"
                style={{ maxWidth: "400px" }}
              />
            </div>
          </Col>

          <Col xs={12}>
            <div className="p-4 rounded border mb-4">
              <h5>General Details</h5>
              <div className="d-flex flex-column flex-md-row gap-3 mb-4">
                <p className="m-0">
                  Name Of Observer:{" "}
                  <b>
                    {formDataList?.grenralDetails?.NameofObserver?.name ||
                      formDataList?.createdBy?.name}
                  </b>
                </p>
                <p className="m-0">
                  Name Of Teacher:{" "}
                  <b>
                    {formDataList?.teacherID?.name ||
                      formDataList?.createdBy?.name}
                  </b>
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
              <div className="d-flex flex-column flex-md-row gap-3 mb-4">
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
              <div className="d-flex flex-column flex-md-row gap-3">
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
            <h3>Teacher Response</h3>
          </Col>
          <Col md={6} className="mt-md-0 mt-4">
            <h3>Observer Response</h3>
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
            <Card title="Teacher Reflection Feedback" className="mt-4">
              <p>{formDataList?.teacherReflationFeedback}</p>
            </Card>
          </Col>
          <Col md={6}>
            <Card title="Observer Feedback" className="mt-4">
              <p>{formDataList?.observerFeedback}</p>
            </Card>
          </Col>
          {/* <Col md={6}>
            <Card>
              <h5>Total Score: {totalScore}</h5>
              <h5>Out of: {getOutOfScore}</h5>
              <h5>Percentage: {percentageScore}%</h5>
              <h5>Grade: {grade}</h5>
              <h5>Number Of Parameters: {numOfParameters}</h5>
            </Card>
          </Col> */}
            <DynamicScroreThree
              col={6}
              formName={formDataList?.TeacherForm}
              type="TeacherForm"
              className="md:w-1/2"
            />
            <DynamicScroreThree
              col={6}
                  type="ObserverForm"
              formName={formDataList?.ObserverForm}
              className="w-full md:w-1/2"
            />
        </Row>
      </Container>
    </div>
  );
}

export default NotebookPDF;
