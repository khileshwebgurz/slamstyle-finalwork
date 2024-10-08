import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import JerseyCustomisableData from "../../utils/jerseyCustomisableData.js";

// here shapeColors and selectedShoulderImage are props so this is selected color and shoulderImage
const JerseyBack = forwardRef(
  (
    {
      selectedShoulderImage,
      shapeColors,
      numVal,
      backNumPosition,
      setBackNumPosition,
      player,
      backTextPosition,
      setBackTextPosition,
    },
    ref
  ) => {
    // taking the useRef
    const canvasRef = useRef(null);
    const fabricCanvasRef1 = useRef(null);
    const fabricCanvasRef = useRef(null);

    // intializing the shirtImage variable
    let shirtImage = ``;

    //getting the value of selectedJersey
    const jersyNum = localStorage.getItem("selectedJersy");

    //conditionally getting the jersey based on narrow or wide
    if (selectedShoulderImage.includes("narrow")) {
      shirtImage = `assets/jerseys/${jersyNum}/crew_back_narrow_shoulder.png`;
    } else {
      shirtImage = `assets/jerseys/${jersyNum}/crew_back_wide_shoulder.png`;
    }

    //using bg image of shirt to make it visible
    const shirtBg = `assets/jerseys/${jersyNum}/crew_back_narrow_shoulderbg.png`;

    // getting all the stripes based on uniform layers for particular selected Jersey
    const stripesNum = JerseyCustomisableData[jersyNum].back_layers;

    // getting all common backstripe and backcollar image
    const backStripes = `assets/jerseys/${jersyNum}/back-stripes.png`;
    const backCollar = `assets/jerseys/${jersyNum}/back-collar.png`;

    // storing all the stripes in the stripeImages array
    const stripeImages = [];
    // we already have base image and the 1 stripe so we started with 2 till the stripeNum which will tell the layers in a uniform
    for (let i = 2; i < stripesNum; i++) {
      // then push it to an array
      stripeImages.push(`assets/jerseys/${jersyNum}/back-stripes-${i}.png`);
    }

    // function for loading the images asynchrounously
    const loadImages = async (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (error) => {
          console.error("Image loading failed:", img);
          reject(error);
        };
      });
    };

    useEffect(() => {
      // taking the canvas reference and getting context for 2d images
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { willReadFrequently: true });

      const drawImages = async () => {
        try {
          // loading all the images and storing it in a varibale
          const [
            defaultShirt,
            defaultShoulder,
            defaultBackStripes,
            backCollarImg,
            shirtbg,
            ...additionalStripes //this will have all the left stripes images bcz evry jersey have different number of stripes
          ] = await Promise.all([
            loadImages(shirtImage),
            loadImages(selectedShoulderImage),
            loadImages(backStripes),
            loadImages(backCollar),
            loadImages(shirtBg),
            // loading all the images one by one from the stripeImages array
            ...stripeImages.map((src) => loadImages(src)),
          ]);

          let additionalShoulderImg;
          if (
            selectedShoulderImage.includes("wide") &&
            JerseyCustomisableData[jersyNum].shoulder_layers === 2
          ) {
            additionalShoulderImg = await loadImages(
              `assets/jerseys/${jersyNum}/back-shoulders-wide-2.png`
            );
          }

          context.clearRect(0, 0, canvas.width, canvas.height);

          // default shirt
          context.drawImage(defaultShirt, 10, 0, 300, 600);
          let imageData = context.getImageData(10, 0, 300, 600);
          imageData = changeColor(imageData, shapeColors.shirt1);
          context.putImageData(imageData, 10, 0);

          // background image
          context.drawImage(shirtbg, 10, 0, 300, 600);

          // Draw other default images
          const defaultImages = [
            {
              image: backCollarImg,
              color: shapeColors.neck1,
              position: [10, 0],
            },
            {
              image: defaultShoulder,
              color: shapeColors.shoulder1,
              position: [10, 0],
            },
            {
              image: defaultBackStripes,
              color: shapeColors.shirt2,
              position: [10, 0],
            },
          ];

          // now adding all the additional stripes to my Images array so that it can used inside
          // the temporary canvas
          additionalStripes.forEach((stripeImg, index) => {
            // starting with 3 bcz we already have base image and 1 stripe
            const colorKey = `shirt${index + 3}`;
            defaultImages.push({
              image: stripeImg,
              color: shapeColors[colorKey],
              position: [10, 0],
            });
          });

          defaultImages.forEach(({ image, color, position }) => {
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = 300;
            tempCanvas.height = 600;
            const tempContext = tempCanvas.getContext("2d");
            tempContext.drawImage(image, 0, 0, 300, 600);
            let tempImageData = tempContext.getImageData(0, 0, 300, 600);
            tempImageData = changeColor(tempImageData, color);
            tempContext.putImageData(tempImageData, 0, 0);
            context.drawImage(tempCanvas, ...position);
          });

          if (additionalShoulderImg) {
            const tempCanvasbackStr = document.createElement("canvas");
            tempCanvasbackStr.width = 300;
            tempCanvasbackStr.height = 600;
            const textContextbackStr = tempCanvasbackStr.getContext("2d");
            textContextbackStr.drawImage(additionalShoulderImg, 5, 0, 300, 600);
            const tempImagebackStr = textContextbackStr.getImageData(
              5,
              0,
              300,
              600
            );
            const updatedTempImagebackStr = changeColor(
              tempImagebackStr,
              shapeColors.shoulder2
            );
            textContextbackStr.putImageData(updatedTempImagebackStr, 5, 0);
            context.drawImage(tempCanvasbackStr, 5, 0);
          }
        } catch (error) {
          console.error("Error loading images:", error);
        }
      };

      drawImages();
    }, [selectedShoulderImage, shapeColors]);

    // function for changing the color of the jersey in hex format
    const changeColor = (imageData, color) => {
      const { data } = imageData;
      const hexColor = color.replace(/^#/, ""); // Remove '#' if present
      const [r, g, b] = hexColor.match(/.{1,2}/g).map((c) => parseInt(c, 16));
      for (let i = 0; i < data.length; i += 4) {
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }
      return imageData;
    };

    useEffect(() => {
      const fabricCanvas = new fabric.Canvas(fabricCanvasRef1.current, {
        width: 300,
        height: 600,
      });
      //to remove fabric from pdf
      fabricCanvasRef1.current.fabricInstance = fabricCanvas;
      fabricCanvasRef.current = fabricCanvas;

      return () => {
        fabricCanvas.dispose();
      };
    }, []);

    useEffect(() => {
      const fabricCanvas = fabricCanvasRef.current;
      if (!fabricCanvas || !numVal) return;

      fabric.Image.fromURL(numVal, (img) => {
        const existingNumber = fabricCanvas
          .getObjects()
          .find((obj) => obj.type === "image" && obj.name === "number");
        if (existingNumber) {
          fabricCanvas.remove(existingNumber);
        }

        img.set({
          left: backNumPosition.left,
          top: backNumPosition.top,
          scaleX: backNumPosition.scaleX,
          scaleY: backNumPosition.scaleY,
          hasControls: true,
          fontSize: 60,
          editable: false,
          name: "number",
        });

        img.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false,
        });

        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);

        img.on("modified", () => {
          const { left, top, scaleX, scaleY, angle } = img;
          setBackNumPosition({ left, top, scaleX, scaleY, angle });
        });

        fabricCanvas.renderAll();
      });
    }, [numVal, backNumPosition]);

    // Effect for updating the player name
    useEffect(() => {
      const fabricCanvas = fabricCanvasRef.current;
      if (!fabricCanvas || !player) return;

      fabric.Image.fromURL(player, (img) => {
        const existingName = fabricCanvas
          .getObjects()
          .find((obj) => obj.type === "image" && obj.name === "playerName");
        if (existingName) {
          fabricCanvas.remove(existingName);
        }

        img.set({
          left: backTextPosition.left,
          top: backTextPosition.top,
          scaleX: backTextPosition.scaleX,
          scaleY: backTextPosition.scaleY,
          angle: backTextPosition.angle,
          hasRotatingPoint: false,
          lockScalingFlip: true,
          cornerSize: 10,
          transparentCorners: false,
          name: "playerName",
        });

        fabricCanvas.add(img);
        fabricCanvas.setActiveObject(img);

        img.on("modified", () => {
          const { left, top, scaleX, scaleY, angle } = img;
          setBackTextPosition({ left, top, scaleX, scaleY, angle });
        });

        fabricCanvas.renderAll();
      });
    }, [player, backTextPosition]);

    useImperativeHandle(ref, () => ({
      // Function to capture the canvas
      captureCanvas: async () => {
        const mainCanvas = canvasRef.current;
        const fabricCanvas = fabricCanvasRef1.current.fabricInstance;
        fabricCanvas.lowerCanvasEl.width = 300;
        fabricCanvas.lowerCanvasEl.height = 600;

        if (!fabricCanvas) {
          console.error("Fabric.js canvas is not initialized");
          return;
        }

        // Temporarily hide the control points
        fabricCanvas.getObjects().forEach((obj) => {
          obj.set("hasControls", false);
          obj.set("selectable", false);
          obj.set("hasBorders", false);
        });

        // Render the canvas without control points
        fabricCanvas.renderAll();

        const combinedCanvas = document.createElement("canvas");
        const combinedContext = combinedCanvas.getContext("2d");

        combinedCanvas.width = 375;
        combinedCanvas.height = 745;
        combinedContext.drawImage(mainCanvas, 0, 0);
        combinedContext.drawImage(fabricCanvas.lowerCanvasEl, 0, 0);

        const dataURL = combinedCanvas.toDataURL("image/png");

        // Restore the control points
        fabricCanvas.getObjects().forEach((obj) => {
          obj.set("hasControls", true);
          obj.set("selectable", true);
          obj.set("hasBorders", true);
        });

        // Re-render the canvas with control points
        fabricCanvas.renderAll();

        return dataURL;
      },
    }));

    return (
      <div style={{ position: "relative", width: 300, height: 600 }}>
        <canvas
          ref={canvasRef}
          width={300}
          height={600}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        ></canvas>

        <canvas
          ref={fabricCanvasRef1}
          width={300}
          height={600}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
          }}
        />
      </div>
    );
  }
);

export default JerseyBack;
