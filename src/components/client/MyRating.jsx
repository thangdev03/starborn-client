import {
  Box,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { colors, serverUrl } from "../../services/const";
import axios from "axios";
import dayjs from "dayjs";
import { formatVNDCurrency } from "../../utils/currencyUtils";
import { Link } from "react-router-dom";
import StarIcon from '@mui/icons-material/Star';

const MyRating = () => {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [rateList, setRateList] = useState([]);

  const getData = () => {
    setLoading(true);
    axios
      .get(serverUrl + `rating?customerId=${currentUser.id}`, {
        withCredentials: true,
      })
      .then((res) => {
        const ordersResult = res.data;
        setRateList(ordersResult);
      })
      .catch((error) => {
        console.log(error);
        setRateList([]);
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
        Lịch sử đánh giá & phản hồi
      </Typography>

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
        ) : rateList.length !== 0 ? (
          rateList.map((rating) => (
            <RatingItems key={rating.id} rating={rating} />
          ))
        ) : (
          <Typography textAlign={"center"}>
            Bạn chưa đánh giá sản phẩm nào TvT
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

const RatingItems = ({ rating }) => {
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
              Ngày đánh giá
            </Typography>
            <Typography
              fontFamily={"Roboto"}
              fontWeight={500}
              fontSize={"14px"}
            >
              {new dayjs(rating?.created_at).format("DD-MM-YYYY")}
            </Typography>
          </Stack>
          <Stack alignItems={"center"}>
            <Typography
              fontFamily={"Roboto"}
              color={"rgba(27, 33, 65, 0.6)"}
              fontWeight={500}
              fontSize={"14px"}
            >
              Điểm đánh giá
            </Typography>
            <Stack
              direction={"row"}
              alignItems={"center"}
            >
              <Typography
                fontFamily={"Roboto"}
                fontWeight={500}
                fontSize={"14px"}
              >
                {(rating?.rating)}
              </Typography>
              <StarIcon sx={{ height: "16px", color: colors.yellow }}/>
            </Stack>
          </Stack>
        </Stack>
        <Stack alignItems={"end"}>
          <Typography
            fontFamily={"Roboto"}
            color={"rgba(27, 33, 65, 0.6)"}
            fontWeight={500}
            fontSize={"14px"}
          >
            Trong mã đơn #{rating?.order_detail_id}
          </Typography>
          <Stack direction={"row"} gap={"20px"}>
            <Link
              to={`/account/orders/${rating?.order_detail_id}`}
              style={{
                fontSize: "14px",
                color: "#334FE0",
              }}
            >
              Xem đơn hàng
            </Link>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: "rgba(27, 33, 65, 0.5)" }}
            />
            <Link
              to={`/product/${rating?.product_slug}?color=${rating?.variant_slug}`}
              style={{
                fontSize: "14px",
                color: "#334FE0",
              }}
            >
              Xem trực tiếp sản phẩm
            </Link>
          </Stack>
        </Stack>
      </Stack>

      <Link
        to={`/account/orders/${rating?.order_detail_id}`}
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
                src={rating.image_url}
                alt={rating.name}
                width={"100%"}
                height={"100%"}
                style={{
                  objectFit: "cover",
                }}
              />
            </Box>
            <Box flexGrow={1}>
              <Typography
                title={rating.name}
                marginBottom={"4px"}
                fontWeight={600}
                maxWidth={"70%"}
                sx={{
                  textWrap: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {rating.name}
              </Typography>
              <Typography fontSize={"14px"}>
                Phân loại: {rating.color}, {rating.size}
              </Typography>
            </Box>
          </Stack>
          <Box>
            <Typography fontSize={"14px"}>
              {formatVNDCurrency(rating.purchased_price)}
            </Typography>
          </Box>
        </Stack>
      </Link>
    </Box>
  );
};

export default MyRating;
