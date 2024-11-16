import React, { memo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserId } from "./auth";
import { Layout } from "antd";
import MainFooter from "../Components/MainFooter";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const { Header, Footer, Sider, Content } = Layout;
const TeacherLayout = () => {
    const role = getUserId()?.access;
    return role === "Teacher" ? (
    <>
   <Layout style={layoutStyle}>
      <Sider width="18%" style={siderStyle}>
      <Sidebar/>
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          <Navbar/>
        </Header>
        <Content style={contentStyle}>
        <Outlet />
        </Content>
        <Footer style={footerStyle}>
          <MainFooter/>
        </Footer>
      </Layout>
    </Layout>
    </>
  ) : (
   <>
    <Navigate to="/login" />
  </>
  );
};

export default memo(TeacherLayout);



const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#4096ff',
};
const contentStyle = {
  // textAlign: 'center',
  minHeight: 120,
  lineHeight: '100px',
  backgroundColor: '#fff',
};
const siderStyle = {
  textAlign: 'center',
  lineHeight: '150%',
  color: '#fff',
  backgroundColor: '#fff',
  height:"100dvh",
  overflow:"auto",
  boxShadow:"rgb(0 0 0 / 11%) 1px 1px 9px"
};
const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  // backgroundColor: '#4096ff',
};
const layoutStyle = {
  // borderRadius: 8,
  overflow: 'hidden',
  width: '100%',
  maxWidth: '100%',
  margin:"auto"
};

