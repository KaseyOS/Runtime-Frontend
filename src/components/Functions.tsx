import React from "react";
import "./Functions.css";

const Functions: React.FC = () => {
  return (
    <div className="app">
      <div className="search-bar">Search</div>
      <div className="categories">
        <div className="category">#1: Category 1</div>
        <div className="category">#2: Category 2</div>
        <div className="category">#3: Category 3</div>
        <div className="category">#4: Category 4</div>
        <div className="category">#5: Category 5</div>
        <div className="category">#6: Category 6</div>
      </div>
      <div className="content">
        <div className="results">
          <div className="results-header">RESULTS (Category 2)</div>
          <div className="result-item">Number.compare</div>
          <div className="result-item selected">Number.average</div>
          <div className="result-item">Number.compare</div>
        </div>
        <div className="overview">
          <div className="overview-header">OVERVIEW: Average</div>
          <div className="description">
            Description lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
            ipsum lorem ipsum
          </div>
          <div className="examples">Examples</div>
          <div className="release-notes">Release notes</div>
        </div>
      </div>
      <div className="use-function">Use this function</div>
    </div>
  );
};

export default Functions;
