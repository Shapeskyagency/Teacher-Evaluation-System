import React, { useState, useEffect } from "react";
import { Button, Select, Table, DatePicker } from "antd";
import { FileText, UserCircle, BookOpen, ClipboardCheck } from "lucide-react";
import { FormOne_Columns } from "./TableColumns";
import { GetAllFormsForAdmin } from "../../redux/Form/fortnightlySlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

const reportTypes = [
  {
    title: "Fortnightly Monitor",
    icon: <FileText className="w-5 h-5" />,
    bgColor: "bg-green-50",
  },
  {
    title: "Classroom Walkthrough",
    icon: <UserCircle className="w-5 h-5" />,
    bgColor: "bg-orange-50",
  },
  {
    title: "Notebook Checking",
    icon: <BookOpen className="w-5 h-5" />,
    bgColor: "bg-blue-50",
  },
  {
    title: "Weekly Learning Checklist",
    icon: <ClipboardCheck className="w-5 h-5" />,
    bgColor: "bg-purple-50",
  },
];

const { Option } = Select;

const ObserverReports = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    observer: [],
    teacher: [],
    class: [],
    section: [],
    date: [],
    teacherStatus: [],
    observerStatus: [],
  });

  useEffect(() => {
    dispatch(GetAllFormsForAdmin());
  }, [dispatch]);

  const CombinedData = useSelector((state) => state?.Forms?.getAllForms || []);

  // Dynamically get unique values for filters
  const uniqueClasses = [
    ...new Set(CombinedData.map((item) => item.className).filter(Boolean)),
  ];
  const uniqueObservers = [
    ...new Set(
      CombinedData.map((item) => item.coordinatorID?.name).filter(
        (name) => name
      )
    ),
  ]; // Ensure only non-falsy names are included
  const uniqueTeachers = [
    ...new Set(
      CombinedData.map((item) => item?.teacherID?.name).filter((name) => name)
    ),
  ]; // Ensure only non-falsy names are included
  const uniqueDates = [...new Set(CombinedData.map((item) => item.date))];

  // Dynamically get unique sections
  const uniqueSections = [
    ...new Set(CombinedData.map((item) => item.section).filter(Boolean)), // Ensure only non-falsy values
  ];

  // Function to handle filter change for multiple values
  const handleFilterChange = (value, filterType) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  // Function to reset all filters
  const resetFilters = () => {
    setFilters({
      observer: [],
      teacher: [],
      class: [],
      section: [],
      date: [],
      teacherStatus: [],
      observerStatus: [],
    });
  };

  // Handle date picker change
  const handleDateChange = (date, dateString) => {
    if (date) {
      // Format the selected date to match the format in the data (e.g., 'YYYY-MM-DD')
      setFilters((prev) => ({
        ...prev,
        date: [dateString], // Store as string to match with data date field
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        date: [], // Clear date filter if no date is selected
      }));
    }
  };

  // Filter CombinedData based on selected filters
  const filteredData = CombinedData.filter((item) => {
    // Format date in item for comparison
    const itemDate = moment(item.date).format("YYYY-MM-DD");

    return (
      (filters.class.length === 0 || filters.class.includes(item.className)) &&
      (filters.section.length === 0 ||
        filters.section.includes(item.section)) &&
      (filters.date.length === 0 || filters.date.includes(itemDate)) && // Compare the date as string
      (filters.teacherStatus.length === 0 ||
        filters.teacherStatus.includes(item.isTeacherComplete)) &&
      (filters.observerStatus.length === 0 ||
        filters.observerStatus.includes(item.isCoordinatorComplete)) &&
      (filters.observer.length === 0 ||
        filters.observer.some((name) =>
          item.coordinatorID?.name.includes(name)
        )) 
        &&
      (filters.teacher.length === 0 ||
        filters.teacher.some((name) => item?.teacherID.includes(name)))
    );
  });

  return (
    <>
      <div className="p-4">
        {/* Report Type Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {reportTypes.map((report, index) => (
            <div
              key={index}
              className={`flex items-center p-4 rounded-lg ${report.bgColor}`}
            >
              <div className="mr-3 text-gray-700">{report.icon}</div>
              <span className="text-gray-900 font-medium">{report.title}</span>
            </div>
          ))}
        </div>

        {/* Filters Section */}
        <div className="mb-4 flex flex-wrap gap-4">
          {/* Observer Filter */}
          <div className="w-35">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Observer Name"
              value={filters.observer}
              onChange={(value) => handleFilterChange(value, "observer")}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {uniqueObservers.map((observer, index) => (
                <Option key={index} value={observer}>
                  {observer}
                </Option>
              ))}
            </Select>
          </div>

          {/* Teacher Filter */}
          <div className="w-35">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Teacher Name"
              value={filters.teacher}
              onChange={(value) => handleFilterChange(value, "teacher")}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {uniqueTeachers.map((teacher, index) => (
                <Option key={index} value={teacher}>
                  {teacher}
                </Option>
              ))}
            </Select>
          </div>

          {/* Class Filter */}
          <div className="w-35">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select Class"
              value={filters.class}
              onChange={(value) => handleFilterChange(value, "class")}
            >
              {uniqueClasses.map((className, index) => (
                <Option key={index} value={className}>
                  {className}
                </Option>
              ))}
            </Select>
          </div>

          {/* Section Filter */}
          <div className="w-35">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select Section"
              value={filters.section}
              onChange={(value) => handleFilterChange(value, "section")}
            >
              {uniqueSections.map((section, index) => (
                <Option key={index} value={section}>
                  {section}
                </Option>
              ))}
            </Select>
          </div>

          {/* Teacher Status Filter */}
          <div className="w-35">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Teacher Status"
              value={filters.teacherStatus}
              onChange={(value) => handleFilterChange(value, "teacherStatus")}
            >
              <Option value={true}>Complete</Option>
              <Option value={false}>Incomplete</Option>
            </Select>
          </div>

          {/* Observer Status Filter */}
          <div className="w-35">
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Observer Status"
              value={filters.observerStatus}
              onChange={(value) => handleFilterChange(value, "observerStatus")}
            >
              <Option value={true}>Complete</Option>
              <Option value={false}>Incomplete</Option>
            </Select>
          </div>
          <div className="mb-4">
            <DatePicker
              style={{ width: 150 }}
              placeholder="Select Date"
              onChange={handleDateChange}
              format="YYYY-MM-DD"
            />
          </div>
          <Button type="default" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>

        {/* Table Component */}
        <Table
          columns={FormOne_Columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          rowKey="_id"
        />
      </div>
    </>
  );
};

export default ObserverReports;
