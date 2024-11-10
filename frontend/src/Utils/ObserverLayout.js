import React, { memo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserId } from "./auth";
// import Navbars from "../components/Navbar";
const ObserverLayout = () => {
//   const tokensss = localStorage.getItem('accessToken')
  const role = getUserId()?.access;
  return role === "Observer" ? (
    <>
    {/* <Navbars /> */}
  <Outlet />
    </>
  ) : (
   <>
    <Navigate to="/login" />
  </>
  );
};

export default memo(ObserverLayout);