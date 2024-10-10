import {
  Paper,
  Stack,
  Typography,
  Skeleton,
  TextField,
  Select,
  MenuItem,
  Button,
  Modal,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { colors, serverUrl } from "../../services/const";
import RedButton from "../../components/common/RedButton";

const MyInfo = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    gender: 0,
    birthday: "",
    height: "",
    weight: "",
  });
  const [password, setPassword] = useState({
    current: "",
    new: "",
  });
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    setPassword({
      current: "",
      new: "",
    });
  };

  const handleChange = (e, field) => {
    console.log(e.target.value);
    setUserInfo((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    axios
      .put(serverUrl + `customers/${currentUser.id}`, {
        fullname: userInfo.name,
        gender: userInfo.gender,
        birthday: userInfo.birthday,
        height: userInfo.height,
        weight: userInfo.weight,
      })
      .then((res) => {
        if (res.status === 200) {
          return getData();
        }
      })
      .catch((error) => console.log(error));
  };
  const getData = async () => {
    setLoading(true);
    axios
      .get(serverUrl + `customers/${currentUser?.id}`, {
        withCredentials: true
      })
      .then((res) => {
        const dateObject = new Date(res.data.birthday);
        const timezoneOffset = dateObject.getTimezoneOffset() * 60000; // Convert to milliseconds
        const localDate = new Date(dateObject.getTime() - timezoneOffset);

        setUserInfo({
          name: res.data.fullname,
          email: res.data.email,
          phone: res.data.phone,
          gender: res.data.gender,
          birthday: localDate.toISOString().split("T")[0] || "",
          height: res.data.height || "",
          weight: res.data.weight || "",
        });
      })
      .catch((error) => console.log(error))
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
      }}
    >
      <Typography fontSize={"28px"} fontWeight={500}>
        Thông tin tài khoản
      </Typography>

      <Stack
        direction={"row"}
        marginTop={"40px"}
        justifyContent={"space-between"}
        gap={"124px"}
      >
        <Stack gap={"20px"} flexGrow={1}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexGrow={1}
            gap={"48px"}
          >
            <Typography width={"120px"}>Họ và tên</Typography>
            {loading ? (
              <Skeleton
                variant="rounded"
                height={"40px"}
                sx={{ flexGrow: 1 }}
              />
            ) : (
              <TextField
                hiddenLabel
                variant="filled"
                size="small"
                value={userInfo.name}
                onChange={(e) => handleChange(e, "name")}
                sx={{
                  flexGrow: 1,
                }}
              />
            )}
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexGrow={1}
            gap={"48px"}
          >
            <Typography width={"120px"}>Email</Typography>
            {loading ? (
              <Skeleton
                variant="rounded"
                height={"40px"}
                sx={{ flexGrow: 1 }}
              />
            ) : (
              <TextField
                hiddenLabel
                variant="filled"
                size="small"
                value={userInfo.email}
                InputProps={{
                  inputProps: {
                    readOnly: true,
                    style: { cursor: "not-allowed" },
                  },
                }}
                onChange={(e) => handleChange(e, "email")}
                sx={{
                  flexGrow: 1,
                }}
              />
            )}
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexGrow={1}
            gap={"48px"}
          >
            <Typography width={"120px"}>Số điện thoại</Typography>
            {loading ? (
              <Skeleton
                variant="rounded"
                height={"40px"}
                sx={{ flexGrow: 1 }}
              />
            ) : (
              <TextField
                hiddenLabel
                variant="filled"
                size="small"
                InputProps={{
                  inputProps: {
                    readOnly: true,
                    style: { cursor: "not-allowed" },
                  },
                }}
                value={userInfo.phone}
                onChange={(e) => handleChange(e, "phone")}
                sx={{
                  flexGrow: 1,
                }}
              />
            )}
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexGrow={1}
            gap={"48px"}
          >
            <Typography width={"120px"}>Giới tính</Typography>
            {loading ? (
              <Skeleton
                variant="rounded"
                height={"40px"}
                sx={{ flexGrow: 1 }}
              />
            ) : (
              <Select
                size="small"
                variant="filled"
                hiddenLabel
                value={userInfo.gender}
                onChange={(e) => handleChange(e, "gender")}
                sx={{ flexGrow: 1 }}
              >
                <MenuItem value={0}>Nam</MenuItem>
                <MenuItem value={1}>Nữ</MenuItem>
                <MenuItem value={2}>Khác</MenuItem>
              </Select>
            )}
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexGrow={1}
            gap={"48px"}
          >
            <Typography width={"120px"}>Ngày sinh</Typography>
            {loading ? (
              <Skeleton
                variant="rounded"
                height={"40px"}
                sx={{ flexGrow: 1 }}
              />
            ) : (
              <TextField
                hiddenLabel
                variant="filled"
                size="small"
                value={userInfo.birthday}
                onChange={(e) => handleChange(e, "birthday")}
                placeholder="Chưa cập nhật"
                type="date"
                sx={{
                  flexGrow: 1,
                }}
              />
            )}
          </Stack>

          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexGrow={1}
            gap={"48px"}
          >
            <Typography width={"120px"}>Chiều cao (cm)</Typography>
            {loading ? (
              <Skeleton
                variant="rounded"
                height={"40px"}
                sx={{ flexGrow: 1 }}
              />
            ) : (
              <TextField
                hiddenLabel
                variant="filled"
                size="small"
                value={userInfo.height}
                onChange={(e) => handleChange(e, "height")}
                placeholder="Chưa cập nhật"
                type="number"
                sx={{
                  flexGrow: 1,
                }}
              />
            )}
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexGrow={1}
            gap={"48px"}
          >
            <Typography width={"120px"}>Cân nặng (kg)</Typography>
            {loading ? (
              <Skeleton
                variant="rounded"
                height={"40px"}
                sx={{ flexGrow: 1 }}
              />
            ) : (
              <TextField
                hiddenLabel
                variant="filled"
                size="small"
                value={userInfo.weight}
                onChange={(e) => handleChange(e, "weight")}
                placeholder="Chưa cập nhật"
                type="number"
                sx={{
                  flexGrow: 1,
                }}
              />
            )}
          </Stack>
        </Stack>

        <Stack gap={"20px"}>
          <RedButton
            disabled={loading}
            onClick={() => handleSubmit()}
            title={"Cập nhật thông tin"}
            customStyle={{
              width: "220px",
              px: 0,
              height: "48px",
            }}
          />
          <Button
            variant="outlined"
            disabled={loading}
            sx={{
              width: "220px",
              height: "48px",
              px: 0,
              color: colors.primaryColor,
              borderColor: colors.primaryColor,
            }}
            onClick={handleOpen}
          >
            Đổi mật khẩu
          </Button>
        </Stack>
      </Stack>
      <Modal open={openModal} onClose={handleClose}>
        <Stack
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 400,
            bgcolor: "white",
            boxShadow: 24,
            p: 2,
            borderRadius: "8px",
          }}
        >
          <Typography fontSize={"18px"} fontWeight={600} marginBottom={"20px"}>
            Thay đổi mật khẩu
          </Typography>
          <TextField
            label="Mật khẩu hiện tại"
            value={password.current}
            onChange={(e) =>
              setPassword((prev) => ({ ...prev, current: e.target.value }))
            }
          />

          <TextField
            label="Mật khẩu mới"
            value={password.new}
            sx={{
              marginY: "16px",
            }}
            onChange={(e) =>
              setPassword((prev) => ({ ...prev, new: e.target.value }))
            }
          />

          <RedButton title={"Lưu"} />
          <Button
            variant="outlined"
            sx={{
              height: "48px",
              marginTop: "12px",
              color: colors.primaryColor,
              borderColor: colors.primaryColor,
            }}
            onClick={handleClose}
          >
            Hủy
          </Button>
        </Stack>
      </Modal>
    </Paper>
  );
};

export default MyInfo;
