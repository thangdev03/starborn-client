import {
  Box,
  Checkbox,
  Grid,
  IconButton,
  Typography,
  Skeleton,
  Stack,
  Button,
  TextField,
  Divider,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Paper,
  Modal,
  Popper,
  Fade,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { colors, serverUrl } from "../../services/const";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { formatVNDCurrency, getPriceAfterDiscount } from "../../utils/currencyUtils";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RedButton from "../../components/common/RedButton";
import { Link, useNavigate } from "react-router-dom";
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { useCart } from "../../contexts/CartContext";
import { toast } from "react-toastify";

const Cart = () => {
  const { getCartQuantity } = useCart();
  const [cartItems, setCartItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authToken, currentUser } = useAuth();
  const [subtotal, setSubtotal] = useState(0);
  const [totalCart, setTotalCart] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [shippingFee, setShippingFee] = useState(30000);
  const [codeInput, setCodeInput] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [variantList, setVariantList] = useState([]);
  const [targetedProduct, setTargetedProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleClickOptions = (event, item) => {
    setAnchorEl(event.currentTarget);
    setTargetedProduct(item);
    if (anchorEl !== null && event.currentTarget !== anchorEl) {
      setOpenOptions(true)
    } else {
      setOpenOptions((prev) => !prev);
    }
  };

  const getCartItems = async () => {
    if (currentUser) {
      axios
        .get(serverUrl + `cart/${currentUser.id}`, {
          withCredentials: true,
        })
        .then((res) => setCartItems(res.data))
        .catch((error) => {
          console.log(error);

          if (error.status === 404) {
            setCartItems(null);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  const updateQuantity = async (changeRange, itemId) => {
    if (changeRange !== 0) {
      axios
        .put(
          serverUrl + `cart/item/${itemId}`, 
          {
            quantity: changeRange
          },
          {
            withCredentials: true
          }
        )
        .then((res) => console.log(res.data))
        .catch((error) => console.log(error))
    }
  };

  const updateExactQuantity = async (newQuantity, itemId) => {
    axios
      .put(
        serverUrl + `cart/item/${itemId}/exact`, 
        {
          quantity: newQuantity
        },
        {
          withCredentials: true
        }
      )
      .then((res) => {
        console.log(res.data);
        getCartQuantity();
        getCartItems();
      })
      .catch((error) => console.log(error))
  };

  const deleteCartItem = async (itemId) => {
    if (isSelected(itemId)) {
      toggleCheckbox(itemId);
    }

    axios
      .delete(
        serverUrl + `cart/items`,
        {
          data: {
            itemIds: [itemId]
          },
          withCredentials: true
        }
      )
      .then((res) => {
        getCartQuantity();
        getCartItems();
      })
      .catch((error) => console.log(error))
  };

  const deleteSelectedItems = async () => {
    setSelectedItems([])

    axios
      .delete(
        serverUrl + `cart/items`,
        {
          data: {
            itemIds: selectedItems
          },
          withCredentials: true
        }
      )
      .then((res) => {
        if (res.status === 200) {
          getCartQuantity();
          getCartItems();
        }
      })
      .catch((error) => console.log(error))
  }

  const applyCoupon = async () => {
    axios.post(serverUrl + "coupons/apply", {
      orderValue: subtotal,
      code: codeInput,
      customerId: currentUser?.id
    },{
      withCredentials: true
    })
    .then((res) => setCoupon(res.data.coupon))
    .catch((error) => {
      setCoupon(null);
      toast.error(error.response.data.message);
    })
  };

  const toggleCheckbox = (id) => {
    let newSelected = [];
    const selectedIndex = selectedItems.indexOf(id);

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedItems, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedItems.slice(1));
    } else if (selectedIndex === selectedItems.length - 1) {
      newSelected = newSelected.concat(selectedItems.slice(0, -1));
    } else {
      newSelected = newSelected.concat(
        selectedItems.slice(0, selectedIndex),
        selectedItems.slice(selectedIndex + 1)
      )
    }

    setSelectedItems(newSelected);
  };

  const toggleCheckAll = (event) => {
    if (event.target.checked) {
      const newSelected = cartItems.map((i) => i.id)
      setSelectedItems(newSelected);
    } else {
      setSelectedItems([]);
    }
  };

  const isSelected = (id) => selectedItems.indexOf(id) !== -1;

  const proceedToCheckout = () => {
    const encodedList = btoa(JSON.stringify(selectedItems));

    navigate(`/checkout?orderItems=${encodedList}`,
      {
        state: {
          choseCoupon: coupon?.code,
        }
      }
    )
  }

  useEffect(() => {
    if (selectedItems.length !== 0) {
      setShippingFee(30000);
    } else {
      setShippingFee(0);
    }

    const encodeIds = btoa(JSON.stringify(selectedItems));
  }, [selectedItems])

  useEffect(() => {
    getCartItems();
  }, [authToken]);

  useEffect(() => {
    if (selectedItems.length !== 0) {
      let result = selectedItems.reduce((total, selectedId, index) => {
        const item = cartItems.find((i) => i.id === selectedId);
        return total += Number(item.price) * Number(item.quantity) * (100 - Number(item.discount)) / 100;        
      }, 0);
      setSubtotal(result);

      if (coupon) {
        if (coupon.type === "%") {
          result = result * (100 - coupon.amount) / 100;
        } else {
          result = result - coupon.amount;
        }
      }
      setTotalCart(result + shippingFee);
    } else {
      setTotalCart(0);
    }
  }, [selectedItems, coupon, shippingFee, cartItems])

  useEffect(() => {
    if (targetedProduct) {
      setSelectedColor(targetedProduct.color);
      setSelectedSize(targetedProduct.variant_option_id);

      axios.get(serverUrl + `products/${targetedProduct.product_id}/variants`)
      .then((res) => {
        setVariantList(res.data)
      })
      .catch((error) => console.log(error))
    }
  }, [targetedProduct])

  // console.log(cartItems)
  console.log(variantList)

  return (
    <Box
      sx={{
        marginTop: "32px",
        padding: {
          xs: "0px",
          md: "0 52px",
        },
        minHeight: "50vh",
      }}
    >
      <Typography
        paddingX={{ xs: "16px", md: 0 }}
        fontSize={"20px"}
        fontWeight={600}
      >
        Giỏ hàng
      </Typography>

      <Box></Box>
      {/* ---------------START: DESKTOP CART LIST--------------- */}
      <Grid
        container
        columnSpacing={"4px"}
        bgcolor={"rgba(183, 183, 183, 0.15)"}
        marginTop={"40px"}
        marginBottom={"32px"}
        width={"100%"}
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "space-between",
          borderRadius: "4px",
          paddingY: "12px",
          paddingX: "8px",
        }}
      >
        <Grid item alignSelf={"center"}>
          <Checkbox
            onClick={(event) => toggleCheckAll(event)}
            sx={{ padding: 0 }}
          />
        </Grid>
        <Grid item alignSelf={"center"} xs={3}>
          <Typography fontSize={"14px"}>Sản phẩm</Typography>
        </Grid>
        <Grid item alignSelf={"center"} xs={1} lg={2}>
          <Typography fontSize={"14px"} textAlign={"center"}>
            Phân loại
          </Typography>
        </Grid>
        <Grid item alignSelf={"center"} xs={1} lg={2}>
          <Typography fontSize={"14px"} textAlign={"center"}>
            Số lượng
          </Typography>
        </Grid>
        <Grid item alignSelf={"center"} xs={1} lg={2}>
          <Typography fontSize={"14px"} textAlign={"center"}>
            Đơn giá
          </Typography>
        </Grid>
        <Grid item alignSelf={"center"} xs={1} lg={2}>
          <Typography fontSize={"14px"} textAlign={"center"}>
            Thành tiền
          </Typography>
        </Grid>
        <Grid item width={"52px"} height={"40px"}>
          <IconButton title="Xóa tất cả đã chọn" onClick={() => deleteSelectedItems()} sx={{ display: selectedItems.length !== 0 ? "inline-flex" : "none" }}>
            <DeleteOutlineRoundedIcon sx={{ color: colors.primaryColor }} />
          </IconButton>
        </Grid>
      </Grid>

      <Box
        id={"cartList"}
        sx={{
          height: "396px",
          overflowY: "auto",
          display: { xs: "none", md: "block" },
        }}
      >
        {loading ? (
          [1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              width={"100%"}
              height={"112px"}
              sx={{ marginBottom: "16px" }}
            />
          ))
        ) : cartItems ? (
          cartItems.map((item) => {
            const isItemSelected = isSelected(item.id);
            return (
              <Grid
                key={item.id}
                container
                columnSpacing={"4px"}
                bgcolor={"rgba(183, 183, 183, 0.15)"}
                width={"100%"}
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: "4px",
                  paddingY: "12px",
                  paddingX: "8px",
                  marginBottom: "16px",
                }}
              >
                <Grid item alignSelf={"center"}>
                  <Checkbox
                    disabled={item.stock === 0}
                    checked={isItemSelected}
                    onClick={() => toggleCheckbox(item.id)}
                    sx={{ padding: 0 }}
                  />
                </Grid>
                <Grid item alignSelf={"center"} xs={3}>
                  <Stack direction={"row"} alignItems={"center"} gap={1}>
                    <Link to={`/product/${item.product_slug}?color=${item.variant_slug}`}>
                      <Box>
                        <img
                          src={item.image_url}
                          alt=""
                          width={"80px"}
                          height={"80px"}
                          style={{ objectFit: "cover", borderRadius: "8px" }}
                        />
                      </Box>
                    </Link>
                    <Link 
                      to={`/product/${item.product_slug}?color=${item.variant_slug}`}
                      style={{
                        textDecoration: "none",
                        color: colors.primaryColor
                      }}  
                    >
                      <Typography fontSize={"14px"}>{item.name}</Typography>
                    </Link>
                  </Stack>
                </Grid>
                <Grid
                  item
                  alignSelf={"center"}
                  xs={1}
                  lg={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={(e) => handleClickOptions(e, item)}
                >
                  <Typography
                    fontSize={"14px"}
                    textAlign={"center"}
                    alignSelf={"center"}
                    width={"fit-content"}
                    paddingY={"4px"}
                  >
                    {`${item.color}, ${item.size}`}
                  </Typography>
                  <ArrowDropDownIcon />
                </Grid>
                <Grid item alignSelf={"center"} xs={1} lg={2} justifyContent={"center"}>
                  {item.stock === 0 ? (
                    <Typography textAlign={"center"} sx={{ opacity: .3 }}>{item.quantity}</Typography>
                  ) : (
                    <ProductQuantity
                      currentQuantity={item.quantity}
                      updateQuantity={(changeRange) =>
                        updateQuantity(changeRange, item.id)
                      }
                      updateExactQuantity={(newQuantity) =>
                        updateExactQuantity(newQuantity, item.id)
                      }
                      deleteCartItem={() => deleteCartItem(item.id)}
                      maxStock={item.stock}
                    />
                  )}
                  <Typography marginTop={"4px"} fontSize={"12px"} textAlign={"center"} display={item.stock === 0 ? "block" : "none"} sx={{ opacity: .3 }}>Còn 0 sản phẩm</Typography>
                </Grid>
                <Grid item alignSelf={"center"} xs={1} lg={2}>
                  {Number(item.discount) === 0 ? (
                    <Typography fontSize={"14px"} textAlign={"center"}>
                      {formatVNDCurrency(item.price)}
                    </Typography>
                  ) : (
                    <Stack position={"relative"}>
                      <Typography
                        fontSize={"10px"}
                        textAlign={"center"}
                        sx={{
                          textDecoration: "line-through",
                          position: "absolute",
                          top: 0,
                          left: "50%",
                          translate: "-50% -100%",
                        }}
                      >
                        {formatVNDCurrency(item.price)}
                      </Typography>
                      <Typography fontSize={"14px"} textAlign={"center"}>
                        {formatVNDCurrency(
                          getPriceAfterDiscount(item.price, item.discount)
                        )}
                      </Typography>
                    </Stack>
                  )}
                </Grid>
                <Grid item alignSelf={"center"} xs={1} lg={2}>
                  <Typography
                    fontSize={"14px"}
                    textAlign={"center"}
                    sx={{ color: colors.red }}
                  >
                    {formatVNDCurrency(
                      getPriceAfterDiscount(item.price, item.discount) *
                        item.quantity
                    )}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={() => {
                      if (
                        window.confirm(
                          "Xóa sản phẩm này khỏi giỏ hàng của bạn?"
                        )
                      ) {
                        deleteCartItem(item.id);
                      }
                    }}
                  >
                    <DeleteOutlineRoundedIcon
                      sx={{ color: colors.primaryColor }}
                    />
                  </IconButton>
                </Grid>
              </Grid>
            );
          })
        ) : (
          <Typography textAlign={"center"}>
            Chưa có sản phẩm nào trong giỏ hàng
          </Typography>
        )}
      </Box>
      <Popper
        sx={{ zIndex: 50 }}
        open={openOptions}
        anchorEl={anchorEl}
        placement={"bottom"}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper sx={{ py: 2, px: 2, maxWidth: "320px" }}>
              <Typography>Màu sắc:</Typography>
              <Stack direction={"row"} gap={"4px"} marginTop={"4px"} flexWrap={"wrap"}>
                {variantList?.map((variant) => {
                  const isSelected = variant.color === selectedColor ? true : false;
                  return (
                    <Button
                      key={variant.color}
                      disabled={!variant.is_active}
                      variant="outlined"
                      onClick={() => setSelectedColor(variant.color)}
                      sx={{ 
                        color: isSelected ? colors.red : colors.primaryColor, 
                        borderColor: isSelected ? colors.red : "rgba(27, 33, 65, 0.5)",
                        "&:hover": {
                          borderColor: isSelected && colors.red,
                          bgcolor: isSelected && "transparent"
                        }
                      }}
                    >
                      {variant.color}
                    </Button>
                  )
                })}
              </Stack>
              <Typography sx={{ marginTop: "8px" }}>Kích cỡ:</Typography>
              <Stack direction={"row"} gap={"4px"} marginTop={"4px"} flexWrap={"wrap"}>
                {variantList
                ?.find((variant) => variant.color === selectedColor)
                ?.options.map((option) => {
                  const isSelected = option.option_id === selectedSize ? true : false;
                  return (
                  <Button
                    key={option.option_id}
                    disabled={!option.option_isActive || option.option_stock === 0}
                    variant="outlined"
                    onClick={() => setSelectedSize(option.option_id)}
                    sx={{ 
                      color: isSelected ? colors.red : colors.primaryColor, 
                      borderColor: isSelected ? colors.red : "rgba(27, 33, 65, 0.5)",
                      "&:hover": {
                        borderColor: isSelected && colors.red,
                        bgcolor: isSelected && "transparent"
                      }
                    }}
                  >
                    {option.option_size}
                  </Button>
                  )
                })}
              </Stack>
              <Stack direction={"row"} marginTop={"8px"} gap={"4px"} justifyContent={"end"}>
                <Button
                  onClick={() => {
                    setOpenOptions(false);
                    setTargetedProduct(null);
                  }} 
                  sx={{
                    borderColor: colors.primaryColor,
                    color: colors.primaryColor,
                    borderRadius: "8px"
                  }}
                >
                  Trở lại
                </Button>
                <RedButton 
                  title={"Xác nhận"}
                  customStyle={{
                    paddingX: "12px"
                  }}
                  onClick={() => console.log({
                    selectedSize,
                    cartItem: targetedProduct.id
                  })}
                />
              </Stack>
            </Paper>
          </Fade>
        )}
      </Popper>
      {/* ---------------END: DESKTOP CART LIST--------------- */}

      {/* ---------------START: MOBILE CART LIST--------------- */}
      <Stack gap={"16px"}>
        {cartItems ? (
          cartItems.map((item) => {
            const isItemSelected = isSelected(item.id);
            return (
              <Stack
                key={item.id}
                direction={"row"}
                gap={"6px"}
                sx={{
                  display: { md: "none" },
                  padding: "16px 8px",
                  bgcolor: "rgba(183, 183, 183, 0.15)",
                }}
              >
                <Checkbox
                  checked={isItemSelected}
                  onClick={() => toggleCheckbox(item.id)}
                  sx={{ padding: 0 }}
                />
                <Box>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    width={"96px"}
                    height={"160px"}
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
                <Stack justifyContent={"space-between"} flexGrow={1}>
                  <Stack gap={"12px"}>
                    <Typography fontSize={"14px"}>{item.name}</Typography>
                    <Stack direction={"row"} gap={"8px"} flexWrap={"wrap"}>
                      <Select
                        value={10}
                        // onChange={handleChange}
                        variant="outlined"
                        size="small"
                        sx={{
                          fontSize: "12px",
                          borderRadius: "8px",
                        }}
                        SelectDisplayProps={{
                          style: {
                            paddingLeft: "8px",
                          },
                        }}
                      >
                        <MenuItem value={10}>Xanh</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                      <Select
                        value={10}
                        // onChange={handleChange}
                        variant="outlined"
                        size="small"
                        sx={{
                          fontSize: "12px",
                          borderRadius: "8px",
                        }}
                        SelectDisplayProps={{
                          style: {
                            paddingLeft: "8px",
                          },
                        }}
                      >
                        <MenuItem value={10}>XS</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </Stack>
                  </Stack>

                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"end"}
                  >
                    <Box>
                      <ProductQuantity
                        currentQuantity={item.quantity}
                        updateQuantity={(changeRange) =>
                          updateQuantity(changeRange, item.id)
                        }
                        updateExactQuantity={(newQuantity) =>
                          updateExactQuantity(newQuantity, item.id)
                        }
                        deleteCartItem={() => deleteCartItem(item.id)}
                        maxStock={item.stock}
                      />
                      <IconButton
                        onClick={() => {
                          if (
                            window.confirm(
                              "Xóa sản phẩm này khỏi giỏ hàng của bạn?"
                            )
                          ) {
                            deleteCartItem(item.id);
                          }
                        }}
                        sx={{ padding: "2px", marginTop: "8px" }}
                      >
                        <DeleteOutlineRoundedIcon
                          sx={{ color: colors.primaryColor }}
                        />
                      </IconButton>
                    </Box>

                    <Box>
                      {Number(item.discount) === 0 ? (
                        <Typography sx={{ fontSize: "14px" }}>
                          {formatVNDCurrency(item.price)}
                        </Typography>
                      ) : (
                        <Box pb={"2px"}>
                          <Typography
                            sx={{ fontSize: "14px", marginBottom: "4px" }}
                          >
                            {formatVNDCurrency(
                              getPriceAfterDiscount(item.price, item.discount)
                            )}
                          </Typography>
                          <Typography
                            sx={{
                              textDecoration: "line-through",
                              fontSize: "12px",
                              color: "rgba(27, 33, 65, 0.5)",
                            }}
                          >
                            {formatVNDCurrency(item.price)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
            );
          })
        ) : (
          <Typography textAlign={"center"}>
            Chưa có sản phẩm nào trong giỏ hàng
          </Typography>
        )}
      </Stack>
      {/* ---------------END: MOBILE CART LIST--------------- */}

      {/* ---------------START: DESKTOP COUPON & TOTAL--------------- */}
      <Stack
        display={{ xs: "none", md: "flex" }}
        direction={"row"}
        justifyContent={"space-between"}
        marginTop={"44px"}
        flexWrap={"wrap"}
        gap={"24px"}
      >
        <Stack direction={"row"} gap={"16px"} alignSelf={"start"}>
          <TextField
            variant="outlined"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            label="Nhập mã giảm giá"
            InputProps={{
              style: {
                borderRadius: "8px",
              },
            }}
          />
          <RedButton title={"Áp dụng"} onClick={() => applyCoupon()} />
        </Stack>

        <Box
          padding={"28px 24px"}
          borderRadius={"4px"}
          border={"1px solid rgba(27, 33, 65, 0.8)"}
          width={"420px"}
        >
          <Typography fontWeight={500} fontSize={"20px"} marginBottom={"20px"}>
            Tổng Giỏ Hàng
          </Typography>
          <Stack gap={"10px"}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography>Mã áp dụng:</Typography>
              <Typography>{coupon ? coupon.code : "Không có"}</Typography>
            </Stack>
            <Divider />
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography>Lượng giảm:</Typography>
              <Typography>
                {coupon
                  ? `${
                      coupon.type === "VNĐ"
                        ? formatVNDCurrency(coupon.amount)
                        : coupon.amount
                    }${coupon.type}`
                  : formatVNDCurrency(0)}
              </Typography>
            </Stack>
            <Divider />
            {/* <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography>Phí vận chuyển:</Typography>
              <Typography>{formatVNDCurrency(shippingFee)}</Typography>
            </Stack>
            <Divider /> */}
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography>Thành tiền</Typography>
              <Typography fontWeight={600} color={colors.red}>
                {formatVNDCurrency(totalCart)}
              </Typography>
            </Stack>
            <RedButton
              disabled={selectedItems.length === 0}
              title={"Thanh toán"}
              customStyle={{ marginX: "auto" }}
              // onClick={() =>
              //   navigate("/checkout", {
              //     state: {
              //       choseCoupon: coupon?.code || null,
              //       orderItems: selectedItems,
              //     },
              //   })
              // }
              onClick={proceedToCheckout}
            />
          </Stack>
        </Box>
      </Stack>
      {/* ---------------END: DESKTOP COUPON & TOTAL--------------- */}

      {/* ---------------START: MOBILE COUPON & TOTAL--------------- */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        <Stack 
          gap={"16px"} 
          sx={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "white",
            width: "80%",
            padding: "32px 16px",
            borderRadius: "4px"
          }}
        >
          <TextField
            variant="outlined"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            label="Nhập mã giảm giá"
            InputProps={{
              style: {
                borderRadius: "8px",
              },
            }}
          />
          <RedButton 
            title={"Áp dụng"} 
            onClick={() => {
              applyCoupon();
              setOpenModal(false);
            }} 
          />
        </Stack>
      </Modal>
      <Paper
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          paddingX: "16px",
          paddingBottom: "12px",
          bgcolor: "white",
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          paddingY={"8px"}
        >
          <Stack direction={"row"} gap={"4px"} alignItems={"center"}>
            <DiscountOutlinedIcon fontSize="14px" />
            <Typography fontSize={"14px"}>Voucher</Typography>
          </Stack>
          <Stack onClick={() => setOpenModal(true)} direction={"row"} gap={"4px"} alignItems={"center"} sx={{ cursor: "pointer" }}>
            <Typography fontSize={"14px"}>{ coupon ? coupon.code : "Nhập mã"}</Typography>
            <ArrowForwardIosRoundedIcon sx={{ fontSize: "12px" }} />
          </Stack>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          paddingY={"8px"}
          marginTop={"8px"}
        >
          <Stack direction={"row"} gap={"4px"} alignItems={"center"}>
            <LocalShippingOutlinedIcon fontSize="14px" />
            <Typography fontSize={"14px"}>Phí vận chuyển</Typography>
          </Stack>
          <Stack direction={"row"} gap={"4px"} alignItems={"center"}>
            <Typography fontSize={"14px"}>
              {formatVNDCurrency(shippingFee)}
            </Typography>
          </Stack>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          marginTop={"8px"}
        >
          <Stack direction={"row"} gap={"6px"} alignItems={"center"}>
            <Checkbox
              onClick={(event) => toggleCheckAll(event)}
              sx={{ padding: 0, height: "14px", width: "14px" }}
              size="small"
            />
            <Typography fontSize={"14px"}>Tất cả</Typography>
          </Stack>
          <Stack direction={"row"} gap={"4px"} alignItems={"center"}>
            <Typography fontSize={"16px"} color={colors.red} fontWeight={500}>
              {formatVNDCurrency(totalCart)}
            </Typography>
            <RedButton
              disabled={selectedItems.length === 0}
              title={"Thanh toán"}
              // onClick={() =>
              //   navigate("/checkout", {
              //     state: {
              //       choseCoupon: coupon?.code || null,
              //       orderItems: selectedItems,
              //     },
              //   })
              // }
              onClick={proceedToCheckout}
              customStyle={{
                padding: "6px 12px",
                fontSize: "14px",
                textTransform: "inherit",
              }}
            />
          </Stack>
        </Stack>
      </Paper>
      {/* ---------------END: MOBILE COUPON & TOTAL--------------- */}
    </Box>
  );
};

const ProductQuantity = ({ customStyle, currentQuantity, maxStock, updateQuantity = () => {}, updateExactQuantity = () => {}, deleteCartItem = () => {} }) => {
  const [quantity, setQuantity] = useState(currentQuantity);
  const [changeRange, setChangeRange] = useState(0)
  const updateRef = useRef(null);
  const theme = useTheme();
  const isMobileAndTable = useMediaQuery(theme.breakpoints.down("md"));

  const clearUpdateRef = () => {
    clearTimeout(updateRef.current);
    updateRef.current = null;
  }
  
  const handleIncrease = () => {
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
      setChangeRange((prev) => prev + 1);
    }
  }

  const handleDecrease = () => {
    if (quantity > 1 ) {
      setQuantity(quantity - 1);
      setChangeRange((prev) => prev - 1);
    } else {
      const isDelete = window.confirm('Xóa sản phẩm này khỏi giỏ hàng của bạn?');
      if (isDelete) {
        deleteCartItem();
      }
    }
  }

  const handleChangeQuantity = (e) => {
    const newQuantity = Number(e.target.value);
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  }

  useEffect(() => {
    if (updateRef.current) {
      clearUpdateRef();
    }

    updateRef.current = setTimeout(async () => {
      updateQuantity(changeRange);
      setChangeRange(0);
    },[500])

    return () => clearTimeout(updateRef.current);
  }, [quantity])

  return (
    <Stack
      direction={"row"}
      sx={{
        marginTop: { xs: 0, md: 0 },
        border: "1px solid rgba(27, 33, 65, 0.5)",
        borderRadius: "4px",
        mx: { md: "auto" },
        maxWidth: { lg: "50%" },
        customStyle
      }}
    >
      <Button
        onClick={handleDecrease}
        sx={{
          borderRight: "1px solid rgba(27, 33, 65, 0.5)",
          borderRadius: 0,
          minWidth: 0,
          paddingY: { xs: 0, md: "2px" }, 
          paddingX: "4px"
        }}
      >
        <RemoveRoundedIcon
          sx={{ fontSize: "16px", color: colors.primaryColor }}
        />
      </Button>
      <input
        type="number"
        value={quantity}
        onChange={handleChangeQuantity}
        onBlur={() => updateExactQuantity(quantity)}
        style={{
          fontSize: isMobileAndTable ?  "12px" : "14px",
          height: isMobileAndTable ? "26px" : "32px",
          margin: 0,
          border: 0,
          outline: "none",
          textAlign: "center",
          width: isMobileAndTable ? "36px" : "64px",
          fontFamily: "Inter",
          fontWeight: 500,
          flexGrow: 1,
          backgroundColor: "transparent",
        }}
      />
      <Button
        onClick={handleIncrease}
        sx={{
          borderLeft: "1px solid rgba(27, 33, 65, 0.5)",
          borderRadius: 0,
          minWidth: 0,
          paddingY: { xs: 0, md: "2px" }, 
          paddingX: "4px"
        }}
      >
        <AddRoundedIcon sx={{ fontSize: "16px", color: colors.primaryColor }} />
      </Button>
    </Stack>
  );
}

export default Cart;
