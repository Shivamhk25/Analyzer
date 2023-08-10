import React, { useState, useEffect, useContext } from "react";
import Login from "../components/Login_Registration/Login";
import Registration from "../components/Login_Registration/Registration";
import Recordings from "./recordings";
import Analytics from "./analytics";
import Dashboard from "./dashboard";
import HeatmapPage from "./heatmapPage";
import Visitors from "./visitors";
import Settings from "./settings";
import UserInstructions from "../components/UserInstructions";
import Billing from "../components/Billing";
import { getReadInst } from "../API/billingApi";
import { AxiosContext } from "../components/MyProvider";
import Recorder from "./recorder";
import MyLoader from "../components/commonComp/MyLoader";

const Index = () => {
  const { axiosFetch } = useContext(AxiosContext);
  const [readInst, setReadInst] = useState(0);
  // const [readInst, setReadInst] = useState(0);

  const fetchreadInst = async () => {
    try {
      const { data, status } = await getReadInst(axiosFetch);
      console.log(data, "index");
      if (status === 200) {
        // setReadInst(data?.readInst);
        data?.readInst ? setReadInst(2) : setReadInst(1);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchreadInst();
  }, []);

  // FOR READ_INSTRUCTION 3 VALUES WILL BE KEPT 0,1,2
  // 0-> LOADER
  // 1-> READ INSTRUCTION
  // 2-> DASHBOARD

  // return <Login />;
  // return <Recordings />;
  // return <Analytics />;
  // return(
  //   <>
  //     <div style={{ minHeight: "200px" }}>
  //     <MyLoader />
  //     </div>
  //   </>
  // )
  // <MyLoader/>
  // ===================
  return (
    <>
      {readInst === 0 ? (
        <div style={{ minHeight: "200px" }}>
          <MyLoader />
        </div>
      ) : readInst === 1 ? (
        <UserInstructions />
      ) : (
        <Dashboard />
      )}
    </>
  );
  // ====================
  // : ( readInst === 1 ? <UserInstructions/> : <Dashboard/> )
  // return readInst === false ? <UserInstructions /> : <Dashboard />;
  // return <Dashboard />;
  // return <UserInstructions />;
  // return <HeatmapPage />;
  // return <Visitors />;
  // return <Settings />;
  // return <Billing />;
  // return <Recorder id="ADMIN1234"/>
};
//hello
export default Index;
