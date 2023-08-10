import React, { useState, useEffect, useCallback, useContext } from "react";
import { AxiosContext } from "../MyProvider";
import { getPages } from "../../API/api2";
import { Typography, Row, Col } from "antd";
import { Badge, Card } from "antd";
import MyLoader from "../commonComp/MyLoader";

const { Title } = Typography;
const rowdata = [
  { name: "chrome", value: 45 },
  { name: "chrome", value: 45 },
  { name: "chrome", value: 45 },
  { name: "chrome", value: 45 },
  { name: "chrome", value: 45 },
];

const data1 = [
  { url: "first-app25.myshopify.com/pages/contact" },
  { url: "first-app25.myshopify.com/collections/all" },
  { url: "first-app25.myshopify.com/collections/all?gsdg" },
  { url: "first-app25.myshopify.com/collections/all" },
];

const TopPages = ({ date }) => {
  const { axiosFetch } = useContext(AxiosContext);
  const [topPages, setTopPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchTopPages = async (body) => {
    try {
      setLoading(true);
      setStatusMsg("");
      setServerStatus(null);
      const { data, status } = await getPages(axiosFetch, body);
      console.log(data, "fetchTopPages");
      setServerStatus(status);
      if (status === 200) {
        // data.sort((a,b)=>{
        //   return (a.value >= b.value)
        // })
        // console.log("@@",data)
        setTopPages(data);
        // setTopPages(rowdata);
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
      fetchTopPages(date);
    }
  }, [date]);

  // const newURL = topPages?.map((item, idx) => {
  //   return item.name.split("?")[0];
  // });

  // var uniquePages = [...new Set(newURL)];

  const pages = topPages?.map((item, idx) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "4px 6px",
        borderRadious: "6px",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      }}
      key={idx}
    >
      <div style={{ padding: "6px 2px" }}>
        <Badge.Ribbon
          text={`#${idx + 1}`}
          placement="start"
          style={{ marginTop: "6px" }}
        >
          <Card title="" size="small" style={{ paddingLeft: "20px" }}>
            <Title level={5} style={{ color: "#777" }}>
              {item.name}
            </Title>
          </Card>
        </Badge.Ribbon>
      </div>
      <div style={{ padding: "6px 2px" }}>
        <Title level={5} style={{ color: "#588" }}>
          {`${item.value}%`}
        </Title>
      </div>
    </div>
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
              Top Pages
            </Title>
          </div>
          <div style={{ marginBottom: "16px" }}>
            {topPages.length ? (
              pages
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                  color: "#555",
                }}
              >
                OPPS! there is no top pages
              </div>
            )}
          </div>
        </div>
      )}
      <div>{serverStatus === 200 ? <></> : <div>{statusMsg}</div>}</div>
    </>
  );
};

export default TopPages;
