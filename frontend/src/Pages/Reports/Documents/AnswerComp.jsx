import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React, { useEffect, useState } from 'react';
import { getAllTimes } from '../../../Utils/auth';

function AnswerComp({ data, type }) {
  const [totalCount, setTotalCount] = useState(0);
  const [selfAssessCount, setSelfAssessCount] = useState(0);

  useEffect(() => {
    if (!data || !data[type]) return;

    const validValues2 = ["Yes", 0.5];
    const Assesscount = Object.values(data[type]).filter(value =>
        validValues2.includes(value)
      ).length;
      setSelfAssessCount(Assesscount)

    const validValues = ["Yes", "No", 0.5]; // Include these values
    const count = Object.values(data[type]).filter(value =>
      validValues.includes(value)
    ).length;

    setTotalCount(count);
  }, [data, type]);

  const renderField = (fieldName, label) => (
    <View
      style={[
        styles.Question,
        {
          padding: 5,
          paddingBottom: 3,
          paddingTop: 3,
          borderBottomWidth: 1,
        },
      ]}
    >
      <Text style={styles.testCenter}>{data?.[type]?.[fieldName] || "-"}</Text>
    </View>
  );

 

  const fields = [
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
    "coScholasticActivityChart",
    "goodwillPiggyBank",
    "thursdaySpecial",
    "homeworkRegisterAQADRegister",
    "isGroupOnDuty",
    "isWeeklyRotationOfStudents",
    "anecdotalRegister",
    "supplementaryReadingRecord",
    "thinkZone",
    "digitalCitizenshipRules",
    "meditation",
  ];

  return (
    <>

      <View
      style={[
        styles.Question,
        {
          padding: 5,
          paddingBottom: 3,
          paddingTop: 3,
          borderBottomWidth: 1,
        },
      ]}
    >
      <Text style={styles.testCenter}>{data?.className}/{data?.section}</Text>
    </View>
    
      <View
      style={[
        styles.Question,
        {
          padding: 5,
          paddingBottom: 3,
          paddingTop: 3,
          borderBottomWidth: 1,
        },
      ]}
    >
      <Text style={styles.testCenter}>{getAllTimes(data?.date).formattedDate2 || "-"}</Text>
    </View>

      {fields.map((field, index) => (
        <View key={index}>
          {renderField(field)}
        </View>
      ))}

      {/* Total Count */}
      <View
        style={[
          styles.Question,
          {
            padding: 5,
            paddingBottom: 3,
            paddingTop: 3,
            borderBottomWidth: 1,
          },
        ]}
      >
        <Text style={styles.testCenter}>{totalCount+2}</Text>
      </View>
      <View
        style={[
          styles.Question,
          {
            padding: 5,
            paddingBottom: 3,
            paddingTop: 3,
            borderBottomWidth: 0,
          },
        ]}
      >
        <Text style={styles.testCenter}>{selfAssessCount+2}</Text>
      </View>
    </>
  );
}

export default AnswerComp;

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderWidth: 1,
    justifyContent: "flex-start",
  },
  constiner: {
    borderWidth: 1,
    margin: 20,
    padding: 20,
    paddingTop: 0,
    width: "100%",
  },
  section: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 120,
  },
  logoBanners: {
    width: 300,
    height: 80,
  },
  Centered: {
    justifyContent: "center",
    flexDirection: "row",
    // fontFamily: "PT Serif",
    marginBottom: 5,
  },
  Question: {
    // fontFamily: "Gilda Display",
    fontSize: 12,
  },
  testCenter: {
    textAlign: "center",
  },
});
