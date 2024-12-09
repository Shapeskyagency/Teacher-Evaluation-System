import React from 'react'
import { getUserId } from '../../Utils/auth'
import { Button } from 'antd'
import { UserRole } from '../../config/config'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

function WingCoordinator() {
    const navigate = useNavigate()
  return (
    <div className='pb-0 pt-0' style={{ padding: "16px" }}>
    {getUserId().access === UserRole[1] && 
    <Button
    onClick={() => navigate("/wing-coordinator/create")}
    type="primary"
    icon={<PlusCircleOutlined />}
    size="large"
    block // Makes the button responsive and full-width on smaller screens
    style={{width:"fit-content" }} // Adds spacing below the button
  >
    Fill New Form
  </Button>}
  </div>
  )
}

export default WingCoordinator