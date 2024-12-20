import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter } from 'react-router-dom';
import {  ConfigProvider } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  
  <Provider store={store}>
    <BrowserRouter>
    <ConfigProvider 
    
    theme={{
      components:{
        Modal: {
          titleFontSize:25,
        },
        Input:{
          activeBorderColor:"#1677ff",
          hoverBorderColor:"#4096ff",
          activeShadow:"#4096ff"
        },
        Button:{
          // colorPrimary: "linear-gradient(135deg, #6253e1, #04befe)",
          border:"none",
        },
        
      },
      }}>
        <App />
    </ConfigProvider>
    </BrowserRouter>
  </Provider>
</React.StrictMode>
);

reportWebVitals();
