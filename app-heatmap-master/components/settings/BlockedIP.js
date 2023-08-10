import React, { useState, useEffect, useContext } from "react";
import {
  Input,
  Button,
  Typography,
  Tooltip,
  message,
  Badge,
  Card,
  Row,
  Col,
} from "antd";
import { BiBlock } from "react-icons/bi";
import { FiCopy, FiUserCheck } from "react-icons/fi";
import { IconContext } from "react-icons";
import { AxiosContext } from "../MyProvider";
import {
  postIpBlocked,
  getBlockedIp,
  deleteBlockedIp,
} from "../../API/settingsPageApi";
import MyLoader from "../commonComp/MyLoader";

const { Title, Paragraph } = Typography;

const BlockedIP = () => {
  const { axiosFetch } = useContext(AxiosContext);
  const [inputValue, setInputValue] = useState(null);
  const [blockedIpList, setBlockIpList] = useState([]);
  const [buildItems, setBuildItems] = useState([]);
  const [rerender, setRerender] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [dLoading, setDLoading] = useState(false);

  const postBlockIp = async (ip) => {
    try {
      const res = await postIpBlocked(axiosFetch, ip);
      console.log(res);
      setLoading1(false);
      if (res.status === 200) {
        setRerender(!rerender);
      } else {
        message.error("This ip can not be block.");
      }
    } catch (e) {
      console.log(e);
    }
  };
  const fetchBlockedIp = async () => {
    try {
      setDataLoading(true);
      setStatusMsg("");
      setServerStatus(null);
      const { data, status } = await getBlockedIp(axiosFetch);
      console.log(data);
      if (status === 200) {
        setBlockIpList(data);
        setDataLoading(false);
      } else {
        setStatusMsg(
          "There is some internal server issue.\n Please reload the page or visit some time later."
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  const unblockIp = async (ipAdr) => {
    let ipbody = { ip: ipAdr };
    console.log(ipbody, "ip body");
    try {
      setDLoading(true);
      const { data, status } = await deleteBlockedIp(axiosFetch, ipbody);
      console.log(data);
      if (status === 200) {
        setRerender(!rerender);
        message.success(data?.message);
      } else {
        message.error(data?.message);
      }
      setDLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchBlockedIp();
  }, [rerender]);
  useEffect(() => {
    if (inputValue) {
      setLoading1(false);
    } else {
      setLoading1(true);
    }
  }, [inputValue]);

  useEffect(() => {
    if (blockedIpList?.length) {
      compBuilder(blockedIpList);
    }
  }, [blockedIpList]);

  const inputHandeler = (e) => {
    e.preventDefault();
    setInputValue(e.target.value);
  };
  const ipValidator = (value) => {
    const ipv4 = /^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/;
    const ipv6 = /^((([0-9a-fA-F]){1,4})\:){7}(([0-9a-fA-F]){1,4})$/;
    // const check1 = ipv4.test(value);
    // const check2 = ipv6.test(value);
    // console.log(check1, 'ipv4');
    // console.log(check2, 'ipv6');
    if (ipv4.test(value)) {
      message.success("valid ipv4.");
      return true;
    } else if (ipv6.test(value)) {
      message.success("valid ipv6.");
      return true;
    } else {
      message.error("invalid ip address.");
      return false;
    }
  };
  const handleSubmit = () => {
    setLoading1(true);
    if (!loading1) {
      const isValid = ipValidator(inputValue);
      console.log(isValid, "regx");
      if (isValid) {
        let ip = { ip: inputValue };
        postBlockIp(ip);
      }
    }
  };

  const copyClipboard = async (value) => {
    try {
      if (window !== undefined) {
        await window.navigator.clipboard.writeText(value);
        // document.execCommand('copy')
        message.success("ip coppied.");
      }
    } catch (e) {
      console.log(e);
      message.error("failed to coppy.");
    }
  };

  function compBuilder(items) {
    const build = items?.map((item, idx) => {
      return (
        <Col xs={24} sm={24} md={12} lg={12} xl={12} key={idx}>
          <div
            style={{
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
              margin: "3px 5px",
              borderRadius: "5px",
              padding: "3px 8px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ padding: "0px 2px" }}>
                <Badge.Ribbon
                  text={`#${idx + 1}`}
                  placement="start"
                  style={{ marginTop: "6px" }}
                >
                  <Card title="" size="small" style={{ paddingLeft: "20px" }}>
                    <Title level={5} style={{ color: "#777" }}>
                      {item.ipAddress}
                    </Title>
                  </Card>
                </Badge.Ribbon>
              </div>
              <div
                style={{
                  padding: "2px 2px",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                {/* <div>
                  <Tooltip title="Click to copy ip">
                    <Button onClick={() => copyClipboard(item.ipAddress)}>
                      <IconContext.Provider value={{}}>
                        <span>
                          <FiCopy />
                        </span>
                      </IconContext.Provider>
                    </Button>
                  </Tooltip>
                </div> */}
                <div>
                  <Tooltip title="Click to unblock ip">
                    <Button
                      disabled={dLoading}
                      onClick={() => unblockIp(item.ipAddress)}
                    >
                      <IconContext.Provider value={{}}>
                        <span>
                          <FiUserCheck />
                        </span>
                      </IconContext.Provider>
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </Col>
      );
    });
    setBuildItems(build);
  }
  return (
    <div style={{ marginTop: "16px", marginBottom: "24px" }}>
      <div
        style={{
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          paddingBottom: "26px",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
          }}
        >
          <Title level={4} style={{ color: "#558" }}>
            Blocked Visitors IP address.{" "}
          </Title>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Paragraph>
            You can block a visitor by its ip address. You can also unblock a
            blocked ip address by simply click the unblock icon shown in the
            blocked ip address table.
          </Paragraph>
        </div>
        <Input.Group compact>
          <Input
            style={{ width: "calc(100% - 200px)" }}
            placeholder="Enter ip address to block"
            value={inputValue}
            onPressEnter={() => {
              handleSubmit();
            }}
            onChange={(value) => {
              inputHandeler(value);
            }}
          />
          <Tooltip
            title={`${
              inputValue ? `Block ${inputValue} ip.` : "Please enter an ip."
            }`}
          >
            <Button
              type="primary"
              style={{ borderRadius: "5px", marginLeft: "10px" }}
              onClick={handleSubmit}
              icon={
                <IconContext.Provider value={{}}>
                  <span style={{ marginRight: "3px", paddingTop: "4px" }}>
                    <BiBlock />
                  </span>
                </IconContext.Provider>
              }
              disabled={loading1}
            >
              Block
            </Button>
          </Tooltip>
        </Input.Group>
      </div>
      <div
        style={{
          marginTop: "30px",
          marginBottom: "24px",
          padding: "6px",
          minHeight: "400px",
        }}
      >
        {dataLoading ? (
          <div style={{ minHeight: "200px" }}>
            <MyLoader />
          </div>
        ) : (
          <div
            style={{
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              paddingBottom: "26px",
              borderRadius: "8px",
            }}
          >
            {buildItems?.length ? (
              <div>
                <Row gutter={[16, 18]}>{buildItems}</Row>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                  color: "#555",
                }}
              >
                OPPS! there is no blocked IP address found.
              </div>
            )}
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
      </div>
    </div>
  );
};

export default BlockedIP;
