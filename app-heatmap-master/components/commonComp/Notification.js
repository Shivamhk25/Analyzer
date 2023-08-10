import React from "react";
const Navigation = () => {
  return (
    <div
      style={{
        display: "block",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "2rem",
          color: "white",
          background: "red",
          paddingLeft: "15px",
          paddingTop: "5px",
        }}
      >
        Your plan has expired . Please upgrade to new plan
      </div>
    </div>
  );
};

export default Navigation;
