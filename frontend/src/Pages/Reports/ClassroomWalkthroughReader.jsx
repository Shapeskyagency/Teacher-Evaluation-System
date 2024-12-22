import ReactPDF, { PDFViewer } from '@react-pdf/renderer';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { GetWalkThroughForm } from '../../redux/Form/classroomWalkthroughSlice';
import MyDocument from './Documents/MyDocument';
import WalkthroughDoc from './Documents/WalkthroughDoc';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';

function ClassroomWalkthroughReader() {

    const Id = useParams().id;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {formDataList,loading} = useSelector((state) => state?.walkThroughForm);

  const downloadPDF = async () => {
    const blob = await ReactPDF.pdf(<WalkthroughDoc data={formDataList} />).toBlob();
    const url = URL.createObjectURL(blob);

    // Trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `classroom-walkthrough-${Id}.pdf`;
    link.click();

    // Clean up the object URL
    URL.revokeObjectURL(url);
  };


  useEffect(()=>{

    dispatch(GetWalkThroughForm(Id))
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
        
        <WalkthroughDoc data={formDataList} />
      </PDFViewer>
   </>
  )
}

export default ClassroomWalkthroughReader