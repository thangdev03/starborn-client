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

const Cart = () => {
  const [cartItems, setCartItems] = useState();
  const [loading, setLoading] = useState(true);
  const { openAuthModal, authToken, currentUser } = useAuth();
  const [subtotal, setSubtotal] = useState(0);
  const [totalCart, setTotalCart] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [shippingFee, setShippingFee] = useState(30000);
  const [codeInput, setCodeInput] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const getCartItems = async () => {
    if (currentUser) {
      axios
        .get(serverUrl + `cart/${currentUser.id}`, {
          withCredentials: true,
        })
        .then((res) => setCartItems(res.data))
        .catch((error) => {
          console.log(error);

          if (error.status === 403) {
            openAuthModal();
          } else if (error.status === 404) {
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
        getCartItems();
      })
      .catch((error) => console.log(error))
  };

  const deleteCartItem = async (itemId) => {
    axios
      .delete(
        serverUrl + `cart/item/${itemId}`,
        {
          withCredentials: true
        }
      )
      .then((res) => {
        if (res.status === 200) {
          getCartItems();
        }
      })
      .catch((error) => console.log(error))
  };

  const applyCoupon = async () => {
    axios.post(serverUrl + "coupons/apply", {
      orderValue: subtotal,
      code: codeInput,
      customerId: currentUser?.id
    })
    .then((res) => setCoupon(res.data))
    .catch((error) => {
      setCoupon(null);
      alert(error.message);
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

  useEffect(() => {
    if (selectedItems.length !== 0) {
      setShippingFee(30000);
    } else {
      setShippingFee(0);
    }
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

  // console.log(cartItems);

  return (
    <Box
      sx={{
        marginTop: "32px",
        padding: {
          sm: "8px",
          md: "0 52px",
        },
        minHeight: "50vh",
      }}
    >
      <Typography fontSize={"20px"} fontWeight={500}>
        Giỏ hàng
      </Typography>

      <Box></Box>
      <Grid
        container
        columnSpacing={"4px"}
        bgcolor={"rgba(183, 183, 183, 0.15)"}
        marginTop={"40px"}
        marginBottom={"32px"}
        width={"100%"}
        sx={{
          justifyContent: "space-between",
          borderRadius: "4px",
          paddingY: "12px",
          paddingX: "8px",
        }}
      >
        <Grid item>
          <Checkbox onClick={(event) => toggleCheckAll(event)}/>
        </Grid>
        <Grid item alignSelf={"center"} xs={3}>
          <Typography fontSize={"14px"}>
            Sản phẩm
          </Typography>
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
        <Grid item>
          <IconButton>
            <DeleteOutlineRoundedIcon sx={{ color: colors.primaryColor }} />
          </IconButton>
        </Grid>
      </Grid>

      <Box id={"cartList"} sx={{ height: "396px", overflowY: "auto" }}>
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
                <Grid item>
                  <Checkbox checked={isItemSelected} onClick={() => toggleCheckbox(item.id)}/>
                </Grid>
                <Grid item alignSelf={"center"} xs={3}>
                  <Stack direction={"row"} alignItems={"center"} gap={1}>
                    <Box>
                      <img
                        src={item.image_url}
                        alt=""
                        width={"80px"}
                        height={"80px"}
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                      />
                    </Box>
                    <Typography fontSize={"14px"}>{item.name}</Typography>
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
                <Grid item alignSelf={"center"} xs={1} lg={2}>
                  <ProductQuantity
                    currentQuantity={item.quantity}
                    updateQuantity={(changeRange) =>
                      updateQuantity(changeRange, item.id)
                    }
                    updateExactQuantity={(newQuantity) =>
                      updateExactQuantity(newQuantity, item.id)
                    }
                    deleteCartItem={() => deleteCartItem(item.id)}
                  />
                </Grid>
                <Grid item alignSelf={"center"} xs={1} lg={2}>
                  {!item.discount ? (
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
                          translate: "-50% -100%"
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
                    {formatVNDCurrency(getPriceAfterDiscount(item.price, item.discount) * item.quantity)}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={() => {
                      if (
                        window.confirm("Xóa sản phẩm này khỏi giỏ hàng của bạn?")
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
            )
          })
        ) : (
          <Typography textAlign={"center"}>
            Chưa có sản phẩm nào trong giỏ hàng
          </Typography>
        )}
      </Box>

      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        marginTop={"44px"}
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
          <RedButton 
            title={"Áp dụng"} 
            onClick={() => applyCoupon()}
          />
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
              <Typography>{coupon ? (`${coupon.type === "VNĐ" ? formatVNDCurrency(coupon.amount) : coupon.amount}${coupon.type}`) : formatVNDCurrency(0)}</Typography>
            </Stack>
            <Divider />
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography>Phí vận chuyển:</Typography>
              <Typography>{formatVNDCurrency(shippingFee)}</Typography>
            </Stack>
            <Divider />
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography>Thành tiền</Typography>
              <Typography fontWeight={600} color={colors.red}>
                {formatVNDCurrency(totalCart)}
              </Typography>
            </Stack>
            <RedButton title={"Thanh toán"} customStyle={{ marginX: "auto" }} />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

const ProductQuantity = ({ currentQuantity, updateQuantity = () => {}, updateExactQuantity = () => {}, deleteCartItem = () => {} }) => {
  const [quantity, setQuantity] = useState(currentQuantity);
  const [changeRange, setChangeRange] = useState(0)
  const updateRef = useRef(null);

  const clearUpdateRef = () => {
    clearTimeout(updateRef.current);
    updateRef.current = null;
  }
  
  const handleIncrease = () => {
    setQuantity(quantity + 1);
    setChangeRange((prev) => prev + 1);
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
    if (newQuantity >= 1) {
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
        marginTop: { xs: "12px", sm: 0 },
        border: "1px solid rgba(27, 33, 65, 0.5)",
        borderRadius: "4px",
        mx: "auto",
        maxWidth: { lg: "50%" },
      }}
    >
      <Button
        onClick={handleDecrease}
        sx={{
          borderRight: "1px solid rgba(27, 33, 65, 0.5)",
          borderRadius: 0,
          minWidth: 0,
          padding: "2px 4px",
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
          fontSize: "14px",
          height: "32px",
          margin: 0,
          border: 0,
          outline: "none",
          textAlign: "center",
          width: "64px",
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
          padding: "2px 4px",
        }}
      >
        <AddRoundedIcon sx={{ fontSize: "16px", color: colors.primaryColor }} />
      </Button>
    </Stack>
  );
}

export default Cart;
