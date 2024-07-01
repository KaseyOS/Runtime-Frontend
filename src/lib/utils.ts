/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import data from "./functions.json";

export interface FunctionData {
  define: string;
  blueprint: string;
  description: string;
  parameters: object;
  implementation: object;
  returns: object;
  tests: { [key: string]: Test };
  examples?: Example[];
}

export interface Test {
  description: string;
  input: { [key: string]: any };
  expected: any;
}

export interface Example {
  description: string;
  input: { [key: string]: any };
  expected: any;
}

export interface CategorizedFunctions {
  [type: string]: string[];
}

export const getCategorizedFunctions = (): CategorizedFunctions => {
  const categorizedFunctions: CategorizedFunctions = {};

  (data as unknown as FunctionData[]).forEach((func) => {
    const [_, type, name] = func.define.split(".");
    if (!categorizedFunctions[type]) {
      categorizedFunctions[type] = [];
    }
    categorizedFunctions[type].push(name);
  });

  return categorizedFunctions;
};

export const getData = (): FunctionData[] => {
  return data as unknown as FunctionData[];
};

export function getFunctionName(define: string): string {
  return define.split(".").pop()!;
}
