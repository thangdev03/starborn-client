import {
  Box,
  Grid,
  IconButton,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import {
  formatVNDCurrency,
  getPriceAfterDiscount,
} from "../../utils/currencyUtils";
import { colors } from "../../services/const";
import StarRateIcon from "@mui/icons-material/StarRate";
import { Link } from "react-router-dom";

const ProductGridItem = ({ variants, name, productSlug, rate, totalPurchase }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [variantIndex, setVariantIndex] = useState(0);

  return (
    <Grid item xs={6} sm={4} md={4} lg={3} xl={3}>
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
        <Link
        to={`/product/${productSlug}?color=${variants[variantIndex]?.variant_slug}`}
        >
          <img
            src={variants[variantIndex].images[0]}
            className="product-image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </Link>
        {variants[variantIndex].discount > 0 && (
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
            {/* {discount > 0 && `-${discount}%`} */}
            {`-${Number(variants[variantIndex].discount).toFixed(0)}%`}
          </Typography>
        )}
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
        <Stack direction={"row"} gap={"4px"} height={"26px"} sx={{ width: "100%", overflowX: "auto" }}>
          {variants.map((variant, index) => (
            <Box
              key={index}
              sx={{ padding: "3px", position: "relative" }}
              title={variant.color}
            >
              {index === variantIndex && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    border: "1px solid",
                    borderColor: colors.primaryColor,
                    borderRadius: "12px",
                    padding: "2px",
                  }}
                ></Box>
              )}
              <Box
                onClick={() => setVariantIndex(index)}
                sx={{
                  height: "20px",
                  width: "40px",
                  bgcolor: variant.hex_color,
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              ></Box>
            </Box>
          ))}
        </Stack>
        <Link
          title={name}
            to={`/product/${productSlug}?color=${variants[variantIndex]?.variant_slug}`}
          style={{
            fontSize: isMobile ? "14px" : "16px",
            fontWeight: 500,
            WebkitLineClamp: 2,
            textOverflow: "ellipsis",
            overflow: "hidden",
            textWrap: "nowrap",
            cursor: "pointer",
            color: colors.primaryColor,
            textDecoration: "none",
          }}
        >
          {name}
        </Link>
        <Stack
          direction={"row"}
          gap={{ xs: "4px", md: "12px" }}
          flexWrap={"wrap"}
        >
          <Typography
            sx={{ fontSize: { xs: "14px", md: "16px" }, fontWeight: 500 }}
          >
            {formatVNDCurrency(
              getPriceAfterDiscount(
                variants[variantIndex].price,
                variants[variantIndex].discount
              )
            )}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "14px", md: "16px" },
              fontWeight: 400,
              textDecoration: "line-through",
              opacity: 0.5,
            }}
          >
            {formatVNDCurrency(variants[variantIndex].price)}
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={{ xs: "space-between", md: "start" }}
          alignItems={{ xs: "center", md: "end" }}
          gap={"8px"}
        >
          <Rating
            name={`${name}-rating`}
            value={Number(rate)}
            precision={0.5}
            readOnly
            sx={{ display: { xs: "none", sm: "flex" } }}
          />
          <Typography
            sx={{
              fontSize: "14px",
              display: { xs: "flex", sm: "none" },
              alignItems: "center",
            }}
          >
            {rate}
            <StarRateIcon sx={{ fontSize: "14px" }} />
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            ({totalPurchase})
          </Typography>
        </Stack>
      </Stack>
    </Grid>
  );
};

export default ProductGridItem;
