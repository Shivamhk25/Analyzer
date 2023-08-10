import React from "react";
import { SiWindows, SiMacos, SiKalilinux } from "react-icons/si";
import { FcAndroidOs, FcLinux } from "react-icons/fc";
import { VscTerminalUbuntu } from "react-icons/vsc";
import { MdOutlineDeviceUnknown } from "react-icons/md";
import { IconContext } from "react-icons";

const OSIcon = (name) => {
  if (name?.toLowerCase().includes("macos")) {
    return (
      <IconContext.Provider
        value={{ color: "#855", className: "global-class-name" }}
      >
        <span style={{ marginRight: "5px" }}>
          <SiMacos />
        </span>
      </IconContext.Provider>
    );
  } else if (name?.toLowerCase().includes("windows")) {
    return (
      <IconContext.Provider
        value={{ color: "#855", className: "global-class-name" }}
      >
        <span style={{ marginRight: "5px" }}>
          <SiWindows />
        </span>
      </IconContext.Provider>
    );
  } else if (name?.toLowerCase().includes("android")) {
    return (
      <IconContext.Provider
        value={{ color: "#855", className: "global-class-name" }}
      >
        <span style={{ marginRight: "5px" }}>
          <FcAndroidOs />
        </span>
      </IconContext.Provider>
    );
  } else if (name?.toLowerCase().includes("linux")) {
    return (
      <IconContext.Provider
        value={{ color: "#855", className: "global-class-name" }}
      >
        <span style={{ marginRight: "5px" }}>
          <FcLinux />
        </span>
      </IconContext.Provider>
    );
  } else if (name?.toLowerCase().includes("ubuntu")) {
    return (
      <IconContext.Provider
        value={{ color: "#855", className: "global-class-name" }}
      >
        <span style={{ marginRight: "5px" }}>
          <VscTerminalUbuntu />
        </span>
      </IconContext.Provider>
    );
  } else if (name?.toLowerCase().includes("kali")) {
    return (
      <IconContext.Provider
        value={{ color: "#855", className: "global-class-name" }}
      >
        <span style={{ marginRight: "5px" }}>
          <SiKalilinux />
        </span>
      </IconContext.Provider>
    );
  } else {
    return (
      <IconContext.Provider
        value={{
          color: "#855",
          className: "global-class-name",
          size: "22px",
        }}
      >
        <span style={{ marginRight: "5px" }}>
          <MdOutlineDeviceUnknown />
        </span>
      </IconContext.Provider>
    );
  }
};

export default OSIcon;
