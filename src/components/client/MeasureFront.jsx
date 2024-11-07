import React, { useEffect, useRef, useState } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";
// import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';

const MeasureFront = ({ onClickPrev, scalingFactor, toNextStage, referenceHeightPixels, stage }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [message, setMessage] = useState("Hãy đứng vào vị trí như trong hình");
  const [estimateHeight, setEstimateHeight] = useState(0);
  const [shoulderLength, setShoulderLength] = useState(0); // CM
  const [shoulderToCrotchHeight, setShoulderToCrotchHeight] = useState(0); //CM
  const [neckFrontRadius, setNeckFrontRadius] = useState(0); // PX
  const [chestLength, setChestLength] = useState(0); // PX
  const [waistLength, setWaistLength] = useState(0); // PX
  const [hipLength, setHipLength] = useState(0); // PX
  const [armLength, setArmLength] = useState(0); // CM
  const [legLength, setLegLength] = useState(0); // CM
  const detectIntervalRef = useRef(null);
  const audioStepBackward = new Audio("../assets/audio/step-backward.mp3")
  const audioStepUpward = new Audio("../assets/audio/step-upward.mp3")
  const audioTurnRight = new Audio("../assets/audio/turn-right.mp3")

  const detect = async (net) => {
    if (
      typeof webcamRef !== undefined &&
      webcamRef !== null &&
      webcamRef.current?.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const options = {
        flipHorizontal: true,
        internalResolution: "medium", // or 'low', 'high', etc.
        segmentationThreshold: 0.7, // Threshold for segmentation
        outputStride: 16, // or 32, depending on your needs
      };
      const person = await net.segmentPersonParts(video, options);
      const estimatedHeightResult = measuringHeight(person);

      if (estimatedHeightResult) {
        setEstimateHeight(estimatedHeightResult);
        const TOLERANCE = 3;
        if (
          estimatedHeightResult <= referenceHeightPixels + TOLERANCE &&
          estimatedHeightResult >= referenceHeightPixels - TOLERANCE
        ) {
          setMessage("Hãy đứng yên, hệ thống đang tính toán");
          // Đo các thông số nhìn từ trước cơ thể
          measureShoulder(person);
          measureNeck(person);
          measureShoulderToCrotch(person);
          measureTorsoPart(person);
          measureArm(person);
          measureLeg(person);
        } else if (estimatedHeightResult > referenceHeightPixels + TOLERANCE) {
          setMessage("Hãy lùi lại phía sau một chút!");
          audioStepBackward.play();
        } else if (estimatedHeightResult < referenceHeightPixels - TOLERANCE) {
          setMessage("Hãy tiến lên phía trước một chút!");
          audioStepUpward.play();
        }
      }
    }
  };

  const measuringHeight = (bodySegmentation) => {
    const maximumPoints = findMaximumPoints(bodySegmentation);
    const { highestPoint, lowestPoint } = maximumPoints;

    if (highestPoint && lowestPoint && lowestPoint.y !== 0) {
      drawLine(highestPoint, lowestPoint, "yellow");

      // Pixel distance between head and feet
      const heightInPixels = Math.sqrt(
        Math.pow(lowestPoint.x - highestPoint.x, 2) +
          Math.pow(lowestPoint.y - highestPoint.y, 2)
      );

      return heightInPixels;
    }

    return null;
  };

  const findMaximumPoints = (segmentation) => {
    const { width, height, data } = segmentation;

    let highestY = height;
    let highestX = null;
    let lowestY = 0;
    let lowestX = null;

    // Loop through the pixel data
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;

        // Check if this pixel is part of the person
        if (data[index] === 0 || data[index] === 1) {
          // 0 and 1 are left and right face
          // Non-zero values indicate body parts
          if (y < highestY) {
            highestY = y;
            highestX = x;
          }
        } else if (data[index] === 21 || data[index] === 23) {
          // 21 and 23 are ankles
          if (y > lowestY) {
            lowestY = y;
            lowestX = x;
          }
        }
      }
    }

    const canvasWidth = canvasRef.current?.width;
    const canvasHeight = canvasRef.current?.height;
    const highestPoint = {
      x: (highestX / width) * canvasWidth,
      y: (highestY / height) * canvasHeight,
    };
    const lowestPoint = {
      x: (lowestX / width) * canvasWidth,
      y: (lowestY / height) * canvasHeight,
    };

    // Return the highest point found
    return {
      highestPoint,
      lowestPoint,
    };
  };

  const measureShoulder = (segmentation) => {
    const { width, height, allPoses, data } = segmentation;

    // FIND BOUNDARY POINTS
    let boundarySet = new Set();

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const index = y * width + x;

        if (data[index] === 12) {
          boundarySet.add({ x, y });
          break;
        }
      }
    }
    const boundaryPoints = Array.from(boundarySet);

    // FIND 2 SHOULDER DEFINING POINTS
    const leftJoint = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "leftShoulder" && kp.score >= 0.5
    );
    const rightJoint = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "rightShoulder" && kp.score >= 0.5
    );
    const deltaY = leftJoint?.position.y - rightJoint?.position.y;
    const deltaX = leftJoint?.position.x - rightJoint?.position.x;
    const m = deltaX !== 0 ? deltaY / deltaX : Infinity; // Hệ số góc đoạn thẳng AB
    function definingLine(x, x0, y0) {
      return m !== Infinity ? (-1 / m) * (x - x0) + y0 : y0;
    }

    const centerOfJoints = {
      x: (leftJoint?.position.x + rightJoint?.position.x) / 2,
      y: (leftJoint?.position.y + rightJoint?.position.y) / 2,
    };

    let centerShoulder;
    const TOLERANCE = 5;
    let result = [];
    let shoulderLengthInCm = 0;

    boundaryPoints.filter(Boolean).forEach((p) => {
      if (p.x > centerOfJoints.x - 5 && p.x < centerOfJoints.x + 5) {
        const yWithCenterLine = definingLine(
          p.x,
          centerOfJoints.x,
          centerOfJoints.y
        );
        if (
          p.y >= Math.round(yWithCenterLine) - 10 &&
          p.y <= Math.round(yWithCenterLine) + 10
        ) {
          centerShoulder = p;
        }
      } else {
        const yWithLeftLine = definingLine(
          p.x,
          leftJoint?.position.x,
          leftJoint?.position.y
        );
        const yWithRightLine = definingLine(
          p.x,
          rightJoint?.position.x,
          rightJoint?.position.y
        );

        if (
          (p.y >= Math.round(yWithLeftLine) - TOLERANCE &&
            p.y <= Math.round(yWithLeftLine) + TOLERANCE) ||
          (p.y >= Math.round(yWithRightLine) - TOLERANCE &&
            p.y <= Math.round(yWithRightLine) + TOLERANCE)
        ) {
          result.push(p);
        }
      }
    });

    // Calculate to canvas proportion
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    const definingCanvasPoints = result.map((p) => ({
      x: (p?.x / width) * canvasWidth,
      y: (p?.y / height) * canvasHeight,
    }));
    const centerShoulderRelative = {
      x: (centerShoulder?.x / width) * canvasWidth,
      y: (centerShoulder?.y / height) * canvasHeight,
    };

    if (centerShoulderRelative && definingCanvasPoints.length === 2) {
      // drawPoint(centerShoulderRelative);
      // drawPoint(definingCanvasPoints[0]);
      // drawPoint(definingCanvasPoints[1]);
      drawLine(centerShoulder, definingCanvasPoints[0]);
      drawLine(centerShoulder, definingCanvasPoints[1]);

      const firstHalfShoulderLength = Math.sqrt(
        Math.pow(centerShoulderRelative.x - definingCanvasPoints[0].x, 2) +
          Math.pow(centerShoulderRelative.y - definingCanvasPoints[0].y, 2)
      );
      const lastHalfShoulderLength = Math.sqrt(
        Math.pow(centerShoulderRelative.x - definingCanvasPoints[1].x, 2) +
          Math.pow(centerShoulderRelative.y - definingCanvasPoints[1].y, 2)
      );
      const shoulderLengthInPixels =
        firstHalfShoulderLength + lastHalfShoulderLength;
      shoulderLengthInCm = shoulderLengthInPixels * scalingFactor + 20;
      setShoulderLength(shoulderLengthInCm);
    }

    return {
      centerShoulder: {
        x: (centerShoulder?.x / width) * canvasWidth,
        y: (centerShoulder?.y / height) * canvasHeight,
      },
      definingCanvasPoints,
      length: shoulderLengthInCm,
    };
  };

  const measureNeck = (segmentation) => {
    const { width, height, allPoses, data } = segmentation;
    let faceBoundarySet = new Set();
    let frontNeckRadius = null;

    for (let x = width; x > 0; x--) {
      for (let y = height; y > 0; y--) {
        const index = y * width + x;

        if (data[index] === 0 || data[index] === 1) {
          faceBoundarySet.add({ x, y });
          break;
        }
      }
    }
    const faceBoundaryPoints = Array.from(faceBoundarySet);

    const leftJoint = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "leftShoulder" && kp.score >= 0.5
    );
    const rightJoint = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "rightShoulder" && kp.score >= 0.5
    );
    const nosePoint = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "nose" && kp.score >= 0.5
    );

    const shoulderJointBreadth = Math.sqrt(
      Math.pow(leftJoint?.position.x - rightJoint?.position.x, 2) +
        Math.pow(leftJoint?.position.y - rightJoint?.position.y, 2)
    ); // b

    const noseToShoulder = Math.sqrt(
      Math.pow(nosePoint?.position.x - rightJoint?.position.x, 2) +
        Math.pow(nosePoint?.position.y - rightJoint?.position.y, 2)
    ); // a

    const TOLERANCE = 5;
    const centerOfShoulderX =
      (leftJoint?.position.x + rightJoint?.position.x) / 2;
    const chinPxPoint = faceBoundaryPoints.find(
      (p) =>
        p.x >= centerOfShoulderX - TOLERANCE &&
        p.x <= centerOfShoulderX + TOLERANCE
    );
    const noseToChin = Math.sqrt(
      Math.pow(nosePoint?.position.x - chinPxPoint?.x, 2) +
        Math.pow(nosePoint?.position.y - chinPxPoint?.y, 2)
    ); // c
    // drawPoint(chinPxPoint)

    frontNeckRadius =
      ((0.5 * (shoulderJointBreadth * noseToChin)) /
        Math.sqrt(
          Math.pow(noseToShoulder, 2) -
            Math.pow(0.5 * shoulderJointBreadth, 2)
        )) *
      0.7;
    
    setNeckFrontRadius(frontNeckRadius);
  };

  const measureShoulderToCrotch = (segmentation) => {
    const { width, height, allPoses, data } = segmentation;

    const leftShoulder = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "leftShoulder" && kp.score >= 0.5
    );
    const rightShoulder = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "rightShoulder" && kp.score >= 0.5
    );
    const leftHip = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "leftHip" && kp.score >= 0.5
    );
    const rightHip = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "rightHip" && kp.score >= 0.5
    );
    const centerShoulder = {
      x: (leftShoulder?.position.x + rightShoulder?.position.x) / 2,
      y: (leftShoulder?.position.y + rightShoulder?.position.y) / 2,
    };
    const centerHip = {
      x: (leftHip?.position.x + rightHip?.position.x) / 2,
      y: (leftHip?.position.y + rightHip?.position.y) / 2,
    };
    const shoulderToCrotchHeight = Math.sqrt(
      Math.pow(centerHip.x - centerShoulder.x, 2) +
        Math.pow(centerHip.y - centerShoulder.y, 2)
    );

    setShoulderToCrotchHeight(shoulderToCrotchHeight * scalingFactor);
  };

  const measureArm = (segmentation) => {
    const { width, height, allPoses, data } = segmentation;
    const rightShoulder = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "rightShoulder" && kp.score >= 0.5
    );
    const rightElbow = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "rightElbow" && kp.score >= 0.5
    );
    const rightWrist = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "rightWrist" && kp.score >= 0.5
    );
    const shoulderToElbow = Math.sqrt(
      Math.pow(rightShoulder?.position.x - rightElbow?.position.x, 2) +
      Math.pow(rightShoulder?.position.y - rightElbow?.position.y, 2)
    );
    const wristToElbow = Math.sqrt(
      Math.pow(rightWrist?.position.x - rightElbow?.position.x, 2) +
      Math.pow(rightWrist?.position.y - rightElbow?.position.y, 2)
    );

    const lengthInPx = shoulderToElbow + wristToElbow;
    setArmLength(lengthInPx * scalingFactor);
  };

  const measureLeg = (segmentation) => {
    const { width, height, allPoses, data } = segmentation;

    const rightKnee = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "rightKnee" && kp.score >= 0.5
    );
    const rightAnkle = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "rightAnkle" && kp.score >= 0.5
    );
    const rightHip = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "rightHip" && kp.score >= 0.5
    );

    const kneeToAnkle = Math.sqrt(
      Math.pow(rightKnee?.position.x - rightAnkle?.position.x, 2) +
      Math.pow(rightKnee?.position.y - rightAnkle?.position.y, 2)
    );
    const hipToAnkle = Math.sqrt(
      Math.pow(rightKnee?.position.x - rightHip?.position.x, 2) +
      Math.pow(rightKnee?.position.y - rightHip?.position.y, 2)
    );

    const lengthInPx = kneeToAnkle + hipToAnkle;
    setLegLength(lengthInPx * scalingFactor);
  };

  const measureTorsoPart = (segmentation) => {
    const { width, height, allPoses, data } = segmentation;

    const leftShoulder = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "leftShoulder" && kp.score >= 0.5
    );
    const rightShoulder = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "rightShoulder" && kp.score >= 0.5
    );
    const leftHip = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "leftHip" && kp.score >= 0.5
    );
    const rightHip = allPoses[0]?.keypoints.find(
      (kp) => kp.part === "rightHip" && kp.score >= 0.5
    );
    const centerShoulder = {
      x: (leftShoulder?.position.x + rightShoulder?.position.x) / 2,
      y: (leftShoulder?.position.y + rightShoulder?.position.y) / 2,
    }; // A
    const centerHip = {
      x: (leftHip?.position.x + rightHip?.position.x) / 2,
      y: (leftHip?.position.y + rightHip?.position.y) / 2,
    }; // B
    const centerChest = {
      x: (2 * centerShoulder.x + centerHip.x) / 3,
      y: (2 * centerShoulder.y + centerHip.y) / 3,
    }; // N
    const centerWaist = {
      x: (2 * centerHip.x + centerShoulder.x) / 3,
      y: (2 * centerHip.y + centerShoulder.y) / 3,
    }; // E

      const shoulderHipLineA =
        centerShoulder.x === centerHip.y
          ? 0
          : (centerShoulder.y - centerHip.y) / (centerShoulder.x - centerHip.x);
      const twoHipLineA =
        (leftHip?.position.y - rightHip?.position.y) /
        (leftHip?.position.x - rightHip?.position.x);
      const leftBoundaryPoints = [];
      const rightBoundaryPoints = [];

      for (let y = 0; y < height; y++) {
        let leftMost = null;
        let rightMost = null;

        for (let x = 0; x < width; x++) {
          const index = y * width + x;

          // Check if the pixel is part of torsoFront
          if (data[index] === 12) {
            // Set leftmost point for this row
            if (leftMost === null) {
              leftMost = { x, y };
            }
            // Continuously update rightmost point
            rightMost = { x, y };
          }
        }

        // Add found points to arrays
        if (leftMost) leftBoundaryPoints.push(leftMost);
        if (rightMost) rightBoundaryPoints.push(rightMost);
      }

      let leftBoundaryChest = null,
        rightBoundaryChest = null;
      let leftBoundaryWaist = null,
        rightBoundaryWaist = null;
      let leftBoundaryHip = null,
        rightBoundaryHip = null;

      leftBoundaryPoints.forEach((p) => {
        if (
          checkPointOfPerpendicularLine(
            shoulderHipLineA,
            centerChest.x,
            centerChest.y,
            p.x,
            p.y
          )
        ) {
          leftBoundaryChest = p;
          return;
        }

        if (
          checkPointOfPerpendicularLine(
            shoulderHipLineA,
            centerWaist.x,
            centerWaist.y,
            p.x,
            p.y
          )
        ) {
          leftBoundaryWaist = p;
          return;
        }

        if (
          checkPointInLine(
            twoHipLineA,
            leftHip?.position.x,
            leftHip?.position.y,
            p.x,
            p.y
          )
        ) {
          leftBoundaryHip = p;
          return;
        }
      });

      rightBoundaryPoints.forEach((p) => {
        if (
          checkPointOfPerpendicularLine(
            shoulderHipLineA,
            centerChest.x,
            centerChest.y,
            p.x,
            p.y
          )
        ) {
          rightBoundaryChest = p;
          return;
        }

        if (
          checkPointOfPerpendicularLine(
            shoulderHipLineA,
            centerWaist.x,
            centerWaist.y,
            p.x,
            p.y
          )
        ) {
          rightBoundaryWaist = p;
          return;
        }

        if (
          checkPointInLine(
            twoHipLineA,
            leftHip?.position.x,
            leftHip?.position.y,
            p.x,
            p.y
          )
        ) {
          rightBoundaryHip = p;
          return;
        }
      });

      const chestLength = Math.sqrt(
        Math.pow(leftBoundaryChest?.x - rightBoundaryChest?.x, 2) +
          Math.pow(leftBoundaryChest?.y - rightBoundaryChest?.y, 2)
      );

      const waistLength = Math.sqrt(
        Math.pow(leftBoundaryWaist?.x - rightBoundaryWaist?.x, 2) +
          Math.pow(leftBoundaryWaist?.y - rightBoundaryWaist?.y, 2)
      );

      const hipLength = Math.sqrt(
        Math.pow(leftBoundaryHip?.x - rightBoundaryHip?.x, 2) +
          Math.pow(leftBoundaryHip?.y - rightBoundaryHip?.y, 2)
      );
      setChestLength(chestLength);
      setWaistLength(waistLength);
      setHipLength(hipLength)

      if (leftBoundaryChest && rightBoundaryChest)
        drawLine(leftBoundaryChest, rightBoundaryChest);
      if (leftBoundaryWaist && rightBoundaryWaist)
        drawLine(leftBoundaryWaist, rightBoundaryWaist);
      if (leftBoundaryHip && rightBoundaryHip)
        drawLine(leftBoundaryHip, rightBoundaryHip);
  };

  // Tìm đường thẳng vuông góc
  function checkPointOfPerpendicularLine(aOfGivenLine, x0, y0, xM, yM) {
    const epsilon = 0.5;
    if (aOfGivenLine !== 0) {
      const b = y0 + (1 / aOfGivenLine) * x0;
      return Math.abs(yM - ((-1 / aOfGivenLine) * xM + b)) < epsilon;
    } else {
      return Math.abs(yM - y0) < epsilon;
    }
  }

  function checkPointInLine(a, x0, y0, xM, yM) {
    const epsilon = 0.5;
    const b = y0 - a * x0;
    return Math.abs(yM - (a * xM + b)) < epsilon;
  }

  const drawLine = (point1, point2, color = "green") => {
    const ctx = canvasRef.current?.getContext("2d");
    if (point1 && point2 && ctx) {
      ctx.beginPath();
      ctx.moveTo(point1.x, point1.y); // Start from the first point (nose)
      ctx.lineTo(point2.x, point2.y); // Draw to the second point (ankle)
      ctx.strokeStyle = color; // Line color
      ctx.lineWidth = 3; // Line thickness
      ctx.stroke();
    }
  };

  const drawPoint = (point, color = "green") => {
    const ctx = canvasRef.current?.getContext("2d");
    if (point && ctx) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  useEffect(() => {
    const runBodySegment = async () => {
      const net = await bodyPix.load();

      if (detectIntervalRef.current) {
        clearInterval(detectIntervalRef.current);
      }
  
      detectIntervalRef.current = setInterval(() => {
        detect(net);
      }, 100);
    };

    runBodySegment();

    return () => {

      if (webcamRef.current) {
        webcamRef.current.video.pause();
      }

      if (detectIntervalRef.current) {
        clearInterval(detectIntervalRef.current);
        detectIntervalRef.current = null;
      }
    };
  }, [stage]);

  useEffect(() => {
    if (
      shoulderLength &&
      neckFrontRadius &&
      shoulderToCrotchHeight &&
      chestLength &&
      waistLength &&
      hipLength
    ) {
      sessionStorage.setItem("shoulderLength", shoulderLength);
      sessionStorage.setItem("shoulderToCrotchHeight", shoulderToCrotchHeight);
      sessionStorage.setItem("neckFrontRadius", neckFrontRadius);
      sessionStorage.setItem("chestLength", chestLength);
      sessionStorage.setItem("waistLength", waistLength);
      sessionStorage.setItem("hipLength", hipLength);
      sessionStorage.setItem("armLength", armLength);
      sessionStorage.setItem("legLength", legLength);

      audioTurnRight.play();
      toNextStage();

      return () => {
        if (webcamRef.current) {
          webcamRef.current.video.pause();
        }
  
        if (detectIntervalRef.current) {
          clearInterval(detectIntervalRef.current);
        }
      };
    }
  }, [shoulderLength, shoulderToCrotchHeight, neckFrontRadius, chestLength, waistLength, hipLength, armLength, legLength]);

  return (
    <Box height={"100vh"} width={"100%"} position={"relative"}>
      <Box
        sx={{
          position: "absolute",
          top: "300px",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Webcam
          ref={webcamRef}
          mirrored={true}
          style={{
            width: 640,
            height: 480,
            border: "1px solid #1B2141",
            borderRadius: "8px",
          }}
        />
        <img
          src="../assets/img/body-model-1.png"
          height={`${referenceHeightPixels}px`}
          style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            objectFit: "contain",
            opacity: 0.5,
          }}
        />
        <Typography
          position={"absolute"}
          top={1}
          left={1}
          right={1}
          textAlign={"center"}
          fontSize={"20px"}
          bgcolor={"#f8f8f8"}
          sx={{
            borderRadius: "8px 8px 0 0",
            padding: "4px",
          }}
        >
          {message} {estimateHeight?.toFixed(1)}px/{referenceHeightPixels}px
        </Typography>
        <IconButton
          onClick={onClickPrev}
          sx={{
            position: "absolute",
            top: 1,
            left: "-50px",
            zIndex: 50
          }}
        >
          <ArrowBackIosRoundedIcon />
        </IconButton>
      </Box>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: "300px",
          left: "50%",
          transform: "translate(-50%, -50%) scaleX(-1)",
          textAlign: "center",
          width: 640,
          height: 480,
        }}
      />
      <audio>
        <source src="../assets/audio/step-backward.mp3"/>
      </audio>
      <audio>
        <source src="../assets/audio/step-backward.mp3"/>
      </audio>
    </Box>
  );
};

export default MeasureFront;
