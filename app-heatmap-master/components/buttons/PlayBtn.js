import React from "react";
import { Button } from "@chakra-ui/react";
import { BsFillPlayFill } from "react-icons/bs";

import Link from "next/link";

const PlayBtn = ({ recId }) => {
  console.log(recId, "ses");
  return (
    <>
      <Link
        href={{
          pathname: "/recorder",
          query: { id: recId },
        }}
        colorScheme="blue"
        rightIcon={<BsFillPlayFill />}
        size="lg"
        width="100%"
        fontSize="100%"
        bg="#0B15ED"
      >
        <Button
          colorScheme="blue"
          rightIcon={<BsFillPlayFill />}
          size="lg"
          width="80px"
          fontSize="15px"
          bg="#0B15ED"
          borderRadius="5px"
          marginBottom="10px"
          boxShadow="2px 3px 3px lightgray"
          border="none"
        >
          Play
        </Button>
      </Link>
    </>
  );
};

export default PlayBtn;
