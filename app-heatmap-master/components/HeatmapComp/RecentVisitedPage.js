import React, { useState, useEffect, useContext } from "react";
import { Typography, message, Popover, Button } from "antd";
import { Redirect } from "@shopify/app-bridge/actions";
import { useAppBridge } from "@shopify/app-bridge-react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { IconContext } from "react-icons";
const { Title, Paragraph } = Typography;
import { AxiosContext } from "../MyProvider";

const RecentVisitedPage = ({ date, isRender }) => {
  console.log(date);
  const { start, end } = date;
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const [totalPages, setPages] = useState([]);
  const { fetchRecentVisitedPages } = useContext(AxiosContext);
  const fetchRecentVisitPages = () => {
    if (window !== undefined) {
      // const urls = window.localStorage?.getItem("urls");
      const arrUrls = fetchRecentVisitedPages();
      // const arrUrls = JSON.parse(urls);
      // console.log(arrUrls);
      // console.log("$$",arrUrls)
      arrUrls.sort((a, b) => {
        let k = new Date(a.updated).getTime();
        let l = new Date(b.updated).getTime();
        return l - k;
      });
      console.log(arrUrls, "&&");
      if (arrUrls.length > 10) {
        let newUrls = arrUrls.slice(0, 10);
        setPages(newUrls);
      } else {
        setPages(arrUrls);
      }
      // let data = [];
      // console.log(totalPages, "all pages.");
      // if(start){
      //  data = arrUrls.filter(
      //     (d) => new Date(d?.updated).getTime() >= start
      //   );
      //   console.log("inside if");
      // }
      // if (end){
      //   data = arrUrls.filter(
      //     (d) => new Date(d?.updated).getTime() <= end
      //   );
      //   console.log("inside 2nd if");
      // }
      // console.log(data);
      // console.log(arrUrls);
      // setPages(data);
    }
  };
  // const handleDate = () => {
  //   if(totalPages){
  //     const res = fetchRecentVisitedPages();
  //     let data = [];
  //     console.log(totalPages, "all pages.");
  //     if(start){
  //      data = res.filter(
  //         (d) => new Date(d?.updated).getTime() >= start
  //       );
  //       console.log("inside if");
  //     }
  //     if (end){
  //       data = res.filter(
  //         (d) => new Date(d?.updated).getTime() <= end
  //       );
  //       console.log("inside 2nd if");
  //     }
  //     console.log(data);
  //     // console.log(arrUrls);
  //       setPages(data);
  //   }
  // }
  useEffect(() => {
    fetchRecentVisitPages();
  }, [isRender]);

  const redirectPage = (url) => {
    redirect.dispatch(Redirect.Action.REMOTE, {
      url: url,
      newContext: true,
    });
  };
  const pages = totalPages?.map((item, idx) => {
    return (
      <div style={{ marginBottom: "6px" }} key={idx}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ paddingRight: "10px" }}>{idx + 1}.</div>
            <div
              style={{ color: "#1890ff", cursor: "pointer" }}
              onClick={() => redirectPage(item?.url)}
            >
              {item.url}
            </div>
          </div>
          <div>{new Date(item.updated).toUTCString()}</div>
        </div>
      </div>
    );
  });
  const content = (
    <div style={{ marginTop: "-5px" }}>
      Click here, to clear your search history
    </div>
  );
  const removeHistory = () => {
    if (window !== undefined) {
      window.localStorage.removeItem("urls");
      message.success("search history cleared successfully.");
      fetchRecentVisitPages();
    }
  };
  return (
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Title
              level={4}
              style={{ color: "#558", fontWeight: 500, paddingLeft: "10px" }}
            >
              Last 10 Viewed Heatmap
            </Title>
          </div>
          <div style={{ paddingRight: "6px" }}>
            {totalPages && (
              <Popover
                content={content}
                title="Clear search history"
                trigger="hover"
              >
                <Button
                  style={{ borderRadious: "8px" }}
                  onClick={removeHistory}
                >
                  <IconContext.Provider
                    value={{ color: "blue", className: "global-class-name" }}
                  >
                    <span>
                      <RiDeleteBin5Line />
                    </span>
                  </IconContext.Provider>
                </Button>
              </Popover>
            )}
          </div>
        </div>
        <div style={{ marginBottom: "16px", marginTop: "10px" }}>
          {totalPages?.length ? (
            <div style={{ paddingLeft: "10px" }}> {pages}</div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
                color: "#555",
              }}
            >
              OPPS! there is no Recent visited page found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentVisitedPage;
