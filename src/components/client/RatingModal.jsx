import {
  Box,
  Button,
  Divider,
  Modal,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import RedButton from "../common/RedButton";
import axios from "axios";
import { serverUrl } from "../../services/const";
import { toast } from "react-toastify";

const RatingModal = ({ open, orderItems, triggerClose = () => {} }) => {
  const [rates, setRates] = useState(0);

  const onChangeRate = (orderItemId, newValue) => {
    setRates((prev) => ({
      ...prev,
      [orderItemId]: {
        ...prev[orderItemId],
        rating: newValue,
      },
    }));
  };

  const handleCancel = () => {
    setRates({});
    triggerClose();
  };

  const handleSubmit = () => {
    axios
      .post(
        serverUrl + "rating",
        {
          items: Object.values(rates),
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        toast.success("Đánh giá đơn hàng thành công");
        triggerClose();
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    const initialRates = orderItems.reduce((acc, orderItem) => {
      acc[orderItem.order_item_id] = {
        orderItemId: orderItem.order_item_id,
        productId: orderItem.product_id,
        rating: 0,
      };
      return acc;
    }, {});
    setRates(initialRates);
  }, []);

  return (
    <Modal open={open} onClose={triggerClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#fff",
          width: "600px",
          padding: 2,
          borderRadius: "8px",
        }}
      >
        <Typography fontWeight={500} fontSize={"18px"}>
          Đánh giá sản phẩm
        </Typography>
        {orderItems.map((item, index) => (
          <Box key={index}>
            <Stack direction={"row"} gap={"8px"} marginTop={"12px"}>
              <Box
                width={"80px"}
                height={"80px"}
                border={"1px solid rgba(27, 33, 65, 0.3)"}
                borderRadius={"4px"}
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
              <Box>
                <Typography>Tên sản phẩm: {item.name}</Typography>
                <Typography mt={"4px"}>
                  Phân loại: {item.color}/{item.size}
                </Typography>
              </Box>
            </Stack>
            <Stack direction={"row"} justifyContent={"center"}>
              <Rating
                value={rates[item.order_item_id]?.rating}
                onChange={(e, value) => onChangeRate(item.order_item_id, value)}
                precision={0.5}
                size="large"
              />
            </Stack>
            <Divider sx={{ mt: "8px", mb: "12px" }} />
          </Box>
        ))}
        <Stack direction={"row"} justifyContent={"right"} gap={"8px"}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{
              borderRadius: "8px",
            }}
          >
            Hủy
          </Button>
          <RedButton
            title={"Gửi đánh giá"}
            onClick={() => handleSubmit()}
            customStyle={{
              py: "8px",
            }}
          />
        </Stack>
      </Box>
    </Modal>
  );
};

export default RatingModal;
