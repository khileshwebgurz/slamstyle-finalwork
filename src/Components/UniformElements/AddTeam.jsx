import React from "react";
import { useState, useEffect, useMemo } from "react";
import arc from "/assets/straighten-text-img.png";
import allColors from "../../utils/colors.js";

// import AddPlayerNum from "./AddPlayerNum.jsx";
// import AddPlayerName from "./AddPlayerName.jsx";
// import AddText from "./AddText.jsx";

const AddTeam = ({
  onCanvasTemp,
  getNumValue,
  onPlayerTemp,
  txtPosition,
  isOpen,
  onAccordionToggle,
  numPosition,
  backNumPosition,
  backTextPosition,
}) => {
  // this state is for showing/hiding the tab of AddText
  const handleTab = () => {
    onAccordionToggle();
  };

  const [boldchecked, setBoldchecked] = useState(false);
  const handleBoldCheck = (e) => {
    setBoldchecked(e.target.checked);
  };

  const [italicCheck, setItalicCheck] = useState(false);
  const handleItalicCheck = (e) => {
    setItalicCheck(e.target.checked);
  };

  const [outlineCheck, setOutlineCheck] = useState(false);
  const handleOutlineCheck = (e) => {
    setOutlineCheck(e.target.checked);
  };

  // state for showing and hiding color palette
  const [showOutlineColors, setShowOutlineColors] = useState(false);
  // fir showing/hiding colors
  const toggleOutlineColors = () => {
    setShowOutlineColors(!showOutlineColors);
  };

  const [selectedOutlineColor, setSelectedOutlineColor] = useState("");

  // for handling selected color
  const handleOutlineColorSelection = (color) => {
    setSelectedOutlineColor(color);
    setRecentColors((prevColors) => {
      const newColors = [color, ...prevColors.filter((c) => c !== color)];
      return newColors.slice(0, 10);
    });
  };

  const loadCSS = (href) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = href;
    document.head.appendChild(link);
  };

  useMemo(() => {
    loadCSS("assets/font-assets/fonts.css");
  }, []);

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // state for showing and hiding color palette
  const [showAllColors, setShowAllColors] = useState(false);
  // fir showing/hiding colors
  const toggleAllColors = () => {
    setShowAllColors(!showAllColors);
  };

  const [recentColors, setRecentColors] = useState([
    "#fff",
    "#fff",
    "#fff",
    "#fff",
    "#fff",
    "#fff",
    "#fff",
    "#fff",
    "#fff",
    "#fff",
  ]);
  // state for storing selected color
  const [selectedColor, setSelectedColor] = useState("");

  const handleColorSelection = (color) => {
    setSelectedColor(color);
    setRecentColors((prevColors) => {
      const newColors = [color, ...prevColors.filter((c) => c !== color)];
      return newColors.slice(0, 10);
    });
  };

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // state for select option for shapes
  const [shapeValue, setShapeValue] = useState("Straight");
  // shape array for all shapes

  // handling shapeValue to set shape
  const handleOptionChange = () => {
    setShapeValue(document.getElementById("shape1").value);
  };

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // state for selected font value from css
  const [fontValue, setFontValue] = useState("SS0");
  // storing all font
  const fontArray = [];
  for (let i = 0; i <= 401; i++) {
    fontArray.push(`SS${i}`);
  }
  // mapping my font value with the src url
  const [fontMapping, setFontMapping] = useState({});

  // handling fontchange
  const handleFontChange = () => {
    setFontValue(document.getElementById("font1").value);
  };

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // this useEffect is for loading my custom.js file
  useEffect(() => {
    // Dynamically load the custom.js script
    const script = document.createElement("script");
    script.src = "./custom.js";
    script.async = true;
    document.body.appendChild(script);

    // Remove the script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // this useEffect is for reading my fonts.css file to excess font family and url value
  useEffect(() => {
    // Dynamically parse CSS font-face rules
    const styleSheets = Array.from(document.styleSheets);
    const fontMappingTemp = {};
    styleSheets.forEach((styleSheet) => {
      try {
        const cssRules = Array.from(styleSheet.cssRules);
        cssRules.forEach((rule) => {
          if (rule instanceof CSSFontFaceRule) {
            const fontFamily = rule.style.fontFamily.replace(/"/g, "");
            const fontSrc = rule.style.src.match(/url\("(.*)"\)/)[1];
            fontMappingTemp[fontFamily] = fontSrc;
          }
        });
      } catch (e) {
        console.log("Error accessing CSS rules:", e);
      }
    });
    setFontMapping(fontMappingTemp);
  }, [fontValue]);

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // this is handled when Apply button is clicked, it will call svgpathfunc from custom.js and
  // pass value dynamically from here

  const [playerText, setPlayerText] = useState("");

  useEffect(() => {
    if (playerText) {
      handlePlayerData();
    }
  }, [
    shapeValue,
    fontValue,
    boldchecked,
    italicCheck,
    outlineCheck,
    selectedOutlineColor,
    selectedColor,
  ]);

  const handlePlayerData = () => {
    const textInput = playerText;
    const textShape = shapeValue;
    const textFont = fontValue;

    if (!playerText) {
      alert("Please Enter Player Name");
      return;
    } else {
      setPlayerErrors("");
    }

    window.svgpathfunc1(
      "back",
      textInput,
      outlineCheck,
      selectedOutlineColor,
      selectedColor,
      fontMapping[textFont]?.split("/").pop(),
      boldchecked,
      textShape,
      italicCheck
    );
  };

  useEffect(() => {
    const handlePlayerTemp = () => {
      onPlayerTemp(window.canvasTemp1);
    };

    window.addEventListener("canvasTemp1", handlePlayerTemp);

    return () => {
      window.removeEventListener("canvasTemp1", handlePlayerTemp);
    };
  }, [onPlayerTemp]);

  const handleReset = () => {
    backTextPosition({ left: 80, top: 70, scaleX: 1, scaleY: 1, angle: 0 });
  };

  const [boldchecked1, setBoldchecked1] = useState(false);
  const handleBoldCheck1 = (e) => setBoldchecked1(e.target.checked);

  const [italicCheck1, setItalicCheck1] = useState(false);
  const handleItalicCheck1 = (e) => setItalicCheck1(e.target.checked);

  const [outlineCheck1, setOutlineCheck1] = useState(false);
  const handleOutlineCheck1 = (e) => setOutlineCheck1(e.target.checked);

  const [showOutlineColors1, setShowOutlineColors1] = useState(false);
  const toggleOutlineColors1 = () => setShowOutlineColors1(!showOutlineColors1);

  const [selectedOutlineColor1, setSelectedOutlineColor1] = useState("");
  const handleOutlineColorSelection1 = (color) => {
    setSelectedOutlineColor1(color);
    setRecentColors((prevColors) => {
      const newColors = [color, ...prevColors.filter((c) => c !== color)];
      return newColors.slice(0, 10);
    });
  };

  //error for empty field
  const [errors, setErrors] = useState(false);
  const [playerErrors, setPlayerErrors] = useState("");
  const [numerrors, setNumErrors] = useState("");

  const [inputText, setInputText] = useState("");

  const [showAllColors1, setShowAllColors1] = useState(false);
  const toggleAllColors1 = () => setShowAllColors1(!showAllColors1);

  const [selectedColor1, setSelectedColor1] = useState("");
  const handleColorSelection1 = (color) => {
    setSelectedColor1(color);
    setRecentColors((prevColors) => {
      const newColors = [color, ...prevColors.filter((c) => c !== color)];
      return newColors.slice(0, 10);
    });
  };

  const [shapeValue1, setShapeValue1] = useState("Straight-Line");
  const shapeArray = [
    "Straight-Line",
    "Vertical-Arc",
    "Center-Bulge",
    "Bottom-Vertical",
    "Full-Rev-Arc",
    "Half-Asleep-Arc",
    "Inverse-Vertical",
    "San-Diego",
    "Breathing-In",
  ];
  const handleOptionChange1 = () =>
    setShapeValue1(document.getElementById("shape").value);

  const [fontValue1, setFontValue1] = useState("SS0");
  const fontArray1 = Array.from({ length: 402 }, (_, i) => `SS${i}`);
  const [fontMapping1, setFontMapping1] = useState({});

  const handleFontChange1 = () =>
    setFontValue1(document.getElementById("font").value);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "./custom.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const styleSheets = Array.from(document.styleSheets);
    const fontMappingTemp = {};
    styleSheets.forEach((styleSheet) => {
      try {
        const cssRules = Array.from(styleSheet.cssRules);
        cssRules.forEach((rule) => {
          if (rule instanceof CSSFontFaceRule) {
            const fontFamily = rule.style.fontFamily.replace(/"/g, "");
            const fontSrc = rule.style.src.match(/url\("(.*)"\)/)[1];
            fontMappingTemp[fontFamily] = fontSrc;
          }
        });
      } catch (e) {
        console.log("Error accessing CSS rules:", e);
      }
    });
    setFontMapping1(fontMappingTemp);
  }, [fontValue1]);

  useEffect(() => {
    if (inputText) {
      handlegettingText();
    }
  }, [
    shapeValue1,
    fontValue1,
    boldchecked1,
    italicCheck1,
    outlineCheck1,
    selectedOutlineColor1,
    selectedColor1,
  ]);

  const handlegettingText = () => {
    const textInput = inputText;
    const textShape = shapeValue1;
    const textFont = fontValue1;
    if (!inputText) {
      // setErrors("Please Team name");
      alert("Please Enter Team Name");
      return;
    } else {
      setErrors("");
    }
    window.svgpathfunc(
      "front",
      textInput,
      outlineCheck1,
      selectedOutlineColor1,
      selectedColor1,
      fontMapping1[textFont]?.split("/").pop(),
      boldchecked1,
      textShape,
      italicCheck1
    );
  };

  useEffect(() => {
    const handleCanvasTemp = () => {
      onCanvasTemp(window.canvasTemp);
    };

    window.addEventListener("canvasTemp", handleCanvasTemp);

    return () => {
      window.removeEventListener("canvasTemp", handleCanvasTemp);
    };
  }, [onCanvasTemp]);

  const handleReset1 = () => {
    txtPosition({ left: 80, top: 150, scaleX: 1, scaleY: 1, angle: 0 });
  };

  const [numValue, setNumValue] = useState("");

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  const [boldchecked2, setBoldchecked2] = useState(false);
  const handleBoldCheck2 = (e) => {
    setBoldchecked2(e.target.checked);
  };

  const [italicCheck2, setItalicCheck2] = useState(false);
  const handleItalicCheck2 = (e) => {
    setItalicCheck2(e.target.checked);
  };

  const [outlineCheck2, setOutlineCheck2] = useState(false);
  const handleOutlineCheck2 = (e) => {
    setOutlineCheck2(e.target.checked);
  };

  // state for showing and hiding color palette
  const [showOutlineColors2, setShowOutlineColors2] = useState(false);
  // fir showing/hiding colors
  const toggleOutlineColors2 = () => {
    setShowOutlineColors2(!showOutlineColors2);
  };

  // state for storing selected color
  const [selectedOutlineColor2, setSelectedOutlineColor2] = useState("");

  // for handling selected color
  const handleOutlineColorSelection2 = (color) => {
    setSelectedOutlineColor2(color);
    setRecentColors((prevColors) => {
      const newColors = [color, ...prevColors.filter((c) => c !== color)];
      return newColors.slice(0, 10);
    });
  };

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // state for showing and hiding color palette
  const [showAllColors2, setShowAllColors2] = useState(false);
  // fir showing/hiding colors
  const toggleAllColors2 = () => {
    setShowAllColors2(!showAllColors2);
  };

  // state for storing selected color
  const [selectedColor2, setSelectedColor2] = useState("");

  // for handling selected color
  const handleColorSelection2 = (color) => {
    setSelectedColor2(color);
    setRecentColors((prevColors) => {
      const newColors = [color, ...prevColors.filter((c) => c !== color)];
      return newColors.slice(0, 10);
    });
  };

  // state for selected font value from css
  const [fontValue2, setFontValue2] = useState("SS0");
  // storing all font
  const fontArray2 = [];
  for (let i = 0; i <= 401; i++) {
    fontArray2.push(`SS${i}`);
  }
  // mapping my font value with the src url
  const [fontMapping2, setFontMapping2] = useState({});

  // handling fontchange
  const handleFontChange2 = () => {
    setFontValue2(document.getElementById("font2").value);
  };

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // this useEffect is for loading my custom.js file
  useEffect(() => {
    // Dynamically load the custom.js script
    const script = document.createElement("script");
    script.src = "./custom.js";
    script.async = true;
    document.body.appendChild(script);

    // Remove the script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // this useEffect is for reading my fonts.css file to excess font family and url value
  useEffect(() => {
    // Dynamically parse CSS font-face rules
    const styleSheets = Array.from(document.styleSheets);
    const fontMappingTemp = {};
    styleSheets.forEach((styleSheet) => {
      try {
        const cssRules = Array.from(styleSheet.cssRules);
        cssRules.forEach((rule) => {
          if (rule instanceof CSSFontFaceRule) {
            const fontFamily = rule.style.fontFamily.replace(/"/g, "");
            const fontSrc = rule.style.src.match(/url\("(.*)"\)/)[1];
            fontMappingTemp[fontFamily] = fontSrc;
          }
        });
      } catch (e) {
        console.log("Error accessing CSS rules:", e);
      }
    });
    setFontMapping2(fontMappingTemp);
  }, [fontValue2]);

  useEffect(() => {
    if (numValue) {
      handlegettingNum();
    }
  }, [
    fontValue2,
    boldchecked2,
    italicCheck2,
    outlineCheck2,
    selectedOutlineColor2,
    selectedColor2,
  ]);

  const handlegettingNum = () => {
    const textInput = document.getElementById("text-num").value;

    const textFont = fontValue2;
    if (!textInput) {
      alert("Please Enter Value");
      return;
    } else {
      setNumErrors(" ");
    }
    window.svgpathfunc2(
      "front",
      textInput,
      outlineCheck2,
      selectedOutlineColor2,
      selectedColor2,
      fontMapping2[textFont]?.split("/").pop(),
      boldchecked2,
      "Straight",
      italicCheck2
    );
  };

  useEffect(() => {
    const handleCanvasTemp = () => {
      getNumValue(window.canvasTemp2);
    };

    window.addEventListener("canvasTemp2", handleCanvasTemp);

    return () => {
      window.removeEventListener("canvasTemp2", handleCanvasTemp);
    };
  }, [getNumValue]);

  const handleReset2 = () => {
    numPosition({ left: 200, top: 100, scaleX: 0.7, scaleY: 1.4, angle: 0 });
    backNumPosition({ left: 100, top: 150, scaleX: 1.5, scaleY  : 2, angle: 0 });
  };

  const closeAllColors = () => {
    setShowAllColors(false);
    setShowOutlineColors(false);
    setShowAllColors1(false);
    setShowOutlineColors1(false);
    setShowAllColors2(false);
    setShowOutlineColors2(false);
  };

  return (
    <>
      <li className={`${isOpen ? "active" : ""} text-style`}>
        {/* this is the heading of tab */}
        <h3 onClick={handleTab} className="forMob">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.0"
            width="300.000000pt"
            height="300.000000pt"
            viewBox="0 0 300.000000 300.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <metadata>
              Created by potrace 1.10, written by Peter Selinger 2001-2011
            </metadata>
            <g
              transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)"
              fill="#ffffff"
              stroke="none"
            >
              <path d="M347 2969 c-147 -50 -262 -164 -313 -308 -22 -62 -24 -80 -24 -307 0 -234 1 -242 23 -274 32 -48 69 -72 120 -77 61 -7 128 25 159 75 22 35 23 50 28 259 5 243 7 247 74 297 25 19 45 21 249 26 209 5 224 6 259 28 50 31 82 98 75 159 -5 51 -29 88 -77 121 -32 21 -40 22 -274 22 -215 -1 -247 -3 -299 -21z m533 -27 c40 -20 80 -74 80 -109 0 -40 -28 -87 -63 -108 -28 -18 -57 -20 -249 -25 l-216 -5 -43 -30 c-23 -16 -53 -50 -66 -74 -22 -42 -23 -55 -23 -230 0 -207 -7 -244 -49 -285 -58 -56 -145 -39 -191 36 -18 30 -20 51 -20 233 0 215 8 264 54 359 55 111 189 213 319 241 39 8 132 14 247 14 157 1 190 -2 220 -17z" />
              <path d="M2080 2968 c-48 -33 -72 -70 -77 -121 -7 -61 25 -128 75 -159 35 -22 50 -23 259 -28 204 -5 224 -7 249 -26 67 -50 69 -54 74 -297 5 -209 6 -224 28 -259 31 -50 98 -82 159 -75 51 5 88 29 121 77 21 32 22 41 22 264 0 161 -4 246 -14 281 -44 167 -175 299 -345 349 -43 13 -104 16 -286 16 -224 0 -233 -1 -265 -22z m503 -24 c184 -41 319 -173 362 -355 10 -45 15 -119 15 -249 0 -208 -7 -236 -69 -277 -40 -27 -71 -29 -117 -7 -62 30 -68 53 -74 294 -6 244 -10 260 -92 316 l-41 29 -216 5 c-203 5 -218 6 -253 28 -87 54 -68 181 32 221 43 17 371 13 453 -5z" />
              <path d="M935 2151 c-28 -12 -76 -61 -86 -89 -17 -44 -10 -117 14 -152 45 -68 70 -75 280 -77 l188 -3 -1 -495 c0 -340 3 -508 11 -537 14 -55 73 -114 122 -123 88 -17 173 36 196 123 8 29 11 197 11 537 l-1 495 188 3 c211 2 235 9 281 78 20 28 23 44 20 94 -4 63 -20 94 -67 131 -25 18 -49 19 -581 21 -305 1 -564 -2 -575 -6z m1151 -73 c38 -43 45 -88 19 -138 -29 -56 -61 -65 -262 -68 -167 -3 -183 -5 -200 -24 -17 -19 -18 -54 -23 -543 l-5 -523 -24 -26 c-53 -56 -135 -55 -184 4 l-24 28 -7 518 c-6 421 -10 523 -21 541 -14 20 -23 21 -202 25 -205 4 -221 7 -253 61 -37 59 -21 130 36 168 28 18 48 19 572 17 l544 -3 34 -37z" />
              <path d="M110 989 c-32 -13 -68 -47 -86 -81 -21 -41 -20 -464 2 -539 50 -170 172 -292 343 -343 43 -13 102 -16 286 -16 224 0 233 1 265 22 48 33 72 70 77 121 7 61 -25 128 -75 159 -35 22 -50 23 -259 28 -243 5 -247 7 -297 74 -19 25 -21 45 -26 249 -5 209 -6 224 -28 259 -39 63 -134 94 -202 67z m136 -57 c43 -32 48 -57 54 -283 l5 -216 29 -42 c16 -23 48 -53 70 -66 39 -22 53 -23 251 -27 235 -4 260 -10 289 -72 21 -45 20 -74 -4 -114 -41 -66 -62 -72 -279 -72 -215 0 -275 10 -374 62 -113 61 -197 171 -232 305 -11 41 -15 112 -15 251 0 181 2 197 22 233 36 65 124 85 184 41z" />
              <path d="M2753 980 c-24 -12 -53 -38 -65 -58 -22 -35 -23 -50 -28 -259 -5 -204 -7 -224 -26 -249 -50 -67 -54 -69 -297 -74 -209 -5 -224 -6 -259 -28 -50 -31 -82 -98 -75 -159 5 -51 29 -88 77 -121 32 -21 41 -22 265 -22 254 0 291 6 397 62 68 36 156 125 191 194 51 101 57 140 57 389 0 224 -1 233 -22 265 -52 76 -137 100 -215 60z m147 -48 c53 -39 60 -70 60 -276 0 -139 -4 -204 -16 -250 -45 -175 -175 -305 -350 -350 -84 -22 -432 -23 -472 -2 -71 37 -98 105 -67 170 30 64 53 70 290 74 198 4 212 5 251 27 22 13 54 43 70 66 l29 42 5 216 c6 240 12 264 72 295 39 20 91 15 128 -12z" />
            </g>
          </svg>
          Text
        </h3>

        {isOpen && (
          <div className="answer-wrap">
            <div>
              {/* yaha see */}

              <div className="text-style">
                <div className="answer">
                  <div className="customize-prod-list scrollbar">
                    <div className="wraper">
                      <div className="name-number-row">
                        <div className="name-number-col">
                          <div className="name-number-info full-width">
                            <div className="input-append field-input">
                              <label className="sklble">
                                Add Team Name
                                <a onClick={handleReset1}>Reset</a>
                              </label>
                              <input
                                className="span2"
                                value={inputText}
                                id="text-string"
                                type="text"
                                style={{ color: "#fff" }}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Add Team Name Here..."
                              />

                              <button
                                id="add-text-string"
                                className="btn btn-submit fieldin"
                                title="Add text"
                                onClick={handlegettingText}
                              >
                                Apply <i className="icon-share-alt"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="input-append field-input merge-input-lbel">
                      <label className="sklble">
                        <img src={arc} />
                      </label>
                      <select
                        onChange={handleOptionChange1}
                        value={shapeValue1}
                        id="shape"
                      >
                        {shapeArray.map((item, id) => (
                          <option key={id} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="input-append field-input merge-input-lbel">
                      <label className="sklble">A</label>
                      <select
                        onChange={handleFontChange1}
                        value={fontValue1}
                        id="font"
                      >
                        {fontArray1.map((fontKey, id) => {
                          const fontName = fontMapping1[fontKey]
                            ? fontMapping1[fontKey]
                                .split("/")
                                .pop()
                                .split(".")[0]
                            : fontKey;
                          return (
                            <option
                              key={id}
                              value={fontKey}
                              style={{ fontFamily: fontKey }}
                            >
                              {fontName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div style={{ display: "block" }}>
                      <input
                        type="button"
                        className="toggle-colors-btn"
                        onClick={toggleAllColors1}
                        style={{
                          height: "30px",
                          width: "30px",
                          backgroundColor: selectedColor1,
                        }}
                      />{" "}
                      Team Name Color
                    </div>

                    {showAllColors1 && (
                      <>
                        <div className="colors-btn-merge">
                          <button
                            onClick={closeAllColors}
                            style={{ float: "right" }}
                          >
                            X
                          </button>
                          <div className="all-colors">
                            <div
                              style={{ display: "flex" }}
                              className="recent-inputs"
                            >
                              {recentColors.map((color, index) => (
                                <input
                                  key={index}
                                  type="button"
                                  style={{ backgroundColor: color }}
                                  onClick={() => handleColorSelection1(color)}
                                />
                              ))}
                            </div>
                            <div
                              className="color-row"
                              style={{ display: "block" }}
                            >
                              {allColors.map((color, index) => (
                                <input
                                  type="button"
                                  key={index}
                                  style={{
                                    backgroundColor: color,
                                    height: "15px",
                                    width: "15px",
                                  }}
                                  onClick={() => handleColorSelection1(color)}
                                ></input>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="labelMerge">
                      <label htmlFor="bold"> Bold</label>
                      <input
                        id="bold"
                        type="checkbox"
                        checked={boldchecked1}
                        onChange={handleBoldCheck1}
                      />
                    </div>
                    <div className="labelMerge">
                      <label htmlFor="italic"> Italic</label>
                      <input
                        id="italic"
                        type="checkbox"
                        checked={italicCheck1}
                        onChange={handleItalicCheck1}
                      />
                    </div>
                    <div className="labelMerge">
                      <label htmlFor="outline"> Outline</label>
                      <input
                        id="outline"
                        type="checkbox"
                        checked={outlineCheck1}
                        onChange={handleOutlineCheck1}
                      />
                    </div>
                    <div style={{ display: "block" }}>
                      <input
                        type="button"
                        className="toggle-colors-btn"
                        onClick={toggleOutlineColors1}
                        style={{
                          height: "30px",
                          width: "30px",
                          backgroundColor: selectedOutlineColor1,
                        }}
                      />{" "}
                      Outline Color
                    </div>
                    {showOutlineColors1 && (
                      <>
                        <div className="colors-btn-merge">
                          <button
                            onClick={closeAllColors}
                            style={{ float: "right" }}
                          >
                            X
                          </button>
                          <div className="all-colors">
                            <div
                              style={{ display: "flex" }}
                              className="recent-inputs"
                            >
                              {recentColors.map((color, index) => (
                                <input
                                  key={index}
                                  type="button"
                                  style={{ backgroundColor: color }}
                                  onClick={() =>
                                    handleOutlineColorSelection1(color)
                                  }
                                />
                              ))}
                            </div>
                            <div className="color-row">
                              {allColors.map((color, index) => (
                                <input
                                  type="button"
                                  key={index}
                                  style={{
                                    backgroundColor: color,
                                    height: "15px",
                                    width: "15px",
                                  }}
                                  onClick={() =>
                                    handleOutlineColorSelection1(color)
                                  }
                                ></input>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              {/* <AddText onCanvasTemp={onCanvasTemp} txtPosition={txtPosition} /> */}

              <div className="text-style">
                <div className="answer">
                  <div className="customize-prod-list scrollbar">
                    <div className="wraper">
                      <div className="name-number-row">
                        <div className="name-number-col">
                          <div className="name-number-info full-width">
                            <div className="input-append field-input">
                              <label className="sklble">
                                Add Player Name
                                <a onClick={handleReset}>Reset</a>
                              </label>

                              <input
                                className="span2"
                                value={playerText}
                                id="player-string"
                                type="text"
                                style={{ color: "#fff" }}
                                onChange={(e) => setPlayerText(e.target.value)}
                                placeholder="Add Player Name Here..."
                              />
                              {/* {playerErrors && (
                                <span
                                  className="error"
                                  style={{
                                    float: "left",
                                    fontSize: "14px",
                                    padding: "10px 0px 10px 0px",
                                  }}
                                >
                                  {playerErrors}
                                </span>
                              )} */}
                              <button
                                id="add-text-string"
                                className="btn btn-submit fieldin"
                                title="Add text"
                                onClick={handlePlayerData}
                              >
                                Apply <i className="icon-share-alt"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="input-append field-input merge-input-lbel">
                      <label className="sklble">
                        <img src={arc} />
                      </label>
                      <select
                        onChange={handleOptionChange}
                        value={shapeValue}
                        id="shape1"
                      >
                        {shapeArray.map((item, id) => (
                          <option key={id} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="input-append field-input merge-input-lbel">
                      <label className="sklble">A</label>
                      <select
                        onChange={handleFontChange}
                        value={fontValue}
                        id="font1"
                      >
                        {fontArray.map((fontKey, id) => {
                          const fontName = fontMapping[fontKey]
                            ? fontMapping[fontKey]
                                .split("/")
                                .pop()
                                .split(".")[0]
                            : fontKey;
                          return (
                            <option
                              key={id}
                              value={fontKey}
                              style={{ fontFamily: fontKey }}
                            >
                              {fontName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div style={{ display: "block" }}>
                      <input
                        type="button"
                        className="toggle-colors-btn name"
                        onClick={toggleAllColors}
                        style={{
                          height: "30px",
                          width: "30px",
                          backgroundColor: selectedColor,
                        }}
                      />{" "}
                      Player Name Color
                    </div>

                    {showAllColors && (
                      <>
                        <div className="colors-btn-merge">
                          <button
                            onClick={closeAllColors}
                            style={{ float: "right" }}
                          >
                            X
                          </button>

                          <div className="all-colors">
                            <div
                              style={{ display: "flex" }}
                              className="recent-inputs"
                            >
                              {recentColors.map((color, index) => (
                                <input
                                  key={index}
                                  type="button"
                                  style={{ backgroundColor: color }}
                                  onClick={() => handleColorSelection(color)}
                                />
                              ))}
                            </div>
                            <div
                              className="color-row"
                              style={{ display: "block" }}
                            >
                              {allColors.map((color, index) => (
                                <input
                                  type="button"
                                  key={index}
                                  style={{
                                    backgroundColor: color,
                                    height: "15px",
                                    width: "15px",
                                  }}
                                  onClick={() => handleColorSelection(color)}
                                ></input>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="labelMerge">
                      <label htmlFor="bold"> Bold</label>
                      <input
                        id="bold"
                        type="checkbox"
                        checked={boldchecked}
                        onChange={handleBoldCheck}
                      />
                    </div>
                    <div className="labelMerge">
                      <label htmlFor="italic"> Italic</label>
                      <input
                        id="italic"
                        type="checkbox"
                        checked={italicCheck}
                        onChange={handleItalicCheck}
                      />
                    </div>
                    <div className="labelMerge">
                      <label htmlFor="outline"> Outline</label>
                      <input
                        id="outline"
                        type="checkbox"
                        checked={outlineCheck}
                        onChange={handleOutlineCheck}
                      />
                    </div>
                    <div style={{ display: "block" }}>
                      <input
                        type="button"
                        className="toggle-colors-btn outline"
                        onClick={toggleOutlineColors}
                        style={{
                          height: "30px",
                          width: "30px",
                          backgroundColor: selectedOutlineColor,
                        }}
                      />
                      Outline Color
                    </div>

                    {showOutlineColors && (
                      <>
                        <div className="colors-btn-merge">
                          <button
                            onClick={closeAllColors}
                            style={{ float: "right" }}
                          >
                            X
                          </button>
                          <div className="all-colors">
                            <div
                              style={{ display: "flex" }}
                              className="recent-inputs"
                            >
                              {recentColors.map((color, index) => (
                                <input
                                  key={index}
                                  type="button"
                                  style={{ backgroundColor: color }}
                                  onClick={() =>
                                    handleOutlineColorSelection(color)
                                  }
                                />
                              ))}
                            </div>
                            <div className="color-row">
                              {allColors.map((color, index) => (
                                <input
                                  type="button"
                                  key={index}
                                  style={{
                                    backgroundColor: color,
                                    height: "15px",
                                    width: "15px",
                                  }}
                                  onClick={() =>
                                    handleOutlineColorSelection(color)
                                  }
                                ></input>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              {/* <AddPlayerNum
                getNumValue={getNumValue}
                numPosition={numPosition}
                backNumPosition={backNumPosition}
              /> */}
              <div className="text-style">
                <div className="answer">
                  <div className="customize-prod-list scrollbar">
                    <div className="wraper">
                      <div className="name-number-row">
                        <div className="name-number-col">
                          <div className="name-number-info full-width">
                            <div className="input-append field-input">
                              <label className="sklble">
                                Add Jersey Number (Only digits)
                                <a onClick={handleReset2}>Reset</a>
                              </label>
                              <input
                                className="span2"
                                value={numValue}
                                id="text-num"
                                type="number"
                                style={{ color: "#fff" }}
                                onChange={(e) => setNumValue(e.target.value)}
                                placeholder="Add Jersey Number Here..."
                              />
                              {/* {numerrors && (
                                <span
                                  className="error"
                                  style={{
                                    float: "left",
                                    fontSize: "14px",
                                    padding: "10px 0px 10px 0px",
                                  }}
                                >
                                  {numerrors}
                                </span>
                              )} */}
                              <button
                                id="add-text-string"
                                className="btn btn-submit fieldin"
                                title="Add text"
                                onClick={handlegettingNum}
                              >
                                Apply <i className="icon-share-alt"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="input-append field-input merge-input-lbel">
                      <label className="sklble">A</label>
                      <select
                        onChange={handleFontChange2}
                        value={fontValue2}
                        id="font2"
                      >
                        {fontArray2.map((fontKey, id) => {
                          const fontName = fontMapping2[fontKey]
                            ? fontMapping2[fontKey]
                                .split("/")
                                .pop()
                                .split(".")[0]
                            : fontKey;
                          return (
                            <option
                              key={id}
                              value={fontKey}
                              style={{ fontFamily: fontKey }}
                            >
                              {fontName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div style={{ display: "block" }}>
                      <input
                        type="button"
                        className="toggle-colors-btn"
                        onClick={toggleAllColors2}
                        style={{
                          height: "30px",
                          width: "30px",
                          backgroundColor: selectedColor2,
                        }}
                      />{" "}
                      Jersey Number Color
                    </div>

                    {showAllColors2 && (
                      <>
                        <div className="colors-btn-merge">
                          <button
                            onClick={closeAllColors}
                            style={{ float: "right" }}
                          >
                            X
                          </button>
                          <div className="all-colors">
                            <div
                              style={{ display: "flex" }}
                              className="recent-inputs"
                            >
                              {recentColors.map((color, index) => (
                                <input
                                  key={index}
                                  type="button"
                                  style={{ backgroundColor: color }}
                                  onClick={() => handleColorSelection2(color)}
                                />
                              ))}
                            </div>
                            <div
                              className="color-row"
                              style={{ display: "block" }}
                            >
                              {allColors.map((color, index) => (
                                <input
                                  type="button"
                                  key={index}
                                  style={{
                                    backgroundColor: color,
                                    height: "15px",
                                    width: "15px",
                                  }}
                                  onClick={() => handleColorSelection2(color)}
                                ></input>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="labelMerge">
                      <label htmlFor="bold"> Bold</label>
                      <input
                        id="bold"
                        type="checkbox"
                        checked={boldchecked2}
                        onChange={handleBoldCheck2}
                      />
                    </div>
                    <div className="labelMerge">
                      <label htmlFor="italic"> Italic</label>
                      <input
                        id="italic"
                        type="checkbox"
                        checked={italicCheck2}
                        onChange={handleItalicCheck2}
                      />
                    </div>
                    <div className="labelMerge">
                      <label htmlFor="outline"> Outline</label>
                      <input
                        id="outline"
                        type="checkbox"
                        checked={outlineCheck2}
                        onChange={handleOutlineCheck2}
                      />
                    </div>
                    <div style={{ display: "block" }}>
                      <input
                        type="button"
                        className="toggle-colors-btn"
                        onClick={toggleOutlineColors2}
                        style={{
                          height: "30px",
                          width: "30px",
                          backgroundColor: selectedOutlineColor2,
                        }}
                      />
                      Outline Color
                    </div>

                    {showOutlineColors2 && (
                      <>
                        <div className="colors-btn-merge">
                          <button
                            onClick={closeAllColors}
                            style={{ float: "right" }}
                          >
                            X
                          </button>
                          <div className="all-colors">
                            <div
                              style={{ display: "flex" }}
                              className="recent-inputs"
                            >
                              {recentColors.map((color, index) => (
                                <input
                                  key={index}
                                  type="button"
                                  style={{ backgroundColor: color }}
                                  onClick={() =>
                                    handleOutlineColorSelection2(color)
                                  }
                                />
                              ))}
                            </div>
                            <div className="color-row">
                              {allColors.map((color, index) => (
                                <input
                                  type="button"
                                  key={index}
                                  style={{
                                    backgroundColor: color,
                                    height: "15px",
                                    width: "15px",
                                  }}
                                  onClick={() =>
                                    handleOutlineColorSelection2(color)
                                  }
                                ></input>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </li>
    </>
  );
};

export default AddTeam;
