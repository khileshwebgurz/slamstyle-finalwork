import React, { useState, useEffect } from "react";
import NeckImgeList from "../UniformStore/NeckStore";
import JerseyCustomisableData from "../../utils/jerseyCustomisableData.js";

export default function Neck({ onNeckSelect, isOpen, onAccordionToggle }) {
  const JerseyNum = localStorage.getItem("selectedJersy");

  const [selectedNeckId, setSelectedNeckId] = useState(
    JerseyCustomisableData[JerseyNum].neck_style
  );
  const [preloadedImages, setPreloadedImages] = useState({});

  useEffect(() => {
    // Preload images
    NeckImgeList.forEach((neckImage) => {
      const img = new Image();
      img.src = neckImage.src;
      img.onload = () => {
        setPreloadedImages((prev) => ({ ...prev, [neckImage.id]: img.src }));
      };
    });
  }, []);

  const handleTab = () => {
    onAccordionToggle();
  };

  const handleNeckImageClick = (NeckData) => {
    onNeckSelect(NeckData);
    setSelectedNeckId(NeckData.NeckId);

    const isMobileView = window.innerWidth <= 990;
    if (isMobileView) {
      onAccordionToggle();
    }
  };

  return (
    <li className={`${isOpen ? "active" : ""} neck-style `}>
      <h3 onClick={handleTab} className="forDesktop">
        Choose Your Neck Style
      </h3>
      <h3 onClick={() => handleTab("neck-style-layer")} className="forMob">
        <svg
          version="1.1"
          viewBox="0 0 2048 2048"
          width="1280"
          height="1280"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            transform="translate(977,298)"
            d="m0 0h95l57 2 54 3 68 6 58 7 52 8 44 8 43 9 48 12 29 8 28 9 30 10 34 13 30 13 29 14 25 13 20 12 17 11 17 12 16 13 11 9 13 12 15 15v2h2l9 11 10 13 10 15 9 16 8 16 8 21 7 27 4 29 5 15 12 26 16 36 9 20 16 36 17 38 16 36 18 40 13 29 20 45 13 29 7 19 6 23 2 4h1v70l-2 2-6 25-7 21-12 25-10 16-9 12-9 11-15 15-8 7-11 10-8 7-14 12-13 12-8 7-10 9-8 7-10 9-8 7-10 9-8 7-14 12-13 12-8 7-14 12-11 10-8 7-11 10-8 7-14 12-13 12-8 7-10 9-8 7-10 9-8 7-10 9-8 7-10 9-11 9-7 7-8 7-14 12-11 10-8 7-10 9-8 7-14 12-14 13-8 7-14 12-13 12-8 7-10 9-8 7-10 9-8 7-10 9-8 7-10 9-11 9-7 7-14 11-11 5-8 2h-10l-11-3-9-5-7-6-7-10-158-316-2-1-372-1-2 6-157 314-8 10-8 6-9 4-9 2h-9l-9-2-10-5-13-11-12-11-8-7-10-9-8-7-10-9-8-7-10-9-8-7-10-9-8-7-10-9-11-9-16-15-11-9-14-13-8-7-10-9-13-11-13-12-14-12-12-11-8-7-10-9-14-12-13-12-8-7-10-9-8-7-10-9-8-7-14-12-13-12-8-7-14-12-13-12-8-7-14-12-13-12-8-7-14-12-13-12-8-7-10-9-8-7-10-9-8-7-10-9-11-9-7-7-8-7-10-9-8-7v-2h-2l-18-22-10-15-12-23-7-18-6-20-4-18-1-2v-60l8-32 7-20 16-35 24-54 18-40 12-27 13-29 20-45 17-38 30-67 5-13 3-24 4-19 8-26 9-21 11-20 11-16 10-13 9-11 15-16 16-15 17-14 19-14 15-10 19-12 25-14 32-16 25-11 30-12 30-11 38-12 36-10 48-12 48-10 39-7 45-7 38-5 46-5 49-4 51-3zm18 86-47 1-45 2-57 4-51 5-47 6-45 7-39 7-50 11-43 11-40 12-41 14-33 13-20 9-25 12-19 10-17 10-14 9-17 12-14 11-10 9-15 14-9 10-10 13-9 14-10 19-7 21-2 8v5l14 11 16 12 19 14 17 13 400 300 21 16 19 14 32 24 21 16 19 14 21 16 19 14 32 24h229l18-13 13-10 100-75 21-16 11-8 16-12 21-16 11-8 352-264 21-16 19-14 21-16 19-14 7-5 1-3-4-16-6-17-11-21-8-12-9-11-12-14-15-14-11-9-13-10-13-9-19-12-21-12-19-10-28-13-27-11-35-13-37-12-43-12-47-11-33-7-53-9-48-7-45-5-45-4-43-3-50-2-43-1zm-73 854-16 32-8 15-11 23-6 12v2h286l-9-19-32-64-1-1z"
          />
        </svg>
        Neck
      </h3>

      {isOpen && (
        <div className="answer-wrap">
          <div className="answer">
            <div className="customize-prod-list scrollbar">
              <ul className="list-unstyled">
                {NeckImgeList.map((neckimge) => (
                  <li
                    key={neckimge.id}
                    onClick={() =>
                      handleNeckImageClick({
                        NeckImg: neckimge.src,
                        NeckClr: neckimge.clrImg1,
                        NeckImgShd: neckimge.shd,
                        NeckId: neckimge.id,
                      })
                    }
                  >
                    <div
                      id="collar-img"
                      className={`detail zoomNeck ${
                        selectedNeckId === neckimge.id ? "highlightNeck" : ""
                      }`}
                    >
                      <figure>
                        <img
                          src={preloadedImages[neckimge.id] || neckimge.src}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      </figure>
                      <div className="uniform-tag">N{neckimge.id}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
