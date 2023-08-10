import React, { useState, useEffect, useContext, useRef } from "react";

import { AxiosContext } from "../components/MyProvider";
import { Router, useRouter } from "next/dist/client/router";
import { Button } from "antd";

import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";
import MyLoader from "../components/commonComp/MyLoader";

const recorder = (props) => {
  const { axiosFetch } = useContext(AxiosContext);
  console.log(props.id);
  const router = useRouter();
  const {
    query: { id },
  } = router;
  console.log(id, "id");
  // let id = props.id;
  const playerElRef = useRef();
  const [events, setEvents] = useState();
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(600);
  const [dimension, setDimension] = useState(false);

  function getdimension() {
    if (playerElRef.current) {
      setHeight(playerElRef.current.offsetHeight);
      setWidth(playerElRef.current.offsetWidth);
      setDimension(true);
      console.log(playerElRef.current, width, height);
      // if (dimension) {
      //   getEvent();
      // }
    }
  }
  useEffect(() => {
    getdimension();
    getEvent();
  }, [dimension]);

  function replay(events) {
    console.log(events);
    const replayer = new rrwebPlayer({
      target: document.querySelector("#player"), // customizable root element
      props: {
        events,
        // height: height,
        // width: width,
      },
    });

    replayer.play();
  }

  //pass 'id' here as a query
  const getEvent = async () => {
    try {
      setLoading(true);
      setStatusMsg("");
      setServerStatus(null);
      const result = await axiosFetch(async (instance) => {
        const { data, status } = await instance.get(`/store/get-rec?id=${id}`);
        console.log(data, status, "from fetch events");
        setServerStatus(status);
        if (status === 200) {
          if (data?.recording) {
            let parseData = JSON.parse(data?.recording);
            console.log(parseData);
            setEvents(parseData);
            setDisable(false);
            setLoading(false);
            replay(parseData);
          } else {
            setStatusMsg(
              "There is no recoardings build.\n Please reload the page or visit some time later."
            );
          }
        } else {
          setStatusMsg(
            "There is some internal server issue.\n Please reload the page or visit some time later."
          );
        }
        return data;
      });
    } catch (err) {
      console.log(err, "from getEvent");
    }
  };

  return (
    <>
      {loading ? (
        <div style={{ minHeight: "400px" }}>
          <MyLoader />
        </div>
      ) : (
        <div
          id="player"
          style={{ width: "calc(100% - 20px)", height: "calc(100vh - 100px)" }}
          ref={playerElRef}
        ></div>
      )}
      <div>
        {serverStatus === 200 && statusMsg ? <></> : <div>{statusMsg}</div>}
      </div>
    </>
  );
};

export default recorder;
