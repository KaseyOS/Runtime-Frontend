import React, { useState } from "react";
import { getCategorizedFunctions } from "../lib/utils";

const Functions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const categorizedFunctions = getCategorizedFunctions();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFunctions = Object.keys(categorizedFunctions).reduce(
    (acc, type) => {
      const filteredNames = categorizedFunctions[type].filter((name) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredNames.length > 0) {
        acc[type] = filteredNames;
      }
      return acc;
    },
    {} as { [type: string]: string[] }
  );

  return (
    <div>
      <h2>Functions</h2>
      <input
        type="text"
        placeholder="Search functions..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {Object.keys(filteredFunctions).length > 0 ? (
        Object.keys(filteredFunctions).map((type) => (
          <div key={type}>
            <h3>{type}</h3>
            <ul>
              {filteredFunctions[type].map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No functions found.</p>
      )}
    </div>
  );
};

export default Functions;
