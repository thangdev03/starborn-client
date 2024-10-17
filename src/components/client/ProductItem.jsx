import { Box, IconButton, Rating, Skeleton, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { formatVNDCurrency, getPriceAfterDiscount } from "../../utils/currencyUtils";
import { colors } from "../../services/const";
import StarRateIcon from '@mui/icons-material/StarRate';
import { useNavigate, Link } from "react-router-dom";
import { useWishlist } from "../../contexts/WishlistContext";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ProductItem = ({ productData }) => {
  const [variantIndex, setVariantIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { favoriteItems, addToFavorites, removeFromFavorites } = useWishlist();
  const [favoredItem, setFavoredItem] = useState(null);

  useEffect(() => {
    const result = favoriteItems.find(i => i.variant_id === productData?.variants[variantIndex]?.variant_id) || null;
    setFavoredItem(result);
  }, [favoriteItems, variantIndex])

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
        {!productData 
          ? (
            <Skeleton width={'100%'} height={'100%'} variant="rounded"/>
          ) : (
            <Link to={`/product/${productData.slug}?color=${productData.variants[variantIndex]?.variant_slug}`}>
              <img
                src={productData.variants[variantIndex]?.images[0]}
                className="product-image"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  cursor: "pointer"
                }}
              />
            </Link>
          ) 
        }
        {productData?.variants[variantIndex]?.discount > 0 && (
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
        {productData && (
          !favoredItem ? (
            <IconButton
            onClick={() => addToFavorites(productData?.variants[variantIndex]?.variant_id)}
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
              onClick={() => removeFromFavorites(productData?.variants[variantIndex]?.variant_id)}
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
          )
        )}
      </Box>
      <Stack gap={{ xs: "4px", md: "6px" }} sx={{ marginTop: "16px" }}>
        <Stack direction={"row"} gap={'4px'} height={'26px'}>
            {!productData 
              ? (
                <Skeleton variant="rounded"/>
              )
              : productData.variants.map((variant, index) => (
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
              ))
            }
        </Stack>
        {!productData ? (
          <Skeleton variant="text"/>
        ) : (
          <Link
            title={productData.name}
            to={`/product/${productData.slug}?color=${productData.variants[variantIndex]?.variant_slug}`}
            style={{
              fontSize: isMobile ? "12px" : "14px",
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
            {productData.name}
          </Link>
        )}
        {productData ? (
          productData.variants[variantIndex]?.discount > 0 ? (
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
          )
        ) : (
          <Skeleton variant="text" width={'60%'}/>
        )}
        {!productData ? (
          <Skeleton variant="text"/>
        ) : (
          <Stack direction={"row"} justifyContent={{xs: 'space-between', md: 'start'}} alignItems={{xs: "center", md: "end"}} gap={"8px"}>
            <Rating
              name={`${productData.name}-rating`}
              value={Number(productData.average_rating)}
              precision={0.5}
              readOnly
              sx={{ display: {xs: 'none', sm: 'flex'} }}
            />
            <Typography sx={{ fontSize: '14px', display: { xs: "flex", sm: "none" }, alignItems: 'center' }}>
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
        )}
      </Stack>
    </Box>
  );
};

export default ProductItem;
