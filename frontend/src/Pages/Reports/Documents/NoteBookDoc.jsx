import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";
import Logo from "../Imgs/Logo.png";
import LogoBanner from "../Imgs/image.png";
import { getAllTimes } from "../../../Utils/auth";

function NoteBookDoc({ data, teacherScoreData }) {
  const Question = {
    maintenanceOfNotebooks: [
      "I have checked that NBs are in a good physical condition.",
      "I have checked that the work presentation is neat.",
      "I have ensured that the work of the learners is complete.",
      "I have checked the appropriateness of Headings / CW / HW.",
      "There is no scribbling on the last page/any pages thereof.",
      "I have ensured that the child has implemented the previous feedback and done the correction work.",
    ],
    qualityOfOppurtunities: [
      "I have provided HOTs and VBQs with every chapter.",
      "I have made app. remarks about the quality of answers.",
      "I have developed vocab of students (pre-post activities).",
      "I have taken up at least 2 CSPs fortnightly with clear LOs.",
      "The quality questions given by me offer a scope for original thinking by learners.",
      "The writing tasks/questions given by me provide a scope for independent encounters.",
    ],
    qualityOfTeacherFeedback: [
      "I have provided timely and regular feedback.",
      "I have corrected all the notebook work.",
      "I have provided positive reinforcement.",
      "I have provided personalized feedback.",
      "My feedback provides learners directions for improvement.",
      "My feedback facilitates learners with clear directions on what good work looks like.",
    ],
    qualityOfLearner: [
      "I have checked/addressed the common misconceptions.",
      "I have given remarks if the answers are copied or if there are common errors.",
    ],
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Image src={Logo} style={styles.logo} />
            <Image src={LogoBanner} style={styles.logoBanner} />
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.titleText}>SELF ASSESSMENT - NOTEBOOKS</Text>
          </View>

          {/* Section One */}
          <View style={styles.sectionRow}>
            {[
              {
                label: "NAME OF THE OBSERVER",
                value: data?.grenralDetails?.NameofObserver?.name || "N/A",
              },
              {
                label: "CLASS & SECTION",
                value: `${data?.grenralDetails?.className} / ${data?.grenralDetails?.Section}`,
              },
              {
                label: "DATE",
                value: getAllTimes(data?.grenralDetails?.DateOfObservation)
                  .formattedDate2,
              },
            ]?.map((item, index) => (
              <View key={index} style={styles.columnSection}>
                <Text style={styles.cellHeader}>{item.label}</Text>
                <Text style={styles.cellAnswer}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Section two */}
          <View
            style={{ ...styles.titleSection, marginBottom: 8, marginTop: 16 }}
          >
            <Text
              style={{
                ...styles.titleText,
              }}
            >
              OBSERVER NOTEBOOK
            </Text>
          </View>
          <View style={styles.sectionRow}>
            {[
              {
                label: "Absentees",
                value: data?.NotebooksObserver?.Absentees || "N/A",
              },
              {
                label: "Class Strength",
                value: data?.NotebooksObserver?.ClassStrength || "N/A",
              },
              {
                label: "Defaulters",
                value: data?.NotebooksObserver?.Defaulters || "N/A",
              },
              {
                label: "Notebooks Submitted",
                value: data?.NotebooksObserver?.NotebooksSubmitted || "N/A",
              },
            ]?.map((item, index) => (
              <View key={index} style={styles.columnSection}>
                <Text
                  style={{
                    ...styles.cellHeader,
                    fontSize: 8,
                  }}
                >
                  {item.label.toUpperCase()}
                </Text>
                <Text style={styles.cellAnswer}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Observation Sections */}
          {[
            {
              title: "MAINTENANCE OF NOTEBOOKS",
              key: "maintenanceOfNotebooks",
            },
            {
              title: "QUALITY OF OPPORTUNITIES GIVEN TO STUDENTS",
              key: "qualityOfOppurtunities",
            },
            {
              title: "QUALITY OF TEACHER FEEDBACK",
              key: "qualityOfTeacherFeedback",
            },
            {
              title: "QUALITY OF LEARNERS' RESPONSES / PERFORMANCE",
              key: "qualityOfLearner",
            },
          ].map((section, idx) => (
            <View key={idx} style={styles.observationSection}>
              <Text style={styles?.subTitle}>{section?.title}</Text>
              <View style={styles?.observationTable}>
                {Question[section?.key]?.map((item, index) => (
                  <View key={index} style={styles.observationRow}>
                    <Text
                      style={{
                        ...styles.parameter,
                        borderBottomWidth:
                          index === Question[section.key].length - 1 ? 0 : 1,
                        borderRightWidth: 1,
                      }}
                    >
                      {item}
                    </Text>

                    <Text
                      style={{
                        ...styles.remarks,
                        borderBottomWidth:
                          index === Question[section.key].length - 1 ? 0 : 1,
                        borderRightWidth: 1,
                      }}
                    >
                      {data?.ObserverForm?.[section.key]?.[index]?.answer ||
                        "N/A"}
                    </Text>

                    <Text
                      style={{
                        ...styles.remarks,
                        borderBottomWidth:
                          index === Question[section.key].length - 1 ? 0 : 1,
                      }}
                    >
                      {data?.ObserverForm?.[section.key]?.[index]?.remark ||
                        "N/A"}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          <View
            style={{ ...styles.columnSection, width: "100%", marginTop: 8 }}
          >
            <Text style={{ ...styles.parameter, fontWeight: 800 }}>
              OBSERVER FEEDBACK
            </Text>
            <Text
              style={{
                ...styles.cellAnswer,
                textAlign: "start",
                borderWidth: 0,
              }}
            >
              {data?.observerFeedback}
            </Text>
          </View>

          {/* NEWSECTION */}
          <View style={{ ...styles.sectionRow, marginTop: 8 }}>
            {[
              {
                label: "Total Score & Out of",
                value:
                  `${teacherScoreData?.ObserverForm?.totalScore} Out of ${teacherScoreData?.ObserverForm?.outOfScore}` ||
                  "N/A",
              },
              {
                label: "Percentage",
                value:
                  teacherScoreData?.ObserverForm?.formattedPercentage + "%" ||
                  "N/A",
              },
              {
                label: "Grade",
                value: teacherScoreData?.ObserverForm?.grade || "N/A",
              },
              {
                label: "Number Of Parameters",
                value:
                  teacherScoreData?.ObserverForm?.numOfParametersNA || "N/A",
              },
            ]?.map((item, index) => (
              <View key={index} style={styles.columnSection}>
                <Text
                  style={{
                    ...styles.cellHeader,
                    fontSize: 8,
                  }}
                >
                  {item.label.toUpperCase()}
                </Text>
                <Text style={styles.cellAnswer}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.headerSection}>
            <Image src={Logo} style={styles.logo} />
            <Image src={LogoBanner} style={styles.logoBanner} />
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.titleText}>SELF ASSESSMENT - NOTEBOOKS</Text>
          </View>

          {/* Section One */}
          <View style={styles.sectionRow}>
            {[
              {
                label: "NAME OF THE TEACHER",
                value: data?.teacherID?.name || data?.createdBy?.name,
              },
              {
                label: "CLASS & SECTION",
                value: `${data?.grenralDetails?.className} / ${data?.grenralDetails?.Section}`,
              },
              {
                label: "DATE",
                value: getAllTimes(data?.grenralDetails?.DateOfObservation)
                  .formattedDate2,
              },
            ]?.map((item, index) => (
              <View key={index} style={styles.columnSection}>
                <Text style={styles.cellHeader}>{item.label}</Text>
                <Text style={styles.cellAnswer}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Section two */}
          <View
            style={{ ...styles.titleSection, marginBottom: 8, marginTop: 16 }}
          >
            <Text
              style={{
                ...styles.titleText,
              }}
            >
              TEACHER NOTEBOOK
            </Text>
          </View>
          <View style={styles.sectionRow}>
            {[
              {
                label: "Absentees",
                value: data?.NotebooksTeacher?.Absentees || "N/A",
              },
              {
                label: "Class Strength",
                value: data?.NotebooksTeacher?.ClassStrength || "N/A",
              },
              {
                label: "Defaulters",
                value: data?.NotebooksTeacher?.Defaulters || "N/A",
              },
              {
                label: "Notebooks Submitted",
                value: data?.NotebooksTeacher?.NotebooksSubmitted || "N/A",
              },
            ]?.map((item, index) => (
              <View key={index} style={styles.columnSection}>
                <Text
                  style={{
                    ...styles.cellHeader,
                    fontSize: 8,
                  }}
                >
                  {item.label.toUpperCase()}
                </Text>
                <Text style={styles.cellAnswer}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Observation Sections */}
          {[
            {
              title: "MAINTENANCE OF NOTEBOOKS",
              key: "maintenanceOfNotebooks",
            },
            {
              title: "QUALITY OF OPPORTUNITIES GIVEN TO STUDENTS",
              key: "qualityOfOppurtunities",
            },
            {
              title: "QUALITY OF TEACHER FEEDBACK",
              key: "qualityOfTeacherFeedback",
            },
            {
              title: "QUALITY OF LEARNERS' RESPONSES / PERFORMANCE",
              key: "qualityOfLearner",
            },
          ]?.map((section, idx) => (
            <View key={idx} style={styles.observationSection}>
              <Text style={styles?.subTitle}>{section?.title}</Text>
              <View style={styles?.observationTable}>
                {Question[section?.key]?.map((item, index) => (
                  <View key={index} style={styles.observationRow}>
                    <Text
                      style={{
                        ...styles.parameter,
                        borderBottomWidth:
                          index === Question[section.key].length - 1 ? 0 : 1,
                        borderRightWidth: 1,
                      }}
                    >
                      {item}
                    </Text>

                    <Text
                      style={{
                        ...styles.remarks,
                        borderBottomWidth:
                          index === Question[section.key].length - 1 ? 0 : 1,
                        borderRightWidth: 1,
                      }}
                    >
                      {data?.ObserverForm?.[section.key]?.[index]?.answer ||
                        "N/A"}
                    </Text>

                    <Text
                      style={{
                        ...styles.remarks,
                        borderBottomWidth:
                          index === Question[section.key].length - 1 ? 0 : 1,
                      }}
                    >
                      {data?.ObserverForm?.[section.key]?.[index]?.remark ||
                        "N/A"}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          <View
            style={{ ...styles.columnSection, width: "100%", marginTop: 8 }}
          >
            <Text style={{ ...styles.parameter, fontWeight: 800 }}>
              TEACHER FEEDBACK
            </Text>
            <Text
              style={{
                ...styles.cellAnswer,
                textAlign: "start",
                borderWidth: 0,
              }}
            >
              {data?.teacherReflationFeedback}
            </Text>
          </View>

          {/* NEWSECTION */}
          <View style={{ ...styles.sectionRow, marginTop: 8 }}>
            {[
              {
                label: "Total Score & Out of",
                value:
                  `${teacherScoreData?.TeacherForm?.totalScore} Out of ${teacherScoreData?.ObserverForm?.outOfScore}` ||
                  "N/A",
              },
              {
                label: "Percentage",
                value:
                  teacherScoreData?.TeacherForm?.formattedPercentage + "%" ||
                  "N/A",
              },
              {
                label: "Grade",
                value: teacherScoreData?.TeacherForm?.grade || "N/A",
              },
              {
                label: "Number Of Parameters",
                value:
                  teacherScoreData?.TeacherForm?.numOfParametersNA || "N/A",
              },
            ]?.map((item, index) => (
              <View key={index} style={styles.columnSection}>
                <Text
                  style={{
                    ...styles.cellHeader,
                    fontSize: 8,
                  }}
                >
                  {item.label.toUpperCase()}
                </Text>
                <Text style={styles.cellAnswer}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default NoteBookDoc;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
  },
  container: {
    margin: 20,
    padding: 20,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoBanner: {
    width: 300,
    height: 80,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  columnSection: {
    width: "33.33%",
    borderWidth: 1,
    borderColor: "#000",
  },
  cellHeader: {
    padding: 5,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  cellAnswer: {
    padding: 5,
    fontSize: 10,
    textAlign: "center",
  },
  observationSection: {
    marginTop: 20,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
  },
  observationTable: {
    borderWidth: 1,
  },
  observationRow: {
    flexDirection: "row",
    padding: 0,
  },
  parameter: {
    width: "50%",
    fontSize: 10,
    padding: 5,
    borderColor: "#000",
  },
  remarks: {
    width: "25%",
    fontSize: 10,
    padding: 5,
    borderColor: "#000",
    textAlign: "center",
  },
  footerSection: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    fontStyle: "italic",
  },
});
