import React from "react";
import { getCategorizedFunctions } from "../lib/utils";

const Functions: React.FC = () => {
  const categorizedFunctions = getCategorizedFunctions();

  return (
    <div>
      <h2>Functions</h2>

      {Object.keys(categorizedFunctions).map((type) => (
        <div key={type}>
          <h3>
            <b>{type}</b>
          </h3>
          <ul>
            {categorizedFunctions[type].map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Functions;
