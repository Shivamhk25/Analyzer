import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Button,
  Menu,
  Dropdown,
  message,
  Row,
  Col,
  Progress,
  Popover,
} from "antd";
import LiveVisitors from "../components/dashboard/LiveVisitors";
import Locations from "../components/dashboard/Locations";
import TopPages from "../components/dashboard/TopPages";
import ProductViewed from "../components/dashboard/ProductViewed";
import Browser from "../components/dashboard/Browsers";
// import Sources from "../components/dashboard/Sources";
import Devices from "../components/dashboard/Devices";
import { getShopName } from "../API/billingApi";
import { AxiosContext } from "../components/MyProvider";
import MyRangePicker from "../components/commonComp/MyRangePicker";
import { DownOutlined } from "@ant-design/icons";
import TotalVisits from "../components/dashboard/TotalVisits";
import MyLoader from "../components/commonComp/MyLoader";
import { useRouter } from "next/dist/client/router";
import { Modal1 } from "../components/dashboard/Modal";
import Notification from "../components/commonComp/Notification";
import { getPlanExpire } from "../API/api2";
import axios from "axios";

const { Title } = Typography;
const overlayCount = [
  { value: "My Dashboard", idx: 1 },
  { value: "My Location", idx: 2 },
];
const Dashboard = () => {
  const { axiosFetch, navSize, changeSize } = useContext(AxiosContext);
  const [shopName, setShopName] = useState("");
  const [date, setDate] = useState({ start: "", end: "" });
  const [filterType, setFilterType] = useState(overlayCount[0].value);
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState();
  const [plan1, setPlan1] = useState();
  const [page, setPage] = useState();
  const [expired, setExpired] = useState(false);
  const [customMargin, setCustomMargin] = useState("0px");
  // let expired = "false";
  useEffect(() => {
    // console.log("$NAVSIZE", navSize)
    if (navSize === "small") setCustomMargin("-125px");
    else setCustomMargin("0px");
    // console.log(customMargin)
  }, [navSize]);

  const router = useRouter();

  const fetchUserShop = async () => {
    try {
      setLoading(true);
      const { data, status } = await getShopName(axiosFetch);
      console.log(data, "from fetchUserShop name");
      if (status === 200) {
        let store = data.split(".");
        setShopName(store[0]);
      } else {
        setShopName("");
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const planExpire = async (body) => {
    try {
      console.log("%%%", expired);
      const { data, status } = await getPlanExpire(axiosFetch, body);
      if (status === 200) {
        // console.log(response, "expire");
        console.log("data ==", data);
        if (data.expired) {
          setExpired(true);
        } else {
          // console.log("data of expire from else block", data);
          setExpired(false);
        }
      }
    } catch (e) {
      console.log("No response" + e);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };

  const app_blocks = async () => {
    try {
      const response = await axiosFetch(async (instance) => {
        const result = await instance.get("/store/dashboard/app_blocks");
        //console.log(result);
        return result;
      });
      console.log(response, "appppppppppppppppppppp");
      if (response.data[0].disabled) {
        return setShowModal(true);
      } else {
        setShowModal(false);
      }
    } catch (e) {
      console.log("No response" + e);
    }
  };

  // const planExpire = async (axiosFetch, date) => {
  //   try {
  //     console.log("%%%", expired);
  //     const response = await axios.post("/store/dashboard/check-plan", date);
  //     if (response.status === 200) {
  //       console.log(response, "expire");
  //       if (response.data.expired) {
  //         console.log("%%%", response.data);
  //         setExpired(true);
  //       } else {
  //         console.log("%%%", response.data);
  //         setExpired(false);
  //       }
  //     }
  //   } catch (e) {
  //     console.log("No response" + e);
  //   }
  // };

  const membership = async () => {
    try {
      const response = await axiosFetch(async (instance) => {
        const result = await instance.get("/store/membership/");
        return result;
      });
      const response1 = await axiosFetch(async (instance) => {
        const result = await instance.get("/store/dashboard/pages_count");
        return result;
      });
      console.log(response, "membership-1");
      console.log(response1, "membership-2");
      //setPlan1(response.data.membership.membership_plan);

      if (response.data?.membership?.membership_plan === "Free Plan") {
        const num = (response1.data.pages * 100) / 500;
        setPlan(num);
        setPlan1(response1.data.pages.toString() + "/500 Page");
      } else if (response.data?.membership?.membership_plan === "Pro Plan") {
        const num = (response1.data.pages * 100) / 25000;
        // console.log(num, "nnnnnnnnnnnnnnnnnn");
        setPlan(num);
        setPlan1(response1.data.pages.toString() + "/25000 Page");
      } else if (response.data?.membership?.membership_plan === "Vip Plan") {
        const num = (response1.data.pages * 100) / 200000;
        setPlan(num);
        setPlan1(response1.data.pages.toString() + "/200000 Page");
      } else if (response.data?.membership?.membership_plan === "Royal Plan") {
        const num = (response1.data.pages * 100) / 500000;
        setPlan(num);
        setPlan1(response1.data.pages.toString() + "/500000 Page ");
      } else if (response.data?.savedData?.membership_plan === "Free Plan") {
        setPlan(0);
        setPlan1("0/500 Page ");
      }
    } catch (e) {
      console.log("No response" + e);
    }
  };

  // const upgrade_plan = async () => {
  //   try {
  //     const response = await axiosFetch(async (instance) => {
  //       const result = await instance.get(
  //         "/store/membership/checkPlanUpgradeDetails"
  //       );
  //       return result;
  //     });
  //     console.log(response, "plannnnnnnnnnnnnnnnnnnnnn");
  //   } catch (e) {
  //     console.log("No response" + e);
  //   }
  // };

  // const page_count = async () => {
  //   try {

  //     console.log(response, "plannnnnnnnnnnnnnnnnnnnnn");
  //     console.log(response.data.pages, "plannnnnnnnnnnnnnnnnnnnnn");
  //     setPage(response.data.pages);
  //   } catch (e) {
  //     console.log("No response" + e);
  //   }
  // };

  useEffect(() => {
    fetchUserShop();
    timeAdjust();
    // page_count();
    membership();
    // upgrade_plan();
    app_blocks();
    changeSize("large");
  }, []);

  useEffect(() => {
    if (date.start && date.end) {
      // getPlanExpire(date);
      planExpire(date);
      console.log(date, "plan expire api ");
    }
  }, [date]);

  const updateDate = (data) => {
    // console.log("&&&",date);
    setDate(data);
    // console.log(data, '44');
  };

  function handleMenuClick(e) {
    message.info(`Showing ${overlayCount[e.key - 1].value} .`);
    setFilterType(overlayCount[e.key - 1].value);
    // console.log(e.key, "click");
  }
  const menu = (
    <Menu onClick={handleMenuClick}>
      {overlayCount.map((item) => (
        <Menu.Item key={item.idx}>{item.value}</Menu.Item>
      ))}
    </Menu>
  );

  function timeAdjust() {
    let date = new Date();
    let hr = date.getHours();
    console.log(hr, "hr");
    if (hr >= 0 && hr < 5) {
      setTime("mid night");
    } else if (hr >= 5 && hr < 12) {
      setTime("morning");
    } else if (hr >= 12 && hr < 14) {
      setTime("noon");
    } else if (hr >= 14 && hr < 17) {
      setTime("afternoon");
    } else if (hr >= 17 && hr < 22) {
      setTime("evening");
    } else {
      setTime("night");
    }
  }
  const content = (
    <div>
      <p>Upgrade your Plan.</p>
    </div>
  );

  return (
    <>
      {loading ? (
        <MyLoader />
      ) : (
        <div style={{ marginLeft: `${customMargin}` }}>
          {expired && <Notification />}
          {showModal && <Modal1 setShowModal={setShowModal} />}
          <div style={{ paddingTop: "20px" }}>
            <h2
              style={{ fontWeight: 700, marginTop: "10px", fontSize: "30px" }}
            >
              Dashboard
            </h2>
            <Title level={2} style={{ color: "#161688", fontWeight: 400 }}>
              Good {time}, {shopName}
            </Title>
            <Title
              level={5}
              style={{ color: "#161688", fontWeight: 400, marginTop: "-16px" }}
            >
              Things are looking good.
            </Title>
            <div
              style={{
                backgroundColor: "#f6f6f7",
                width: "99%",
                height: "40px",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              }}
            >
              {/* <h6 style={{ color: "blue", marginLeft: "20px" }}>Page View</h6> */}
              <Progress
                percent={plan}
                status="active"
                trailColor="#E2E8F0"
                strokeColor="orange"
                style={{
                  width: "90%",
                  height: "40px",
                  fontSize: "16px",
                  marginLeft: "10px",
                }}
                format={() => plan1}
              />
            </div>

            <div style={{}}>
              <Popover content={content} title="Upgrade Plan">
                <Button
                  style={{
                    borderRadius: "5px",
                    backgroundColor: "lightblue",
                    border: "none",
                    fontWeight: "600",
                    marginTop: "10px",
                  }}
                  onClick={() => {
                    router.push("/billing");
                  }}
                >
                  Upgrade Plan
                </Button>
              </Popover>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
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
                <div style={{ marginLeft: "8px", marginRight: "12px" }}>
                  {/* <Dropdown overlay={menu}>
                  <Button
                    style={{
                      fontWeight: 600,
                      fontSize: "15px",
                      color: "black",
                      alignItems: "center",
                    }}
                  >
                    {filterType} <DownOutlined style={{ marginLeft: "15px" }} />
                  </Button>
                </Dropdown> */}
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: "20px",
                marginRight: "8px",
                marginBottom: "48px",
              }}
            >
              <div className="1st_box" style={{ marginBottom: "16px" }}>
                <Row gutter={[16, 18]}>
                  <Col xs={24} sm={24} md={12} lg={14} xl={14}>
                    <LiveVisitors date={date} />
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                    <TotalVisits date={date} />
                  </Col>
                </Row>
              </div>
              <div className="2nd_box" style={{ marginBottom: "16px" }}>
                <Row gutter={[16, 18]}>
                  <Col xs={24} sm={24} md={12} lg={14} xl={14}>
                    <Row style={{ marginBottom: "16px" }}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Locations date={date} />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <ProductViewed date={date} />
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                    <Row style={{ marginBottom: "16px" }}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <TopPages date={date} />
                      </Col>
                    </Row>
                    <Row style={{ marginBottom: "16px" }}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Browser date={date} />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Devices date={date} />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              {/* <div className="3rd_box" style={{ marginBottom: "16px" }}>
                <Row gutter={[16, 18]}>
                  <Col xs={24} sm={24} md={12} lg={14} xl={14}>
                    <ProductViewed date={date} />
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={10} xl={10}>
                    <Browser date={date} />
                  </Col>
                </Row>
              </div> */}
              {/* <div className="4th_box" style={{ marginBottom: "16px" }}>
                <Row gutter={[16, 18]}>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Sources date={date} />
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Devices date={date} />
                  </Col>
                </Row>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
