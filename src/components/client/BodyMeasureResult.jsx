import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { colors } from "../../services/const"
import { useNavigate } from 'react-router-dom'

const BodyMeasureResult = ({ scalingFactor, restartStages }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    neck: 0,
    shoulder: 0,
    shoulderToCrotch: 0,
    chest: 0,
    waist: 0,
    hip: 0,
    arm: 0,
    leg: 0
  });
  const [isFinished, setIsFinished] = useState(false);
  const rows = [
    {
        id: "neck",
        name: "Vòng cổ",
        value: data["neck"]
    },
    {
        id: "shoulder",
        name: "Dài vai",
        value: data["shoulder"]
    },
    {
        id: "shoulderToCrotch",
        name: "Dài lưng",
        value: data["shoulderToCrotch"]
    },
    {
        id: "chest",
        name: "Vòng ngực (±5)",
        value: data["chest"]
    },
    {
        id: "waist",
        name: "Vòng eo (±5)",
        value: data["waist"]
    },
    {
        id: "hip",
        name: "Vòng hông (±5)",
        value: data["hip"]
    },
    {
        id: "arm",
        name: "Dài tay",
        value: data["arm"]
    },
    {
        id: "leg",
        name: "Dài chân",
        value: data["leg"]
    },
  ];

  const calculateEllipsePerimeter = (r1, r2) => {
    const p1 = Math.PI * Math.sqrt(2 * (r1**2 + r2**2));
    const p2 = Math.PI * (3 / 2 * (r1 + r2) - Math.sqrt(r1 * r2));

    // Lấy trung bình 2 phép tính chu vi elip -> Chính xác hơn
    return (p1 + p2) / 2;
  }

  useEffect(() => {
    const shoulderLength = JSON.parse(sessionStorage.getItem("shoulderLength"));
    const shoulderToCrotchHeight = JSON.parse(sessionStorage.getItem("shoulderToCrotchHeight"));
    const neckFrontRadius = JSON.parse(sessionStorage.getItem("neckFrontRadius"));
    const neckBackRadius = JSON.parse(sessionStorage.getItem("neckBackRadius"));
    const chestLength = JSON.parse(sessionStorage.getItem("chestLength"));
    const chestFrontBreadth = JSON.parse(sessionStorage.getItem("chestFrontBreadth"));
    const chestBackBreadth = JSON.parse(sessionStorage.getItem("chestBackBreadth"));
    const hipLength = JSON.parse(sessionStorage.getItem("hipLength"));
    const hipFrontBreadth = JSON.parse(sessionStorage.getItem("hipFrontBreadth"));
    const hipBackBreadth = JSON.parse(sessionStorage.getItem("hipBackBreadth"));
    const waistLength = JSON.parse(sessionStorage.getItem("waistLength"));
    const waistFrontBreadth = JSON.parse(sessionStorage.getItem("waistFrontBreadth"));
    const waistBackBreadth = JSON.parse(sessionStorage.getItem("waistBackBreadth"));
    const armLength = JSON.parse(sessionStorage.getItem("armLength"));
    const legLength = JSON.parse(sessionStorage.getItem("legLength"));

    const neckPerimeter =
      calculateEllipsePerimeter(neckFrontRadius, neckBackRadius) *
      scalingFactor;
    const chestCircumference =
      (calculateEllipsePerimeter(chestLength / 2, chestFrontBreadth) / 2 +
        calculateEllipsePerimeter(chestLength / 2, chestBackBreadth) / 2) *
      scalingFactor;
    const hipCircumference =
      (calculateEllipsePerimeter(hipLength / 2, hipFrontBreadth) / 2 +
        calculateEllipsePerimeter(hipLength / 2, hipBackBreadth) / 2) *
      scalingFactor;
    const waistCircumference =
      (calculateEllipsePerimeter(waistLength / 2, waistFrontBreadth) / 2 +
        calculateEllipsePerimeter(waistLength / 2, waistBackBreadth) / 2) *
      scalingFactor;

    const TOLERANCE = 10 * scalingFactor;

    setData({
      shoulder: shoulderLength.toFixed(1),
      shoulderToCrotch: shoulderToCrotchHeight.toFixed(1),
      neck: (neckPerimeter - TOLERANCE).toFixed(1),
      chest: (chestCircumference - TOLERANCE).toFixed(1),
      waist: (waistCircumference - TOLERANCE).toFixed(1),
      hip: (hipCircumference - TOLERANCE).toFixed(1),
      arm: armLength.toFixed(1),
      leg: legLength.toFixed(1)
    });
    setIsFinished(true)
  }, []);

  useEffect(() => {
    if (isFinished) {
      localStorage.setItem("bodyData", JSON.stringify(data));
      sessionStorage.removeItem("shoulderLength");
      sessionStorage.removeItem("shoulderToCrotchHeight");
      sessionStorage.removeItem("neckFrontRadius");
      sessionStorage.removeItem("neckBackRadius");
      sessionStorage.removeItem("chestLength");
      sessionStorage.removeItem("chestFrontBreadth");
      sessionStorage.removeItem("chestBackBreadth");
      sessionStorage.removeItem("hipLength");
      sessionStorage.removeItem("hipFrontBreadth");
      sessionStorage.removeItem("hipBackBreadth");
      sessionStorage.removeItem("waistLength");
      sessionStorage.removeItem("waistFrontBreadth");
      sessionStorage.removeItem("waistBackBreadth");
      sessionStorage.removeItem("armLength");
      sessionStorage.removeItem("legLength");
    }
  }, [isFinished, data])

  return (
    <Box height={"100vh"} width={"100%"} position={"relative"}>
      <Stack
        alignItems={"center"}
        sx={{
          position: "absolute",
          top: "40px",
          left: "50%",
          transform: "translate(-50%)",
          width: 628,
          minHeight: 468,
          border: "1px solid #1B2141",
          borderRadius: "8px",
          bgcolor: "#1B2141ea",
          padding: "12px",
        }}
      >
        <Typography
          sx={{
            color: "white",
            textAlign: "center",
            fontSize: "18px",
            marginTop: "10%",
          }}
        >
          Đây là kết quả về thông số của các vị trí trên cơ thể bạn:
        </Typography>
        <TableContainer
          sx={{ marginTop: "20px", width: "60%" }}
          component={Paper}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Vị trí</TableCell>
                <TableCell align="center">Số đo (cm)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {row.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            width: "50%",
            marginTop: "16px",
            bgcolor: colors.red,
            ":hover": {
              bgcolor: "#ed6161",
            },
          }}
        >
          Trở lại trang mua sắm
        </Button>
        <Button
          variant="contained"
          onClick={restartStages}
          sx={{
            width: "50%",
            marginTop: "16px",
            bgcolor: colors.yellow,
            ":hover": {
              bgcolor: "#FFBD44",
            },
          }}
        >
          Đo lại
        </Button>
      </Stack>
    </Box>
  );
}

export default BodyMeasureResult;