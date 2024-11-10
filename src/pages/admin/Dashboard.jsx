import {
  Typography,
  Grid,
  Stack,
  Box,
  Icon,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AppBreadcrumbs from "../../components/common/AppBreadcrumbs";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { colors, ORDER_STATUS, serverUrl } from "../../services/const";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import ProductBrief from "../../components/admin/ProductBrief";
import { shortHandFormat, formatVNDCurrency } from "../../utils/currencyUtils";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { LineChart } from "@mui/x-charts/LineChart";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [allRevenue, setAllRevenue] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [unfinishedOrdersValue, setUnfinishedOrdersValue] = useState(0);
  const [finishedOrdersValue, setFinishedOrdersValue] = useState(0);
  const [revenueRate, setRevenueRate] = useState(0);
  const [unfinishedRate, setUnfinishedRate] = useState(0);
  const [finishedRate, setFinishedRate] = useState(0);
  const [orderCounts, setOrderCounts] = useState({
    all: 0,
    unfinished: 0,
    finished: 0,
  });
  const [chartSelection, setChartSelection] = useState("week");
  const [cache, setCache] = useState({});
  const [chartData, setChartData] = useState([]);
  const now = new Date();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();
  const xLabels = {
    week: ["CN", "HAI", "BA", "TƯ", "NĂM", "SÁU", "BẢY"],
    month: Array.from({ length: daysInMonth }).map((_, i) => i + 1),
    year: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
  };
  const [label, setLabel] = useState(xLabels["week"]);
  const [bestSellers, setBestSellers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const navigate = useNavigate();

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
  }).format;

  const createData = (
    orderId,
    quantityOfProduct,
    createdAt,
    customerAvatar,
    customerName,
    status,
    total
  ) => {
    return {
      orderId,
      quantityOfProduct,
      createdAt,
      customerAvatar,
      customerName,
      status,
      total,
    };
  };

  function getCurrentWeekData(data) {
    const now = new Date();
    const currentDay = now.getDay(); // Lấy thứ hiện tại (0: Chủ nhật, 6: Thứ 7)
    const startOfWeek = new Date(now);
    const daysToSunday = currentDay === 0 ? 0 : -currentDay;
    startOfWeek.setDate(now.getDate() + daysToSunday - 7); // Tính ngày đầu tuần (Thứ 2)

    // Tạo ra mảng chứa các ngày trong tuần hiện tại (Thứ 2 đến Chủ nhật)
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        day_of_week: i + 1,
        revenue: 0,
      };
    });

    // Bổ sung dữ liệu từ bản ghi
    data.forEach((record) => {
      const dayMatch = weekDays.find(
        (day) =>
          day.year === record.year &&
          day.month === record.month &&
          day.day === record.day
      );
      if (dayMatch) {
        dayMatch.revenue = record.revenue;
      }
    });

    return weekDays;
  }

  function getCurrentMonthData(data) {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Tạo ra mảng chứa các ngày trong tuần hiện tại (Thứ 2 đến Chủ nhật)
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(startOfMonth);
      date.setDate(startOfMonth.getDate() + i);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        revenue: 0,
      };
    });
    console.log({ monthDays });

    // Bổ sung dữ liệu từ bản ghi
    data.forEach((record) => {
      const dayMatch = monthDays.find(
        (day) =>
          day.year === record.year &&
          day.month === record.month &&
          day.day === record.day
      );
      if (dayMatch) {
        dayMatch.revenue = record.revenue;
      }
    });

    return monthDays;
  }

  const getBestSellers = async () => {
    axios
      .get(serverUrl + "products?sort=highestSales&getVariants=1")
      .then((res) =>
        setBestSellers(res.data?.filter((i) => i.total_purchase !== 0))
      )
      .catch((error) => console.log(error));
  };

  const getOrderStatistic = async () => {
    axios
      .get(serverUrl + "orders/months")
      .then((res) => {
        setAllRevenue(res.data);
      })
      .catch((error) => console.log(error));
  };

  const getRecentOrders = async () => {
    axios
      .get(serverUrl + "orders")
      .then((res) => {
        setRecentOrders(res.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getBestSellers();
    getOrderStatistic();
    getRecentOrders();
  }, []);

  useEffect(() => {
    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);

    let currentMonthRevenue = 0;
    let unfinishedTotal = 0;
    let finishedTotal = 0;
    let lastMonthRevenue = 0;
    let lastMonthFinished = 0;
    let lastMonthUnfinished = 0;
    let countAll = 0;
    let countFinished = 0;
    let countUnfinished = 0;

    allRevenue.forEach((i) => {
      if (i.year === now.getFullYear()) {
        if (i.month === now.getMonth() + 1) {
          currentMonthRevenue += Number(i.revenue);
          countAll += Number(i.count);

          if (i.status === 3) {
            finishedTotal += Number(i.revenue);
            countFinished += Number(i.count);
          } else {
            unfinishedTotal += Number(i.revenue);
            countUnfinished += Number(i.count);
          }
        } else if (i.month === lastMonth.getMonth() + 1) {
          lastMonthRevenue += Number(i.revenue);
          if (i.status === 3) {
            lastMonthFinished += Number(i.revenue);
          } else {
            lastMonthUnfinished += Number(i.revenue);
          }
        }
      }
    });

    setRevenue(currentMonthRevenue);
    setFinishedOrdersValue(finishedTotal);
    setUnfinishedOrdersValue(unfinishedTotal);
    setOrderCounts((prev) => ({
      ...prev,
      all: countAll,
      unfinished: countUnfinished,
      finished: countFinished,
    }));
    setRevenueRate(() => {
      if (lastMonthRevenue !== 0) {
        const rate = (currentMonthRevenue / lastMonthRevenue) * 100 - 100;
        return rate.toFixed(1);
      } else {
        return null;
      }
    });
    setFinishedRate(() => {
      if (lastMonthFinished !== 0) {
        const rate = (finishedTotal / lastMonthFinished) * 100 - 100;
        return rate.toFixed(1);
      } else {
        return null;
      }
    });
    setUnfinishedRate(() => {
      if (lastMonthUnfinished !== 0) {
        const rate = (unfinishedTotal / lastMonthUnfinished) * 100 - 100;
        return rate.toFixed(1);
      } else {
        return null;
      }
    });
  }, [allRevenue]);

  useEffect(() => {
    switch (chartSelection) {
      case "week":
        const weekData = getCurrentWeekData(allRevenue);
        setChartData(weekData);
        break;
      case "month":
        const monthData = getCurrentMonthData(allRevenue);
        setChartData(monthData);
        break;
      case "year":
        setChartData([]);
        break;
    }
    setLabel(xLabels[chartSelection]);
  }, [chartSelection, allRevenue]);

  return (
    <Box
      sx={{
        paddingX: { xs: "8px", md: "24px" },
        margin: 0,
        paddingBottom: "160px",
      }}
    >
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: "24px",
        }}
      >
        TỔNG QUAN
      </Typography>
      <AppBreadcrumbs />
      <Grid container marginTop={"24px"} gap={1}>
        <Grid
          item
          xs={12}
          md
          bgcolor={"#fff"}
          padding={"24px 16px"}
          borderRadius={"16px"}
        >
          <GridItemContent
            heading={"Doanh Thu Tháng"}
            DataIcon={AttachMoneyIcon}
            data={revenue}
            percentage={revenueRate}
            isMoney={true}
            count={orderCounts.all}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md
          bgcolor={"#fff"}
          padding={"24px 16px"}
          borderRadius={"16px"}
        >
          <GridItemContent
            heading={"Đơn Hàng Chưa Giao"}
            DataIcon={EventNoteOutlinedIcon}
            data={unfinishedOrdersValue}
            percentage={unfinishedRate}
            isMoney={true}
            count={orderCounts.unfinished}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md
          bgcolor={"#fff"}
          padding={"24px 16px"}
          borderRadius={"16px"}
        >
          <GridItemContent
            heading={"Đơn Hàng Đã Giao"}
            DataIcon={ShoppingBagOutlinedIcon}
            data={finishedOrdersValue}
            percentage={finishedRate}
            isMoney={true}
            count={orderCounts.finished}
          />
        </Grid>
      </Grid>

      <Grid container marginTop={"16px"} gap={1}>
        {/* -------------------CHART------------------- */}
        <Grid
          item
          xs={12}
          sm
          lg
          xl={8}
          bgcolor={"#fff"}
          borderRadius={"16px"}
          padding={"24px 16px"}
        >
          <Stack
            direction={{ xs: "column", lg: "row" }}
            alignItems={{ md: "center" }}
            justifyContent={{ md: "space-between" }}
          >
            <Typography fontSize={"20px"} fontWeight={600}>
              Biểu đồ Lợi nhuận
            </Typography>
            <Stack
              marginTop={{ xs: "8px", md: "0" }}
              direction={"row"}
              justifyContent={"space-between"}
              gap={"12px"}
            >
              <Button
                variant={chartSelection === "week" ? "contained" : "outlined"}
                onClick={() => setChartSelection("week")}
                sx={{
                  fontSize: "14px",
                  height: "32px",
                  paddingX: "16px",
                  flexGrow: 1,
                  width: {
                    xs: "auto",
                    md: "120px",
                  },
                  borderColor: colors.primaryColor,
                  color:
                    chartSelection === "week" ? "white" : colors.primaryColor,
                  bgcolor:
                    chartSelection === "week"
                      ? colors.primaryColor
                      : "transparent",
                  ":hover": {
                    bgcolor: chartSelection === "week" && colors.primaryColor,
                  },
                }}
              >
                TUẦN
              </Button>
              <Button
                variant={chartSelection === "month" ? "contained" : "outlined"}
                onClick={() => setChartSelection("month")}
                sx={{
                  fontSize: "14px",
                  height: "32px",
                  paddingX: "16px",
                  flexGrow: 1,
                  width: {
                    xs: "auto",
                    md: "120px",
                  },
                  borderColor: colors.primaryColor,
                  color:
                    chartSelection === "month" ? "white" : colors.primaryColor,
                  bgcolor:
                    chartSelection === "month"
                      ? colors.primaryColor
                      : "transparent",
                  ":hover": {
                    bgcolor: chartSelection === "month" && colors.primaryColor,
                  },
                }}
              >
                THÁNG
              </Button>
              <Button
                variant={chartSelection === "year" ? "contained" : "outlined"}
                onClick={() => setChartSelection("year")}
                sx={{
                  fontSize: "14px",
                  height: "32px",
                  paddingX: "16px",
                  flexGrow: 1,
                  width: {
                    xs: "auto",
                    md: "120px",
                  },
                  borderColor: colors.primaryColor,
                  color:
                    chartSelection === "year" ? "white" : colors.primaryColor,
                  bgcolor:
                    chartSelection === "year"
                      ? colors.primaryColor
                      : "transparent",
                  ":hover": {
                    bgcolor: chartSelection === "year" && colors.primaryColor,
                  },
                }}
              >
                NĂM
              </Button>
            </Stack>
          </Stack>
          <Divider sx={{ marginTop: "16px" }} />
          <LineChart
            xAxis={[
              {
                scaleType: "point",
                data: label,
              },
            ]}
            yAxis={[
              {
                valueFormatter: (v) => shortHandFormat(v),
              },
            ]}
            series={[
              {
                data: chartData.map((data) => Number(data.revenue)),
                color: colors.primaryColor,
                valueFormatter: (v) => (v === null ? "" : currencyFormatter(v)),
                showMark: false,
              },
            ]}
            height={300}
          />
        </Grid>

        {/* -------------------BEST SELLER------------------- */}
        <Grid
          item
          xs={12}
          sm
          lg
          bgcolor={"#fff"}
          borderRadius={"16px"}
          padding={"24px 16px"}
        >
          <Typography fontSize={"20px"} fontWeight={600}>
            Bán Chạy Nhất
          </Typography>
          <Divider sx={{ marginTop: "16px" }} />
          <Stack direction={"column"} marginTop={"16px"} gap={"12px"}>
            {bestSellers.length !== 0 ? (
              bestSellers
                .slice(0, 4)
                .map((item) => (
                  <ProductBrief
                    key={item.id}
                    imageUrl={item.variants[0].images[0]}
                    name={item.name}
                    price={formatVNDCurrency(item.variants[0].price)}
                    totalSales={item.total_purchase}
                    revenue={shortHandFormat(item.revenue)}
                    href={`/admin/products/${item.id}`}
                  />
                ))
            ) : (
              <Typography textAlign={"center"}>Chưa có dữ liệu</Typography>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* -------------------RECENT ORDERS------------------- */}
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
          <Button
            variant="contained"
            href="/admin/orders"
            sx={{
              paddingX: "16px",
              bgcolor: colors.primaryColor,
              color: "#fff",
              borderRadius: "8px",
              "&:hover": {
                bgcolor: "#8893cd",
              },
            }}
          >
            Xem tất cả
          </Button>
        </Stack>

        <TableContainer sx={{ maxHeight: 400 }}>
          <Table
            sx={{ minWidth: 800 }}
            aria-label="Recent Orders Table"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <TableCell align="left">Mã đơn</TableCell>
                <TableCell align="center">Số lượng sản phẩm</TableCell>
                <TableCell align="center">Ngày đặt</TableCell>
                <TableCell align="left">Tên khách hàng</TableCell>
                <TableCell align="left">Trạng thái</TableCell>
                <TableCell align="right">Tổng tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow 
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                  key={order.id}
                  sx={{
                    cursor: "pointer",
                    ":hover": {
                      bgcolor: "#f6f6f6"
                    }
                  }}
                >
                  <TableCell align="left">#{order.id}</TableCell>
                  <TableCell align="center">{order.total_quantity}</TableCell>
                  <TableCell align="center">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    align="left"
                  >
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
                      <Typography>
                        {order.customer_fullname}
                      </Typography>
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
                                return "black"
                            }
                          }
                        }}
                      >
                      </Box>
                      {ORDER_STATUS[order.status]}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    {formatVNDCurrency(order.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

const GridItemContent = ({
  heading,
  data,
  percentage,
  isMoney = false,
  count,
  DataIcon,
}) => (
  <Box>
    <Stack direction={"row"} alignItems={"center"} gap={"4px"}>
      <Typography fontWeight={600}>{heading}</Typography>
      <Typography fontSize={"14px"} fontWeight={500}>
        ({count})
      </Typography>
    </Stack>
    <Stack marginTop={"8px"} direction={"row"} justifyContent={"space-between"}>
      <Stack direction={"row"} gap={"12px"} alignItems={"center"}>
        <Icon
          sx={{
            bgcolor: colors.primaryColor,
            color: "#fff",
            borderRadius: "8px",
          }}
        >
          <DataIcon sx={{ scale: 0.7 }} />
        </Icon>
        <Typography fontWeight={600}>
          {isMoney ? formatVNDCurrency(data) : data}
        </Typography>
      </Stack>
      {percentage && (
        <Box display={"flex"}>
          <Icon>
            {percentage < 0 ? (
              <ArrowDownwardIcon sx={{ fill: colors.red, scale: 0.8 }} />
            ) : (
              <ArrowUpwardIcon sx={{ fill: "#45C266", scale: 0.8 }} />
            )}
          </Icon>
          <Typography
            color={percentage < 0 ? colors.red : "#45C266"}
            fontSize={"14px"}
            fontWeight={500}
          >
            {percentage}%
          </Typography>
        </Box>
      )}
    </Stack>
    {percentage && (
      <Typography
        marginTop={"4px"}
        fontSize={"14px"}
        width={"100%"}
        textAlign={"end"}
      >
        So với tháng trước
      </Typography>
    )}
  </Box>
);

export default Dashboard;
