import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import Logo from "../Imgs/Logo.png";
import LogoBanner from "../Imgs/image.png";
import { getAllTimes } from "../../../Utils/auth";
Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});

function WalkthroughDoc({ data }) {
  const RenderData = ({ keyName, keylenght }) => {
    return (
      <>
        {data?.[keyName]?.map((item, key) => (
          <View key={item?._id} style={{ flexDirection: "row" }}>
            <View
              key={key}
              style={{
                borderRightWidth: 1,
                borderBottom: key + keylenght ===12 ?0:1,
                padding: 5,
                width: "10%",
              }}
            >
              <Text style={styles.Question}>{key + keylenght}</Text>
            </View>
            <View
              key={key}
              style={{
                borderRightWidth: 1,
                padding: 6,
                borderBottom: key + keylenght ===12 ?0:1,
                width: "70%",
              }}
            >
              <Text style={styles.Question}>{item?.question}</Text>
            </View>
            <View
              style={{
                borderRightWidth: 0,
                padding: 5,
                borderBottom: key + keylenght ===12 ?0:1,
                width: "20%",
              }}
            >
              <Text style={[styles.Question,{fontFamily: "Open Sans" , fontWeight:"800"}]}> {item?.answer}</Text>
            </View>
          </View>
        ))}
      </>
    );
  };

  const RenderFeedbackQuestion =({keyName}) =>{
    return(
        <View style={{flexDirection:"row", flexWrap:"wrap",borderTop:1, borderBottom:0}}>
            {data?.[keyName]?.map((item,key)=>(
                <>
                <View
                style={{
                  borderRightWidth: 1,
                  borderBottom:key +1 ===2 ?0:1,
                  padding: 5,
                  width: "20%",
                  minHeight:150
                }}
              >
                <Text style={[styles.Question, styles.boldAns]}>
                  {key+1}
                </Text>
              </View>
              <View
                style={{
                    borderBottom:key +1 === 2 ?0:1,
                  padding: 5,
                  width: "80%",
                }}
              >
                <Text style={[styles.Question]}>{item?.question}</Text>
                <Text style={[styles.Question,{fontFamily: "Open Sans" , fontWeight:"800",marginTop:8,fontSize:10}]}>{item?.answer}</Text>
              </View>
                </>
            ))}
         
        </View>
    )
}
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.constiner}>
          <View style={styles.section}>
            <Image src={Logo} style={styles.logo} />
            <Image src={LogoBanner} style={styles.logoBanners} />
          </View>
          <View style={[styles.Centered]}>
            <Text style={{ fontSize: 15, marginBottom: 8 }}>
              VIRTUAL CLASSROOM WALK-THROUGH PROFORMA 2023-24 (V2.0)
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              padding: 8,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            {[
              {
                question: "Name of the Visiting Teacher",
                ans: data?.grenralDetails?.NameoftheVisitingTeacher?.name,
              },
              {
                question: "Date",
                ans: getAllTimes(data?.grenralDetails?.DateOfObservation)
                  .formattedDate2,
              },
              { question: "Class", ans: data?.grenralDetails?.className },
              { question: "Subject", ans: data?.grenralDetails?.Subject },
              { question: "Section", ans: data?.grenralDetails?.Section },
              { question: "Topic", ans: data?.grenralDetails?.Topic },
            ].map((item) => (
              <View style={{ width: "50%", marginBottom: 8 }}>
                <Text style={[styles.basictext, styles.Question]}>
                  {item?.question}: <Text style={[styles.Question,{fontFamily: "Open Sans" , fontWeight:"800"}]}>{item?.ans}</Text>
                </Text>
              </View>
            ))}
          </View>

          {/* Question */}
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            <View style={{ borderRightWidth: 1, padding: 5, width: "10%" }}>
              <Text style={styles.Question}>Sr. No</Text>
            </View>
            <View style={{ borderRightWidth: 1, padding: 5, width: "70%" }}>
              <Text style={styles.Question}>ITEM</Text>
            </View>
            <View style={{ borderRightWidth: 0, padding: 5, width: "20%" }}>
              <Text style={styles.Question}>REMARKS</Text>
            </View>

            {/* Question Ans */}
            <View
              style={{
                borderBottom: 1,
                borderTop: 1,
                width: "100%",
                padding: 5,
              }}
            >
              <Text style={[styles.Question, { textAlign: "center" }]}>
                ESSENTIAL AGREEMENTS
              </Text>
            </View>
            <RenderData keyName="essentialAggrements" keylenght={1} />

            <View style={{ borderBottom: 1, width: "100%", padding: 5 }}>
              <Text style={[styles.Question, { textAlign: "center" }]}>
                PLANNING AND PREPARATION
              </Text>
            </View>

            <RenderData keyName="planingAndPreparation" keylenght={6} />
          </View>
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={[styles.constiner, { paddingTop: 20 }]}>
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              borderBottom: 0,
              flexWrap: "wrap",
            }}
          >
            <View style={{ borderBottom: 1, width: "100%", padding: 5 }}>
              <Text style={[styles.Question, { textAlign: "center" }]}>
                CLASSROOM ENVIRONMENT
              </Text>
            </View>
            <RenderData keyName="classRoomEnvironment" keylenght={13} />

            <View style={{ borderBottom: 1, width: "100%", padding: 5 }}>
              <Text style={[styles.Question, { textAlign: "center" }]}>
                INSTRUCTION
              </Text>
            </View>
            <RenderData keyName="instruction" keylenght={18} />

            <View style={{ flexDirection: "row", flexWrap: "wrap",borderBottom:1 }}>
              <View
                style={{
                  borderRightWidth: 1,
                  borderBottom: 1,
                  padding: 5,
                  width: "50%",
                }}
              >
                <Text style={[styles.Question, styles.boldAns]}>
                  Total Score
                </Text>
              </View>
              <View
                style={{
                  padding: 6,
                  borderBottom: 1,
                  width: "50%",
                }}
              >
                <Text style={[styles.Question, styles.boldAns]}>{data?.totalScores}</Text>
              </View>
              <View
                style={{
                  borderRightWidth: 1,
                  borderBottom: 1,
                  padding: 5,
                  width: "50%",
                }}
              >
                <Text style={[styles.Question, styles.boldAns]}>
                  Score Out of
                </Text>
              </View>
              <View
                style={{
                  padding: 5,
                  borderBottom: 1,
                  width: "50%",
                }}
              >
                <Text style={[styles.Question, styles.boldAns]}>{data?.scoreOutof}</Text>
              </View>
              <View
                style={{
                  borderRightWidth: 1,
                  borderBottom: 1,
                  padding: 5,
                  width: "50%",
                }}
              >
                <Text style={[styles.Question, styles.boldAns]}>
                  Percentage Score
                </Text>
              </View>
              <View
                style={{
                  padding: 5,
                  borderBottom: 1,
                  width: "50%",
                }}
              >
                <Text style={[styles.Question, styles.boldAns]}>{data?.percentageScore}</Text>
              </View>
              <View
                style={{
                  borderRightWidth: 1,
                  borderBottom: 1,
                  padding: 5,
                  width: "50%",
                }}
              >
                <Text style={[styles.Question, styles.boldAns]}>Grade</Text>
              </View>
              <View
                style={{
                  borderRightWidth: 1,
                  padding: 5,
                  borderBottom: 1,
                  width: "50%",
                }}
              >
                <Text style={[styles.Question, styles.boldAns]}>{data?.Grade}</Text>
              </View>

              <View
                style={{
                  borderRightWidth: 1,
                  padding: 5,
                  width: "50%",
                }}
              >
                <Text style={[styles.Question, styles.boldAns]}>
                  Number of Parameters Not Applicable
                </Text>
              </View>
              <View
                style={{
                  padding: 5,
                  width: "50%",
                }}
              >
                <Text style={[styles.Question, styles.boldAns]}>{data?.NumberofParametersNotApplicable}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={[styles.constiner, { paddingTop: 20 }]}>
          <View
            style={{
              flexDirection: "row",
              borderWidth: 1,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            <View
              style={{
                width: "100%",
                padding: 4,
              }}
            >
              <Text style={[styles.Question, { textAlign: "center",padding: 5 }]}>
              ACADEMIC HEAD / COORDINATOR'S / HOD'S FEEDBACK
              </Text>
            </View>
            <RenderFeedbackQuestion keyName="ObserverFeedback"/>


            <View
              style={{
                width: "100%",
                padding: 4,
                borderTop:1
              }}
            >
              <Text style={[styles.Question, { textAlign: "center",padding: 5 }]}>
              TEACHER'S REFLECTION
              </Text>
            </View>


            <RenderFeedbackQuestion keyName="TeacherFeedback"/>



           
          </View>

          <View style={{flexDirection:"row",gap:0}}>
                <Text style={{fontSize:12}}>Principal's Signature </Text>
                <View style={{width:100,borderBottom:1}}></View>
            </View>
        </View>
      </Page>
    </Document>
  );
}

export default WalkthroughDoc;



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
  boldAns: { fontWeight: "600", fontFamily: "Open Sans" },

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
