import React from "react";
import { Box, SimpleGrid, Text, Checkbox } from "@chakra-ui/react";

const Privacy = () => {
  return (
    <>
      <Box
        bg="white"
        w="110%"
        ml="-80px"
        h="470px"
        boxShadow="xl"
        p={4}
        color="white"
      >
        <SimpleGrid columns={2} spacing={10}>
          <Box bg="" height="450px">
            <Box bg="" mr="200px" w="50%" h="70px" textAlign="left">
              <Text fontSize="14px" color="#626363" fontWeight="800">
                Extreme Privacy Mode
              </Text>
              <Checkbox mt="5px" size="lg" colorScheme="red">
                <Text fontSize="14px" color="#6D6666" fontWeight="600">
                  Extreme Privacy Mode
                </Text>
              </Checkbox>
            </Box>
          </Box>
          <Box bg="" pl="50px" height="450px">
            <Box bg="" mr="200px" w="50%" h="150px" textAlign="left">
              <Text fontSize="14px" color="#626363" fontWeight="800">
                Extreme Privacy Mode
              </Text>
              <Checkbox mt="5px" size="lg" color="black" colorScheme="red">
                <Text fontSize="14px" color="#6D6666" fontWeight="600">
                  Extreme Privacy Mode
                </Text>
              </Checkbox>
              <Checkbox mt="5px" size="lg" color="black" colorScheme="red">
                <Text fontSize="14px" color="#6D6666" fontWeight="600">
                  Extreme Privacy Mode
                </Text>
              </Checkbox>
              <Checkbox mt="5px" size="lg" color="black" colorScheme="red">
                <Text fontSize="14px" color="#6D6666" fontWeight="600">
                  Extreme Privacy Mode
                </Text>
              </Checkbox>
              <Checkbox mt="5px" size="lg" color="black" colorScheme="red">
                <Text fontSize="14px" color="#6D6666" fontWeight="600">
                  Extreme Privacy Mode
                </Text>
              </Checkbox>
              <Checkbox mt="5px" size="lg" color="black" colorScheme="red">
                <Text fontSize="14px" color="#6D6666" fontWeight="600">
                  Extreme Privacy Mode
                </Text>
              </Checkbox>

              <Box bg="white" mt="25px" h="90px" textAlign="left">
                <Text fontSize="14px" color="#626363" fontWeight="800">
                  Extreme Privacy Mode
                </Text>
                <Checkbox mt="5px" size="lg" color="black" colorScheme="red">
                  <Text fontSize="14px" color="#6D6666" fontWeight="600">
                    Extreme Privacy Mode
                  </Text>
                </Checkbox>
                <Checkbox mt="5px" size="lg" color="black" colorScheme="red">
                  <Text fontSize="14px" color="#6D6666" fontWeight="600">
                    Extreme Privacy Mode
                  </Text>
                </Checkbox>
              </Box>

              <Box bg="" mt="25px" h="90px" textAlign="left">
                <Text fontSize="14px" color="#626363" fontWeight="800">
                  Extreme Privacy Mode
                </Text>
                <Checkbox mt="5px" size="lg" color="black" colorScheme="red">
                  <Text fontSize="14px" color="#6D6666" fontWeight="600">
                    Extreme Privacy Mode
                  </Text>
                </Checkbox>
                <Checkbox mt="5px" size="lg" color="black" colorScheme="red">
                  <Text fontSize="14px" color="#6D6666" fontWeight="600">
                    Extreme Privacy Mode
                  </Text>
                </Checkbox>
              </Box>
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </>
  );
};

export default Privacy;
