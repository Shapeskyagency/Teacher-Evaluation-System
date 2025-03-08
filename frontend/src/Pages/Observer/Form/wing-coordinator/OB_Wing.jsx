import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Checkbox, Button, Spin, Card, message } from 'antd';
import Fillter_Wing from './Fillter_Wing';
import { getAllTimes } from '../../../../Utils/auth';
import { createWingForm } from '../../../../redux/userSlice';
import { useNavigate } from "react-router-dom";

function OB_Wing() {
  const { getFilteredDataList, loading} = useSelector((state) => state?.user);
  const [formData,setFormData] = useState()
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState({
    form1: [],
    form2: [],
    form3: [],
    form4: []
  });

  // Handle checkbox selection
  const handleSelect = (checked, item, type) => {
    setSelectedItems((prev) => {
      const updatedTypeArray = checked
        ? [...prev[type], item] // Add item if checked
        : prev[type].filter((i) => i._id !== item._id); // Remove if unchecked

      return { ...prev, [type]: updatedTypeArray };
    });
  };

  const onFinish = async () => {
    let checkdata;
    if(formData){
        const {className,range}=formData;
        const {form1, form2, form3, form4}= selectedItems
        checkdata =  {
          className, range,form1, form2, form3, form4
          }
    }
   
    const res = await dispatch(createWingForm(checkdata)).unwrap()
    if(res?.success){
        message.success(res?.message)
        navigate('/wing-coordinator')
    }else{
        message.error("somthing went wrong!")
    }
  };

  const formTitle = [
    "Fortnightly Monitor",
    "Classroom Walkthrough",
    "Notebook Checking Proforma",
    "Learning Progress Checklist"
  ]
  return (
    <div>
      <Fillter_Wing saveData={setFormData} />
      {loading && 
       <div className="LoaderWrapper">
                       <Spin size="large" className="position-absolute" />
                     </div>}
      {getFilteredDataList && 
      <div className='container'>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {['form1', 'form2', 'form3', 'form4'].map((type,i) => (
          <div key={type}>
            <h3>{formTitle[i]}</h3>
            {getFilteredDataList?.[type]?.length > 0 ? (
              getFilteredDataList[type].map((item) => (
                <div key={item?._id || item?.id} className="d-flex">
                  <Card className='w-full mb-3 flex'>
                  <Checkbox
                      
                    onChange={(e) => handleSelect(e.target.checked, item, type)}
                    checked={selectedItems[type]?.some((i) => i._id === item._id)}
                  />
                 <div>
                 <p className='mb-0'>
                   Class & Section: <b> {item?.className ||item?.grenralDetails?.className }</b>
                   </p>
                   <p className='mb-0'>
                   Date: <b> {getAllTimes(item?.createdAt)?.formattedDate2 }</b>
                   </p>
                   <p className='mb-0'>
                   Teacher : <b>
                     {type === 'form1' ? item?.teacherID?.name || item?.userId?.name :""}
                     {type === 'form2' ? item?.grenralDetails?.NameoftheVisitingTeacher?.name || item?.createdBy?.name:"" }
                     {type === 'form3' ? item?.teacherID?.name || item?.createdBy?.name:"" }
                     </b>
                   </p>
                 </div>
                  
                  </Card>
                </div>
              ))
            ) : (
              <p>No data available</p>
            )}
          </div>
        ))}
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
      </div>
      }
    </div>
  );
}

export default OB_Wing;
