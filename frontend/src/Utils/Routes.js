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
import UserProfile from "../Pages/UserProfile";
import FortnightlyMonitor from "../Pages/Forms/FortnightlyMonitor";
import BasicDetailsForm from "../Components/BasicDeatilsForm";
import Details from "../Pages/Forms/FormInside/Details";
import ClassroomWalkthrough from "../Pages/Forms/ClassroomWalkthrough";
import DetailsWalkthrough from "../Pages/Forms/FormInside/DetailsWalkthrough";
import Notebook from "../Pages/Forms/Notebook";
import NoteBookDetails from "../Pages/Forms/FormInside/NoteBookDetails";
import TeacherWalkthrough from "../Pages/Forms/FormInside/TeacherWalkthrough";
import ObserverNotebook from "../Pages/Forms/FormInside/ObserverNotebook";
import Reader from "../Pages/Reports/Reader";
import FinalReport from "../Pages/Observer/FinalFom/FinalReport";
import WingCoordinator from "../Pages/Forms/WingCoordinator";
import ClassroomWalkthroughReader from "../Pages/Reports/ClassroomWalkthroughReader";
import FortnightlyMonitorInitiation from "../Pages/Observer/FinalFom/FortnightlyMonitorInitiation";
import InitiateBasicDetails from "../Components/InitiateBasicDetails";
import FortnightlyMonitorEdit from "../Pages/Teachers/FortnightlyMonitorEdit";
import OB_FortnightlyMonitorEdit from "../Pages/Observer/OB_FortnightlyMonitorEdit";

const role = getUserId()?.access;
const isLoggedIn = getToken() !== null ? getToken()  : null;
const protects = {
  Teacher: [
    {
      path: "/",
      element: isLoggedIn && role === 'Teacher' ? <TeacherLayout /> : <Navigate to="/login" />,
      children: [
        { path: "/", element: <Navigate to="/dashboard" /> },
        { path: "/dashboard", element: <TeacherDashboard/> },
        {path:"/profile", element:<UserProfile/>},
        {path:'/fortnightly-monitor', element:<FortnightlyMonitor/>},
        {path:'/fortnightly-monitor/create', element:<BasicDetailsForm/>},
        {path:'/fortnightly-monitor/create/:id', element:<Details/>},
        {path:'/fortnightly-monitor/initiate/create/:id', element:<Details/>},
        {path:'/fortnightly-monitor/report/:id', element:<Reader/>},
        {path:"/classroom-walkthrough",element:<ClassroomWalkthrough/>},
        {path:"/classroom-walkthrough/create/:id",element:<TeacherWalkthrough/>},
        {path:"/classroom-walkthrough/report/:id",element:<ClassroomWalkthroughReader/>},
        {path:'/notebook-checking-proforma', element:<Notebook/>},
        {path:'/notebook-checking-proforma/create', element:<NoteBookDetails/>},
        {path:'/notebook-checking-proforma/create/:id', element:<NoteBookDetails/>},
        {path:'/fortnightly-monitor/edit/:id', element:<FortnightlyMonitorEdit/>},
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
        {path:"/profile", element:<UserProfile/>},
        {path:'/fortnightly-monitor', element:<FortnightlyMonitor/>},
        {path:'/fortnightly-monitor/create', element:<BasicDetailsForm/>},
        {path:'/fortnightly-monitor/create/:id', element:<Details/>},
        {path:'/fortnightly-monitor/report/:id', element:<Reader/>},
        {path:"/classroom-walkthrough/report/:id",element:<ClassroomWalkthroughReader/>},
        { path: "*", element: <NotFound404/> },
      ],
    },
  ],
  Observer: [
    {
      path: "/",
      element: isLoggedIn && role === 'Observer' ? <ObserverLayout /> : <Navigate to="/login" />,
      children: [
        { path: "/", element: <Navigate to="/dashboard" /> },
        { path: "/dashboard", element: <ObserverDashboard/> },
        {path:'/fortnightly-monitor', element:<FortnightlyMonitor/>},
        {path:"/profile", element:<UserProfile/>},
        {path:'/fortnightly-monitor', element:<FortnightlyMonitor/>},
        {path:'/fortnightly-monitor/create', element:<BasicDetailsForm/>},
        {path:'/fortnightly-monitor/initiate/create/:id', element:<Details/>},
        {path:'/fortnightly-monitor/create/:id', element:<Details/>},
        {path:'/fortnightly-monitor/report/:id', element:<Reader/>},
        {path:"/classroom-walkthrough",element:<ClassroomWalkthrough/>},
        {path:"/classroom-walkthrough/create",element:<DetailsWalkthrough/>},
        {path:"/classroom-walkthrough/create/:id",element:<DetailsWalkthrough/>},
        {path:"/classroom-walkthrough/report/:id",element:<ClassroomWalkthroughReader/>},
          {path:'/notebook-checking-proforma', element:<Notebook/>},
        {path:'/notebook-checking-proforma/create/:id', element:<ObserverNotebook/>},
        { path: "/wing-coordinator", element:<WingCoordinator /> },
        { path: "/wing-coordinator/create", element:<FinalReport /> },
        { path: "/fortnightly-monitor/form-initiation", element:<FortnightlyMonitorInitiation /> },
        {path:'/fortnightly-monitor/edit/:id', element:<OB_FortnightlyMonitorEdit/>},
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
        
        { path: "*", element: <NotFound404/> },
      ],
    },
  ],
};

export const protect = role && isLoggedIn ?protects[role]  : protects['default'];
export const defaultProtect = protects['default'];
