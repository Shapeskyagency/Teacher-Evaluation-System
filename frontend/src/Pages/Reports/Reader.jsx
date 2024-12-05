import React, { useEffect } from "react";
import ReactPDF, { PDFViewer } from "@react-pdf/renderer";
import MyDocument from "./Documents/MyDocument";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { GetSingleFormsOne } from "../../redux/Form/fortnightlySlice";
import { Button, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

function Reader() {

    const Id = useParams().id;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {GetSingleForms,loading} = useSelector((state) => state?.Forms);
    // console.log(GetSingleForms)

  const downloadPDF = async () => {
    const blob = await ReactPDF.pdf(<MyDocument data={GetSingleForms} />).toBlob();
    const url = URL.createObjectURL(blob);

    // Trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `Report-Fortnightly-Monitor-${Id}.pdf`;
    link.click();

    // Clean up the object URL
    URL.revokeObjectURL(url);
  };


  useEffect(()=>{

    dispatch(GetSingleFormsOne(Id))
  },[])



  return (
    <>
     <div className="ms-5 lh-sm py-4 position-relative">
     {loading && (
        <div className="LoaderWrapper">
          <Spin size="large" className="position-absolute" />
        </div>
      )}
     {/* <h2>Fortnightly Monitor Report</h2> */}
     <Button type="primary"  onClick={downloadPDF}><DownloadOutlined/> Download PDF</Button>
     </div>
      <PDFViewer className="w-100 m-auto d-block" style={{ height: "100vh" }}>
        
        <MyDocument data={GetSingleForms} />
      </PDFViewer>
    </>
  );
}

export default Reader;
