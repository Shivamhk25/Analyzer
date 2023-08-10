import React, { useState, useEffect, useContext } from "react";
import { AxiosContext } from "../MyProvider";
// import "antd/dist/antd.css";
import { Table, Typography, Button, Menu, Dropdown, message } from "antd";
import MyRangePicker from "../commonComp/MyRangePicker";
import { getTopBrowsers } from "../../API/analytic";
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
import BrowserIcon from "../commonComp/BrowserIcon";
import OSIcon from "../commonComp/OSIcon";
import Img3 from "../../images/instruction/Nodata.png";

const { Title } = Typography;

const overlayCount = [
  { value: 10, idx: 1 },
  { value: 25, idx: 2 },
  { value: 50, idx: 3 },
  { value: 100, idx: 4 },
];
const pageArr = [10, 25, 50, 100];

const TopBrowsers = () => {
  const { axiosFetch } = useContext(AxiosContext);
  const [rowItemNo, setRowItemNo] = useState(overlayCount[0].value);
  const [totalItem, setTotalItem] = useState([]);
  const [ltItem, setLtItem] = useState([]);
  const [date, setDate] = useState({ start: "", end: "" });

  const fetchTopBrowsers = async (data) => {
    try {
      console.log(data.start, data.end);
      const res = await getTopBrowsers(axiosFetch, data);
      console.log(res, "from fetchTopBrowsers");
      setTotalItem(res);
      console.log(totalItem, "Total Items");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (date.start && date.end) {
      fetchTopBrowsers(date);
    }
  }, [date]);
  const updateDate = (data) => {
    setDate(data);
    // console.log(data, '44');
  };

  const compBuilder = (data) => {
    if (data.length) {
      console.log(data);
      const buildItem = data?.map((item, idx) => {
        // console.log(item, 'inside map');
        let browserIcon = BrowserIcon(item.name);
        let osIcon = OSIcon(item.device);
        return {
          key: idx,
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
              {item.name}
            </Button>
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
              {item.unique_users ? Math.round(item.unique_users) : 0}
            </Title>
          ),
          tuser: (
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
              {item.total_visits ? Math.round(item.total_visits) : 0}
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
              {/* {item.avg_time} */}
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
          device: (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginLeft: "auto",
              }}
            >
              {osIcon}
            </div>
          ),
        };
      });
      // console.log(testing,'testing')
      console.log(buildItem);
      setLtItem(buildItem);
      // console.log(buildItem, "94");
    } else {
      setLtItem([]);
    }
  };

  useEffect(() => {
    console.log("executed!");
    compBuilder(totalItem);
  }, [totalItem]);

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
   Browser
- %age Unique Users
- %age Total Users (desending sorting based on this)
- Avg. session time
- Top location
- Most used device
  
  */
  const columns = [
    {
      title: (
        <Title style={{ fontSize: "100%", color: "gray", fontWeight: 700 }}>
          Browser Name
        </Title>
      ),
      dataIndex: "browser",
      key: "browser",
    },
    {
      title: (
        <Title style={{ fontSize: "100%", color: "gray", fontWeight: 700 }}>
          %age unique users
        </Title>
      ),
      key: "Users",
      dataIndex: "Users",
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
          Most Used Device
        </Title>
      ),
      key: "device",
      dataIndex: "device",
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
            <div>
              <MyRangePicker getDate={updateDate} prevDay={7} />
            </div>
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

export default TopBrowsers;
