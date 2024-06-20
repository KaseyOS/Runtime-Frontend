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
import { getCategorizedFunctions, getData, Test } from "../lib/utils";

const Functions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFunction, setSelectedFunction] = useState<{
    name: string;
    description: string;
    examples: string[];
  } | null>(null);
  const categorizedFunctions = getCategorizedFunctions();
  const data = getData();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryClick = (category: string) => {
    setSearchQuery(`[Category: ${category}] `);
  };

  const handleFunctionClick = (
    name: string,
    description: string,
    examples: string[]
  ) => {
    setSelectedFunction({ name, description, examples });
  };

  const createExamples = (
    functionName: string,
    tests: { [key: string]: Test } | undefined
  ): string[] => {
    if (!tests) return [];

    return Object.keys(tests).map((key) => {
      const test = tests[key];
      const inputs = Object.values(test.input)
        .map((input) => JSON.stringify(input))
        .join(", ");
      return `${functionName}(${inputs}) => ${test.expected}`;
    });
  };

  const filteredFunctions = Object.keys(categorizedFunctions).reduce(
    (acc, type) => {
      let filteredNames = categorizedFunctions[type];
      const categoryMatch = searchQuery.match(/\[Category:\s*(\w+)\]/i);

      if (categoryMatch) {
        const category = categoryMatch[1].toLowerCase();
        if (type.toLowerCase() !== category) {
          return acc;
        }
        filteredNames = filteredNames.filter((name) =>
          name
            .toLowerCase()
            .includes(
              searchQuery.replace(categoryMatch[0], "").trim().toLowerCase()
            )
        );
      } else {
        filteredNames = filteredNames.filter((name) =>
          name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (filteredNames.length > 0) {
        acc[type] = filteredNames;
      }
      return acc;
    },
    {} as { [type: string]: string[] }
  );

  return (
    <VStack
      spacing={0}
      align="stretch"
      height="100vh"
      width="100vw"
      maxWidth="1000px"
      margin="0 auto"
    >
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
        {[
          "Math",
          "String",
          "Number",
          "Object",
          "List",
          "Logical",
          "Dictionary",
          "Date",
        ].map((category, index) => (
          <Box
            key={category}
            flex="1"
            p={3}
            px={5}
            borderRight={index !== 7 ? "1px solid #444" : "none"}
            cursor="pointer"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Box>
        ))}
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
          maxHeight="445px"
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

                  const examples = functionData
                    ? createExamples(name, functionData.tests)
                    : [];

                  return (
                    <Box
                      key={name}
                      p={2}
                      bg={index % 2 === 1 ? "gray.600" : undefined}
                      cursor="pointer"
                      onClick={() =>
                        handleFunctionClick(
                          name,
                          functionData?.description || "",
                          examples
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
          overflowY="auto"
          maxHeight="445px"
        >
          <Text fontWeight="bold">
            {selectedFunction
              ? `OVERVIEW: ${selectedFunction.name}`
              : "OVERVIEW"}
          </Text>
          <Text>{selectedFunction ? selectedFunction.description : ""}</Text>
          <Divider borderColor="gray.600" />
          <Text fontWeight="bold">Examples</Text>
          {selectedFunction ? (
            selectedFunction.examples.map((example, index) => (
              <Text key={index}>{example}</Text>
            ))
          ) : (
            <Text>No examples available.</Text>
          )}
          <Divider borderColor="gray.600" />
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
