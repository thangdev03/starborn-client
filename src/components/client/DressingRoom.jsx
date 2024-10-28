import React, { useEffect, useRef, useState } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";
// import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";
import { Box, Typography } from "@mui/material";

const DressingRoom = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [referenceHeightCentimeters, setReferenceHeightCentimeters] = useState(175);
  const referenceHeightPixels = 390;
  const [estimateHeight, setEstimateHeight] = useState(0);
  const [shoulderLength, setShoulderLength] = useState(0);
  const [isCorrectPosition, setIsCorrectPosition] = useState(false);
  const [checkedFront, setCheckedMeasureFront] = useState(false);
  const [checkedSide, setCheckedSide] = useState(false);
  const [message, setMessage] = useState("Hãy đứng vào vị trí như trong hình");
  const [scalingFactor, setScalingFactor] = useState(referenceHeightCentimeters / referenceHeightPixels);
  const [neckCircumference, setNeckCircumference] = useState(0);
  const [shoulderToCrotchHeight, setShoulderToCrotchHeight] = useState(0);

  const runBodySegment = async () => {
    const net = await bodyPix.load();

    console.log("BODY PIX LOADED");
    const detectInterval = setInterval(() => {
      detect(net);
    }, 100);

    return () => clearInterval(detectInterval);
  };

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
        flipHorizontal: false,
        internalResolution: 'medium', // or 'low', 'high', etc.
        segmentationThreshold: 0.7, // Threshold for segmentation
        outputStride: 16 // or 32, depending on your needs
      };
      const person = await net.segmentPersonParts(video, options);
      // console.log(person);
      const coloredPartImage = bodyPix.toColoredPartMask(person);
      const opacity = 0.7;
      const flipHorizontal = false;
      const maskBlurAmount = 0;
      const canvas = canvasRef.current;

      // bodyPix.drawPixelatedMask(
      //   canvas,
      //   video,
      //   coloredPartImage,
      //   opacity,
      //   maskBlurAmount,
      //   flipHorizontal
      // );

      const estimatedHeightResult = measuringHeight(person);

      if (estimatedHeightResult) {
        setEstimateHeight(estimatedHeightResult);
        if (estimatedHeightResult <= referenceHeightPixels + 5 && estimatedHeightResult >= referenceHeightPixels - 5) {
          setMessage("Hãy đứng yên, hệ thống đang tính toán");
          if (!checkedFront) {
            // Đo các thông số nhìn từ trước cơ thể
            if (!shoulderLength) {
              const shoulderData = measureShoulder(person);
              if (shoulderData.length) {
                setShoulderLength(shoulderData.length);
              }
            }

            if (!neckCircumference) {
              const neckData = measureNeck(person);
              if (neckData.circumference) {
                setNeckCircumference(neckData.circumference);
              }
            }

            if (!shoulderToCrotchHeight) {
              const shoulderToCrotchData = measureShoulderToCrotch(person);
              if (shoulderToCrotchData.height) {
                setShoulderToCrotchHeight(shoulderToCrotchData.height);
              }
            }

          } else {
            if (!checkedSide) {
              // Đo các thông số nhìn từ phía ngang cơ thể

            } else {
              // Hoàn tất, dừng vòng lặp

            }
          }
        } else if (estimatedHeightResult > referenceHeightPixels + 5) {
          // Lùi lại
          setMessage("Hãy lùi lại phía sau một chút!");
        } else if (estimatedHeightResult < referenceHeightPixels - 5) {
          // Tiến lên
          setMessage("Hãy tiến lên phía trước một chút!");
        }
      }
    }
  };

  useEffect(() => {
    runBodySegment();

    return () => {
      if (webcamRef.current) {
        webcamRef.current.video.pause();
      }
    };
  }, []);

  const measuringHeight = (bodySegmentation) => {
    const maximumPoints = findMaximumPoints(bodySegmentation);
    const { highestPoint, lowestPoint } = maximumPoints;
    
    if (highestPoint && lowestPoint && lowestPoint.y !== 0) {
      drawLine(
        highestPoint,
        lowestPoint,
        "yellow"
      );

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
        if (data[index] === 0 || data[index] === 1) { // 0 and 1 are left and right face
          // Non-zero values indicate body parts
          if (y < highestY) {
            highestY = y;
            highestX = x;
          }
        } else if (data[index] === 21 || data[index] === 23) { // 21 and 23 are ankles
          if (y > lowestY) {
            lowestY = y;
            lowestX = x;
          }
        }
      }
    }

    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    const highestPoint = { 
        x: (highestX / width) * canvasWidth, 
        y: (highestY / height) * canvasHeight 
    };
    const lowestPoint = { 
        x: (lowestX / width) * canvasWidth, 
        y: (lowestY / height) * canvasHeight 
    };

    // Return the highest point found
    return { 
      highestPoint, 
      lowestPoint
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
      (kp) => (kp.part === "leftShoulder") && kp.score >= 0.5
    );
    const rightJoint = allPoses[0]?.keypoints.find(
      (kp) => (kp.part === "rightShoulder") && kp.score >= 0.5
    );
    const deltaY = (leftJoint?.position.y) - (rightJoint?.position.y);
    const deltaX = (leftJoint?.position.x) - (rightJoint?.position.x);
    const m = deltaX !== 0 ? deltaY / deltaX : Infinity; // Hệ số góc đoạn thẳng AB
    function definingLine (x, x0, y0) {
      return m !== Infinity ? (-1 / m * (x - x0) + y0) : y0;
    }

    const centerOfJoints = {
      x: ((leftJoint?.position.x) + (rightJoint?.position.x)) / 2,
      y: ((leftJoint?.position.y) + (rightJoint?.position.y)) / 2,
    }

    let centerShoulder;
    const TOLERANCE = 5;
    let result = [];
    let shoulderLengthInCm = 0;

    boundaryPoints.filter(Boolean).forEach((p) => {
      if (p.x > centerOfJoints.x - 5 && p.x < centerOfJoints.x + 5) {
        const yWithCenterLine = definingLine(p.x, centerOfJoints.x, centerOfJoints.y);
        if (p.y >= Math.round(yWithCenterLine) - 10 && p.y <= Math.round(yWithCenterLine) + 10) {
          centerShoulder = p;
        }
      } else {
        const yWithLeftLine = definingLine(p.x, leftJoint?.position.x, leftJoint?.position.y);
        const yWithRightLine = definingLine(p.x, rightJoint?.position.x, rightJoint?.position.y);

        if (
          ((p.y >= Math.round(yWithLeftLine) - TOLERANCE) && (p.y <= Math.round(yWithLeftLine) + TOLERANCE)) || 
          ((p.y >= Math.round(yWithRightLine) - TOLERANCE) && (p.y <= Math.round(yWithRightLine) + TOLERANCE))
        ) {
            result.push(p);
          }
      }
    });

    // Calculate to canvas proportion
    const canvasWidth = canvasRef.current.width;
    const canvasHeight = canvasRef.current.height;
    const definingCanvasPoints = result.map(p => ({
      x: (p?.x / width) * canvasWidth,
      y: (p?.y / height) * canvasHeight, 
    }))
    const centerShoulderRelative = {
      x: (centerShoulder?.x / width) * canvasWidth,
      y: (centerShoulder?.y / height) * canvasHeight
    }

    if (centerShoulderRelative && definingCanvasPoints.length === 2) {
      drawPoint(centerShoulderRelative);
      drawPoint(definingCanvasPoints[0]);
      drawPoint(definingCanvasPoints[1]);
      const firstHalfShoulderLength = Math.sqrt(
        Math.pow(centerShoulderRelative.x - definingCanvasPoints[0].x, 2) +
        Math.pow(centerShoulderRelative.y - definingCanvasPoints[0].y, 2)
      );
      const lastHalfShoulderLength = Math.sqrt(
        Math.pow(centerShoulderRelative.x - definingCanvasPoints[1].x, 2) +
        Math.pow(centerShoulderRelative.y - definingCanvasPoints[1].y, 2)
      );
      const shoulderLengthInPixels = firstHalfShoulderLength + lastHalfShoulderLength;
      shoulderLengthInCm = shoulderLengthInPixels * scalingFactor + 10;
    }

    return {
      centerShoulder: {
        x: (centerShoulder?.x / width) * canvasWidth,
        y: (centerShoulder?.y / height) * canvasHeight
      },
      definingCanvasPoints,
      length: shoulderLengthInCm
    };
  };

  const measureNeck = (segmentation) => {
    const { width, height, allPoses, data } = segmentation;
    let faceBoundarySet = new Set();

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
      (kp) => (kp.part === "leftShoulder") && kp.score >= 0.5
    );
    const rightJoint = allPoses[0]?.keypoints.find(
      (kp) => (kp.part === "rightShoulder") && kp.score >= 0.5
    );
    const nosePoint = allPoses[0]?.keypoints.find(
      (kp) => (kp.part === "nose") && kp.score >= 0.5
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
    const centerOfShoulderX = (leftJoint?.position.x + rightJoint?.position.x) / 2;
    const chinPxPoint = faceBoundaryPoints.find(p => (p.x >= centerOfShoulderX - TOLERANCE) && (p.x <= centerOfShoulderX + TOLERANCE));
    const noseToChin = Math.sqrt(
      Math.pow(nosePoint?.position.x - chinPxPoint?.x, 2) +
      Math.pow(nosePoint?.position.y - chinPxPoint?.y, 2)
    ); // c
    drawPoint(chinPxPoint)

    const neckRadius = 0.5 * (shoulderJointBreadth * noseToChin) / Math.sqrt(Math.pow(noseToShoulder, 2) - Math.pow(0.5 * shoulderJointBreadth, 2)) * 0.7;
    console.log({neckRadius: neckRadius * scalingFactor})

    const neckCircumference = 2 * Math.PI * neckRadius * scalingFactor;
    console.log({neckCircumference});
    
    return {circumference: neckCircumference};
  };

  const measureShoulderToCrotch = (segmentation) => {
    const { width, height, allPoses, data } = segmentation;

    const leftShoulder = allPoses[0]?.keypoints.find(
      (kp) => (kp.part === "leftShoulder") && kp.score >= 0.5
    );
    const rightShoulder = allPoses[0]?.keypoints.find(
      (kp) => (kp.part === "rightShoulder") && kp.score >= 0.5
    );
    const leftHip = allPoses[0]?.keypoints.find(
      (kp) => (kp.part === "leftHip") && kp.score >= 0.5
    );
    const rightHip = allPoses[0]?.keypoints.find(
      (kp) => (kp.part === "rightHip") && kp.score >= 0.5
    );
    const centerShoulder = {
      x: leftShoulder?.position.x + rightShoulder?.position.x,
      y: leftShoulder?.position.y + rightShoulder?.position.y
    };
    const centerHip = {
      x: leftHip?.position.x + rightHip?.position.x,
      y: leftHip?.position.y + rightHip?.position.y
    };
    const shoulderToCrotchHeight = Math.sqrt(
      Math.pow(centerHip.x - centerShoulder.x, 2) +
      Math.pow(centerHip.y - centerShoulder.y, 2)
    ) * scalingFactor;

    return {height: shoulderToCrotchHeight}
  }

  const drawLine = (point1, point2, color = "green") => {
    const ctx = canvasRef.current.getContext("2d");
    if (point1 && point2) {
      ctx.beginPath();
      ctx.moveTo(point1.x, point1.y); // Start from the first point (nose)
      ctx.lineTo(point2.x, point2.y); // Draw to the second point (ankle)
      ctx.strokeStyle = color; // Line color
      ctx.lineWidth = 3; // Line thickness
      ctx.stroke();
    }
  };

  const drawPoint = (point, color = "green") => {
    const ctx = canvasRef.current.getContext("2d");
    if (point) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // useEffect(() => {
  //   setScalingFactor(referenceHeightCentimeters / referenceHeightPixels);
  // }, [referenceHeightCentimeters])

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
          bottom={"-40px"}
          left={"50%"}
          textAlign={"center"}
          fontSize={"24px"}
          sx={{
            transform: "translateX(-50%)",
            textWrap: "nowrap"
          }}
        >
          {message} {estimateHeight?.toFixed(1)}px/{referenceHeightPixels}px
        </Typography>
        <Typography
          position={"absolute"}
          top={1}
          left={1}
          right={1}
          textAlign={"center"}
          fontSize={"16px"}
          bgcolor={"#f8f8f8"}
          sx={{
            borderRadius: "8px 8px 0 0",
            padding: "4px"
          }}
        >
          Shoulder: {shoulderLength?.toFixed(1)} cm, Neck: {neckCircumference?.toFixed(1)} cm, Shoulder to crotch: {shoulderToCrotchHeight?.toFixed(1)} cm
        </Typography>
      </Box>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: "300px",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: 640,
          height: 480,
        }}
      />
    </Box>
  );
};

export default DressingRoom;
