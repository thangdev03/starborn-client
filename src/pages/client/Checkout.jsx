import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Box, Button, Checkbox, Divider, FormControlLabel, MenuItem, Paper, Radio, RadioGroup, Select, Skeleton, Stack, TextField, Typography } from "@mui/material";
import BookIcon from '@mui/icons-material/Book';
import { colors, serverUrl } from "../../services/const";
import { formatVNDCurrency, getPriceAfterDiscount } from "../../utils/currencyUtils";
import RedButton from "../../components/common/RedButton";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

const shippingInfoInputs = [
  {
    id: 1,
    name: 'name',
    label: 'Họ tên',
    type: 'text',
    pattern: '^\\S+.*$',
    helperText: 'Nhập tên của bạn'
  },
  {
    id: 2,
    name: 'phone',
    label: 'Số điện thoại',
    type: 'text',
    pattern: '^\\d{10}$',
    helperText: 'Số điện thoại chưa hợp lệ'
  },
  {
    id: 3,
    name: 'email',
    label: 'Email',
    type: 'text',
    pattern: '^[A-Za-z0-9\\._%+\\-]+@[A-Za-z0-9\\.\\-]+\\.[A-Za-z]{2,}',
    helperText: 'Địa chỉ email chưa hợp lệ'
  },
  {
    id: 4,
    name: 'address',
    label: 'Địa chỉ',
    type: 'text',
    pattern: '^\\S+.*$',
    helperText: 'Nhập địa chỉ nhà của bạn'
  }
];

const paymentOptions = [
  {
    id: 1,
    name: 'banking',
    label: 'Chuyển khoản',
    logoUrls: [
      // '../assets/img/mastercard.png',
      // '../assets/img/visa.png',
      '../assets/img/Logo-VNPAY-QR.webp'
    ]
  },
  {
    id: 2,
    name: 'cod',
    label: 'Thanh toán khi nhận hàng (COD)',
    logoUrls: []
  }
];

const Checkout = () => {
  const accessToken = sessionStorage.getItem('accessToken');
  const { currentUser } = useAuth();
  const location = useLocation();
  const choseCoupon = location.state?.choseCoupon || "";
  const [searchParams, setSearchParams] = useSearchParams();
  const { getCartQuantity } = useCart();
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [codeInput, setCodeInput] = useState(choseCoupon);
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    address: false,
  });
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0].label);
  const [products, setProducts] = useState([]);
  const [saveAddress, setSaveAddress] = useState(true);
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    // city: "",
    // district: "",
    // ward: ""
  })
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [wardList, setWardList] = useState([]);

  const handleChange = (event, inputPattern) => {
    setShippingInfo({...shippingInfo, [event.target.name]: event.target.value});

    if (inputPattern) {
      if (RegExp(inputPattern).test(event.target.value)) {
        setErrors((prev) => ({...prev, [event.target.name]: false}))
      } else {
        setErrors((prev) => ({...prev, [event.target.name]: true}))
      }
    }
  }

  const decodeBase64 = (data) => {
    return JSON.parse(atob(data));
  }

  const getProvinces = () => {
    axios.get("https://vapi.vnappmob.com/api/province/",
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    .then((res) => setProvinceList(res.data.results))
    .catch((error) => console.log(error))
  }

  const getDistricts = () => {
    axios.get("https://vapi.vnappmob.com/api/province/district/" + selectedProvince.province_id,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    .then((res) => setDistrictList(res.data.results))
    .catch((error) => console.log(error))
  };

  const getWards = () => {
    axios.get("https://vapi.vnappmob.com/api/province/ward/" + selectedDistrict.district_id,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
    .then((res) => setWardList(res.data.results))
    .catch((error) => console.log(error))
  };

  const handleChangeCity = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict("");
    setSelectedWard("");
  };

  const handleChangeDistrict = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedWard("");
  };

  const handleChangeWard = (e) => {
    setSelectedWard(e.target.value);
  };

  const applyCoupon = async () => {
    axios.post(serverUrl + "coupons/apply", {
      orderValue: subtotal,
      code: codeInput,
      customerId: currentUser?.id
    }, {
      withCredentials: true
    })
    .then((res) => {
      setAppliedCoupon(res.data.coupon);
      setTotalDiscount(res.data.discountAmount);
      alert(`Đã áp dụng mã ${res.data?.coupon?.code} thành công`)
    })
    .catch((error) => {
      setAppliedCoupon(null);
      alert(error.response.data.message);
    })
  };

  const handleSubmit = () => {
    axios
      .post(serverUrl + `orders/${currentUser.id}`,
        {
          address: shippingInfo.address,
          ward: selectedWard.ward_name,
          district: selectedDistrict.district_name,
          province: selectedProvince.province_name,
          email: shippingInfo.email,
          name: shippingInfo.name,
          phone: shippingInfo.phone,
          coupon: appliedCoupon,
          orderItems: products, 
          clientShippingFee: shippingFee
        },
        {
          withCredentials: true
        }
      )
      .then((res) => {
        if (res.status === 201) {
          getCartQuantity();
          return alert("Đặt hàng thành công!");
        }
      })
      .catch((error) => {
        if (error.response.status !== 500) {
          alert(error.response.data.message);
          // return window.location.reload();
        }

        console.log(error)
      })
  }

  useEffect(() => {
    getProvinces();
  }, [])

  useEffect(() => {
    if (selectedProvince) {
      getDistricts();
    }
  }, [selectedProvince])

  useEffect(() => {
    if (selectedDistrict) {
      getWards();
    }
  }, [selectedDistrict])

  useEffect(() => {
    const encodedOrderItems = searchParams.get("orderItems");
    if (encodedOrderItems) {
      const decodedItems = decodeBase64(encodedOrderItems);
      if (decodedItems) {
        setOrderItems(decodedItems);
      } else {
        console.error("Unable to decode orderItems");
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (selectedProvince && selectedDistrict && subtotal && products) {
      axios.get(serverUrl + "shipping/get/fee", {
        params: {
          province: selectedProvince.province_name,
          district: selectedDistrict.district_name,
          ward: selectedWard.ward_name,
          weight: products.length * 250,
          value: subtotal,
        }
      })
      .then((res) => setShippingFee(res.data?.fee))
      .catch((error) => console.log(error))
    }
  }, [selectedProvince, selectedDistrict, selectedWard, products, subtotal])

  useEffect(() => {
    if (orderItems && orderItems.length > 0) {
      setLoading(true)
      axios.post(serverUrl + "cart/items/toOrder", {
        ids: orderItems
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
        .then((res) => {
          setProducts(res.data.items);
          setSubtotal(res.data.subtotal);
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false))
    }
  }, [orderItems])

  useEffect(() => {
    if (products.length !== 0) {
      setTotal(subtotal + shippingFee - totalDiscount);
    }
  }, [products, appliedCoupon, shippingFee])

  useEffect(() => {
    if (choseCoupon && subtotal && currentUser) {
      applyCoupon()
    }
  }, [choseCoupon, subtotal, currentUser])

  return (
    <Box paddingX={{ xs: "16px", sm: "52px" }}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        marginTop={"32px"}
        gap={"120px"}
        flexWrap={"wrap"}
      >
        <Box flexGrow={1}>
          <Stack direction={"row"} justifyContent={"space-between"} flexWrap={"wrap"} gap={"4px"}>
            <Typography fontSize={{ xs: "20px", md: "24px" }} fontWeight={600}>
              Thông tin giao hàng
            </Typography>
            <Button
              variant="text"
              sx={{
                fontSize: "12px",
                color: colors.red,
                textTransform: "inherit",
                transform: { xs: "translateX(-8px)", sm: "none" }
              }}
            >
              <BookIcon sx={{ fill: colors.red }} />
              Chọn từ sổ địa chỉ
            </Button>
          </Stack>

          <Stack marginTop={{ xs: "24px", sm: "40px" }} gap={"16px"}>
            {shippingInfoInputs.map((input, index) => (
              <Box key={input.id}>
                <Typography
                  sx={{ color: "rgba(27, 33, 65, 0.5)", marginBottom: "8px" }}
                >
                  {input.label}
                </Typography>
                <TextField
                  hiddenLabel
                  name={input.name}
                  value={shippingInfo[input.name]}
                  variant="filled"
                  size="small"
                  required
                  onChange={(e) => handleChange(e, input.pattern)}
                  helperText={errors[input.name] ? input.helperText : ""}
                  error={errors[input.name]}
                  fullWidth
                />
              </Box>
            ))}
            <Stack direction={{ xs: "column", md: "row" }} gap={"12px"} width={"100%"}>
              <Box width={{ xs: "100%", md: "33.33%" }}>
                <Typography color={"rgba(27, 33, 65, 0.5)"}>
                  Thành phố/ Tỉnh
                </Typography>
                <Select
                  name="select-city"
                  variant="filled"
                  fullWidth
                  hiddenLabel
                  displayEmpty
                  size="small"
                  value={selectedProvince}
                  sx={{
                    marginTop: "8px",
                  }}
                  onChange={handleChangeCity}
                  MenuProps={{
                    style: {
                      maxHeight: "400px"
                    }
                  }}
                >
                  <MenuItem disabled value="" sx={{ fontStyle: "italic" }}>
                    Chọn thành phố/ tỉnh
                  </MenuItem>
                  {provinceList.map((city) => (
                    <MenuItem key={city.province_id} value={city}>
                      {city.province_name}
                    </MenuItem> 
                  ))}
                </Select>
              </Box>
              <Box width={{ xs: "100%", md: "33.33%" }}>
                <Typography color={"rgba(27, 33, 65, 0.5)"}>
                  Quận/ Huyện
                </Typography>
                <Select
                  variant="filled"
                  name="select-district"
                  fullWidth
                  hiddenLabel
                  displayEmpty
                  size="small"
                  disabled={selectedProvince === "" ? true : false}
                  value={selectedDistrict}
                  onChange={handleChangeDistrict}
                  sx={{
                    marginTop: "8px",
                  }}
                  MenuProps={{
                    style: {
                      maxHeight: "400px"
                    }
                  }}
                >
                  <MenuItem disabled value="" sx={{ fontStyle: "italic" }}>
                    Chọn quận/ huyện
                  </MenuItem>
                  {districtList.map((district) => (
                    <MenuItem key={district.district_id} value={district}>
                      {district.district_name}
                    </MenuItem> 
                  ))}
                </Select>
              </Box>
              <Box width={{ xs: "100%", md: "33.33%" }}>
                <Typography color={"rgba(27, 33, 65, 0.5)"}>
                  Phường/ Xã
                </Typography>
                <Select
                  variant="filled"
                  name="select-ward"
                  fullWidth
                  hiddenLabel
                  displayEmpty
                  size="small"
                  disabled={selectedDistrict === "" ? true : false}
                  value={selectedWard}
                  onChange={handleChangeWard}
                  sx={{
                    marginTop: "8px",
                  }}
                  MenuProps={{
                    style: {
                      maxHeight: "400px"
                    }
                  }}
                >
                  <MenuItem disabled value="" sx={{ fontStyle: "italic" }}>
                    Chọn phường/ xã
                  </MenuItem>
                  {wardList.map((ward) => (
                    <MenuItem key={ward.ward_id} value={ward}>
                      {ward.ward_name}
                    </MenuItem> 
                  ))}
                </Select>
              </Box>
            </Stack>

            <Stack direction={"row"} alignItems={"center"}>
              <Checkbox
                checked={saveAddress}
                onClick={() => setSaveAddress(!saveAddress)}
                sx={{
                  transform: "translateX(-9px)",
                  color: colors.red,
                  "&.Mui-checked": {
                    color: colors.red,
                  },
                }}
              />
              <Typography onClick={() => setSaveAddress(!saveAddress)} sx={{ cursor: "pointer" }}>
                Lưu vào sổ địa chỉ để dùng cho lần mua hàng tiếp theo
              </Typography>
            </Stack>
          </Stack>
          <Stack gap={"8px"} marginTop={"20px"}>
            <Typography fontSize={"20px"} fontWeight={500}>Đơn vị vận chuyển: </Typography>
            <Box>
              <img src="../assets/img/Logo-GHTK.webp" alt="Logo Giao hàng tiết kiệm" height={"32px"}/>
            </Box>
          </Stack>
        </Box>

        <Box flexGrow={1} maxWidth={{ lg: "640px" }}>
          <Typography fontWeight={500} fontSize={"20px"}>
            Chi tiết đơn hàng
          </Typography>

          <Stack gap={"20px"} sx={{ marginTop: "40px", minHeight: "132px" }}>
            {
              loading
                ? Array.from(new Array(2)).map((i, index) => (
                  <Stack
                    key={index}
                    direction={"row"}
                    justifyContent={"space-between"}
                    gap={"20px"}
                  >
                    <Skeleton
                      variant="rounded"
                      width={"56px"}
                      height={"56px"}
                    />
                    <Stack flexGrow={1} gap={"4px"}>
                      <Skeleton
                        variant="text"
                        height={"16px"}
                      />
                      <Skeleton
                        variant="text"
                        height={"16px"}
                        width={"20%"}
                      />
                      <Skeleton
                        variant="text"
                        height={"16px"}
                        width={"10%"}
                      />
                    </Stack>
                    <Box>
                      <Skeleton 
                        width={"70px"}
                        height={"16px"}
                        variant="text"
                      />
                    </Box>
                  </Stack>
                ))
                : 
                  (products.length !== 0
                    ? products.map((i) => (
                      <Stack
                        key={i.variant_option_id}
                        direction={"row"}
                        justifyContent={"space-between"}
                        gap={"20px"}
                      >
                        <Box>
                          <img
                            src={i.image_url}
                            alt=""
                            width={"56px"}
                            height={"56px"}
                            style={{
                              borderRadius: "8px",
                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                          />
                        </Box>
                        <Stack flexGrow={1} justifyContent={"space-between"}>
                          <Typography
                            width={"100%"}
                            textOverflow={"ellipsis"}
                            title={i.name}
                          >
                            {i.name}
                          </Typography>
                          <Typography fontSize={"12px"} color={"rgba(27, 33, 65, 0.8)"}>
                            {i.color}/ {i.size}
                          </Typography>
                          <Typography fontSize={"12px"} color={"rgba(27, 33, 65, 0.8)"}>
                            x{i.quantity}
                          </Typography>
                        </Stack>
                        {i.discount > 0 ? (
                          <Stack>
                            <Typography>{formatVNDCurrency(getPriceAfterDiscount(i.price, i.discount) * i.quantity)}</Typography>
                            <Typography fontSize={"12px"} color={"rgba(27, 33, 65, 0.4)"} sx={{ textDecoration: "line-through" }}>{formatVNDCurrency(i.price * i.quantity)}</Typography>
                          </Stack>
                        ) : (
                          <Typography>{formatVNDCurrency(i.price * i.quantity)}</Typography>
                        )}
                      </Stack>
                      ))
                    : (
                      <Typography textAlign={"center"}>Vui lòng chọn sản phẩm từ giỏ hàng để thực hiện thanh toán!</Typography>
                    )
                  )
              }
          </Stack>

          <Stack gap={"16px"} marginTop={"56px"}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography>Tạm tính:</Typography>
              <Typography>{formatVNDCurrency(subtotal)}</Typography>
            </Stack>
            <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.4)" }} />
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography>Phí giao hàng:</Typography>
              <Typography>{formatVNDCurrency(shippingFee)}</Typography>
            </Stack>
            <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.4)" }} />
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography>Giảm giá:</Typography>
              <Typography>{formatVNDCurrency(totalDiscount)}</Typography>
            </Stack>
            <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.4)" }} />
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography>Tổng tiền:</Typography>
              <Typography fontWeight={600}>
                {formatVNDCurrency(total)}
              </Typography>
            </Stack>
          </Stack>

          <Box marginTop={"40px"}>
            <Typography fontSize={{ sm: "20px", md: "24px" }} fontWeight={600}>
              Phương thức thanh toán
            </Typography>
            <RadioGroup
              name="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {paymentOptions.map((option) => (
                  <Stack
                    key={option.id}
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    sx={{ transform: "translateX(-11px)" }}
                  >
                    <Stack direction={"row"} alignItems={"center"}>
                      <Radio
                        name={`${option.name}-option`}
                        value={option.label}
                        sx={{
                          color: colors.primaryColor,
                          "&.Mui-checked": {
                            color: colors.primaryColor,
                          },
                        }}
                      />
                      <Typography>{option.label}</Typography>
                    </Stack>
                    {option.logoUrls.length > 0 && (
                      <Stack direction={"row"} alignItems={"center"} gap={"8px"}>
                        {option.logoUrls.map((logoUrl, index) => (
                          <Box key={index}>
                            <img src={logoUrl} height={"28x"} style={{ objectFit: "contain" }}/>
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                )
              )}
            </RadioGroup>
          </Box>

          <Stack
            direction={"row"}
            gap={"16px"}
            alignSelf={"start"}
            marginTop={"24px"}
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
              sx={{
                flexGrow: 1,
              }}
            />
            <RedButton title={"Áp dụng"} onClick={() => applyCoupon()} />
          </Stack>
        </Box>
      </Stack>

      <Paper
        elevation={3}
        square
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: { md: "100px" },
          zIndex: 20,
          filter: "drop-shadow(0px -1px 12px rgba(0,0,0,0.15))",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          padding: { xs: "8px 16px 12px", md: 0 }
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent={"space-around"}
          height={"100%"}
          alignItems={{ xs: "start", md: "center" }}
          width={{ xs: "100%", md: "50%" }}
          bgcolor={{ md: "#ECF3FF" }}
          paddingX={{ xs: "8px", md: "auto" }}
          gap={{ xs: "16px", md: 0 }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={{ xs: "start", md: "center" }}
            gap={"4px"}
            width={{ xs: "100%", md: "50%" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_81_1570)">
                <path
                  d="M7.99979 13.1428V15.4285M10.8569 11.9999V14.2856M5.14265 11.9999V14.2856M9.21579 3.87307C9.15025 3.6872 9.02865 3.52626 8.86775 3.41244C8.70685 3.29862 8.51459 3.23755 8.31751 3.23764H7.58036C7.3713 3.23839 7.16985 3.31612 7.01448 3.456C6.85911 3.59588 6.76071 3.78809 6.73809 3.99592C6.71547 4.20375 6.77021 4.41263 6.89185 4.58266C7.01349 4.75269 7.1935 4.87194 7.39751 4.91764L8.52093 5.1645C8.74969 5.21551 8.95163 5.34902 9.08818 5.53951C9.22472 5.73001 9.28629 5.96413 9.26112 6.19715C9.23595 6.43017 9.12581 6.64575 8.95174 6.80269C8.77767 6.95964 8.55188 7.04694 8.31751 7.04793H7.68208C7.48503 7.04786 7.29285 6.98672 7.13198 6.87293C6.97112 6.75913 6.84947 6.59828 6.78379 6.4125M7.99979 3.23764V2.28564M7.99979 7.99993V7.04793M3.14265 5.4285C3.06687 5.4285 2.9942 5.3984 2.94062 5.34482C2.88704 5.29124 2.85693 5.21856 2.85693 5.14279C2.85693 5.06701 2.88704 4.99434 2.94062 4.94076C2.9942 4.88717 3.06687 4.85707 3.14265 4.85707C3.21842 4.85707 3.2911 4.88717 3.34468 4.94076C3.39826 4.99434 3.42836 5.06701 3.42836 5.14279C3.42836 5.21856 3.39826 5.29124 3.34468 5.34482C3.2911 5.3984 3.21842 5.4285 3.14265 5.4285ZM12.8569 5.4285C12.7812 5.4285 12.7085 5.3984 12.6549 5.34482C12.6013 5.29124 12.5712 5.21856 12.5712 5.14279C12.5712 5.06701 12.6013 4.99434 12.6549 4.94076C12.7085 4.88717 12.7812 4.85707 12.8569 4.85707C12.9327 4.85707 13.0054 4.88717 13.059 4.94076C13.1125 4.99434 13.1426 5.06701 13.1426 5.14279C13.1426 5.21856 13.1125 5.29124 13.059 5.34482C13.0054 5.3984 12.9327 5.4285 12.8569 5.4285Z"
                  stroke="#1B2141"
                  strokeWidth="1.14286"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.2856 0.571411H1.71415C1.41104 0.571411 1.12035 0.691819 0.906024 0.906146C0.691697 1.12047 0.571289 1.41116 0.571289 1.71427V8.57141C0.571289 8.87452 0.691697 9.16521 0.906024 9.37953C1.12035 9.59386 1.41104 9.71427 1.71415 9.71427H14.2856C14.5887 9.71427 14.8794 9.59386 15.0937 9.37953C15.308 9.16521 15.4284 8.87452 15.4284 8.57141V1.71427C15.4284 1.41116 15.308 1.12047 15.0937 0.906146C14.8794 0.691819 14.5887 0.571411 14.2856 0.571411Z"
                  stroke="#1B2141"
                  strokeWidth="1.14286"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_81_1570">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <Typography fontSize={"16px"}>
              {paymentMethod}
            </Typography>
          </Stack>
          <Divider
            orientation="vertical"
            variant="middle"
            sx={{ height: "30px", borderColor: "rgba(27, 33, 65, 0.6)", display: { xs: "none", md: "block" } }}
          />
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={"4px"}
            flexGrow={1}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 13 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.9 4L8.5 4.6L5.1 8L4.5 7.4L7.9 4ZM2.5 2H10.5C11.055 2 11.5 2.445 11.5 3V5C11.2348 5 10.9804 5.10536 10.7929 5.29289C10.6054 5.48043 10.5 5.73478 10.5 6C10.5 6.26522 10.6054 6.51957 10.7929 6.70711C10.9804 6.89464 11.2348 7 11.5 7V9C11.5 9.555 11.055 10 10.5 10H2.5C2.23478 10 1.98043 9.89464 1.79289 9.70711C1.60536 9.51957 1.5 9.26522 1.5 9V7C2.055 7 2.5 6.555 2.5 6C2.5 5.73478 2.39464 5.48043 2.20711 5.29289C2.01957 5.10536 1.76522 5 1.5 5V3C1.5 2.73478 1.60536 2.48043 1.79289 2.29289C1.98043 2.10536 2.23478 2 2.5 2ZM2.5 3V4.27C2.80384 4.4452 3.05618 4.69733 3.23163 5.00103C3.40708 5.30472 3.49945 5.64927 3.49945 6C3.49945 6.35073 3.40708 6.69528 3.23163 6.99897C3.05618 7.30267 2.80384 7.5548 2.5 7.73V9H10.5V7.73C10.1962 7.5548 9.94382 7.30267 9.76837 6.99897C9.59292 6.69528 9.50055 6.35073 9.50055 6C9.50055 5.64927 9.59292 5.30472 9.76837 5.00103C9.94382 4.69733 10.1962 4.4452 10.5 4.27V3H2.5ZM5.25 4C5.665 4 6 4.335 6 4.75C6 5.165 5.665 5.5 5.25 5.5C4.835 5.5 4.5 5.165 4.5 4.75C4.5 4.335 4.835 4 5.25 4ZM7.75 6.5C8.165 6.5 8.5 6.835 8.5 7.25C8.5 7.665 8.165 8 7.75 8C7.335 8 7 7.665 7 7.25C7 6.835 7.335 6.5 7.75 6.5Z"
                fill="#1B2141"
              />
            </svg>
            <Typography fontSize={"16px"} fontWeight={appliedCoupon ? 600 : 400}>
              { appliedCoupon ? `${appliedCoupon.code} ${appliedCoupon.type === "%" ? "(" + appliedCoupon.amount + "%)" : ""}` : "Chưa dùng voucher" }
            </Typography>
          </Stack>
        </Stack>

        <Stack direction={"row"} justifyContent={{ xs: "space-between", md: "right" }} marginTop={{ xs: "16px", md: 0 }} paddingRight={{ xs: 0, md: "52px" }} gap={{ md: "52px" }} flexGrow={1}>
          <Stack direction={{ xs: "column", md: "row" }} alignItems={"center"} gap={{ md: "8px" }}>
            <Typography fontSize={{ xs: "12px", md: "16px" }}>Thành tiền</Typography>
            <Typography fontSize={{ xs: "20px", md: "24px"}} fontWeight={500} color={colors.red}>{formatVNDCurrency(total)}</Typography>
          </Stack>
          <Box alignSelf={"center"}>
            <RedButton 
              disabled={
                !(shippingInfo.address && shippingInfo.email && shippingInfo.name && shippingInfo.phone && selectedDistrict)
              }
              title={"ĐẶT HÀNG"}
              onClick={() => handleSubmit()}
            />
          </Box>
        </Stack>
      </Paper>
    </Box>
  );};

export default Checkout;
