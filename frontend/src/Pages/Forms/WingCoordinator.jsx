import React, { useEffect } from 'react'
import { getUserId } from '../../Utils/auth'
import { Button, Card, Table } from 'antd'
import { UserRole } from '../../config/config'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { createWingForm, GetWingFrom } from '../../redux/userSlice'

function WingCoordinator() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const id = getUserId()?.id;
    const {getWingFormlist,loading} = useSelector((state) => state?.user);

    useEffect(()=>{
      dispatch(GetWingFrom(id))
    },[])
    
    const createFrom = async () =>{
      const res = await dispatch(createWingForm()).unwrap();
     if(res?.success)
      navigate(`/wing-coordinator/${res?.data?._id}`)
    }
  return (
    <div className='pb-0 pt-0' >
    {getUserId().access === UserRole[1] && 

   <button
   style={{borderRadius:5}}
   className="mb-3 bg-[#1a4d2e] p-3 text-white py-2 " onClick={() => createFrom()}
    >
    <PlusCircleOutlined/>  Fill New Form
  </button>
  }
<h1>All Froms</h1>
      <Table
          columns={[
            {
              title: "Name Of Observer",
              dataIndex: "userId",
              key: "userId",
              width: "160px",
              sorter: (a, b) =>
                (a?.name || "").localeCompare(b?.userId?.name || ""),
              render: (user) => <span>{user?.name || "N/A"}</span>,
            },
            {
              title: "Class Name",
              dataIndex: "className",
              key: "className",
              width: "160px",
              sorter: (a, b) =>
                (a?.className || "").localeCompare(b?.className || ""),
              render: (user,b) => <span>{user || "N/A"}</span>,
            },
            {
              title: "Status",
              dataIndex: "isComplete",
              key: "isComplete",
              width: "160px",
              filters: [
                { text: "Completed", value: true },
                { text: "Not Completed", value: false },
              ],
              onFilter: (value, record) => record.isComplete === value,
              render: (isComplete) => (
                <span 
                  style={{
                    color: isComplete ? 'green' : 'red', 
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}
                >
                  {isComplete ? "COMPLETED" : "NOT COMPLETED"}
                </span>
              ),
            },
            {
              title: "Visibility Status",
              dataIndex: "isDraft",
              key: "isDraft",
              width: "160px",
              filters: [
                { text: "Draft", value: true },
                { text: "Published", value: false },
              ],
              onFilter: (value, record) => record.isDraft === value,
              render: (isComplete,record) => (
                <span 
                  style={{
                    color: isComplete && !record?.iscomplete ?   'red':'green', 
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}
                >
                  {isComplete && !record?.iscomplete ? "DRAFT" : "PUBLISHED"}
                </span>
              ),
            },
            {
              title: "Action",
              dataIndex: "action",
              key: "action",
              width:"160px",
              render: (_, record) => {
                const { isDraft, isComplete, isObserverInitiation } =
                  record;
                  if (isDraft && !isComplete) {
                  return(
                      <Link
                                // className="btn text-primary"
                                to={`/wing-coordinator/${record._id}`}
                              >
                                  <button
                              className="text-nowrap px-3 py-1  text-blue-600 hover:text-blue-900 rounded-md text-sm font-medium transition-colors"
                            >
                               Continue Form
                            </button>
                               
                              </Link>
                  )
                  }
                if (!isDraft && isComplete) {
                  return (
                    <div className="d-flex gap-1 justify-content-start align-items-center">
                      <Link
                        // className="btn btn-primary text-nowrap h-fit"
                        to={`/wing-coordinator/report/${record._id}`}
                      >
                       <button
                    className="text-nowrap px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors"
                  >
                    View Report
                  </button>
                      </Link>
                      <Link
                        to={`/fortnightly-monitor/edit/${record._id}`}
                      >
                        <button
                        
                    className="text-nowrap px-3 py-1 bg-red-50 text-red-600 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                       
                      </Link>
                    </div>
                  );
                }
                }
            },
          ]}
          dataSource={getWingFormlist?.data}
          scroll={{
            x: "max-content", // Makes the table horizontally scrollable for mobile
          }}
          pagination={false}
          rowKey={"_id"}
        />
{/* {Array.isArray(getWingFormlist?.data) && getWingFormlist?.data.map((item) => (
  item?.className && (
    <Card key={item?._id}>
      {item?.className}
    </Card>
  )
))} */}

  </div>
  )
}

export default WingCoordinator