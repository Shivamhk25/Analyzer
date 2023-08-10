import React, { useState, useEffect, useContext, useRef } from "react";
import { AxiosContext } from "../MyProvider";
import { getLocations } from "../../API/api2";
import { IoLocationSharp } from "react-icons/io5";
import { Typography } from "antd";
import WorldMap from "react-svg-worldmap";
import { useWindowSize } from "../customHooks/ResizeObserver";
import MyLoader from "../commonComp/MyLoader";

const { Title } = Typography;

function Locations({ date }) {
  const { axiosFetch } = useContext(AxiosContext);
  const [locData, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState(200);
  const [statusMsg, setStatusMsg] = useState("");
  const mapRef = useRef();
  const [size] = useWindowSize(mapRef);
  // console.log(size?.width, 'deb12');

  const fetchData = async (body) => {
    try {
      setLoading(true);
      setStatusMsg("");
      setServerStatus(null);
      const { data, status } = await getLocations(axiosFetch, body);
      console.log(data, "fetch loaction");
      setServerStatus(status);
      if (status === 200 && data) {
        setData(data);
        setLoading(false);
      }
      if (status !== 200) {
        setStatusMsg(
          "There is some internal server issue.\n Please reload the page or visit some time later."
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (date.start && date.end) {
      fetchData(date);
    }
  }, [date]);
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
              Locations
            </Title>
          </div>
          <div style={{ marginBottom: "16px" }} className="mapBox">
            <WorldMap
              strokeOpacity={0.4}
              color="#3aa8fc"
              value-suffix="people"
              size={size?.width - 20 || 450}
              data={locData}
            />
          </div>
        </div>
      )}
      <div>{serverStatus === 200 ? <></> : <div>{statusMsg}</div>}</div>
    </>
  );
}

export default Locations;
