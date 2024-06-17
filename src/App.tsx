import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { FlowgraphRuntime } from "yodawg/src/FlowgraphRuntime";
import functions from "./functions.json";

const fg = new FlowgraphRuntime(
  {
    define: "Test",
    blueprint: "_blueprints.Flowgraph",
    functions,
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
            {
              call: "_functions.String.Log",
              arguments: {
                messages: [
                  "While loop, index: {{$$variables.index}}, loop iterations: {{$$variables.$$iterations}}",
                ],
              },
            },
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
  { loadCoreFromFs: false }
);

const useFlowgraph = (fg: FlowgraphRuntime) => {
  const fgRef = useRef(fg);
  const [state, setState] = useState({
    status: fgRef.current.state.status,
    count: 0,
  });
  useEffect(() => {
    if (fgRef.current.state.status === "notInitialized") {
      fgRef.current.initialize();
    }
  }, []);
  useEffect(() => {
    const id = setInterval(() => {
      setState({
        status: fgRef.current.state.status,
        count: fgRef.current.hasVariableDeclared("$$variables.index")
          ? (fgRef.current.getVariable("$$variables.index").state
              .currentValue as number)
          : 0,
      });
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);
  return {
    state,
    fgRef: fgRef.current,
  };
};

function App() {
  const { state, fgRef } = useFlowgraph(fg);

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
        <button
          onClick={() => {
            fgRef.executeToEnd();
          }}
        >
          count is {state.count}
        </button>
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
