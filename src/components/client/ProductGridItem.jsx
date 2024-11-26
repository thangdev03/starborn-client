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
import React, { useEffect, useState } from "react";
import {
  formatVNDCurrency,
  getPriceAfterDiscount,
} from "../../utils/currencyUtils";
import { colors } from "../../services/const";
import StarRateIcon from "@mui/icons-material/StarRate";
import { Link } from "react-router-dom";
import { useWishlist } from "../../contexts/WishlistContext";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ProductGridItem = ({ variants, name, productSlug, rate, totalPurchase }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [variantIndex, setVariantIndex] = useState(0);
  const { favoriteItems, addToFavorites, removeFromFavorites } = useWishlist();
  const [favoredItem, setFavoredItem] = useState(null);
  
  useEffect(() => {
    const result = favoriteItems.find(i => i.variant_id === variants[variantIndex].variant_id) || null;
    setFavoredItem(result);
  }, [favoriteItems, variantIndex])

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
        {/* FAVORITE BTN */}
        {!favoredItem ? (
          <IconButton
            onClick={() => addToFavorites(variants[variantIndex].variant_id)}
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
            <FavoriteBorderIcon sx={{ color: colors.primaryColor }} />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => removeFromFavorites(variants[variantIndex].variant_id)}
            sx={{
              position: "absolute",
              top: "2%",
              right: "2%",
              bgcolor: colors.red,
              "&:hover": {
                bgcolor: "#f57878",
              },
            }}
          >
            <FavoriteIcon sx={{ color: "white" }} />
          </IconButton>
        )}
      </Box>
      <Stack gap={{ xs: "4px", md: "12px" }} sx={{ marginTop: "16px" }}>
        <Stack direction={"row"} gap={"4px"} height={"26px"} sx={{ width: "100%", overflowX: "auto" }}>
          {variants
          .filter(i => i.variant_isActive === 1)
          .map((variant, index) => (
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
            {Number(rate).toFixed(1)}
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
