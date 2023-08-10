import React, { useState, useEffect, useContext } from "react";
import { Typography } from "antd";
import { AxiosContext } from "../MyProvider";
import { Redirect } from "@shopify/app-bridge/actions";
import { useAppBridge } from "@shopify/app-bridge-react";
import { getMostVisitPages } from "../../API/heatmapPage";
import MyLoader from "../commonComp/MyLoader";
const { Title, Paragraph } = Typography;

const data1 = [
  { url: "first-app25.myshopify.com/pages/contact" },
  { url: "first-app25.myshopify.com/collections/all" },
  { url: "first-app25.myshopify.com/collections/all?gsdg" },
  { url: "first-app25.myshopify.com/collections/all" },
];
const MostVisitedPage = ({ date }) => {
  console.log(date);
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const { axiosFetch } = useContext(AxiosContext);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchMostVisitPages = async (body) => {
    try {
      setLoading(true);
      setStatusMsg("");
      setServerStatus(null);
      const { data, status } = await getMostVisitPages(axiosFetch, body);
      console.log(data, status, "fetchMostVisitPages");
      setServerStatus(status);
      if (status === 200) {
        setLoading(false);
        setPages(data);
      } else {
        setStatusMsg(
          "There is some internal server issue.\n Please reload the page or visit some time later."
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchMostVisitPages(date);
  }, [date]);

  const redirectPage = (url) => {
    redirect.dispatch(Redirect.Action.REMOTE, {
      url: url,
      newContext: true,
    });
  };
  // console.log(pages,'Pages of url')

  const newURL = pages?.map((item, idx) => {
    return item.name.split("?")[0];
  });

  // console.log(newURL,'Filtered url')

  var uniquePages = [...new Set(newURL)];

  // console.log(uniquePages,'unique url')

  const page = uniquePages?.map((item, idx) => {
    return (
      <div style={{ marginBottom: "6px" }} key={idx}>
        <div style={{ display: "flex" }}>
          <div style={{ paddingRight: "10px" }}>{idx + 1}.</div>
          <div
            style={{ color: "#1890ff", cursor: "pointer" }}
            onClick={() => redirectPage(item?.name)}
          >
            {item}
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      {loading ? (
        <div style={{ minHeight: "200px" }}>
          <MyLoader />
        </div>
      ) : (
        <div
          style={{
            paddingLeft: "10px",
            paddingRight: "24px",
            paddingTop: "16px",
            paddingBottom: "16px",
            boxShadow:
              "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
          }}
        >
          <div style={{ marginBottom: "14px" }}>
            <Title
              level={4}
              style={{ color: "#558", fontWeight: 500, paddingLeft: "10px" }}
            >
              Most Visited Pages
            </Title>
            <div style={{ marginBottom: "16px", marginTop: "10px" }}>
              {pages.length ? (
                <div style={{ paddingLeft: "10px" }}> {page}</div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                    color: "#555",
                  }}
                >
                  OOPS! there is no Most visited page found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div>
        {serverStatus === 200 ? (
          <></>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {statusMsg}
          </div>
        )}
      </div>
    </>
  );
};

export default MostVisitedPage;
