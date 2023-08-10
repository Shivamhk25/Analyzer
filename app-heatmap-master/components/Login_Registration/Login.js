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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

const Login = () => {
  return (
    <>
      <Tabs
        variant="unstyled"
        colorScheme="green"
        orientation="vertical"
        size="lg"
      >
        <Flex
          flexDirection="row"
          boxShadow="2xl"
          mt={10}
          bg="white"
          w="80%"
          p={4}
          h="500px"
          color="white"
        >
          <Box bg="white" h="100%" w="110px">
            <TabList mt="170px">
              <Tab>
                <Text
                  fontSize="15px"
                  fontWeight="600"
                  color="Black"
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
                </Text>
              </Tab>
              <Tab>
                <Text
                  fontSize="13px"
                  fontWeight="700"
                  color="Black"
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
                </Text>
              </Tab>
            </TabList>
          </Box>
          <Box
            bgGradient="linear(to-b, #F54A1C, #F8C020)"
            h="100%"
            w="180px"
            flexShrink="2"
          ></Box>
          <Box bg="" flex="1" h="100%">
            <TabPanels>
              <TabPanel>
                <Flex direction="column" bg="white" h="450px" w="100%">
                  <Box bg="" w="100%" h="30px" mt="40px">
                    <Heading
                      ml="40%"
                      mr="40%"
                      fontSize="17px"
                      color="black"
                      fontWeight="800"
                    >
                      Login
                    </Heading>
                    <Box bg="" w="100%" h="40px" mt="40px">
                      <Text ml="25%" mr="15%" fontSize="12px" color="black">
                        Enter your Login Info to proceed
                      </Text>
                    </Box>

                    <Box bg="" w="100%" h="50px" mt="30px">
                      <Input
                        placeholder="Email"
                        color="gray"
                        fontSize="13px"
                        fontWeight="500"
                        variant="flushed"
                        w="70%"
                        mt={6}
                        ml="15%"
                      />
                    </Box>

                    <Box bg="" w="100%" h="50px">
                      <Input
                        placeholder="Password"
                        color="gray"
                        fontSize="13px"
                        fontWeight="500"
                        variant="flushed"
                        w="70%"
                        mt={6}
                        ml="15%"
                      />
                    </Box>

                    <Box bg="" w="100%" h="40px" mt="20px">
                      <Button
                        ml="15%"
                        bg="#3349FF"
                        fontSize="13px"
                        fontWeight="800"
                        size="lg"
                        w="70%"
                      >
                        Login
                      </Button>
                    </Box>

                    <Box bg="" w="100%" h="50px">
                      <Text color="#3349FF" fontWeight="700" mt="20px" ml="35%">
                        Forgot Password!
                      </Text>
                    </Box>
                  </Box>
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex direction="column" bg="white" h="450px" w="100%">
                  <Box bg="" w="100%" h="30px" mt="40px">
                    <Heading
                      ml="30%"
                      mr="30%"
                      fontSize="17px"
                      color="black"
                      fontWeight="800"
                    >
                      Register Now
                    </Heading>
                  </Box>

                  <Box bg="" w="100%" h="40px" mt="20px">
                    <Text ml="15%" mr="10%" fontSize="12px" color="black">
                      Confirm the information below and we'll sync up your
                      &nbsp; Shopify store with ____!
                    </Text>
                  </Box>

                  <Box bg="" w="100%" h="50px" mt="10px">
                    <Input
                      placeholder="Enter Your Shop Name"
                      color="gray"
                      fontSize="13px"
                      fontWeight="500"
                      variant="flushed"
                      w="70%"
                      mt={6}
                      ml="15%"
                    />
                  </Box>
                  <Box bg="" w="100%" h="50px">
                    <Input
                      placeholder="Full Name"
                      color="gray"
                      fontSize="13px"
                      fontWeight="500"
                      variant="flushed"
                      w="70%"
                      mt={2}
                      ml="15%"
                    />
                  </Box>
                  <Box bg="" w="100%" h="50px">
                    <Input
                      placeholder="Email"
                      color="gray"
                      fontSize="13px"
                      fontWeight="500"
                      variant="flushed"
                      w="70%"
                      mt={2}
                      ml="15%"
                    />
                  </Box>

                  <Box bg="" w="100%" h="40px" mt="20px">
                    <Button
                      ml="15%"
                      bg="#3349FF"
                      fontSize="13px"
                      fontWeight="800"
                      size="lg"
                      w="70%"
                    >
                      Connect with Shopify
                    </Button>
                  </Box>
                </Flex>
              </TabPanel>
            </TabPanels>
          </Box>
        </Flex>
      </Tabs>
    </>
  );
};

export default Login;
