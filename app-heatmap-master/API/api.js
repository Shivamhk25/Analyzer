import React, { useContext, useEffect, useState } from "react";
import { AxiosContext } from "../components/MyProvider";

const DataLoger = () => {
  const { axiosFetch } = useContext(AxiosContext);
  const [browser, setBrowser] = useState([]);
  const [osName, setOsName] = useState([]);
  const [ipInfo, setIpInfo] = useState([]);
  const [pathInfo, setPathInfo] = useState([]);
  const [userActivity, setUserActivity] = useState([]);

  useEffect(() => {
    getBrowser();
    getIpInfo();
    getOsName();
    getUserActivity();
    getPathInfo();
  }, []);

  const getBrowser = async () => {
    const result = await axiosFetch(async (instance) => {
      const response = await instance.get("/store/dashboard/browsers");
      return response;
    });
    setBrowser(result);
    console.log(browser);
  };

  const getOsName = async () => {
    const result = await axiosFetch(async (instance) => {
      const response = await instance.get("/store/get-os-names");
      return response;
    });
    setOsName(result);
    console.log(osName, "hello");
  };
  const getIpInfo = async () => {
    const result = await axiosFetch(async (instance) => {
      const response = await instance.get("/store/get-IpInfo");
      return response;
    });
    setIpInfo(result);
    console.log(ipInfo, "hello");
  };
  const getPathInfo = async () => {
    const result = await axiosFetch(async (instance) => {
      const response = await instance.get("/store/get-pathInfo");
      return response;
    });
    setPathInfo(result);

    console.log(pathInfo, "hello");
  };
  const getUserActivity = async () => {
    const result = await axiosFetch(async (instance) => {
      const response = await instance.get("/store/get-userActivity");
      return response;
    });
    setUserActivity(result);
    console.log(userActivity, "hello");
  };

  return <div>data</div>;
};

export default DataLoger;
