import React, { useState, useEffect } from "react";
import jerseyPreviewsList from "./UniformStore/PreviewStore.jsx";
import CustomisableUniformSlices from "./CustomisableUniformSlices.jsx";

export default function UniformList({
  onJerseySelect,
  navigateToFinalForm,
  jerseyFrontRef,
  jerseyBackRef,
  jerseyLeftRef,
  jerseyRightRef,
}) {
  const [jersey, setJersey] = useState();
  const [preloadedImages, setPreloadedImages] = useState({});

  useEffect(() => {
    // Preload images
    jerseyPreviewsList.forEach((jerseyPreview) => {
      const img = new Image();
      img.src = jerseyPreview.src;
      img.onload = () => {
        setPreloadedImages((prev) => ({
          ...prev,
          [jerseyPreview.id]: img.src,
        }));
      };
    });
  }, []);

  const handleClick = (id) => {
    localStorage.setItem("selectedJersy", id);
    setJersey(id);
    onJerseySelect(id);
  };

  return (
    <>
      {!jersey ? (
        <div id="uniform-tabs-content">
          <div id="tab1" className="tab-content">
            <div className="uniform-list-wrap scrollbar">
              <ul className="uniform-list list-unstyled">
                {jerseyPreviewsList.map((jerseyPreviewItem) => (
                  <li key={jerseyPreviewItem.id}>
                    <a onClick={() => handleClick(jerseyPreviewItem.id)}>
                      <div className="uniform-details new">
                        <figure>
                          <img
                            src={
                              preloadedImages[jerseyPreviewItem.id] ||
                              jerseyPreviewItem.src
                            }
                            alt={jerseyPreviewItem.alt}
                            loading="eager"
                            decoding="async"
                          />
                        </figure>
                        <div className="uniform-tag">
                          N{jerseyPreviewItem.id}
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <CustomisableUniformSlices
          navigateToFinalForm={navigateToFinalForm}
          jerseyFrontRef={jerseyFrontRef}
          jerseyBackRef={jerseyBackRef}
          jerseyLeftRef={jerseyLeftRef}
          jerseyRightRef={jerseyRightRef}
        />
      )}
    </>
  );
}
