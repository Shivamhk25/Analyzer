import React, { useState, useEffect, useContext } from "react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import TopBrowsers from "../components/analytics/TopBrowsers";
import TopDevices from "../components/analytics/TopDevices";
import TopPages from "../components/analytics/TopPages";
import More from "../components/analytics/More";
import TopLocations from "../components/analytics/TopLocations";
import { Table, Typography, Button, Menu, Dropdown, message } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { AxiosContext } from "../components/MyProvider";

const overlayCount2 = [
  { value: "MostRepeatVisitors" },
  { value: "TopPurchasers" },
  { value: "MostVisits" },
];

const Analytics = () => {
  const { axiosFetch, navSize } = useContext(AxiosContext);
  const [currentTable, setCurrentTable] = useState(overlayCount2[0].value);

  function handleMenuClick2(e) {
    setCurrentTable(overlayCount2[e.key].value);
    console.log(overlayCount2[e.key].value, "$$clicked$$");
  }

  const [customMargin, setCustomMargin] = useState("0px");
  useEffect(() => {
    // console.log("$NAVSIZE", navSize)
    if (navSize === "small") setCustomMargin("-125px");
    else setCustomMargin("0px");
  }, [navSize]);

  const menu2 = (
    <Menu onClick={handleMenuClick2}>
      {overlayCount2.map((item, i) => (
        <Menu.Item key={i}>{item.value}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div style={{ marginLeft: `${customMargin}` }}>
      <h2
        style={{
          fontWeight: 700,
          marginBottom: "20px",
          marginTop: "10px",
          fontSize: "30px",
        }}
      >
        Analytics
      </h2>
      <Tabs align="center" width="100%" isFitted>
        <TabList>
          <Tab fontSize="17px" fontWeight="600">
            Top Browsers
          </Tab>
          <Tab fontSize="17px" fontWeight="600">
            Top Devices
          </Tab>
          <Tab fontSize="17px" fontWeight="600">
            Top Locations
          </Tab>
          <Tab fontSize="17px" fontWeight="600">
            Top Pages
          </Tab>
          <Tab fontSize="17px" fontWeight="600">
            <Dropdown overlay={menu2}>
              <Button
                style={{
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "black",
                  height: "35px",
                  width: "160px",
                  alignItems: "center",
                }}
              >
                More <DownOutlined style={{ marginLeft: "15px" }} />
              </Button>
            </Dropdown>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <TopBrowsers />
          </TabPanel>
          <TabPanel>
            <TopDevices />
          </TabPanel>
          <TabPanel>
            <TopLocations />
          </TabPanel>
          <TabPanel>
            <TopPages />
          </TabPanel>
          <TabPanel>
            <More currentTable={currentTable} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Analytics;
