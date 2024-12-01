import { PlusCircleOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Notebook() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
  return (
    <div className="container py-4">
    <div style={{ padding: "16px" }}>
    <Button
      onClick={() => navigate("/notebook-checking-proforma/create")}
      type="primary"
      icon={<PlusCircleOutlined />}
      size="large"
      block // Makes the button responsive and full-width on smaller screens
      style={{ marginBottom: "16px",width:"fit-content" }} // Adds spacing below the button
    >
      Fill New Form
    </Button>
    </div>
    </div>
  )
}

export default Notebook