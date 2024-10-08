import React, { useState } from "react";
import allColors from "../../utils/colors.js";
import JerseyCustomisableData from "../../utils/jerseyCustomisableData.js";

// onColorSelect is for passing the selected color and selectedNeckId is for getting the selectedNeck from neck options 
export default function Color({ onColorSelect, selectedNeckId ,shapeColor,isOpen,onAccordionToggle}) {

  // getting the selected Jersey from the localstorage
  const selectedJersy = localStorage.getItem("selectedJersy");

  // now getting all data associated to a particular jersey
  const jerseyData = JerseyCustomisableData[selectedJersy];

  // state for showing and hiding color palette
  const [showColor, setShowColor] = useState("");

  // state for recent colors
  const [recentColors, setRecentColors] =  useState(['#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff']);

  // state for the currently selected color for each area
  const [selectedColors, setSelectedColors] = useState({});

  const handleShowColor = (palette) => {
    setShowColor(showColor === palette ? "" : palette);
  };

  // state and function for showing and hiding color tabs
  

  const handleTab = () => {
    onAccordionToggle();
  };

  // passing the selected color to parent as a callback function and updating recent colors
  const handleColor = (color, area) => {
    onColorSelect(color, area);

    const isMobileView = window.innerWidth <= 960; // Change the breakpoint value as needed

  // Call onAccordionToggle only if it's in mobile view
  if (isMobileView) {
    onAccordionToggle();
  }

    // Update the recent colors
    setRecentColors((prevColors) => {
      const newColors = [color, ...prevColors.filter((c) => c !== color)];
      return newColors.slice(0, 10);
    });

    // Update the selected color for the specific area
    setSelectedColors((prevColors) => ({
      ...prevColors,
      [area]: color
    }));
  };

  // function is called here , with area as shirt, neck, shoulder . buttonText for label . Layer for number of color buttons
  // and selectedNeckId for selected neck
  const renderColorSelection = (area, buttonText, layers, selectedNeckId) => {
    const colorAreas = [];
    let neckLayers = layers;
  
    if (selectedNeckId && [2, 4, 12].includes(parseInt(selectedNeckId))) {
      neckLayers = 2;
    } else {
      neckLayers = 1;
    }
  
    for (let i = 1; i <= (area === "neck" ? neckLayers : layers); i++) {
      const colorKey = area + i;
  
      colorAreas.push(
        <div style={{ display: "flex", flexDirection: "column" }} key={i}>
          <span>{buttonText} {i}</span>
          <div style={{ position: "relative" }}>
            <input
              type="button"
              style={{
                backgroundColor: selectedColors[colorKey] || shapeColor[colorKey] || "#fff",
                height: "30px",
                width: "30px",
                marginRight: "250px",
              }}
              onClick={() => handleShowColor(colorKey)}
            />
            
          </div>
          {showColor === colorKey && (
            <>
              <div className="merge-two-layers">
              {showColor === colorKey && (
              <div className="closeBtn" style={{ position: "absolute", top: 0, right: 0 }}>
                <button onClick={() => handleShowColor("")}>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="225.000000pt" height="225.000000pt" viewBox="0 0 225.000000 225.000000" preserveAspectRatio="xMidYMid meet">
<metadata>
Created by potrace 1.10, written by Peter Selinger 2001-2011
</metadata>
<g transform="translate(0.000000,225.000000) scale(0.100000,-0.100000)" fill="#ffffff" stroke="30px solid">
<path d="M65 2180 l-60 -60 498 -498 497 -497 -497 -497 -498 -498 63 -62 62 -63 498 498 497 497 497 -497 498 -498 62 63 63 62 -498 498 -497 497 497 497 498 498 -63 62 -62 63 -498 -498 -497 -497 -495 495 c-272 272 -497 495 -500 495 -3 0 -32 -27 -65 -60z m551 -475 c262 -261 483 -476 492 -476 10 -1 23 0 31 1 23 3 81 51 75 61 -3 5 -1 8 4 7 12 -4 362 346 362 363 0 7 3 10 6 7 3 -3 122 111 266 253 143 142 263 259 267 259 3 -1 21 -14 40 -30 l35 -30 -205 -207 c-112 -115 -213 -213 -224 -218 -11 -6 -18 -17 -17 -25 2 -8 1 -12 -3 -8 -9 8 -35 -16 -35 -32 0 -6 -4 -9 -9 -6 -10 6 -71 -58 -71 -75 0 -7 -3 -9 -7 -6 -9 9 -44 -23 -37 -34 3 -5 1 -9 -4 -9 -13 0 -52 -36 -47 -44 3 -3 2 -4 -2 -1 -10 8 -33 -16 -26 -28 3 -6 1 -7 -5 -3 -7 4 -12 0 -12 -10 0 -10 -3 -14 -7 -11 -8 9 -43 -22 -43 -38 0 -6 -11 -17 -24 -23 -13 -6 -32 -24 -42 -41 -10 -17 -22 -31 -26 -31 -12 0 -79 -68 -106 -109 -21 -31 -22 -37 -10 -60 16 -31 264 -282 271 -275 3 3 8 -4 12 -15 4 -13 11 -19 18 -15 7 4 9 3 4 -1 -9 -10 33 -56 45 -49 4 3 11 -3 15 -13 10 -29 55 -73 67 -66 6 3 8 3 5 -1 -7 -7 59 -83 67 -78 2 1 28 -23 57 -55 28 -31 59 -64 68 -72 9 -9 84 -83 168 -165 112 -110 151 -155 151 -173 0 -13 -4 -22 -9 -19 -5 4 -18 -6 -29 -21 l-19 -27 -472 472 c-259 260 -474 472 -477 472 -3 0 -12 7 -20 15 -20 20 -39 19 -61 -3 -10 -10 -35 -30 -56 -46 -21 -15 -36 -30 -33 -33 3 -3 -14 -20 -37 -38 -23 -18 -41 -38 -39 -44 1 -7 -1 -10 -6 -7 -11 6 -164 -148 -155 -157 3 -4 0 -7 -7 -7 -7 0 -152 -139 -321 -310 -170 -170 -311 -305 -314 -299 -4 5 -11 6 -17 3 -6 -4 -8 -2 -4 4 3 5 -6 19 -21 30 l-28 20 104 105 c57 57 107 110 112 118 5 8 9 11 9 7 0 -4 21 16 47 45 27 28 64 66 83 83 41 37 557 556 595 597 40 44 36 51 -121 214 -34 34 -64 61 -67 58 -4 -3 -5 -2 -2 2 7 9 -16 34 -26 27 -5 -3 -8 -1 -7 3 4 13 -54 73 -69 73 -7 0 -13 6 -13 13 0 19 -35 49 -45 40 -4 -5 -5 -3 -1 4 4 7 -2 14 -15 18 -11 4 -18 9 -15 13 9 8 -35 52 -46 46 -5 -3 -7 -2 -6 3 2 4 -18 28 -43 53 -262 256 -459 456 -459 466 0 13 49 64 61 64 5 0 223 -214 485 -475z"/>
</g>
</svg>
                </button>
              </div>
            )}
                <div style={{ display: "flex" }} className="recent-inputs">
                  {recentColors.map((color, index) => (
                    <input
                      key={index}
                      type="button"
                      style={{
                        backgroundColor: color,
                      }}
                      onClick={() => handleColor(color, colorKey)}
                    />
                  ))}
                </div>
                <div className="color-row">
                  {allColors.map((color, index) => (
                    <input
                      key={index}
                      type="button"
                      style={{
                        backgroundColor: color,
                        height: "15px",
                        width: "15px",
                        marginRight: "5px",
                      }}
                      onClick={() => handleColor(color, colorKey)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      );
    }
    return colorAreas;
  };

  return (
    <>
      <li className={`color-uniform ${isOpen ? "active" : ""}`}>
        <h3 onClick={handleTab} className="forDesktop">Color Uniform</h3>
        <h3 onClick={() => handleTab("color-uniform-layer")} className="forMob"><svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="300.000000pt" height="300.000000pt" viewBox="0 0 300.000000 300.000000" preserveAspectRatio="xMidYMid meet">
        <metadata>
        Created by potrace 1.10, written by Peter Selinger 2001-2011
        </metadata>
        <g transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)" fill="#ffffff" stroke="none">
        <path d="M950 2650 c-91 -3 -172 -9 -180 -15 -40 -26 -620 -624 -629 -648 -15 -40 -14 -91 4 -135 10 -24 89 -110 218 -240 187 -188 252 -242 292 -242 13 0 15 -54 15 -470 0 -453 1 -472 20 -510 11 -22 39 -52 62 -67 l42 -28 698 -3 c669 -2 701 -2 742 17 54 24 92 73 106 137 7 33 10 209 8 507 -3 451 -3 457 17 457 11 0 35 9 53 20 42 26 403 385 437 435 29 43 34 115 11 168 -15 36 -554 581 -596 602 -20 10 -77 14 -207 16 -162 1 -183 -1 -219 -19 -99 -51 -181 -67 -334 -67 -158 0 -223 12 -335 63 -59 27 -62 27 -225 22z m208 -59 c20 -10 71 -30 112 -42 66 -21 95 -24 235 -24 140 0 169 3 235 24 41 12 92 32 112 42 32 16 60 19 204 19 128 0 173 -3 198 -15 18 -9 154 -138 303 -288 368 -369 364 -328 65 -629 -137 -139 -216 -211 -238 -218 -19 -6 -45 -25 -59 -41 l-25 -31 0 -474 c0 -523 1 -510 -62 -556 l-33 -23 -700 0 -700 0 -33 23 c-63 46 -62 36 -62 527 0 507 1 500 -72 533 -64 29 -453 425 -463 470 -17 81 -13 86 293 397 158 159 300 298 317 308 45 26 320 25 373 -2z"/>
        </g>
        </svg>Color</h3>

        {/* if showAnswer is true means tab is open then */}
        {isOpen && (
          <div className="answer-wrap">
            <div className="answer">
              <div className="customize-prod-list scrollbar">
                {/* run this function for 3 times because we have section for shirt, neck, and shoulder */}
                {/* 3rd parameter is for getting the layers to decide the number of color button to show */}
                {/* but for neck we also have selectedNeckId */}
                <div className="wrapper">
                  <h4 className="customize-heading">Uniform Colors</h4>
                  <div className="color-row">
                    <div className="color-col">
                      <div className="color-info">
                        {renderColorSelection("shirt", "Color", jerseyData.uniform_layers)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="wrapper">
                  <h4 className="customize-heading">Neck Colors</h4>
                  <div className="color-row">
                    <div className="color-col">
                      <div className="color-info">
                        {renderColorSelection("neck", "Color", jerseyData.neck_style, selectedNeckId)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="wrapper">
                  <h4 className="customize-heading">Shoulders Colors</h4>
                  <div className="color-row">
                    <div className="color-col">
                      <div className="color-info">
                        {renderColorSelection("shoulder", "Color", jerseyData.shoulder_layers)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </li>
    </>
  );
}
