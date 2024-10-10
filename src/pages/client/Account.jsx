import {
  Box,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import AppBreadcrumbs from "../../components/common/AppBreadcrumbs";
import { useAuth } from "../../contexts/AuthContext";
import AccountNavigation from "../../components/client/AccountNavigation";
import AddressBook from "../../components/client/AddressBook";
import MyInfo from "../../components/client/MyInfo";
import { useLocation } from "react-router-dom";

const Account = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const paths = (location.pathname.split('/').filter((x) => x));

  const renderComponent = () => {
    switch (paths[1]) {
      case 'info':
        return <MyInfo />
      case 'address':
        return <AddressBook />
    }
  }

  return (
    <Box paddingX={{ xs: "16px", sm: "52px" }} paddingTop={"20px"}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <AppBreadcrumbs />
        <Typography fontSize={"14px"}>
          {`Chào mừng, ${currentUser.fullname}!`}
        </Typography>
      </Stack>

      <Stack direction={"row"} marginTop={"52px"} gap={"60px"}>
        <AccountNavigation />
        {renderComponent()}
      </Stack>
    </Box>
  );
};

export default Account;
