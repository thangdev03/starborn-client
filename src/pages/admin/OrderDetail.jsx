import React, { useEffect, useState } from "react";
import AppBreadcrumbs from "../../components/common/AppBreadcrumbs";
import { Box, Button, Modal, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { colors, ORDER_STATUS, PAYMENT_METHOD, serverUrl } from "../../services/const";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import axios from "axios";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { formatVNDCurrency } from "../../utils/currencyUtils";
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CancelPresentationOutlinedIcon from '@mui/icons-material/CancelPresentationOutlined';
import { toast } from "react-toastify";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OrderInvoice from "../../components/admin/OrderInvoice";

const OrderDetail = () => {
  let { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleOpenReasonModal = () => {
    setOpenModal(true);
  };

  const handleCloseReasonModal = () => {
    setOpenModal(false);
  };

  const getData = async () => {
    setLoading(true)
    axios
      .get(serverUrl + `orders/${orderId}`,
        {
          withCredentials: true
        }
      )
      .then((res) => setOrderData(res.data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (status) => {
    setUpdating(true)
    axios
      .put(serverUrl + `orders/status/${orderId}`, {
        status
      }, {
        withCredentials: true
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          getData();
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setUpdating(false));
  };

  const handleCancel = async () => {
    setUpdating(true)
    axios
      .put(serverUrl + `orders/cancel/${orderId}`,
        {
          orderItems: orderData?.orderItems,
          cancelReason
        },
        {
          withCredentials: true
        }
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          getData();
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setUpdating(false)
        handleCloseReasonModal();
      });
  };

  const renderActionBtn = (orderData) => {
    switch (orderData?.status) {
      case 1: 
        return !orderData?.confirmed_at ? (
          <ActionButton
            disabled={updating}
            title={"Xác nhận đơn"}
            handleClick={() => handleUpdateStatus(1)}
          />
        ) : (
          <ActionButton 
            disabled={updating}
            title={"Bắt đầu giao hàng"}
            handleClick={() => handleUpdateStatus(2)}
          />
        )
      case 2: 
        return (
          <ActionButton 
            disabled={updating}
            title={"Xác nhận hoàn thành"}
            handleClick={() => handleUpdateStatus(3)}
          />
        )
      default:
        return;
    }
  };

  useEffect(() => {
    getData();
  }, [orderId])

  console.log(orderData)
  return (
    !loading && (
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
          <AppBreadcrumbs item={`Chi tiết đơn #${orderId}`} />
        </Box>

        {/* Order Information */}
        <Stack
          marginTop={"24px"}
          gap={"24px"}
          padding={"24px 16px"}
          borderRadius={"8px"}
          sx={{ backgroundColor: "#FAFAFA" }}
        >
          <Box>
            <Stack direction={"row"} alignItems={"center"} gap={"24px"}>
              <Typography fontSize={"20px"} fontWeight={600}>
                Mã đơn: #{orderId}
              </Typography>
              <Typography
                sx={{
                  padding: "4px 12px",
                  bgcolor: colors.red,
                  color: "white",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                {ORDER_STATUS[orderData.status]}
              </Typography>
            </Stack>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"start"}
              marginTop={"12px"}
            >
              <Stack gap={"8px"}>
                <Stack direction={"row"} gap={"4px"}>
                  <CalendarMonthOutlinedIcon />
                  <Typography fontWeight={400}>
                    Tạo vào {new Date(orderData.created_at).toLocaleString()}
                  </Typography>
                </Stack>
                {orderData.confirmed_at && (
                  <Stack direction={"row"} gap={"4px"}>
                    <Inventory2OutlinedIcon />
                    <Typography fontWeight={400}>
                      Xác nhận vào{" "}
                      {new Date(orderData.confirmed_at).toLocaleString()}
                    </Typography>
                  </Stack>
                )}
                {orderData.shipped_at && (
                  <Stack direction={"row"} gap={"4px"}>
                    <LocalShippingOutlinedIcon />
                    <Typography fontWeight={400}>
                      Bắt đầu giao vào{" "}
                      {new Date(orderData.shipped_at).toLocaleString()}
                    </Typography>
                  </Stack>
                )}
                {orderData.received_at && (
                  <Stack direction={"row"} gap={"4px"}>
                    <AssignmentTurnedInOutlinedIcon />
                    <Typography fontWeight={400}>
                      Hoàn thành vào{" "}
                      {new Date(orderData.received_at).toLocaleString()}
                    </Typography>
                  </Stack>
                )}
                {orderData.status === 0 && (
                  <Stack direction={"row"} gap={"4px"}>
                    <CancelPresentationOutlinedIcon />
                    <Typography fontWeight={400}>
                      Hủy đơn vào{" "}
                      {new Date(orderData.updated_at).toLocaleString()}
                    </Typography>
                  </Stack>
                )}
              </Stack>
              <Stack direction={"row"} alignItems={"center"} gap={"20px"}>
                {/* Ở mỗi status thì một button hoạt động khác nhau */}
                {renderActionBtn(orderData)}

                {orderData.status === 1 && (
                  <Button
                    variant="contained"
                    title="Hủy đơn"
                    disabled={updating}
                    onClick={handleOpenReasonModal}
                    sx={{
                      padding: "8px 16px",
                      bgcolor: "#EEECEC",
                      color: colors.red,
                      boxShadow: "none",
                      ":hover": {
                        bgcolor: "#EEEEEE",
                      },
                    }}
                  >
                    <CancelOutlinedIcon />
                  </Button>
                )}
                <ReasonConfirmModel 
                  open={openModal}
                  handleClose={handleCloseReasonModal}
                  inputValue={cancelReason}
                  onChangeInput={(value) => setCancelReason(value)}
                  handleSubmit={handleCancel}
                />
                <PDFDownloadLink
                  document={<OrderInvoice orderData={orderData}/>}
                  fileName={`Starborn-invoice-order-${orderId}.pdf`}
                  style={{
                    color: colors.primaryColor,
                  }}
                >
                  {({ blob, url, loading, error }) => {
                    return loading ? (
                      "Loading..."
                    ) : (
                      <Button
                        variant="contained"
                        title="In hóa đơn"
                        sx={{
                          padding: "8px 16px",
                          bgcolor: "#EEECEC",
                          color: colors.primaryColor,
                          boxShadow: "none",
                          ":hover": {
                            bgcolor: "#EEEEEE",
                          },
                        }}
                      >
                        <PrintOutlinedIcon />
                      </Button>
                    );
                  }}
                </PDFDownloadLink>
              </Stack>
            </Stack>
          </Box>

          {orderData?.status === 0 && (
            <Typography fontStyle={"italic"}>Lý do hủy: {orderData.cancel_reason}</Typography>
          )}

          {/* CUSTOMER AND SHIPPING INFO */}
          <Stack direction={"row"} gap={"16px"}>
            <Stack
              flexGrow={1}
              flex={1}
              justifyContent={"space-between"}
              flexShrink={0}
              gap={"32px"}
              sx={{
                bgcolor: "white",
                border: "1px solid #E7E7E3",
                borderRadius: "16px",
                padding: "16px 24px",
              }}
            >
              <Stack direction={"row"} gap={"16px"}>
                <Stack
                  justifyContent={"center"}
                  alignItems={"center"}
                  sx={{
                    bgcolor: "#4A69E2",
                    borderRadius: "8px",
                    width: "56px",
                    height: "56px",
                  }}
                >
                  <PersonOutlineOutlinedIcon
                    sx={{ color: "white", fontSize: "24px" }}
                  />
                </Stack>
                <Stack gap={"4px"}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "18px",
                    }}
                  >
                    Khách hàng
                  </Typography>
                  <Typography sx={{ fontSize: "14px", opacity: 0.7 }}>
                    Họ tên: {orderData.customer_fullname}
                  </Typography>
                  <Typography sx={{ fontSize: "14px", opacity: 0.7 }}>
                    Email: {orderData.customer_email}
                  </Typography>
                  <Typography sx={{ fontSize: "14px", opacity: 0.7 }}>
                    SĐT: {orderData.customer_phone}
                  </Typography>
                </Stack>
              </Stack>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate(`/admin/customers/${orderData?.customer_id}`)}
                sx={{
                  bgcolor: colors.primaryColor,
                  color: "white",
                  borderRadius: "8px",
                  ":hover": {
                    bgcolor: "#1B2141dd",
                  },
                }}
              >
                Xem hồ sơ
              </Button>
            </Stack>

            <Stack
              flexGrow={1}
              flex={1}
              justifyContent={"space-between"}
              gap={"32px"}
              sx={{
                bgcolor: "white",
                border: "1px solid #E7E7E3",
                borderRadius: "16px",
                padding: "16px 24px",
              }}
            >
              <Stack direction={"row"} gap={"16px"}>
                <Stack
                  justifyContent={"center"}
                  alignItems={"center"}
                  flexShrink={0}
                  sx={{
                    bgcolor: "#4A69E2",
                    borderRadius: "8px",
                    width: "56px",
                    height: "56px",
                  }}
                >
                  <LocalMallOutlinedIcon
                    sx={{ color: "white", fontSize: "24px" }}
                  />
                </Stack>
                <Stack gap={"4px"}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "18px",
                    }}
                  >
                    Thông tin giao hàng
                  </Typography>
                  <Typography sx={{ fontSize: "14px", opacity: 0.7 }}>
                    Người nhận: {orderData.receiver_name}
                  </Typography>
                  <Typography sx={{ fontSize: "14px", opacity: 0.7 }}>
                    SĐT người nhận: {orderData.receiver_phone}
                  </Typography>
                  <Typography sx={{ fontSize: "14px", opacity: 0.7 }}>
                    Email người nhận: {orderData.receiver_email}
                  </Typography>
                  <Typography sx={{ fontSize: "14px", opacity: 0.7 }}>
                    Địa chỉ: {orderData.shipping_address},{" "}
                    {`${orderData.shipping_ward}, `}
                    {orderData.shipping_district}, {orderData.shipping_province}
                  </Typography>
                  <Typography sx={{ fontSize: "14px", opacity: 0.7 }}>
                    PTTT: {PAYMENT_METHOD[orderData.payment_method]}
                  </Typography>
                </Stack>
              </Stack>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: colors.primaryColor,
                  color: "white",
                  borderRadius: "8px",
                  ":hover": {
                    bgcolor: "#1B2141dd",
                  },
                }}
              >
                Xem hồ sơ
              </Button>
            </Stack>
          </Stack>

          {/* NOTE */}
          <Box>
            <Typography fontWeight={600} fontSize={"20px"}>
              Ghi chú
            </Typography>
            <Box
              sx={{
                marginTop: "10px",
                padding: "16px",
                borderRadius: "16px",
                border: "1px solid #E7E7E3",
                minHeight: "80px",
              }}
            >
              <Typography>Không có ghi chú.</Typography>
            </Box>
          </Box>
        </Stack>

        {/* Order Items */}
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
            <Typography fontSize={"20px"} fontWeight={600} ml={"12px"}>
              Sản phẩm
            </Typography>
          </Stack>

          <TableContainer sx={{ maxHeight: 400 }}>
            <Table
              sx={{ minWidth: 800 }}
              aria-label="Recent Orders Table"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  <TableCell align="left">Tên sản phẩm</TableCell>
                  <TableCell align="center">Màu sắc</TableCell>
                  <TableCell align="center">Kích cỡ</TableCell>
                  <TableCell align="center">Số lượng</TableCell>
                  <TableCell align="right">Tạm tính</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderData.orderItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        gap={"16px"}
                      >
                        <Box
                          width={"40px"}
                          height={"40px"}
                          borderRadius={"8px"}
                          overflow={"hidden"}
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
                        {item.name}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">{item.color}</TableCell>
                    <TableCell align="center">{item.size}</TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">
                      {formatVNDCurrency(item.purchased_price)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell rowSpan={orderData.coupon_code ? 5 : 4} colSpan={3} />
                  <TableCell sx={{ fontWeight: 500 }}>Tạm tính</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 500 }}>
                    {formatVNDCurrency(
                      orderData?.orderItems?.reduce(
                        (acc, item) => acc + Number(item.purchased_price),
                        0
                      )
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 500 }}>Phí vận chuyển</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 500 }}>
                    {formatVNDCurrency(orderData.shipping_fee)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 500 }}>Giảm giá</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 500 }}>
                    {formatVNDCurrency(orderData.discount_amount)}
                  </TableCell>
                </TableRow>
                {orderData.coupon_code && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 500 }}>Mã giảm giá</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                      {orderData.coupon_code}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: "20px" }}>
                    Tổng
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, fontSize: "20px" }}
                  >
                    {formatVNDCurrency(orderData.total)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    )
  );
};

const ActionButton = ({ title, disabled, handleClick = () => {} }) => {
  return (
    <Button
      disabled={disabled}
      variant="contained"
      onClick={handleClick}
      sx={{
        padding: "8px 16px",
        bgcolor: "#EEECEC",
        color: colors.primaryColor,
        boxShadow: "none",
        ":hover": {
          bgcolor: "#EEEEEE",
        },
      }}
    >
      {title}
      <NavigateNextRoundedIcon />
    </Button>
  );
};

const ReasonConfirmModel = ({ open = true, handleClose = () => {}, inputValue, onChangeInput = () => {}, handleSubmit = () => {} }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 3,
        borderRadius: "8px"
      }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Lý do hủy đơn*
        </Typography>
        <TextField
          required
          fullWidth
          hiddenLabel={true}
          multiline
          rows={4}
          value={inputValue}
          onChange={(e) => onChangeInput(e.target.value)}
          sx={{
            marginTop: 2
          }}
        />
        <Stack mt={1} gap="4px">
          <Button variant="contained" disabled={!inputValue} onClick={handleSubmit}>
            Xác nhận hủy đơn
          </Button>
          <Button onClick={() => handleClose()}>
            Hủy thao tác
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}

export default OrderDetail;
