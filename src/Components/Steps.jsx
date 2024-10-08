import { useState, useEffect } from "react";

export const Steps = ({ gettingdata, activeStateProp, navigateToFinalForm }) => {
  const [activeState, setActiveState] = useState(1);

  useEffect(() => {
    setActiveState(activeStateProp);
  }, [activeStateProp]);

  const handleStepClick = (step) => {
    if (step > 1 && activeState === 1) {
      return;
    } else if (step > 2 && activeState === 2) {
      return;
    } else if (activeState === 3 && step === 2) {
      return;
    }
    gettingdata(step);
    setActiveState(step);
  };

  // Determine the text for step 3 based on the active state
  const stepThreeText = () => {
    if (activeState === 1) return "Finalize";
    if (activeState === 2) return "Save and Next";
    if (activeState === 3) return "Finalize";
  };

  const handleStepChange = () => {
    navigateToFinalForm();
  };

  return (
    <>
      <ul id="uniform-tabs-nav" className="list-unstyled">
        <li className={`navone ${activeState === 1 ? "active" : ""}`}>
          <a onClick={() => handleStepClick(1)}>
            <div className="step-tab">
              <h3 className="step-tab-name-mob">Select</h3>
            </div>
          </a>
        </li>
        <li
          className={`navtwo ${activeState === 2 ? "active" : ""} ${
            activeState === 1 || activeState === 3 ? "disabled" : ""
          }`}
        >
          <a onClick={() => handleStepClick(2)}>
            <div className="step-tab">
              <h3 className="step-tab-name-mob">Customize</h3>
            </div>
          </a>
        </li>
        <li
          className={`navthree ${activeState === 3 ? "active" : ""} ${
            activeState === 1 ? "disabled" : ""
          }`}
        >
          <a onClick={() => handleStepClick(3)}>
            <div onClick={() => handleStepChange()} className="step-tab">
              <h3 className="step-tab-name-mob">{stepThreeText()}</h3>
            </div>
          </a>
        </li>
      </ul>
    </>
  );
};
