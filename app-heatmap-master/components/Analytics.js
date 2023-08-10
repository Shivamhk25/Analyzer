import React from "react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import TopBrowsers from "./analytics/TopBrowsers";
import TopPages from "./analytics/TopPages";
import TopDevices from "./analytics/TopDevices";
import More from "./analytics/More";
import MyBrow from "../components/analytics/mybrow";

const analytics = () => {
  return (
    <>
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
            Top browsers
          </Tab>
          <Tab fontSize="17px" fontWeight="600">
            Top Pages
          </Tab>
          <Tab fontSize="17px" fontWeight="600">
            More
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel></TabPanel>
          <TabPanel>
            <TopDevices />
          </TabPanel>
          <TabPanel>
            <TopBrowsers />
          </TabPanel>
          <TabPanel>
            <p>four!</p>
          </TabPanel>
          <TabPanel>
            <TopPages />
          </TabPanel>
          <TabPanel>
            <More />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default analytics;
