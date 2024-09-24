import {
  Box,
  Button,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
  Rating,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { colors, serverUrl } from "../../services/const";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  formatVNDCurrency,
  getPriceAfterDiscount,
} from "../../utils/currencyUtils";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RedButton from "../../components/common/RedButton";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";

const ProductDetail = () => {
  const { productName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const color = searchParams.get("color");
  const [product, setProduct] = useState(null);
  const [variant, setVariant] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const changeNextImage = () => {
    setImageIndex((prev) => prev + 1);
  };

  const changePreviousImage = () => {
    setImageIndex((prev) => prev - 1);
  };

  const handleChooseImage = (index) => {
    setImageIndex(index);
  };

  const handleChangeVariant = (variantSlug) => {
    setSearchParams({ color: variantSlug });
  };

  const handleChooseSize = (size, optionId) => {
    setSelectedSize({
      size,
      id: optionId,
    });
  };

  const onDecreaseQuantity = () => {
    setSelectedQuantity((prev) => prev - 1);
  };

  const onIncreaseQuantity = () => {
    setSelectedQuantity((prev) => prev + 1);
  };

  const onChangeQuantity = (e) => {
    if (e.target.value >= 1) setSelectedQuantity(Number(e.target.value));
  };

  useEffect(() => {
    axios
      .get(serverUrl + "products/slug/" + productName)
      .then((res) => setProduct(res.data.data))
      .catch((err) => console.log(err));
  }, [productName]);

  useEffect(() => {
    if (product) {
      axios
        .get(serverUrl + `products/variants/${color}/${product.id}`)
        .then((res) => setVariant(res.data))
        .catch((err) => console.log(err));
    }
  }, [product, color]);

    console.log({product})
  //   console.log({variant})

  return (
    <Box
      sx={{
        marginTop: "32px",
        padding: {
          sm: "8px",
          md: "0 52px",
        },
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent={"center"}
        gap={{ xs: 0, sm: "24px", lg: "72px" }}
        flexWrap={{ sm: "wrap", md: "nowrap" }}
      >
        <Stack
          direction={"row"}
          gap={"24px"}
          sx={{
            position: "relative",
          }}
        >
          {variant?.images && (
            <Stack
              gap={"8px"}
              sx={{
                position: { xs: "absolute", sm: "unset" },
                top: "8px",
                bottom: "8px",
                left: "4px",
              }}
            >
              <Button
                disabled={imageIndex <= 0}
                onClick={changePreviousImage}
                sx={{
                  minWidth: 0,
                  height: "28px",
                  bgcolor: "rgba(0,0,0,0.3)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                }}
              >
                <KeyboardArrowUpRoundedIcon />
              </Button>
              <ImageList
                cols={1}
                sx={{
                  maxHeight: { xs: "320px" },
                  width: "fit-content",
                }}
              >
                {variant?.images.map((image, index) => (
                  <ImageListItem
                    key={image.image_id}
                    onClick={() => handleChooseImage(index)}
                    sx={{
                      cursor: "pointer",
                      transition: "opacity 0.15s ease-in",
                      opacity: imageIndex === index ? 1 : 0.6,
                      "&:hover": {
                        opacity: 1,
                      },
                      width: "40px",
                      height: "60px",
                      border: "1px solid",
                      borderColor: colors.primaryColor,
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={image.image_url}
                      alt=""
                      style={{
                        flexGrow: 0,
                        objectFit: "cover",
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
              <Button
                disabled={imageIndex >= variant.images.length - 1}
                onClick={changeNextImage}
                sx={{
                  minWidth: 0,
                  height: "28px",
                  bgcolor: "rgba(0,0,0,0.3)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                }}
              >
                <KeyboardArrowDownRoundedIcon />
              </Button>
            </Stack>
          )}
          <Box
            sx={{
              width: { xs: "100%", sm: "420px" },
              height: { xs: "400px", sm: "520px" },
              borderRadius: { sm: "4px" },
              overflow: "hidden",
            }}
          >
            <img
              src={variant?.images[imageIndex].image_url}
              alt=""
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Stack>

        <Stack flexGrow={{ sm: 1, md: 0 }}>
          <Stack
            order={{ md: 2 }}
            direction={"row"}
            justifyContent={"space-between"}
            sx={{
              padding: { xs: "6px 16px", md: 0 },
              bgcolor: { xs: "rgba(122,143,255,0.15)", md: "transparent" },
              marginTop: { md: "24px" },
            }}
            marginBottom={{ xs: "12px", md: 0 }}
          >
            <Box>
              <Typography
                sx={{
                  textDecoration: "line-through",
                  opacity: "60%",
                  fontSize: "12px",
                }}
              >
                {formatVNDCurrency(variant?.price)}
              </Typography>
              <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
                {formatVNDCurrency(
                  getPriceAfterDiscount(variant?.price, variant?.discount)
                )}
              </Typography>
            </Box>
            <Box sx={{ alignSelf: "end", marginLeft: "12px" }}>
              <Typography
                sx={{
                  padding: "4px 12px",
                  textAlign: "center",
                  bgcolor: colors.primaryColor,
                  color: "white",
                  fontSize: "12px",
                  borderRadius: "4px",
                  marginBottom: "2px",
                }}
              >
                Giảm {Number(variant?.discount).toFixed(0)}%
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}></Box>
            <Box sx={{ alignSelf: "center", display: { md: "none" } }}>
              <IconButton
                sx={{
                  border: "1px solid rgba(27, 33, 65, 0.5)",
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
          </Stack>
          <Typography
            order={{ md: 0 }}
            variant="h1"
            fontSize={"20px"}
            fontWeight={600}
            paddingX={{ xs: "16px", md: 0 }}
          >
            Áo bra thể thao tập gym có khóa kéo giữa L34AD001
          </Typography>
          <Stack
            order={{ md: 1 }}
            direction={"row"}
            alignContent={"center"}
            justifyContent={"space-between"}
            paddingX={{ xs: "16px", md: 0 }}
            marginTop={{ xs: "10px" }}
            gap={"8px"}
          >
            <Stack direction={"row"} alignContent={"center"} gap={"4px"}>
              <Typography
                sx={{
                  textDecoration: "underline",
                  fontSize: "12px",
                  color: colors.yellow,
                }}
              >
                {product?.average_rating}
              </Typography>
              <Rating
                name={`rating-product-${product?.id}`}
                value={Number(product?.average_rating)}
                readOnly
                precision={0.5}
                color={colors.yellow}
                size="small"
              />
            </Stack>
            <Stack
              direction={"row"}
              flexGrow={1}
              justifyContent={{ xs: "right", md: "left" }}
              gap={{ xs: "8px", sm: "16px" }}
            >
              <Typography
                fontSize={"12px"}
                sx={{ color: "rgba(27, 33, 65, 0.7)" }}
              >
                (150 đánh giá)
              </Typography>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: "rgba(27, 33, 65, 0.5)" }}
              />
              <Typography
                fontSize={"12px"}
                sx={{ color: "rgba(27, 33, 65, 0.7)" }}
              >
                Đã bán 162
              </Typography>
            </Stack>
          </Stack>
          <Divider
            orientation="horizontal"
            sx={{
              marginTop: "20px",
              borderColor: "rgba(27, 33, 65, 0.5)",
              order: { md: 2 },
              width: { md: "60%" },
            }}
          />
          <Stack
            order={{ md: 2 }}
            sx={{ padding: { xs: "0 16px", md: 0 }, marginTop: "16px" }}
          >
            <Typography>
              Màu sắc: <span style={{ fontWeight: 500 }}>{variant?.color}</span>
            </Typography>
            <Stack
              direction={"row"}
              marginTop={"12px"}
              gap={"6px"}
              alignItems={"center"}
              flexWrap={"wrap"}
            >
              {product?.variants?.map((item) => (
                <Box
                  key={item.variant_id}
                  onClick={() => handleChangeVariant(item.variant_slug)}
                  title={item.color}
                  sx={{
                    padding: "3px",
                    borderRadius: "100%",
                    overflow: "hidden",
                    border: "2px solid",
                    borderColor:
                      item.variant_id === variant?.id
                        ? colors.primaryColor
                        : "transparent",
                    cursor: "pointer",
                    transition: "all 0.1s ease-in",
                    "&:hover": {
                      borderColor:
                        item.variant_id === variant?.id
                          ? colors.primaryColor
                          : "rgba(27, 33, 65, 0.3)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "24px",
                      height: "24px",
                      bgcolor: item.hex_color,
                      borderRadius: "100%",
                    }}
                  ></Box>
                </Box>
              ))}
            </Stack>
            <Typography marginTop={"16px"}>Kích thước: </Typography>
            <Stack
              direction={"row"}
              gap={"12px"}
              marginTop={"12px"}
              flexWrap={"wrap"}
            >
              {variant?.options.map((option) => (
                <Button
                  key={option.option_id}
                  onClick={() =>
                    handleChooseSize(option.size, option.option_id)
                  }
                  sx={{
                    width: "36px",
                    height: "36px",
                    minWidth: 0,
                    border: "1px solid",
                    borderColor:
                      option.size === selectedSize?.size
                        ? colors.red
                        : "rgba(27, 33, 65, 0.5)",
                    color:
                      option.size === selectedSize?.size
                        ? "white"
                        : colors.primaryColor,
                    bgcolor:
                      option.size === selectedSize?.size
                        ? colors.red
                        : "transparent",
                    borderRadius: "8px",
                    fontSize: "14px",
                    cursor: "pointer",
                    "&:hover": option.size === selectedSize?.size && {
                      borderColor: colors.red,
                      bgcolor: colors.red,
                      color: "white",
                    },
                  }}
                >
                  {option.size}
                </Button>
              ))}
            </Stack>
            <Stack
              gap={{ xs: "20px" }}
              direction={{ xs: "column", md: "row" }}
              marginTop={"16px"}
              flexWrap={"wrap"}
            >
              <Box>
                <Typography display={{ xs: "block", md: "none" }}>
                  Số lượng:{" "}
                </Typography>
                <Box
                  sx={{
                    marginTop: { xs: "12px", sm: 0 },
                    border: "1px solid rgba(27, 33, 65, 0.5)",
                    borderRadius: "4px",
                    width: "fit-content",
                  }}
                >
                  <Button
                    onClick={onDecreaseQuantity}
                    disabled={selectedQuantity <= 1}
                    sx={{
                      borderRight: "1px solid rgba(27, 33, 65, 0.5)",
                      borderRadius: 0,
                      width: { xs: "32px" },
                      minWidth: 0,
                    }}
                  >
                    <RemoveRoundedIcon sx={{ color: colors.primaryColor }} />
                  </Button>
                  <input
                    type="number"
                    min={1}
                    value={selectedQuantity}
                    onChange={onChangeQuantity}
                    style={{
                      fontSize: "14px",
                      height: "32px",
                      margin: 0,
                      border: 0,
                      outline: "none",
                      textAlign: "center",
                      width: "64px",
                      fontFamily: "Inter",
                      fontWeight: 500,
                    }}
                  />
                  <Button
                    onClick={onIncreaseQuantity}
                    sx={{
                      borderLeft: "1px solid rgba(27, 33, 65, 0.5)",
                      borderRadius: 0,
                      width: "32px",
                      minWidth: 0,
                    }}
                  >
                    <AddRoundedIcon sx={{ color: colors.primaryColor }} />
                  </Button>
                </Box>
              </Box>
              <RedButton
                title={"Thêm vào giỏ hàng"}
                customStyle={{
                  textTransform: "initial",
                  height: { md: "38px" },
                  borderRadius: "4px",
                }}
                icon={
                  <AddShoppingCartRoundedIcon
                    sx={{ fontSize: "20px", marginRight: "4px" }}
                  />
                }
                onClick={() => console.log({ selectedSize, selectedQuantity })}
              />
              <Button
                sx={{
                  border: "1px solid rgba(27, 33, 65, 0.5)",
                  display: { md: "block" },
                  minWidth: 0,
                  lineHeight: 0,
                  width: '38px'
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
              </Button>
            </Stack>
          </Stack>
          <Box marginTop={'32px'} order={{ md: 2 }} padding={{ xs: "0 16px", md: 0 }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>
              Mô tả sản phẩm
            </Typography>
            <Typography whiteSpace={'pre-line'} marginTop={'16px'}>
                {product?.detail}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProductDetail;