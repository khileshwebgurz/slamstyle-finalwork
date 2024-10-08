import React, { useState } from "react";

export default function AddImages({
  gettingImages,
  isOpen,
  onAccordionToggle,
}) {
  // for showing or hiding the tab of neck options

  const [imageName, setImageName] = useState("");

  const handleTab = () => {
    onAccordionToggle();
  };

  // function for uploading and previewing images

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name);
      gettingImages(URL.createObjectURL(file));
    }

    const isMobileView = window.innerWidth <= 960; // Change the breakpoint value as needed

    // Call onAccordionToggle only if it's in mobile view
    if (isMobileView) {
      onAccordionToggle();
    }
  };

  const handleReset = () => {
    gettingImages("");
    setImageName("");
    document.getElementById("browse-image").value = null;

    const isMobileView = window.innerWidth <= 960; // Change the breakpoint value as needed

    // Call onAccordionToggle only if it's in mobile view
    if (isMobileView) {
      onAccordionToggle();
    }
  };

  return (
    <>
      <li className={`add-images ${isOpen ? "active" : ""}`}>
        <h3 onClick={handleTab} className="forDesktop">
          Add Images
        </h3>
        <h3 onClick={() => handleTab("add-images-layer")} className="forMob">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.0"
            width="200.000000pt"
            height="200.000000pt"
            viewBox="0 0 200.000000 200.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <metadata>
              Created by potrace 1.10, written by Peter Selinger 2001-2011
            </metadata>
            <g
              transform="translate(0.000000,200.000000) scale(0.100000,-0.100000)"
              fill="#ffffff"
              stroke="none"
            >
              <path d="M0 1710 c0 -20 7 -20 1000 -20 993 0 1000 0 1000 20 0 20 -7 20 -1000 20 -993 0 -1000 0 -1000 -20z" />
              <path d="M142 1587 l-22 -23 0 -561 c0 -552 0 -561 21 -587 l20 -26 839 0 839 0 20 26 c21 26 21 35 21 584 0 549 0 558 -21 584 l-20 26 -838 0 -838 0 -21 -23z m1698 -587 l0 -570 -840 0 -840 0 0 570 0 570 840 0 840 0 0 -570z" />
              <path d="M667 1379 c-59 -129 -379 -814 -384 -821 -2 -5 320 -8 716 -8 l721 0 -177 238 c-97 130 -178 239 -179 240 -2 2 -53 -38 -114 -89 -86 -71 -114 -89 -120 -78 -5 8 -92 128 -194 267 -102 139 -197 269 -210 289 l-25 36 -34 -74z m235 -271 c102 -139 195 -261 206 -272 31 -27 58 -16 150 59 44 36 86 65 93 65 15 -1 259 -322 267 -352 4 -17 -19 -18 -629 -16 -616 3 -634 4 -631 22 2 10 22 58 44 105 88 186 262 558 280 599 10 23 23 42 27 42 4 0 91 -114 193 -252z" />
              <path d="M1472 1410 c-94 -57 -94 -183 0 -240 64 -39 146 -16 188 52 71 117 -71 259 -188 188z m138 -55 c35 -36 34 -95 -3 -132 -60 -61 -162 -19 -162 66 0 89 101 130 165 66z" />
              <path d="M0 290 c0 -20 7 -20 1000 -20 993 0 1000 0 1000 20 0 20 -7 20 -1000 20 -993 0 -1000 0 -1000 -20z" />
            </g>
          </svg>
          Image
        </h3>
        {isOpen && (
          <div className="answer-wrap">
            <div className="answer">
              <div className="upload-image-wrap">
                <div className="upload-image-file" id="upload-image-file">
                  <input
                    type="text"
                    value={imageName}
                    style={{ color: "black" }}
                    name=""
                    id="chosen-filename"
                    readOnly
                  />
                  <label htmlFor="browse-image">
                    <input
                      type="file"
                      name="browse-image"
                      id="browse-image"
                      onChange={handleChange}
                      accept="image/*"
                    />
                    <span className="btn-design">Browse</span>
                  </label>
                  <button
                    id="btn-reset"
                    type="reset"
                    onClick={handleReset}
                    className="btn-design"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </li>
    </>
  );
}
