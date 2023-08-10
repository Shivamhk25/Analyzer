import React from "react";
import Img5 from "../../images/instruction/3.jpg";
import Img4 from "../../images/instruction/4.jpg";

const Page2 = () => {
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
          3) In recordings page you can view the session recordings of each
          visitor along with real time live visitor's action for the users
          currently viewing your site.
        </p>
        <img src={Img5} alt="img5" />
        {/* <p style={{ paddingBottom: "12px", paddingTop: "15px" }}>
          2) <span className="highlited">In all the fields </span> You can
          select any option available for particular field.
        </p> */}
        <p style={{ paddingBottom: "12px", paddingTop: "25px" }}>
          4) This is how the recordings can be seen in the recordings section of
          the app. &#128071;
        </p>

        <img src={Img4} alt="img4" />
      </div>
    </div>
  );
};

export default Page2;
