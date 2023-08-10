import React, { useState, useEffect, useCallback, useContext } from "react";
import { AxiosContext } from "../MyProvider";
import { getProductsViewed } from "../../API/api2";
import {
  Typography,
  Button,
  Menu,
  Dropdown,
  message,
  Row,
  Col,
  Progress,
  Tooltip,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import MyLoader from "../commonComp/MyLoader";
import { getShopName } from "../../API/billingApi";

const { Title, Paragraph } = Typography;

const overlayCount = [{ value: "Shopify", idx: 1 }];
const ProductViewed = ({ date }) => {
  const { axiosFetch } = useContext(AxiosContext);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filterType, setFilterType] = useState(overlayCount[0].value);
  const [productView, setProductView] = useState(0);
  const [addedToCart, setPurchased] = useState(0);
  const [purchased, setAddedToCart] = useState(0);
  const [complete, setComplete] = useState(0);
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [shopName, setShopName] = useState("");

  const fetchData = async (body) => {
    try {
      setLoading(true);
      setStatusMsg("");
      setServerStatus(null);
      const { data, status } = await getProductsViewed(axiosFetch, body);
      console.log(data, "fetch product views");
      setServerStatus(status);
      if (status === 200 && data) {
        const {
          product_viewed,
          product_added_to_cart,
          product_purchased,
          complete,
        } = data;
        setTotalProducts(
          product_viewed + product_added_to_cart + product_purchased + complete
        );
        setProductView(product_viewed);
        setPurchased(product_purchased);
        setAddedToCart(product_added_to_cart);
        setComplete(complete);
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

  const fetchUserShop = async () => {
    try {
      setLoading(true);
      setStatusMsg("");
      setServerStatus(null);
      const { data, status } = await getShopName(axiosFetch);
      console.log(data, "from fetchUserShop name");
      setServerStatus(status);
      if (status === 200) {
        let store = data.split(".");
        setShopName(store[0]);
        setLoading(false);
      } else {
        setShopName("");
        setStatusMsg(
          "There is some internal server issue.\n Please reload the page or visit some time later."
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchUserShop();
  }, []);
  useEffect(() => {
    if (date.start && date.end) {
      fetchData(date);
    }
  }, [date]);

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
  const getPercentage = (value, totalValue = totalProducts || 1) => {
    let parcen = (value / totalValue) * 100;
    let roundParcentage = Math.round(parcen * 100) / 100;
    return roundParcentage;
  };
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
          <div
            style={
              {
                // boxShadow:
                //   "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
              }
            }
          >
            {/* <div
              style={{
                marginBottom: "26px",
                paddingRight: "20px",
              }}
            >
              <Dropdown overlay={menu}>
                <Button
                  size="large"
                  style={{
                    fontWeight: 500,
                    fontSize: "20px",
                    color: "#588",
                    alignItems: "center",
                    padding: "0 32px",
                  }}
                >
                  {filterType} <DownOutlined style={{ marginLeft: "15px" }} />
                </Button>
              </Dropdown>
            </div> */}
            <div style={{ marginBottom: "16px" }}>
              <Title
                level={4}
                style={{ color: "#588", fontWeight: 500, paddingLeft: "20px" }}
              >
                {shopName}
              </Title>
            </div>
            <div style={{ marginBottom: "16px", paddingRight: "12px" }}>
              <Row gutter={[16, 18]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div style={{ marginRight: "5px" }}>
                    <Tooltip title={`${productView} Product Viewed `}>
                      <Progress
                        percent={getPercentage(productView)}
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
                    <Paragraph style={{ color: "#555", paddingLeft: "5px" }}>
                      Product viewed
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div style={{ marginRight: "5px" }}>
                    <Tooltip title={`${addedToCart} checkout initiated `}>
                      <Progress
                        percent={getPercentage(addedToCart)}
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
                    <Paragraph style={{ color: "#555", paddingLeft: "5px" }}>
                      Product checkout initiated
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div style={{ marginRight: "5px" }}>
                    <Tooltip title={`${purchased} Product purchased `}>
                      <Progress
                        percent={getPercentage(purchased)}
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
                    <Paragraph style={{ color: "#555", paddingLeft: "5px" }}>
                      Product purchased
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {/* <div>
                      <Tooltip title={`${complete} Complete `}>
                        <Progress
                          type="circle"
                          strokeColor={{ "0%": "#fc9860", "100%": "#F7CE68" }}
                          percent={getPercentage(complete)}
                          status="active"
                          trailColor="#DFD7F1"
                          strokeWidth={8}
                          width={150}
                        />
                      </Tooltip>
                      <Paragraph
                        style={{
                          color: "#555",
                          marginLeft: "auto",
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "6px",
                        }}
                      >
                        Product complete
                      </Paragraph>
                    </div> */}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <div></div>
            <div style={{ marginRight: "16px" }}>
              {/* <Button style={{ padding: "0px 35px", color: "#555", fontSize: 16 }}>
            View Funnels
          </Button> */}
            </div>
          </div>
        </div>
      )}
      <div>{serverStatus === 200 ? <></> : <div>{statusMsg}</div>}</div>
    </>
  );
};

export default ProductViewed;
