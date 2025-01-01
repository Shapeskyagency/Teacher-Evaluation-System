import ReactPDF, { PDFViewer, StyleSheet } from '@react-pdf/renderer';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GetWalkThroughForm } from '../../redux/Form/classroomWalkthroughSlice';
import WalkthroughDoc from './Documents/WalkthroughDoc';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import NoteBookDoc from './Documents/NoteBookDoc';
import { GetNoteBookForm } from '../../redux/Form/noteBookSlice';

function NotebookPDF() {
  const Id = useParams().id;
  const dispatch = useDispatch();
  const {formDataList,isLoading}  = useSelector((state) => state.notebook);
  const downloadPDF = async () => {
    const blob = await ReactPDF.pdf(<NoteBookDoc data={formDataList} />).toBlob();
    const url = URL.createObjectURL(blob);

    // Trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `notebook-checking-proforma-${Id}.pdf`;
    link.click();

    // Clean up the object URL
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (Id) {
      dispatch(GetNoteBookForm(Id));
    }
  }, [Id, dispatch]);

  return (
    <>
      <div className="ms-5 lh-sm py-4 position-relative">
        {isLoading && (
          <div className="LoaderWrapper">
            <Spin size="large" className="position-absolute" />
          </div>
        )}
        <Button type="primary" onClick={downloadPDF}>
          <DownloadOutlined /> Download PDF
        </Button>
      </div>
      <PDFViewer className="w-100 m-auto d-block" style={{ height: '100vh' }}>
        <NoteBookDoc data={formDataList} />
      </PDFViewer>
    </>
  );
}

export default NotebookPDF;



