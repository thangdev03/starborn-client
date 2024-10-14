import { IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import { colors, ORDER_STATUS, serverUrl } from '../../services/const';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RedButton from '../common/RedButton';
import axios from 'axios';
import OrderStepper from './OrderStepper';
import { formatVNDCurrency } from '../../utils/currencyUtils';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { createUTCDate } from '../../utils/timeUtils';

const MyOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [address, setAddress] = useState([]);

  const handleCancelOrder = async () => {
    axios
      .put(serverUrl + `orders/cancel/${orderId}`, {
        orderItems: orderData?.orderItems        
      }, {
        withCredentials: true
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("Hủy đơn hàng thành công");
          getData();
        }
      })
      .catch((error) => {
        if (error.status !== 500) {
          toast.error(error.response.data.message);
        }
        console.log(error)
      })
  };

  const getData = async () => {
    axios
      .get(serverUrl + `orders/${orderId}`)
      .then((res) => {
        setOrderData(res.data)
        const addressData = [
          res.data.shipping_address,
          res.data.shipping_ward,
          res.data.shipping_district,
          res.data.shipping_province
        ]
        setAddress(addressData.filter(i => i !== null))
      })
      .catch((error) => console.log(error))
  } 

  useEffect(() => {
    getData();
  }, [orderId])

  console.log(orderData)

  return (
    <Paper
      elevation={6}
      sx={{
        flexGrow: 1,
        padding: "40px",
      }}
    >
      <Stack direction={"row"} marginBottom={"20px"} alignItems={"center"}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ transform: "translateX(-4px)", padding: "4px" }}
        >
          <ArrowBackIosRoundedIcon sx={{ color: "rgba(27, 33, 65, 0.7)" }} />
        </IconButton>
        <Typography fontSize={"28px"} fontWeight={500} marginLeft={"0px"}>
          Thông tin đơn hàng #{orderId}
        </Typography>
        <Typography
          fontSize={"12px"}
          marginLeft={"16px"}
          paddingX={"12px"}
          paddingY={"4px"}
          color={orderData?.status !== 0 ? "#334FE0" : colors.red}
          border={"1px solid"}
          borderColor={orderData?.status !== 0 ? "#334FE0" : colors.red}
          borderRadius={"4px"}
        >
          {ORDER_STATUS[orderData?.status]}
        </Typography>
      </Stack>

      <Stack marginTop={"24px"} gap={"12px"}>
        <Stack direction={"row"} gap={"80px"}>
          <Typography width={"180px"} fontSize={"14px"}>
            Tên người nhận:
          </Typography>
          <Typography fontSize={"14px"}>{orderData?.receiver_name}</Typography>
        </Stack>
        <Stack direction={"row"} gap={"80px"}>
          <Typography width={"180px"} fontSize={"14px"}>
            Số điện thoại:
          </Typography>
          <Typography fontSize={"14px"}>{orderData?.receiver_phone}</Typography>
        </Stack>
        <Stack direction={"row"} gap={"80px"}>
          <Typography width={"180px"} fontSize={"14px"}>
            Phương thức thanh toán:
          </Typography>
          <Typography fontSize={"14px"}>CHƯA CÓ</Typography>
        </Stack>
        <Stack direction={"row"} gap={"80px"}>
          <Typography width={"180px"} fontSize={"14px"}>
            Địa chỉ:
          </Typography>
          <Typography fontSize={"14px"}>{address.join(", ")}</Typography>
        </Stack>
        <Stack direction={"row"} gap={"80px"}>
          <Typography width={"180px"} fontSize={"14px"}>
            Ghi chú:
          </Typography>
          <Typography fontSize={"14px"}>CHƯA CÓ</Typography>
        </Stack>
      </Stack>
      
      {
        orderData?.status === 1 && (
          <RedButton
            title={"Hủy đơn hàng"}
            onClick={() => handleCancelOrder()}
            customStyle={{
              marginTop: "24px",
              marginBottom: "32px",
              paddingX: "24px",
            }}
          />
        )
      }

      {
        orderData?.status !== 0 ? (
          <OrderStepper data={orderData}/>
        ) : (
          <Typography 
            sx={{
              marginTop: "16px",
              textAlign: "center",
              color: colors.red,
              fontSize: "20px",
              fontWeight: 500
            }}
          >
            ĐÃ HỦY VÀO LÚC {createUTCDate(orderData?.updated_at).toLocaleString()}
          </Typography>
        )
      }


      <TableContainer component={Paper} sx={{ marginTop: "36px" }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead sx={{ bgcolor: colors.red }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Tên sản phẩm</TableCell>
              <TableCell sx={{ color: "white" }} align="center">Phân loại</TableCell>
              <TableCell sx={{ color: "white" }} align="center">Số lượng</TableCell>
              <TableCell sx={{ color: "white" }} align="center">Đơn giá</TableCell>
              <TableCell sx={{ color: "white" }} align="center">Thành tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderData?.orderItems?.map((item, index) => (
              <TableRow key={index} sx={{ bgcolor: "rgba(102, 102, 102, 0.15)" }}>
                <TableCell 
                  component="th" 
                  scope="row" 
                  title={item.name}
                  sx={{ 
                    maxWidth: "400px", 
                    whiteSpace: "nowrap", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis" 
                  }}
                >
                  <Link 
                    to={`/product/${item.product_slug}?color=${item.color_slug}`}
                    style={{ textDecoration: "none", color: colors.primaryColor }}
                  >
                    {item.name}
                  </Link>
                </TableCell>
                <TableCell align="center">{item.color}, {item.size}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="center">{formatVNDCurrency(item.purchased_price)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack gap={"16px"} sx={{ float: "right", marginTop: "24px" }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          gap={"100px"}
        >
          <Typography fontSize={"14px"} sx={{ opacity: 0.65 }}>Tổng tiền hàng:</Typography>
          <Typography fontSize={"14px"} >
            {
              formatVNDCurrency(
                orderData?.orderItems?.reduce(
                  (acc, item) => acc + Number(item.purchased_price),
                  0
                )
              )
            }
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          gap={"100px"}
        >
          <Typography fontSize={"14px"} sx={{ opacity: 0.65 }}>Phí vận chuyển:</Typography>
          <Typography fontSize={"14px"} >{formatVNDCurrency(orderData?.shipping_fee)}</Typography>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          gap={"100px"}
        >
          <Typography fontSize={"14px"} sx={{ opacity: 0.65 }}>Giảm giá:</Typography>
          <Typography fontSize={"14px"} >{formatVNDCurrency(orderData?.discount_amount)}</Typography>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          gap={"100px"}
          alignItems={"center"}
        >
          <Typography fontSize={"14px"} sx={{ opacity: 0.65 }}>Thành tiền:</Typography>
          <Typography fontSize={"20px"} color={colors.red}>{formatVNDCurrency(orderData?.total)}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default MyOrderDetail