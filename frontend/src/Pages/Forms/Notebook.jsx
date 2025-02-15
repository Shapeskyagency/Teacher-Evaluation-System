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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, GetForms2 } = useSelector((state) => state?.notebook);
  const CheckData = useSelector((state) => state?.notebook);

  const [sortedForms, setSortedForms] = useState([]);
  const [filters, setFilters] = useState({
    observerName: [],
    teacherID: [],
    className: [],
    section: [],
    subject: [],
    date: [],
    status: [],
    observerStatus: [],
    teacherStatus: [],
  });
  const [sortOrder, setSortOrder] = useState([]); // State for sort order
  const Role = getUserId().access;

  useEffect(() => {
    if (Role === UserRole[1]) {
      dispatch(GetobserverForms());
    } else {
      dispatch(GetcreatedByUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(GetForms2)) {
      const sortedData = [...GetForms2].sort((a, b) => {
        if (a.isObserverComplete === b.isObserverComplete) {
          return 0; // No change in order if both are the same
        }
        return a.isObserverComplete ? 1 : -1; // Place `false` first
      });
      setSortedForms(sortedData);
    }
  }, [GetForms2]);

  const handleSort = (order) => {
    setSortOrder(order);
    let sortedData = [...sortedForms];

    order?.forEach((sortType) => {
      sortedData = sortedData?.sort((a, b) => {
        if (sortType === "ascend") {
          return (
            new Date(a?.grenralDetails?.DateOfObservation) -
            new Date(b?.grenralDetails?.DateOfObservation)
          );
        } else if (sortType === "descend") {
          return (
            new Date(b?.grenralDetails?.DateOfObservation) -
            new Date(a?.grenralDetails?.DateOfObservation)
          );
        } else if (sortType === "AtoZ") {
          return a?.grenralDetails?.className.localeCompare(
            b?.grenralDetails?.className
          );
        } else if (sortType === "ZtoA") {
          return b?.grenralDetails?.className.localeCompare(
            a?.grenralDetails?.className
          );
        }
        return 0;
      });
    });

    setSortedForms(sortedData);
  };

  const getUniqueValues = (key) => {
    const values = [];
    sortedForms.forEach((item) => {
      if (key === "Observer") {
        values.push(item?.grenralDetails?.NameofObserver?.name);
      } else if (key === "Teaher") {
        values.push(item?.createdBy?.name);
      } else {
        if (item?.grenralDetails[key]) {
          values.push(item?.grenralDetails[key]);
        }
      }
    });
    return [...new Set(values)];
  };

  const getTeachersNames = () => getUniqueValues("Teaher");
  const getClasses = () => getUniqueValues("className");
  const getSections = () => getUniqueValues("Section");
  const getSubject = () => getUniqueValues("Subject");
  const getObserverNames = () => getUniqueValues("Observer");

  const handleFilter = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      className: [],
      section: [],
      subject: [],
      teacherID: [],
      status: [],
      date: [],
      observerName: [],
      observerStatus: [],
      teacherStatus: [],
    });
  };

  const handleResetSort = () => {
    setSortOrder([]);
    setSortedForms([...GetForms2]);
  };

  const applyFilters = (data) => {
    const {
      className,
      section,
      subject,
      teacherID,
      status,
      date,
      observerName,
      matchesteacherStatus,
      matchesobserverStatus,
    } = filters;
    return data.filter((item) => {
      const matchesClassName = className.length
        ? className.includes(item?.grenralDetails?.className)
        : true;
      const matchesSection = section.length
        ? section.includes(item?.grenralDetails?.Section)
        : true;
      const matchesSubject = subject.length
        ? subject.includes(item?.grenralDetails?.Subject)
        : true;
      const matchesTeacherID = teacherID.length
        ? teacherID.includes(item?.createdBy?.name)
        : true;
      const matchesStatus = status.length
        ? status.includes(
            item?.isObserverComplete ? "COMPLETED" : "NOT COMPLETED"
          )
        : true;
        const matchesteacherStatus = status.length
        ? status.includes(
            item?.isTeacherComplete ? "COMPLETED" : "NOT COMPLETED"
          )
        : true;
        const matchesobserverStatus = status.length
        ? status.includes(
            item?.isObserverComplete ? "COMPLETED" : "NOT COMPLETED"
          )
        : true;
      const matchesDate = date.length
        ? date.some((d) =>
            moment(item.grenralDetails?.DateOfObservation).isSame(d, "day")
          )
        : true;
      const matchesObserverName = observerName.length
        ? observerName.includes(item?.observerName)
        : true;

      return (
        matchesClassName &&
        matchesSection &&
        matchesSubject &&
        matchesTeacherID &&
        matchesStatus &&
        matchesDate &&
        matchesObserverName &&
        matchesteacherStatus &&
        matchesobserverStatus
      );
    });
  };

  const columnsWithFilters = useMemo(() => {
    const uniqueValues = (key, source) => {
      return [
        ...new Set(source.flatMap((item) => (item[key] ? item[key] : []))),
      ].map((value) => ({
        text: value,
        value: value,
      }));
    };

    return Formcolumns3.map((column) => {
      if (
        ["className", "Section", "Subject", "Teaher", "Observer"].includes(
          column.key
        )
      ) {
        return {
          ...column,
          onFilter: (value, record) =>
            record.grenralDetails[column.dataIndex] === value,
        };
      }

      return column;
    });
  }, [sortedForms]);

  return (
    <div className="container">
      {isLoading && (
        <div className="LoaderWrapper">
          <Spin size="large" className="position-absolute" />
        </div>
      )}
      <div className="mb-3">
        {getUserId().access === UserRole[2] && (
          <Button
            onClick={() => navigate("/notebook-checking-proforma/create")}
            type="primary"
            icon={<PlusCircleOutlined />}
            size="large"
            block
            style={{ width: "fit-content" }}
          >
            Fill New Form
          </Button>
        )}
      </div>

      {Role === UserRole[1] && (
        <Button
          className="mb-3"
          onClick={() =>
            navigate("/notebook-checking-proforma/form-initiation")
          }
          type="primary"
          icon={<PlusCircleOutlined />}
          size="large"
        >
          Form Initiation 666
        </Button>
      )}

      {/* <div style={{ marginBottom: '20px' }}>
                <Row>
                    {UserRole[1] === getUserId().access &&
                        <Col md={2}>
                            <Select
                                mode="multiple"
                                allowClear
                                showSearch
                                style={{ width: "80%" }}
                                placeholder="Select Teacher"
                                value={filters.teacherID}
                                onChange={(value) => handleFilter("teacherID", value)}
                                options={getTeachersNames().map((teacher) => ({
                                    value: teacher,
                                    label: teacher,
                                }))}
                            />
                        </Col>
                    }
                    {UserRole[2] === getUserId().access &&
                        <Col md={2}>
                            <Select
                                mode="multiple"
                                allowClear
                                showSearch
                                style={{ width: "100%" }}
                                placeholder="Select Observer"
                                value={filters.observerName}
                                onChange={(value) => handleFilter("observerName", value)}
                                options={getObserverNames().map((observer) => ({
                                    value: observer,
                                    label: observer,
                                }))}
                            />
                        </Col>
                    }
                    <Col md={2} className="mb-2 mt-2 mb-md-0 mt-md-0">
                        <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            style={{ width: "80%" }}
                            placeholder="Select Class"
                            value={filters?.className}
                            onChange={(value) => handleFilter("className", value)}
                            options={getClasses().map((className) => ({
                                value: className,
                                label: className,
                            }))}
                        />
                    </Col>
                    <Col md={2} className="mb-2 mb-md-0 mt-md-0">
                        <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            style={{ width: "80%" }}
                            placeholder="Select Section"
                            value={filters.section}
                            onChange={(value) => handleFilter("section", value)}
                            options={getSections().map((section) => ({
                                value: section,
                                label: section,
                            }))}
                        />
                    </Col>
                    <Col md={2} className="mb-2 mb-md-0 mt-md-0">
                        <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            style={{ width: "80%" }}
                            placeholder="Select Subject"
                            value={filters.subject}
                            onChange={(value) => handleFilter("subject", value)}
                            options={getSubject().map((subject) => ({
                                value: subject,
                                label: subject,
                            }))}
                        />
                    </Col>
                    <Col md={2}>
                        <DatePicker
                            style={{ width: "80%" }}
                            placeholder="Select Date"
                            onChange={(date) =>
                                handleFilter("date", date ? [date.format("YYYY-MM-DD")] : [])
                            }
                        />
                    </Col>
                    <Col md={2} className="p-0">
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: "80%" }}
                            placeholder="Select Status"
                            value={filters.status}
                            onChange={(value) => handleFilter("status", value)}
                            options={[
                                { value: "COMPLETED", label: "Completed" },
                                { value: "NOT COMPLETED", label: "Not Completed" },
                            ]}
                        />
                    </Col>
                    <Col md={2}>
                        <Button onClick={handleResetFilters} type="default">
                            Reset Filters
                        </Button>
                    </Col>
                </Row>
            </div> */}

      <div className="mb-3">
        <div className="flex flex-wrap gap-4">
          {UserRole[1] === getUserId().access && (
            <Select
              mode="multiple"
              allowClear
              showSearch
              className="w-35"
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
              className="w-35"
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
            className="w-35"
            placeholder="Select Class"
            value={filters?.className}
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
            className="w-35"
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
            className="w-35"
            placeholder="Select Subject"
            value={filters.subject}
            onChange={(value) => handleFilter("subject", value)}
            options={getSubject().map((subject) => ({
              value: subject,
              label: subject,
            }))}
          />
          <DatePicker
            className="w-35"
            placeholder="Select Date"
            onChange={(date) =>
              handleFilter("date", date ? [date.format("YYYY-MM-DD")] : [])
            }
          />
          <Select
            mode="multiple"
            allowClear
            className="w-48"
            placeholder="Select Status"
            value={filters.status}
            onChange={(value) => handleFilter("status", value)}
            options={[
              { value: "COMPLETED", label: "Completed" },
              { value: "NOT COMPLETED", label: "Not Completed" },
            ]}
          />
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Teacher Status"
            value={filters.teacherStatus}
            onChange={(value) => handleFilter(value, "teacherStatus")}
          >
            <Option value={true}>Complete</Option>
            <Option value={false}>Incomplete</Option>
          </Select>

          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Observer Status"
            value={filters.observerStatus}
            onChange={(value) => handleFilter(value, "observerStatus")}
          >
            <Option value={true}>Complete</Option>
            <Option value={false}>Incomplete</Option>
          </Select>
          <Button onClick={handleResetFilters} type="default" className="w-35">
            Reset Filters
          </Button>
        </div>
      </div>

      {console.log(applyFilters(sortedForms))}
      <Table
        columns={columnsWithFilters}
        dataSource={applyFilters(sortedForms)}
        pagination={false}
      />
    </div>
  );
}

export default Notebook;
