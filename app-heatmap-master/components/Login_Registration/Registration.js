import React, { useState } from "react";
import { Box } from "@chakra-ui/layout";
import {
  Grid,
  GridItem,
  Flex,
  Menu,
  Link,
  MenuButton,
  Heading,
  Text,
  Input,
  Button,
} from "@chakra-ui/react";

const Registration = () => {
  return (
    <>
      <div>
        <Box
          boxShadow="2xl"
          mt={10}
          bg="white"
          w="80%"
          p={4}
          h="500px"
          color="white"
        >
          <Grid
            h="480px"
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(7, 1fr)"
            gap={0}
          >
            <GridItem rowSpan={2} colSpan={1} w="100%" bg="" height="490px">
              <Box mt="180px" bg="" w="100px" ml={-4} p={4} color="white">
                <Link
                  href=""
                  _hover={{
                    background: "white",
                    color: "blue",
                    borderLeft: "2px solid blue",
                  }}
                  _active={{
                    background: "white",
                    color: "blue",
                    borderLeft: "2px solid blue",
                  }}
                  fontSize={16}
                  color="gray"
                  fontWeight="700"
                >
                  Login
                </Link>
              </Box>
              <Box mt={10} bg="" w="120px" ml={-4} p={4} color="white">
                <Link
                  href=""
                  _hover={{
                    background: "white",
                    color: "blue",
                    borderLeft: "2px solid blue",
                  }}
                  _active={{
                    background: "white",
                    color: "blue",
                    borderLeft: "2px solid blue",
                  }}
                  fontSize={15}
                  color="gray"
                  fontWeight="700"
                >
                  Registration
                </Link>
              </Box>
            </GridItem>
            <GridItem
              rowSpan={2}
              colSpan={2}
              mt={-4}
              bgGradient="linear(to-b, #F54A1C, #F8C020)"
            />
            <GridItem rowSpan={2} colSpan={4} mt={-4} mr={-3} bg="">
              <Box
                bg=""
                ml={35}
                mt="80px"
                h="340px"
                w="80%"
                p={4}
                color="white"
              >
                <Heading
                  ml="90px"
                  fontSize="17px"
                  color="black"
                  fontWeight="800"
                >
                  Register Now
                </Heading>

                <Text
                  mt="25px"
                  mb="10px"
                  ml="5px"
                  fontSize="12px"
                  color="black"
                >
                  Confirm the information below and we'll sync up your &nbsp;
                  Shopify store with ____!
                </Text>

                <Input
                  placeholder="Enter Your Shop Name"
                  color="gray"
                  fontSize="13px"
                  fontWeight="500"
                  variant="flushed"
                  w="70%"
                  mt={8}
                  ml="40px"
                />
                <Input
                  placeholder="Full Name"
                  color="gray"
                  fontSize="13px"
                  fontWeight="500"
                  variant="flushed"
                  w="70%"
                  mt={6}
                  ml="40px"
                />
                <Input
                  placeholder="Email"
                  color="gray"
                  fontSize="13px"
                  fontWeight="500"
                  variant="flushed"
                  w="70%"
                  mt={6}
                  ml="40px"
                />

                <Button
                  mt="35px"
                  ml="40px"
                  bg="#3349FF"
                  fontSize="13px"
                  fontWeight="800"
                  size="lg"
                  w="210px"
                >
                  Connect with Shopify
                </Button>
              </Box>
            </GridItem>
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default Registration;
