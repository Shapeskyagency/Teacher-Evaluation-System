import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Spin, Table, Select, DatePicker, Space } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  GetcreatedBy,
  TeacherwalkthroughForms,
} from "../../redux/Form/classroomWalkthroughSlice";
import { Formcolumns1 } from "../../Components/Data";
import { getUserId } from "../../Utils/auth";
import { UserRole } from "../../config/config";
import moment from "moment";
import { Col, Row } from "react-bootstrap";

function ClassroomWalkthrough() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, GetForms } = useSelector(
    (state) => state?.walkThroughForm
  );
  const Role = getUserId().access;
  const [sortedForms, setSortedForms] = useState([]);
  const [filters, setFilters] = useState({
    className: [],
    section: [],
    subject: [],
    teacherID: [],
    status: [],
    date: [],
    observerName: [],
    Observerstatus: [],
  });

  useEffect(() => {
    if (Role === UserRole[2]) {
      dispatch(TeacherwalkthroughForms());
    } else if (Role === UserRole[1]) {
      dispatch(GetcreatedBy());
    }
  }, [dispatch, Role]);

  useEffect(() => {
    if (Array.isArray(GetForms)) {
      const sortedData = [...GetForms].sort((a, b) => {
        if (a.isTeacherCompletes === b.isTeacherCompletes) {
          return 0; // No change in order if both are the same
        }
        return a.isTeacherCompletes ? 1 : -1; // Place `false` first
      });
      setSortedForms(sortedData);
    }
  }, [GetForms]);

  // Get unique values for filters
  const getUniqueValues = (key) => {
    const values = [];
    GetForms?.forEach((item) => {
      if (key === "NameoftheVisitingTeacher") {
        values.push(item.grenralDetails[key].name);
      } else if (key === "createdBy") {
        values.push(item[key].name);
      } else {
        if (item?.grenralDetails[key]) {
          values.push(item.grenralDetails[key]);
        }
      }
    });
    return [...new Set(values)];
  };

  const getTeachersNames = () => getUniqueValues("NameoftheVisitingTeacher");
  const getClasses = () => getUniqueValues("className");
  const getSections = () => getUniqueValues("Section");
  const getSubject = () => getUniqueValues("Subject");
  const getObserverNames = () => getUniqueValues("createdBy");

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
      subject: [],
      teacherID: [],
      status: [],
      date: [],
      Observerstatus: [],
      observerName: [],
    });
  };

  // Apply the filters to the data
  const applyFilters = (data) => {
    const {
      className,
      section,
      subject,
      teacherID,
      status,
      Observerstatus,
      date,
      observerName,
    } = filters;
    return data.filter((item) => {
      const matchesClassName = className.length
        ? className.includes(item.grenralDetails.className)
        : true;
      const matchesSection = section.length
        ? section.includes(item.grenralDetails.Section)
        : true;
      const matchesSubject = subject.length
        ? subject.includes(item.grenralDetails.Subject)
        : true;
      const matchesTeacherID = teacherID.length
        ? teacherID.includes(item.grenralDetails.NameoftheVisitingTeacher.name)
        : true;
      const matchesStatus = status.length
        ? status.includes(
            item.isTeacherCompletes ? "COMPLETED" : "NOT COMPLETED"
          )
        : true;
      const matchesObserverStatus = Observerstatus.length
        ? Observerstatus.includes(
            item.isObserverCompleted ? "COMPLETED" : "NOT COMPLETED"
          )
        : true;
      const matchesDate = date.length
        ? date.some((d) =>
            moment(item.grenralDetails.DateOfObservation).isSame(d, "day")
          )
        : true;
      const matchesObserverName = observerName.length
        ? observerName.includes(item.createdBy.name)
        : true;

      return (
        matchesClassName &&
        matchesSubject &&
        matchesObserverStatus &&
        matchesSection &&
        matchesTeacherID &&
        matchesStatus &&
        matchesDate &&
        matchesObserverName
      );
    });
  };

  const columnsWithFilters = useMemo(() => {
    const uniqueValues = (key, source) => {
      return [
        ...new Set(source.flatMap((item) => (item[key] ? item[key] : []))),
      ].map((value) => ({ text: value, value: value }));
    };

    return Formcolumns1.map((column) => {
      if (
        [
          "className",
          "Section",
          "NameoftheVisitingTeacher",
          "createdBy",
        ].includes(column.dataIndex)
      ) {
        return {
          ...column,
          filters: uniqueValues(column.dataIndex, GetForms),
          onFilter: (value, record) => {
            if (column.dataIndex === "NameoftheVisitingTeacher") {
              return (
                record.grenralDetails.NameoftheVisitingTeacher.name === value
              );
            } else if (column.dataIndex === "createdBy") {
              return record.createdBy.name === value;
            } else {
              return record.grenralDetails[column.dataIndex] === value;
            }
          },
          sorter: (a, b) => {
            if (column.dataIndex === "NameoftheVisitingTeacher") {
              return a.grenralDetails.NameoftheVisitingTeacher.name.localeCompare(
                b.grenralDetails.NameoftheVisitingTeacher.name
              );
            } else if (column.dataIndex === "createdBy") {
              return a.createdBy.name.localeCompare(b.createdBy.name);
            } else {
              return a.grenralDetails[column.dataIndex]?.localeCompare(
                b.grenralDetails[column.dataIndex]
              );
            }
          },
          sortDirections: ["ascend", "descend"],
        };
      }
      if (column.dataIndex === "DateOfObservation") {
        return {
          ...column,
          sorter: (a, b) =>
            new Date(a.grenralDetails.DateOfObservation) -
            new Date(b.grenralDetails.DateOfObservation),
          sortDirections: ["ascend", "descend"],
        };
      }
      if (column.dataIndex === "isTeacherCompletes") {
        return {
          ...column,
          onFilter: (value, record) =>
            (record.isTeacherCompletes ? "COMPLETED" : "NOT COMPLETED") ===
            value,
          sorter: (a, b) => a.isTeacherCompletes - b.isTeacherCompletes,
          sortDirections: ["ascend", "descend"],
        };
      }

      return column;
    });
  }, [GetForms]);

  return (
    <div className="container">
      {isLoading && (
        <div className="LoaderWrapper">
          <Spin size="large" className="position-absolute" />
        </div>
      )}
      <div style={{ padding: "16px" }}>
        {Role === UserRole[1] ? (
          <Button
            onClick={() => navigate("/classroom-walkthrough/create")}
            type="primary"
            icon={<PlusCircleOutlined />}
            size="large"
            block // Makes the button responsive and full-width on smaller screens
            style={{ marginBottom: "16px", width: "fit-content" }} // Adds spacing below the button
          >
            Fill New Form
          </Button>
        ) : (
          <h2 className="mb-4">Classroom Walkthrough</h2>
        )}

        {/* Filter Options - Searchable Multi-Select */}
        <div className="mb-3 d-flex flex-wrap align-items-center gap-2">
          {UserRole[1] === getUserId().access && (
            <Select
              mode="multiple"
              allowClear
              showSearch
              style={{ width: "140px" }}
              placeholder="Select Teacher"
              value={filters.teacherID}
              onChange={(value) => handleFilter("teacherID", value)}
              options={getTeachersNames().map((teacher) => ({
                value: teacher,
                label: teacher,
              }))}
            />
          )}

          {UserRole[2] === getUserId().access && (
            <Select
              mode="multiple"
              allowClear
              showSearch
              style={{ width: "140px" }}
              placeholder="Select Observer"
              value={filters.observerName}
              onChange={(value) => handleFilter("observerName", value)}
              options={getObserverNames().map((observer) => ({
                value: observer,
                label: observer,
              }))}
            />
          )}

          <Select
            mode="multiple"
            allowClear
            showSearch
            style={{ width: "140px" }}
            placeholder="Select Class"
            value={filters.className}
            onChange={(value) => handleFilter("className", value)}
            options={getClasses().map((className) => ({
              value: className,
              label: className,
            }))}
          />

          <Select
            mode="multiple"
            allowClear
            showSearch
            style={{ width: "140px" }}
            placeholder="Select Section"
            value={filters.section}
            onChange={(value) => handleFilter("section", value)}
            options={getSections().map((section) => ({
              value: section,
              label: section,
            }))}
          />

          <Select
            mode="multiple"
            allowClear
            showSearch
            style={{ width: "140px" }}
            placeholder="Select Subject"
            value={filters.subject}
            onChange={(value) => handleFilter("subject", value)}
            options={getSubject().map((subject) => ({
              value: subject,
              label: subject,
            }))}
          />

          <DatePicker
            style={{ width: "140px" }}
            placeholder="Select Date"
            onChange={(date) =>
              handleFilter("date", date ? [date.format("YYYY-MM-DD")] : [])
            }
          />

          <Select
            mode="multiple"
            allowClear
            style={{ width: "140px" }}
            placeholder="Teacher Status"
            value={filters.status}
            onChange={(value) => handleFilter("status", value)}
            options={[
              { value: "COMPLETED", label: "Completed" },
              { value: "NOT COMPLETED", label: "Not Completed" },
            ]}
          />

          <Select
            mode="multiple"
            allowClear
            style={{ width: "150px" }}
            placeholder="Observer Status"
            value={filters.Observerstatus}
            onChange={(value) => handleFilter("Observerstatus", value)}
            options={[
              { value: "COMPLETED", label: "Completed" },
              { value: "NOT COMPLETED", label: "Not Completed" },
            ]}
          />

          <Button onClick={handleResetFilters} type="default">
            Reset Filters
          </Button>
        </div>

        {/* <Table
          columns={columnsWithFilters}
          dataSource={applyFilters(sortedForms)}
          bordered
          scroll={{
            x: "max-content", // Makes the table horizontally scrollable for mobile
          }}
          pagination={{
            pageSize: 5, // Limits rows per page for better mobile UX
            responsive: true,
          }}
        /> */}

        <Table
          columns={columnsWithFilters}
          dataSource={applyFilters(sortedForms)}
          pagination={false}
          rowKey="_id"
        />
      </div>
    </div>
  );
}

export default ClassroomWalkthrough;
