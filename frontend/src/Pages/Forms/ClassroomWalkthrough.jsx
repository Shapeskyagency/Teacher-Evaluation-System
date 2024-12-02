import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Spin, Table } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetcreatedBy } from "../../redux/Form/classroomWalkthroughSlice";
import { Formcolumns1 } from "../../Components/Data";
import { getUserId } from "../../Utils/auth";
import { UserRole } from "../../config/config";

function ClassroomWalkthrough() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, GetForms } = useSelector((state) => state?.walkThroughForm);

  useEffect(() => {
    dispatch(GetcreatedBy()).then((res) => {
      console.log(res?.payload);
    });
  }, [dispatch]);

  return (
    <div className="container py-4">
      {isLoading && (
        <div className="LoaderWrapper">
          <Spin size="large" className="position-absolute" />
        </div>
      )}
      <div style={{ padding: "16px" }}>
        {getUserId().access === UserRole[1] ?
         <Button
         onClick={() => navigate("/classroom-walkthrough/create")}
         type="primary"
         icon={<PlusCircleOutlined />}
         size="large"
         block // Makes the button responsive and full-width on smaller screens
         style={{ marginBottom: "16px",width:"fit-content" }} // Adds spacing below the button
       >
         Fill New Form
       </Button>
        :
        <><h2 className="mb-4">Classroom Walkthrough </h2></>
        }
       
        <Table
          columns={Formcolumns1}
          dataSource={GetForms}
          bordered
          scroll={{
            x: "max-content", // Makes the table horizontally scrollable for mobile
          }}
          pagination={{
            pageSize: 5, // Limits rows per page for better mobile UX
            responsive: true,
          }}
        />
      </div>
    </div>
  );
}

export default ClassroomWalkthrough;
