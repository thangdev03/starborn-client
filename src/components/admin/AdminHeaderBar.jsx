import React, { useState } from "react";
import { Box } from "@mui/material";
import { colors } from "../../services/const";
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

const AdminHeaderBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeNav, setActiveNav] = useState(false);
  const open = Boolean(anchorEl);
  const { handleLogout } = useAuth();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseNavbar = () => {
    setActiveNav(false);
  };

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
            <IconButton>
              <Badge badgeContent={0} color="error">
                <NotificationsIcon
                  sx={{
                    color: colors.primaryColor,
                  }}
                />
              </Badge>
            </IconButton>
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
              Admin
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
