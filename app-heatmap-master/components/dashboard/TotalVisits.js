import dynamic from "next/dynamic";
import React, { useState, useEffect, useContext } from "react";
import { Typography, Button, Menu, Dropdown, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
const Line = dynamic(
  () => import("@ant-design/charts").then(({ Line }) => Line),
  { ssr: false }
);
import { getVisitors, getUniqueVisitors } from "../../API/api2";
import { AxiosContext } from "../MyProvider";
import MyLoader from "../commonComp/MyLoader";

const overlayCount = [
  { value: "Total Visits", idx: 1 },
  { value: "Unique Visits", idx: 2 },
];

const TotalVisits = ({ date }) => {
  const { axiosFetch } = useContext(AxiosContext);
  const [filterType, setFilterType] = useState(overlayCount[0].value);
  const [totalVisitors, setTotalVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchTotalVisitors = async (body, filterType) => {
    // console.log("##selected==>", filterType)
    try {
      // console.log("%%%%",body);
      setLoading(true);
      setStatusMsg("");
      setServerStatus(null);
      let data, status;
      if (filterType === "Total Visits")
        ({ data, status } = await getVisitors(axiosFetch, body));
      else ({ data, status } = await getUniqueVisitors(axiosFetch, body));
      console.log(data, "from fetchTotalVisitors");
      setServerStatus(status);
      if (status === 200 && data?.dataX.length) {
        const { dataX, dataY } = data;
        const buildData = [];
        for (let i = 0; i < dataX.length; i++) {
          let item = {
            xAxis: dataX[i],
            totalVisits: dataY[i],
          };
          buildData.push(item);
        }
        // console.log("$$RESULT=",filterType, "=", buildData)
        setTotalVisitors(buildData);
        setLoading(false);
      }
      if (status !== 200) {
        setStatusMsg(
          "There is some internal server issue.\n Please reload the page or visit some time later."
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (date.start && date.end) {
      fetchTotalVisitors(date, filterType);
      console.log(date, "total visit date ");
    }
  }, [date, filterType]);

  function handleMenuClick(e) {
    message.info(`Showing ${overlayCount[e.key - 1].value} .`);
    setFilterType(overlayCount[e.key - 1].value);
    // console.log(e.key, "click");
  }
  const menu = (
    <Menu onClick={handleMenuClick}>
      {overlayCount.map((item) => (
        <Menu.Item key={item.idx}>{item.value}</Menu.Item>
      ))}
    </Menu>
  );
  const config = {
    data: totalVisitors,
    xField: "xAxis",
    yField: "totalVisits",
    label: {},
    point: {
      size: 5,
      shape: "diamond",
      style: {
        fill: "white",
        stroke: "#5B8FF9",
        lineWidth: 2,
      },
    },
    tooltip: { showMarkers: true },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: "#000",
          fill: "red",
        },
      },
    },
    interactions: [{ type: "marker-active" }],
    slider: {
      start: 0,
      end: 1,
    },
  };
  return (
    <>
      {loading ? (
        <div style={{ minHeight: "200px" }}>
          <MyLoader />
        </div>
      ) : (
        <div
          style={{
            paddingLeft: "10px",
            paddingRight: "12px",
            paddingTop: "16px",
            paddingBottom: "16px",
            boxShadow:
              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <Dropdown overlay={menu}>
              <Button
                style={{
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "black",
                  alignItems: "center",
                }}
              >
                {filterType}{" "}
                <DownOutlined
                  style={{ marginLeft: "15px", marginTop: "-4px" }}
                />
              </Button>
            </Dropdown>
          </div>

          <div style={{ marginBottom: "16px", paddingRight: "6px" }}>
            <Line {...config} />
          </div>
        </div>
      )}
      <div>{serverStatus === 200 ? <></> : <div>{statusMsg}</div>}</div>
    </>
  );
};

export default TotalVisits;
