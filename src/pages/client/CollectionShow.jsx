import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { colors, serverUrl } from '../../services/const';
import { Box, Button, CircularProgress, Grid, Rating, Skeleton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { formatVNDCurrency, getPriceAfterDiscount } from '../../utils/currencyUtils';
import StarRateIcon from "@mui/icons-material/StarRate";

const CollectionShow = () => {
  const { collectionSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(serverUrl + `collection/${collectionSlug}`)
      .then((res) => setCollection(res.data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false))
  }, [collectionSlug])

  return (
    <Box paddingX={{ xs: "16px", sm: "52px" }}>
      <Typography
        marginY={"20px"}
        textTransform={"uppercase"}
        fontWeight={600}
        fontSize={{ xs: "24px", md: "32px" }}
        textAlign={"center"}
      >
        Bộ sưu tập {collection?.name}
      </Typography>
      <Box>
        {loading ? (
          <Skeleton width={"100%"} height={"100%"} variant="rectangular" />
        ) : (
          <img
            width={"100%"}
            src={collection.image_url}
            style={{
              objectFit: "cover",
            }}
          />
        )}
      </Box>

      <Grid
        container
        marginTop={"16px"}
        columnSpacing={"16px"}
        rowSpacing={"28px"}
        width={"100%"}
        justifyContent={loading && "center"}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          collection?.products.map((product, index) => (
            <ProductItem key={index} data={product} />
          ))
        )}
      </Grid>
    </Box>
  );
}

const ProductItem = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  return (
    <Grid item xs={6} sm={4} md={3} lg={2} xl={2}>
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
            src={data?.product_image_url}
            alt={data.product_name + " " + data.variant_slug}
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
          {data?.product_name}
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
            value={Number(data?.average_rating || 0)} 
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
            {data?.average_rating || 0}
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

export default CollectionShow