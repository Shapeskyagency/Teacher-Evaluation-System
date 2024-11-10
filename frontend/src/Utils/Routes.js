import { Navigate } from "react-router-dom";
import { getToken, getUserId } from "./auth";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import DashboardLayout from "./DashboardLayout";
import LoginLayout from "./LoginLayout";
import ObserverLayout from "./ObserverLayout";
import TeacherLayout from "./TeacherLayout";
import AdminDashboard from "../Pages/Admin/AdminDashboard";
import ObserverDashboard from "../Pages/Observer/ObserverDashboard";
import TeacherDashboard from "../Pages/Teachers/TeacherDashboard";


const role = getUserId()?.access;
const isLoggedIn = !!getToken();

const protects = {
  Teacher: [
    {
      path: "/",
      element: isLoggedIn && role === 'Teacher' ? <TeacherLayout /> : <Navigate to="/login" />,
      children: [
        { path: "/", element: <Navigate to="/Teacher" /> },
        { path: "/Teacher", element: <TeacherDashboard/> },
        { path: "*", element: <div>No page found</div> },
      ],
    },
  ],
  Superadmin: [
    {
      path: "/",
      element: isLoggedIn && role === 'admin' ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: "/", element: <Navigate to="/dashboard" /> },
        { path: "/dashboard", element: <AdminDashboard/> },
        { path: "*", element: <div>No page found</div> },
      ],
    },
  ],
  Observer: [
    {
      path: "/",
      element: isLoggedIn && role === 'Observer' ? <ObserverLayout /> : <Navigate to="/login" />,
      children: [
        { path: "/", element: <Navigate to="/Observer" /> },
        { path: "/dashboard", element: <ObserverDashboard/> },
        { path: "*", element: <div>No page found</div> },
      ],
    },
  ],
  default: [
    {
      path: "/",
      element: !isLoggedIn ? <LoginLayout /> : <Navigate to="/dashboard" />, 
      children: [
        { path: "/", element: <Login />},
        { path: "/login", element: <Login /> },
        { path: "/signup", element:<Register /> },
        { path: "*", element: <div>No page found</div> },
      ],
    },
  ],
};

export const protect = role && isLoggedIn ? (role === 'admin' ? protects['admin'] : protects['user']) : protects['default'];
export const defaultProtect = protects['default'];
