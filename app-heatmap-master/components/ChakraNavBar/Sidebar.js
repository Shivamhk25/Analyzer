import React, { useState } from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import {
  FiMenu,
  FiHome,
  FiMapPin,
  FiTruck,
  FiDollarSign,
  FiSettings,
  FiBell,
  FiChevronsLeft,
} from "react-icons/fi";
import { FaChartPie } from "react-icons/fa";
import {
  MdDashboard,
  MdPeopleAlt,
  MdCameraAlt,
  MdLocationOn,
  MdSettings,
} from "react-icons/md";
import help from "../../images/icon/help.png";
import analytics from "../../images/icon/analytics.png";
import Billing from "../../images/icon/billing.png";
import dashboard from "../../images/icon/dashboard.png";
import heatmap from "../../images/icon/heatmap.png";
import recording from "../../images/icon/recording.png";
import setting from "../../images/icon/setting.png";
import visitor from "../../images/icon/visitor.png";

import { IoPawOutline } from "react-icons/io5";
import NavItem from "./NavItem";
//import TopBar from "../TopBar/TopBar";

export default function Sidebar(props) {
  // const [navSize, changeNavSize] = useState("large");
  return (
    <>
      <Flex
        pos="sticky"
        backgroundColor="#2A4365"
        // backgroundColor="green"

        left="5"
        h="100vh"
        marginTop="0vh"
        boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
        borderRadius={0}
        w={props.navSize == "small" ? "75px" : "200px"}
        flexDir="column"
        justifyContent="space-between"
      >
        <Flex
          p="5%"
          flexDir="column"
          w="100%"
          alignItems={props.navSize == "small" ? "center" : "flex-start"}
          as="nav"
        >
          <NavItem
            navSize={props.navSize}
            route="/dashboard"
            icon={MdDashboard}
            title="Dashboard"
            description="This is the description for the dashboard."
          />
          <NavItem
            navSize={props.navSize}
            route="/visitors"
            icon={MdPeopleAlt}
            title="Visitors"
          />
          <NavItem
            navSize={props.navSize}
            route="/recordings"
            icon={MdCameraAlt}
            title="Recordings"
          />
          <NavItem
            navSize={props.navSize}
            route="/heatmapPage"
            icon={MdLocationOn}
            title="Heat Map"
          />
          <NavItem
            navSize={props.navSize}
            route="/analytics"
            icon={FaChartPie}
            title="Analytics"
          />
          <NavItem
            navSize={props.navSize}
            route="/settings"
            icon={MdSettings}
            title="Settings"
          />
          <NavItem
            navSize={props.navSize}
            route="/billing"
            icon={FiDollarSign}
            title="Billing"
          />
          {/* <NavItem
            navSize={props.navSize}
            route={window.open("mailto:support@z08tech.com")}
            icon={FiDollarSign}
            url
            title="Billing"
          /> */}
        </Flex>
      </Flex>
    </>
  );
}
