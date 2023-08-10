import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import MonthlyPrice from "./MonthlyPrice";
import SixMonthPrice from "./SixMonthPrice";
import OneYearPrice from "./OneYearPrice";

const FinalPricing = ({ currentPlan }) => {
  return (
    <>
      <Tabs align="center" width="100%" isFitted>
        <TabList>
          <Tab fontSize="17px" fontWeight="600">
            Monthly
          </Tab>
          <Tab fontSize="17px" fontWeight="600">
            6 Month(5% Off)
          </Tab>
          <Tab fontSize="17px" fontWeight="600">
            1 Year(10%Off)
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <MonthlyPrice currentPlan={currentPlan} />
          </TabPanel>
          <TabPanel>
            <SixMonthPrice currentPlan={currentPlan} />
          </TabPanel>
          <TabPanel>
            <OneYearPrice currentPlan={currentPlan} />
            {/* <p>1 year</p> */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default FinalPricing;
