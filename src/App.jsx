import { useState, useRef, useEffect } from "react";
import "./assets/css/style.css";
import "./assets/css/app.css";
import "./App.css";
// import "../public/assets/font-assets/fonts.css"
import { Steps } from "./Components/Steps.jsx";
import UniformList from "./Components/UniformList";
import CustomisableUniformSlices from "./Components/CustomisableUniformSlices.jsx";
import FinalForm from "./Components/FinalForm.jsx";
function App() {
  const [stepIdData, SetStepIdData] = useState(1);

  const handleIconClick = (id) => {
    SetStepIdData(id);
  };

  const handleFormID = (value) => {
    SetStepIdData(value);
  };

  const handleStartOver = (id) => {
    SetStepIdData(id);
  };

  const StepData = (stepId) => {
    SetStepIdData(stepId);
  };

  const handleJerseySelect = () => {
    SetStepIdData(2);
  };

  const jerseyFrontRef = useRef(null);
  const jerseyBackRef = useRef(null);
  const jerseyLeftRef = useRef(null);
  const jerseyRightRef = useRef(null);

  function navigateToFinalForm() {
    jerseyFrontRef.current.captureCanvas().then((result) => {
      localStorage.setItem("front", result);
    });

    jerseyBackRef.current.captureCanvas().then((result) => {
      localStorage.setItem("back", result);
    });

    jerseyLeftRef.current.captureCanvas().then((result) => {
      localStorage.setItem("left", result);
    });

    jerseyRightRef.current.captureCanvas().then((result) => {
      localStorage.setItem("right", result);
    });

    SetStepIdData(3);
  }

  return (
    <>
      <section className="custom-uniform">
        <div className="uniform-wrapper">
          <div className="container">
            <div className="uniform-inner">
              <div className="uniform-tabs">
                <Steps gettingdata={StepData} activeStateProp={stepIdData} navigateToFinalForm={navigateToFinalForm} />
                {stepIdData === 1 && (
                  <UniformList onJerseySelect={handleJerseySelect} />
                )}
                {stepIdData === 2 && (
                  <CustomisableUniformSlices
                    navigateToFinalForm={navigateToFinalForm}
                    jerseyFrontRef={jerseyFrontRef}
                    jerseyBackRef={jerseyBackRef}
                    jerseyLeftRef={jerseyLeftRef}
                    jerseyRightRef={jerseyRightRef}
                    stepIdData={handleIconClick}
                  />
                )}
                {stepIdData === 3 && (
                  <FinalForm
                    stepIdData={handleStartOver}
                    stepIDS={handleFormID}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
