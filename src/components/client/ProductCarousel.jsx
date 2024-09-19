import { Box, IconButton, Rating, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import ProductGridItem from "./ProductGridItem";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import ArrowCircleRightRoundedIcon from "@mui/icons-material/ArrowCircleRightRounded";
import { formatVNDCurrency, getPriceAfterDiscount } from "../../utils/currencyUtils";
import { colors } from "../../services/const";

const ProductCarousel = ({ products }) => {
  const [startIndex, setStartIndex] = useState(0);

  return (
    <Box>
      <Stack direction={"row"} gap={"16px"} width={"100%"} overflow={"hidden"}>
        {products.map((product, index) => (
          <Box
          sx={{
            width: {
              xs: "140px",
              sm: "200px",
              lg: "320px"
            },
            translate: `${-100 * startIndex }%`
          }}
          >
            <Box
              sx={{
                height: {
                  xs: "220px",
                  sm: "280px",
                  md: "320px",
                  lg: "360px",
                  xl: "400px",
                },
                borderRadius: "4px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={product.imageSrc}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <Typography
                sx={{
                  position: "absolute",
                  top: "2%",
                  left: "2%",
                  padding: "8px 12px",
                  bgcolor: colors.red,
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                {product.discount > 0 && `-${product.discount}%`}
              </Typography>
              <IconButton
                sx={{
                  position: "absolute",
                  top: "2%",
                  right: "2%",
                  bgcolor: "white",
                  "&:hover": {
                    bgcolor: "whitesmoke",
                  },
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.25 5C19.6688 5 17.4088 6.11 16 7.98625C14.5912 6.11 12.3313 5 9.75 5C7.69528 5.00232 5.72539 5.81958 4.27248 7.27248C2.81958 8.72539 2.00232 10.6953 2 12.75C2 21.5 14.9738 28.5825 15.5262 28.875C15.6719 28.9533 15.8346 28.9943 16 28.9943C16.1654 28.9943 16.3281 28.9533 16.4737 28.875C17.0262 28.5825 30 21.5 30 12.75C29.9977 10.6953 29.1804 8.72539 27.7275 7.27248C26.2746 5.81958 24.3047 5.00232 22.25 5ZM16 26.85C13.7175 25.52 4 19.4613 4 12.75C4.00198 11.2256 4.60842 9.76423 5.68633 8.68633C6.76423 7.60842 8.22561 7.00198 9.75 7C12.1812 7 14.2225 8.295 15.075 10.375C15.1503 10.5584 15.2785 10.7153 15.4432 10.8257C15.6079 10.9361 15.8017 10.995 16 10.995C16.1983 10.995 16.3921 10.9361 16.5568 10.8257C16.7215 10.7153 16.8497 10.5584 16.925 10.375C17.7775 8.29125 19.8188 7 22.25 7C23.7744 7.00198 25.2358 7.60842 26.3137 8.68633C27.3916 9.76423 27.998 11.2256 28 12.75C28 19.4513 18.28 25.5188 16 26.85Z"
                    fill="#1B2141"
                  />
                </svg>
              </IconButton>
            </Box>
            <Stack gap={{ xs: "4px", md: "12px" }} sx={{ marginTop: "16px" }}>
              <Typography
                title={product.name}
                sx={{
                  fontSize: { xs: "14px", md: "16px" },
                  fontWeight: 500,
                  WebkitLineClamp: 2,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  textWrap: "nowrap",
                }}
              >
                {product.name}
              </Typography>
              <Stack
                direction={"row"}
                gap={{ xs: "4px", md: "12px" }}
                flexWrap={"wrap"}
              >
                <Typography
                  sx={{ fontSize: { xs: "14px", md: "16px" }, fontWeight: 500 }}
                >
                  {formatVNDCurrency(getPriceAfterDiscount(product.price, product.discount))}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "14px", md: "16px" },
                    fontWeight: 400,
                    textDecoration: "line-through",
                    opacity: 0.5,
                  }}
                >
                  {formatVNDCurrency(product.price)}
                </Typography>
              </Stack>
              <Stack direction={"row"} alignItems={"end"} gap={"8px"}>
                <Rating
                  name={`${product.name}-rating`}
                  value={product.rate}
                  precision={0.5}
                  readOnly
                />
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  ({product.totalPurchase})
                </Typography>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>
      <IconButton>
        <ArrowCircleLeftRoundedIcon />
      </IconButton>
      <IconButton>
        <ArrowCircleRightRoundedIcon />
      </IconButton>
    </Box>
  );
};

export default ProductCarousel;
