import React, { useEffect, useState, useContext } from "react";
import { Frame, Layout, Page } from "@shopify/polaris";
import FinalPricing from "./FinalPricing";
import { Heading } from "@chakra-ui/layout";
import CurrentPlan from "./CurrentPlan";
import { getCurrentPlan } from "../../API/billingApi";
import { AxiosContext } from "../MyProvider";

const index = () => {
  const [currentPlan, setCurrentPlan] = useState("");
  const { axiosFetch, navSize } = useContext(AxiosContext);

  const fetCurrentPlan = async () => {
    const { data } = await getCurrentPlan(axiosFetch);
    console.log("CURRENT_PLAN", data);
    if (typeof data === "string") {
      setCurrentPlan(data);
    } else {
      setCurrentPlan(data?.membership.membership_plan);
    }
  };

  useEffect(() => {
    fetCurrentPlan();
  }, []);

  const [customMargin, setCustomMargin] = useState("0px");
  useEffect(() => {
    // console.log("$NAVSIZE", navSize)
    if (navSize === "small") setCustomMargin("-140px");
    else setCustomMargin("0px");
  }, [navSize]);

  return (
    <div style={{ paddingTop: "1.5rem", marginLeft: `${customMargin}` }}>
      <Layout>
        <Layout.Section>
          <Page>
            <CurrentPlan data={currentPlan} />
            <br />
            <br />
            <br />
            <Heading mt={-8} colour="black" as="h2" size="xl">
              Billing
            </Heading>
            <br />
            <FinalPricing currentPlan={currentPlan} />
          </Page>
        </Layout.Section>
      </Layout>
    </div>
  );
};

export default index;
