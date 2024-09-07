import {
  Box,
  IconButton,
  InputBase,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AppBreadcrumbs from "../../components/common/AppBreadcrumbs";
import SearchIcon from "@mui/icons-material/Search";
import { serverUrl } from "../../services/const";
import axios from "axios";
import { colors } from "../../services/const";
import { visuallyHidden } from "@mui/utils";
import VisibilityIcon from '@mui/icons-material/Visibility';

const headCells = [
  {
    id: "serial",
    numeric: true,
    disablePadding: false,
    label: "STT",
    sortable: false,
    alignDirection: 'center'
  },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Tên",
    sortable: true,
    alignDirection: 'left'
  },
  {
    id: "phone",
    numeric: true,
    disablePadding: false,
    label: "Số điện thoại",
    sortable: true,
    alignDirection: 'left'
  },
  {
    id: "email",
    numeric: true,
    disablePadding: false,
    label: "Email",
    sortable: true,
    alignDirection: 'left'
  },
  {
    id: "totalExpense",
    numeric: true,
    disablePadding: false,
    label: "Tổng thanh toán",
    sortable: true,
    alignDirection: 'right'
  },
  {
    id: "detailView",
    numeric: true,
    disablePadding: false,
    label: "Xem chi tiết",
    sortable: false,
    alignDirection: 'center'
  },
];

const Customers = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState("");

  const getData = () => {
    axios
      .get(serverUrl + "customers")
      .then((res) => setData(res.data))
      .catch((err) => {
        console.log(err);
        setData([]);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchRequest = () => {
    axios
      .get(serverUrl + "customers?keywords=" + searchText)
      .then((res) => {
        if (res.status === 404) {
          return setData([]);
        }
        return setData(res.data);
      })
      .catch((err) => {
        console.log(err);
        setData([]);
      });
  };

  // Avoid a layout jump when reaching the last page with empty data.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...data]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, data]
  );

  return (
    <Box
      sx={{
        paddingX: { xs: "8px", md: "24px" },
        margin: 0,
        paddingBottom: "160px",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ md: "end" }}
        justifyContent={"space-between"}
        gap={{ xs: "12px", md: "auto" }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "24px",
            }}
          >
            KHÁCH HÀNG
          </Typography>
          <AppBreadcrumbs />
        </Box>
        <Stack direction={"row"} gap={"8px"}>
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
      </Stack>

      <Box
        sx={{
          marginTop: "24px",
          bgcolor: "white",
          borderRadius: "16px",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.length !== 0 ? (
                visibleRows.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      key={row.id}
                    >
                      <TableCell
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell align="left">{row.fullname}</TableCell>
                      <TableCell align="left" sx={{ paddingRight: "40px" }}>
                        {row.phone}
                      </TableCell>
                      <TableCell align="left" sx={{ paddingRight: "40px" }}>
                        {row.email || "Chưa có"}
                      </TableCell>
                      <TableCell align="right">
                        {'HÀM TÍNH TỔNG'}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton href={`/admin/customers/${row.id}`}>
                          <VisibilityIcon sx={{ color: colors.primaryColor }}/>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={"100%"}
                    sx={{ fontSize: "16px", textAlign: "center" }}
                  >
                    Không tìm thấy sản phẩm nào!
                  </TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead(props) {
  const {
    order,
    orderBy,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignDirection}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
                sx={{ color: colors.primaryColor, opacity: 1 }}
              >
                <span style={{ fontWeight: 600, fontSize: "16px" }}>
                  {headCell.label}
                </span>
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <Typography sx={{ fontWeight: 600 }}>{headCell.label}</Typography>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default Customers;
