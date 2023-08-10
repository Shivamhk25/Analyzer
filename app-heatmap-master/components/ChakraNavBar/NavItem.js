import React, { useContext, useState, useEffect } from "react";
import {
  Flex,
  Text,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";

import { Router, useRouter } from "next/dist/client/router";
import { getReadInst } from "../../API/billingApi";
import { AxiosContext } from "../MyProvider";

export default function NavItem({ icon, title, description, navSize, route }) {
  const router = useRouter();

  const routeHandler = () => {
    router.push(route);
  };
  // const { axiosFetch } = useContext(AxiosContext);
  // const [readInst, setReadInst] = useState(true);

  // const fetchreadInst = async () => {
  //   try {
  //     const { data, status } = await getReadInst(axiosFetch);
  //     console.log(data, "index");
  //     if (status === 200) {
  //       setReadInst(data?.readInst);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // useEffect(() => {
  //   // getUser();
  //   fetchreadInst();
  // }, []);

  return (
    <Flex
      mt={30}
      flexDir="column"
      w="100%"
      alignItems={navSize == "small" ? "center" : "flex-start"}
    >
      <Menu placement="right">
        <Link
          onClick={routeHandler}
          //backgroundColor={active && "#AEC8CA"}
          // backgroundColor="red"
          p={3}
          borderRadius={8}
          _selection={{ textDecor: "none", backgroundColor: "#AEC8CA" }}
          _selected={{ textDecor: "none", backgroundColor: "#AEC8CA" }}
          _visited={{ textDecor: "none", backgroundColor: "#AEC8CA" }}
          _activeLink={{ textDecor: "none", backgroundColor: "#AEC8CA" }}
          _hover={{ textDecor: "none", backgroundColor: "#AEC8CA" }}
          w={navSize == "large" && "100%"}
        >
          <MenuButton w="100%">
            <Flex>
              <Icon as={icon} mt={1} fontSize="20px" color="white" />
              <Text
                ml={5}
                fontWeight="500"
                fontSize="17px"
                mb="2px"
                color="white"
                display={navSize == "small" ? "none" : "flex"}
              >
                {title}
              </Text>
            </Flex>
          </MenuButton>
        </Link>
      </Menu>
    </Flex>
  );
}
