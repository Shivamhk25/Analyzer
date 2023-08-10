import React from "react";
import Img1 from "../../images/instruction/5.jpg";
import Img6 from "../../images/instruction/6.jpg";

const Page3 = () => {
  return (
    <div className="step1_con">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginLeft: "auto",
        }}
      ></div>
      <div className="demo_box">
        <p style={{ paddingBottom: "12px", paddingTop: "5px" }}>
          5) Heatmap activity can be viewed from the heatmap page which shall
          allow admin's to check what their bulk of users on doing on any
          specific page within a given date range.
        </p>
        <img src={Img1} alt="img1" />
      </div>
      <div className="demo_box">
        <p style={{ paddingBottom: "12px", paddingTop: "25px" }}>
          6) Analytics section provides Actionable insights which in turn help
          in improving the usability of your website.
        </p>
        <img src={Img6} alt="img6" />
      </div>
    </div>
  );
};

export default Page3;
