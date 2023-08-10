import React from "react";
import Img2 from "../../images/instruction/1.jpg";
import Img3 from "../../images/instruction/2.jpg";

const Page1 = () => {
  return (
    <div className="step1_con">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginLeft: "auto",
        }}
      >
        <h3 style={{ fontSize: "18px", color: "#548cff", fontWeight: 500 }}>
          Steps to move in Heatmap App
        </h3>
      </div>
      <div className="demo_box">
        <p>
          Once you complete the setup instructions you can go ahead and use the
          app as per your convenience.
        </p>
        {/* <img src={Img0} alt="img0" /> */}

        <p style={{ paddingBottom: "12px" }}>
          1) In Our app there is a Dashboard page where user can see all the
          real time data of live users,new users,top browsers,top location and
          many more....
        </p>
        <img src={Img2} alt="img2" />

        <p style={{ paddingBottom: "12px", paddingTop: "15px" }}>
          2) In visitor page you can see the visitors of your website in
          chronological order of their session visits
        </p>
        <img src={Img3} alt="img3" />
      </div>
    </div>
  );
};

export default Page1;
