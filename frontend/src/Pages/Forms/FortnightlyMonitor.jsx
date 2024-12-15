import React, { useEffect, useState, useMemo } from "react";
import { Button, Table, Select, Tag } from "antd";
import { Col, Row } from "react-bootstrap";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  GetFormsOne,
  GetObserverFormsOne,
} from "../../redux/Form/fortnightlySlice";
import { FormcolumnsForm1 } from "../../Components/Data";
import { UserRole } from "../../config/config";
import { getUserId } from "../../Utils/auth";

const { Option } = Select;

const FortnightlyMonitor = () => {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Role = getUserId().access;

  const forms = useSelector(
    (state) => state?.Forms?.getAllForms?.Assigned || []
  );
  const formInitiationList = useSelector(
    (state) => state?.Forms?.getAllForms?.Initiated || []
  );

  const [filteredData, setFilteredData] = useState([]);
  const [filteredInitiationData, setFilteredInitiationData] = useState([]);
  const [filters, setFilters] = useState({
    className: [],
    section: [],
    teacherID: [],
  });

  // Fetch forms on component mount
  useEffect(() => {
    if (Role === UserRole[1]) {
      dispatch(GetObserverFormsOne());
    } else if (Role === UserRole[2]) {
      dispatch(GetFormsOne());
    }
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
    setFilteredData(sortData(forms));
    setFilteredInitiationData(sortData(formInitiationList));
  }, [forms, formInitiationList]);

  // Get teacher names from forms and formInitiationList
  const GetTeachersName = () => {
    const teachers = [];

    // Push teacher names from forms
    forms?.forEach((item) => {
      if (item.userId?.name && item.userId?.access === UserRole[2]) {
        teachers.push(item.userId.name);
      } else if (item?.teacherID?.name) {
        teachers.push(item?.teacherID?.name);
      }
    });

    // Push teacher names from formInitiationList
    formInitiationList?.forEach((item) => {
      if (item.userId?.name && item.userId?.access === UserRole[2]) {
        teachers.push(item.userId.name);
      } else if (item?.teacherID?.name) {
        teachers.push(item?.teacherID?.name);
      }
    });

    // Remove duplicates by creating a Set and then convert back to an array
    return [...new Set(teachers)];
  };



  const GetClasses = () => {
    const classes = [];

    // Push teacher names from forms
    forms?.forEach((item) => {
      if (item?.className) {
        classes.push(item?.className);
            }
    });

    // Push teacher names from formInitiationList
    formInitiationList?.forEach((item) => {
      if (item?.className) {
        classes.push(item?.className);
     }
    });

    // Remove duplicates by creating a Set and then convert back to an array
    return [...new Set(classes)];
  };


  const GetSections = () => {
    const Sections = [];

    // Push teacher names from forms
    forms?.forEach((item) => {
      if (item?.section) {
        Sections.push(item?.section);
            }
    });

    // Push teacher names from formInitiationList
    formInitiationList?.forEach((item) => {
      if (item?.section) {
        Sections.push(item?.section);
            }
    });

    // Remove duplicates by creating a Set and then convert back to an array
    return [...new Set(Sections)];
  };

  // Handle filter changes
  const handleFilter = (key, value) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [key]: value };
      return newFilters;
    });
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      className: [],
      section: [],
      teacherID: [],
    });
  };

  // Apply the filters to the data
  const applyFilters = (data) => {
    const { className, section, teacherID } = filters;

    // Filter the data based on teacherID
    const resultData1 = data?.filter((item) => {
      if (teacherID?.length > 0) {
        return teacherID.some((subWord) => {
          return (
            item?.userId?.name?.includes(subWord) ||
            item?.teacherID?.name?.includes(subWord)
          );
        });
      }
      return true; // If no teacherID filter is applied, return all items
    });

    // Filter the data based on className
    const resultData2 = resultData1?.filter((item) => {
      if (className?.length > 0) {
        return className.some((subClass) => item?.className?.includes(subClass));
      }
      return true; // If no className filter is applied, return all items
    });

    // Filter the data based on section
    const resultData3 = resultData2?.filter((item) => {
      if (section?.length > 0) {
        return section.some((subSection) => item?.section?.includes(subSection));
      }
      return true; // If no section filter is applied, return all items
    });

    return resultData3;
  };

  // Add filters to columns dynamically
  const columnsWithFilters = useMemo(() => {
    const uniqueValues = (key, source) => {
      if (key === 'teacherID') {
        return [...new Set(GetTeachersName())].map(
          (value) => ({ text: value, value: value })
        );
      } else if (key === 'className' || key === 'section') {
        return [...new Set(source.flatMap(item => item[key] ? item[key] : []))].map(
          (value) => ({ text: value, value: value })
        );
      } else {
        return [...new Set(source.flatMap(item => item[key] ? item[key].name : item[key]))].map(
          (value) => ({ text: value, value })
        );
      }
    };

    return FormcolumnsForm1.map((column) => {
      if (["className", "section", "teacherID"].includes(column.dataIndex)) {
        const key = column.dataIndex === "teacherID" ? "teacherID" : column.dataIndex;
        return {
          ...column,
          filters: uniqueValues(key, forms),
          onFilter: (value, record) => {
            if (key === "teacherID") {
              return record?.userId?.name === value;
            } else if (key === "className" || key === "section") {
              return record[key] === value;
            } else {
              return record[key] === value;
            }
          },
        };
      }
      return column;
    });
  }, [forms]);

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

            {Role === UserRole[1] && (
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
              <Row >
                <Col  md={2}>
                  <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select Class"
                    value={filters.className}
                    onChange={(value) => handleFilter("className", value)}
                    options={GetClasses().map((className) => ({
                      value: className,
                      label: className,
                    }))}
                  />
                </Col>
                <Col  md={2}>
                  <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select Section"
                    value={filters.section}
                    onChange={(value) => handleFilter("section", value)}
                    options={GetSections().map((section) => ({
                      value: section,
                      label: section,
                    }))}
                  />
                </Col>
                <Col md={2}>
                  <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Select Teacher"
                    value={filters.teacherID}
                    onChange={(value) => handleFilter("teacherID", value)}
                    options={GetTeachersName().map((teacher) => ({
                      value: teacher,
                      label: teacher,
                    }))}
                  />
                </Col>
                <Col md={2}>
                <Button onClick={handleResetFilters} type="default" >
                  Reset Filters
                </Button>
            </Col>
              </Row>
            </div>

            {/* Reset Filters Button */}
         
            {/* Render Tables */}

            {renderTable("Form Initiation", applyFilters(filteredInitiationData))}
            {renderTable("Assigned Forms", applyFilters(filteredData))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FortnightlyMonitor;
