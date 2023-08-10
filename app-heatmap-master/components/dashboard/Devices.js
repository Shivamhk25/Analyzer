import React, { useState, useEffect, useCallback, useContext } from "react";
import { AxiosContext } from "../MyProvider";
import { Typography, Row, Col, Progress, Tooltip } from "antd";
import { getDevices } from "../../API/api2";
import MyLoader from "../commonComp/MyLoader";

const { Title, Paragraph } = Typography;
const rawdata = [
  { name: "Window OS", value: 80 },
  { name: "Mac OS", value: 20 },
];

const Devices = ({ date }) => {
  const { axiosFetch } = useContext(AxiosContext);
  const [topDevices, setTopDevices] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchTopDevices = async (body) => {
    try {
      setLoading(true);
      setStatusMsg("");
      setServerStatus(null);
      const { data, status } = await getDevices(axiosFetch, body);
      console.log(data, "fetchTopDevices");
      setServerStatus(status);
      if (status === 200) {
        setTopDevices(data);
        // setTopDevices(rawdata);
        let totalVal = 0;
        data.forEach((element) => {
          console.log(element);
          totalVal += element?.value;
        });
        setTotalValue(totalVal);
        setLoading(false);
      } else {
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
      fetchTopDevices(date);
    }
  }, [date]);
  const getPercentage = (value, tValue = totalValue || 1) => {
    let parcen = (value / tValue) * 100;
    let roundParcentage = Math.round(parcen * 100) / 100;
    return roundParcentage;
  };

  const devices = topDevices?.map((item, idx) => (
    <Row gutter={[16, 18]} key={idx}>
      <Col span={6}>
        <Paragraph style={{ color: "#555", paddingLeft: "5px" }}>
          {item.name}
        </Paragraph>
      </Col>
      <Col span={18}>
        <Tooltip title={`${item.name}: ${item.value} `}>
          <Progress
            percent={item.value}
            status="active"
            trailColor="#DFD7F1"
            strokeColor={{
              from: "#fc9860",
              to: "#F7CE68",
              direction: "180deg",
            }}
            strokeWidth={10}
          />
        </Tooltip>
      </Col>
    </Row>
  ));

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
            paddingRight: "24px",
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
              Devices
            </Title>
          </div>
          <div style={{ marginBottom: "16px", marginTop: "36px" }}>
            {topDevices.length ? (
              devices
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                  color: "#555",
                }}
              >
                OPPS! there is no device data found.
              </div>
            )}
          </div>
        </div>
      )}
      <div>{serverStatus === 200 ? <></> : <div>{statusMsg}</div>}</div>
    </>
  );
};

export default Devices;
