import React, { useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  Input,
  Button,
} from "@chakra-ui/react";
import { getCategorizedFunctions } from "../lib/utils";

const Functions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const categorizedFunctions = getCategorizedFunctions();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFunctions = Object.keys(categorizedFunctions).reduce(
    (acc, type) => {
      const filteredNames = categorizedFunctions[type].filter((name) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredNames.length > 0) {
        acc[type] = filteredNames;
      }
      return acc;
    },
    {} as { [type: string]: string[] }
  );

  return (
    <VStack spacing={0} align="stretch">
      <Box bg="black" color="white" textAlign="center" p={2} fontSize="lg">
        <Input
          placeholder="Search functions..."
          value={searchQuery}
          onChange={handleSearchChange}
          bg="gray.700"
          border="none"
          color="white"
          _placeholder={{ color: "gray.400" }}
          _focus={{ outline: "none", bg: "gray.600" }}
        />
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
          overflowY="auto"
          maxHeight="300px" // Adjust this height as needed
        >
          {Object.keys(filteredFunctions).length > 0 ? (
            Object.keys(filteredFunctions).map((type) => (
              <React.Fragment key={type}>
                <Text fontWeight="bold" mb={2}>
                  {type}
                </Text>
                {filteredFunctions[type].map((name, index) => (
                  <Box
                    key={name}
                    p={2}
                    bg={index % 2 === 1 ? "gray.600" : undefined}
                    cursor="pointer"
                  >
                    {name}
                  </Box>
                ))}
              </React.Fragment>
            ))
          ) : (
            <Text>No functions found.</Text>
          )}
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
          <Button
            bg="gray.600"
            color="white"
            borderRadius="0"
            _hover={{ bg: "gray.500" }}
          >
            Use this function
          </Button>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default Functions;
