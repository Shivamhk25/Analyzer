import React from "react";
import {
  SiSafari,
  SiGooglechrome,
  SiFirefox,
  SiOpera,
  SiInternetexplorer,
  SiBrave,
} from "react-icons/si";
import { IconContext } from "react-icons";
import { GrStatusUnknown } from "react-icons/gr";

const BrowserIcon = (name) => {
  if (name?.toLowerCase().includes("chrome")) {
    return (
      <IconContext.Provider
        value={{ color: "#855", className: "global-class-name" }}
      >
        <span style={{ marginRight: "5px" }}>
          <SiGooglechrome />
        </span>
      </IconContext.Provider>
    );
  } else if (name?.toLowerCase().includes("safari")) {
    return (
      <IconContext.Provider
        value={{ color: "#855", className: "global-class-name" }}
      >
        <span style={{ marginRight: "5px" }}>
          <SiSafari />
        </span>
      </IconContext.Provider>
    );
  } else if (name?.toLowerCase().includes("firefox")) {
    return (
      <IconContext.Provider
        value={{ color: "#855", className: "global-class-name" }}
      >
        <span style={{ marginRight: "5px" }}>
          <SiFirefox />
        </span>
      </IconContext.Provider>
    );
  } else if (name?.toLowerCase().includes("opera")) {
    return (
      <IconContext.Provider
        value={{ color: "#855", className: "global-class-name" }}
      >
        <span style={{ marginRight: "5px" }}>
          <SiOpera />
        </span>
      </IconContext.Provider>
    );
  } else if (name?.toLowerCase().includes("internetexplorer")) {
    return (
      <IconContext.Provider
        value={{ color: "#855", className: "global-class-name" }}
      >
        <span style={{ marginRight: "5px" }}>
          <SiInternetexplorer />
        </span>
      </IconContext.Provider>
    );
  } else if (name?.toLowerCase().includes("brave")) {
    return (
      <IconContext.Provider
        value={{ color: "#855", className: "global-class-name" }}
      >
        <span style={{ marginRight: "5px" }}>
          <SiBrave />
        </span>
      </IconContext.Provider>
    );
  } else {
    return (
      <IconContext.Provider
        value={{ color: "#855", className: "global-class-name" }}
      >
        <span style={{ marginRight: "5px" }}>
          <GrStatusUnknown />
        </span>
      </IconContext.Provider>
    );
  }
};

export default BrowserIcon;
