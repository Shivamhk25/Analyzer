import dynamic from "next/dynamic";
import React, { useState, useEffect, useContext, useRef } from "react";
import { Typography } from "antd";
import { AxiosContext } from "../MyProvider";
import { getLiveVisitors } from "../../API/api2";
const Pie = dynamic(() => import("@ant-design/charts").then(({ Pie }) => Pie), {
  ssr: false,
});
import { useWindowSize } from "../customHooks/ResizeObserver";
import MyLoader from "../commonComp/MyLoader";

const { Title } = Typography;

const LiveVisitors = ({ date }) => {
  const { axiosFetch } = useContext(AxiosContext);
  const [liveVisitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const mapRef = useRef();
  const [size] = useWindowSize(mapRef);
  // console.log(size)
  const data1 = {
    live_users: 30,
    new_users: 10,
  };

  const fetchVisitors = async (body) => {
    try {
      setLoading(true);
      setStatusMsg("");
      setServerStatus(null);
      const { data, status } = await getLiveVisitors(axiosFetch, body);
      console.log(data, "from fetchVisitors");
      setServerStatus(status);
      if (status === 200 && data) {
        let buildData = [
          {
            type: "live users",
            value: data.live_users,
          },
          {
            type: "new users",
            value: data.new_users,
          },
        ];
        setVisitors(buildData);
        setLoading(false);
      }
      if (status !== 200) {
        setStatusMsg(
          "There is some internal server issue.\n Please reload the page or visit some time later."
        );
      }
    } catch (e) {
      console.log(e, e.massage, "error 123");
    }
  };

  useEffect(() => {
    if (date.start && date.end) fetchVisitors(date);
  }, [date]);

  var config = {
    appendPadding:
      size?.width > 450
        ? 50
        : size?.width > 350
        ? 25
        : size?.width > 270
        ? 10
        : 0,
    data: liveVisitors,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value} ",
      style: {
        textAlign: "center",
        fontSize: 16,
      },
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "16px",
        },
        content: `${liveVisitors[0]?.value || "0"} online`,
      },
    },
  };
  // console.log(loading, 'loading')
  return (
    <>
      {loading ? (
        <div style={{ minHeight: "200px" }}>
          <MyLoader />
        </div>
      ) : (
        <div
          ref={mapRef}
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
            <Title
              level={4}
              style={{ color: "#588", fontWeight: 500, paddingLeft: "20px" }}
            >
              Live Visitors Snapshot
            </Title>
          </div>
          <div style={{ marginBottom: "16px" }}>
            <Pie {...config} />
          </div>
        </div>
      )}
      <div>{serverStatus === 200 ? <></> : <div>{statusMsg}</div>}</div>
    </>
  );
};

export default LiveVisitors;
