import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Spin, Table, Select, DatePicker, Space } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  GetcreatedByUser,
  GetobserverForms,
} from "../../redux/Form/noteBookSlice";
import { Formcolumns3 } from "../../Components/Data";
import { getAllTimes, getUserId } from "../../Utils/auth";
import { UserRole } from "../../config/config";
import moment from "moment";
import { Col, Row } from "react-bootstrap";

const { Option } = Select;

function Notebook() {
  

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
    const [filters, setFilters] = useState({
      observer: [],
      teacher: [],
      class: [],
      section: [],
      subject: [],
      date: [],
      teacherStatus: [],
      observerStatus: [],
    });
  
    const CombinedData = useSelector((state) => state?.notebook?.GetForms2 || []);
    const {isLoading} = useSelector((state) => state?.notebook);
  
 const Role = getUserId().access;

  useEffect(() => {
    if (Role === UserRole[1]) {
      dispatch(GetobserverForms());
    } else {
      dispatch(GetcreatedByUser());
    }
  }, [dispatch]);
  
    // Dynamically get unique values for filters
    const uniqueClasses = [
      ...new Set(
        CombinedData.map((item) => item?.grenralDetails?.className).filter(Boolean)
      ),
    ];
    const uniqueObservers = [
      ...new Set(
        CombinedData.map((item) =>  item?.grenralDetails?.NameofObserver?.name || item?.createdBy?.name).filter(Boolean)
      ),
    ];
    const uniqueTeachers = [
      ...new Set(
        CombinedData.map((item) => item?.teacherID?.name || item?.createdBy?.name ).filter(Boolean)
      ),
    ];
    const uniqueDates = [
      ...new Set(
        CombinedData.map((item) =>
          moment(item?.grenralDetails?.DateOfObservation).format("YYYY-MM-DD")
        )
      ),
    ];
    const uniqueSections = [
      ...new Set(
        CombinedData.map((item) => item?.grenralDetails?.Section).filter(Boolean)
      ),
    ];
  
    const uniqueSubject = [
      ...new Set(
        CombinedData.map((item) => item?.grenralDetails?.Subject).filter(Boolean)
      ),
    ];
  
    // Function to handle filter change
    const handleFilterChange = (value, filterType) => {
      setFilters((prev) => ({ ...prev, [filterType]: value }));
    };
  
    // Handle date picker change
    const handleDateChange = (date, dateString) => {
      setFilters((prev) => ({ ...prev, date: date ? [dateString] : [] }));
    };
  
    // Filter the data based on selected filters
    const filteredData = CombinedData.filter((item) => {
      const itemDate = moment(item?.grenralDetails?.DateOfObservation).format("YYYY-MM-DD");
  
      return (
        (filters.class.length === 0 || filters.class.includes(item?.grenralDetails?.className)) &&
        (filters.section.length === 0 || filters.section.includes(item?.grenralDetails?.Section)) &&
        (filters.subject.length === 0 || filters.subject.includes(item?.grenralDetails?.Subject))&&
        (filters.date.length === 0 || filters.date.includes(itemDate)) &&
        (filters.teacherStatus.length === 0 || filters.teacherStatus.includes(item?.isTeacherComplete)) &&
        (filters.observerStatus.length === 0 || filters.observerStatus.includes(item?.isObserverComplete)) &&
        (filters.observer.length === 0 || filters.observer.includes(item?.grenralDetails?.NameofObserver?.name || item?.createdBy?.name)) &&
        (filters.teacher.length === 0 || filters.teacher.includes(item?.teacherID?.name || item?.createdBy?.name ))
      );
    });

  return (
    <div className="container p-0">
      {isLoading && (
        <div className="LoaderWrapper">
          <Spin size="large" className="position-absolute" />
        </div>
      )}
     

{getUserId().access === UserRole[2] && (
          <button
           style={{borderRadius:5}}
           className="mb-3 bg-[#1a4d2e] p-3 text-white py-2 "
            onClick={() => navigate("/notebook-checking-proforma/create")} >
            <PlusCircleOutlined /> Fill New Form
          </button>
        )}
      

      {Role === UserRole[1] && (
        <button
        style={{borderRadius:5}}
          className="mb-3 bg-[#1a4d2e] p-3 text-white py-2 "
          onClick={() =>
            navigate("/notebook-checking-proforma/form-initiation")
          }
        >
         <PlusCircleOutlined /> Form Initiation
        </button>
      )}
       {/* Filters Section */}
       <div className="flex flex-wrap gap-4 mb-3">
       {UserRole[2] === getUserId().access && (
        <div className="w-35 select-options">
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Observer Name"
          value={filters.observer}
          onChange={(value) => handleFilterChange(value, "observer")}
          showSearch
        >
          {uniqueObservers.map((observer, index) => (
            <Option key={index} value={observer}>
              {observer}
            </Option>
          ))}
        </Select>
        </div>
       )}
        {UserRole[1] === getUserId().access && (
      <div className="w-35 select-options">
      {/* Teacher Filter */}
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="Teacher Name"
        value={filters.teacher}
        onChange={(value) => handleFilterChange(value, "teacher")}
        showSearch
      >
        {uniqueTeachers.map((teacher, index) => (
          <Option key={index} value={teacher}>
            {teacher}
          </Option>
        ))}
      </Select>
      </div>
        )}
  
        <div className="w-35 select-options">
        {/* Class Filter */}
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
        <div className="w-35 select-options">
        {/* Section Filter */}
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
        {/* subject */}
        </div>
        <div className="w-35 select-options">
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Select Subject"
          value={filters.subject}
          onChange={(value) => handleFilterChange(value, "subject")}
        >
          {uniqueSubject.map((section, index) => (
            <Option key={index} value={section}>
              {section}
            </Option>
          ))}
        </Select>
        </div>
        <div className="w-35 select-options">
        {/* Teacher Status Filter */}
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
        <div className="w-35 select-options">
        {/* Observer Status Filter */}
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
        <div className="w-35 select-options">
        {/* Date Filter */}
        <DatePicker
           style={{ width: "100%" }}
          placeholder="Select Date"
          onChange={handleDateChange}
          format="YYYY-MM-DD"
        />
      </div>
      </div>

      <Table
        columns={Formcolumns3}
        dataSource={filteredData}
        pagination={false}
         scroll={{ y: "100%", x: "100%" }}
        rowKey="_id"
      />
    </div>
  );
}

export default Notebook;
