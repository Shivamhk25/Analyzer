import React, { useState, useEffect, useContext } from "react";
import { AxiosContext } from "../components/MyProvider";
import {
  Card,
  Filters,
  IndexTable,
  TextStyle,
  useIndexResourceState,
  TextField,
  Select,
  ChoiceList,
} from "@shopify/polaris";
import PlayBtn from "../components/buttons/PlayBtn";
import LiveViewBtn from "../components/buttons/LiveViewBtn";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import {
  Heading,
  Text,
  Button,
  Box,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";

import { Router, useRouter } from "next/dist/client/router";
import { get } from "mongoose";

const recordings = () => {
  const { axiosFetch } = useContext(AxiosContext);
  const router = useRouter();

  const getRecording = async () => {
    const result = await axiosFetch(async (instance) => {
      const response = await instance.get("/store/recordings");
      console.log(response);
    });
  };

  useEffect(() => {
    getRecording();
  });

  const customers = [
    {
      id: "3411",
      url: "customers/341",
      visitors: (
        <Heading as="h4" fontSize="15px" color="#10769c">
          Bharti Airtel{" "}
          <Text fontSize="13px" color="black" mt="2px">
            106.215.225.30
          </Text>
        </Heading>
      ),

      play: <PlayBtn />,
      liveView: <LiveViewBtn />,
      pages: (
        <Text color="gray" fontSize="14px" fontWeight="500">
          Designers Dresses in the most
        </Text>
      ),
      tags: "",
      pagesCount: (
        <Text color="blue" fontSize="14px" fontWeight="500">
          1
        </Text>
      ),
      source: (
        <Button variant="link" fontSize="13px" color="blue">
          xyz.com
        </Button>
      ),
      page: (
        <Text color="gray" fontSize="14px" fontWeight="500">
          1 min
        </Text>
      ),
    },

    {
      id: "3412",
      url: "customers/342",
      visitors: (
        <Heading as="h4" fontSize="15px" color="#10769c">
          Bharti Airtel{" "}
          <Text fontSize="13px" color="black" mt="2px">
            106.215.225.30
          </Text>
        </Heading>
      ),
      play: <PlayBtn />,
      liveView: <LiveViewBtn />,
      pages: (
        <Text color="gray" fontSize="14px" fontWeight="500">
          Designers Dresses in the most
        </Text>
      ),
      tags: "",
      pagesCount: (
        <Text color="blue" fontSize="14px" fontWeight="500">
          1
        </Text>
      ),
      source: (
        <Button variant="link" fontSize="13px" color="blue">
          xyz.com
        </Button>
      ),
      page: (
        <Text color="gray" fontSize="14px" fontWeight="500">
          1 min
        </Text>
      ),
    },
    {
      id: "3413",
      url: "customers/343",
      visitors: (
        <Heading as="h4" fontSize="15px" color="#10769c">
          Bharti Airtel{" "}
          <Text fontSize="13px" color="black" mt="2px">
            106.215.225.30
          </Text>
        </Heading>
      ),
      play: <PlayBtn />,
      liveView: <LiveViewBtn />,
      pages: (
        <Text color="gray" fontSize="14px" fontWeight="500">
          Designers Dresses in the most
        </Text>
      ),
      tags: "",
      pagesCount: (
        <Text color="blue" fontSize="14px" fontWeight="500">
          1
        </Text>
      ),
      source: (
        <Button variant="link" fontSize="13px" color="blue">
          xyz.com
        </Button>
      ),
      page: (
        <Text color="gray" fontSize="14px" fontWeight="500">
          1 min
        </Text>
      ),
    },
    {
      id: "3414",
      url: "customers/344",
      visitors: (
        <Heading as="h4" fontSize="15px" color="#10769c">
          Bharti Airtel{" "}
          <Text fontSize="13px" color="black" mt="2px">
            106.215.225.30
          </Text>
        </Heading>
      ),
      play: <PlayBtn />,
      liveView: <LiveViewBtn />,
      pages: (
        <Text color="gray" fontSize="14px" fontWeight="500">
          Designers Dresses in the most
        </Text>
      ),
      tags: "",
      pagesCount: (
        <Text color="blue" fontSize="14px" fontWeight="500">
          1
        </Text>
      ),
      source: (
        <Button variant="link" fontSize="13px" color="blue">
          xyz.com
        </Button>
      ),
      page: (
        <Text color="gray" fontSize="14px" fontWeight="500">
          1 min
        </Text>
      ),
    },
    {
      id: "3415",
      url: "customers/345",
      visitors: (
        <Heading as="h4" fontSize="15px" color="#10769c">
          Bharti Airtel{" "}
          <Text fontSize="13px" color="black" mt="2px">
            106.215.225.30
          </Text>
        </Heading>
      ),
      play: <PlayBtn />,
      liveView: <LiveViewBtn />,
      pages: (
        <Text color="gray" fontSize="14px" fontWeight="500">
          Designers Dresses in the most
        </Text>
      ),
      tags: "",
      pagesCount: (
        <Text color="blue" fontSize="14px" fontWeight="500">
          1
        </Text>
      ),
      source: (
        <Button variant="link" fontSize="13px" color="blue">
          xyz.com
        </Button>
      ),
      page: (
        <Text color="gray" fontSize="14px" fontWeight="500">
          1 min
        </Text>
      ),
    },
    {
      id: "3416",
      url: "customers/346",
      visitors: (
        <Heading as="h4" fontSize="15px" color="#10769c">
          Bharti Airtel{" "}
          <Text fontSize="13px" color="black" mt="2px">
            106.215.225.30
          </Text>
        </Heading>
      ),
      play: <PlayBtn />,
      liveView: <LiveViewBtn />,
      pages: (
        <Text color="gray" fontSize="14px" fontWeight="500">
          Designers Dresses in the most
        </Text>
      ),
      tags: "",
      pagesCount: (
        <Text color="blue" fontSize="14px" fontWeight="500">
          1
        </Text>
      ),
      source: (
        <Button variant="link" fontSize="13px" color="blue">
          xyz.com
        </Button>
      ),
      page: (
        <Text color="gray" fontSize="14px" fontWeight="500">
          1 min
        </Text>
      ),
    },
  ];

  const resourceName = {
    singular: "customer",
    plural: "customers",
  };

  const {
    selectedResources,
    allResourcesSelected,
    handleSelectionChange,
  } = useIndexResourceState(customers);

  const rowMarkup = customers.map(
    (
      { id, visitors, play, liveView, pages, tags, pagesCount, source, page },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <TextStyle variation="strong">{visitors}</TextStyle>
        </IndexTable.Cell>
        <IndexTable.Cell>{play}</IndexTable.Cell>
        <IndexTable.Cell>{liveView}</IndexTable.Cell>
        <IndexTable.Cell>{pages}</IndexTable.Cell>
        <IndexTable.Cell>{tags}</IndexTable.Cell>
        <IndexTable.Cell>{pagesCount}</IndexTable.Cell>
        <IndexTable.Cell>{source}</IndexTable.Cell>
        <IndexTable.Cell>{page}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    // <Card>
    <>
      <Box ml="-170px" width="1100px" bg="red">
        <div style={{ padding: "10px", display: "flex" }}>
          <div
            style={{
              flex: 1,
            }}
          >
            <SimpleGrid minChildWidth="120px" spacing="20px">
              <Box bg="" width="100px" height="60px">
                <Menu>
                  <MenuButton
                    bg="white"
                    fontSize="15px"
                    width="80px"
                    height="35px"
                    as={Button}
                    rightIcon={<FiChevronDown />}
                  >
                    10
                  </MenuButton>
                  <MenuList>
                    <MenuItem>11</MenuItem>
                    <MenuItem>12</MenuItem>
                  </MenuList>
                </Menu>
              </Box>
              <Box bg="" ml="-120px" width="150px" height="60px">
                <Button
                  bg="white"
                  fontSize="15px"
                  width="150px"
                  boxShadow="20px"
                  height="35px"
                >
                  Columns
                </Button>
              </Box>
              <Box bg="" ml="-150px" width="200px" height="60px">
                <Button
                  bg="white"
                  fontSize="15px"
                  width="150px"
                  boxShadow="20px"
                  height="35px"
                >
                  Behaviour Tag Rules
                </Button>
              </Box>
              <Box bg="" ml="-200" width="250px" height="60px">
                <InputGroup>
                  <InputLeftElement
                    mt="5px"
                    marginLeft="10px"
                    marginRight="15px"
                    pointerEvents="none"
                    children={<FiSearch size="20px" color="gray" />}
                  />
                  <Input
                    fontSize="15px"
                    ml={4}
                    fontWeight="500"
                    bg="white"
                    height="35px"
                    type="ser"
                    placeholder="Search"
                  />
                </InputGroup>
              </Box>
              <Box bg="" height="60px">
                <Button
                  ml="0px"
                  w="200px"
                  h="36px"
                  bg="#0B15ED"
                  color="white"
                  fontSize="14px"
                  fontWeight="800"
                >
                  Exclude Active Recording
                </Button>
              </Box>
            </SimpleGrid>

            <Box bg="white">
              <IndexTable
                resourceName={resourceName}
                itemCount={customers.length}
                selectedItemsCount={
                  allResourcesSelected ? "All" : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[
                  {
                    title: (
                      <Text fontSize="15px" color="gray" fontWeight="700">
                        Visitors
                      </Text>
                    ),
                  },
                  {
                    title: (
                      <Text fontSize="15px" color="gray" fontWeight="700">
                        Play
                      </Text>
                    ),
                  },
                  {
                    title: (
                      <Text fontSize="15px" color="gray" fontWeight="700">
                        Live View
                      </Text>
                    ),
                  },
                  {
                    title: (
                      <Text fontSize="15px" color="gray" fontWeight="700">
                        Pages
                      </Text>
                    ),
                  },
                  {
                    title: (
                      <Text fontSize="15px" color="gray" fontWeight="700">
                        Tags
                      </Text>
                    ),
                  },
                  {
                    title: (
                      <Text fontSize="15px" color="gray" fontWeight="700">
                        #Pages
                      </Text>
                    ),
                  },
                  {
                    title: (
                      <Text fontSize="15px" color="gray" fontWeight="700">
                        Source
                      </Text>
                    ),
                  },
                  {
                    title: (
                      <Text fontSize="15px" color="gray" fontWeight="700">
                        Page
                      </Text>
                    ),
                  },
                ]}
              >
                {rowMarkup}
              </IndexTable>
            </Box>
          </div>
        </div>
      </Box>
    </>
  );
};

export default recordings;
