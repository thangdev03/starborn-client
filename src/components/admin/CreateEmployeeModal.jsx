import {
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { colors, serverUrl } from "../../services/const";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ActionBtn from "./ActionBtn";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import axios from "axios";
import { toast } from "react-toastify";

const CreateEmployeeModal = ({ isOpen = false, handleClose = () => {}, reloadData = () => {} }) => {
  const inputs = [
    {
      id: 1,
      name: "username",
      label: "Tên tài khoản",
      type: "text",
    },
    {
      id: 2,
      name: "phone",
      label: "Số điện thoại",
      type: "text",
    },
    {
      id: 3,
      name: "password",
      label: "Mật khẩu",
      type: "password",
    },
    {
      id: 4,
      name: "confirmPassword",
      label: "Nhập lại mật khẩu",
      type: "password",
    },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState({
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });

  const handleChangeInput = (e, field) => {
    if (field === "isAdmin") {
      setEmployeeInfo((prev) => ({
        ...prev,
        [field]: e.target.checked,
      }));
    } else {
      setEmployeeInfo((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    }
  };

  const handleSubmit = async () => {
    axios
      .post(serverUrl + 'employees', {
        username: employeeInfo.username,
        password: employeeInfo.password,
        phone: employeeInfo.phone,
        is_admin: employeeInfo.isAdmin
      }, {
        withCredentials: true
      })
      .then((res) => {
        if (res.status === 201) {
          toast.success("Tạo tài khoản nhân viên thành công!");
          handleClose();
          reloadData();
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 409) {
          toast.error(error.data?.message);
        }
      })
  };

  return (
    <Modal
      open={isOpen}
      onClose={(e) => handleClose(e)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styleModal} onClick={(e) => e.stopPropagation()}>
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 20,
              bgcolor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
            }}
          >
            Đang tạo
            <CircularProgress />
          </Box>
        )}
        <Typography
          fontSize={20}
          fontWeight={600}
          textAlign={"center"}
          marginBottom={"8px"}
        >
          Tạo tài khoản
        </Typography>
        <Stack
          direction={"column"}
          gap={"20px"}
          width={"100%"}
          alignItems={"start"}
        >
          {inputs.map((i) => (
            <TextField
              key={i.id}
              label={i.label}
              variant="outlined"
              aria-required
              fullWidth
              size="small"
              type={i.type}
              value={employeeInfo[i.name]}
              onChange={(e) => handleChangeInput(e, i.name)}
            />
          ))}
          <FormControlLabel
            control={<Checkbox />}
            label="Tài khoản ADMIN"
            value={employeeInfo.isAdmin}
            onChange={(e) => handleChangeInput(e, "isAdmin")}
          />
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"center"}
          gap={"16px"}
          paddingTop={"16px"}
          sx={{ flexWrap: "wrap" }}
        >
          <ActionBtn
            type={"save"}
            title={"TẠO"}
            handleClick={handleSubmit}
            customStyle={{
              flexGrow: 1,
            }}
          />
          <ActionBtn
            type={"cancel"}
            title={"Hủy"}
            handleClick={handleClose}
            customStyle={{
              flexGrow: 1,
            }}
          />
        </Stack>
      </Box>
    </Modal>
  );
};

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: 200,
    md: 400,
  },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

export default CreateEmployeeModal;
