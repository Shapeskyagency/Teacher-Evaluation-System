import React from "react";
import { useRoutes } from "react-router-dom";
import { defaultProtect, protect } from "./Utils/Routes";
import { withoutAuthRoute } from "./Utils/helper";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const routing = useRoutes(protect);

  let pathName = window.location.pathname
    .toLowerCase()
    .replace(/^\/|\/$/g, "")
    .split("/");

  let checkIsWithoutAuthRoute = withoutAuthRoute.includes(
    pathName && pathName.length > 0 ? pathName[0] : "--"
  );

  const defaultRouting = useRoutes(defaultProtect);
  
  return (
    <>
      <ToastContainer />
      {checkIsWithoutAuthRoute ? defaultRouting : routing}
    </>
  );
}

export default App;
