import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Activity,
} from "lucide-react";
import { getRecentActivities, getSingleActivityApi } from "../../redux/Activity/activitySlice";
import { getUserId } from "../../Utils/auth";
import DashboardCard from "../../Components/DashboardCard";
import Skeleton from "react-loading-skeleton";
import { FromDataAuth } from "../../redux/userSlice";

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const [FromOne, setFromOne] = useState('');
  const [FromTwo, setFromTwo] = useState('');
    const [stats, setStats] = useState([]);
    const [stateLoading, setStateLoading] = useState(false);
  const UserId = getUserId()?.id;
  useEffect(() => {
    const payload = {
      id: UserId,
      fromNo: 1,
    }
    const payload2 = {
      id: UserId,
      fromNo: 2,
    }
    dispatch(getRecentActivities());
      dispatch(getSingleActivityApi(payload)).unwrap().then((res) => {
        setFromOne(res?.activities);
      });
      //
      //  
      dispatch(getSingleActivityApi(payload2)).unwrap().then((res) => {
        setFromTwo(res?.activities);
      }
      );

      GetDashbardData();
  }, [dispatch]);


    const GetDashbardData = async () => {
      setStateLoading(true);
   const response = await dispatch(FromDataAuth()).unwrap();
   if(response){
    setStateLoading(false);
    setStats(response);
   }
    }

  const recentEntrySort = (activities) =>{
    if (!activities || activities.length === 0) {
      return null; // Return null if array is empty
    }
    
    return [...activities] // Create a copy to avoid mutating the original array
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0]; // Get the most recent entry
  };

  const recentEntry = recentEntrySort(FromOne);
  const recentEntry2 = recentEntrySort(FromTwo);
  return (
    <div className="flex min-h-screen ">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6">
          <div className="flex mb-3 flex-md-row flex-wrap">
          {stats.map((stat, index) => (
              stateLoading ? 
                <Skeleton  containerClassName="col-md-3 col-sm-6 col-12 px-1 min-h-[100px]" className="h-full"  key={index}  count={1} />  
               :
             <DashboardCard
             index={index}
             stat={stat}
             />
            ))}
          </div>
          {/* <Space size="middle" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap",marginBottom:20 }}>
       
      </Space> */}
          <div className="bg-white rounded-lg ">
            <div className="border-b px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-400" />
                <h3 className="font-medium">Recent Activity</h3>
              </div>
            </div>
            <div className="p-4 hover:bg-gray-50">
                  <div className="flex  items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-50 text-green-600 text-sm font-medium px-2 py-1 rounded">
                      Fortnightly Monitor
                      </span>
                      <span className="text-sm text-gray-500">
                        {recentEntry?.createdAt === recentEntry?.updatedAt ? (
                          <>
                            Created At:{" "}
                            {new Date(recentEntry?.createdAt).toLocaleString()}
                          </>
                        ) : (
                          <>
                            Last Updated:{" "}
                            {new Date(recentEntry?.updatedAt).toLocaleString()}
                          </>
                        )}
                      </span>
                    </div>
                   
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-700">
                      {recentEntry?.teacherMessage}
                      </span>
                    </div>
                  </div>
                </div>
       
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
