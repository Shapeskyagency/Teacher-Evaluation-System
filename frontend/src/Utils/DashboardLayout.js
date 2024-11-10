import React, { memo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserId } from "./auth";
import { Layout } from "antd";
// import Navbars from "../components/Navbar";


const { Header, Footer, Sider, Content } = Layout;

const headerStyle= {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#4096ff',
};

const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#0958d9',
};

const siderStyle= {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#1677ff',
};

const footerStyle= {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#4096ff',
};

const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  width: 'calc(50% - 8px)',
  maxWidth: 'calc(50% - 8px)',
};


const DashboardLayout = () => {
  const role = getUserId()?.access;
  return role === "Superadmin" ? (
    <>
    {/* <Navbars /> */}
 

  <Layout style={layoutStyle}>
      <Sider width="25%" style={siderStyle}>
        Sider
      </Sider>
      <Layout>
        <Header style={headerStyle}>Header</Header>
        <Content style={contentStyle}> <Outlet /></Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </Layout>
    </>
  ) : (
   <>
    <Navigate to="/login" />
  </>
  );
};

export default memo(DashboardLayout);


