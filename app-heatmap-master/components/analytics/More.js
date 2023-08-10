import React, { useState, useEffect } from "react";
import MostRepeatVisitors from "./more/MostRepeatVisitors";
import TopPurchasers from "./more/TopPurchasers";
import HighestConversionUser from "./more/HighestConversionUser";
import MostVisits from "./more/MostVisits";
import MostAddToCartUsers from "./more/MostAddToCartUsers";
import MyRangePicker from "../commonComp/MyRangePicker";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Table, Typography, Button, Menu, Dropdown, message } from "antd";
const { Title } = Typography;

const overlayCount = [
  { value: 10, idx: 1 },
  { value: 25, idx: 2 },
  { value: 50, idx: 3 },
  { value: 100, idx: 4 },
];

const More = ({ currentTable }) => {
  const [rowItemNo, setRowItemNo] = useState(overlayCount[0].value);
  const [date, setDate] = useState({ start: "", end: "" });
  useEffect(() => {
    if (date.start && date.end) {
      console.log("pass the data to every comp", date);
    }
  }, [date]);
  const updateDate = (data) => {
    setDate(data);
    console.log(data, "44");
  };

  function handleMenuClick(e) {
    message.info(`Showing ${overlayCount[e.key - 1].value} items in table.`);
    setRowItemNo(overlayCount[e.key - 1].value);
    // console.log(e.key, "click");
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      {overlayCount.map((item) => (
        <Menu.Item key={item.idx}>{item.value}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      <div
        style={{
          marginTop: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>
              <Dropdown overlay={menu}>
                <Button
                  style={{
                    fontWeight: 600,
                    fontSize: "15px",
                    color: "black",
                    height: "35px",
                    width: "80px",
                    alignItems: "center",
                  }}
                >
                  {rowItemNo} <DownOutlined style={{ marginLeft: "15px" }} />
                </Button>
              </Dropdown>
            </div>
          </div>

          <div>
            <div>
              <MyRangePicker getDate={updateDate} prevDay={7} />
            </div>
          </div>
        </div>
        <div style={{ paddingBottom: "32px" }}>
          {/* bellow render all table */}
          {currentTable === "MostRepeatVisitors" ? (
            <>
              <MostRepeatVisitors date={date} rowItemCount={rowItemNo} />
            </>
          ) : (
            <></>
          )}
          {currentTable === "TopPurchasers" ? (
            <>
              <TopPurchasers date={date} rowItemCount={rowItemNo} />
            </>
          ) : (
            <></>
          )}
          {currentTable === "MostVisits" ? (
            <>
              <MostVisits date={date} rowItemCount={rowItemNo} />
            </>
          ) : (
            <></>
          )}

          {/* <HighestConversionUser date={date} rowItemCount={rowItemNo} /> */}
          {/* <MostAddToCartUsers date={date} rowItemCount={rowItemNo} /> */}
        </div>
      </div>
    </>
  );
};

export default More;
