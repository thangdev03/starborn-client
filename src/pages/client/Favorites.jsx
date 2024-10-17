import { Box, Button, Grid, IconButton, Rating, Skeleton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { colors, serverUrl } from '../../services/const'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { formatVNDCurrency, getPriceAfterDiscount } from '../../utils/currencyUtils'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import StarRateIcon from "@mui/icons-material/StarRate";
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import { useWishlist } from '../../contexts/WishlistContext'

const Favorites = () => {
  const { currentUser } = useAuth();
  const { favoriteItems, loadingFavorites, removeFromFavorites } = useWishlist();

  console.log(favoriteItems)

  return (
    <Box
      sx={{
        marginTop: "32px",
        padding: {
          xs: "8px",
          md: "0 52px",
        },
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{
          marginBottom: "40px"
        }}
      >
        <Typography fontSize={"20px"} fontWeight={500}>
          Sản phẩm yêu thích ({favoriteItems?.length})
        </Typography>
        {/* <Button 
          variant="outlined"
          sx={{
            height: "48px",
            width: "260px",
            fontWeight: 500,
            color: colors.primaryColor,
            borderColor: colors.primaryColor
          }}
        >
          Thêm tất cả vào giỏ hàng
        </Button> */}
      </Stack>
      <Grid container columnSpacing={'16px'} rowSpacing={'28px'} width={'100%'}>
        {
          !loadingFavorites
            ? (
              favoriteItems.length !== 0
                ? favoriteItems.map((item, index) => (
                    <ProductItem 
                      key={index}
                      data={item}
                      currentUser={currentUser}
                      handleRemove={() => removeFromFavorites(item.variant_id)}
                    />
                  ))
                : (
                  <Grid item flexGrow={1} height={"120px"}>
                    <Typography textAlign={"center"}>Chưa có sản phẩm yêu thích nào!</Typography>
                  </Grid>
                )
            )
            : (
              Array.from(new Array(4)).map((i, index) => (
                <LoadingItem />
              ))
            )
        }
      </Grid>
    </Box>
  )
}

const ProductItem = ({ data, handleRemove }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

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
        to={`/product/${data?.product_slug}?color=${data?.variant_slug}`}
        >
          <img
            src={data?.image_url}
            className="product-image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </Link>
        {data?.discount > 0 && (
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
            {`-${Number(data?.discount).toFixed(0)}%`}
          </Typography>
        )}
        <IconButton
          onClick={handleRemove}
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
          <DeleteOutlineOutlinedIcon color={colors.primaryColor}/>
        </IconButton>
        <Button
          onClick={() => navigate(`/product/${data?.product_slug}?color=${data?.variant_slug}`)}
          variant="contained"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            bgcolor: colors.primaryColor,
            fontSize: {xs: "12px", md: "14px"},
            height: "40px"
          }}
        >
          {/* <AddShoppingCartOutlinedIcon sx={{ marginRight: "4px" }}/>
          {!isMobile && "Thêm vào giỏ hàng"} */}
          Xem chi tiết
        </Button>
      </Box>
      <Stack gap={{ xs: "4px", md: "12px" }} sx={{ marginTop: "16px" }}>
        <Link
          title={data?.name}
            to={`/product/${data?.product_slug}?color=${data?.variant_slug}`}
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
          {data?.name}
        </Link>
        {data?.discount > 0 ? (
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
                  data?.price,
                  data?.discount
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
              {formatVNDCurrency(data?.price)}
            </Typography>
          </Stack>
        ) : (
          <Typography 
            sx={{
              fontSize: { xs: "14px", md: "16px" },
              fontWeight: 500,
            }}
          >
            {formatVNDCurrency(data?.price)}
          </Typography>
        )}
        <Stack
          direction={"row"}
          justifyContent={{ xs: "space-between", md: "start" }}
          alignItems={{ xs: "center", md: "end" }}
          gap={"8px"}
        >
          <Rating
            name={`${data?.name}-rating`}
            value={Number(data?.avg_rating || 0)} 
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
            {data?.avg_rating || 0}
            <StarRateIcon sx={{ fontSize: "14px" }} />
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            ({ data?.total_purchase })
          </Typography>
        </Stack>
      </Stack>
    </Grid>
  )
}

const LoadingItem = () => {
  return (
    <Grid item xs={6} sm={4} md={4} lg={3} xl={3}>
      <Stack
        sx={{
          height: {
            xs: "220px",
            sm: "280px",
            md: "320px",
            lg: "360px",
            xl: "400px",
          },
        }}
        gap={'12px'}
      >
        <Skeleton variant='rounded' height={'80%'}/>
        <Skeleton variant='rounded' sx={{ flexGrow: 1 }}/>
      </Stack>
  </Grid>
  )
}

export default Favorites