import { Card } from "antd";
import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { useTeacherScores } from "../Utils/ScoreContext";

function DynamicScroreThree({ col, formName,type }) {
  const [totalScore, setTotalScore] = useState(0);
  const [numOfParameters, setNumOfParameters] = useState(0);
  const [percentageScore, setPercentageScore] = useState(0);
  const [getOutOfScore, setGetOutOfScore] = useState(0);
  const [grade, setGrade] = useState("");
 // Use the context
 const { updateScores } = useTeacherScores();

 const validValues = ["1", "2", "3"];
 const calculateSelfAssessmentScore = () => {
   const keyObject = [
     "maintenanceOfNotebooks",
     "qualityOfOppurtunities",
     "qualityOfTeacherFeedback",
     "qualityOfLearner",
   ];

   const formValues = formName;
   let totalScore = 0;
   let outOfScore = 0;
   let numOfParametersNA = 0;

   keyObject.forEach((section) => {
     if (formValues[section]) {
       formValues[section].forEach((item) => {
         const answer = item?.answer;

         if (validValues.includes(answer)) {
           totalScore += parseInt(answer, 10);
           outOfScore += 3;
         }

         if (["N/A", "NA", "N"].includes(answer)) {
           numOfParametersNA++;
         }
       });
     }
   });

   const percentage = outOfScore > 0 ? (totalScore / outOfScore) * 100 : 0;
   const formattedPercentage = parseFloat(percentage.toFixed(2));
   const grade =
     percentage >= 90
       ? "A"
       : percentage >= 80
       ? "B"
       : percentage >= 70
       ? "C"
       : percentage >= 60
       ? "D"
       : "F";

   setTotalScore(totalScore);
   setGetOutOfScore(outOfScore);
   setNumOfParameters(numOfParametersNA);
   setPercentageScore(formattedPercentage);
   setGrade(grade);

   // Update the context state with the formName key, storing form data as an object
   updateScores(type, {
     totalScore,
     outOfScore,
     formattedPercentage,
     grade,
     numOfParametersNA,
   });
 };


  useEffect(() => {
    if (formName) {
      calculateSelfAssessmentScore();
    }
  }, [formName]);

  return (
    <Col md={col} className="mt-4">
      <Card>
        <h5>Total Score: {totalScore}</h5>
        <h5>Out of: {getOutOfScore}</h5>
        <h5>Percentage: {percentageScore}%</h5>
        <h5>Grade: {grade}</h5>
        <h5>Number Of Parameters: {numOfParameters}</h5>
      </Card>
    </Col>
  );
}

export default DynamicScroreThree;
