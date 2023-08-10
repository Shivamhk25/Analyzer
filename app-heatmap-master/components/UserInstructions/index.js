import React, { useState, useEffect, useContext } from "react";
import { AxiosContext } from "../MyProvider";
import Page1 from "./page1";
import Page2 from "./page2";
import Page3 from "./page3";
import Page4 from "./page4";
import Page5 from "./page5";
//import Page6 from "./page6";
import LastPage from "./lastpage";
import { BiLeftArrowAlt } from "react-icons/bi";
import { IconContext } from "react-icons";
import { getShopName } from "../../API/billingApi";
import AlertDialogExample from "../commonComp/alert";

const index = () => {
  const { axiosFetch, changeSize, navSize } = useContext(AxiosContext);
  const [shopName, setShopname] = useState("");
  const [stepNo, setStepNo] = useState(1);
  const [stepName, setStepName] = useState("");
  const getShop = async () => {
    try {
      const res = await getShopName(axiosFetch);
      console.log(res, "ressssssssssssssssssssssssss");
      setShopname(res.data.replace(".myshopify.com", ""));
    } catch (e) {
      console.log(e);
    }
  };

  const [customMargin, setCustomMargin] = useState("0px");
  useEffect(() => {
    // console.log("$NAVSIZE", navSize)
    if (navSize === "small") setCustomMargin("-125px");
    else setCustomMargin("0px");
  }, [navSize]);

  useEffect(() => {
    changeSize("small");
    getShop();
  }, []);

  useEffect(() => {
    if (stepNo === 1) {
      setStepName("General");
    } else if (stepNo === 2) {
      setStepName("Select Preset");
    } else {
      setStepName("Launch");
    }
  }, [stepNo]);
  const backBtnHandeler = () => {
    if (stepNo > 1) {
      setStepNo((item) => item - 1);
    }
  };
  const nextBtnHandeler = () => {
    if (stepNo < 6) {
      setStepNo((item) => item + 1);
    }
  };
  return (
    <div className="ins_overlay_con" style={{ marginLeft: `${customMargin}` }}>
      <div className="ins_overlay_box">
        <div className="ins_container">
          {stepNo === 1 && (
            <div className="step_desc_header_con">
              <div className="step_desc_header">
                <div className="desc_header">
                  <h2 className="deb_header">
                    Hi! &nbsp; {shopName.toUpperCase()} &nbsp; ADMIN 👋😊
                  </h2>
                  <p className="deb_para">Welcome to Z08 Heatmap App</p>
                  <p className="deb_para">
                    Thank you for trusting and using Z08 app.
                  </p>
                  <p className="deb_para">
                    Please follow these setup instructions for successful
                    installation and usage.
                  </p>
                </div>
              </div>
            </div>
          )}

          {stepNo !== 6 && (
            <div className="steper_con">
              <div className="left_steper">
                {stepNo !== 1 && (
                  <button className="back_btn" onClick={backBtnHandeler}>
                    <IconContext.Provider
                      value={{ color: "#355", className: "abcd", size: "18px" }}
                    >
                      <span>
                        <BiLeftArrowAlt />
                      </span>
                    </IconContext.Provider>
                  </button>
                )}
                <div className="step_name">Step {stepNo}:</div>
              </div>
              <div className="right_steper">
                <button className="next_btn" onClick={nextBtnHandeler}>
                  Next
                </button>
                <AlertDialogExample />
              </div>
            </div>
          )}
          <div className="step_item_box">
            {stepNo === 1 ? (
              <Page1 />
            ) : stepNo === 2 ? (
              <Page2 />
            ) : stepNo === 3 ? (
              <Page3 />
            ) : stepNo === 4 ? (
              <Page4 />
            ) : stepNo === 5 ? (
              <Page5 />
            ) : (
              // ) : stepNo === 6 ? (
              //   <Page6 />
              // )
              <LastPage />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
