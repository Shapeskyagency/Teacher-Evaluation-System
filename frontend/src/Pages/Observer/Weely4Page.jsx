import { PlusCircleFilled, PlusCircleOutlined } from '@ant-design/icons'
import { Button, Table, Tag } from 'antd'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserRole } from '../../config/config'
import { getAllTimes, getUserId } from '../../Utils/auth'
import { useDispatch, useSelector } from 'react-redux'
import { getAllWeeklyFrom } from '../../redux/userSlice'

function Weely4Page() {
  const dispatch = useDispatch();
  const { getAllWeeklyFroms, loading } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(getAllWeeklyFrom());
  }, [])

  const ReverseData = () => {
    if (Array.isArray(getAllWeeklyFroms)) {
      const reversedData = [...getAllWeeklyFroms].reverse(); // Safely reverse if it's an array
      console.log(reversedData);
      return reversedData;
    } else {
      console.error("getAllWeeklyFroms is not an array:", getAllWeeklyFroms);
      return []; // Return an empty array as a fallback
    }
  };


  return (
    <div>
      
    
      <div className="container py-4">
      {UserRole[1] === getUserId()?.access &&
        <Link to="/weekly4form/create?Initiate=true">
          <Button  className='mb-4' variant='solid' color='primary' size='large'> <PlusCircleOutlined />Form Initiation</Button>
          </Link>
      }
      {UserRole[2] === getUserId()?.access &&
        <Link to="/weekly4form/create">
          <Button className='mb-4' variant='solid' color='primary' size='large'> <PlusCircleOutlined /> New Form</Button></Link>
          }
        {/* <h4 className='mt-3'>Weekly Filled Forms</h4> */}
        <Table
          columns={[
            {
              title: UserRole[1] === getUserId().access ? "Teacher" : "Observer",
              dataIndex: UserRole[1] === getUserId().access ? `teacherId` : "isInitiated",
              key: UserRole[1] === getUserId().access ? `teacherId` : "isInitiated",
              render: (text, record) => (
                <span>
                  {(UserRole[1] === getUserId().access ? text?.name : text?.Observer.name) || "N/A"}
                </span>
              ),
            },
            {
              title: "Initiated Date",
              dataIndex: "date",
              key: "date",
              render: (text, record) => (
                <span>
                  {getAllTimes(text).formattedDate2}
                </span>
              ),
            },
            
            {
              title: "Status",
              dataIndex: "isCompleted",
              key: "isCompleted",
              render: (text, record) => (
                <span>
                  {text ? <Tag color='green'>Completed</Tag> : <Tag color='red'>Pending</Tag>}
                </span>
              ),
            },
            {
              title: "Action",
              key: "action",
              render: (text, record) => (
                <span>
                  {record?.isCompleted ? (
                    <Link to={`/weekly4form/report/${record?._id}`}>
                      <Button variant='solid' color='primary' size='large'>View Reports</Button>
                    </Link>)
                    :
                    UserRole[2] === getUserId().access &&
                      <Link to={`/weekly4form/create/${record?._id}`}>
                      <Button variant='link' color='primary' size='large'>Continue Form</Button>
                    </Link>
                  }
                  {UserRole[1] === getUserId().access && !record?.isCompleted &&
                   <Link to={`/weekly4form/create/${record?._id}`}>
                   <Button variant='solid' color='' size='large'>Push Notification</Button>
                 </Link>
                  }
                  {/* <Link to={`/weekly4form/${record?._id}`}>
                    <Button variant='solid' color='primary' size='small'>View</Button>
                  </Link> */}
                </span>
              ),
            },
          ]}
          dataSource={ReverseData()}
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
    </div>
  )
}

export default Weely4Page