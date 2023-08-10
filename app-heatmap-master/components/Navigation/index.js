import { Navigation } from "@shopify/polaris";
import { useRouter } from "next/dist/client/router";
import React from "react";
import {
  HomeMajor,
  TextBlockMajor,
  FollowUpEmailMajor,
  SettingsMajor,
} from "@shopify/polaris-icons";

export default function NavigationComponent() {
  const router = useRouter();
  console.log(router.route);
  return (
    <Navigation location="/">
      <Navigation.Section
        items={[
          {
            label: "Dashboard",
            icon: HomeMajor,
            // onClick: () => {
            //   router.push("/");
            // },
          },
          {
            label: "Analytics",
            icon: TextBlockMajor,
            // onClick: () => {
            //   router.push("/analytics");
            // },
          },
          {
            label: "Communications",
            icon: FollowUpEmailMajor,
            // onClick: () => {
            //   router.push("/communicate");
            // },
          },
          {
            label: "Visitors",
            icon: FollowUpEmailMajor,
            // onClick: () => {
            //   router.push("/visitors");
            // },
          },
          {
            label: "Settings",
            icon: SettingsMajor,
            // onClick: () => {
            //   router.push("/registration");
            // },
          },
        ]}
      />
    </Navigation>
  );
}
