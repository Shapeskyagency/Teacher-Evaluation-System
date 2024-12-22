import React, { useEffect, useState, useCallback } from "react";
import { Table, Checkbox, DatePicker, Button, Form, Steps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { GetObserverFormsOne } from "../../../redux/Form/fortnightlySlice";
import { getAllTimes } from "../../../Utils/auth";
import moment from "moment";
import { GetcreatedBy, TeacherwalkthroughForms } from "../../../redux/Form/classroomWalkthroughSlice";
import { GetobserverForms } from "../../../redux/Form/noteBookSlice";

export default function FinalReport() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [currStep, setCurrStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState({
    Fortnightly_Monitor: { week1: [], week2: [], week3: [], week4: [] },
    Classroom_Walkthrough: { week1: [], week2: [], week3: [], week4: [] },
    Notebook_Checking: { week1: [], week2: [], week3: [], week4: [] },
  });
  const [filteredForms, setFilteredForms] = useState({
    Fortnightly_Monitor: { week1: [], week2: [], week3: [], week4: [] },
    Classroom_Walkthrough: { week1: [], week2: [], week3: [], week4: [] },
    Notebook_Checking: { week1: [], week2: [], week3: [], week4: [] },
  });
  const [startDate, setStartDate] = useState(null);

  const forms = useSelector((state) => state?.Forms?.getAllForms || []); // Fortnightly_Monitor data
  const { isLoading, GetForms } = useSelector((state) => state?.walkThroughForm); // Classroom_Walkthrough data
  const { isLoading2, GetForms2 } = useSelector((state) => state?.notebook); // notebook data


  useEffect(() => {
    dispatch(GetObserverFormsOne());
    dispatch(GetcreatedBy());
    dispatch(GetobserverForms());
  }, [dispatch]);

  const getWeeksForMonth = useCallback((date) => {
    const startOfMonth = moment(date).startOf("month");
    const endOfMonth = moment(date).endOf("month");
    const weeks = [];
    let currentWeekStart = startOfMonth.clone().startOf("week");

    while (currentWeekStart.isBefore(endOfMonth)) {
      const weekStart = currentWeekStart.clone();
      const weekEnd = currentWeekStart.clone().endOf("week");
      weeks.push({
        weekStart: weekStart.isSameOrAfter(startOfMonth)
          ? weekStart.format("YYYY-MM-DD")
          : startOfMonth.format("YYYY-MM-DD"),
        weekEnd: weekEnd.isSameOrBefore(endOfMonth)
          ? weekEnd.format("YYYY-MM-DD")
          : endOfMonth.format("YYYY-MM-DD"),
      });
      currentWeekStart.add(1, "week");
    }

    return weeks.slice(0, 4); // Ensure only 4 weeks are returned
  }, []);

  const filterFormsByWeeks = useCallback((date) => {
    const weeks = getWeeksForMonth(date);
    const filtered = {
      Fortnightly_Monitor: { week1: [], week2: [], week3: [], week4: [] },
      Classroom_Walkthrough: { week1: [], week2: [], week3: [], week4: [] },
      Notebook_Checking: { week1: [], week2: [], week3: [], week4: [] },
    };

    const selectedMonth = moment(date).month();
    const selectedYear = moment(date).year();

    const filterCategoryForms = (forms, category) => {
      forms.forEach((form) => {
        const formDate = moment(form.date);
        const formMonth = formDate.month();
        const formYear = formDate.year();

        if (formMonth === selectedMonth && formYear === selectedYear) {
          weeks.forEach((week, index) => {
            if (formDate.isSameOrAfter(week.weekStart) && formDate.isSameOrBefore(week.weekEnd)) {
              filtered[category][`week${index + 1}`].push(form);
            }
          });
        }
      });
    };

    filterCategoryForms(forms, "Fortnightly_Monitor");
    filterCategoryForms(GetForms, "Classroom_Walkthrough");
    filterCategoryForms(GetForms2, "Notebook_Checking");

    setFilteredForms(filtered);
  }, [forms, GetForms, GetForms2, getWeeksForMonth]);

  const handleCheckboxChange = (checked, weekKey, record, category) => {
    setSelectedItems((prev) => {
      const updatedWeek = checked
        ? [...prev[category][weekKey], record._id]
        : prev[category][weekKey].filter((id) => id !== record._id);

      return {
        ...prev,
        [category]: {
          ...prev[category],
          [weekKey]: updatedWeek,
        },
      };
    });
  };

  const GetData = () => {
    const values = form.getFieldsValue();
    
  };

  const columns = useCallback((weekKey, category) => [
    {
      title: "Class / Section",
      dataIndex: "classAndSection",
      key: "classAndSection",
      render: (_, record) => {
        const recordMonth = getAllTimes(record.date).month;
        return recordMonth === startDate ? (
          <>
            {category === "Fortnightly_Monitor" && <>{record.className} / {record.section}</>}
            {category === "Classroom_Walkthrough" && <>{record.grenralDetails.className} / {record.grenralDetails.Section}</>}
          </>
        ) : null;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (_, record) => {
        const recordMonth = getAllTimes(record.date).month;
        return recordMonth === startDate ? (
          <>
            {category === "Fortnightly_Monitor" && getAllTimes(record.date)?.formattedDate2}
            {category === "Classroom_Walkthrough" && getAllTimes(record.grenralDetails.DateOfObservation)?.formattedDate2}
            {category === "Notebook_Checking" && getAllTimes(record.date)?.formattedDate2}
          </>
        ) : null;
      },
    },
    {
      title: "Select",
      dataIndex: "select",
      key: "select",
      render: (_, record) => {
        const recordMonth = getAllTimes(record.date).month;
        return recordMonth === startDate ? (
          <Checkbox
            checked={selectedItems[category][weekKey].includes(record._id)}
            onChange={(e) =>
              handleCheckboxChange(e.target.checked, weekKey, record, category)
            }
          />
        ) : null;
      },
    },
  ], [startDate, selectedItems]);

  const handleDateChange = (date) => {
    setStartDate(getAllTimes(date).month);
    filterFormsByWeeks(date);
  };

  return (
    <>
      <Form form={form} onFinish={GetData}>
        <Form.Item name="StartDate" label="Start Date">
          <DatePicker onChange={handleDateChange} />
        </Form.Item>

        <Steps
          size="small"
          current={currStep}
          items={[
            { title: "Fortnightly Monitor" },
            { title: "Classroom Walkthrough" },
            { title: "Review & Submit" },
          ]}
        />

        {currStep === 0 && (
          <>
            <h3 className="mt-3">Fortnightly Monitor Weekly Selection</h3>
            {["week1", "week2", "week3", "week4"].map((weekKey) => (
              <Table
                key={weekKey}
                columns={columns(weekKey, "Fortnightly_Monitor")}
                dataSource={filteredForms.Fortnightly_Monitor[weekKey]}
                rowKey="_id"
                pagination={false}
                bordered
              />
            ))}
          </>
        )}

        {currStep === 1 && (
          <>
            <h3 className="mt-3">Classroom Walkthrough Weekly Selection</h3>
            {["week1", "week2", "week3", "week4"].map((weekKey) => (
              <Table
                key={weekKey}
                columns={columns(weekKey, "Classroom_Walkthrough")}
                dataSource={filteredForms.Classroom_Walkthrough[weekKey]}
                rowKey="_id"
                pagination={false}
                bordered
              />
            ))}
          </>
        )}
   {currStep !== 3 && (
          <Button type="primary" onClick={()=>setCurrStep(currStep + 1)}>
            Next
          </Button>
        )}
        {currStep === 2 && (
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        )}
      </Form>
    </>
  );
}
