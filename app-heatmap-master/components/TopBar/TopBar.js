import React from "react";
import { Box, Text, IconButton } from "@chakra-ui/react";
import { FiChevronsLeft, FiMenu } from "react-icons/fi";

const TopBar = (props) => {
  return (
    <>
      <Box
        bg=""
        bgGradient="linear(to-r, tomato, #F6E05E)"
        w="100%"
        h="60px"
        p={4}
        color="white"
      >
        <Text ml={190} fontSize="25px" color="#2D3748">
          <IconButton
            background="none"
            colorScheme="none"
            size="20px"
            mt={0}
            ml={props.navSize === "large" ? "5" : "-120"}
            // _hover={{ background: 'none' }}
            icon={<FiMenu />}
            onClick={() => {
              if (props.navSize == "small") props.changeNavSize("large");
              else props.changeNavSize("small");
            }}
          />
        </Text>
      </Box>
    </>
  );
};

export default TopBar;
