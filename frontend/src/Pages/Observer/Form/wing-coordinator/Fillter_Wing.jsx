import { Button, Col, DatePicker, Form, message, Row, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getCreateClassSection, getFilteredData, GetObserverList } from '../../../../redux/userSlice';
const { RangePicker } = DatePicker;

function Fillter_Wing({saveData}) {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [newData,setNewData] = useState([]);
    const fetchClassData = async () => {
        try {
          const res = await dispatch(getCreateClassSection());
          if (res?.payload?.success) {
            setNewData(res?.payload?.classDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
           
        } else {
            message.error('Failed to fetch class data.');
          }
        } catch (error) {
          console.error('Error fetching class data:', error);
          message.error('An error occurred while fetching class data.');
        } 
      };

    useEffect(() => {
        fetchClassData();
         dispatch(GetObserverList());
}, [])



    const onFinish = async (valuess) => {
      const res = await dispatch(getFilteredData(valuess))
      saveData(valuess)
    }
  return (
    <Form
    form={form}
    layout="vertical"
    onFinish={onFinish}
// onValuesChange={calculateScore} // Trigger score calculation
>
    <div className='container'>
        <Row gutter={24} justify={"start"} align={"middle"}>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                <Form.Item
                    className='w-full'
                    label="From To"
                    name="range"
                    rules={[
                        {
                            required: true,
                            message: "Please select date",
                        },
                    ]}
                >

                    <RangePicker className='w-full' />
                </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                <Form.Item
                    label="Class"
                    name="className"
                    rules={[
                        {
                            required: true,
                            message: "Please select class",
                        },
                    ]}
                >
                    <Select placeholder="Choose Class"   options={newData?.map((item) => ({
                        key: item._id, // Ensure unique key
                        id: item._id, 
                        value: item.className,
                        label: item.className,
                      }))}
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      } />
                </Form.Item>
            </Col>
            {/* <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                <Form.Item
                    label="Wing Coordinator's Name"
                    name="coordinatorName"
                    rules={[
                        {
                            required: true,
                            message: "Please select section",
                        },
                    ]}
                >
                    <Select options={ObserverList?.map((item) => ({
                        value: item._id,
                        label: item.name,
                      }))}
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      } placeholder="Choose Section" />
                </Form.Item>
            </Col> */}
            {/* <Col xl={8} lg={8} md={8} sm={24} xs={24}> */}
                <Form.Item className='m-0'>
                    <Button type="primary" htmlType="submit" className="px-4 py-3">
                        Search
                    </Button>
                </Form.Item>
            {/* </Col> */}
        </Row>
    </div>




</Form>
  )
}

export default Fillter_Wing