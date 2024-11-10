import { Avatar, Box, Button, CircularProgress, Container, FormControl, IconButton, InputBase, InputLabel, MenuItem, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AppBreadcrumbs from '../../components/common/AppBreadcrumbs'
import axios from 'axios';
import { colors, ORDER_STATUS, PAYMENT_METHOD, serverUrl } from '../../services/const';
import { formatVNDCurrency } from '../../utils/currencyUtils';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const Orders = () => {
  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(-1);

  const handleChangeStatus = (value) => {
    setSelectedStatus(value);

    getData(value);
  }

  const handleSearchRequest = () => {
    setLoading(true);
    axios
      .get(serverUrl + `orders?keywords=${searchText}`)
      .then((res) => {
        setOrderData(res.data);
      })
      .catch((error) => {
        console.log(error);
        setOrderData(null);
      })
      .finally(() => setLoading(false))
  };

  const getData = async (status = null) => {
    setLoading(true);
    axios
      .get(serverUrl + "orders")
      .then((res) => {
        if (status === -1 || status === null) {
          setOrderData(res.data);
        } else {
          console.log(res.data)
          console.log({status})
          const result = res.data.filter((order) => order.status === status);
          setOrderData(result);
        }
      })
      .catch((error) => {
        console.log(error);
        setOrderData(null);
      })
      .finally(() => setLoading(false))
  } 

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box
      sx={{
        paddingX: { xs: "8px", md: "24px" },
        margin: 0,
        paddingBottom: "160px",
      }}
    >
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"end"}>
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "24px",
            }}
          >
            ĐƠN HÀNG
          </Typography>
          <AppBreadcrumbs />
        </Box>
        {/* Search bar */}
        <Box
          flexGrow={1}
          maxWidth={"400px"}
          height={"36px"}
          position={"relative"}
          border={"1px solid rgba(102,102,102,0.5)"}
          borderRadius={"8px"}
        >
          <InputBase
            sx={{
              width: "100%",
              height: "100%",
              paddingRight: "24px",
              fontSize: "14px",
              paddingLeft: "8px",
            }}
            placeholder="Tìm kiếm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchRequest()}
          />
          <IconButton
            onClick={handleSearchRequest}
            sx={{
              position: "absolute",
              top: "50%",
              right: "4px",
              transform: "translateY(-50%)",
              color: "#1B2141",
              opacity: 0.7,
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Stack>
      <Stack
        direction={"row"}
        justifyContent={"end"}
      >
        <FormControl sx={{ mt: "20px", width: "240px" }} size="small" variant="filled">
          <InputLabel id="demo-simple-select-label">Bộ lọc Trạng thái</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedStatus}
            label="Bộ lọc Trạng thái"
            onChange={(e) => handleChangeStatus(e.target.value)}
            
          >
            <MenuItem value={-1}>
              Tất cả
            </MenuItem>
            <MenuItem value={0}>
              Đã hủy
            </MenuItem>
            <MenuItem value={1}>
              Chờ xác nhận
            </MenuItem>
            <MenuItem value={2}>
              Đang giao
            </MenuItem>
            <MenuItem value={3}>
              Đã giao
            </MenuItem>
          </Select>
        </FormControl>
      </Stack>

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
          <IconButton>
            <MoreVertIcon />
          </IconButton>
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
                <TableCell align="center">Ngày đặt</TableCell>
                <TableCell align="center">PTTT</TableCell>
                <TableCell align="left">Tên khách hàng</TableCell>
                <TableCell align="left">Trạng thái</TableCell>
                <TableCell align="right">Tổng tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                !loading
                  ? orderData 
                    ? orderData.map((order) => (
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
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          {order.payment_method
                            ? order.payment_method === "banking"
                              ? "Chuyển khoản"
                              : "COD"
                            : "Chưa có"}
                        </TableCell>
                        <TableCell align="left">
                          <Stack direction={"row"} gap={"8px"} alignItems={"center"}>
                            <Avatar
                              src={order.customer_avatar}
                              sx={{
                                marginLeft: "4px",
                                bgcolor: colors.red,
                                width: "24px",
                                height: "24px",
                                fontSize: "12px",
                              }}
                            >
                              {!order.customer_avatar && order.customer_fullname[0]}
                            </Avatar>
                            <Typography>{order.customer_fullname}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">
                          <Stack direction={"row"} gap={"8px"} alignItems={"center"}>
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
                    )) : (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Stack alignItems={"center"}>
                            <Typography>
                              Không tìm thấy bản ghi nào!
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    )
                  : (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Stack alignItems={"center"}>
                            <CircularProgress />
                            Đang tải
                          </Stack>
                        </TableCell>
                      </TableRow>
                  )
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default Orders