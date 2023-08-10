import React, { useState, useContext, useEffect } from "react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Privacy from "../components/settings/Privacy";
import General from "../components/settings/General";
import BlockedIP from "../components/settings/BlockedIP";
import BillingSlide from "../components/settings/BillingSlide";
import { AxiosContext } from "../components/MyProvider";

const Settings = () => {
  const { navSize } = useContext(AxiosContext);

  const [customMargin, setCustomMargin] = useState("0px");
  useEffect(() => {
    // console.log("$NAVSIZE", navSize)
    if (navSize === "small") setCustomMargin("-125px");
    else setCustomMargin("0px");
  }, [navSize]);

  return (
    <div style={{ marginLeft: `${customMargin}` }}>
      <div
        style={{ marginRight: "12px", marginLeft: "12px", marginTop: "10px" }}
      >
        <h2 style={{ fontWeight: 700, fontSize: "30px" }}>Settings</h2>
        <Tabs align="center" width="100%" isFitted>
          <TabList>
            {/* <Tab fontSize="17px" fontWeight="600">
            General
          </Tab>
          <Tab fontSize="17px" fontWeight="600">
            Privacy
          </Tab> */}
            <Tab fontSize="17px" fontWeight="600">
              Blocked IP address
            </Tab>
            <Tab fontSize="17px" fontWeight="600">
              Billing
            </Tab>
          </TabList>

          <TabPanels>
            {/* <TabPanel>
            <General />
          </TabPanel>
          <TabPanel>
            <Privacy />
          </TabPanel> */}
            <TabPanel>
              <BlockedIP />
            </TabPanel>
            <TabPanel>
              <BillingSlide />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
