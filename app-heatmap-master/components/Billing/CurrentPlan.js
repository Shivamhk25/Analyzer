import React from "react";
import { Box, Flex } from "@chakra-ui/layout";

function CurrentPlan({ data }) {
  return (
    <>
      <div>
        <Flex
          boxShadow="2xl"
          mt={10}
          bg="white"
          w="90%"
          p={4}
          h="auto"
          color="white"
          flexWrap="wrap"
        >
          <h2>Current Plan : {data}</h2>
        </Flex>
      </div>
    </>
  );
}

export default CurrentPlan;
