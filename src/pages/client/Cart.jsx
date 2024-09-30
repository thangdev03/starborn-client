import {
  Box,
  Checkbox,
  Grid,
  IconButton,
  Typography,
  Skeleton,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { colors, serverUrl } from "../../services/const";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { formatVNDCurrency } from "../../utils/currencyUtils";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Cart = () => {
  const [cartItems, setCartItems] = useState();
  const [loading, setLoading] = useState(true);
  const { openAuthModal, authToken, currentUser } = useAuth();

  const getCartItems = async () => {
    if (currentUser) {
      axios
        .get(serverUrl + `cart/${currentUser.id}`, {
          withCredentials: true,
        })
        .then((res) => setCartItems(res.data))
        .catch((error) => {
          console.log(error);

          if (error.status === 403) {
            openAuthModal();
          }
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    getCartItems();
  }, [authToken]);

  console.log(cartItems);

  return (
    <Box
      sx={{
        marginTop: "32px",
        padding: {
          sm: "8px",
          md: "0 52px",
        },
        minHeight: "50vh",
      }}
    >
      <Typography fontSize={"20px"} fontWeight={500}>
        Giỏ hàng
      </Typography>

      <Box></Box>
      <Grid
        container
        columnSpacing={"4px"}
        bgcolor={"rgba(183, 183, 183, 0.15)"}
        marginTop={"40px"}
        marginBottom={"32px"}
        width={"100%"}
        sx={{
          justifyContent: "space-between",
          borderRadius: "4px",
          paddingY: "12px",
          paddingX: "8px",
        }}
      >
        <Grid item>
          <Checkbox />
        </Grid>
        <Grid item alignSelf={"center"} xs={3}>
          <Typography fontSize={"14px"}>Sản phẩm</Typography>
        </Grid>
        <Grid item alignSelf={"center"} xs={1} lg={2}>
          <Typography fontSize={"14px"} textAlign={"center"}>Phân loại</Typography>
        </Grid>
        <Grid item alignSelf={"center"} xs={1} lg={2}>
          <Typography fontSize={"14px"} textAlign={"center"}>Số lượng</Typography>
        </Grid>
        <Grid item alignSelf={"center"} xs={1} lg={2}>
          <Typography fontSize={"14px"} textAlign={"center"}>Đơn giá</Typography>
        </Grid>
        <Grid item alignSelf={"center"} xs={1} lg={2}>
          <Typography fontSize={"14px"} textAlign={"center"}>Thành tiền</Typography>
        </Grid>
        <Grid item>
          <IconButton>
            <DeleteOutlineRoundedIcon sx={{ color: colors.primaryColor }} />
          </IconButton>
        </Grid>
      </Grid>

      {loading ? (
        [1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            width={"100%"}
            height={"112px"}
            sx={{ marginBottom: "16px" }}
          />
        ))
      ) : cartItems ? (
        cartItems.map((item) => (
          <Grid
            container
            columnSpacing={"4px"}
            bgcolor={"rgba(183, 183, 183, 0.15)"}
            width={"100%"}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: "4px",
              paddingY: "12px",
              paddingX: "8px",
              marginBottom: "16px"
            }}
          >
            <Grid item>
              <Checkbox />
            </Grid>
            <Grid item alignSelf={"center"} xs={3}>
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <Box>
                  <img
                    src={item.image_url}
                    alt=""
                    width={"80px"}
                    height={"80px"}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                </Box>
                <Typography fontSize={"14px"}>{item.name}</Typography>
              </Stack>
            </Grid>
            <Grid item alignSelf={"center"} xs={1} lg={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
              <Typography fontSize={"14px"} textAlign={"center"} alignSelf={'center'} width={"fit-content"} paddingY={"4px"}>
                {`${item.color}, ${item.size}`}
              </Typography>
              <ArrowDropDownIcon />
            </Grid>
            <Grid item alignSelf={"center"} xs={1} lg={2}>
              <Typography fontSize={"14px"} textAlign={"center"}>{item.quantity}</Typography>
            </Grid>
            <Grid item alignSelf={"center"} xs={1} lg={2}>
              <Typography fontSize={"14px"} textAlign={"center"}>
                {formatVNDCurrency(item.price)}
              </Typography>
            </Grid>
            <Grid item alignSelf={"center"} xs={1} lg={2}>
              <Typography fontSize={"14px"} textAlign={"center"} sx={{ color: colors.red }}>
                {formatVNDCurrency(item.price * item.quantity)}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton>
                <DeleteOutlineRoundedIcon sx={{ color: colors.primaryColor }} />
              </IconButton>
            </Grid>
          </Grid>
        ))
      ) : (
        <Typography>Chưa có sản phẩm nào trong giỏ hàng</Typography>
      )}
    </Box>
  );
};

export default Cart;
