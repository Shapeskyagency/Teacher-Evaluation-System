import React, { useEffect } from 'react'
import { getUserId } from '../../Utils/auth'
import { Button, Card } from 'antd'
import { UserRole } from '../../config/config'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { GetWingFrom } from '../../redux/userSlice'

function WingCoordinator() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const id = getUserId()?.id;
    const {getWingFormlist,loading} = useSelector((state) => state?.user);

    useEffect(()=>{
      dispatch(GetWingFrom(id))
    },[])
    console.log(getWingFormlist)
  return (
    <div className='pb-0 pt-0' >
    {getUserId().access === UserRole[1] && 

   <button
   style={{borderRadius:5}}
   className="mb-3 bg-[#1a4d2e] p-3 text-white py-2 " onClick={() => navigate("/wing-coordinator/create")}
    >
    <PlusCircleOutlined/>  Fill New Form
  </button>
  }

<h1>All Froms</h1>
 {getWingFormlist?.data?.map((item)=>(
  <>
  {console.log(item)}
  <Card>
    {item?.className}
  </Card>
  </>
 ))}
  </div>
  )
}

export default WingCoordinator