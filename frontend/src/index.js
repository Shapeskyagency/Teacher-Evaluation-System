import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter } from 'react-router-dom';
import {  ConfigProvider } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './output.css';
import 'react-loading-skeleton/dist/skeleton.css'
import App from './App';
import { ScoreContextProvider } from './Utils/ScoreContext';


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
          hoverBorderColor:"#4f6f52",
          activeShadow:"#4f6f52"
        },
        Button:{
          // colorPrimary: "linear-gradient(135deg, #6253e1, #04befe)",
          border:"none",
        },
        
      },
      }}>
        <ScoreContextProvider>
        <App />
        </ScoreContextProvider>
    </ConfigProvider>
    </BrowserRouter>
  </Provider>
</React.StrictMode>
);

reportWebVitals();
