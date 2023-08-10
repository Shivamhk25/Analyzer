import React from "react";
import { Button } from "@chakra-ui/react";
import { BsFillPlayFill } from "react-icons/bs";

const LiveViewBtn = () => {
  return (
    <>
      <Button
        colorScheme="blue"
        size="lg"
        width="100%"
        fontSize="80%"
        bg="#6fa832"
        pl="20px"
        borderRadius="5px"
        marginBottom="10px"
        boxShadow="2px 3px 3px lightgray"
        border="none"
      >
        Live View
      </Button>
    </>
  );
};

export default LiveViewBtn;
