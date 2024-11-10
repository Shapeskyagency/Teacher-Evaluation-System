import React, { memo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserId } from "./auth";
// import Navbars from "../components/Navbar";
const TeacherLayout = () => {
    const role = getUserId()?.access;
    return role === "Teacher" ? (
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

export default memo(TeacherLayout);