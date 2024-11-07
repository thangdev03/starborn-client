import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { colors } from "../../services/const"

const GetCustomerHeight = ({ heightInput, handleChangeHeight, onClickNext }) => {
  return (
    <Box height={"100vh"} width={"100%"} position={"relative"}>
      <Stack
        alignItems={"center"}
        sx={{
          position: "absolute",
          top: "300px",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 628,
          height: 468,
          border: "1px solid #1B2141",
          borderRadius: "8px",
          bgcolor: "#1B2141ea",
          padding: "12px"
        }}
      >
        <Typography
          sx={{
            color: "white",
            textAlign: "center",
            fontSize: "18px",
            marginTop: "10%"
          }}
        >
            Hãy nhập vào chiều cao của bạn (centimeters). Chiều cao càng sát với thực tế thì kết quả đo càng chính xác.
        </Typography>
        <TextField 
          hiddenLabel={true}
          variant="filled"
          type="number"
          value={heightInput}
          onChange={(e) => handleChangeHeight(e.target.value)}
          inputProps={{min: 0, style: { textAlign: 'center' }}}
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            marginTop: "16px",
            textAlign: "center",
            width: "50%"
          }}
        />
        <Button
          variant="contained"
          sx={{
            width: "50%",
            marginTop: "16px",
            bgcolor: colors.red,
            ":hover": {
              bgcolor: "#ed6161"
            }
          }}
          onClick={onClickNext}
        >
          Bắt đầu quét cơ thể bạn
        </Button>
      </Stack>
    </Box>
  );
};

export default GetCustomerHeight;
