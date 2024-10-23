import { Divider, IconButton, InputBase, Paper, Skeleton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Tabs } from "@mui/base/Tabs";
import { TabsList as BaseTabsList } from "@mui/base/TabsList";
import { TabPanel as BaseTabPanel } from "@mui/base/TabPanel";
import { buttonClasses } from "@mui/base/Button";
import { Tab as BaseTab, tabClasses } from "@mui/base/Tab";
import { Box, styled } from "@mui/system";
import { colors, ORDER_STATUS, serverUrl } from "../../services/const";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import dayjs from "dayjs"
import { formatVNDCurrency } from "../../utils/currencyUtils";
import debounce from "lodash.debounce"
import RatingModal from "./RatingModal";

const OrderHistory = () => {
  const tabValues = [
    {
      value: 1,
      name: "Tất cả"
    },
    {
      value: 2,
      name: "Chờ xác nhận"
    },
    {
      value: 3,
      name: "Đang giao"
    },
    {
      value: 4,
      name: "Hoàn thành"
    },
  ]

  const [selectedTab, setSelectedTab] = useState(1);
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cache, setCache] = useState({});

  const handleChangeTab = (e, newValue) => {
    setSelectedTab(newValue);
  };

  const getData = debounce(() => {
    if (cache[selectedTab]) {
      setOrders(cache[selectedTab])
      setLoading(false)
    } else {
      setLoading(true);
      const statusParam = selectedTab !== 1 ? `?status=${selectedTab-1}` : "";
      axios
        .get(serverUrl + `orders/all/customer/${currentUser.id}${statusParam}`,{
          withCredentials: true
        })
        .then((res) => {
          const ordersResult = res.data;
          setOrders(ordersResult);
          setCache((prev) => ({...prev, [selectedTab]: ordersResult}))
        })
        .catch((error) => {
          console.log(error)
          setOrders([]);
        })
        .finally(() => setLoading(false))
    }
  }, 300);

  useEffect(() => {
    getData();
  }, [selectedTab, currentUser])

  return (
    <Paper
      elevation={6}
      sx={{
        flexGrow: 1,
        padding: "40px",
        minHeight: "480px"
      }}
    >
      <Typography fontSize={"28px"} fontWeight={500} marginBottom={"20px"}>
        Lịch sử đơn hàng
      </Typography>
      <Tabs value={selectedTab} onChange={handleChangeTab}>
        <TabsList>
          {tabValues.map((tab, index) => (
            <Tab key={index} value={tab.value}>{tab.name}</Tab>
          ))}
        </TabsList>

        {/* Search bar */}
        {
          orders.length !== 0 && (
            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={{
                bgcolor: "rgba(183, 183, 183, 0.15)",
                border: "1px solid rgba(102, 102, 102, 0.15)",
                borderRadius: "8px",
                marginBottom: "16px",
                paddingLeft: "20px"
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
          )
        }

        <TabPanel value={selectedTab}>
          {
            loading 
            ? Array.from(new Array(1)).map((i, index) => (
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
                    bgcolor: "rgba(183, 183, 183, 0.15)"
                  }}
                />
                <Skeleton 
                  variant="rectangular"
                  height={"132px"}
                />
              </Box>
            )
            ) 
            : orders.length !== 0 
              ? orders.map((order) => (
                <OrderItems key={order.id} order={order} />
              ))
              : <Typography textAlign={"center"}>Chưa có đơn hàng</Typography>
          }
        </TabPanel>
      </Tabs>
    </Paper>
  );
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Tab = styled(BaseTab)`
  font-family: "Roboto";
  color: rgba(27, 33, 65, 0.6);
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  background-color: transparent;
  width: 100%;
  padding: 10px 12px;
  margin: 6px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  transition: all 0.15s ease-out;

  &:hover {
    color: ${colors.primaryColor};
  }

  &.${tabClasses.selected} {
    background-color: #fff;
    color: ${colors.primaryColor};
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabPanel = styled(BaseTabPanel)(
  ({ theme }) => `
  width: 100%;
  font-family: 'Roboto';
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  display: flex;
  flex-direction: column;
  gap: 16px;
  `
);

const TabsList = styled(BaseTabsList)(
  ({ theme }) => `
  min-width: 400px;
  background-color: rgba(183, 183, 183, 0.15);
  border-radius: 12px;
  border: 1px solid rgba(102, 102, 102, 0.15);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-shadow: 0px 3px 12px ${
    theme.palette.mode === "dark" ? grey[900] : grey[100]
  };
  `
);

const OrderItems = ({ order }) => {
  const [openRating, setOpenRating] = useState(false);
  const requestPayment = async (orderId) => {
    axios
      .post(serverUrl + "payment",
        {
          orderId
        }, 
        {
          withCredentials: true
        }
      )
      .then((res) => {
        return window.location.href = res.data.payUrl;
      })
      .catch((error) => console.log(error))
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
              {order?.status === 1 && order?.confirmed_at !== null ? "Đã xác nhận" : ORDER_STATUS[order?.status]}
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

            {order.payment_method === 'banking' && order.payment_status === 1 && (
              <Stack direction={"row"} gap={"20px"}>
                <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(27, 33, 65, 0.5)" }}/>
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

            {order.orderItems?.find(i => i.rating === null) && order.status === 3 && (
              <Stack direction={"row"} gap={"20px"}>
                <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(27, 33, 65, 0.5)" }}/>
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
        <Link key={index} to={`/account/orders/${order?.id}`} style={{ textDecoration: "none" }}>
          <Stack 
            justifyContent={"space-between"} 
            direction={"row"} 
            sx={{
              padding: "20px 32px 32px 32px",
              cursor: "pointer"
            }}
          >
            <Stack
              direction={"row"}
              alignItems={"start"}
              justifyContent={"start"}
              gap={"12px"}
              flexGrow={1}
            >
              <Box borderRadius={"8px"} overflow={"hidden"} width={"80px"} height={"80px"}>
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  width={"100%"} 
                  height={"100%"}
                  style={{
                    objectFit: "cover"
                  }}
                />
              </Box>
              <Box flexGrow={1}>
                <Typography title={item.name} marginBottom={"4px"} fontWeight={600} maxWidth={"70%"} sx={{ textWrap: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{item.name}</Typography>
                <Typography fontSize={"14px"}>Phân loại: {item.color}, {item.size}</Typography>
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

export default OrderHistory;
