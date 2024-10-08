import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { fabric } from "fabric";
import "../../../public/custom.js";
import JerseyCustomisableData from "../../utils/jerseyCustomisableData.js";

// forwardRef and useImperativeHandle for allowing parent to have access to child specific data.
const JerseyFront = forwardRef(
  (
    {
      canvasTemp,
      selectedNeckImage,
      selectedShoulderImage,
      shapeColors,
      selectedImage,
      imagePosition,
      setImagePosition,
      textPosition,
      setTextPosition,
      numVal,
      numPosition,
      setNumPosition,
    },
    ref
  ) => {
    // these are canvas ref for fabric and base canvas
    const canvasRef = useRef(null);
    const fabricCanvasRef1 = useRef(null);
    const fabricCanvasRef = useRef(null);

    // const fabricCanvasRef = useRef(null);

    // this is defined here bcz we want it dynamically inside condition and it will be used as base image
    let shirtImage = ``;

    // which jersey is selected from jersey list
    const jersyNum = localStorage.getItem("selectedJersy");

    // based on shoulder clicked we want our base image i.e shirtImage
    if (selectedShoulderImage.includes("narrow")) {
      shirtImage = `assets/jerseys/${jersyNum}/crew_front_narrow_shoulder.png`;
    } else {
      shirtImage = `assets/jerseys/${jersyNum}/crew_front_wide_shoulder.png`;
    }

    // we want background image for our image so that i look original image

    const shirtBg = `assets/jerseys/${jersyNum}/crew_front_narrow_shoulderbg.png`;

    // this is for storing the value of uniform_layer which helps to decide how many stripes will be there
    // in a jersey and this is taken from util folder
    const stripesNum = JerseyCustomisableData[jersyNum].uniform_layers;

    // initially we defined one front-stripes based on selected jersey
    const frontStripes = `assets/jerseys/${jersyNum}/front-stripes.png`;

    // here we are getting remaining all stripes for selected jersey based on uniform_layer value
    const stripeImages = [];
    for (let i = 2; i < stripesNum; i++) {
      stripeImages.push(`assets/jerseys/${jersyNum}/front-stripes-${i}.png`);
    }

    // this is the function for loading images asynchronously
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

    // this is the function for changing the color of components of jersey
    const changeColor = (imageData, color) => {
      if (!color) {
        console.error("Color is undefined or null.");
        return imageData;
      }
      const { data } = imageData;
      const hexColor = color.replace(/^#/, "");
      const [r, g, b] = hexColor.match(/.{1,2}/g).map((c) => parseInt(c, 16));
      for (let i = 0; i < data.length; i += 4) {
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }
      return imageData;
    };

    // this is the function for drawiing our jersey in the canvas and having temporary canvas for drawing
    // neck, stripes, shoulder in our jersye
    const drawImages = async (context) => {
      try {
        const [
          shirt,
          shoulderImg,
          frontStripesImg,
          selectedImg,
          selectedNeckbgImg,
          shirtbg,
          ...additionalStripes
        ] = await Promise.all([
          loadImages(shirtImage),
          loadImages(selectedShoulderImage),
          loadImages(frontStripes),
          loadImages(selectedNeckImage.NeckImg),
          loadImages(selectedNeckImage.NeckImgShd),
          loadImages(shirtBg),
          ...stripeImages.map((src) => loadImages(src)),
        ]);

        let additionalShoulderImg;
        if (
          selectedShoulderImage.includes("wide") &&
          JerseyCustomisableData[jersyNum].shoulder_layers === 2
        ) {
          additionalShoulderImg = await loadImages(
            `assets/jerseys/${jersyNum}/front-shoulders-wide-2.png`
          );
        }

        var selectedNeckImg2 = "";
        if (
          selectedNeckImage.NeckId === 2 ||
          selectedNeckImage.NeckId === 4 ||
          selectedNeckImage.NeckId === 12
        ) {
          selectedNeckImg2 = await loadImages(selectedNeckImage.NeckClr);
        }

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(shirt, 10, 0, 300, 600);
        let imageData = context.getImageData(10, 0, 300, 600);
        imageData = changeColor(imageData, shapeColors.shirt1);
        context.putImageData(imageData, 10, 0);

        context.drawImage(shirtbg, 10, 0, 300, 600);

        const images1 = [
          {
            image: shoulderImg,
            color: shapeColors.shoulder1,
            position: [10, 0],
          },
          {
            image: frontStripesImg,
            color: shapeColors.shirt2,
            position: [10, 0],
          },
        ];

        additionalStripes.forEach((stripeImg, index) => {
          const colorKey = `shirt${index + 3}`;
          images1.push({
            image: stripeImg,
            color: shapeColors[colorKey],
            position: [10, 0],
          });
        });

        images1.forEach(({ image, color, position }) => {
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

        if (selectedNeckImage) {
          const tempCanvasbackStr = document.createElement("canvas");
          tempCanvasbackStr.width = 180;
          tempCanvasbackStr.height = 105;
          const textContextbackStr = tempCanvasbackStr.getContext("2d");
          textContextbackStr.drawImage(selectedImg, -10, -6, 180, 105);
          const tempImagebackStr = textContextbackStr.getImageData(
            -10,
            -6,
            180,
            105
          );
          const updatedTempImagebackStr = changeColor(
            tempImagebackStr,
            shapeColors.neck1
          );
          textContextbackStr.putImageData(updatedTempImagebackStr, -10, -6);
          context.drawImage(tempCanvasbackStr, 80, 2);

          if (
            selectedNeckImage.NeckId === 2 ||
            selectedNeckImage.NeckId === 4 ||
            selectedNeckImage.NeckId === 12
          ) {
            const tempCanvasbackStr = document.createElement("canvas");
            tempCanvasbackStr.width = 300;
            tempCanvasbackStr.height = 600;
            const textContextbackStr = tempCanvasbackStr.getContext("2d");
            textContextbackStr.drawImage(selectedNeckImg2, 4, 0, 300, 600);
            const tempImagebackStr = textContextbackStr.getImageData(
              4,
              0,
              300,
              600
            );
            const updatedTempImagebackStr = changeColor(
              tempImagebackStr,
              shapeColors.neck2
            );
            textContextbackStr.putImageData(updatedTempImagebackStr, 4, 0);
            context.drawImage(tempCanvasbackStr, 4, 0);
          }
        }

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

        context.drawImage(selectedNeckbgImg, 9, 0);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    // loading our drawImages() inside the useEffect and will render when these dependencies changes
    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      drawImages(context);
    }, [selectedNeckImage, selectedShoulderImage, shapeColors]);

    // useEffect(() => {
    //   const fabricCanvas = new fabric.Canvas(fabricCanvasRef1.current, {
    //     width: 300,
    //     height: 600,
    //   });
    //   //to remove fabric from pdf
    //   fabricCanvasRef1.current.fabricInstance = fabricCanvas;

    //   if (canvasTemp) {
    //     fabric.Image.fromURL(canvasTemp, (img) => {
    //       img.set({
    //         left: textPosition.left,
    //         top: textPosition.top,
    //         scaleX: textPosition.scaleX,
    //         scaleY: textPosition.scaleY,
    //         angle: textPosition.angle,
    //         hasRotatingPoint: false,
    //         lockScalingFlip: true,
    //         cornerSize: 10,
    //         transparentCorners: false,
    //       });

    //       console.log(img);
    //       fabricCanvas.add(img);
    //       fabricCanvas.setActiveObject(img);

    //       img.on("modified", () => {
    //         const { left, top, scaleX, scaleY, angle } = img;

    //         setTextPosition({ left, top, scaleX, scaleY, angle });
    //       });
    //     });
    //   }

    //   if (numVal) {
    //     fabric.Image.fromURL(numVal, (img) => {
    //       img.set({
    //         left: numPosition.left,
    //         top: numPosition.top,
    //         scaleX: numPosition.scaleX,
    //         scaleY: numPosition.scaleY,
    //         angle: numPosition.angle,
    //         hasRotatingPoint: false,
    //         lockScalingFlip: true,
    //         cornerSize: 10,
    //         transparentCorners: false,
    //       });
    //       img.setControlsVisibility({
    //         mt: false, // middle top disable
    //         mb: false, // midle bottom
    //         ml: false, // middle left
    //         mr: false, // I think you get it
    //       });
    //       fabricCanvas.add(img);
    //       fabricCanvas.setActiveObject(img);
    //       img.on("modified", () => {
    //         const { left, top, scaleX, scaleY, angle } = img;

    //         setNumPosition({ left, top, scaleX, scaleY, angle });
    //       });
    //     });
    //   }

    //   if (selectedImage) {
    //     // Using fabric.Image.fromURL, the code loads the image specified by selectedImage. Once the image is loaded, the callback function is
    //     //  executed with the loaded image object img.
    //     fabric.Image.fromURL(selectedImage, (img) => {
    //       img.set({
    //         left: imagePosition.left,
    //         top: imagePosition.top,
    //         scaleX: imagePosition.scaleX,
    //         scaleY: imagePosition.scaleY,
    //         angle: imagePosition.angle,
    //         hasRotatingPoint: false,
    //         lockScalingFlip: true,
    //         cornerSize: 10,
    //         transparentCorners: false,
    //       });

    //       fabricCanvas.add(img);
    //       fabricCanvas.setActiveObject(img);

    //       // when the image is modified then we have to extract left, top, scaleX, scaleY, angle from the img and then set it. Here modiefied is a predefined object of fabric js
    //       img.on("modified", () => {
    //         const { left, top, scaleX, scaleY, angle } = img;

    //         setImagePosition({ left, top, scaleX, scaleY, angle });
    //       });
    //     });
    //   }

    //   return () => {
    //     fabricCanvas.dispose();
    //   };
    // }, [
    //   canvasTemp,
    //   selectedImage,
    //   numVal,
    //   textPosition,
    //   numPosition,
    //   imagePosition,
    // ]);

    // using this we allow our parent i.e canvas to have excess to this means parent is getting the whole final
    // image
    useEffect(() => {
      const fabricCanvas = new fabric.Canvas(fabricCanvasRef1.current, {
        width: 300,
        height: 600,
      });
      fabricCanvasRef1.current.fabricInstance = fabricCanvas;
      fabricCanvasRef.current = fabricCanvas;

      return () => {
        fabricCanvas.dispose();
      };
    }, []);

    useEffect(() => {
      const fabricCanvas = fabricCanvasRef.current;
      if (!fabricCanvas || !canvasTemp) return;
      fabric.Image.fromURL(canvasTemp, (img) => {
        const existingText = fabricCanvas
          .getObjects()
          .find((obj) => obj.type === "image" && obj.name === "text");
        if (existingText) {
          fabricCanvas.remove(existingText);
        }
        img.set({
          left: textPosition.left,
          top: textPosition.top,
          scaleX: textPosition.scaleX,
          scaleY: textPosition.scaleY,
          angle: textPosition.angle,
          hasRotatingPoint: false,
          lockScalingFlip: true,
          cornerSize: 10,
          transparentCorners: false,
          name: "text",
        });

        fabricCanvas.add(img);
        fabricCanvas.renderAll();

        img.on("modified", () => {
          const { left, top, scaleX, scaleY, angle } = img;

          setTextPosition({ left, top, scaleX, scaleY, angle });
        });
      });
    }, [canvasTemp, textPosition]);

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
          left: numPosition.left,
          top: numPosition.top,
          scaleX: numPosition.scaleX,
          scaleY: numPosition.scaleY,
          angle: numPosition.angle,
          hasRotatingPoint: false,
          lockScalingFlip: true,
          cornerSize: 10,
          transparentCorners: false,
          name: "number",
        });

        img.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false,
        });

        fabricCanvas.add(img);
        fabricCanvas.renderAll();

        img.on("modified", () => {
          const { left, top, scaleX, scaleY, angle } = img;

          setNumPosition({ left, top, scaleX, scaleY, angle });
        });
      });
    }, [numVal, numPosition]);

    useEffect(() => {
      const fabricCanvas = fabricCanvasRef.current;
      if (!fabricCanvas) return;

      const existingImage = fabricCanvas
        .getObjects()
        .find((obj) => obj.type === "image" && obj.name === "selectedImage");
      if (selectedImage) {
        fabric.Image.fromURL(selectedImage, (img) => {
          if (existingImage) {
            fabricCanvas.remove(existingImage);
          }
          img.set({
            left: imagePosition.left,
            top: imagePosition.top,
            scaleX: imagePosition.scaleX,
            scaleY: imagePosition.scaleY,
            angle: imagePosition.angle,
            hasRotatingPoint: false,
            lockScalingFlip: true,
            cornerSize: 10,
            transparentCorners: false,
            name: "selectedImage",
          });
          fabricCanvas.add(img);
          fabricCanvas.renderAll();

          img.on("modified", () => {
            const { left, top, scaleX, scaleY, angle } = img;

            setImagePosition({ left, top, scaleX, scaleY, angle });
          });
        });
      } else {
        if (existingImage) {
          fabricCanvas.remove(existingImage);
          fabricCanvas.renderAll();
        }
      }
    }, [selectedImage, imagePosition]);

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

export default JerseyFront;
