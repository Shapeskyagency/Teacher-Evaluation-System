import React,{useState,useEffect} from 'react'
import moment from 'moment';
import { UserCircle, FileText, BookOpen, ClipboardCheck, Search, ArrowUpDown } from 'lucide-react';
function TableReports({data,columns}) {
    const [filteredData, setFilteredData] = useState([]);

     // Initialize filteredData with data
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  
    // Handle filtering based on key and value
  const handleFilter = (key, value) => {
    const filtered = data?.filter(item => {
      if (key === 'observer') {
        return item?.userID?.name?.includes(value) || item?.coordinatorID?.name?.includes(value);
      } else if (key === 'teacher') {
        return item?.teacherID?.name?.includes(value) || item?.userID?.name?.includes(value);
      } else if (key === 'class') {
        return item.className?.includes(value);
      } else if (key === 'section') {
        return item.section?.includes(value);
      } else if (key === 'date') {
        return moment(item.date).format('YYYY-MM-DD') === value;
      }
      return true;
    });
    setFilteredData(filtered);
  };

  return (
    <div>   
         {/* Search Bar with Filters */}
      {/* <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Search className="w-5 h-5 text-gray-400" />
          <span className="font-medium">Filter Reports</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <select
                className="w-full pl-8 pr-4 py-2 appearance-none bg-white border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => handleFilter('observer', e.target.value)}
              >
                <option value="">Filter by observer</option>
                {[...new Set(data?.map(item => item?.userID?.name || item?.coordinatorID?.name))]?.map((observer, index) => (
                  <option key={index} value={observer}>{observer}</option>
                ))}
              </select>
              <UserCircle className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <select
                className="w-full pl-8 pr-4 py-2 appearance-none bg-white border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => handleFilter('teacher', e.target.value)}
              >
                <option value="">Filter by teacher</option>
                {[...new Set(data?.map(item => item?.teacherID?.name || item?.userID?.name))]?.map((teacher, index) => (
                  <option key={index} value={teacher}>{teacher}</option>
                ))}
              </select>
              <UserCircle className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <select
              className="w-full px-4 py-2 bg-white border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => handleFilter('class', e.target.value)}
            >
              <option value="">Filter by class</option>
              {[...new Set(data?.map(item => item.className))]?.map((className, index) => (
                <option key={index} value={className}>{className}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <select
              className="w-full px-4 py-2 bg-white border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => handleFilter('section', e.target.value)}
            >
              <option value="">Filter by section</option>
              {[...new Set(data?.map(item => item.section))]?.map((section, index) => (
                <option key={index} value={section}>{section}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <input
              type="date"
              className="w-full px-4 py-2 bg-white border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => handleFilter('date', e.target.value)}
            />
          </div>
        </div>
      </div> */}

      {/* Table */}
      {/* <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      {columns.map((column) => (
                        <th key={column.key} className="text-left p-4 font-medium text-xs text-gray-500 uppercase tracking-wider">
                          <button className="flex items-center gap-2 hover:text-gray-700">
                            {column.label}
                            <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </th>
                      ))}
                      <th className="text-left p-4 font-medium text-xs text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
              {filteredData?.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4">{row?.userID?.name || row?.coordinatorID?.name || "N/A"}</td>
                  <td className="p-4">{row?.teacherID?.name || row?.userID?.name || "N/A"}</td>
                  <td className="p-4">{row.className || "N/A"}</td>
                  <td className="p-4">{row.section || "N/A"}</td>
                  <td className="p-4">{row.date ? moment(row.date).format('YYYY-MM-DD') : "N/A"}</td>
                  <td className="p-4">
                    <button className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors">
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
      </tbody>

                </table>
        </div>
      </div> */}
    </div>
  )
}

export default TableReports