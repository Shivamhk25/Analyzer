import React from "react";
import Img1 from "../../images/instruction/8.jpg";
import Img2 from "../../images/instruction/9.jpg";

const Page4 = () => {
  return (
    <div className="step1_con">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginLeft: "auto",
        }}
      >
        <h3 style={{ fontSize: "18px", color: "red", fontWeight: 500 }}>
          Please Follow these steps for Online Store 2.0 Themes
        </h3>
      </div>
      <div className="demo_box">
        <p className="deb_para" style={{ textColor: "black" }}>
          For any help in Integration you can contact us at{" "}
          <a href="mailto:support@z08tech.com" style={{ color: "blue" }}>
            {" "}
            support@z08tech.com
          </a>
        </p>
        <p style={{ paddingBottom: "12px" }}>
          1) In your store, Click on customize Button.
        </p>
        <img src={Img1} alt="img2" />
        <p style={{ paddingBottom: "12px", paddingTop: "15px" }}>
          2) On this page, Click theme settings Button.
        </p>
        <img src={Img2} alt="img3" />
      </div>
    </div>
  );
};

export default Page4;
