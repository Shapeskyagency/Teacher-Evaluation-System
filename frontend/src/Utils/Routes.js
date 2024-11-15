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
import Users from "../Pages/Admin/Users";
import NotFound404 from "../Components/NotFound404";
import UnderConstraction from "../Components/UnderConstraction";
import UserDetails from "../Pages/Admin/UserDetails";

const role = getUserId()?.access;
const isLoggedIn = getToken() !== null ? getToken()  : null;
const protects = {
  Teacher: [
    {
      path: "/",
      element: isLoggedIn && role === 'Teacher' ? <TeacherLayout /> : <Navigate to="/login" />,
      children: [
        { path: "/", element: <Navigate to="/Teacher" /> },
        { path: "/Teacher", element: <TeacherDashboard/> },
        { path: "*", element: <NotFound404/>},
      ],
    },
  ],
  Superadmin: [
    {
      path: "/",
      element: isLoggedIn && role === 'Superadmin' ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: "/", element: <Navigate to="/dashboard" /> },
        { path: "/dashboard", element: <AdminDashboard/> },
        { path: "/users", element: <Users/> },
        { path: "/users/:id", element: <UserDetails/> },
        { path: "/reports", element: <UnderConstraction/> },
        { path: "*", element: <NotFound404/> },
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
        { path: "*", element: <NotFound404/> },
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

export const protect = role && isLoggedIn ?protects[role]  : protects['default'];
export const defaultProtect = protects['default'];
