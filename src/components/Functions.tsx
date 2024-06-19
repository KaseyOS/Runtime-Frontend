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
import { getCategorizedFunctions, getData } from "../lib/utils";

const Functions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFunction, setSelectedFunction] = useState<{
    name: string;
    description: string;
  } | null>(null);
  const categorizedFunctions = getCategorizedFunctions();
  const data = getData();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFunctionClick = (name: string, description: string) => {
    setSelectedFunction({ name, description });
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
    <VStack spacing={0} align="stretch" height="150vh">
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
        <Box flex="1" p={3} px={5} borderRight="1px solid #444">
          Math
        </Box>
        <Box flex="1" p={3} px={5} borderRight="1px solid #444">
          String
        </Box>
        <Box flex="1" p={3} px={5} borderRight="1px solid #444">
          Number
        </Box>
        <Box flex="1" p={3} px={5} borderRight="1px solid #444">
          Object
        </Box>
        <Box flex="1" p={3} px={5} borderRight="1px solid #444">
          List
        </Box>
        <Box flex="1" p={3} px={5} borderRight="1px solid #444">
          Logical
        </Box>
        <Box flex="1" p={3} px={5} borderRight="1px solid #444">
          Dictionary
        </Box>
        <Box flex="1" p={3} px={5}>
          Date
        </Box>
      </HStack>
      <HStack flex="1" spacing={0} align="stretch">
        <VStack
          flex="1"
          spacing={0}
          bg="gray.800"
          color="white"
          p={2}
          align="stretch"
          overflowY="auto"
          maxHeight="320px" // Adjust this height as needed
        >
          {Object.keys(filteredFunctions).length > 0 ? (
            Object.keys(filteredFunctions).map((type) => (
              <React.Fragment key={type}>
                <Text fontWeight="bold" mb={2} align="left">
                  {type}
                </Text>
                {filteredFunctions[type].slice(0, 10).map((name, index) => {
                  const functionData = data.find(
                    (func) => func.define.split(".").pop() === name
                  );

                  return (
                    <Box
                      key={name}
                      p={2}
                      bg={index % 2 === 1 ? "gray.600" : undefined}
                      cursor="pointer"
                      onClick={() =>
                        handleFunctionClick(
                          name,
                          functionData?.description || ""
                        )
                      }
                    >
                      {name}
                    </Box>
                  );
                })}
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
          maxHeight="320px"
        >
          <Text fontWeight="bold">
            {selectedFunction
              ? `OVERVIEW: ${selectedFunction.name}`
              : "OVERVIEW"}
          </Text>
          <Text>{selectedFunction ? selectedFunction.description : ""}</Text>
          <Divider borderColor="gray.600" />
          <Text>Examples</Text>
          <Divider borderColor="gray.600" />
          <Text>Release notes</Text>
          <Button
            bg="gray.600"
            color="white"
            borderRadius="0"
            _hover={{ bg: "gray.500" }}
            mt="auto"
          >
            Use this function
          </Button>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default Functions;
