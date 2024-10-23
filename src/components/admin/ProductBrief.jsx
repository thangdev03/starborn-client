import React from 'react'
import { Stack, Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const ProductBrief = ({ imageUrl, name, price, totalSales, revenue, descAlt, href }) => {
  const navigate = useNavigate();
  return (
    <Stack
      onClick={() => navigate(href)}
      direction={"row"}
      justifyContent={"space-between"}
      sx={{ 
        cursor: "pointer", 
        "&:hover": { 
            bgcolor: "#f6f6f6" 
        } 
      }}
    >
      <Stack direction={"row"}>
        <Box
          width={{ xs: "48px", md: "56px" }}
          height={{ xs: "48px", md: "56px" }}
          borderRadius={"8px"}
          overflow={"hidden"}
          flexShrink={0}
        >
          <img
            src={imageUrl}
            alt={descAlt}
            width={"100%"}
            height={"100%"}
            style={{ objectFit: "cover", objectPosition: "50% 50%" }}
          />
        </Box>
        <Stack
          direction={"column"}
          marginLeft={"12px"}
          justifyContent={"space-between"}
        >
          <Typography
            fontSize={"12px"}
            whiteSpace={"nowrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
            maxWidth={{ xs: "100px", md: "180px" }}
          >
            {name}
          </Typography>
          <Typography fontSize={"12px"} sx={{ opacity: 0.8 }}>
            {price}
            <span style={{ textDecoration: "underline" }}>đ</span>
          </Typography>
        </Stack>
      </Stack>
      <Stack
        direction={"column"}
        marginLeft={"12px"}
        justifyContent={"space-between"}
        alignItems={"end"}
      >
        <Typography fontSize={{ md: "16px" }} fontWeight={500}>
          {revenue}
        </Typography>
        <Typography fontSize={"12px"} sx={{ opacity: 0.8 }}>
          {totalSales} lượt mua
        </Typography>
      </Stack>
    </Stack>
  );
}

export default ProductBrief