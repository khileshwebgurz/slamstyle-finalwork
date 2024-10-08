import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
  lazy,
} from "react";

const Neck = lazy(() => import("./UniformElements/Neck.jsx"));
const Shoulder = lazy(() => import("./UniformElements/Shoulder.jsx"));
const Vtype = lazy(() => import("./UniformElements/Vtype.jsx"));
const Color = lazy(() => import("./UniformElements/Color.jsx"));
const Canvas = lazy(() => import("./UniformElements/Canvas.jsx"));
const AddImages = lazy(() => import("./UniformElements/AddImages.jsx"));
const AddTeam = lazy(() => import("./UniformElements/AddTeam.jsx"));
import NeckImgeList from "./UniformStore/NeckStore.jsx";
import JerseyCustomisableData from "../utils/jerseyCustomisableData.js";
import ShoulderStore from "./UniformStore/ShoulderStore.jsx";
import Index from "../Components/index.jsx";
import UnloadBefore from "./UniformElements/UnloadBefore.jsx";
import loader from "/assets/load.gif";
export default function CustomisableUniformSlices({
  navigateToFinalForm,
  jerseyFrontRef,
  jerseyBackRef,
  jerseyLeftRef,
  jerseyRightRef,
  stepIdData,
}) {
  const ShoulderImages = useMemo(() => ShoulderStore(), []);
  const jersyNum = useMemo(() => localStorage.getItem("selectedJersy"), []);
  const jerseyData = useMemo(
    () => JerseyCustomisableData[jersyNum],
    [jersyNum]
  );

  UnloadBefore(
    "Are you sure you want to leave this page? Your changes may not be saved."
  );

  const vleftside = useMemo(
    () => `assets/jerseys/${jersyNum}/crew_leftside.png`,
    [jersyNum]
  );
  const vrightside = useMemo(
    () => `assets/jerseys/${jersyNum}/crew_rightside.png`,
    [jersyNum]
  );
  const noVLeftSide = useMemo(
    () => `assets/jerseys/${jersyNum}/crew_noV_leftside.png`,
    [jersyNum]
  );
  const noVRightSide = useMemo(
    () => `assets/jerseys/${jersyNum}/crew_noV_rightside.png`,
    [jersyNum]
  );

  const [openAccordion, setOpenAccordion] = useState("");
  const [selectedNeckImage, setSelectedNeckImage] = useState({
    NeckImg: NeckImgeList[jerseyData.neck_style - 1].src,
    NeckClr: NeckImgeList[jerseyData.neck_style - 1].clrImg1,
    NeckImgShd: NeckImgeList[jerseyData.neck_style - 1].shd,
    NeckId: NeckImgeList[jerseyData.neck_style - 1].id,
  });
  const [selectedShoulderImage, setSelectedShoulderImage] = useState({
    frontassociate: ShoulderImages[0].frontassociate,
    backassociate: ShoulderImages[0].backassociate,
  });
  const [selectedCutorNoCut, setSelectedCutorNoCut] = useState({
    left: noVLeftSide,
    right: noVRightSide,
  });
  const [shapeColor, setShapeColor] = useState({
    shirt1: jerseyData.mc,
    shirt2: jerseyData.stc,
    shirt3: jerseyData.sl2,
    shirt4: jerseyData.sl3,
    shirt5: jerseyData.sl4,
    shirt6: jerseyData.sl5,
    shirt7: jerseyData.sl6,
    shirt8: jerseyData.sl7,
    shirt9: "#f88f37",
    shirt10: "#b54235",
    neck1: jerseyData.cc,
    neck2: jerseyData.clc,
    shoulder1: jerseyData.sc,
    shoulder2: jerseyData.cl2,
  });

  const [image, setImage] = useState();
  const [canvasTemp, setCanvasTemp] = useState(null);
  const [numVal, setNumVal] = useState("");
  const [player, setPlayer] = useState(null);

  const [textPosition, setTextPosition] = useState({
    left: 80,
    top: 150,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
  });
  const [playerNum, setPlayerNum] = useState({
    left: 200,
    top: 100,
    scaleX: 0.7,
    scaleY: 1.4,
    angle: 0,
  });
  const [backNum, setBackNum] = useState({
    left: 100,
    top: 150,
    scaleX: 1.5,
    scaleY: 2,
    angle: 0,
  });
  const [backText, setBackText] = useState({
    left: 80,
    top: 70,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
  });

  useEffect(() => {
    if (window.innerWidth > 960) {
      setOpenAccordion("neck-style-layer");
    }
  }, []);

  const handleAccordionToggle = useCallback(
    (accordionName) => {
      setOpenAccordion(openAccordion === accordionName ? "" : accordionName);
    },
    [openAccordion]
  );

  const handleColorSelect = useCallback((color, area) => {
    setShapeColor((prevColors) => ({
      ...prevColors,
      [area]: color,
    }));
  }, []);

  const handleVorNoVImageSelect = useCallback(
    (type) => {
      if (type === "v") {
        setSelectedCutorNoCut({ left: vleftside, right: vrightside });
      } else if (type === "noV") {
        setSelectedCutorNoCut({ left: noVLeftSide, right: noVRightSide });
      }
    },
    [vleftside, vrightside, noVLeftSide, noVRightSide]
  );

  const handleStepBack=()=>{
    stepIdData(1);
  };
  const handleStepForward=()=>{
    stepIdData(3);
  }

  return (
    <>
      <Suspense
        fallback={
          <div>
            <div
              className="beforeLoadTop"
              style={{
                width: "930px",
                margin: "0 auto",
                height: "891px",
                borderRadius: "10px",
                background: "rgb(18 18 18)",
                zIndex: "99999",
                textAlign: "center",
                display: "none",
              }}
            >
              <img src={loader} style={{ width: "200px", marginTop: "25%" }} />
            </div>
            <div
              className="beforeLoad"
              style={{ width: "200px", margin: "0 auto" }}
            >
              <img src={loader} style={{ width: "200px" }} />
            </div>
            <div
              className="afterLoad"
              id="fs"
              style={{ display: "none" }}
            ></div>
          </div>
        }
      >
        <Index />
<button className="BackToSelectionMobile" onClick={handleStepBack}>Back</button>
<button id="saveunii" className="btn-design save-btn" onClick={handleStepForward}>Save</button>
        <div className="customize-uniform">
          <div className="customize-layout flex-row fosCls">
            <div className="customize-option">
              <ul className="accordion-list list-unstyled">
                <Neck
                  onNeckSelect={setSelectedNeckImage}
                  isOpen={openAccordion === "neck-style-layer"}
                  onAccordionToggle={() =>
                    handleAccordionToggle("neck-style-layer")
                  }
                />
                <Shoulder
                  onShoulderSelect={setSelectedShoulderImage}
                  isOpen={openAccordion === "shoulder-type-layer"}
                  onAccordionToggle={() =>
                    handleAccordionToggle("shoulder-type-layer")
                  }
                />
                <Vtype
                  onImageSelect={handleVorNoVImageSelect}
                  isOpen={openAccordion === "choose-v-layer"}
                  onAccordionToggle={() =>
                    handleAccordionToggle("choose-v-layer")
                  }
                />
                <Color
                  onColorSelect={handleColorSelect}
                  selectedNeckId={selectedNeckImage.NeckId}
                  shapeColor={shapeColor}
                  isOpen={openAccordion === "color-uniform-layer"}
                  onAccordionToggle={() =>
                    handleAccordionToggle("color-uniform-layer")
                  }
                />
                <AddTeam
                  onCanvasTemp={setCanvasTemp}
                  onPlayerTemp={setPlayer}
                  getNumValue={setNumVal}
                  txtPosition={setTextPosition}
                  numPosition={setPlayerNum}
                  backNumPosition={setBackNum}
                  backTextPosition={setBackText}
                  isOpen={openAccordion === "text-style-layer"}
                  onAccordionToggle={() =>
                    handleAccordionToggle("text-style-layer")
                  }
                />
                <AddImages
                  gettingImages={setImage}
                  isOpen={openAccordion === "add-images-layer"}
                  onAccordionToggle={() =>
                    handleAccordionToggle("add-images-layer")
                  }
                />
              </ul>
            </div>
            <Canvas
              canvasTemp={canvasTemp}
              shapeColor={shapeColor}
              selectedNeckImage={selectedNeckImage}
              selectedShoulderImage={selectedShoulderImage}
              selectedCutorNoCut={selectedCutorNoCut}
              selectedImage={image}
              numVal={numVal}
              navigateToFinalForm={navigateToFinalForm}
              player={player}
              jerseyFrontRef={jerseyFrontRef}
              jerseyBackRef={jerseyBackRef}
              jerseyLeftRef={jerseyLeftRef}
              jerseyRightRef={jerseyRightRef}
              textPosition={textPosition}
              setTextPosition={setTextPosition}
              playerNum={playerNum}
              setPlayerNum={setPlayerNum}
              backNum={backNum}
              setBackNum={setBackNum}
              backText={backText}
              setBackText={setBackText}
            />
          </div>
        </div>
      </Suspense>
    </>
  );
}
