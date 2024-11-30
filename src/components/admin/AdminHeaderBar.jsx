import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { colors, serverUrl } from "../../services/const";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import AdminNavbar from "./AdminNavbar";
import { useAuth } from "../../contexts/AuthContext";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminHeaderBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeNav, setActiveNav] = useState(false);
  const open = Boolean(anchorEl);
  const { handleLogout, currentUser } = useAuth();
  const socket = useRef(null);
  const [anchorNotifyEl, setAnchorNotifyEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const openNotification = Boolean(anchorNotifyEl);
  const navigate = useNavigate();
  const [notificationNumb, setNotificationNumb] = useState(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseNavbar = () => {
    setActiveNav(false);
  };
  const handleCloseNotification = () => {
    setAnchorNotifyEl(null);
  };

  const handleClickNotification = (notification) => {
    if (notification.is_read === 0) {
      axios
        .put(serverUrl + `notification/${notification.id}`, {
          is_read: true,
        })
        .then((res) => {
          setNotificationNumb((prev) => prev - 1);
        })
        .catch((error) => console.log(error));
    }
    handleCloseNotification();
    navigate("/admin/" + notification.related_url);
  };

  useEffect(() => {
    if (currentUser) {
      socket.current = io(serverUrl);

      socket.current.emit("admin-join", currentUser.id);

      socket.current.on("notify-admin", (data) => {
        getNotification();
        toast.info("Có 1 thông báo mới!", {
          closeButton: false,
          autoClose: 1500
        });
      });
    }
  }, [currentUser]);

  const getNotification = async () => {
    axios
      .get(serverUrl + "notification")
      .then((res) => {
        setNotifications(res.data);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getNotification();
  }, []);

  useEffect(() => {
    const length = [...notifications].filter((i) => !i.is_read).length;
    setNotificationNumb(length);
  }, [notifications]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        position: "fixed",
        left: { xs: 0, md: "288px" },
        right: 0,
        top: 0,
        zIndex: 10,
      }}
    >
      <AppBar
        sx={{
          position: "sticky",
          bgcolor: "#FAFAFA",
          boxShadow: 0,
          border: "1px solid #CFCFCF",
        }}
      >
        <Toolbar>
          <IconButton
            onClick={() => setActiveNav((prev) => !prev)}
            sx={{
              display: { xs: "inline-flex", md: "none" },
            }}
          >
            <MenuIcon
              sx={{
                color: colors.primaryColor,
              }}
            />
          </IconButton>
          {/* <Box
                    display={{xs: activeNav ? 'block' : 'none', md: 'none'}}
                    sx={{
                    position: 'fixed', 
                    zIndex: 1000, 
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0, 
                    bgcolor: 'rgba(0,0,0,0.2)',
                    }}
                    onClick={(e) => handleCloseNavbar(e)}
                > */}
          <AdminNavbar
            handleCloseNavbar={handleCloseNavbar}
            activeNav={activeNav}
          />
          {/* </Box> */}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* <IconButton size="large">
              <SearchIcon sx={{ color: colors.primaryColor }} />
            </IconButton> */}
            <IconButton
              aria-controls={openNotification ? "notification-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openNotification ? "true" : undefined}
              onClick={(e) => setAnchorNotifyEl(e.currentTarget)}
            >
              <Badge badgeContent={notificationNumb} color="error">
                <NotificationsIcon
                  sx={{
                    color: colors.primaryColor,
                  }}
                />
              </Badge>
            </IconButton>
            <Menu
              id="notification-menu"
              anchorEl={anchorNotifyEl}
              open={openNotification}
              onClose={handleCloseNotification}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              sx={{
                maxHeight: "600px",
                overflowY: "auto",
              }}
            >
              {notifications.length !== 0 ? (
                notifications.map((notification, index) => (
                  <MenuItem
                    key={index}
                    sx={{
                      minHeight: "40px",
                      opacity: notification.is_read === 1 ? 0.6 : 1,
                    }}
                    onClick={() => handleClickNotification(notification)}
                  >
                    <Box paddingY={"4px"}>
                      <Typography
                        fontWeight={notification.is_read === 0 ? 600 : 400}
                      >
                        {notification.message}
                      </Typography>
                      <Typography marginTop={"4px"} fontSize={"12px"}>
                        {new Date(notification.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <Typography padding={"4px 12px"} textAlign={"center"}>
                  Không có thông báo nào
                </Typography>
              )}
            </Menu>

            <Button
              sx={{
                marginLeft: "12px",
                color: colors.primaryColor,
                fontWeight: "500",
                height: "40px",
                border: "1px solid",
                borderColor: colors.primaryColor,
                borderRadius: "8px",
                paddingY: 0,
              }}
              aria-controls={open ? "auth-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              {currentUser.username}
              <ExpandMoreRoundedIcon />
            </Button>
            <Menu
              id="auth-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                sx={{ height: "40px" }}
                onClick={() => {
                  handleClose();
                }}
              >
                Đổi mật khẩu
              </MenuItem>
              <MenuItem
                sx={{ height: "40px" }}
                onClick={() => {
                  handleClose();
                  handleLogout();
                  socket.current.emit("admin-logout");
                }}
              >
                Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AdminHeaderBar;
