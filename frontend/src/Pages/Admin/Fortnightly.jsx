import React, { useEffect, useState, useMemo } from "react";
import { Button, Table, Select, Tag, DatePicker, Space } from "antd";
import { Col, Row } from "react-bootstrap";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate, useLocation} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  GetAllFormsForAdmin,
  GetFormsOne,
  GetObserverFormsOne,
} from "../../redux/Form/fortnightlySlice";
import { AdminFormcolumnsForm1 } from "../../Components/Data";
import { UserRole } from "../../config/config";
import { getUserId } from "../../Utils/auth";
import moment from "moment";

const { Option } = Select;

const Fortnightly = () => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Role = getUserId().access;
  const location = useLocation();
  const currentPath = location.pathname

  const CombinedData = useSelector(
    (state) => state?.Forms?.getAllForms || []
  );


  const [filteredCombinedData, setFilteredCombinedData] = useState([]);
  const [filters, setFilters] = useState({
    className: [],
    section: [],
    teacherID: [],
    status: [],
    date: [],
    observerName: [],
  });

  // Fetch forms on component mount
  useEffect(() => {
   dispatch(GetAllFormsForAdmin())
  }, [dispatch, Role]);

  // Sorting logic
  const sortData = (data) => {
    return [...(data || [])].sort((a, b) =>
      a.isTeacherComplete === b.isTeacherComplete
        ? 0
        : a.isTeacherComplete
        ? 1
        : -1
    );
  };

  // Handle sorting and set initial data
  useEffect(() => {
    setFilteredCombinedData(sortData(CombinedData));
  }, [CombinedData]);

  // Get unique values for filters
  const getUniqueValues = (key) => {
    const values = [];
    CombinedData?.forEach((item) => {

      if(key==='observerName'){
            values.push(item?.userID?.name || item?.coordinatorID?.name);
       }else if(key==='teacherID')
        {
          values.push(item?.teacherID?.name || item?.userID?.name);
        }
        else{
        if (item[key]) {
          values.push(item[key])
        }
       }
    });
    return [...new Set(values)];
  };

  const getTeachersNames = () => getUniqueValues("teacherID");
  const getClasses = () => getUniqueValues("className");
  const getSections = () => getUniqueValues("section");
  const getObserverNames = () => getUniqueValues("observerName");

  // Handle filter changes
  const handleFilter = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      className: [],
      section: [],
      teacherID: [],
      status: [],
      date: [],
      observerName: [],
    });
  };

  // Apply the filters to the data
  const applyFilters = (data) => {
    const { className, section, teacherID, status, date, observerName } = filters;
    return data.filter((item) => {

      const matchesClassName = className.length ? className.includes(item.className) : true;
      const matchesSection = section.length ? section.includes(item.section) : true;
      const matchesTeacherID = teacherID.length ? teacherID.includes(item?.teacherID?.name || item?.userId?.name ) : true;
      const matchesStatus = status.length ? status.includes(item.isTeacherComplete ? "COMPLETED" : "NOT COMPLETED") : true;
      const matchesDate = date.length
        ? date.some((d) => moment(item.date).isSame(d, "day"))
        : true;
      const matchesObserverName = observerName.length ? observerName.includes(item?.coordinatorID?.name || item?.userId?.name ) : true;

      return matchesClassName && matchesSection && matchesTeacherID && matchesStatus && matchesDate && matchesObserverName;
    });
  };

// Add filters to columns dynamically
const columnsWithFilters = useMemo(() => {
  const uniqueValues = (key, source) => {
    return [...new Set(source.flatMap((item) => (item[key] ? item[key] : [])))].map((value) => ({
      text: value,
      value: value,
    }));
  };

  return AdminFormcolumnsForm1.map((column) => {
    if (["className", "section", "teacherID", "observerName"].includes(column.dataIndex)) {
      return {
        ...column,
        // filters: uniqueValues(column.dataIndex, CombinedData),
        onFilter: (value, record) => record[column.dataIndex] === value,
      };
    }

    if (column.dataIndex === "date") {
      return {
        ...column,
        sorter: (a, b) => new Date(a.date) - new Date(b.date),
        sortDirections: ["descend", "ascend"],
      };
    }

    if (column.dataIndex === "isTeacherComplete") {
      return {
        ...column,
       
        onFilter: (value, record) =>
          (record.isTeacherComplete ? "COMPLETED" : "NOT COMPLETED") === value,
      };
    }

    return column;
  });
}, [CombinedData]);

  // Render table with filters and pagination
  const renderTable = (title, data) => (
    <div>
      <h3>{title}</h3>
      <Table
        columns={columnsWithFilters}
        dataSource={data}
        bordered
        rowKey={(record) => record?._id}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 5, responsive: true }}
      />
    </div>
  );


  return (
    <div className="container py-4">
      <Row>
        <Col>
          <div className="pb-0 pt-0" style={{ padding: "16px" }}>
            {Role === UserRole[2] && (
              <Button
                className="mb-3"
                onClick={() => navigate("/fortnightly-monitor/create")}
                type="primary"
                icon={<PlusCircleOutlined />}
                size="large"
              >
                New Form
              </Button>
            )}

            {(Role === UserRole[1] && currentPath !=="/reports") && (
                 <Button
                className="mb-3"
                onClick={() => navigate("/fortnightly-monitor/form-initiation")}
                type="primary"
                icon={<PlusCircleOutlined />}
                size="large"
              >
                Form Initiation
              </Button>
            )}

            {/* Filter Options - Searchable Multi-Select */}
            <div style={{ marginBottom: "20px" }}>
              <Row>
                   <Col md={2} className="mb-3">
                   <Select
                     mode="multiple"
                     allowClear
                     showSearch
                     style={{ width: "100%" }}
                     placeholder="Select Teacher"
                     value={filters.teacherID}
                     onChange={(value) => handleFilter("teacherID", value)}
                     options={getTeachersNames().map((teacher) => ({
                       value: teacher,
                       label: teacher,
                     }))}
                   />
                
                 </Col>
                <Col md={2} className="mb-3">
                  <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select Observer"
                    value={filters.observerName}
                    onChange={(value) => handleFilter("observerName", value)}
                    options={getObserverNames()?.map((observer) => ({
                      value: observer,
                      label: observer,
                    }))}
                  />
                  
                </Col>
                <Col md={2} className="mb-3">
                  <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select Class"
                    value={filters.className}
                    onChange={(value) => handleFilter("className", value)}
                    options={getClasses().map((className) => ({
                      value: className,
                      label: className,
                    }))}
                  />
                </Col>
                <Col md={2} className="mb-3">
                  <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select Section"
                    value={filters.section}
                    onChange={(value) => handleFilter("section", value)}
                    options={getSections().map((section) => ({
                      value: section,
                      label: section,
                    }))}
                  />
                </Col>
             
                   <Col md={2} className="mb-3">
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Select Date"
                    onChange={(date) =>
                      handleFilter("date", date ? [date.format("YYYY-MM-DD")] : [])
                    }
                  />
                </Col>
                <Col md={2} className="mb-3">
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Select Status"
                    value={filters.status}
                    onChange={(value) => handleFilter("status", value)}
                    options={[
                      { value: "COMPLETED", label: "Completed" },
                      { value: "NOT COMPLETED", label: "Not Completed" },
                    ]}
                  />
                </Col>
               
                <Col md={2} className="mb-3">
                  <Button onClick={handleResetFilters} type="default">
                    Reset Filters
                  </Button>
                </Col>
              </Row>
            </div>

            {/* Render Tables */}
            {renderTable("All Forms", applyFilters(filteredCombinedData))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Fortnightly;

