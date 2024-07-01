import { createContext, useState } from "react";
import "./App.css";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import Functions from "./components/Functions";
import type { FlowgraphDeclaration } from "yodawg/src/types";
import functions from "./lib/functions.json";
import { FunctionRenderer } from "./components/FunctionRenderer";
import { PlusSquareIcon } from "@chakra-ui/icons";

export const FunctionsContext = createContext<FlowgraphDeclaration[]>([]);
type Directive =
  | "declareVariable"
  | "assignVariable"
  | "callFunction"
  | "branch"
  | "forEachLoop"
  | "overRangeLoop"
  | "whileLoop";

function App() {
  const [funcId, setFuncId] = useState<string | null>(null);
  const modalController = useDisclosure();
  const [declaration, setDeclaration] = useState({
    name: "",
    description: "",
    executionFlow: {
      execute: [],
      return: "",
    },
  });

  return (
    <>
      <FunctionsContext.Provider
        value={functions as unknown as FlowgraphDeclaration[]}
      >
        <Flex gap="8">
          <Box
            textAlign="start"
            as="form"
            display="flex"
            flexDirection="column"
            gap="4"
          >
            <FormControl>
              <FormLabel htmlFor="name">Flowgraph name</FormLabel>
              <Input
                id="name"
                name="name"
                onChange={(e) =>
                  setDeclaration((dec) => ({
                    ...dec,
                    name: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="description">Flowgraph description</FormLabel>
              <Textarea
                id="description"
                name="description"
                onChange={(e) =>
                  setDeclaration((dec) => ({
                    ...dec,
                    description: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="returnIdentifier">
                Return identifier
              </FormLabel>
              <Input
                id="returnIdentifier"
                name="returnIdentifier"
                placeholder="myIdentifier"
                onChange={(e) =>
                  setDeclaration((dec) => ({
                    ...dec,
                    executionFlow: {
                      ...dec.executionFlow,
                      return: "$$variables." + e.target.value,
                    },
                  }))
                }
              />
            </FormControl>
            <Box>
              <Text>Execution plan</Text>
              {/* List of created steps */}
              <VStack>
                {declaration.executionFlow.execute.map((step, index) =>
                  "declare" in step ? (
                    <DeclareVariableStep
                      index={index}
                      declaration={declaration}
                      setDeclaration={setDeclaration}
                    />
                  ) : null
                )}
              </VStack>
              {/* Create a new step */}
              <NewStep
                onCommit={(step) => {
                  setDeclaration((dec) => ({
                    ...dec,
                    executionFlow: {
                      ...dec.executionFlow,
                      execute: [...dec.executionFlow.execute, step],
                    },
                  }));
                }}
              />
            </Box>
          </Box>
          <Box textAlign="start">
            <Text>Declaration</Text>
            <pre>{JSON.stringify(declaration, null, 2)}</pre>
          </Box>
        </Flex>

        {/* <Modal
          size="6"
          isOpen={modalController.isOpen}
          onClose={modalController.onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Functions
                onSelectFunction={(id) => {
                  setFuncId(id);
                  modalController.onClose();
                }}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
        <Box>
          <Button onClick={modalController.onOpen}>
            Choose existing function
          </Button>
          {funcId && <FunctionRenderer funcId={funcId} />}
        </Box> */}
      </FunctionsContext.Provider>
    </>
  );
}

export default App;

function NewStep({ onCommit }: { onCommit(step: unknown): void }) {
  const [nextStepType, setNextStepType] =
    useState<Directive>("declareVariable");
  return (
    <>
      <Select
        value={nextStepType}
        onChange={(e) => setNextStepType(e.target.value as Directive)}
      >
        <option value="declareVariable">Declare variable</option>
        <option value="assignVariable">Assign variable</option>
        <option value="callFunction">Call function</option>
        <option value="branch">Branch</option>
        <option value="forEachLoop">For each loop</option>
        <option value="overRangeLoop">Over range loop</option>
        <option value="whileLoop">While loop</option>
      </Select>
      {nextStepType === "declareVariable" && (
        <DeclareNewVariable
          onCommit={({ name, initialValue }) => {
            onCommit({
              declare: name,
              value: initialValue,
            });
          }}
        />
      )}
    </>
  );
}

function DeclareVariableStep({
  index,
  declaration,
  setDeclaration,
}: {
  index: number;
  declaration: Record<string, unknown>;
  setDeclaration: (
    cb: (declaration: Record<string, unknown>) => Record<string, unknown>
  ) => void;
}) {
  return (
    <VStack
      spacing="4"
      alignItems="start"
      backgroundColor="gray.50"
      p="4"
      rounded="md"
    >
      <FormControl>
        <FormLabel htmlFor="variableName">Variable name</FormLabel>
        <Input
          id="variableName"
          name="variableName"
          value={declaration.executionFlow.execute[index].name}
          onChange={(e) => {
            setDeclaration((dec) => ({
              ...dec,
              executionFlow: {
                ...dec.executionFlow,
                execute: [
                  ...dec.executionFlow.execute.slice(0, index),
                  { ...dec.executionFlow.execute[index], name: e.target.value },
                  ...dec.executionFlow.execute.slice(index + 1),
                ],
              },
            }));
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="initialValue">Initial value</FormLabel>
        <Input
          id="initialValue"
          name="initialValue"
          value={declaration.executionFlow.execute[index].initialValue}
          onChange={(e) => {
            setDeclaration((dec) => ({
              ...dec,
              executionFlow: {
                ...dec.executionFlow,
                execute: [
                  ...dec.executionFlow.execute.slice(0, index),
                  {
                    ...dec.executionFlow.execute[index],
                    initialValue: e.target.value,
                  },
                  ...dec.executionFlow.execute.slice(index + 1),
                ],
              },
            }));
          }}
        />
      </FormControl>
    </VStack>
  );
}

function DeclareNewVariable({
  onCommit,
}: {
  onCommit(step: { name: string; initialValue: unknown }): void;
}) {
  const [state, setState] = useState({
    name: "",
    initialValue: "",
  });
  return (
    <VStack
      spacing="4"
      alignItems="start"
      backgroundColor="gray.50"
      p="4"
      rounded="md"
    >
      <FormControl>
        <FormLabel htmlFor="variableName">Variable name</FormLabel>
        <Input
          id="variableName"
          name="variableName"
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="initialValue">Initial value</FormLabel>
        <Input
          id="initialValue"
          name="initialValue"
          value={state.initialValue}
          onChange={(e) => setState({ ...state, initialValue: e.target.value })}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        size="sm"
        onClick={() => {
          onCommit(state);
        }}
      >
        Add
      </Button>
    </VStack>
  );
}
