import React, { useState, useEffect, useContext } from "react";
import { AxiosContext } from "../components/MyProvider";
import PlayBtn from "../components/buttons/PlayBtn";
import LiveViewBtn from "../components/buttons/LiveViewBtn";
import "antd/dist/antd.css";
import { Table, Typography } from "antd";
import { Avatar, Button, Dropdown, Menu, message } from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { Router, useRouter } from "next/dist/client/router";
import { fetchRecording } from "../API/recordingPage";
import { getBlockedIp } from "../API/settingsPageApi";
import MyRangePicker from "../components/commonComp/MyRangePicker";
import MyLoader from "../components/commonComp/MyLoader";
import Img3 from "../images/instruction/Nodata.png";
const { Title } = Typography;

const overlayCount = [
  { value: 10, idx: 1 },
  { value: 25, idx: 2 },
  { value: 50, idx: 3 },
  { value: 100, idx: 4 },
];
const pageArr = [10, 25, 50, 100];
const Recordings = () => {
  const { axiosFetch, navSize } = useContext(AxiosContext);
  const router = useRouter();
  const [date, setDate] = useState({ start: "", end: "" });
  const [rowItemNo, setRowItemNo] = useState(overlayCount[0].value);
  const [totalItem, setTotalItem] = useState([]);
  const [ltItem, setLtItem] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  const [customMargin, setCustomMargin] = useState("0px");
  useEffect(() => {
    // console.log("$NAVSIZE", navSize)
    if (navSize === "small") setCustomMargin("-125px");
    else setCustomMargin("0px");
  }, [navSize]);

  const getRecording = async (body) => {
    try {
      // setLoading(true);
      setStatusMsg("");
      setServerStatus(null);
      console.log(body.start, body.end);
      const { data, status } = await fetchRecording(axiosFetch, body);
      const blockedip = await getBlockedIp(axiosFetch);
      console.log(data, status, "from getRecording");
      console.log(blockedip.data, "from getRecording");
      setServerStatus(status);
      if (status === 200) {
        if (blockedip.data.length === 0) {
          setTotalItem(data?.record);
          // setLoading(false);
        } else {
          blockedip.data.forEach((ips) => {
            data.record.forEach((data) => {
              if (data.ipInfo === ips.ipAddress) {
                console.log("hereeeeeee");
                setTotalItem([]);
                // setLoading(false);
              } else {
                console.log("hereeeeeee1");
                setTotalItem(data?.record);
                // setLoading(false);
              }
            });
          });
        }
      } else {
        setStatusMsg(
          "There is some internal server issue.\n Please reload the page or visit some time later."
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    console.log("fetch the table data", date);
    if (date.start && date.end) {
      // let body = {
      //   start: date.start,
      //   end: date.end,
      // };
      getRecording(date);
    }
  }, [date]);

  const updateDate = (temp) => {
    setDate(temp);
    // console.log(data, "44");
  };
  // useEffect(() => {
  //   getRecording(date);
  // }, [date]);

  // useEffect(() => {
  //   getRecording();
  // }, []);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const timefmt = (hr, min) => {
    if (hr > 12) {
      return `${hr - 12}:${min} pm`;
    } else if (hr == 12) {
      return `${hr}:${min} pm`;
    }
    return `${hr}:${min} am`;
  };

  const getDateFmt = (d) => {
    const date = new Date(d);
    // console.log(date, 'from date')
    let day = date.getDate();
    let month = months[date.getMonth()];
    let yr = date.getFullYear();
    let hr = date.getHours();
    let min = date.getMinutes();
    let fmt = timefmt(hr, min);
    let fft = `${month} ${day}, ${yr} at \n \t ${fmt}`;
    return fft;
  };

  const compBuilder = (data) => {
    // console.log(data, 'from compBuilder');
    if (data.length) {
      const buildItem = data.map((rec, idx) => {
        console.log(rec, "inside map");
        let fft = rec.created ? getDateFmt(rec.created) : null;
        return {
          key: idx,
          visitors: (
            <div style={{ display: "flex" }}>
              <Avatar icon={<UserOutlined />} style={{ marginTop: "5px" }} />
              <div>
                <Title
                  style={{ color: "#10769c", marginLeft: "5px" }}
                  level={5}
                >
                  {rec.ispInfo ? rec.ispInfo : "unknown"}
                  {""}{" "}
                  <Title style={{ fontSize: "10px" }}>
                    {rec.ipInfo ? rec.ipInfo : "unknown"}
                  </Title>
                </Title>
              </div>
            </div>
          ),
          play: <PlayBtn recId={rec.recId} />,
          //  live: <LiveViewBtn />,
          duration: (
            <Title style={{ fontSize: "100%", color: "gray", fontWeight: 500 }}>
              {rec.endTime && rec.startTime
                ? Math.floor((rec.endTime - rec.startTime) / 1000) + " sec"
                : "---"}
            </Title>
          ),
          // pages: (
          //   <Title
          //     style={{
          //       fontWeight: 400,
          //       color: "gray",
          //       fontSize: "100%",
          //       marginLeft: "15px",
          //     }}
          //   >
          //     1
          //   </Title>
          // ),

          location: (
            <Title style={{ fontSize: "100%", color: "gray", fontWeight: 500 }}>
              {rec.location}
            </Title>
          ),
          date: <Title style={{ fontSize: "100%" }}>{fft ? fft : "---"}</Title>,
        };
      });
      setLtItem(buildItem);
      console.log(buildItem, "94");
    } else {
      setLtItem([]);
    }
  };
  // console.log(ltItem,'ltItem')
  useEffect(() => {
    compBuilder(totalItem);
  }, [totalItem]);

  function handleMenuClick(e) {
    message.info(`Showing ${overlayCount[e.key - 1].value} items in table.`);
    setRowItemNo(overlayCount[e.key - 1].value);
    // console.log(e.key, "click");
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      {overlayCount.map((item, idx) => {
        return <Menu.Item key={item.idx}>{item.value}</Menu.Item>;
      })}
    </Menu>
  );

  const handlePageSizeChange = (current, size) => {
    console.log("deb", current, size);
    setRowItemNo(size);
  };

  const columns = [
    {
      title: (
        <Title style={{ fontSize: "100%", color: "gray", fontWeight: 700 }}>
          Visitors
        </Title>
      ),
      dataIndex: "visitors",
      key: "visitors",
    },
    {
      title: (
        <Title
          style={{
            fontSize: "100%",
            color: "gray",
            fontWeight: 700,
            marginLeft: "15px",
          }}
        >
          Play
        </Title>
      ),
      dataIndex: "play",
      key: "play",
    },
    // {
    //   title: (
    //     <Title
    //       style={{
    //         fontSize: "100%",
    //         color: "gray",
    //         fontWeight: 700,
    //         marginLeft: "5px",
    //       }}
    //     >
    //       Live View
    //     </Title>
    //   ),
    //   dataIndex: "live",
    //   key: "live",
    // },
    {
      title: (
        <Title style={{ fontSize: "100%", color: "gray", fontWeight: 700 }}>
          Duration
        </Title>
      ),
      dataIndex: "duration",
      key: "duration",
    },
    // {
    //   title: (
    //     <Title style={{ fontSize: "100%", color: "gray", fontWeight: 700 }}>
    //       Tags
    //     </Title>
    //   ),
    //   dataIndex: "tags",
    //   key: "tags",
    // },
    // {
    //   title: (
    //     <Title style={{ fontSize: "100%", color: "gray", fontWeight: 700 }}>
    //       #Pages
    //     </Title>
    //   ),
    //   dataIndex: "pages",
    //   key: "pages",
    // },
    {
      title: (
        <Title
          style={{
            fontSize: "100%",
            color: "gray",
            fontWeight: 700,
            marginLeft: "15px",
          }}
        >
          Created
        </Title>
      ),
      dataIndex: "date",
      key: "date",
    },
    {
      title: (
        <Title style={{ fontSize: "100%", color: "gray", fontWeight: 700 }}>
          location
        </Title>
      ),
      dataIndex: "location",
      key: "location",
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
      {/* {loading ? (
        <div style={{ minHeight: "200px" }}>
          <MyLoader />
        </div>
      ) : ( */}
      <div
        style={{
          marginRight: "20px",
          marginTop: "30px",
          display: "flex",
          flexDirection: "column",
          marginLeft: `${customMargin}`,
        }}
      >
        <h2 style={{ fontWeight: 700, marginBottom: "30px", fontSize: "30px" }}>
          Recording
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
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
                    borderRadius: "5px",
                    marginBottom: "10px",
                    boxShadow: "2px 3px 3px lightgray",
                    border: "none",
                  }}
                >
                  {rowItemNo}
                  <DownOutlined style={{ marginLeft: "15px" }} />
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
            {/* <div>
            <Button
              style={{
                width: "100%",
                height: "35px",
                background: "#0B15ED",
                color: "white",
                fontSize: "100%",
                fontWeight: 800,
              }}
            >
              Exclude Active Recording
            </Button>
          </div> */}
          </div>
          <div>
            <div>
              <MyRangePicker getDate={updateDate} prevDay={7} />
            </div>
          </div>
        </div>
        <div>
          <Table
            // rowSelection={{}}
            style={{
              boxShadow: "2px 3px 3px lightgray",
              borderRadius: "10px",
              border: "none",
            }}
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
      {/* )} */}
      <div>
        {serverStatus === 200 ? (
          <></>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            {statusMsg}
          </div>
        )}
      </div>
    </>
  );
};

export default Recordings;
