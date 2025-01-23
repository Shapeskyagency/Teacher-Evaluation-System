import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Spin, Table, Select, DatePicker, Space } from 'antd';
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GetcreatedByUser, GetobserverForms } from '../../redux/Form/noteBookSlice';
import { Formcolumns3 } from '../../Components/Data';
import { getAllTimes, getUserId } from '../../Utils/auth';
import { UserRole } from '../../config/config';
import moment from 'moment';
import { Col, Row } from 'react-bootstrap';

const { Option } = Select;

function Notebook() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, GetForms2 } = useSelector((state) => state?.notebook);
    const CheckData = useSelector((state) => state?.notebook);

    const [sortedForms, setSortedForms] = useState([]);
    const [filters, setFilters] = useState({
        className: [],
        section: [],
        teacherID: [],
        status: [],
        date: [],
        observerName: [],
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
                if (sortType === 'ascend') {
                    return new Date(a?.grenralDetails?.DateOfObservation) - new Date(b?.grenralDetails?.DateOfObservation);
                } else if (sortType === 'descend') {
                    return new Date(b?.grenralDetails?.DateOfObservation) - new Date(a?.grenralDetails?.DateOfObservation);
                } else if (sortType === 'AtoZ') {
                    return a?.grenralDetails?.className.localeCompare(b?.grenralDetails?.className);
                } else if (sortType === 'ZtoA') {
                    return b?.grenralDetails?.className.localeCompare(a?.grenralDetails?.className);
                }
                return 0;
            });
        });

        setSortedForms(sortedData);
    };

    const getUniqueValues = (key) => {
        const values = [];
        sortedForms.forEach((item) => {
            if (key === 'Observer') {
                values.push(item?.grenralDetails?.NameofObserver?.name);
            } else if (key === 'Teaher') {
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
            teacherID: [],
            status: [],
            date: [],
            observerName: [],
        });
    };

    const handleResetSort = () => {
        setSortOrder([]);
        setSortedForms([...GetForms2]);
    };

    const applyFilters = (data) => {
        const { className, section, teacherID, status, date, observerName } = filters;
        return data.filter((item) => {
            const matchesClassName = className.length ? className.includes(item?.grenralDetails?.className) : true;
            const matchesSection = section.length ? section.includes(item?.grenralDetails?.Section) : true;
            const matchesTeacherID = teacherID.length ? teacherID.includes(item?.createdBy?.name) : true;
            const matchesStatus = status.length ? status.includes(item?.isObserverComplete ? "COMPLETED" : "NOT COMPLETED") : true;
            const matchesDate = date.length
                ? date.some((d) => moment(item.grenralDetails?.DateOfObservation).isSame(d, 'day'))
                : true;
            const matchesObserverName = observerName.length ? observerName.includes(item?.observerName) : true;

            return matchesClassName && matchesSection && matchesTeacherID && matchesStatus && matchesDate && matchesObserverName;
        });
    };

    const columnsWithFilters = useMemo(() => {
        const uniqueValues = (key, source) => {
            return [...new Set(source.flatMap((item) => (item[key] ? item[key] : [])))].map((value) => ({
                text: value,
                value: value,
            }));
        };

        return Formcolumns3.map((column) => {
            if (["className", "Section", "Subject", "Teaher", "Observer"].includes(column.key)) {
                return {
                    ...column,
                    onFilter: (value, record) => record.grenralDetails[column.dataIndex] === value,
                };
            }

            return column;
        });
    }, [sortedForms]);

    return (
        <div className="container py-3">
            {isLoading && (
                <div className="LoaderWrapper">
                    <Spin size="large" className="position-absolute" />
                </div>
            )}
            <div className='mb-3' >
                {getUserId().access === UserRole[2] &&
                    <Button
                        onClick={() => navigate('/notebook-checking-proforma/create')}
                        type='primary'
                        icon={<PlusCircleOutlined />}
                        size='large'
                        block
                        style={{ width: 'fit-content' }}
                    >
                        Fill New Form
                    </Button>}
            </div>

            {Role === UserRole[1] && (
                <Button
                    className="mb-3"
                    onClick={() => navigate('/notebook-checking-proforma/form-initiation')}
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    size="large"
                >
                    Form Initiation
                </Button>
            )}

            <div style={{ marginBottom: '20px' }}>
                <Row>
                    {UserRole[1] === getUserId().access &&
                        <Col md={2}>
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
                    <Col md={2}>
                        <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Select Class"
                            value={filters?.className}
                            onChange={(value) => handleFilter("className", value)}
                            options={getClasses().map((className) => ({
                                value: className,
                                label: className,
                            }))}
                        />
                    </Col>
                    <Col md={2}>
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
                    <Col md={2}>
                        <DatePicker
                            style={{ width: "100%" }}
                            placeholder="Select Date"
                            onChange={(date) =>
                                handleFilter("date", date ? [date.format("YYYY-MM-DD")] : [])
                            }
                        />
                    </Col>
                    <Col md={2}>
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
                    <Col md={2}>
                        <Button onClick={handleResetFilters} type="default">
                            Reset Filters
                        </Button>
                    </Col>
                    <Col md={4} className='mt-2'>
                        <Space>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: "200px" }}
                                placeholder="Select Sort Order"
                                value={sortOrder}
                                onChange={handleSort}
                            >
                                <Option value="ascend">Date Ascending</Option>
                                <Option value="descend">Date Descending</Option>
                                <Option value="AtoZ">A to Z</Option>
                                <Option value="ZtoA">Z to A</Option>
                            </Select>
                            <Button onClick={handleResetSort} type="default">
                                Reset Sort
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </div>
                            {console.log(applyFilters(sortedForms))}
            <Table
                columns={columnsWithFilters}
                dataSource={applyFilters(sortedForms)}
                bordered
                scroll={{
                    x: 'max-content', // Makes the table horizontally scrollable for mobile
                }}
                pagination={{
                    pageSize: 5, // Limits rows per page for better mobile UX
                    responsive: true,
                }}
            />
        </div>
    );
}

export default Notebook;