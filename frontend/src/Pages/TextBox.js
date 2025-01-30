import React from 'react';
import { UserCircle, FileText, LayoutDashboard, LogOut, ClipboardCheck, BookOpen, Search, ArrowUpDown, ChevronDown } from 'lucide-react';

const sampleData = [
  { key: '1', observer: 'John Doe', teacher: 'Jane Smith', class: '10th', section: 'A', date: '2025-01-20', subject: 'Mathematics' },
  { key: '2', observer: 'Alice Brown', teacher: 'Bob Wilson', class: '9th', section: 'B', date: '2025-01-21', subject: 'Science' },
  { key: '3', observer: 'Sarah Lee', teacher: 'Mike Johnson', class: '11th', section: 'C', date: '2025-01-22', subject: 'English' },
];

const TextBox = () => {
  const menuItems = [
    { key: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
    { key: 'profile', icon: <UserCircle className="w-4 h-4" />, label: 'Profile' },
    { key: 'reports', icon: <FileText className="w-4 h-4" />, label: 'Reports', selected: true },
  ];

  const formItems = [
    { key: 'fortnightly', icon: <FileText className="w-4 h-4" />, label: 'Fortnightly Monitor' },
    { key: 'classroom', icon: <UserCircle className="w-4 h-4" />, label: 'Classroom Walkthrough' },
    { key: 'notebook', icon: <BookOpen className="w-4 h-4" />, label: 'Notebook Checking' },
    { key: 'checklist', icon: <ClipboardCheck className="w-4 h-4" />, label: 'Weekly Learning Checklist' },
  ];

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
    { key: 'subject', label: 'Subject' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 font-bold text-lg border-b">EduEval</div>
        <div className="flex-1">
          <div className="px-3 py-2 text-sm text-gray-500">MENU</div>
          {menuItems.map(item => (
            <div 
              key={item.key} 
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${item.selected ? 'bg-gray-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
          
          <div className="px-3 py-2 mt-4 text-sm text-gray-500">FORMS</div>
          {formItems.map(item => (
            <div 
              key={item.key} 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-2 text-gray-600 cursor-pointer hover:bg-gray-50 p-2 rounded">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold">Reports Dashboard</h2>
          <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors">
            <UserCircle className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-700">Ms. Sarah Johnson</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Report Type Cards */}
          <div className="flex gap-4 mb-6">
            {reportTypes.map((type) => (
              <div
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

          {/* Search Bar with Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Search className="w-5 h-5 text-gray-400" />
              <span className="font-medium">Filter Reports</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <select className="w-full pl-8 pr-4 py-2 appearance-none bg-white border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Filter by observer</option>
                  </select>
                  <UserCircle className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <select className="w-full pl-8 pr-4 py-2 appearance-none bg-white border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>Filter by teacher</option>
                  </select>
                  <UserCircle className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <select className="w-full px-4 py-2 bg-white border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Filter by class</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <select className="w-full px-4 py-2 bg-white border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Filter by section</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-white border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <select className="w-full px-4 py-2 bg-white border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Filter by subject</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                  {sampleData.map((row) => (
                    <tr key={row.key} className="hover:bg-gray-50">
                      <td className="p-4">{row.observer}</td>
                      <td className="p-4">{row.teacher}</td>
                      <td className="p-4">{row.class}</td>
                      <td className="p-4">{row.section}</td>
                      <td className="p-4">{row.date}</td>
                      <td className="p-4">{row.subject}</td>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextBox;
