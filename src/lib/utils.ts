import data from "./functions.json";

interface FunctionData {
  define: string;
  blueprint: string;
  description: string;
  parameters: object;
  implementation: object;
  returns: object;
  tests: object;
}

interface CategorizedFunctions {
  [type: string]: string[];
}

export const getCategorizedFunctions = (): CategorizedFunctions => {
  const categorizedFunctions: CategorizedFunctions = {};

  (data as FunctionData[]).forEach((func) => {
    // TODO: Remove below line
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, type, name] = func.define.split(".");
    if (!categorizedFunctions[type]) {
      categorizedFunctions[type] = [];
    }
    categorizedFunctions[type].push(name);
  });

  return categorizedFunctions;
};
