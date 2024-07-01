import { createContext, useState } from "react";
import "./App.css";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import {
  ExecutionDeclaration,
  FlowgraphDeclarationWithExecutionFlow,
  VariableDeclaration,
  isVariableDeclareExecutionDeclaration,
  type DataType,
  type FlowgraphDeclaration,
} from "yodawg/src/types";
import functions from "./lib/functions.json";
import { flowgraphDeclarationToFlowgraphDeclarationWithExecutionFlow } from "yodawg/src/utils";
import { FlowgraphRuntime } from "yodawg/src/FlowgraphRuntime";

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
  // const [funcId, setFuncId] = useState<string | null>(null);
  // const modalController = useDisclosure();
  const [declaration, setDeclaration] =
    useState<FlowgraphDeclarationWithExecutionFlow>({
      define: "",
      description: "",
      blueprint: "_blueprint.Flowgraph",
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
                name="define"
                onChange={(e) =>
                  setDeclaration((dec) => ({
                    ...dec,
                    define: e.target.value,
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
            <Box as={VStack} spacing="4" alignItems="start">
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
              <Divider />
              {/* List of created steps */}
              <Text>Execution plan</Text>
              <VStack>
                {declaration.executionFlow.execute.map((step, index) =>
                  isVariableDeclareExecutionDeclaration(step) ? (
                    <DeclareVariableStep
                      key={index}
                      step={step}
                      onChange={(newStep) => {
                        setDeclaration((dec) => ({
                          ...dec,
                          executionFlow: {
                            ...dec.executionFlow,
                            execute: [
                              ...dec.executionFlow.execute.slice(0, index),
                              newStep,
                              ...dec.executionFlow.execute.slice(index + 1),
                            ],
                          },
                        }));
                      }}
                    />
                  ) : null
                )}
              </VStack>
            </Box>
          </Box>
          <Box textAlign="start">
            <Text>Declaration</Text>
            <pre>{JSON.stringify(declaration, null, 2)}</pre>
            <Button
              onClick={async () => {
                const fg = new FlowgraphRuntime(
                  flowgraphDeclarationToFlowgraphDeclarationWithExecutionFlow(
                    "javascript",
                    declaration,
                    {}
                  ),
                  undefined,
                  undefined,
                  undefined,
                  { loadCoreFromFs: false }
                );
                await fg.initialize();
                await fg.executeToEnd();
                console.log(fg.getOutput());
              }}
            >
              Execute
            </Button>
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

function NewStep({ onCommit }: { onCommit(step: ExecutionDeclaration): void }) {
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
          onCommit={({ name, initialValue, type }) => {
            onCommit({
              declare: name,
              value: initialValue,
              type,
            });
          }}
        />
      )}
    </>
  );
}

function DeclareVariableStep({
  step,
  onChange,
}: {
  step: VariableDeclaration;
  onChange(newStep: VariableDeclaration): void;
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
          value={step.declare}
          onChange={(e) => {
            onChange({
              ...step,
              declare: e.target.value,
            });
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="type">Type</FormLabel>
        <Select
          value={step.type}
          onChange={(e) => {
            onChange({
              ...step,
              type: e.target.value as DataType,
            });
          }}
        >
          <option value="_types.String">String</option>
          <option value="_types.Number">Number</option>
          <option value="_types.Boolean">Boolean</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="initialValue">Initial value</FormLabel>
        {step.type === "_types.String" && (
          <Input
            id="initialValue"
            name="initialValue"
            value={step.value as string}
            onChange={(e) => {
              onChange({
                ...step,
                value: e.target.value,
              });
            }}
          />
        )}
        {step.type === "_types.Number" && (
          <Input
            id="initialValue"
            name="initialValue"
            type="number"
            value={step.value as number}
            onChange={(e) => {
              onChange({
                ...step,
                value: e.target.valueAsNumber ?? 0,
              });
            }}
          />
        )}
        {step.type === "_types.Boolean" && (
          <Switch
            id="initialValue"
            name="initialValue"
            defaultChecked={step.value as boolean}
            onChange={(e) => {
              onChange({
                ...step,
                value: e.target.checked,
              });
            }}
          />
        )}
      </FormControl>
    </VStack>
  );
}

function DeclareNewVariable({
  onCommit,
}: {
  onCommit(step: { name: string; initialValue: unknown; type: DataType }): void;
}) {
  const initialState = {
    name: "",
    initialValue: "",
    type: "_types.String" as DataType,
  };
  const [state, setState] = useState<{
    name: string;
    initialValue: string | number | boolean;
    type: DataType;
  }>(initialState);
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
        <FormLabel htmlFor="type">Type</FormLabel>
        <Select
          value={state.type}
          onChange={(e) => {
            setState({
              ...state,
              type: e.target.value as DataType,
            });
          }}
        >
          <option value="_types.String">String</option>
          <option value="_types.Number">Number</option>
          <option value="_types.Boolean">Boolean</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="initialValue">Initial value</FormLabel>
        {state.type === "_types.String" && (
          <Input
            id="initialValue"
            name="initialValue"
            value={state.initialValue as string}
            onChange={(e) => {
              setState({
                ...state,
                initialValue: e.target.value,
              });
            }}
          />
        )}
        {state.type === "_types.Number" && (
          <Input
            id="initialValue"
            name="initialValue"
            value={state.initialValue as number}
            type="number"
            onChange={(e) => {
              setState({
                ...state,
                initialValue: e.target.valueAsNumber,
              });
            }}
          />
        )}
        {state.type === "_types.Boolean" && (
          <Switch
            id="initialValue"
            name="initialValue"
            checked={state.initialValue as boolean}
            onChange={(e) => {
              setState({
                ...state,
                initialValue: e.target.checked,
              });
            }}
          />
        )}
      </FormControl>
      <Button
        colorScheme="blue"
        size="sm"
        onClick={() => {
          onCommit(state);
          setState(initialState);
        }}
      >
        Add
      </Button>
    </VStack>
  );
}
