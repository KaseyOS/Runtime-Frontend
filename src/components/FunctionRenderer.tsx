import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FunctionsContext } from "../App";
import { Text, Box, FormLabel, Input, Button, VStack } from "@chakra-ui/react";
import type { DataEntry, FlowgraphDeclaration } from "yodawg/src/types";
import { FlowgraphRuntime } from "yodawg/src/FlowgraphRuntime";
import { flowgraphDeclarationToFlowgraphDeclarationWithExecutionFlow } from "yodawg/src/utils";
import functions from "../lib/functions.json";
import { createExamples } from "./Functions";
import { getFunctionName } from "../lib/utils";

// const useExecuteFlowgraph = (declaration: FlowgraphDeclaration) => {
//   // console.log(
//   //   flowgraphDeclarationToFlowgraphDeclarationWithExecutionFlow(
//   //     "javascript",
//   //     declaration,
//   //     {}
//   //   )
//   // );
//   const fgRef = useRef<FlowgraphRuntime>(
//     new FlowgraphRuntime(
//       flowgraphDeclarationToFlowgraphDeclarationWithExecutionFlow(
//         "javascript",
//         declaration,
//         {}
//       ),
//       undefined,
//       undefined,
//       undefined,
//       { loadCoreFromFs: false }
//     )
//   );
//   const [state, setState] = useState(fgRef.current.state);
//   const [output, setOutput] = useState<unknown | null>(null);

//   useEffect(() => {
//     fgRef.current.initialize();
//   }, []);
//   useEffect(() => {
//     const initListener = fgRef.current.on("initialized", (state) => {
//       setState(state);
//     });
//     const stateChangedListener = fgRef.current.on("stateChanged", (state) => {
//       setState(state);
//       setOutput(
//         fgRef.current.getVariable("$$variables.$$returns")?.state.currentValue
//       );
//     });
//     return () => {
//       initListener();
//       stateChangedListener();
//     };
//   }, []);
//   return {
//     state,
//     output,
//     fgRef: fgRef.current,
//   };
// };

const fg = new FlowgraphRuntime(
  {
    define: "Test",
    blueprint: "_blueprint.Flowgraph",
    functions: functions as unknown as FlowgraphDeclaration[],
    executionFlow: {
      execute: [
        { declare: "index", type: "_types.Number", value: 0 },
        {
          control: "_controls.Loop.While",
          condition: {
            call: "_functions.Math.LessThan",
            arguments: { a: "$$variables.index", b: 10 },
          },
          execute: [
            // {
            //   call: "_functions.String.Log",
            //   arguments: {
            //     messages: [
            //       "While loop, index: {{$$variables.index}}, loop iterations: {{$$variables.$$iterations}}",
            //     ],
            //   },
            // },
            {
              call: "_functions.Math.Add",
              arguments: { numbers: ["$$variables.index", 1] },
              set: "$$variables.index",
            },
          ],
        },
      ],
      return: "$$variables.index",
    },
  },
  undefined,
  undefined,
  undefined,
  { loadCoreFromFs: false }
);

const getInitialState = (fgRef: FlowgraphRuntime) => ({
  status: fgRef.state.status,
  output: "",
});

const useFlowgraph = (fg: FlowgraphRuntime) => {
  const fgRef = useRef(fg);
  const [state, setState] = useState(getInitialState(fgRef.current));
  useEffect(() => {
    const initListener = fgRef.current.on("initialized", () => {
      setState(getInitialState(fgRef.current));
    });
    const cleanupStateChanged = fgRef.current.on("stateChanged", (state) => {
      setState({
        status: state.status,
        output: fgRef.current.hasOutput()
          ? (fgRef.current.getOutput() as string)
          : "",
      });
    });
    const cleanupExecListener = fgRef.current.on("reexecution", () => {
      setState(getInitialState(fgRef.current));
    });
    return () => {
      initListener();
      cleanupStateChanged();
      cleanupExecListener();
    };
  }, []);
  return {
    state,
    fgRef: fgRef.current,
  };
};

export function FunctionRenderer({ funcId }: { funcId: string }) {
  const functions = useContext(FunctionsContext);
  const functionDeclaration = functions.find((f) => f.define === funcId)!; // this is non-nullable as it's coming through the functions modal
  // const fgExec = useExecuteFlowgraph(functionDeclaration);
  const fg = useRef(
    new FlowgraphRuntime(
      flowgraphDeclarationToFlowgraphDeclarationWithExecutionFlow(
        "javascript",
        functionDeclaration,
        {}
      ),
      undefined,
      undefined,
      undefined,
      { loadCoreFromFs: false }
    )
  );
  const { state, fgRef } = useFlowgraph(fg.current);
  const [argsInputValues, setArgsInputValues] = useState({ string: "" });
  const name = getFunctionName(functionDeclaration.define);
  const examples = useMemo(
    () => createExamples(name, functionDeclaration.tests),
    [functionDeclaration, name]
  );

  return (
    <VStack
      textAlign="start"
      border="1px solid black"
      borderRadius="5px"
      p="2"
      m="2"
      alignItems="start"
      spacing="4"
    >
      <Text>Name: {functionDeclaration?.define}</Text>
      <Text>Description: {functionDeclaration?.description}</Text>
      <pre>{JSON.stringify(examples, null, 2)}</pre>
      <Text>Arguments:</Text>
      <h2>status: {JSON.stringify(state)}</h2>
      {state.status === "notInitialized" && (
        <Button
          onClick={() => {
            fgRef.initialize();
          }}
        >
          Initialize
        </Button>
      )}
      {state.status === "initialized" && (
        <Button
          onClick={() => {
            fgRef.executeToEnd(argsInputValues);
          }}
        >
          Execute
        </Button>
      )}
      {state.status === "execution done" && (
        <>
          <Text>
            Result is:{" "}
            <Text as="span" color="green.400">
              {state.output}
            </Text>
          </Text>
          <Button
            onClick={() => {
              fgRef.executeToEnd(argsInputValues);
            }}
          >
            Re-execute
          </Button>
        </>
      )}
      <ArgsInputRenderer
        declaration={functionDeclaration}
        setValues={(key, val) => {
          setArgsInputValues({ ...argsInputValues, [key]: val });
        }}
      />
      {/* <Text>Status: {JSON.stringify(fgExec.state.status)}</Text>
      {fgExec.state.status === "execution done" && (
        <Text>Result: {JSON.stringify(fgExec.output)}</Text>
      )}
      <Button onClick={() => fgExec.fgRef.executeToEnd(argsInputValues)}>
        Execute
      </Button> */}
    </VStack>
  );
}

function ArgsInputRenderer({
  declaration,
  setValues,
}: {
  declaration: FlowgraphDeclaration;
  setValues: (key: string, value: string) => void;
}) {
  const parameters = declaration.parameters;
  console.log(parameters);
  if (parameters) {
    return (
      <Box>
        {Object.keys(parameters).map((key) => (
          <ArgSlotRenderer
            key={key}
            paramKey={key}
            param={parameters[key]}
            onChange={(val) => {
              setValues(key, val);
            }}
          />
        ))}
      </Box>
    );
  }

  return <Text>This function accepts no arguments</Text>;
}

function ArgSlotRenderer({
  paramKey,
  param,
  onChange,
}: {
  paramKey: string;
  param: DataEntry & { value?: unknown }; // TODO: dynamic type based on FlowgraphDeclaration['parameters']
  onChange: (val: string) => void;
}) {
  if (param.type === "_types.String") {
    return (
      <Box>
        <FormLabel>
          {paramKey}{" "}
          <Input
            type="text"
            placeholder="Enter a string"
            name={paramKey}
            onChange={(e) => onChange(e.target.value)}
          />
        </FormLabel>
      </Box>
    );
  }
}
