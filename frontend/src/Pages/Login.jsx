import { Button, Input, Layout } from 'antd'
import React from 'react'
import { UserOutlined } from '@ant-design/icons';
function Login() {
  return (
    <Layout style={layoutStyle} >
      <Input size="large" placeholder="large size" prefix={<UserOutlined />} />
       <Button type="primary">Button</Button>
       </Layout >
  )
}

export default Login

const layoutStyle = {
  borderRadius: 8,
  maxWidth: '1920px',
  padding:"20px",
  margin:"auto",
  background:"#fff"
};
