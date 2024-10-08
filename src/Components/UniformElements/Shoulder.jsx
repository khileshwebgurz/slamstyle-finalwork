import React, { useState, useEffect } from "react";
import ShoulderStore from "../UniformStore/ShoulderStore.jsx";

export default function Shoulder({
  onShoulderSelect,
  isOpen,
  onAccordionToggle,
}) {
  const ShoulderImages = ShoulderStore();

  const [selectedShoulder, setSelectedShoulder] = useState(1);
  const [preloadedImages, setPreloadedImages] = useState({});

  useEffect(() => {
    // Preload images
    ShoulderImages.forEach((shoulder) => {
      const img = new Image();
      img.src = shoulder.src;
      img.onload = () => {
        setPreloadedImages((prev) => ({ ...prev, [shoulder.id]: img.src }));
      };
    });
  }, []);

  const handleShoulderImageClick = (shoulderImg, id) => {
    onShoulderSelect(shoulderImg);
    setSelectedShoulder(id);
    const isMobileView = window.innerWidth <= 990;
    if (isMobileView) {
      onAccordionToggle();
    }
  };

  const handleTab = () => {
    onAccordionToggle();
  };

  return (
    <>
      <li className={`shoulder-type ${isOpen ? "active" : ""}`}>
        <h3 onClick={() => handleTab("shoulder-type-layer")} className="forMob">
          <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
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
              fill="#fff"
              stroke="none"
            >
              <path
                d="M372 2367 l-372 -372 230 -230 230 -230 123 123 c67 67 124 122 127
        122 3 0 4 -342 2 -760 l-2 -760 790 0 790 0 -2 765 -3 765 128 -128 127 -127
        230 230 230 230 -372 372 -373 373 -221 0 -222 0 -7 -67 c-8 -85 -32 -139 -83
        -195 -64 -69 -121 -93 -222 -93 -101 0 -158 24 -222 93 -51 56 -75 110 -83
        195 l-7 67 -222 0 -221 0 -373 -373z m787 272 c21 -120 82 -205 191 -264 50
        -27 63 -30 150 -30 85 0 101 3 149 28 103 55 172 150 192 266 l11 61 195 0
        194 0 345 -346 c189 -190 344 -351 344 -357 0 -7 -87 -100 -194 -206 l-195
        -195 -105 101 c-118 114 -141 127 -168 93 -17 -21 -18 -62 -18 -740 0 -395 -3
        -725 -6 -734 -6 -14 -80 -16 -744 -16 -664 0 -738 2 -744 16 -3 9 -6 339 -6
        734 0 678 -1 719 -18 740 -28 34 -53 20 -169 -93 l-104 -101 -202 202 -202
        202 350 350 351 350 196 0 196 0 11 -61z"
              />
              <path
                d="M463 2347 c-276 -276 -323 -327 -323 -351 0 -25 25 -55 148 -178 107
        -107 155 -148 172 -148 17 0 63 40 165 140 77 77 146 140 153 140 9 0 12 -179
        12 -785 l0 -786 25 -24 24 -25 661 0 661 0 24 25 25 24 0 786 c0 606 3 785 12
        785 7 0 76 -63 153 -140 100 -99 148 -140 165 -140 16 0 65 43 171 149 123
        122 149 153 149 177 0 24 -48 77 -323 351 l-322 323 -146 0 c-169 0 -174 -2
        -208 -103 -39 -111 -112 -189 -219 -233 -45 -19 -76 -24 -146 -24 -81 0 -95 3
        -162 35 -48 23 -86 51 -114 82 -41 46 -90 138 -90 168 0 7 -12 27 -26 44 l-26
        31 -146 0 -147 0 -322 -323z m623 256 c26 -121 108 -232 211 -286 135 -71 271
        -71 406 0 103 54 185 165 211 286 l6 27 143 0 142 0 315 -315 315 -315 -151
        -150 -150 -151 -182 185 -182 185 0 -849 0 -850 -670 0 -670 0 0 850 0 849
        -182 -185 -182 -185 -150 151 -151 150 315 315 315 315 142 0 143 0 6 -27z"
              />
            </g>
          </svg>
          Sleeve
        </h3>

        {isOpen && (
          <div className="answer-wrap">
            <div className="customize-prod-list">
              <div className="answer">
                <div className="wraper shoulder-size">
                  <h4>Shoulder Size</h4>

                  <div className="customize-info">
                    {ShoulderImages.map((ShoulderTypes) => (
                      <div
                        className="customize-info-inner shoulderType"
                        key={ShoulderTypes.id}
                        onClick={() => {
                          handleShoulderImageClick(
                            {
                              frontassociate: ShoulderTypes.frontassociate,
                              backassociate: ShoulderTypes.backassociate,
                            },
                            ShoulderTypes.id
                          );
                        }}
                      >
                        <div
                          className={`info ${
                            selectedShoulder === ShoulderTypes.id
                              ? "highlightShoulder"
                              : ""
                          }`}
                        >
                          <figure>
                            <img
                              key={ShoulderTypes.id}
                              src={
                                preloadedImages[ShoulderTypes.id] ||
                                ShoulderTypes.src
                              }
                              alt=""
                              loading="eager"
                              decoding="async"
                            />
                            <figcaption>{ShoulderTypes.name}</figcaption>
                          </figure>
                        </div>
                      </div>
                    ))}
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
