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
          <Tabs
            variant="unstyled"
            colorScheme="green"
            orientation="vertical"
            size="lg"
          >
            <Grid
              h="480px"
              templateRows="repeat(2, 1fr)"
              templateColumns="repeat(7, 1fr)"
              gap={0}
            >
              <GridItem
                rowSpan={2}
                colSpan={1}
                w="100%"
                bg="yellow"
                height="490px"
              >
                <Box mt="180px" bg="" w="100px" ml={-4} p={4} color="white">
                  <TabList>
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

                  {/* <Tabs variant="enclosed-colored" colorScheme="green" orientation="vertical" size="lg">
                  <TabList>
                    <Tab>
                      <Text fontSize="15px" fontWeight="600" color="Black">Login</Text>
                    
                    </Tab>
                    <Tab>
                    <Text fontSize="13px" fontWeight="700" color="Black">Registration</Text>
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                     helllllloooooo
                    </TabPanel>
                    <TabPanel>
                      <p>two!</p>
                    </TabPanel>
                  </TabPanels>
                </Tabs> */}
                </Box>
              </GridItem>
              <GridItem
                rowSpan={2}
                colSpan={2}
                mt={-4}
                bgGradient="linear(to-b, #F54A1C, #F8C020)"
              />

              <TabPanels>
                <TabPanel>
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
                        ml="110px"
                        fontSize="17px"
                        color="black"
                        fontWeight="800"
                      >
                        Login
                      </Heading>

                      <Text
                        mt="25px"
                        mb="30px"
                        ml="50px"
                        fontSize="12px"
                        color="black"
                      >
                        Enter your Login Info to proceed
                      </Text>

                      <Input
                        placeholder="Email"
                        color="gray"
                        fontSize="13px"
                        fontWeight="500"
                        variant="flushed"
                        w="70%"
                        mt={8}
                        ml="40px"
                      />
                      <Input
                        placeholder="Password"
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
                        Login
                      </Button>

                      <Text
                        color="#3349FF"
                        fontWeight="700"
                        mt="20px"
                        ml="85px"
                      >
                        Forgot Password!
                      </Text>
                    </Box>
                  </GridItem>
                </TabPanel>
                <TabPanel>
                  <p>two!</p>
                </TabPanel>
              </TabPanels>

              {/* <GridItem rowSpan={2} colSpan={4} mt={-4} mr={-3} bg="">
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
                    ml="110px"
                    fontSize="17px"
                    color="black"
                    fontWeight="800"
                  >
                    Login
                  </Heading>

                  <Text
                    mt="25px"
                    mb="30px"
                    ml="50px"
                    fontSize="12px"
                    color="black"
                  >
                    Enter your Login Info to proceed
                  </Text>

                  <Input
                    placeholder="Email"
                    color="gray"
                    fontSize="13px"
                    fontWeight="500"
                    variant="flushed"
                    w="70%"
                    mt={8}
                    ml="40px"
                  />
                  <Input
                    placeholder="Password"
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
                    Login
                  </Button>

                  <Text color="#3349FF" fontWeight="700" mt="20px" ml="85px">
                    Forgot Password!
                  </Text>
                </Box>
              </GridItem> */}
            </Grid>
          </Tabs>
        </Box>
      </div>
    </>
  );
};

export default Login;
