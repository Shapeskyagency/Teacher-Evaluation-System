import React, { useEffect, useState } from 'react';
import { UserCircle, FileText, BookOpen, ClipboardCheck, Search, ArrowUpDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllFormsForAdmin } from '../../redux/Form/fortnightlySlice';
import TableReports from '../../Components/TableReports'
import { GetAllClassRoomForms } from "../../redux/Form/classroomWalkthroughSlice";
import ClassRoom from '../Admin/ClassRoom'
import Fortnightly from '../Admin/Fortnightly'
import NootBook from '../Admin/NootBook'
import Weekly from '../Admin/Weekly'
import moment from 'moment';
import {Spin } from "antd";

const reportTypes = [
  {
    title: 'Fortnightly Monitor',
    icon: <FileText className="w-5 h-5" />,
    bgColor: 'bg-green-50'
  },
  {
    title: 'Classroom Walkthrough',
    icon: <UserCircle className="w-5 h-5" />,
    bgColor: 'bg-orange-50'
  },
  {
    title: 'Notebook Checking',
    icon: <BookOpen className="w-5 h-5" />,
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Weekly Learning Checklist',
    icon: <ClipboardCheck className="w-5 h-5" />,
    bgColor: 'bg-purple-50'
  }
];
const columns = [
  { key: 'observer', label: 'Observer' },
  { key: 'teacher', label: 'Teacher' },
  { key: 'class', label: 'Class' },
  { key: 'section', label: 'Section' },
  { key: 'date', label: 'Date' },
];

const ObserverReports = () => {
  const dispatch = useDispatch();
  const CombinedData = useSelector((state) => state?.Forms?.getAllForms || []);
  const { isLoading, GetForms } = useSelector((state) => state?.walkThroughForm||[]);
  const [filteredData, setFilteredData] = useState([]);
  const [steps, steSteps] =useState(0);

  const NextPage = (value)=>{
 
    steSteps(value)
  }
  
  return (
    <div className="flex-1 p-6">
      {/* Report Type Cards */}
      <div className="flex gap-4 mb-6">
        {reportTypes.map((type,i) => (
          <div
          onClick={()=>NextPage(i)}
            key={type.title}
            className={`flex-1 p-4 rounded-lg ${type.bgColor} cursor-pointer hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center gap-2">
              {type.icon}
              <span className="font-medium">{type.title}</span>
            </div>
          </div>
        ))}
      </div>
      {isLoading &&
      <div className="LoaderWrapper">
      <Spin size="large" className="position-absolute" />
    </div>
      }
      {steps ===0 &&(
       <Fortnightly />
      )}
     
     {steps ===1 &&(
      <ClassRoom/>
        // <TableReports columns={columns}  data={GetForms}/>
      )}
      {steps ===2 &&(
          <NootBook />
        // <TableReports columns={columns}  data={GetForms}/>
      )}
      {steps ===3 &&(
        <Weekly />
        // <TableReports columns={columns}  data={GetForms}/>
      )}
    </div>
  );
};

export default ObserverReports;