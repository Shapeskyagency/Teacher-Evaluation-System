import React, { memo, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserId } from "./auth";
import { Layout } from "antd";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import MainFooter from "../Components/MainFooter";
import { useDispatch } from "react-redux";
import { getUserNotification } from "../redux/userSlice";

const { Header, Footer, Sider, Content } = Layout;

const ObserverLayout = () => {
  const role = getUserId()?.access;
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    dispatch(getUserNotification());
  }, [dispatch]);

  const handleCollapse = (isCollapsed) => {
    setCollapsed(isCollapsed);
  };

  return role === "Observer" ? (
    <Layout style={layoutStyle}>
      <Sider
        width="18%"
        style={siderStyle}
        breakpoint="lg"
        collapsedWidth="0"
        collapsible
        onCollapse={handleCollapse}
      >
        <Sidebar />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? "0" : "18%",
          transition: "margin 0.3s ease",
        }}
      >
        <Header style={headerStyle}>
          <Navbar />
        </Header>
        <Content style={contentStyle}>
          <Outlet />
        </Content>
        <Footer style={footerStyle}>
          <MainFooter />
        </Footer>
      </Layout>
    </Layout>
  ) : (
    <Navigate to="/login" />
  );
};

export default memo(ObserverLayout);

const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: "auto",
  padding: "8px 16px",
  backgroundColor: "#4096ff",
  transition: "all 0.3s ease",
};

const contentStyle = {
  minHeight: "120px",
  padding: "16px",
  backgroundColor: "#fff",
  transition: "all 0.3s ease",
};

const siderStyle = {
  backgroundColor: "#fff",
  height: "100vh",
  boxShadow: "rgb(0 0 0 / 11%) 1px 1px 9px",
  position: "fixed",
  left: 0,
  zIndex: 999,
};

const footerStyle = {
  textAlign: "center",
  color: "#fff",
  padding: "8px",
  backgroundColor: "#4096ff",
};

const layoutStyle = {
  width: "100%",
  margin: "0 auto",
  overflow: "hidden",
};
