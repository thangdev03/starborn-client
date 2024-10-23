import {
  Box,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { colors, ORDER_STATUS, serverUrl } from "../../services/const";
import axios from "axios";
import dayjs from "dayjs";
import { formatVNDCurrency } from "../../utils/currencyUtils";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import RatingModal from "./RatingModal";

const CancelOrders = () => {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);

  const getData = () => {
    setLoading(true);
    axios
      .get(serverUrl + `orders/all/customer/${currentUser.id}?status=0`, {
        withCredentials: true,
      })
      .then((res) => {
        const ordersResult = res.data;
        setOrders(ordersResult);
      })
      .catch((error) => {
        console.log(error);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
  }, [currentUser]);

  return (
    <Paper
      elevation={6}
      sx={{
        flexGrow: 1,
        padding: "40px",
        minHeight: "480px",
      }}
    >
      <Typography fontSize={"28px"} fontWeight={500} marginBottom={"20px"}>
        Đơn hàng đã hủy
      </Typography>

      {/* Search bar */}
      {orders.length !== 0 && (
        <Stack
          direction={"row"}
          alignItems={"center"}
          sx={{
            bgcolor: "rgba(183, 183, 183, 0.15)",
            border: "1px solid rgba(102, 102, 102, 0.15)",
            borderRadius: "8px",
            marginBottom: "16px",
            paddingLeft: "20px",
          }}
        >
          <IconButton>
            <SearchIcon sx={{ color: colors.primaryColor }} />
          </IconButton>
          <InputBase
            placeholder="Bạn có thể tìm kiếm theo mã đơn hoặc tên sản phẩm"
            sx={{
              flexGrow: 1,
              padding: "4px 0px 4px 0px",
              color: colors.primaryColor,
              fontSize: "14px",
            }}
          />
        </Stack>
      )}

      <Stack gap={"16px"}>
        {loading ? (
          Array.from(new Array(1)).map((i, index) => (
            <Box
              key={index}
              sx={{
                borderRadius: "8px",
                border: "1px solid rgba(102, 102, 102, 0.15)",
              }}
            >
              <Skeleton
                height={"58px"}
                variant="rectangular"
                sx={{
                  bgcolor: "rgba(183, 183, 183, 0.15)",
                }}
              />
              <Skeleton variant="rectangular" height={"132px"} />
            </Box>
          ))
        ) : orders.length !== 0 ? (
          orders.map((order) => <OrderItems key={order.id} order={order} />)
        ) : (
          <Typography textAlign={"center"}>Chưa có đơn hàng</Typography>
        )}
      </Stack>
    </Paper>
  );
};

const OrderItems = ({ order }) => {
  const [openRating, setOpenRating] = useState(false);
  const requestPayment = async (orderId) => {
    axios
      .post(
        serverUrl + "payment",
        {
          orderId,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        return (window.location.href = res.data.payUrl);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Box
      sx={{
        borderRadius: "8px",
        border: "1px solid rgba(102, 102, 102, 0.15)",
      }}
    >
      {/* START: Order Header */}
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        paddingY={"8px"}
        paddingX={"32px"}
        bgcolor={"rgba(183, 183, 183, 0.15)"}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          minWidth={"400px"}
        >
          <Stack alignItems={"center"}>
            <Typography
              fontFamily={"Roboto"}
              color={"rgba(27, 33, 65, 0.6)"}
              fontWeight={500}
              fontSize={"14px"}
            >
              Ngày đặt
            </Typography>
            <Typography
              fontFamily={"Roboto"}
              fontWeight={500}
              fontSize={"14px"}
            >
              {new dayjs(order?.created_at).format("DD-MM-YYYY")}
            </Typography>
          </Stack>
          <Stack alignItems={"center"}>
            <Typography
              fontFamily={"Roboto"}
              color={"rgba(27, 33, 65, 0.6)"}
              fontWeight={500}
              fontSize={"14px"}
            >
              Thành tiền
            </Typography>
            <Typography
              fontFamily={"Roboto"}
              fontWeight={500}
              fontSize={"14px"}
            >
              {formatVNDCurrency(order?.total)}
            </Typography>
          </Stack>
          <Stack alignItems={"center"}>
            <Typography
              fontFamily={"Roboto"}
              color={"rgba(27, 33, 65, 0.6)"}
              fontWeight={500}
              fontSize={"14px"}
            >
              Trạng thái
            </Typography>
            <Typography
              fontFamily={"Roboto"}
              fontWeight={500}
              fontSize={"14px"}
            >
              {order?.status === 1 && order?.confirmed_at !== null
                ? "Đã xác nhận"
                : ORDER_STATUS[order?.status]}
            </Typography>
          </Stack>
        </Stack>
        <Stack alignItems={"end"}>
          <Typography
            fontFamily={"Roboto"}
            color={"rgba(27, 33, 65, 0.6)"}
            fontWeight={500}
            fontSize={"14px"}
          >
            Mã đơn #{order?.id}
          </Typography>
          <Stack direction={"row"} gap={"20px"}>
            <Link
              to={`/account/orders/${order?.id}`}
              style={{
                fontSize: "14px",
                color: "#334FE0",
              }}
            >
              Xem chi tiết
            </Link>

            {order.payment_method === "banking" &&
              order.payment_status === 1 && (
                <Stack direction={"row"} gap={"20px"}>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderColor: "rgba(27, 33, 65, 0.5)" }}
                  />
                  <Link
                    onClick={() => requestPayment(order.id)}
                    style={{
                      fontSize: "14px",
                      color: "#334FE0",
                    }}
                  >
                    Thanh toán
                  </Link>
                </Stack>
              )}

            {order.orderItems?.find((i) => i.rating === null) &&
              order.status === 3 && (
                <Stack direction={"row"} gap={"20px"}>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderColor: "rgba(27, 33, 65, 0.5)" }}
                  />
                  <Link
                    onClick={() => setOpenRating(true)}
                    style={{
                      fontSize: "14px",
                      color: "#334FE0",
                    }}
                  >
                    Đánh giá
                  </Link>
                </Stack>
              )}
          </Stack>
        </Stack>
      </Stack>
      {/* END: Order Header */}
      <RatingModal
        open={openRating}
        triggerClose={() => setOpenRating(false)}
        orderItems={order.orderItems}
      />

      {order?.orderItems?.map((item, index) => (
        <Link
          key={index}
          to={`/account/orders/${order?.id}`}
          style={{ textDecoration: "none" }}
        >
          <Stack
            justifyContent={"space-between"}
            direction={"row"}
            sx={{
              padding: "20px 32px 32px 32px",
              cursor: "pointer",
            }}
          >
            <Stack
              direction={"row"}
              alignItems={"start"}
              justifyContent={"start"}
              gap={"12px"}
              flexGrow={1}
            >
              <Box
                borderRadius={"8px"}
                overflow={"hidden"}
                width={"80px"}
                height={"80px"}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  width={"100%"}
                  height={"100%"}
                  style={{
                    objectFit: "cover",
                  }}
                />
              </Box>
              <Box flexGrow={1}>
                <Typography
                  title={item.name}
                  marginBottom={"4px"}
                  fontWeight={600}
                  maxWidth={"70%"}
                  sx={{
                    textWrap: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  {item.name}
                </Typography>
                <Typography fontSize={"14px"}>
                  Phân loại: {item.color}, {item.size}
                </Typography>
                <Typography fontSize={"14px"}>x{item.quantity}</Typography>
              </Box>
            </Stack>
            <Box>
              <Typography fontSize={"14px"}>
                {formatVNDCurrency(item.purchased_price)}
              </Typography>
            </Box>
          </Stack>
        </Link>
      ))}
    </Box>
  );
};

export default CancelOrders;
