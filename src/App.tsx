import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { FlowgraphRuntime } from "yodawg/src/FlowgraphRuntime";
import functions from "./functions.json";
import { FlowgraphDeclaration } from "yodawg/src/types";

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
  count: 0,
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
        count: (fgRef.current.getVariable("$$variables.index")?.state
          .currentValue ?? 0) as number,
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

function App() {
  const { state, fgRef } = useFlowgraph(fg);

  console.log(state);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>status: {state.status}</h1>
      <div className="card">
        {state.status === "notInitialized" && (
          <button
            onClick={() => {
              fgRef.initialize();
            }}
          >
            Initialize
          </button>
        )}
        {state.status === "initialized" && (
          <button
            onClick={() => {
              fgRef.executeToEnd();
            }}
          >
            count is {state.count}
          </button>
        )}
        {state.status === "execution done" && (
          <button
            onClick={() => {
              fgRef.executeToEnd();
            }}
          >
            Re-execute
          </button>
        )}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
