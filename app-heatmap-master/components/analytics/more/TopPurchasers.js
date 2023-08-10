import React, { useState, useContext, useEffect } from "react";
// import "antd/dist/antd.css";
import { Table, Typography, Button, Avatar } from "antd";
import { AxiosContext } from "../../MyProvider";
import { getTopPurchasers } from "../../../API/analytic";
import { IconContext } from "react-icons";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import PlayBtn from "../../buttons/PlayBtn";
import { BsBarChartLine } from "react-icons/bs";
import { getDateFmt } from "./MostRepeatVisitors";
import Img3 from "../../../images/instruction/Nodata.png";

const { Title } = Typography;
const pageArr = [10, 25, 50, 100];

const TopPuchasers = ({ date, rowItemCount }) => {
  const { axiosFetch } = useContext(AxiosContext);
  const [totalItem, setTotalItem] = useState([]);
  const [ltItem, setLtItem] = useState([]);
  const [localPageNo, setLocalPageNo] = useState(rowItemCount);

  const GetActivity = ({ activity }) => {
    return (
      <>
        {Array.from(Array(activity).keys()).map((item, idx) => (
          <span
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

  const fetchTopPurchasers = async (data) => {
    try {
      const res = await getTopPurchasers(axiosFetch, data);
      console.log(res, "from fetchTopPurchasers");
      setTotalItem(processItems(res));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (date.start && date.end) {
      fetchTopPurchasers(date);
    }
  }, [date]);
  useEffect(() => {
    compBuilder(totalItem);
  }, [totalItem]);

  useEffect(() => {
    setLocalPageNo(rowItemCount);
  }, [rowItemCount]);

  const handlePageSizeChange = (current, size) => {
    console.log("deb", current, size);
    setLocalPageNo(size);
  };
  /*
  {
        "sessionId": "13blhe1hekxy8l2v7",
        "total_visits": 0.16666666666666666,
        "total_time": 344895101,
        "total_purchase_value": null,
        "isp": "Bharti Airtel",
        "Ip_Info": "192.68.2.9",
        "Created_at": 1643785596246,
        "location": "Delhi",
        "country_code": 91,
        "pages": 2,
        "landing_page": "/Collection/30",
        "tags": "Click to Tag",
        "activity": "",
        "edit_page": "",
        "avg_time": 0.25678277720629294
    }
  */

  function compBuilder(data) {
    if (data.length) {
      const buildItem = data.map((item, idx) => {
        let fft = item.Created_at ? getDateFmt(item.Created_at) : null;
        return {
          key: idx,
          // play: <PlayBtn recId={item.sessionId} />,
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
              {item.avg_time
                ? Math.round(item.avg_time * 100) / 100 < 1
                  ? Math.round(item.avg_time * 100) * 60 + " sec"
                  : Math.round(item.avg_time * 100) + " min"
                : 0}
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
                color: "gray",
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
            <Button
              type="ghost"
              style={{
                fontWeight: 600,
                fontSize: "100%",
                width: "90%",
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
        };
      });
      setLtItem(buildItem);
    } else {
      setLtItem([]);
    }
  }

  //<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
  // {
  //   <img
  //     src={`https://flagcdn.com/${item.country_code.toLowerCase()}.svg`}
  //     alt="img"
  //     style={{ width: '20px' }}
  //   />
  // }
  // {item.location ? item.location : 'unknown'}
  //</div>
  const columns = [
    Table.SELECTION_COLUMN,
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
    //       Play
    //     </Title>
    //   ),
    //   dataIndex: "play",
    //   key: "play",
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
    <>
      <div
        style={{
          marginTop: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "start",
          }}
        >
          <IconContext.Provider
            value={{
              color: "#855",
              className: "global-class-name",
              size: "22px",
            }}
          >
            <span style={{ marginRight: "15px", marginTop: "10px" }}>
              <BsBarChartLine />
            </span>
          </IconContext.Provider>

          <Title fontWeight="700" level={3}>
            Top purchasers
          </Title>
        </div>

        <div>
          <Table
            // rowSelection={{}}
            columns={columns}
            dataSource={ltItem}
            scroll={{ x: 1500, y: 700 }}
            locale={locale}
            pagination={{
              pageSize: localPageNo,
              pageSizeOptions: pageArr,
              onShowSizeChange: handlePageSizeChange,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TopPuchasers;
