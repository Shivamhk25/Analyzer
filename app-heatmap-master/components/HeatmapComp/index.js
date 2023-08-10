import React, { useState, useEffect, useContext } from "react";
import { Typography, Button, Menu, Dropdown, message, Row, Col } from "antd";
import SearchBar from "./SearchBar";
import MyRangePicker from "../commonComp/MyRangePicker";
import MostVisitedPage from "./MostVisitedPage";
import RecentVisitedPage from "./RecentVisitedPage";
import { AxiosContext } from "../MyProvider";

const index = () => {
  const { axiosFetch, navSize } = useContext(AxiosContext);
  const [date, setDate] = useState({ start: "", end: "" });
  const [rerender, setRerender] = useState(true);
  const updateDate = (data) => {
    setDate(data);
    // console.log(data, '44');
  };
  const rerenderHandeler = () => {
    setRerender(!rerender);
  };

  const [customMargin, setCustomMargin] = useState("0px");
  useEffect(() => {
    // console.log("$NAVSIZE", navSize)
    if (navSize === "small") setCustomMargin("-125px");
    else setCustomMargin("0px");
  }, [navSize]);

  return (
    <div
      style={{
        marginRight: "16px",
        marginBottom: "32px",
        marginLeft: `${customMargin}`,
      }}
    >
      <h2 style={{ fontWeight: 700, marginTop: "5px", fontSize: "30px" }}>
        HeatMap
      </h2>
      <SearchBar render={rerenderHandeler} date={date} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "16px 0",
        }}
      >
        <div></div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div>
            <MyRangePicker getDate={updateDate} prevDay={7} />
          </div>
        </div>
      </div>
      <div style={{ marginTop: "16px" }}>
        <Row gutter={[16, 18]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <MostVisitedPage date={date} />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <RecentVisitedPage date={date} isRender={rerender} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default index;
