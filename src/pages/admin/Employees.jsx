import {
  Box,
  Button,
  IconButton,
  InputBase,
  Stack,
  Switch,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import { formatVNDCurrency } from "../../utils/currencyUtils";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import CreateEmployeeModal from "../../components/admin/CreateEmployeeModal";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const headCells = [
  {
    id: "serial",
    numeric: true,
    disablePadding: false,
    label: "STT",
    sortable: false,
    alignDirection: "center",
  },
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "Tên",
    sortable: true,
    alignDirection: "left",
  },
  {
    id: "phone",
    numeric: true,
    disablePadding: false,
    label: "Số điện thoại",
    sortable: true,
    alignDirection: "center",
  },
  {
    id: "updateActive",
    numeric: false,
    disablePadding: false,
    label: "Trạng thái tài khoản",
    sortable: false,
    alignDirection: "center",
  },
  {
    id: "updateActive",
    numeric: false,
    disablePadding: false,
    label: "Hành động",
    sortable: false,
    alignDirection: "center",
  },
  // {
  //   id: "detailView",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "Lịch sử hoạt động",
  //   sortable: false,
  //   alignDirection: 'center'
  // },
];

const Employees = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const getData = () => {
    axios
      .get(serverUrl + "employees")
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

  const handleDelete = async (employeeId) => {
    if (window.confirm("Bạn chắc chắn muốn xóa tài khoản này không?")) {
        axios
          .delete(serverUrl + `employees/${employeeId}`,
            {
                withCredentials: true
            }
          )
          .then((res) => {
            if (res.status === 200) {
                toast.success("Đã xóa thành công!")
                getData();
            }
          })
          .catch((error) => {
            console.log(error);
          })
    }
  }

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

  const handleToggleSwitch = async (currentValue, thisCustomerId) => {
    if (currentUser?.is_admin === 1) {
      // axios.put(serverUrl + `customers/activation/${thisCustomerId}`,
      //   {
      //     is_active: currentValue
      //   },
      //   {
      //     withCredentials: true
      //   }
      // )
      // .then((res) => {
      //   getData();
      //   toast.success("Cập nhật thành công!");
      // })
      // .catch((err) => console.log(err))
    }
  };

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
            TÀI KHOẢN NHÂN VIÊN
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
          <Button
            onClick={handleOpenModal}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textDecoration: "none",
              textTransform: "none",
              color: "white",
              bgcolor: colors.red,
              borderRadius: "8px",
              width: "100px",
              fontSize: "14px",
              fontWeight: 500,
              transitionProperty: "all",
              transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              transitionDuration: "150ms",
              cursor: "pointer",
              "&:hover": {
                bgcolor: colors.red,
                opacity: 0.8,
              },
            }}
          >
            <AddCircleOutlineRoundedIcon
              sx={{ width: "18px", marginRight: "4px" }}
            />
            Thêm
          </Button>
          <CreateEmployeeModal 
            isOpen={isOpenModal}
            handleClose={handleCloseModal}
            reloadData={getData}
          />
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
                    <TableRow hover key={row.id}>
                      <TableCell
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell align="left">
                        <Typography fontSize={"14px"}>
                            {row.username} {row.id === currentUser.id && <span style={{ fontStyle: "italic", fontWeight: 500 }}>(Hiện tại)</span>}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ paddingRight: "40px" }}>
                        {row.phone}
                      </TableCell>
                      <TableCell align="center">
                        {row?.is_admin === 1 ? (
                          <Typography>Admin</Typography>
                        ) : (
                          <Switch
                            disabled={currentUser?.is_admin === 0}
                            checked={row.is_active === 1 ? true : false}
                            onClick={() =>
                              handleToggleSwitch(row.is_active, row.id)
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                          <IconButton
                            disabled={row.id === currentUser.id}
                            onClick={() => handleDelete(row.id)}
                          >
                            <DeleteIcon sx={{ color: row.id === currentUser.id ? "#1B214155" : colors.primaryColor }}/>
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
                    Không tìm thấy bản ghi nào!
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
  const { order, orderBy, onRequestSort } = props;
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

export default Employees;
