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
  Skeleton,
  Breadcrumbs,
  Link,
  Modal,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import HeadingText from "../../components/client/HeadingText";
import ProductCarousel from "../../components/client/ProductCarousel";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { toast } from "react-toastify";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import debounce from "lodash.debounce";
import StraightenIcon from '@mui/icons-material/Straighten';

const ProductDetail = () => {
  const { productName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const color = searchParams.get("color");
  const [product, setProduct] = useState(null);
  const [variant, setVariant] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const { openAuthModal, currentUser } = useAuth();
  const { getCartQuantity } = useCart();
  const [favorites, setFavorites] = useState([]);
  const [isFavored, setIsFavored] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingVariant, setLoadingVariant] = useState(true);
  const [sizeImage, setSizeImage] = useState("");
  const [openSizeTable, setOpenSizeTable] = useState(false);
  const navigate = useNavigate();

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

  const handleChooseSize = (size, optionId, stock) => {
    setSelectedSize({
      size,
      id: optionId,
      stock
    });
  };

  const onDecreaseQuantity = () => {
    setSelectedQuantity((prev) => prev - 1);
  };

  const onIncreaseQuantity = () => {
    setSelectedQuantity((prev) => prev + 1);
  };

  const onChangeQuantity = (e) => {
    if (e.target.value >= 1) {
      if (e.target.value >= selectedSize?.stock) {
        setSelectedQuantity(selectedSize?.stock);
      } else {
        setSelectedQuantity(Number(e.target.value));
      }
    }
  };

  // --------------CHƯA CÓ API LẤY RELATED PRODUCTS--------------------
  const getRelatedProducts = () => {
    axios
      .get(serverUrl + 'products?getVariants=1')
      .then((res) => setRelatedProducts(res.data.filter(i => i.is_active === 1)))
      .catch((err) => {
        console.log(err);
        setProduct([]);
      })
  }

  const addToCart = async () => {
    if (!currentUser) {
      return openAuthModal();
    }
    if (!selectedSize) {
      return toast.warn('Vui lòng chọn size sản phẩm mong muốn')
    }
    setIsAdding(true);
    axios.post(serverUrl + `cart/${currentUser?.id}`, {
      variant_option_id: selectedSize.id,
      quantity: selectedQuantity
    },{
      withCredentials: true
    })
    .then((res) => {
      if (res.status === 201) {
        getCartQuantity();
        toast.success('Đã thêm vào giỏ hàng');
      }
    })
    .catch((error) => {
      console.log(error);

      if (error.status === 401) {
        openAuthModal();
      }
    })
    .finally(() => {
      setIsAdding(false);
    })
  }

  const getAllFavorites = async () => {
    if (currentUser) {
      axios
        .get(serverUrl + `favorites/${currentUser?.id}`)
        .then((res) => setFavorites(res.data))
        .catch((error) => console.log(error))
    }
  }

  const toggleFavorites = debounce(() => {
    isFavored ? removeFromFavorites() : addToFavorites();
  }, 300);

  const addToFavorites = async () => {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    
    axios
      .post(serverUrl + "favorites", {
        customer_id: currentUser?.id,
        product_variant_id: variant?.id
      }, {
        withCredentials: true
      })
      .then((res) => {
        setIsFavored(true);
      })
      .catch((error) => console.log(error))
  };

  const removeFromFavorites = async () => {
    axios
      .delete(serverUrl + `favorites/${variant?.id}/${currentUser?.id}`,
        {
          withCredentials: true
        }
      )
      .then((res) => {
        setIsFavored(false);
      })
      .catch((error) => console.log(error))
  };
  
  useEffect(() => {
    setLoadingProduct(true);
    axios
      .get(serverUrl + "products/slug/" + productName)
      .then((res) => {
        const productResult = res.data.data;
        if (productResult.is_active) {
          setProduct(res.data.data)
        } else {
          setProduct(null)
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoadingProduct(false))
  }, [productName]);

  useEffect(() => {
    if (product) {
      setLoadingVariant(true);
      axios
        .get(serverUrl + `products/variants/${color}/${product.id}`)
        .then((res) => setVariant(res.data))
        .catch((err) => console.log(err))
        .finally(() => setLoadingVariant(false))
    }
    setSelectedQuantity(1);
    setSelectedSize(null)

    getRelatedProducts();
  }, [product, color]);

  useEffect(() => {
    if (product) {
      axios
        .get(serverUrl + `categories/sizes/${product.category_id}`)
        .then((res) => setSizeImage(res.data?.image_url))
        .catch((error) => console.log(error))
    }
  }, [product])

  useEffect(() => {
    if (selectedSize?.stock < selectedQuantity) {
      setSelectedQuantity(selectedSize.stock);
    }
  }, [selectedSize])

  useEffect(() => {
    if (currentUser) {
      getAllFavorites();
    }
  }, [currentUser])

  useEffect(() => {
    if (favorites.length !== 0 && variant) {
      if (favorites.find(i => i.variant_id === variant.id)) {
        setIsFavored(true)
      } else {
        setIsFavored(false)
      }
    }
  }, [variant, favorites])

  return product ? (
    <Box
      sx={{
        marginTop: "32px",
        padding: {
          sm: "8px",
          md: "0 52px",
        },
      }}
    >
      <Breadcrumbs
        separator={"/"}
        aria-label="breadcrumb"
        sx={{
          display: { xs: "flex" },
          alignItems: "center",
          paddingX: { xs: "8px", md: 0},
          "& .MuiBreadcrumbs-separator": {
            mx: "4px",
            mt: "2px",
          },
        }}
        maxItems={3}
        itemsAfterCollapse={2}
      >
        <Link
          underline="hover"
          color={colors.primaryColor}
          href={"/"}
          fontSize={"14px"}
          sx={{ opacity: 0.8 }}
        >
          Trang chủ
        </Link>
        <Link
          underline="hover"
          color={colors.primaryColor}
          href={`/${product?.object_slug}`}
          fontSize={"14px"}
          sx={{ opacity: 0.8 }}
        >
          {product?.object}
        </Link>
        <Link
          underline="hover"
          color={colors.primaryColor}
          href={`/${product?.object_slug}?category=${product?.category_slug}`}
          fontSize={"14px"}
          sx={{ opacity: 0.8 }}
        >
          {product?.category}
        </Link>
        <Link
          underline="hover"
          color={colors.primaryColor}
          href={`/${product?.object_slug}?category=${product?.category_slug}&subcategory=${product?.subcategory_slug}`}
          fontSize={"14px"}
          sx={{ opacity: 0.8 }}
        >
          {product?.subcategory}
        </Link>
        <Link underline="none" color={colors.primaryColor} fontSize={"14px"}>
          {product?.name}
        </Link>
      </Breadcrumbs>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent={"center"}
        gap={{ xs: 0, sm: "24px", lg: "72px" }}
        flexWrap={{ sm: "wrap", md: "nowrap" }}
        marginTop={{ xs: "20px", sm: "40px" }}
      >
        <Stack
          direction={"row"}
          gap={"24px"}
          sx={{
            position: "relative",
          }}
        >
          {/* <Box
            sx={{
              position: { sm: "absolute" },
              top: 0,
              left: 0,
              right: 0,
              transform: { sm: "translateY(-100%)" },
              display: { xs: "none", sm: "block" },
            }}
          >
            <Breadcrumbs
              separator={"/"}
              aria-label="breadcrumb"
              sx={{
                display: "flex",
                alignItems: "center",
                "& .MuiBreadcrumbs-separator": {
                  mx: "4px",
                  mt: "2px",
                },
                width: "100%",
              }}
              maxItems={3}
              itemsAfterCollapse={2}
            >
              <Link
                underline="hover"
                color={colors.primaryColor}
                href={"/"}
                fontSize={"14px"}
                sx={{ opacity: 0.8 }}
              >
                Trang chủ
              </Link>
              <Link
                underline="hover"
                color={colors.primaryColor}
                href={`/${product?.object_slug}`}
                fontSize={"14px"}
                sx={{ opacity: 0.8 }}
              >
                {product?.object}
              </Link>
              <Link
                underline="hover"
                color={colors.primaryColor}
                href={`/${product?.object_slug}?category=${product?.category_slug}`}
                fontSize={"14px"}
                sx={{ opacity: 0.8 }}
              >
                {product?.category}
              </Link>
              <Link
                underline="hover"
                color={colors.primaryColor}
                href={`/${product?.object_slug}?category=${product?.category_slug}&subcategory=${product?.subcategory_slug}`}
                fontSize={"14px"}
                sx={{ opacity: 0.8 }}
              >
                {product?.subcategory}
              </Link>
              <Link
                underline="none"
                color={colors.primaryColor}
                fontSize={"14px"}
              >
                {product?.name}
              </Link>
            </Breadcrumbs>
          </Box> */}
          {loadingVariant ? (
            <Stack
              gap={"8px"}
              sx={{
                position: { xs: "absolute", sm: "unset" },
                top: "8px",
                bottom: "8px",
                left: "4px",
              }}
            >
              <Skeleton variant="rounded" width="40px" height="60px" />
              <Skeleton variant="rounded" width="40px" height="60px" />
              <Skeleton variant="rounded" width="40px" height="60px" />
            </Stack>
          ) : (
            variant?.images && (
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
            )
          )}
          <Box
            sx={{
              width: { xs: "100%", sm: "420px" },
              height: { xs: "400px", sm: "520px" },
              borderRadius: { sm: "4px" },
              overflow: "hidden",
            }}
          >
            {!loadingVariant ? (
              <img
                src={variant?.images[imageIndex]?.image_url}
                alt=""
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Skeleton variant="rounded" width={"100%"} height={"100%"} />
            )}
          </Box>
        </Stack>

        <Stack flexGrow={{ sm: 1, md: 0 }} maxWidth={"520px"}>
          <Stack
            order={{ md: 2 }}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            sx={{
              padding: { xs: "6px 16px", md: 0 },
              bgcolor: { xs: "rgba(122,143,255,0.15)", md: "transparent" },
              marginTop: { md: "24px" },
            }}
            marginBottom={{ xs: "12px", md: 0 }}
          >
            {!loadingVariant ? (
              <Box>
                {Number(variant?.discount) > 0 && (
                  <Typography
                    sx={{
                      textDecoration: "line-through",
                      opacity: "60%",
                      fontSize: "12px",
                    }}
                  >
                    {formatVNDCurrency(variant?.price)}
                  </Typography>
                )}
                <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
                  {formatVNDCurrency(
                    getPriceAfterDiscount(variant?.price, variant?.discount)
                  )}
                </Typography>
              </Box>
            ) : (
              <Skeleton
                variant="text"
                width={"160px"}
                sx={{
                  fontSize: "32px",
                }}
              />
            )}
            {Number(variant?.discount) > 0 && (
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
            )}
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
          {!loadingProduct ? (
            <Typography
              order={{ md: 0 }}
              variant="h1"
              fontSize={"20px"}
              fontWeight={600}
              paddingX={{ xs: "16px", md: 0 }}
            >
              {product?.name}
            </Typography>
          ) : (
            <Skeleton
              variant="text"
              sx={{
                fontSize: "32px",
              }}
            />
          )}
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
                ({product?.total_rating} đánh giá)
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
                Đã bán {product?.total_purchase}
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
              {!loadingVariant
                ? product?.variants?.map((item) => (
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
                  ))
                : Array.from(new Array(3)).map((i, index) => (
                    <Skeleton
                      key={index}
                      variant="circular"
                      width={27}
                      height={27}
                    />
                  ))}
            </Stack>
            <Typography marginTop={"16px"}>Kích thước: </Typography>
            <Stack
              direction={"row"}
              gap={"12px"}
              marginTop={"12px"}
              flexWrap={"wrap"}
            >
              {!loadingVariant
                ? variant?.options.map((option) => (
                    <Button
                      key={option.option_id}
                      disabled={option.stock === 0}
                      onClick={() =>
                        handleChooseSize(
                          option.size,
                          option.option_id,
                          option.stock
                        )
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
                        position: "relative",
                      }}
                    >
                      {option.size}
                      <Box
                        sx={{
                          display: option.stock === 0 ? "block" : "none",
                          position: "absolute",
                          height: "100%",
                          width: "2px",
                          left: "50%",
                          transform: "translateX(-50%) rotate(45deg)",
                          transformOrigin: "center",
                          bgcolor: colors.red,
                          borderRadius: "4px",
                          opacity: 0.8,
                        }}
                      ></Box>
                    </Button>
                  ))
                : Array.from(new Array(3)).map((i, index) => (
                    <Skeleton
                      key={index}
                      variant="rounded"
                      width="36px"
                      height="36px"
                      sx={{
                        borderRadius: "8px",
                      }}
                    />
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
                  Số lượng:
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
                    disabled={selectedQuantity <= 1 || selectedSize === null}
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
                    disabled={selectedSize === null}
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
                    disabled={
                      selectedSize === null ||
                      selectedQuantity === selectedSize.stock
                    }
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
                disabled={isAdding}
                title={!isAdding ? "Thêm vào giỏ hàng" : "...Đang thêm vào giỏ"}
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
                onClick={addToCart}
              />
              <Button
                onClick={toggleFavorites}
                sx={{
                  border: "1px solid rgba(27, 33, 65, 0.5)",
                  display: { xs: "none", md: "block" },
                  minWidth: 0,
                  lineHeight: 0,
                  bgcolor: isFavored ? colors.red : "transparent",
                  "&:hover": {
                    bgcolor: isFavored && "#f57878",
                  },
                }}
              >
                {/* <svg
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
                </svg> */}
                {isFavored ? (
                  <FavoriteIcon sx={{ color: "white" }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: colors.primaryColor }} />
                )}
              </Button>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} marginTop={"16px"} gap={"16px"}>
              <Button
                variant="contained"
                onClick={() => navigate("/measure-body")}
                sx={{
                  width: "140px",
                  display: "flex",
                  alignItems: "center",
                  bgcolor: colors.red,
                  "&:hover": {
                    bgcolor: "#f57878",
                  },
                }}
              >
                <StraightenIcon sx={{ height: "20px", mr: "4px" }} />
                Đo cơ thể
              </Button>
              <Typography 
                fontSize={"14px"} 
                color={"#1d4ed8"}
                onClick={() => setOpenSizeTable(true)}
                sx={{
                  textDecoration: "underline",
                  cursor: "pointer"
                }}
              >
                Xem bảng size
              </Typography>
              <Modal
                open={openSizeTable}
                onClose={() => setOpenSizeTable(false)}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    height: { xs: "auto", md: "60vh" },
                    width: { xs: "80vw", md: "auto" },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <img 
                    src={sizeImage} 
                    alt="Bảng size" 
                    height={"100%"}
                    width={"100%"}
                    style={{
                      objectFit: "contain"
                    }}
                  />
                </Box>
              </Modal>
            </Stack>
          </Stack>
          <Box
            marginTop={"32px"}
            order={{ md: 2 }}
            padding={{ xs: "0 16px", md: 0 }}
            maxWidth={{ xs: "100%", md: "452px" }}
          >
            <Typography sx={{ fontSize: "20px", fontWeight: 500 }}>
              Mô tả sản phẩm
            </Typography>
            {!loadingProduct ? (
              <Typography whiteSpace={"pre-line"} marginTop={"4px"} sx={{ textAlign: "justify" }}>
                {product?.detail}
              </Typography>
            ) : (
              <Skeleton variant="rounded" height={"80px"} />
            )}
          </Box>
        </Stack>
      </Stack>
      
      <Box
        paddingX={{ xs: "16px", md: 0 }}
        marginTop={{ xs: "52px", md: "72px" }}
      >
        <HeadingText title={"Sản phẩm liên quan"} />
        <Box sx={{ marginTop: "24px" }}>
          <ProductCarousel products={relatedProducts} />
        </Box>
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        marginTop: "32px",
        minHeight: "10vh",
        padding: {
          sm: "8px",
          md: "0 52px",
        },
      }}
    >
      <Typography textAlign={"center"} fontSize={"20px"} fontWeight={600}>
        Tạm thời không tìm thấy sản phẩm này!
      </Typography>
    </Box>
  );
};

export default ProductDetail;
