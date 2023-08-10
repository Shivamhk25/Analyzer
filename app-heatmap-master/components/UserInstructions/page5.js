import React from "react";
import Img3 from "../../images/instruction/10.jpg";
import Img4 from "../../images/instruction/11.jpg";
const Page5 = () => {
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
        <p style={{ paddingBottom: "12px", paddingTop: "10px" }}>
          3) Now, Click on app embeds button.
        </p>
        <img src={Img3} alt="img5" />
        <p style={{ paddingBottom: "12px", paddingTop: "10px" }}>
          4) After clicking on App embeds, We have to enable Heatmap script
          button.
        </p>
        <img src={Img4} alt="img4" />
        <p
          style={{
            paddingBottom: "20px",
            paddingTop: "25px",
            fontSize: "20px",
          }}
        >
          Finally, Click on <span className="highlited">Save</span> button to
          save your settings.
        </p>
        <p style={{ paddingBottom: "12px", paddingTop: "10px" }}>
          For any help in Integration you can contact us at{" "}
          <a href="mailto:support@z08tech.com" style={{ color: "blue" }}>
            {" "}
            support@z08tech.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page5;
