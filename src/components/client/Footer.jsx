import {
  Box,
  FormControl,
  IconButton,
  InputBase,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { colors } from "../../services/const";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import MapsHomeWorkRoundedIcon from "@mui/icons-material/MapsHomeWorkRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";

const Footer = () => {
  return (
    <Box sx={{ marginTop: "128px", bgcolor: colors.primaryColor, paddingBottom: '20px' }}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        flexWrap={'wrap'}
        sx={{
          marginTop: "128px",
          padding: {
            xs: "20px 16px 20px",
            sm: "56px 52px 20px",
          },
         
        }}
      >
        <Stack gap={"24px"} marginTop={'24px'}>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              color: "white",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            Starborn
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              color: "white",
              fontWeight: 500,
            }}
          >
            Đăng ký
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              color: "white",
            }}
          >
            Nhận thông tin mới nhất về sản phẩm
          </Typography>
          {/* <TextField 
          placeholder='Nhập email của bạn'
          inputProps={{
            style: {
              color: 'white',
              '&:focus': {
                outline: 'none'
              }
            }
          }}
          sx={{
            border: '1px solid',
            borderColor: 'white',
            outline: 'none'
          }}
          /> */}
          <FormControl
            sx={{
              border: "1px solid white",
              borderRadius: "4px",
              padding: 0,
            }}
          >
            <InputBase
              placeholder="Nhập email của bạn"
              inputProps={{
                style: {
                  color: "white",
                  padding: "12px 44px 12px 16px",
                  position: "relative",
                },
              }}
            />
            <IconButton
              sx={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                right: "8px",
              }}
            >
              <SendRoundedIcon
                sx={{
                  color: "white",
                  fontSize: "24px",
                }}
              />
            </IconButton>
          </FormControl>
        </Stack>

        <Stack gap={"24px"} marginTop={'24px'}>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              color: "white",
              fontSize: "20px",
              fontWeight: 500,
            }}
          >
            Liên hệ
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              color: "white",
              display: "flex",
              alignItems: "start",
              gap: "4px",
              width: "300px",
            }}
          >
            <MapsHomeWorkRoundedIcon />
            465 đường Giải Phóng, Phương Liệt, Thanh Xuân, Hà Nội, Việt Nam.
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <MailRoundedIcon />
            starborn@gmail.com
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <LocalPhoneRoundedIcon />
            (+84) 85.6918.666
          </Typography>
        </Stack>

        <Stack gap={"24px"} marginTop={'24px'}>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              color: "white",
              fontSize: "20px",
              fontWeight: 500,
            }}
          >
            Rút gọn
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              color: "white",
              display: "flex",
              alignItems: "start",
              gap: "4px",
              width: "300px",
            }}
          >
            Các chính sách
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Điều khoản sử dụng
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Câu hỏi thường gặp
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            Chăm sóc khách hàng
          </Typography>
        </Stack>

        <Box marginTop={'24px'}>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              color: "white",
              fontSize: "20px",
              fontWeight: 500,
            }}
          >
            Tải ứng dụng
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Roboto',
              marginTop: '20px',
              color: 'white',
              opacity: 0.7,
              fontSize: '12px',
              fontWeight: 300
            }}
          >
            Tiết kiệm hơn với các mã giảm giá
          </Typography>
          <Box marginTop={'12px'}>
            <img src="../assets/img/qr-and-stores.png" alt="" />
          </Box>
          <Box marginTop={'20px'}>
            <img src="../assets/img/social-media-icons.png" alt="" />
          </Box>
        </Box>
      </Stack>
      <Typography marginTop={'20px'} color={'whitesmoke'} textAlign={'center'} fontSize={'12px'} sx={{ opacity: 0.6, fontWeight: 300 }}>
        © Copyright Thangdev03 2024. All right reserved
      </Typography>
    </Box>
  );
};

export default Footer;
