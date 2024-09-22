import { Box, IconButton, Rating, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { formatVNDCurrency, getPriceAfterDiscount } from "../../utils/currencyUtils";
import { colors } from "../../services/const";
import StarRateIcon from '@mui/icons-material/StarRate';

const ProductItem = ({ productData }) => {
    const [variantIndex, setVariantIndex] = useState(0);
  return (
    <Box
      sx={{
        // width: {
        //   xs: "140px",
        //   sm: "200px",
        //   lg: "320px",
        // },
        mx: "8px",
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
          src={productData.variants[variantIndex]?.images[0]}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {productData.variants[variantIndex]?.discount > 0 && (
          <Typography
            sx={{
              position: "absolute",
              width: {
                xs: '32px',
                md: '40px'
              },
              top: "2%",
              left: "2%",
              padding: "8px 12px",
              bgcolor: colors.red,
              color: "white",
              borderRadius: "4px",
              fontSize: "12px",
              textAlign: 'center'
            }}
          >
            {`-${Number(productData.variants[variantIndex].discount).toFixed(0)}%`}
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
      <Stack gap={{ xs: "4px", md: "6px" }} sx={{ marginTop: "16px" }}>
        <Stack direction={"row"} gap={'4px'} height={'26px'}>
            {productData.variants.map((variant, index) => (
                <Box key={index} sx={{ padding: '3px', position: 'relative' }} title={variant.color}>
                    {index === variantIndex && (
                        <Box 
                        sx={{ 
                            position: 'absolute', 
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            border: '1px solid',
                            borderColor: colors.primaryColor, 
                            borderRadius: '12px',
                            padding: '2px'
                        }}>
                        </Box>
                    )}
                    <Box 
                    onClick={() => setVariantIndex(index)}
                    sx={{ height: '20px', width: '40px', bgcolor: variant.hex_color, borderRadius: '10px', cursor: 'pointer'}}
                    >
                    </Box>
                </Box>
            ))}
        </Stack>
        <Typography
          title={productData.name}
          sx={{
            fontSize: { xs: "12px", md: "14px" },
            fontWeight: 500,
            WebkitLineClamp: 2,
            textOverflow: "ellipsis",
            overflow: "hidden",
            textWrap: "nowrap",
          }}
        >
          {productData.name}
        </Typography>
        {productData.variants[variantIndex]?.discount > 0 ? (
          <Stack
            direction={"row"}
            gap={{ xs: "4px", md: "12px" }}
            flexWrap={"wrap"}
          >
            <Typography
              sx={{ fontSize: { xs: "12px", md: "14px" }, fontWeight: 500 }}
            >
              {formatVNDCurrency(
                getPriceAfterDiscount(productData.variants[variantIndex]?.price, productData.variants[variantIndex]?.discount)
              )}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "12px", md: "14px" },
                fontWeight: 400,
                textDecoration: "line-through",
                opacity: 0.5,
              }}
            >
              {formatVNDCurrency(productData.variants[variantIndex]?.price)}
            </Typography>
          </Stack>
        ) : (
          <Typography
            sx={{ fontSize: { xs: "12px", md: "14px" }, fontWeight: 500 }}
          >
            {formatVNDCurrency(productData.variants[variantIndex]?.price)}
          </Typography>
        )}
        <Stack direction={"row"} justifyContent={{xs: 'space-between', md: 'start'}} alignItems={{xs: "center", md: "end"}} gap={"8px"}>
          <Rating
            name={`${productData.name}-rating`}
            value={Number(productData.average_rating)}
            precision={0.5}
            readOnly
            sx={{ display: {xs: 'none', sm: 'flex'} }}
          />
          <Typography sx={{ fontSize: '14px', display: "flex", alignItems: 'center' }}>
            {productData.average_rating}
            <StarRateIcon sx={{ fontSize: '14px' }}/>
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            ({100})
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProductItem;
