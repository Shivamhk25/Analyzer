import React, { useState, useContext, useEffect } from "react";
import { AxiosContext } from "../MyProvider";
// import "antd/dist/antd.css";
import { Table, Typography, Button, Menu, Dropdown, message } from "antd";
import { getTopDevices } from "../../API/analytic";
import MyRangePicker from "../commonComp/MyRangePicker";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import {
  SiSafari,
  SiGooglechrome,
  SiFirefox,
  SiOpera,
  SiInternetexplorer,
  SiBrave,
  SiWindows,
  SiMacos,
  SiKalilinux,
} from "react-icons/si";
import { FcAndroidOs, FcLinux } from "react-icons/fc";
import { VscTerminalUbuntu } from "react-icons/vsc";
import { MdOutlineDeviceUnknown } from "react-icons/md";
import { IconContext } from "react-icons";
import { GrStatusUnknown } from "react-icons/gr";
import Img3 from "../../images/instruction/Nodata.png";

const { Title } = Typography;

const overlayCount = [
  { value: 10, idx: 1 },
  { value: 25, idx: 2 },
  { value: 50, idx: 3 },
  { value: 100, idx: 4 },
];
const pageArr = [10, 25, 50, 100];

const TopDevices = () => {
  const { axiosFetch } = useContext(AxiosContext);
  const [rowItemNo, setRowItemNo] = useState(overlayCount[0].value);
  const [totalItem, setTotalItem] = useState([]);
  const [ltItem, setLtItem] = useState([]);
  const [date, setDate] = useState({ start: "", end: "" });

  /*
  {
┃     name: 'Windows OS',
┃     total_time: 1636203698,
┃     total_users: 100,
┃     unique_users: 1,
┃     location: undefined,
┃     avg_time: 100
┃   }
  */
  const fetchTopDevices = async (data) => {
    try {
      const res = await getTopDevices(axiosFetch, data);
      console.log(res, "from fetchTopDevices");
      setTotalItem(res);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (date.start && date.end) {
      fetchTopDevices(date);
    }
  }, [date]);
  const updateDate = (data) => {
    setDate(data);
    // console.log(data, '44');
  };

  useEffect(() => {
    compBuilder(totalItem);
  }, [totalItem]);
  const browIconMatcher = (name) => {
    if (name?.toLowerCase().includes("chrome")) {
      return (
        <IconContext.Provider
          value={{ color: "#855", className: "global-class-name" }}
        >
          <span style={{ marginRight: "5px" }}>
            <SiGooglechrome />
          </span>
        </IconContext.Provider>
      );
    } else if (name?.toLowerCase().includes("safari")) {
      return (
        <IconContext.Provider
          value={{ color: "#855", className: "global-class-name" }}
        >
          <span style={{ marginRight: "5px" }}>
            <SiSafari />
          </span>
        </IconContext.Provider>
      );
    } else if (name?.toLowerCase().includes("firefox")) {
      return (
        <IconContext.Provider
          value={{ color: "#855", className: "global-class-name" }}
        >
          <span style={{ marginRight: "5px" }}>
            <SiFirefox />
          </span>
        </IconContext.Provider>
      );
    } else if (name?.toLowerCase().includes("opera")) {
      return (
        <IconContext.Provider
          value={{ color: "#855", className: "global-class-name" }}
        >
          <span style={{ marginRight: "5px" }}>
            <SiOpera />
          </span>
        </IconContext.Provider>
      );
    } else if (name?.toLowerCase().includes("internetexplorer")) {
      return (
        <IconContext.Provider
          value={{ color: "#855", className: "global-class-name" }}
        >
          <span style={{ marginRight: "5px" }}>
            <SiInternetexplorer />
          </span>
        </IconContext.Provider>
      );
    } else if (name?.toLowerCase().includes("brave")) {
      return (
        <IconContext.Provider
          value={{ color: "#855", className: "global-class-name" }}
        >
          <span style={{ marginRight: "5px" }}>
            <SiBrave />
          </span>
        </IconContext.Provider>
      );
    } else {
      return (
        <IconContext.Provider
          value={{ color: "#855", className: "global-class-name" }}
        >
          <span style={{ marginRight: "5px" }}>
            <GrStatusUnknown />
          </span>
        </IconContext.Provider>
      );
    }
  };

  const OSIconMatcher = (name) => {
    if (name?.toLowerCase().includes("macos")) {
      return (
        <IconContext.Provider
          value={{ color: "#855", className: "global-class-name" }}
        >
          <span style={{ marginRight: "5px" }}>
            <SiMacos />
          </span>
        </IconContext.Provider>
      );
    } else if (name?.toLowerCase().includes("windows")) {
      return (
        <IconContext.Provider
          value={{ color: "#855", className: "global-class-name" }}
        >
          <span style={{ marginRight: "5px" }}>
            <SiWindows />
          </span>
        </IconContext.Provider>
      );
    } else if (name?.toLowerCase().includes("android")) {
      return (
        <IconContext.Provider
          value={{ color: "#855", className: "global-class-name" }}
        >
          <span style={{ marginRight: "5px" }}>
            <FcAndroidOs />
          </span>
        </IconContext.Provider>
      );
    } else if (name?.toLowerCase().includes("linux")) {
      return (
        <IconContext.Provider
          value={{ color: "#855", className: "global-class-name" }}
        >
          <span style={{ marginRight: "5px" }}>
            <FcLinux />
          </span>
        </IconContext.Provider>
      );
    } else if (name?.toLowerCase().includes("ubuntu")) {
      return (
        <IconContext.Provider
          value={{ color: "#855", className: "global-class-name" }}
        >
          <span style={{ marginRight: "5px" }}>
            <VscTerminalUbuntu />
          </span>
        </IconContext.Provider>
      );
    } else if (name?.toLowerCase().includes("kali")) {
      return (
        <IconContext.Provider
          value={{ color: "#855", className: "global-class-name" }}
        >
          <span style={{ marginRight: "5px" }}>
            <SiKalilinux />
          </span>
        </IconContext.Provider>
      );
    } else {
      return (
        <IconContext.Provider
          value={{
            color: "#855",
            className: "global-class-name",
            size: "22px",
          }}
        >
          <span style={{ marginRight: "5px" }}>
            <MdOutlineDeviceUnknown />
          </span>
        </IconContext.Provider>
      );
    }
  };

  function compBuilder(data) {
    if (data.length) {
      const buildItem = data.map((item, idx) => {
        let deviceIcon = OSIconMatcher(item.name);
        let browserIcon = browIconMatcher(item.browser);
        return {
          key: idx,
          device: (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginLeft: "auto",
              }}
            >
              {deviceIcon}
            </div>
          ),
          Users: (
            <Title
              style={{
                fontWeight: 600,
                fontSize: "100%",
                color: "black",
                display: "flex",
                justifyContent: "center",
                marginLeft: "auto",
              }}
            >
              {Math.round(item.unique_users)}
            </Title>
          ),
          tuser: (
            <Title
              style={{
                fontWeight: 600,
                fontSize: "100%",
                color: "gray",
                fontWeight: 500,
                display: "flex",
                justifyContent: "center",
                marginLeft: "auto",
              }}
            >
              {Math.round(item.total_users)}
            </Title>
          ),
          AvgTime: (
            <Title
              style={{
                fontWeight: 600,
                color: "gray",
                fontSize: "100%",
                display: "flex",
                justifyContent: "center",
                marginLeft: "auto",
              }}
            >
              {item.avg_time
                ? Math.floor(item.avg_time / (1000 * 60)) <= 1
                  ? Math.floor(item.avg_time / 1000) + " sec"
                  : Math.floor(item.avg_time / (1000 * 60 * 60)) <= 1
                  ? Math.floor(item.avg_time / (1000 * 60)) + " min"
                  : Math.floor(item.avg_time / (1000 * 60 * 60)) +
                    "hr" +
                    (Math.floor(item.avg_time % (1000 * 60)) % 60) +
                    "min"
                : "0 sec"}
            </Title>
          ),
          location: (
            <Button
              type="ghost"
              style={{
                fontWeight: 600,
                fontSize: "100%",
                width: "90%",
                height: "100%",
                border: "none",
                background: "white",
                color: "gray",
                textAlign: "center",
              }}
              onClick={() => {
                console.log("inside on click");
              }}
              border="none"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                {
                  <img
                    src={`https://flagcdn.com/${item.country_code.toLowerCase()}.svg`}
                    alt="img"
                    style={{ width: "20px" }}
                  />
                }
                {item.location ? item.location : "unknown"}
              </div>
            </Button>
          ),
          browser: (
            <Button
              type="ghost"
              style={{
                fontSize: "100%",
                width: "90%",
                border: "none",
                background: "white",
                color: "gray",
                fontWeight: 600,
              }}
              onClick={() => {
                console.log("inside on click");
              }}
              border="none"
              icon={browserIcon}
            >
              {item.browser ? item.browser : "unknown"}
            </Button>
          ),
        };
      });
      setLtItem(buildItem);
      // let testing = [];
      // for (let i = 0; i < 110; i++) {
      //   testing.push(buildItem[0]);
      // }
      // setLtItem(testing);
    } else {
      setLtItem([]);
    }
  }

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

  const handlePageSizeChange = (current, size) => {
    console.log("deb", current, size);
    setRowItemNo(size);
  };
  /*
  - Device
- %age Unique Users
- %age Total Users (desending sorting based on this)
- Avg. session time
- Top location
- Most used Browser
  
  */

  const columns = [
    {
      title: (
        <Title style={{ fontSize: "100%", color: "gray", fontWeight: 700 }}>
          Device Name
        </Title>
      ),
      dataIndex: "device",
      key: "device",
    },
    {
      title: (
        <Title style={{ fontSize: "100%", color: "gray", fontWeight: 700 }}>
          %age unique users
        </Title>
      ),
      dataIndex: "Users",
      key: "Users",
    },
    {
      title: (
        <Title style={{ fontSize: "100%", color: "gray", fontWeight: 700 }}>
          %age total users
        </Title>
      ),
      dataIndex: "tuser",
      key: "tuser",
    },
    {
      title: (
        <Title style={{ fontSize: "100%", color: "gray", fontWeight: 700 }}>
          Avg. session time
        </Title>
      ),
      key: "Avgtime",
      dataIndex: "AvgTime",
    },
    {
      title: (
        <Title style={{ fontSize: "100%", color: "gray", fontWeight: 700 }}>
          Top Location
        </Title>
      ),
      key: "location",
      dataIndex: "location",
    },
    {
      title: (
        <Title style={{ fontSize: "100%", color: "gray", fontWeight: 700 }}>
          Browser Name
        </Title>
      ),
      dataIndex: "browser",
      key: "browser",
    },
  ];

  let locale = {
    emptyText: (
      <span>
        <img
          src={Img3}
          style={{ width: "150px", height: "150px", marginLeft: "40%" }}
        />
      </span>
    ),
  };

  return (
    <>
      <div
        style={{
          marginRight: "20px",
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
            <div>
              {/* <Button
                style={{
                  background: "white",
                  fontWeight: "600",
                  fontSize: "15px",
                  width: "100%",
                  boxShadow: "20px",
                  height: "35px",
                  alignItems: "center",
                }}
              >
                Columns
              </Button> */}
            </div>
            <div>
              {/* <Button
                style={{
                  background: "white",
                  fontWeight: "600",
                  fontSize: "15px",
                  width: "100%",
                  boxShadow: "20px",
                  height: "35px",
                  alignItems: "center",
                }}
              >
                Behaviour Tag Rules
              </Button> */}
            </div>
          </div>
          <div>
            <MyRangePicker getDate={updateDate} prevDay={7} />
          </div>
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={ltItem}
            scroll={{ x: true }}
            locale={locale}
            pagination={{
              pageSize: rowItemNo,
              pageSizeOptions: pageArr,
              onShowSizeChange: handlePageSizeChange,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TopDevices;
