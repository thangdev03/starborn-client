import { Box, ButtonGroup, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { colors } from "../../services/const";

const ImageSlider = ({ imageUrls = [], height = "60vh", showText = false }) => {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (imageIndex < imageUrls.length - 1) {
        setImageIndex((prev) => prev + 1);
      } else {
        setImageIndex(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [imageIndex]);

  return (
    <Box sx={{ width: "100%", height: height, position: "relative" }}>
      <Stack
        direction={"row"}
        sx={{ width: "100%", height: "100%", overflow: "hidden" }}
      >
        {imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt="collection"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              flexShrink: 0,
              flexGrow: 0,
              translate: `${-100 * imageIndex}%`,
              transition: "translate 300ms ease-in-out",
            }}
          />
        ))}
      </Stack>
      <ButtonGroup
        sx={{
          gap: "8px",
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {imageUrls.map((_, index) => (
          <IconButton
            key={index}
            onClick={() => setImageIndex(index)}
            sx={{
              bgcolor: imageIndex === index ? colors.red : "#D9D9D9",
              border:
                imageIndex === index ? "2px solid white" : "2px solid #D9D9D9",
              padding: "7px",
              flexGrow: 0,
              "&:hover": {
                bgcolor: imageIndex === index ? colors.red : "#D9D9D9",
              },
            }}
          />
        ))}
      </ButtonGroup>

      {showText && (
        <Typography 
          sx={{
              display: { xs: "none", sm: "block" },
              position: "absolute",
              top: "40%",
              left: "50%",
              translate: "-50% -50%",
              color: "white",
              fontSize: { xs: "20px", md: "32px" },
              textShadow: `1px 0 6px ${colors.primaryColor},0 1px 6px ${colors.primaryColor},-1px 0 6px ${colors.primaryColor},0 -1px 6px ${colors.primaryColor}`
          }}
        >
          STARBORN - CỬA HÀNG THỜI TRANG SỐ 1 VIỆT NAM
        </Typography>
      )}
    </Box>
  );
};

export default ImageSlider;
