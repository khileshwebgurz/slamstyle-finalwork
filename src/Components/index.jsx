import React from "react";

import "../../public/custom.js";
const index = () => {
  return (
    <>
      <div id="ranges">
        <div className="teamNameTemp"></div>
        <input
          id="mesh-complexity"
          type="range"
          min="1"
          max="7"
          step="1"
          defaultValue="7"
        />
        <input
          id="interpolation-complexity"
          type="range"
          min="0"
          max="400"
          step="100"
          defaultValue="50"
        />
        <input id="show-original-box-btn" type="checkbox" />

        <div id="scale-wrap-front">
          <div id="svg-container-front">
            <svg id="svg-control-front">
              <path id="control-path-front" />
            </svg>
            <svg id="svg-element-front"></svg>
          </div>
        </div>

        <div id="scale-wrap-back">
          <div id="svg-container-back">
            <svg id="svg-control-back">
              <path id="control-path-back" />
            </svg>
            <svg id="svg-element-back"></svg>
          </div>
        </div>
        <div id="svgpath-front"></div>
        <div id="svgpath-back"></div>
      </div>
    </>
  );
};

export default index;
