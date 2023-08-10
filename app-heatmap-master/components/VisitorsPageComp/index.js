import React, { useState, useContext, useEffect } from "react";
import {
  Table,
  Typography,
  Button,
  Menu,
  Dropdown,
  message,
  Avatar,
  Pagination,
  Empty,
  ConfigProvider,
} from "antd";

import { AxiosContext } from "../MyProvider";
import MyRangePicker from "../commonComp/MyRangePicker";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import PlayBtn from "../buttons/PlayBtn";
import { getDateFmt } from "../analytics/more/MostRepeatVisitors";
import { getVisitorsData } from "../../API/visitorsPageApi";
import MyLoader from "../commonComp/MyLoader";
import Img3 from "../../images/instruction/Nodata.png";

const { Title } = Typography;

const overlayCount = [
  { value: 10, idx: 1 },
  { value: 25, idx: 2 },
  { value: 50, idx: 3 },
  { value: 100, idx: 4 },
];
const pageArr = [10, 25, 50, 100];

const index = () => {
  const { axiosFetch, navSize } = useContext(AxiosContext);

  const [rowItemNo, setRowItemNo] = useState(overlayCount[0].value);
  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [date, setDate] = useState({ start: "", end: "" });
  const [totalResult, setTotalResult] = useState(100);
  const [perPageItem, setPerPageItem] = useState([]);
  const [ltItem, setLtItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  const [customMargin, setCustomMargin] = useState("0px");
  useEffect(() => {
    // console.log("$NAVSIZE", navSize)
    if (navSize === "small") setCustomMargin("-125px");
    else setCustomMargin("0px");
  }, [navSize]);

  const GetActivity = ({ activity }) => {
    return (
      <>
        {Array.from(Array(activity).keys()).map((item, idx) => (
          <span
            key={idx}
            style={{
              backgroundColor: "red",
              color: "red",
              height: "4px",
              width: "12px",
              marginRight: "3px",
            }}
          ></span>
        ))}
      </>
    );
  };

  const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return seconds == 60
      ? minutes + 1 + ":00"
      : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  const compareTime = (calculatedTime) => {
    let minutes = calculatedTime.split(":")[0];
    let seconds = calculatedTime.split(":")[1];

    if (minutes == 0 && seconds <= 59) return 1;
    if (minutes == 1 || minutes == 2) return 2;
    if (minutes == 3) return 3;
    if (minutes == 4) return 4;
    if (minutes >= 5) return 5;
  };

  const processItems = (data) => {
    data.forEach((item) => {
      item.activity = (
        <GetActivity
          activity={compareTime(millisToMinutesAndSeconds(item.activity))}
        />
      );
    });

    return data;
  };

  const fetchVisitors = async (body) => {
    try {
      setLoading(true);
      setStatusMsg("");
      setServerStatus(null);
      const { data, status } = await getVisitorsData(axiosFetch, body);
      console.log(data, "fetchVisitors", status);
      setServerStatus(status);
      if (status === 200) {
        setPerPageItem(processItems(data.data));
        setTotalResult(data.count);
        setLoading(false);
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
    if (date.start && date.end) {
      // console.log("fetch the table data", date);
      let body = {
        ...date,
        page: currentPageNo,
        limit: rowItemNo,
      };
      fetchVisitors(body);
    }
  }, [date, rowItemNo, currentPageNo]);
  useEffect(() => {
    compBuilder(perPageItem);
    console.log(perPageItem, "44");
  }, [perPageItem]);

  const onPageChange = (page, pageSize) => {
    console.log("Page: ", page, pageSize);
    setCurrentPageNo(page);
    setRowItemNo(pageSize);
  };
  const handlePageSizeChange = (current, size) => {
    console.log("deb", current, size);
    setRowItemNo(size);
    setCurrentPageNo(current);
  };
  const updateDate = (data) => {
    setDate(data);
    // console.log(data, "44");
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

  function compBuilder(data) {
    console.log(data, "gettttttt");
    if (data?.length) {
      const buildItem = data.map((item, idx) => {
        let fft = item.created ? getDateFmt(item.created) : null;
        console.log(item.sessionId, "hello in map");
        // item.country_code = "IN";

        return {
          key: idx,
          play: <PlayBtn recId={item?.sessionId} />,

          visitors: (
            <div style={{ display: "flex" }}>
              {/* <Avatar icon={<UserOutlined />} /> */}
              <div>
                <Title
                  style={{ color: "#10769c", marginLeft: "5px" }}
                  level={5}
                >
                  {item.isp ? item.isp : "unknown"}
                  {""}{" "}
                  <Title style={{ fontSize: "10px" }}>
                    {item.Ip_Info ? item.Ip_Info : "unknown"}
                  </Title>
                </Title>
              </div>
            </div>
          ),
          // tags: (
          //   <Button type="link" style={{ fontWeight: 600, color: "gray" }}>
          //     {item.tags ? item.tags : "---"}
          //   </Button>
          // ),
          date: <Title style={{ fontSize: "100%" }}>{fft ? fft : "---"}</Title>,
          activity: (
            <Title
              style={{
                fontWeight: 600,
                color: "#10769c",
                fontSize: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {item.activity ? item.activity : "---"}
            </Title>
          ),
          pages: (
            <Title
              style={{
                fontWeight: 600,
                color: "#10769c",
                fontSize: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {item.pages ? item.pages : 0}
            </Title>
          ),
          time: (
            <Title
              style={{
                fontWeight: 600,
                fontSize: "100%",
                color: "black",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {item.endTime && item.startTime
                ? Math.floor((item.endTime - item.startTime) / 1000) + " sec"
                : "---"}
            </Title>
          ),
          lendPage: (
            <Title
              style={{
                fontWeight: 600,
                fontSize: "100%",
                color: "#10769c",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {item.landing_page
                ? item.landing_page.length >= 15
                  ? item.landing_page.substring(0, 20) + "---"
                  : item.landing_page
                : "---"}
            </Title>
          ),
          edit: (
            <Button
              type="link"
              style={{
                fontWeight: 300,
                color: "#10769c",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {item.edit_page
                ? item.edit_page.length >= 15
                  ? item.edit_page.substring(0, 20) + "---"
                  : item.edit_page
                : "---"}
            </Button>
          ),
          location: (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
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
          ),
        };
      });
      console.log(data, "gettttttt2");
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
  const columns = [
    Table.SELECTION_COLUMN,
    {
      title: (
        <Title
          style={{
            fontSize: "100%",
            color: "gray",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
          }}
        >
          Play
        </Title>
      ),
      dataIndex: "play",
      key: "play",
    },
    {
      title: (
        <Title
          style={{
            fontSize: "100%",
            color: "gray",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
          }}
        >
          Visitors
        </Title>
      ),
      dataIndex: "visitors",
      key: "visitors",
    },
    // {
    //   title: (
    //     <Title
    //       style={{
    //         fontSize: "100%",
    //         color: "gray",
    //         fontWeight: 700,
    //         display: "flex",
    //         justifyContent: "center",
    //       }}
    //     >
    //       Tags
    //     </Title>
    //   ),
    //   dataIndex: "tags",
    //   key: "tags",
    // },
    {
      title: (
        <Title
          style={{
            fontSize: "100%",
            color: "gray",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
          }}
        >
          Created
        </Title>
      ),
      key: "date",
      dataIndex: "date",
    },
    {
      title: (
        <Title
          style={{
            fontSize: "100%",
            color: "gray",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
          }}
        >
          Activity
        </Title>
      ),
      key: "activity",
      dataIndex: "activity",
    },
    {
      title: (
        <Title
          style={{
            fontSize: "100%",
            color: "gray",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
          }}
        >
          Pages
        </Title>
      ),
      key: "pages",
      dataIndex: "pages",
    },
    {
      title: (
        <Title
          style={{
            fontSize: "100%",
            color: "gray",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
          }}
        >
          Time
        </Title>
      ),
      key: "time",
      dataIndex: "time",
    },
    {
      title: (
        <Title
          style={{
            fontSize: "100%",
            color: "gray",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
          }}
        >
          Landing Page
        </Title>
      ),
      key: "lendPage",
      dataIndex: "lendPage",
    },
    {
      title: (
        <Title
          style={{
            fontSize: "100%",
            color: "gray",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
          }}
        >
          Exit Page
        </Title>
      ),
      key: "edit",
      dataIndex: "edit",
    },
    {
      title: (
        <Title
          style={{
            fontSize: "100%",
            color: "gray",
            fontWeight: 700,
            display: "flex",
            justifyContent: "center",
          }}
        >
          Location
        </Title>
      ),
      key: "location",
      dataIndex: "location",
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
    <div style={{ marginLeft: `${customMargin}` }}>
      <div
        style={{
          marginTop: "20px",
          marginBottom: "30px",
          marginRight: "12px",
          paddingLeft: "5px",
        }}
      >
        <h2 style={{ fontWeight: 700, marginBottom: "20px", fontSize: "30px" }}>
          Visitors
        </h2>
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
        <div style={{ paddingBottom: "32px", marginTop: "16px" }}>
          {loading ? (
            <div style={{ minHeight: "200px" }}>
              <MyLoader />
            </div>
          ) : (
            <>
              <div>
                {/* //  <ConfigProvider renderEmpty={() => <Empty image={Empty.Img3} />}> */}
                <Table
                  // rowSelection={{}}
                  columns={columns}
                  dataSource={ltItem}
                  scroll={{ x: 1500, y: 700 }}
                  pagination={false}
                  locale={locale}
                />
                {/* </ConfigProvider> */}
              </div>
              <div
                style={{
                  marginTop: "20px",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div></div>
                <div style={{ paddingRight: "10px" }}>
                  <Pagination
                    showQuickJumper
                    current={currentPageNo}
                    responsive={true}
                    pageSizeOptions={pageArr}
                    total={totalResult}
                    pageSize={rowItemNo}
                    onChange={onPageChange}
                    onShowSizeChange={handlePageSizeChange}
                  />
                </div>
              </div>
            </>
          )}
          <div>
            {serverStatus === 200 ? (
              <></>
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                {statusMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
