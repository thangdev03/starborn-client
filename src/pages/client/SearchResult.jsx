import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { serverUrl } from "../../services/const";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Rating,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  formatVNDCurrency,
  getPriceAfterDiscount,
} from "../../utils/currencyUtils";
import StarRateIcon from "@mui/icons-material/StarRate";
import { colors } from "../../services/const";
import ProductGridItem from "../../components/client/ProductGridItem";
import RedButton from "../../components/common/RedButton";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const SearchResult = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const keywords = searchParams.get("keywords");
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productShow, setProductShow] = useState(8);
  const [collectionShow, setCollectionShow] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [productsRes, collectionsRes] = await Promise.all([
          axios.get(serverUrl + `products?getVariants=1&keywords=${keywords}`),
          axios.get(serverUrl + `collection?keywords=${keywords}`),
        ]);

        setProducts(productsRes.data);
        setCollections(collectionsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  return (
    <Box paddingX={{ xs: "16px", sm: "52px" }}>
      <Typography
        marginY={"20px"}
        textTransform={"uppercase"}
        fontWeight={600}
        fontSize={"20px"}
      >
        Từ khóa tìm kiếm "{keywords}"
      </Typography>
      <Box>
        <Typography
          marginY={"20px"}
          textTransform={"uppercase"}
          fontWeight={600}
          fontSize={"20px"}
        >
          Sản phẩm liên quan ({products.length} kết quả)
        </Typography>
        <Grid
          container
          marginTop={"16px"}
          columnSpacing={products.length !== 0 && "16px"}
          rowSpacing={products.length !== 0 && "28px"}
          width={"100%"}
          justifyContent={loading && "center"}
        >
          {loading ? (
            <CircularProgress />
          ) : products.length !== 0 ? (
            products
              .slice(0, productShow)
              .map((product, index) => (
                <ProductGridItem
                  key={index}
                  variants={product.variants}
                  name={product.name}
                  productSlug={product.slug}
                  rate={product.average_rating}
                  totalPurchase={product.total_purchase}
                />
              ))
          ) : (
            <Grid item xs={12}>
              <Typography textAlign={"center"}>
                Không tìm thấy sản phẩm nào phù hợp!
              </Typography>
            </Grid>
          )}
        </Grid>
        <Stack
          direction={"row"}
          justifyContent={"center"}
          marginTop={"12px"}
          display={
            (products?.length === 0 || products?.length <= productShow) &&
            "none"
          }
        >
          <Button
            variant="contained"
            onClick={() => setProductShow((prev) => prev + 24)}
            sx={{
              bgcolor: colors.red,
              ":hover": {
                bgcolor: "#fb4d4d",
              },
            }}
          >
            Hiển thị thêm
            <KeyboardArrowDownRoundedIcon sx={{ height: "20px" }}/>
          </Button>
        </Stack>
      </Box>

      <Box>
        <Typography
          marginY={"20px"}
          textTransform={"uppercase"}
          fontWeight={600}
          fontSize={"20px"}
        >
          Bộ sưu tập ({collections.length} kết quả)
        </Typography>
        {loading ? (
          <Box>
            {Array.from(new Array(2)).map((__, index) => (
              <Skeleton 
                key={index}
                variant="rectangular"
                height={"120px"}
                sx={{
                  marginBottom: "20px"
                }}
              />
            ))}
          </Box>
        ) : collections.length !== 0 ? (
          collections.slice(0, collectionShow).map((collection, index) => (
            <Box key={index} position={"relative"} marginBottom={"24px"}>
              <Typography
                fontSize={{ xs: "20px", md: "32px" }}
                fontWeight={600}
                sx={{
                  marginBottom: "20px",
                  flexGrow: 1,
                  textAlign: "center",
                }}
              >
                BST {collection.name}
              </Typography>
              <img
                src={collection.image_url}
                alt={collection.name}
                style={{
                  width: "100%",
                  minHeight: "220px",
                  objectFit: "cover",
                }}
              />
              <Stack
                direction={"row"}
                justifyContent={"center"}
                sx={{
                  position: "absolute",
                  bottom: "24px",
                  left: "50%",
                  transform: "translateX(-50%) translateY(-50%)",
                }}
              >
                <RedButton
                  title={"KHÁM PHÁ THÊM"}
                  href={`/collection/${collection.slug}`}
                />
              </Stack>
            </Box>
          ))
        ) : (
          <Typography textAlign={"center"}>
            Không tìm thấy Bộ sưu tập nào phù hợp!
          </Typography>
        )}
        <Stack
          direction={"row"}
          justifyContent={"center"}
          marginTop={"12px"}
          display={
            (collections?.length === 0 || collections?.length <= collectionShow) &&
            "none"
          }
        >
          <Button
            variant="contained"
            onClick={() => setCollectionShow((prev) => prev + 24)}
            sx={{
              bgcolor: colors.red,
              ":hover": {
                bgcolor: "#fb4d4d",
              },
            }}
          >
            Hiển thị thêm
            <KeyboardArrowDownRoundedIcon sx={{ height: "20px" }}/>
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

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
        <Link to={`/product/${data?.product_slug}?color=${data?.variant_slug}`}>
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
          onClick={() =>
            navigate(
              `/product/${data?.product_slug}?color=${data?.variant_slug}`
            )
          }
          variant="contained"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            bgcolor: colors.primaryColor,
            fontSize: { xs: "12px", md: "14px" },
            height: "40px",
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
                getPriceAfterDiscount(data?.price, data?.discount)
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
            ({data?.total_purchase})
          </Typography>
        </Stack>
      </Stack>
    </Grid>
  );
};

export default SearchResult;
