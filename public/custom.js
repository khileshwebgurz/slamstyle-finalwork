window.initWrap = function (testSVG, container, type) {
  var $svg = jQuery(testSVG);

  // Get the width attribute value
  var widthValue = $svg.attr("width");
  var heightValue = $svg.attr("height");

  let zoom = 1;
  const draggableControlPonts = [];

  const app = document.getElementById("app");
  const svgContainer = document.getElementById("svg-container-" + container);
  const svgElement = document.getElementById("svg-element-" + container);
  const svgControl = document.getElementById("svg-control-" + container);

  const actions = {
    meshComplexity: document.getElementById("mesh-complexity"),
    meshInterpolation: document.getElementById("interpolation-complexity"),
    showOriginalBox: document.getElementById("show-original-box-btn"),
  };

  const iterpritateSmoothness = (val) => {
    const newVal = Number(val);

    return 874;
  };

  let interpolationLevel = iterpritateSmoothness(
    actions.meshInterpolation.value
  );

  function parseSVGString(testSVG) {
    const parser = new DOMParser();
    const svgDOM = parser
      .parseFromString(testSVG, "image/svg+xml")
      .getElementsByTagName("svg")[0];
    svgElement.innerHTML = svgDOM.innerHTML.toString();
  }

  const controlPath = document.getElementById("control-path-" + container);
  parseSVGString(testSVG);

  // Need to interpolate first, so angles remain sharp
  const warp = new Warp(svgElement);
  warp.interpolate(interpolationLevel);

  //generating mesh points
  const generateMeshPoints = (width, height, amount) => {
    const checkAndRoundNumber = (length, index) => (length / amount) * index;

    const myArray = [...Array(amount).keys()];

    const myleft = myArray.map((item, i) => [
      0,
      checkAndRoundNumber(height, i),
    ]);

    const myBottom = myArray.map((item, i) => [
      checkAndRoundNumber(width, i),
      height,
    ]);

    const myRight = myArray
      .map((item, i) => [width, checkAndRoundNumber(height, ++i)])
      .reverse();

    const myTop = [...Array(amount).keys()]
      .map((item, i) => [checkAndRoundNumber(width, ++i), 0])
      .reverse();

    return [...myleft, ...myBottom, ...myRight, ...myTop];
  };

  let controlPoints = generateMeshPoints(
    widthValue,
    parseFloat(heightValue) + 3,
    Number(8)
  );

  warp.transform(function (v0, V = controlPoints) {
    const A = [];
    const W = [];
    const L = [];

    // Find angles
    for (let i = 0; i < V.length; i++) {
      const j = (i + 1) % V.length;

      const vi = V[i];
      const vj = V[j];

      const r0i = Math.sqrt((v0[0] - vi[0]) ** 2 + (v0[1] - vi[1]) ** 2);
      const r0j = Math.sqrt((v0[0] - vj[0]) ** 2 + (v0[1] - vj[1]) ** 2);
      const rij = Math.sqrt((vi[0] - vj[0]) ** 2 + (vi[1] - vj[1]) ** 2);

      const dn = 2 * r0i * r0j;
      const r = (r0i ** 2 + r0j ** 2 - rij ** 2) / dn;

      A[i] = isNaN(r) ? 0 : Math.acos(Math.max(-1, Math.min(r, 1)));
    }

    // Find weights
    for (let j = 0; j < V.length; j++) {
      const i = (j > 0 ? j : V.length) - 1;

      // const vi = V[i];
      const vj = V[j];

      const r = Math.sqrt((vj[0] - v0[0]) ** 2 + (vj[1] - v0[1]) ** 2);

      W[j] = (Math.tan(A[i] / 2) + Math.tan(A[j] / 2)) / r;
    }

    // Normalise weights
    const Ws = W.reduce((a, b) => a + b, 0);
    for (let i = 0; i < V.length; i++) {
      L[i] = W[i] / Ws;
    }

    // Save weights to the point for use when transforming
    return [...v0, ...L];
  });

  //
  // Warp function
  function reposition([x, y, ...W], V = controlPoints) {
    let nx = 0;
    let ny = 0;

    // Recreate the points using mean value coordinates
    for (let i = 0; i < V.length; i++) {
      nx += W[i] * V[i][0];
      ny += W[i] * V[i][1];
    }

    return [nx, ny, ...W];
  }

  function drawControlShape(element = controlPath, V = controlPoints) {
    const path = [`M${V[0][0]} ${V[0][1]}`];

    for (let i = 1; i < V.length; i++) {
      path.push(`L${V[i][0]} ${V[i][1]}`);
    }

    path.push("Z");
    element.setAttribute("d", path.join(""));
  }

  function drawCircle(element, pos = { x: 0, y: 0 }, index) {
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttributeNS(null, "class", "control-point");
    circle.setAttributeNS(null, "cx", pos.x);
    circle.setAttributeNS(null, "cy", pos.y);
    circle.setAttributeNS(null, "r", 1);
    element.appendChild(circle);

    draggableControlPonts.push(circle);

    Draggable.create(circle, {
      type: "x,y",

      onDrag: function () {
        const relativeX =
          this.pointerX - svgControl.getBoundingClientRect().left;
        const relativeY =
          this.pointerY - svgControl.getBoundingClientRect().top;

        controlPoints[index] = [relativeX, relativeY];
        drawControlShape();
        warp.transform(reposition);
      },
    });
  }

  function drawControlPoints(element = svgControl, V = controlPoints) {
    controlPoints.map((i, index) => {
      drawCircle(element, { x: i[0], y: i[1] }, index);
      return null;
    });
  }

  if (type == "Vertical-Arc") {
    // Done
    controlPoints = [
      ["0", "9"],
      ["0", "10"],
      ["0", "11"],
      ["0", "12"],
      ["0", "13"],
      ["0", "14"],
      ["0", "15"],
      ["0", "16"],
      ["0", "17"],
      ["20", "17"],
      ["39.8238", "10.5542"],
      ["60", "6.7607"],
      ["80.1695", "6"],
      ["100.0447", "6.7607"],
      ["119.011", "9.2255"],
      ["140", "17"],
      ["160", "17"],
      ["160", "16"],
      ["160", "15"],
      ["160", "14"],
      ["160", "13"],
      ["160", "12"],
      ["160", "11"],
      ["160", "10"],
      ["160", "9"],
      ["140", "10"],
      ["120.6054", "3.7781"],
      ["100", ".8798"],
      ["80", "0"],
      ["60", ".8798"],
      ["39.8238", "3.7781"],
      ["20", "10"],
    ];
  } else if (type == "Breathing-In") {
    // Done
    controlPoints = [
      ["0", "0"],
      ["0", "2.125"],
      ["0", "4.25"],
      ["0", "6.375"],
      ["0", "8.5"],
      ["0", "10.625"],
      ["0", "12.75"],
      ["0", "14.875"],
      ["0", "17"],
      ["20", "16"],
      ["39.9016", "14.8208"],
      ["60", "12.9607"],
      ["80.1695", "12.2"],
      ["100.0447", "12.9607"],
      ["120.1078", "14.5"],
      ["140", "16"],
      ["160", "17"],
      ["160", "14.875"],
      ["160", "12.75"],
      ["160", "10.625"],
      ["160", "8.5"],
      ["160", "6.375"],
      ["160", "4.25"],
      ["160", "2.125"],
      ["160", "0"],
      ["140", "1"],
      ["120", "2.5"],
      ["100", "4.0393"],
      ["80", "4.8"],
      ["60", "4.0393"],
      ["39.94", "2.1792"],
      ["20", "1"],
    ];
  } else if (type == "Bottom-Vertical") {
    // Done
    controlPoints = [
      ["0", "0"],
      ["0", "2.125"],
      ["0", "4.25"],
      ["0", "6.375"],
      ["0", "8.5"],
      ["0", "10.625"],
      ["0", "12.75"],
      ["0", "14.875"],
      ["0", "17"],
      ["20", "16"],
      ["39.9016", "14.8208"],
      ["60", "12.9607"],
      ["80.1695", "12.2"],
      ["100.0447", "12.9607"],
      ["120.1078", "14.5"],
      ["140", "16"],
      ["160", "17"],
      ["160", "14.875"],
      ["160", "12.75"],
      ["160", "10.625"],
      ["160", "8.5"],
      ["160", "6.375"],
      ["160", "4.25"],
      ["160", "2.125"],
      ["160", "0"],
      ["140", "0"],
      ["120", "0"],
      ["100", "0"],
      ["80", "0"],
      ["60", "0"],
      ["39.94", "0"],
      ["20", "0"],
    ];
  } else if (type == "Center-Bulge") {
    // Done
    controlPoints = [
      ["0", "9"],
      ["0", "10"],
      ["0", "11"],
      ["0", "12"],
      ["0", "13"],
      ["0", "14"],
      ["0", "15"],
      ["0", "16"],
      ["0", "17"],
      ["20", "17"],
      ["39.9016", "17"],
      ["60", "17"],
      ["80.1695", "17"],
      ["100.0447", "17"],
      ["120.1078", "17"],
      ["140", "17"],
      ["160", "17"],
      ["160", "16"],
      ["160", "15"],
      ["160", "14"],
      ["160", "13"],
      ["160", "12"],
      ["160", "11"],
      ["160", "10"],
      ["160", "9"],
      ["140", "5.2"],
      ["120", "2.6"],
      ["100", ".8798"],
      ["80", "0"],
      ["60", ".8798"],
      ["39.94", "2.6"],
      ["20", "5.2"],
    ];
  } else if (type == "Full-Rev-Arc") {
    controlPoints = [
      ["0", "0"],
      ["0", "1"],
      ["0", "2"],
      ["0", "3"],
      ["0", "4"],
      ["0", "5"],
      ["0", "6"],
      ["0", "7"],
      ["0", "8"],
      ["20", "7"],
      ["39.8238", "13.2219"],
      ["60", "16.1202"],
      ["80.1695", "17"],
      ["100.3141", "15.8304"],
      ["119.5887", "10.1145"],
      ["140", "7"],
      ["160", "8"],
      ["160", "7"],
      ["160", "6"],
      ["160", "5"],
      ["160", "4"],
      ["160", "3"],
      ["160", "2"],
      ["160", "1"],
      ["160", "0"],
      ["140", "0"],
      ["119.5887", "4.1327"],
      ["101.2446", "9.4498"],
      ["80", "11"],
      ["60", "10.2393"],
      ["39.8238", "6.4458"],
      ["20", "0"],
    ];
  } else if (type == "Half-Asleep-Arc") {
    // Done
    controlPoints = [
      ["0", "0"],
      ["0", "2.125"],
      ["0", "4.25"],
      ["0", "6.375"],
      ["0", "8.5"],
      ["0", "10.625"],
      ["0", "12.75"],
      ["0", "14.875"],
      ["0", "17"],
      ["20", "15"],
      ["39.9016", "14"],
      ["60", "13"],
      ["80.1695", "12"],
      ["100.0447", "11"],
      ["120.1078", "10"],
      ["140", "9"],
      ["160", "8"],
      ["160", "7"],
      ["160", "6"],
      ["160", "5"],
      ["160", "4"],
      ["160", "3"],
      ["160", "2"],
      ["160", "1"],
      ["160", "0"],
      ["140", "0"],
      ["120", "0"],
      ["100", "0"],
      ["80", "0"],
      ["60", "0"],
      ["39.94", "0"],
      ["20", "0"],
    ];
  } else if (type == "Inverse-Vertical") {
    // Done
    controlPoints = [
      ["0", "0"],
      ["0", "2.125"],
      ["0", "4.25"],
      ["0", "6.375"],
      ["0", "8.5"],
      ["0", "10.625"],
      ["0", "12.75"],
      ["0", "14.875"],
      ["0", "17"],
      ["20", "17"],
      ["39.9016", "17"],
      ["60", "17"],
      ["80.1695", "17"],
      ["100.0447", "17"],
      ["120.1078", "17"],
      ["140", "17"],
      ["160", "17"],
      ["160", "14.875"],
      ["160", "12.75"],
      ["160", "10.625"],
      ["160", "8.5"],
      ["160", "6.375"],
      ["160", "4.25"],
      ["160", "2.125"],
      ["160", "0"],
      ["140", "1"],
      ["120", "2.5"],
      ["100", "4.0393"],
      ["80", "4.8"],
      ["60", "4.0393"],
      ["39.94", "2.1792"],
      ["20", "1"],
    ];
  } else if (type == "San-Diego") {
    controlPoints = [
      ["2.4105", "0"],
      ["2.0095", "1.7291"],
      ["1.9294", "3.7319"],
      ["1.6089", "6.0553"],
      ["1.3686", "8.3786"],
      ["1.2083", "11.0224"],
      ["1.1282", "13.5861"],
      ["0.8879", "16.3901"],
      ["1.0017", "19.1235"],
      ["16.103", "12.3806"],
      ["36.8217", "10.1291"],
      ["55.8939", "8.816"],
      ["73.0904", "7.8154"],
      ["93.2884", "7.0651"],
      ["110.4846", "6.1271"],
      ["132.7459", "5.0015"],
      ["158.9899", "3.9914"],
      ["159.1157", "3.474"],
      ["159.3255", "2.9007"],
      ["159.4793", "2.2994"],
      ["159.6051", "1.782"],
      ["159.717", "1.3066"],
      ["159.8149", "0.8312"],
      ["159.9268", "0.3278"],
      ["160", "0"],
      ["132", "0"],
      ["110", "0"],
      ["93", "0"],
      ["73", "0"],
      ["55", "0"],
      ["38", "0"],
      ["17", "0"],
    ];
  } else {
    // Done     Straight, gravity, trajectory
    controlPoints = [
      ["0", "0"],
      ["0", "2.125"],
      ["0", "4.25"],
      ["0", "6.375"],
      ["0", "8.5"],
      ["0", "10.625"],
      ["0", "12.75"],
      ["0", "14.875"],
      ["0", "17"],
      ["20", "17"],
      ["39.9016", "17"],
      ["59.9838", "17"],
      ["80.1695", "17"],
      ["100.0447", "17"],
      ["120.1078", "17"],
      ["140", "17"],
      ["160", "17"],
      ["160", "14.875"],
      ["160", "12.75"],
      ["160", "10.625"],
      ["160", "8.5"],
      ["160", "6.375"],
      ["160", "4.25"],
      ["160", "2.125"],
      ["160", "0"],
      ["140", "0"],
      ["120", "0"],
      ["100", "0"],
      ["80.1695", "0"],
      ["59.8696", "0"],
      ["39.94", "0"],
      ["20", "0"],
    ];
  }

  drawControlShape();
  drawControlPoints();
  warp.transform(reposition);

  const createNewControlPath = () => {
    svgControl.innerHTML = "";
    const newControlPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    newControlPath.setAttributeNS(null, "id", "control-path-" + container);
    svgControl.appendChild(newControlPath);
  };

  let complexityLevel = actions.meshComplexity.value;
  actions.meshComplexity.addEventListener(
    "change",
    (e) => {
      complexityLevel = e.target.value;
      createNewControlPath();
      initWrap();
    },
    false
  );

  actions.showOriginalBox.addEventListener(
    "change",
    () => {
      svgControl.classList.toggle("show");
      app.classList.toggle("checkerboard-pattern");
    },
    false
  );

  // /////
  actions.meshInterpolation.addEventListener(
    "change",
    (e) => {
      interpolationLevel = iterpritateSmoothness(e.target.value);
      createNewControlPath();
      initWrap();
    },
    false
  );
};

window.svgpathfunc = async function (
  id,
  text,
  stroke,
  strokeColor,
  fillColor,
  font,
  boldStyle,
  tn_style,
  tn_italic
) {
  font = font ? font : "Bauer.ttf";

  var instance = new SVGTextAnimate(
    "/assets/font-assets/Fonts/" + font,
    {
      duration: 1,
      direction: "normal",
      "font-size": 15,
    },
    {
      stroke: stroke ? strokeColor : boldStyle ? fillColor : "#000000",
      "stroke-width": stroke || boldStyle ? "0.5" : "0",
      "font-size": 15,
      bold: true,
      "fill-color": fillColor ? fillColor : "#000000",
    }
  );
  await instance.setFont();

  if (tn_style != "san-diego") {
    instance.create("I I I " + text + " I I I", "#svgpath-" + id);
  } else {
    instance.create(text, "#svgpath-" + id);
  }

  setTimeout(function () {
    if (tn_style != "san-diego") {
      $("#svgpath-front path:lt(6)").remove();
      $("#svgpath-front path").slice(-6).remove();
    }

    $("#svg-element-front style").remove();
    $("#svgpath-front path").attr("style", "");
    if (tn_italic) {
      $("#svgpath-front path").attr("style", "transform: skewX(-15deg);");
    }

    var svgpathfront = $("#svgpath-front")
      .html()
      .replace("\n", "")
      .replace("\n", "")
      .replace("\n", "")
      .replace("fill-opacity:0", "");

    initWrap(svgpathfront, "front", tn_style);

    svgString1 =
      '<svg id="svgTeamName" width="160" height="22" viewBox="0 0 160 22" xmlns="http://www.w3.org/2000/svg">' +
      $("#svg-element-front").html() +
      "</svg>";

    window.svgString1 = svgString1;

    $(".teamNameTemp").html(svgString1);

    var svgFront = document.getElementById("svgTeamName");
    var bboxFront = svgFront.getBBox();
    var viewBoxFront = [
      bboxFront.x,
      bboxFront.y,
      bboxFront.width,
      bboxFront.height,
    ].join(" ");
    svgFront.setAttribute("viewBox", viewBoxFront);

    var canvasTemp = "data:image/svg+xml;base64," + btoa(svgFront.outerHTML);
    window.canvasTemp = canvasTemp;

    window.dispatchEvent(new Event("canvasTemp"));
  }, 100);
};

window.svgpathfunc2 = async function (
  id,
  text,
  stroke,
  strokeColor,
  fillColor,
  font,
  boldStyle,
  tn_style,
  tn_italic
) {
  font = font ? font : "Bauer.ttf";

  var instance = new SVGTextAnimate(
    "/assets/font-assets/Fonts/" + font,
    {
      duration: 1,
      direction: "normal",
      "font-size": 15,
    },
    {
      stroke: stroke ? strokeColor : boldStyle ? fillColor : "#000000",
      "stroke-width": stroke || boldStyle ? "0.5" : "0",
      "font-size": 15,
      bold: true,
      "fill-color": fillColor ? fillColor : "#000000",
    }
  );
  await instance.setFont();

  if (tn_style != "san-diego") {
    instance.create("I I I " + text + " I I I", "#svgpath-" + id);
  } else {
    instance.create(text, "#svgpath-" + id);
  }

  setTimeout(function () {
    if (tn_style != "san-diego") {
      $("#svgpath-front path:lt(6)").remove();
      $("#svgpath-front path").slice(-6).remove();
    }

    $("#svg-element-front style").remove();
    $("#svgpath-front path").attr("style", "");
    if (tn_italic) {
      $("#svgpath-front path").attr("style", "transform: skewX(-15deg);");
    }

    var svgpathfront = $("#svgpath-front")
      .html()
      .replace("\n", "")
      .replace("\n", "")
      .replace("\n", "")
      .replace("fill-opacity:0", "");

    initWrap(svgpathfront, "front", tn_style);

    svgString1 =
      '<svg id="svgTeamName" width="85" height="22" viewBox="0 0 85 22" xmlns="http://www.w3.org/2000/svg">' +
      $("#svg-element-front").html() +
      "</svg>";

    window.svgString1 = svgString1;

    $(".teamNameTemp").html(svgString1);

    var svgFront = document.getElementById("svgTeamName");
    var bboxFront = svgFront.getBBox();
    var viewBoxFront = [
      bboxFront.x,
      bboxFront.y,
      bboxFront.width,
      bboxFront.height,
    ].join(" ");
    svgFront.setAttribute("viewBox", viewBoxFront);

    var canvasTemp2 = "data:image/svg+xml;base64," + btoa(svgFront.outerHTML);
    window.canvasTemp2 = canvasTemp2;

    window.dispatchEvent(new Event("canvasTemp2"));
  }, 100);
};

window.svgpathfunc1 = async function (
  id,
  text,
  stroke,
  strokeColor,
  fillColor,
  font,
  boldStyle,
  tn_style,
  tn_italic
) {
  font = font ? font : "Bauer.ttf";

  var instance = new SVGTextAnimate(
    "/assets/font-assets/Fonts/" + font,
    {
      duration: 1,
      direction: "normal",
      "font-size": 15,
    },
    {
      stroke: stroke ? strokeColor : boldStyle ? fillColor : "#000000",
      "stroke-width": stroke || boldStyle ? "0.5" : "0",
      "font-size": 15,
      bold: true,
      "fill-color": fillColor ? fillColor : "#000000",
    }
  );
  await instance.setFont();

  if (tn_style != "san-diego") {
    instance.create("I I I " + text + " I I I", "#svgpath-" + id);
  } else {
    instance.create(text, "#svgpath-" + id);
  }

  setTimeout(function () {
    if (tn_style != "san-diego") {
      $("#svgpath-back path:lt(6)").remove();
      $("#svgpath-back path").slice(-6).remove();
    }

    $("#svg-element-back style").remove();
    $("#svgpath-back path").attr("style", "");
    if (tn_italic) {
      $("#svgpath-back path").attr("style", "transform: skewX(-15deg);");
    }

    var svgpathback = $("#svgpath-back")
      .html()
      .replace("\n", "")
      .replace("\n", "")
      .replace("\n", "")
      .replace("fill-opacity:0", "");

    initWrap(svgpathback, "back", tn_style);

    svgString1 =
      '<svg id="svgTeamNameBack" width="160" height="22" viewBox="0 0 160 22" xmlns="http://www.w3.org/2000/svg">' +
      $("#svg-element-back").html() +
      "</svg>";

    window.svgString1 = svgString1;

    $(".teamNameTemp").html(svgString1);

    var svgBack = document.getElementById("svgTeamNameBack");
    var bboxBack = svgBack.getBBox();
    var viewBoxBack = [
      bboxBack.x,
      bboxBack.y,
      bboxBack.width,
      bboxBack.height,
    ].join(" ");
    svgBack.setAttribute("viewBox", viewBoxBack);

    // if (viewBoxBack === "0 0 0 0") {
    var canvasTemp1 = "data:image/svg+xml;base64," + btoa(svgBack.outerHTML);
    window.canvasTemp1 = canvasTemp1;
    window.dispatchEvent(new Event("canvasTemp1"));
    // }
  }, 100);
};
