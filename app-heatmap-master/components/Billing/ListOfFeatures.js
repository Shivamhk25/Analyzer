import React, { useEffect, useState } from "react";
import { List, ListIcon, ListItem } from "@chakra-ui/react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { Flex, Box } from "@chakra-ui/layout";

const ListOfFeatures = ({ credits }) => {
  const [page, setPage] = useState("");
  const [day, setDay] = useState("");
  const [finalPlan, setFinalPlan] = useState("");
  useEffect(() => {
    if (credits <= 500) {
      setFinalPlan("Free Plan");
    } else if (credits > 500 && credits <= 10000) {
      setFinalPlan("Pro Plan");
    } else if (credits > 10000 && credits <= 25000) {
      setFinalPlan("Vip Plan");
    } else if (credits > 25000 && credits <= 75000) {
      setFinalPlan("Royal Plan");
    }
  }, [credits]);

  useEffect(() => {
    if (finalPlan === "Free Plan") {
      setPage("500");
      setDay("30");
    }
    if (finalPlan === "Pro Plan") {
      setPage("25k");
      setDay("45");
    }
    if (finalPlan === "Vip Plan") {
      setPage("200k");
      setDay("60");
    }
    if (finalPlan === "Royal Plan") {
      setPage("500k");
      setDay("90");
    }
  }, [finalPlan]);

  return (
    <>
      <Flex
        flexDirection="column"
        mt="5px"
        justifyContent="space-between"
        alignContent="space-between"
        p="5px"
        bg=""
        w="70%"
        h="250px"
      >
        <List spacing={3} textAlign="left">
          <Box bg="white" h="35px" width="130%">
            <ListItem fontSize="18px" color="gray" fontWeight="500">
              <ListIcon
                mr="10px"
                w={10}
                h={10}
                as={AiFillCheckCircle}
                color="green.500"
              />
              {page} pageviews per month
            </ListItem>
          </Box>
          <Box bg="white" h="35px" width="130%">
            <ListItem fontSize="18px" color="gray" fontWeight="500">
              <ListIcon
                mr="10px"
                w={10}
                h={10}
                as={AiFillCheckCircle}
                color="green.500"
              />
              {day} days Data retention
            </ListItem>
          </Box>
          <Box bg="white" h="35px" width="130%">
            <ListItem fontSize="18px" color="gray" fontWeight="500">
              <ListIcon
                mr="10px"
                w={10}
                h={10}
                as={AiFillCheckCircle}
                color="green.500"
              />
              Advanced Analytics
            </ListItem>
          </Box>
        </List>
      </Flex>
    </>
  );
};

export default ListOfFeatures;
