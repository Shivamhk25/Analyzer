import React, { useState, useEffect, useContext } from "react";
import { AutoComplete, Button, Typography, message } from "antd";
import { AxiosContext } from "../MyProvider";
import { searchUrl } from "../../API/heatmapPage";
import { Redirect } from "@shopify/app-bridge/actions";
import { useAppBridge } from "@shopify/app-bridge-react";
import { generateAuthToken } from "../../API/api4";
import MyIsoRangePicker from "../commonComp/MyIsoRangePicker";
const { Title } = Typography;
const storeRecentPageCount = 5;

const SearchBar = ({ render, date }) => {
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const { axiosFetch, recentVisitedPagesUpdate } = useContext(AxiosContext);
  const [value, setValue] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [findLcStrg, setFindLcStrg] = useState(true);
  const [storeSelected, setStoreSelected] = useState("");
  const [isoDate, setIsoDate] = useState({});

  const fetchToken = async () => {
    const { data, status } = await generateAuthToken(axiosFetch);
    console.log(data, status, "fetchToken1");
    return data.token;
  };

  const fetchUrl = async (term) => {
    const { data, status } = await searchUrl(axiosFetch, term, isoDate);
    console.log(data.data, "fetchUrl", status);
    let dataArr = data.data;
    if (status === 200) {
      let buildItem = [];

      if (dataArr) {
        for (let x = 0; x < dataArr.length; x++) {
          console.log(dataArr[x], "item");
          // let item = { value: dataArr[x].url.split("?")[0] };
          buildItem.push(dataArr[x].url?.split("?")[0]);
        }
      }
      // console.log(buildItem)
      let uniquePages = [...new Set(buildItem)];
      let final = [];
      for (let x = 0; x < uniquePages.length; x++) {
        let item = { value: uniquePages[x] };
        final.push(item);
      }
      // console.log("$$",final);
      setOptions(final);

      // console.log(buildItem, "$$search result$$==",isoDate);
      // console.log(uniquePages, "$$search resu$$");
      // var uniquePages = [...new Set(buildItem)];
      // setOptions(uniquePages);
      // setOptions(buildItem);
      // let items = [
      //     { value: "https://www.datotta.com/" },
      //     { value: "http://www.datotta.com/home" },
      //     { value: "http://www.datotta.com/about" }
      // ];
      // setOptions(items);
    } else {
      message.error(
        "There is some internal server issue.\n Please reload the page or visit some time later."
      );
    }
  };

  const updateIso = (iso) => {
    console.log(iso, "from searchbar");
    setIsoDate(iso);
  };

  useEffect(() => {
    const TimerId = setTimeout(() => {
      if (value) {
        fetchUrl(value, date);
      }
    }, 1200);
    return () => clearTimeout(TimerId);
  }, [value, isoDate]);

  const storeInLS = (data) => {
    // let strUrls = JSON.stringify(data);
    // if(window !== undefined) {
    //   window.localStorage.setItem("urls", strUrls);
    // }
    recentVisitedPagesUpdate(data);
  };

  useEffect(() => {
    if (window !== undefined && storeSelected) {
      // const urls = window.localStorage?.getItem("urls");
      const urls = null;
      if (urls) {
        const arrUrls = JSON.parse(urls);
        if (arrUrls.length < storeRecentPageCount) {
          let item = { url: storeSelected, updated: new Date().toISOString() };
          arrUrls.unshift(item);
          storeInLS(arrUrls);
        } else {
          let item = { url: storeSelected, updated: new Date().toISOString() };
          let sliceArr = arrUrls.slice(0, storeRecentPageCount - 1);
          sliceArr.unshift(item);
          storeInLS(sliceArr);
        }
      } else {
        let item = { url: storeSelected, updated: new Date().toISOString() };
        let newUrls = [];
        newUrls.unshift(item);
        storeInLS(newUrls);
      }
      // setStoreSelected('');
      render();
    }
  }, [findLcStrg]);

  const onSelect = (data) => {
    console.log("onSelect", data);
    setSelectedValue(data);
    setStoreSelected(data);
  };

  const onChange = (data) => {
    console.log(isoDate.start, isoDate.end);
    setValue(data);
  };
  const onSearch = (searchText) => {
    console.log(searchText);
  };

  const handleNext = async () => {
    if (selectedValue) {
      try {
        let token = await fetchToken();
        console.log(token);
        if (!token) {
          alert("token undefined");
          return;
        }
        console.log(token, "token");
        let fullUrl = `${selectedValue}?id=${token}&start=${isoDate.start}&end=${isoDate.end}`;
        console.log(fullUrl, "redirect url");
        // redirect.dispatch(Redirect.Action.REMOTE, {
        //   url: 'heatmap-testing001.myshopify.com/collections/all',
        //   newContext: true,
        // });
        window.open(fullUrl, "_blank");
        setFindLcStrg(!findLcStrg);
      } catch (e) {
        console.log(e);
      }
    } else {
      message.warning("Select a valid url.");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div
        style={{
          backgroundImage: "linear-gradient(to right, tomato, #F6E05E)",
          paddingTop: "30px",
          paddingBottom: "20px",
          borderRadius: "5px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "2px 10px 2px 6px",
          }}
        >
          <div></div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>
              <MyIsoRangePicker prevDate={7} getIso={updateIso} />
            </div>
          </div>
        </div>
        <div style={{ padding: "10px 22px" }}>
          <Title level={2} style={{ color: "#efffff" }}>
            Enter a URL on your site to start with.....
          </Title>
          <Title level={5} style={{ color: "#efffff" }}>
            You will be able to navigate from page to page. Including those
            behind logins.{" "}
          </Title>
        </div>
        <div style={{ padding: "10px 22px" }}>
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ width: "90%" }}>
              <AutoComplete
                value={value}
                options={options}
                style={{
                  width: "100%",
                }}
                onSelect={onSelect}
                // onSearch={onSearch}
                onChange={onChange}
                placeholder={
                  options.length === 0
                    ? "Search a URL in this form :url.myshopify.com"
                    : "Search a URL in this form : " + options[0].value
                }
              />
            </div>
            <div style={{ paddingLeft: "5px" }}>
              <Button
                type="primary"
                style={{ borderRadius: "2px" }}
                onClick={handleNext}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
