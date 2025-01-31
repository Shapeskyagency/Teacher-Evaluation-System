import React, { useEffect } from 'react';
import TableReports from '../../Components/TableReports';
import { FileText, UserCircle, BookOpen, ClipboardCheck } from 'lucide-react';
import { FormOne_Columns } from './TableColumns';
import { GetAllFormsForAdmin } from '../../redux/Form/fortnightlySlice';
import { getUserId } from "../../Utils/auth";
import { useDispatch, useSelector } from "react-redux";

const reportTypes = [
  {
    title: 'Fortnightly Monitor',
    icon: <FileText className="w-5 h-5" />,
    bgColor: 'bg-green-50',
  },
  {
    title: 'Classroom Walkthrough',
    icon: <UserCircle className="w-5 h-5" />,
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Notebook Checking',
    icon: <BookOpen className="w-5 h-5" />,
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Weekly Learning Checklist',
    icon: <ClipboardCheck className="w-5 h-5" />,
    bgColor: 'bg-purple-50',
  },
];

const ObserverReports = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetAllFormsForAdmin());
   
  }, [dispatch]);

  const CombinedData = useSelector(
    (state) => state?.Forms?.getAllForms || []
  );
  console.log(CombinedData);

  

  return (
    <div className="p-4">
      {/* Report Type Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {reportTypes?.map((report, index) => (
          <div
            key={index}
            className={`flex items-center p-4 rounded-lg ${report.bgColor}`}
          >
            <div className="mr-3 text-gray-700">{report.icon}</div>
            <span className="text-gray-900 font-medium">{report.title}</span>
          </div>
        ))}
      </div>

      {/* Table Component */}
      <TableReports 
        columns={FormOne_Columns}
        dataSource={CombinedData}
        pagination
        tableHeight
      />
      
    </div>
    
  );
};

export default ObserverReports;
