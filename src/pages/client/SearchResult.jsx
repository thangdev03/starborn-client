import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { serverUrl } from "../../services/const";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { colors } from "../../services/const";
import ProductGridItem from "../../components/client/ProductGridItem";
import RedButton from "../../components/common/RedButton";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const SearchResult = () => {
  const [searchParams] = useSearchParams();
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
  }, [keywords]);

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

export default SearchResult;
