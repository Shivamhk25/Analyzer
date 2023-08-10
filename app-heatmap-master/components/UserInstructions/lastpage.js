import React, { useState, useContext } from "react";
import { AxiosContext } from "../MyProvider";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { postReadInst } from "../../API/billingApi";
import { Router, useRouter } from "next/dist/client/router";
import Img4 from "../../images/instruction/congrts.png";

const LastPage = () => {
  const { axiosFetch, redirect } = useContext(AxiosContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const redirectPage = (redirecturl) => {
    redirect.dispatch(Redirect.Action.APP, redirecturl);
  };
  const goToSettings = async () => {
    try {
      setLoading(true);
      const { data, status } = await postReadInst(axiosFetch);
      console.log(data, "post read ins");
      if (status === 200) {
        router.push("/dashboard");
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="last_page_con">
      <div className="step1_con">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginLeft: "auto",
          }}
        >
          <h3 style={{ fontSize: "25px", color: "#548cff", fontWeight: 600 }}>
            Congratulations!
          </h3>
        </div>
        <div
          className="demo_box"
          style={{
            display: "flex",
            justifyContent: "center",
            marginLeft: "auto",
          }}
        >
          <div>
            <p>Congratulations on Completing the setup.</p>
            {/* <p>
              Click on <span className="highlited">Dashboard</span> to visit
              'Dashboard' page.
            </p> */}
            <p>
              Click on <span className="highlited">Go to Dashboard</span> button
              to visit Dashboard page.
            </p>
            {/* <button
              className="back_btn"
              style={{backgroundColor:'lightblue'}}
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              DashBoard
            </button> */}
            <img
              src={Img4}
              style={{
                width: "200px",
                height: "200px",
                marginLeft: "30%",
                marginTop: "45px",
              }}
            ></img>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="footer_deb">
          <div style={{ marginRight: "12px", marginLeft: "30%" }}>
            <button
              className="next_btn"
              onClick={() => {
                goToSettings();
              }}
              disabled={loading}
            >
              {loading ? "loading..." : "Go to Dashboard"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastPage;
