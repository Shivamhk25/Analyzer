import React from "react";
import { Page } from "@shopify/polaris";
import {
  SimpleGrid,
  Box,
  Text,
  Button,
  Progress,
  Divider,
} from "@chakra-ui/react";

const BillingInfo = () => {
  return (
    <>
      <Page>
        <div style={{ backgroundColor: "", width: "850px", height: "500px" }}>
          <SimpleGrid columns={2} spacing={10}>
            <Box bg="" width="330px" height="200px">
              <Text fontSize="3xl" color="gray" fontWeight="600">
                Current Plan
              </Text>
              <Text mt={2} fontSize="15px" color="gray" fontWeight="500">
                You can upgrade or download anytime based on your needs. If you
                have over 20k shipment per month contact sales for enterprises
                solutions
              </Text>
            </Box>

            <Box
              bg="white"
              padding="5px"
              boxShadow="xl"
              pl={5}
              width={410}
              height="150px"
            >
              <SimpleGrid columns={2} spacing={10}>
                <Box bg="" height="40px">
                  <Text fontSize="3xl" color="gray" fontWeight="800">
                    Free Trial
                  </Text>
                </Box>
                <Box bg="" height="40px">
                  <Button
                    fontSize="16px"
                    mt={2}
                    left={110}
                    colorScheme="blue"
                    variant="link"
                  >
                    Upgrade
                  </Button>
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={10}>
                <Box bg="" height="40px">
                  <Text
                    fontSize="2xl"
                    color="gray"
                    width="300px"
                    fontWeight="500"
                  >
                    Monthly Shipment quota usage
                  </Text>
                </Box>
                <Box bg="" mt={-2} width="100px" ml="115px" height="40px">
                  <Text fontSize="20px" color="gray" fontWeight="600">
                    1/100
                  </Text>
                </Box>
              </SimpleGrid>

              <Box ml={-3} bg="" w="100%" p={4} color="white">
                <Progress colorScheme="blue" height="15px" value={30} />
              </Box>
            </Box>

            <Box bg="" width="330px" height="200px">
              <Text fontSize="3xl" color="gray" fontWeight="600">
                Billing Information
              </Text>
              <Text mt={2} fontSize="15px" color="gray" fontWeight="500">
                Your invoices are paid using your active payment method , any
                remaining balance will be automatically applied to your next
                bill.
              </Text>
            </Box>
            <Box
              bg="white"
              padding="5px"
              boxShadow="xl"
              pl={5}
              width={410}
              height="200px"
            >
              <SimpleGrid columns={2} spacing={10}>
                <Box bg="" height="40px">
                  <Text fontSize="3xl" color="gray" fontWeight="800">
                    Payment Method
                  </Text>
                </Box>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={10}>
                <Box bg="" height="40px">
                  <Text
                    fontSize="2xl"
                    color="gray"
                    width="300px"
                    fontWeight="500"
                  >
                    Shopify
                  </Text>
                </Box>
              </SimpleGrid>

              <Divider
                size="lg"
                variant="solid"
                colorScheme="black"
                width="350px"
              />

              <Box bg="" ml={-3} w="100%" p={4} color="white">
                <SimpleGrid columns={2} spacing={10}>
                  <Box bg="" height="40px">
                    <Text
                      fontSize="2xl"
                      color="gray"
                      width="300px"
                      fontWeight="500"
                    >
                      NEXT PAYMENT DUE <br />
                      null
                    </Text>
                  </Box>
                  <Box bg="" width="150px" ml="1px" height="40px">
                    <Text fontSize="15px" color="gray" fontWeight="600">
                      BILLING CYCLE <br />
                      Every 30 days
                    </Text>
                  </Box>
                </SimpleGrid>
              </Box>
            </Box>
          </SimpleGrid>
        </div>
      </Page>
    </>
  );
};

export default BillingInfo;
