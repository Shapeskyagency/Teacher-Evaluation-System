import { PlusCircleOutlined } from '@ant-design/icons'
import { Button, Spin, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GetcreatedByUser, GetobserverForms } from '../../redux/Form/noteBookSlice';
import { Formcolumns1, Formcolumns3 } from '../../Components/Data';
import { getUserId } from '../../Utils/auth';
import { UserRole } from '../../config/config';

function Notebook() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, GetForms } = useSelector((state) => state?.notebook);
    const [sortedForms, setSortedForms] = useState([]);
    const Role = getUserId().access
    useEffect(() => {
      if(Role === UserRole[1]){
        dispatch(GetobserverForms())
      }else{
        dispatch(GetcreatedByUser())
      }
    }, [dispatch]);



    useEffect(() => {
      if (Array.isArray(GetForms)) {
        const sortedData = [...GetForms].sort((a, b) => {
          if (a.isObserverComplete === b.isObserverComplete) {
            return 0; // No change in order if both are the same
          }
          return a.isObserverComplete ? 1 : -1; // Place `false` first
        });
        setSortedForms(sortedData);
      }
    }, [GetForms]);

  return (
    <div className="container py-3">
      {isLoading && (
        <div className="LoaderWrapper">
          <Spin size="large" className="position-absolute" />
        </div>
      )}
    <div className='pb-0 pt-0' style={{ padding: "16px" }}>
      {getUserId().access === UserRole[2] && 
      <Button
      onClick={() => navigate("/notebook-checking-proforma/create")}
      type="primary"
      icon={<PlusCircleOutlined />}
      size="large"
      block // Makes the button responsive and full-width on smaller screens
      style={{width:"fit-content" }} // Adds spacing below the button
    >
      Fill New Form
    </Button>}
    </div>

    <Table
          columns={Formcolumns3}
          dataSource={sortedForms}
          bordered
          scroll={{
            x: "max-content", // Makes the table horizontally scrollable for mobile
          }}
          pagination={{
            pageSize: 5, // Limits rows per page for better mobile UX
            responsive: true,
          }}
        />
    </div>
  )
}

export default Notebook