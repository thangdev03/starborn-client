import { Avatar, Box, CircularProgress, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AppBreadcrumbs from "../../components/common/AppBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { colors, ORDER_STATUS, serverUrl } from "../../services/const";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { formatVNDCurrency } from "../../utils/currencyUtils";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const CustomerDetail = () => {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);
      const [response1, response2] = await Promise.all([
        axios.get(serverUrl + `customers/${customerId}`),
        axios.get(serverUrl + `orders?customerId=${customerId}`),
      ]);

      setCustomerData(response1.data);
      setOrderHistory(response2.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  console.log({
    customerData,
    orderHistory,
  });

  useEffect(() => {
    getData();
  }, [customerId]);

  return (
    <Box
      sx={{
        paddingX: { xs: "8px", md: "24px" },
        margin: 0,
        paddingBottom: "160px",
      }}
    >
      <Box>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "24px",
          }}
        >
          CHI TIẾT ĐƠN HÀNG
        </Typography>
        <AppBreadcrumbs item={`Thông tin chi tiết`} />
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        marginTop={"24px"}
        gap={"16px"}
      >
        {!loading ? (
          <Stack
            alignItems={"center"}
            gap={"4px"}
            padding={"36px 12px"}
            bgcolor={"white"}
            borderRadius={"8px"}
            width={{ sm: "220px" }}
            flexGrow={{ xs: 1, sm: 0 }}
          >
            <Avatar
              src={customerData?.avatar}
              sx={{
                marginLeft: "4px",
                bgcolor: colors.red,
                width: "120px",
                height: "120px",
                fontSize: "40px",
              }}
            >
              {!customerData?.avatar && customerData?.fullname[0]}
            </Avatar>
            <Typography fontWeight={500} textAlign={"center"} marginTop={"12px"}>
              {customerData?.fullname}
            </Typography>
            <Typography fontSize={"12px"} textAlign={"center"}>
              {customerData?.email}
            </Typography>
            <Typography fontSize={"12px"} textAlign={"center"}>
              {customerData?.phone}
            </Typography>
          </Stack>
        ) : (
          <Stack
            alignItems={"center"}
            gap={"4px"}
            padding={"36px 12px"}
            bgcolor={"white"}
            borderRadius={"8px"}
            width={{ sm: "220px" }}
            flexGrow={{ xs: 1, sm: 0 }}
          >
            <Skeleton 
              variant="circular"
              width="120px"
              height="120px"
            />
            <Skeleton 
              variant="text"
              sx={{
                marginTop: "12px",
                width: "50%"
              }}
            />
            <Skeleton 
              variant="text"
              sx={{
                width: "40%"
              }}
            />
            <Skeleton 
              variant="text"
              sx={{
                width: "35%"
              }}
            />
          </Stack>
        )}
        <Stack
          borderRadius={"8px"}
          bgcolor={"white"}
          flexGrow={1}
          padding={"24px"}
          gap={"24px"}
        >
          <Stack direction={"row"} alignItems={"start"} gap={"12px"}>
            <LocalShippingIcon />
            <Box>
              <Typography fontWeight={500} marginBottom={"4px"}>
                Địa chỉ giao hàng
              </Typography>
              {!loading ? (
                <Typography fontSize={"14px"}>
                  {customerData?.address
                    ? `${customerData.address}, ${
                        customerData.ward ? customerData.ward + ", " : ""
                      }${customerData.district}, ${customerData.province}`
                    : "Chưa có"}
                </Typography>
              ) : (
                <Skeleton 
                  variant="text"
                />
              )}
            </Box>
          </Stack>
          <Stack direction={"row"} alignItems={"start"} gap={"12px"}>
            <AccountBalanceWalletIcon />
            <Box>
              <Typography fontWeight={500} marginBottom={"4px"}>
                Số tiền đã thanh toán
              </Typography>
              {!loading ? (
                <Typography fontSize={"14px"}>
                  {formatVNDCurrency(customerData?.total_purchase)}
                </Typography>
              ) : (
                <Skeleton 
                  variant="text"
                />
              )}
            </Box>
          </Stack>
          <Stack direction={"row"} alignItems={"start"} gap={"12px"}>
            <AccessTimeFilledIcon />
            <Box>
              <Typography fontWeight={500} marginBottom={"4px"}>
                Ngày tham gia
              </Typography>
              {!loading ? (
                <Typography fontSize={"14px"}>
                  {new Date(customerData?.created_at).toLocaleDateString("vi", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Typography>
              ) : (
                <Skeleton 
                  variant="text"
                />
              )}
            </Box>
          </Stack>
          <Stack direction={"row"} alignItems={"start"} gap={"12px"}>
            <ManageAccountsIcon />
            <Box>
              <Typography fontWeight={500} marginBottom={"4px"}>
                Trạng thái tài khoản
              </Typography>
              {!loading ? (
                <Typography fontSize={"14px"} color={customerData?.is_active === 1 ? "#45C266" : colors.red}>
                  {customerData?.is_active === 1 ? "Hoạt động" : "Đang bị khóa"}
                </Typography>
              ) : (
                <Skeleton 
                  variant="text"
                />
              )}
            </Box>
          </Stack>
        </Stack>
      </Stack>

      {/* ORDER HISTORY */}
      <Box
        marginTop={"24px"}
        borderRadius={"16px"}
        bgcolor={"#fff"}
        padding={"24px 16px"}
      >
        <Stack
          direction={{ sm: "row" }}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={{ xs: 1, sm: "auto" }}
        >
          <Typography fontSize={"20px"} fontWeight={600}>
            Đơn Hàng Gần Đây
          </Typography>
        </Stack>

        <TableContainer sx={{ maxHeight: "65vh" }}>
          <Table
            sx={{ minWidth: 800 }}
            aria-label="Recent Orders Table"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <TableCell align="left">Mã đơn</TableCell>
                <TableCell align="center">Thời gian đặt</TableCell>
                <TableCell align="center">PTTT</TableCell>
                <TableCell align="center">Số lượng sản phẩm</TableCell>
                <TableCell align="left">Trạng thái</TableCell>
                <TableCell align="right">Tổng tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading ? (
                orderHistory ? (
                  orderHistory.map((order) => (
                    <TableRow
                      key={order.id}
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      sx={{
                        cursor: "pointer",
                        ":hover": { background: "#f8f8f8" },
                      }}
                    >
                      <TableCell align="left">#{order.id}</TableCell>
                      <TableCell align="center">
                        {new Date(order.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        {order.payment_method
                          ? order.payment_method === "banking"
                            ? "Chuyển khoản"
                            : "COD"
                          : "Chưa có"}
                      </TableCell>
                      <TableCell align="center">
                        <Typography>{order.total_quantity}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Stack
                          direction={"row"}
                          gap={"8px"}
                          alignItems={"center"}
                        >
                          <Box
                            sx={{
                              height: "8px",
                              width: "8px",
                              borderRadius: "100%",
                              bgcolor: () => {
                                switch (order.status) {
                                  case 0:
                                    return "#FFA52F";
                                  case 1:
                                    return colors.red;
                                  case 2:
                                    return "#45C266";
                                  case 3:
                                    return "#4A69E2";
                                  default:
                                    return "black";
                                }
                              },
                            }}
                          ></Box>
                          {ORDER_STATUS[order.status]}
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        {formatVNDCurrency(order.total)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Stack alignItems={"center"}>
                        <Typography>Không tìm thấy bản ghi nào!</Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Stack alignItems={"center"}>
                      <CircularProgress />
                      Đang tải
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CustomerDetail;
