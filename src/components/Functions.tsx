import React from "react";
import { Box, Text, VStack, HStack, Divider, Button } from "@chakra-ui/react";

const Functions: React.FC = () => {
  return (
    <VStack spacing={0} align="stretch">
      <Box bg="black" color="white" textAlign="center" p={2} fontSize="lg">
        Search
      </Box>
      <HStack spacing={0} bg="gray.700" color="white" textAlign="center">
        <Box flex="1" p={2} borderRight="1px solid #444">
          #1: Category 1
        </Box>
        <Box flex="1" p={2} borderRight="1px solid #444">
          #2: Category 2
        </Box>
        <Box flex="1" p={2} borderRight="1px solid #444">
          #3: Category 3
        </Box>
        <Box flex="1" p={2} borderRight="1px solid #444">
          #4: Category 4
        </Box>
        <Box flex="1" p={2} borderRight="1px solid #444">
          #5: Category 5
        </Box>
        <Box flex="1" p={2}>
          #6: Category 6
        </Box>
      </HStack>
      <HStack flex="1" spacing={0}>
        <VStack
          flex="1"
          spacing={0}
          bg="gray.800"
          color="white"
          p={2}
          align="stretch"
        >
          <Text fontWeight="bold" mb={2}>
            RESULTS (Category 2)
          </Text>
          <Box p={2} cursor="pointer">
            Number.compare
          </Box>
          <Box p={2} bg="gray.600" cursor="pointer">
            Number.average
          </Box>
          <Box p={2} cursor="pointer">
            Number.compare
          </Box>
        </VStack>
        <VStack
          flex="2"
          spacing={2}
          bg="black"
          color="white"
          p={2}
          align="stretch"
        >
          <Text fontWeight="bold">OVERVIEW: Average</Text>
          <Text>
            Description lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
            ipsum lorem ipsum
          </Text>
          <Divider borderColor="gray.600" />
          <Text>Examples</Text>
          <Divider borderColor="gray.600" />
          <Text>Release notes</Text>
        </VStack>
      </HStack>
      <Button
        bg="gray.600"
        color="white"
        borderRadius="0"
        _hover={{ bg: "gray.500" }}
      >
        Use this function
      </Button>
    </VStack>
  );
};

export default Functions;
