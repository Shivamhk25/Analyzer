import React, { useState, useContext, useEffect } from "react";
import { Box, Flex } from "@chakra-ui/layout";
import { Text, Button } from "@chakra-ui/react";
import Services from "./Services";
import ListOfFeatures from "./ListOfFeatures";
import {
  postBillingData,
  getBillingData,
  getShopName,
} from "../../API/billingApi";
import { AxiosContext } from "../MyProvider";
import { Redirect } from "@shopify/app-bridge/actions";
import { useRouter } from "next/router";
import MyNewSlider from "./MyNewSlider";
import { Tooltip } from "@chakra-ui/react";
import { IconContext } from "react-icons";
import { FiAlertCircle } from "react-icons/fi";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Modal } from "antd";

function useWindowSize() {
  const [size, setSize] = useState(0);
  useEffect(() => {
    function updateSize() {
      setSize(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}
// 23426400461
const MonthlyPrice = ({ currentPlan }) => {
  const { axiosFetch } = useContext(AxiosContext);
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const [credits, setCredits] = useState("");
  const [clientShopName, setShopClientName] = useState("");
  const [finalPrice, setFinalPrice] = useState(0);
  const [finalPlan, setFinalPlan] = useState("Free Plan");
  const [isVisible, setVisible] = useState(true);
  const router = useRouter();
  const frameWidth = useWindowSize();
  const breakPoint1 = 690;
  // console.log(frameWidth, "from pricing");
  // console.log(currentPlan);

  const sliderHandlerFun = (val) => {
    setCredits(val);
    // console.log(val, "from slider handeler");
  };
  // console.log(AxiosContext, useContext(AxiosContext), redirect, 'from 50')

  useEffect(() => {
    setVisible(true);
    if (credits <= 500) {
      setFinalPrice(0);
      // setCredits(0);
      setFinalPlan("Free Plan");
      if (currentPlan === "Free Plan") {
        setVisible(false);
      }
    } else if (credits > 500 && credits <= 10000) {
      setFinalPrice(11);
      // setCredits(11);
      setFinalPlan("Pro Plan");
      if (currentPlan === "Pro Plan") {
        setVisible(false);
      }
    } else if (credits > 10000 && credits <= 25000) {
      setFinalPrice(51);
      // setCredits(51);
      setFinalPlan("Vip Plan");
      if (currentPlan === "Vip Plan") {
        setVisible(false);
      }
    } else if (credits > 25000 && credits <= 75000) {
      setFinalPrice(99);
      // setCredits(99);
      setFinalPlan("Royal Plan");
      if (currentPlan === "Royal Plan") {
        setVisible(false);
      }
    }
  }, [credits]);

  useEffect(() => {
    // setVisible(true);
    if (currentPlan === "Free Plan") {
      setCredits(500);
    } else if (currentPlan === "Pro Plan") {
      setCredits(10000);
    } else if (currentPlan === "Vip Plan") {
      setCredits(25000);
    } else if (currentPlan === "Royal Plan") {
      setCredits(75000);
    }
  }, [currentPlan]);
  // console.log(`https://${clientShopName}/admin/apps/${appName}/billing`);

  const getBilling = async () => {
    const chargeId = router.query.charge_id;
    // const chargeId = 23510352077;
    console.log(chargeId, "inside get billing function");
    let response = await getBillingData(axiosFetch, chargeId);
    console.log(response.data.body);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    window.location.reload();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    window.location.reload();
  };

  const [isModalVisible2, setIsModalVisible2] = useState(false);

  const showModal2 = () => {
    setIsModalVisible2(true);
  };

  const handleOk2 = () => {
    setIsModalVisible2(false);
  };

  const handleCancel2 = () => {
    setIsModalVisible2(false);
  };

  const postBilling = async (body) => {
    console.log(body.data.recurring_application_charge.name, "&&&**");
    try {
      if (body.data.recurring_application_charge.name !== "Free Plan") {
        let response = await postBillingData(axiosFetch, body);
        console.log(response.status, "&&");
        console.log(response.data, "$$");

        if (response.status === 200) {
          if (
            response.data.body.recurring_application_charge.confirmation_url
          ) {
            redirect.dispatch(
              Redirect.Action.REMOTE,
              response.data.body.recurring_application_charge.confirmation_url
            );
          }
        } else {
          showModal2();
        }
      } else {
        let response = await postBillingData(axiosFetch, body);
        console.log(response.status, "&&");
        console.log(response.data, "$$");

        if (response.status === 400) {
          showModal();
        }
      }
    } catch (e) {
      console.log(e);
      showModal2();
    }
  };

  const billingHandler = async () => {
    let body = {
      data: {
        recurring_application_charge: {
          name: finalPlan,
          price: finalPrice,
          // test: true,
          // return_url: `https://debkfirststore.myshopify.com/admin/apps/beb5726e9801bc8846d81290a0d3ca9d/?shop=debkfirststore.myshopify.com&host=ZGVia2ZpcnN0c3RvcmUubXlzaG9waWZ5LmNvbS9hZG1pbg`,
          return_url: `https://${clientShopName}/admin/apps/${appName}/billing`,
        },
      },
    };
    postBilling(body);
  };
  const fetchUserShop = async () => {
    try {
      const { data } = await getShopName(axiosFetch);
      console.log(data, "from fetchUserShop");
      setShopClientName(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchUserShop();
  }, []);
  // console.log(router.query.charge_id, "from query param");
  return (
    <>
      <Modal
        title="Plan Changed"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Plan degraded to free plan.</p>
      </Modal>
      <Modal
        title="Internal Server Error"
        visible={isModalVisible2}
        onOk={handleOk2}
        onCancel={handleCancel2}
      >
        <p>Please try again.</p>
      </Modal>
      <div>
        <Flex
          boxShadow="2xl"
          mt={10}
          bg="white"
          w="95%"
          p={4}
          h="auto"
          color="white"
          flexWrap="wrap"
        >
          <Flex
            bg=""
            flexDirection={frameWidth < breakPoint1 ? "column" : "row"}
            h="auto"
            w="100%"
            mb={12}
            justifyContent="center"
          >
            <Box
              height="200px"
              mr="10px"
              mt="20px"
              w="300px"
              bg=""
              pt="10px"
              mb={8}
            >
              <Services credits={credits} monthlyPrice={finalPrice} />
            </Box>
            <Box
              height="230px"
              bg=""
              w="300px"
              mt={5}
              justifyContent={"center"}
            >
              <ListOfFeatures credits={credits} />
            </Box>
          </Flex>

          <Flex h="60px" mb="120px" w="100%" justifyContent="center">
            <Flex bg="" h="50px" p="5px" w="95%" alignItems="stretch">
              <Box bg="" flex="1" mr="5px" w="15%">
                <p
                  style={{
                    fontSize: "15px",
                    color: "gray",
                    fontWeight: "600",
                    marginTop: "22px",
                    // marginRight: "8px",
                    textAlign: "left",
                  }}
                >
                  Choose Plan :
                  <Tooltip
                    label="Pageviews addition allowed in a month(based on the plan selected)"
                    hasArrow
                    openDelay={100}
                    bg="#efefef"
                    color="#676FA3"
                    placement="top"
                    fontSize={14}
                    borderRadius={6}
                    paddingTop={"5px"}
                    paddingBottom={"5px"}
                  >
                    <Button colorScheme={"white"}>
                      <IconContext.Provider
                        value={{
                          color: "#555",
                          className: "global-class-name",
                          size: "18px",
                          style: {
                            marginTop: "0px",
                          },
                        }}
                      >
                        <span>
                          <FiAlertCircle />
                        </span>
                      </IconContext.Provider>
                    </Button>
                  </Tooltip>
                </p>
              </Box>
              <Box bg="" w="82%" paddingTop={5}>
                <MyNewSlider
                  sliderHandler={sliderHandlerFun}
                  credits={credits}
                />
              </Box>
            </Flex>
          </Flex>

          <Flex w="100%" justifyContent="center" mt="-50px">
            <Flex direction="column" w="350px" pb={"24px"} bg="">
              {!isVisible && (
                <>
                  <Text fontSize="15px" color="black" fontWeight="500">
                    This is your current plan
                  </Text>
                </>
              )}
              {isVisible && (
                <>
                  <Text fontSize="15px" color="black" fontWeight="500">
                    Total Payment Amount: ${finalPrice}
                  </Text>
                  <Button
                    // bg="blue"
                    background={"#b983ff"}
                    color="white"
                    alignSelf="center"
                    fontSize="14px"
                    w="100px"
                    h="35px"
                    mt="10px"
                    _hover={{ color: "#efefef" }}
                    onClick={billingHandler}
                    // isDisabled={planStatus === "active" ? true : false}
                  >
                    Confirm
                  </Button>
                  {/* <Button
                    // bg="blue"
                    background={"#b983ff"}
                    color="white"
                    alignSelf="center"
                    fontSize="14px"
                    w="100px"
                    h="35px"
                    mt="10px"
                    _hover={{ color: "#efefef" }}
                    onClick={() => getBilling()}
                  >
                    get bill
                  </Button> */}
                </>
              )}
            </Flex>
          </Flex>
        </Flex>
      </div>
    </>
  );
};

export default MonthlyPrice;

export const appName = "z08-heatmap-app";
