import React, { useEffect, useRef, useState } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";

const MeasureSide = ({
  onClickPrev,
  toNextStage,
  referenceHeightPixels,
  stage,
}) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [estimateHeight, setEstimateHeight] = useState(0);
  const [message, setMessage] = useState("Hãy quay sang phải để tiếp tục đo");
  const [neckBackRadius, setNeckBackRadius] = useState(0); // PX
  const [chest, setChest] = useState({
    frontBreadth: 0, // Độ rộng ngực tính từ giữa đến phần trước của cơ thể khi đứng ngang cam
    backBreadth: 0, // Độ rộng ngực tính từ giữa đến phần sau của cơ thể khi đứng ngang cam
  }); // Ngực PX
  const [waist, setWaist] = useState({
    frontBreadth: 0,
    backBreadth: 0,
  }); // Eo PX
  const [hip, setHip] = useState({
    frontBreadth: 0,
    backBreadth: 0,
  }); // Hông PX
  const detectIntervalRef = useRef(null);
  const audioStepLeft = new Audio("../assets/audio/step-to-left.mp3");
  const audioStepRight= new Audio("../assets/audio/step-to-right.mp3");
  const audioFinished= new Audio("../assets/audio/finished.mp3");

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
          // Đo các thông số nhìn từ side của cơ thể
          measureNeck(person);
          measureTorsoPart(person);
        } else if (estimatedHeightResult > referenceHeightPixels + TOLERANCE) {
          setMessage("Hãy lùi lại phía sau một chút!");
          audioStepRight.play();
        } else if (estimatedHeightResult < referenceHeightPixels - TOLERANCE) {
          setMessage("Hãy tiến lên phía trước một chút!");
          audioStepLeft.play();
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
        if (data[index] === 0) {
          // 0 is left face
          // Non-zero values indicate body parts
          if (y < highestY) {
            highestY = y;
            highestX = x;
          }
        } else if (data[index] === 21) {
          // 21 is left foot
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

  const measureNeck = (segmentation) => {
    const { width, height, allPoses, data } = segmentation;
    let faceBoundarySet = new Set();
    let backNeckRadius = null;

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

    let frontMostPoint = null;
    let backMostPoint = null;
    const torsoFrontID = 12;
    const torsoBackID = 13;

    faceBoundaryPoints.forEach((point) => {
      const { x, y } = point;
      const index = y * width + x;

      if (data[index + width] === torsoFrontID) {
        if (!frontMostPoint || x < frontMostPoint.x) {
          frontMostPoint = { x, y };
        }
      }

      if (data[index + width] === torsoBackID) {
        if (!backMostPoint || x > backMostPoint.x) {
          backMostPoint = { x, y };
        }
      }
    });

    if (frontMostPoint && backMostPoint) {
      backNeckRadius =
        Math.sqrt(
          Math.pow(frontMostPoint.x - backMostPoint.x, 2) +
            Math.pow(frontMostPoint.y - backMostPoint.y, 2)
        ) * 0.5;

      setNeckBackRadius(backNeckRadius);
      drawLine(frontMostPoint, backMostPoint);
    }
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

    const sideChestMiddle = {
      x: (2 * leftShoulder?.position.x + leftHip?.position.x) / 3,
      y: (2 * leftShoulder?.position.y + leftHip?.position.y) / 3,
    };

    const sideWaistMiddle = {
      x: (2 * leftHip?.position.x + leftShoulder?.position.x) / 3,
      y: (2 * leftHip?.position.y + leftShoulder?.position.y) / 3,
    };

    const frontBoundaryPoints = [];
    const backBoundaryPoints = [];

    for (let y = 0; y < height; y++) {
      let frontMost = null;
      let backMost = null;

      for (let x = 0; x < width; x++) {
        const index = y * width + x;

        if (data[index] === 12 || data[index] === 13) {
          if (frontMost === null) {
            frontMost = { x, y };
          }
          backMost = { x, y };
        }
      }

      // Add found points to arrays
      if (frontMost) frontBoundaryPoints.push(frontMost);
      if (backMost) backBoundaryPoints.push(backMost);
    }

    let frontBoundaryChest = null,
      backBoundaryChest = null;
    let frontBoundaryWaist = null,
      backBoundaryWaist = null;
    let frontBoundaryHip = null,
      backBoundaryHip = null;

    const shoulderHipLineA =
      leftShoulder?.x === leftHip?.y
        ? 0
        : (leftShoulder?.y - leftHip?.y) / (leftShoulder?.x - leftHip?.x);

    frontBoundaryPoints.forEach((p) => {
      if (
        checkPointOfPerpendicularLine(
          shoulderHipLineA,
          sideChestMiddle.x,
          sideChestMiddle.y,
          p.x,
          p.y
        )
      ) {
        frontBoundaryChest = p;
        return;
      }

      if (
        checkPointOfPerpendicularLine(
          shoulderHipLineA,
          sideWaistMiddle.x,
          sideWaistMiddle.y,
          p.x,
          p.y
        )
      ) {
        frontBoundaryWaist = p;
        return;
      }

      if (
        checkPointOfPerpendicularLine(
          shoulderHipLineA,
          leftHip?.position.x,
          leftHip?.position.y,
          p.x,
          p.y
        )
      ) {
        frontBoundaryHip = p;
        return;
      }
    });

    backBoundaryPoints.forEach((p) => {
      if (
        checkPointOfPerpendicularLine(
          shoulderHipLineA,
          sideChestMiddle.x,
          sideChestMiddle.y,
          p.x,
          p.y
        )
      ) {
        backBoundaryChest = p;
        return;
      }

      if (
        checkPointOfPerpendicularLine(
          shoulderHipLineA,
          sideWaistMiddle.x,
          sideWaistMiddle.y,
          p.x,
          p.y
        )
      ) {
        backBoundaryWaist = p;
        return;
      }

      if (
        checkPointOfPerpendicularLine(
          shoulderHipLineA,
          leftHip?.position.x,
          leftHip?.position.y,
          p.x,
          p.y
        )
      ) {
        backBoundaryHip = p;
        return;
      }
    });

    const frontChestBreadth = Math.sqrt(
      Math.pow(frontBoundaryChest?.x - sideChestMiddle?.x, 2) +
        Math.pow(frontBoundaryChest?.y - sideChestMiddle?.y, 2)
    );
    const backChestBreadth = Math.sqrt(
      Math.pow(backBoundaryChest?.x - sideChestMiddle?.x, 2) +
        Math.pow(backBoundaryChest?.y - sideChestMiddle?.y, 2)
    );
    const frontWaistBreadth = Math.sqrt(
      Math.pow(frontBoundaryWaist?.x - sideWaistMiddle?.x, 2) +
        Math.pow(frontBoundaryWaist?.y - sideWaistMiddle?.y, 2)
    );
    const backWaistBreadth = Math.sqrt(
      Math.pow(backBoundaryWaist?.x - sideWaistMiddle?.x, 2) +
        Math.pow(backBoundaryWaist?.y - sideWaistMiddle?.y, 2)
    );
    const frontHipBreadth = Math.sqrt(
      Math.pow(frontBoundaryHip?.x - leftHip?.position.x, 2) +
        Math.pow(frontBoundaryHip?.y - leftHip?.position.y, 2)
    );
    const backHipBreadth = Math.sqrt(
      Math.pow(backBoundaryHip?.x - leftHip?.position.x, 2) +
        Math.pow(backBoundaryHip?.y - leftHip?.position.y, 2)
    );

    setChest({
      frontBreadth: frontChestBreadth,
      backBreadth: backChestBreadth,
    });
    setWaist({
      frontBreadth: frontWaistBreadth,
      backBreadth: backWaistBreadth,
    });
    setHip({
      frontBreadth: frontHipBreadth,
      backBreadth: backHipBreadth,
    });

    if (frontBoundaryChest && backBoundaryChest)
      drawLine(frontBoundaryChest, backBoundaryChest);
    if (frontBoundaryWaist && backBoundaryWaist)
      drawLine(frontBoundaryWaist, backBoundaryWaist);
    if (frontBoundaryHip && backBoundaryHip)
      drawLine(frontBoundaryHip, backBoundaryHip);
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

    const timeout = setTimeout(() => {
        runBodySegment();
    }, 3000)

    return () => {
      if (webcamRef.current) {
        webcamRef.current.video.pause();
      }

      if (detectIntervalRef.current) {
        clearInterval(detectIntervalRef.current);
        detectIntervalRef.current = null;
      }

      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [stage]);

  useEffect(() => {
    if (
      neckBackRadius &&
      chest.backBreadth && chest.frontBreadth &&
      hip.backBreadth && hip.frontBreadth &&
      waist.backBreadth && waist.frontBreadth
    ) {
      sessionStorage.setItem("neckBackRadius", neckBackRadius);
      sessionStorage.setItem("chestFrontBreadth", chest.frontBreadth);
      sessionStorage.setItem("chestBackBreadth", chest.backBreadth);
      sessionStorage.setItem("hipFrontBreadth", hip.frontBreadth);
      sessionStorage.setItem("hipBackBreadth", hip.backBreadth);
      sessionStorage.setItem("waistFrontBreadth", waist.frontBreadth);
      sessionStorage.setItem("waistBackBreadth", waist.backBreadth);
      
      audioFinished.play();
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
  }, [neckBackRadius, chest, hip, waist]);

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
          src="../assets/img/body-model-side.png"
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
            zIndex: 50,
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
    </Box>
  );
};

export default MeasureSide;
