import React, { useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Divider,
  Input,
  Button,
  Code,
} from "@chakra-ui/react";
import { getCategorizedFunctions, getData, Test } from "../lib/utils";

export const createExamples = (
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

const Functions = ({
  onSelectFunction,
}: {
  onSelectFunction: (id: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFunction, setSelectedFunction] = useState<{
    name: string;
    description: string;
    examples: string[];
    id: string;
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
    examples: string[],
    id: string
  ) => {
    setSelectedFunction({ name, description, examples, id });
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
                {(searchQuery
                  ? filteredFunctions[type]
                  : filteredFunctions[type].slice(0, 10)
                ).map((name, index) => {
                  const functionData = data.find(
                    (func) => func.define.split(".").pop() === name
                  );

                  if (!functionData) return null;

                  let examples: string[];

                  try {
                    examples = createExamples(name, functionData.tests);
                  } catch (e) {
                    return;
                  }

                  return (
                    <Box
                      key={name}
                      p={2}
                      bg={
                        selectedFunction?.id === functionData.define
                          ? "green.400"
                          : index % 2 === 1
                          ? "gray.600"
                          : undefined
                      }
                      cursor="pointer"
                      _hover={
                        selectedFunction?.id !== functionData.define
                          ? { bg: "red.400" }
                          : undefined
                      }
                      onClick={() =>
                        handleFunctionClick(
                          name,
                          functionData.description,
                          examples,
                          functionData.define
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
              <Code key={index} colorScheme="whiteAlpha" variant={"subtle"}>
                {example}
              </Code>
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
            onClick={() => {
              if (selectedFunction) {
                onSelectFunction(selectedFunction.id);
              }
            }}
          >
            Use this function
          </Button>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default Functions;
