import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { colors } from "../../services/const";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const EmployeeLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { handleLoginEmployee } = useAuth();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const accountType = JSON.parse(localStorage.getItem("accountType"));

  return currentUser && accountType == "employee" ? (<Navigate to="/admin/dashboard"/>) : (
      <Stack direction={"row"}>
        <Box 
          position={"fixed"} 
          left={0} 
          top={0} 
          width={{ xs: "100%", md: "50%" }} 
          height={"100vh"}
        >
          <img
            src="../assets/img/rose-with-a-longboard.jpg"
            alt="girl with a longboard"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Typography
            sx={{
              position: "absolute",
              top: "80px",
              left: { md: "50%" },
              transform: { md: "translateX(-70%)" },
              textAlign: { xs: "center", md: "left" },
              width: { xs: "100%", md: "auto" },
              fontWeight: 600,
              fontSize: { xs: "36px", md: "52px" },
              textShadow: "2px 2px 2px #1B214155"
            }}
          >
            Starborn Management System
          </Typography>
        </Box>
        <Stack
          justifyContent={{ md: "center" }}
          alignItems={"center"}
          position={"fixed"}
          right={0}
          top={{ xs: "200px", md: 0 }}
          width={{ xs: "100%", md: "50%" }}
          height={"100vh"}
        >
          <Stack 
            gap={"24px"} 
            width={{ md: "80%" }} 
            maxWidth={"480px"} 
            bgcolor={{ 
              xs: "white", 
              md: "transparent" 
            }}
            padding={{ xs: 4, md: 0 }}
            borderRadius={"8px"}
            boxShadow={{ xs: "2px 2px 10px #00000022", md: "none" }}
          >
            <Typography fontSize={"32px"} fontWeight={600}>
              Đăng nhập
            </Typography>
            <TextField 
              id="username-input"
              label="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{
                  color: colors.primaryColor,
                  borderColor: colors.primaryColor,
              }}
            />
            <TextField 
              id="password-input"
              label="Mật khẩu"
              inputProps={{
                autoComplete: 'new-password',
                form: {
                  autoComplete: 'off',
                },
              }}
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{
                  color: colors.primaryColor,
                  borderColor: colors.primaryColor,
              }}
            />
            <Button
              variant="contained"
              onClick={() => handleLoginEmployee(username, password)}
              sx={{
                paddingY: "12px",
                bgcolor: colors.primaryColor,
                "&:hover": {
                  bgcolor: "#1B2141ee"
                }
              }}
            >
              Đăng nhập            
            </Button>
          </Stack>
        </Stack>
      </Stack>
    );
};

export default EmployeeLogin;
