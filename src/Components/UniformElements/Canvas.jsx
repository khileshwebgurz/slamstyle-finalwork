import JerseyFront from "../JerseyComponents/JerseyFront";
import Avatar from "@mui/material/Avatar";
import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import "../../../public/custom.js";

// for generating pdf
// import { jsPDF } from "jspdf";

import Box from "@mui/material/Box";
import JerseyLeft from "../JerseyComponents/JerseyLeft";
import JerseyRight from "../JerseyComponents/JerseyRight";
import JerseyBack from "../JerseyComponents/JerseyBack";
import { useEffect, useState, useRef } from "react";
import front from "../../assets/images/jersey-images/UNIFORM FRONT.png";
import back from "../../assets/images/jersey-images/UNIFORM BACK.png";
import left from "../../assets/images/jersey-images/UNIFORM LEFT SIDE.png";
import right from "../../assets/images/jersey-images/UNIFORM RIGHT SIDE.png";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function Canvas({
  canvasTemp,
  shapeColor,
  selectedNeckImage,
  selectedShoulderImage,
  selectedCutorNoCut,
  selectedImage,
  numVal,
  navigateToFinalForm,
  player,
  jerseyFrontRef,
  jerseyBackRef,
  jerseyLeftRef,
  jerseyRightRef,
  textPosition,
  setTextPosition,
  playerNum,
  setPlayerNum,
  backNum,
  setBackNum,
  backText,
  setBackText
  
}) {
  // this state is for differentiating the tabs
  const [value, setValue] = useState(0);


  // this is used to avoid rendering left and right jersey at initial phase
  const [initialRender, setInitialRender] = useState(true);

  // this is state lifting for position of image to be setted in JerseyFront
  
  const [imagePosition, setImagePosition] = useState({
    left: 50,
    top: 50,
    scaleX: 0.4,
    scaleY: 0.4,
    angle: 0,
  });

  // this is for handling the tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // for cut or not cut side images
  useEffect(() => {
    //for cut or no cut selection, this initialrender is used so that these thing won't start at the intial render
    if (!initialRender && selectedCutorNoCut) {
      if (value === 2 && selectedCutorNoCut.left) {
        setValue(2);
      } else if (value === 3 && selectedCutorNoCut.right) {
        setValue(3);
      } else {
        setValue(2);
      }
    } else {
      setInitialRender(false);
    }
  }, [selectedCutorNoCut]);

  // for selectedShoulderImages
  useEffect(() => {
    if (selectedShoulderImage) {
      if (
        (value === 2 || value === 3) &&
        (selectedShoulderImage.frontassociate ||
          selectedShoulderImage.backassociate)
      ) {
        setValue(0);
      }
    }
  }, [selectedShoulderImage]);

  // for selectedNeckImages
  useEffect(() => {
    if (selectedNeckImage && value !== 0) {
      setValue(0);
    }
  }, [selectedNeckImage]);

  // when image is selected and value is either 1,2,3 then it should render to front tab
  useEffect(() => {
    if (selectedImage && value !== 0) {
      setValue(0);
    }
  }, [selectedImage]);

  useEffect(()=>{
    if(canvasTemp && value !== 0){
      setValue(0)
    }

  },[canvasTemp])

  useEffect(()=>{
    if(numVal && value !== 0){
      setValue(0)
    }
  }, [numVal])

  useEffect(() => {
    if (player && value !== 1) {
      setValue(1);
    }
  }, [player]);


  // this function is called when save uniform button is clicked
 

  return (
    <>
      <div className="customize-view ">
        <div id="scroll_change" className="customize-view__inner">
          <div
            className="customize-view__wrap flex-row"
            style={{ display: "flex", flexWrap: "nowrap" }}
          >
            <div className="customize-view__large flex-col">
              <div className="customize-view__details">
                <div className="customize-view__image" id="html-content-holder">
                  <TabPanel value={value} index={0}>
                    <JerseyFront
                       ref={jerseyFrontRef}
                       canvasTemp={canvasTemp}
                       shapeColors={shapeColor}
                       selectedNeckImage={selectedNeckImage}
                       selectedShoulderImage={
                         selectedShoulderImage.frontassociate
                       }
                       selectedImage={selectedImage}
                       imagePosition={imagePosition}
                       setImagePosition={setImagePosition}
                       textPosition={textPosition}
                       setTextPosition={setTextPosition}
                       numVal={numVal}
                       numPosition={playerNum}
                       setNumPosition={setPlayerNum}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <JerseyBack
                      ref={jerseyBackRef}
                      shapeColors={shapeColor}
                      selectedShoulderImage={
                        selectedShoulderImage.backassociate
                      }
                      numVal={numVal}
                      backNumPosition={backNum}
                      setBackNumPosition={setBackNum}
                      player={player}
                      backTextPosition={backText}
                      setBackTextPosition={setBackText}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <JerseyLeft
                      ref={jerseyLeftRef}
                      shapeColors={shapeColor}
                      selectedvorNovImg={selectedCutorNoCut.left}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    <JerseyRight
                      ref={jerseyRightRef}
                      shapeColors={shapeColor}
                      selectedvorNovImg={selectedCutorNoCut.right}
                    />
                  </TabPanel>
                </div>
              </div>
            </div>

            <div className="customize-view__large flex-col">
              <div className="customize-view__details">
                <div className="customize-view__image" id="html-content-holder">
                  <Box
                    sx={{
                      flexGrow: 1,
                      bgcolor: "background.paper",
                      display: "flex",
                      height: "100%",
                    }}
                  >
                    <Tabs
                      orientation="vertical"
                      value={value}
                      onChange={handleChange}
                      aria-label="Vertical tabs example"
                      container="true"
                      spacing={2}
                    >
                      <Tab
                        style={{ minHeight: 150 }}
                        icon={
                          <Avatar
                            style={{ minHeight: 100, minWidth: 70 }}
                            src={front}
                          />
                        }
                        {...a11yProps(0)}
                      />
                      <Tab
                        style={{ minHeight: 150 }}
                        icon={
                          <Avatar
                            style={{ minHeight: 100, minWidth: 70 }}
                            src={back}
                          />
                        }
                        {...a11yProps(1)}
                      />
                      <Tab
                        style={{ minHeight: 150 }}
                        icon={
                          <Avatar
                            style={{ minHeight: 100, minWidth: 70 }}
                            src={left}
                          />
                        }
                        {...a11yProps(2)}
                      />
                      <Tab
                        style={{ minHeight: 150 }}
                        icon={
                          <Avatar
                            style={{ minHeight: 100, minWidth: 70 }}
                            src={right}
                          />
                        }
                        {...a11yProps(3)}
                      />
                    </Tabs>
                  </Box>
                </div>
              </div>
            </div>
          </div>
          <div className="btn-block btn-fixed">
            <div className="flex-row bottom-section">
              <div className="bottom-sec">
                <h3 className="txtuni">Customize Your New Uniform </h3>
                {/* <button
                  id="saveunii"
                  
                  onClick={()=>{handleSaveAsPDF()}}
                  className="btn-design save-uniform"
                >
                  Save Uniform and move to step 3
                </button> */}
                <div style={{ position: "absolute", top: -9999, left: -9999 }}>
                  <JerseyFront
                   ref={jerseyFrontRef}
                   canvasTemp={canvasTemp}
                   shapeColors={shapeColor}
                   selectedNeckImage={selectedNeckImage}
                   selectedShoulderImage={
                     selectedShoulderImage.frontassociate
                   }
                   selectedImage={selectedImage}
                   imagePosition={imagePosition}
                   setImagePosition={setImagePosition}
                   textPosition={textPosition}
                   setTextPosition={setTextPosition}
                   numVal={numVal}
                   numPosition={playerNum}
                   setNumPosition={setPlayerNum}
                />
                <JerseyBack
                  ref={jerseyBackRef}
                  shapeColors={shapeColor}
                  selectedShoulderImage={
                    selectedShoulderImage.backassociate
                  }
                  numVal={numVal}
                  backNumPosition={backNum}
                  setBackNumPosition={setBackNum}
                  player={player}
                  backTextPosition={backText}
                  setBackTextPosition={setBackText}
                />
                  <JerseyLeft
                  ref={jerseyLeftRef}
                    shapeColors={shapeColor}
                    selectedvorNovImg={selectedCutorNoCut.left}
                  />
                  <JerseyRight
                  ref={jerseyRightRef}
                    shapeColors={shapeColor}
                    selectedvorNovImg={selectedCutorNoCut.right}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
