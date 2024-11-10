import {
  Box,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AppBreadcrumbs from "../../components/common/AppBreadcrumbs";
import { useAuth } from "../../contexts/AuthContext";
import AccountNavigation from "../../components/client/AccountNavigation";
import AddressBook from "../../components/client/AddressBook";
import MyInfo from "../../components/client/MyInfo";
import { useLocation } from "react-router-dom";
import OrderHistory from "../../components/client/OrderHistory";
import MyOrderDetail from "../../components/client/MyOrderDetail";
import CancelOrders from "../../components/client/CancelOrders";

const Account = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const paths = (location.pathname.split('/').filter((x) => x));
  const [breadcrumbItem, setBreadcrumbItem] = useState(null);

  const renderComponent = () => {
    switch (paths[1]) {
      case 'info':
        return <MyInfo />
      case 'address':
        return <AddressBook />
      case 'orders':
        if (paths[2]) {
          return <MyOrderDetail />
        }
        return <OrderHistory />
      case 'orders-cancel':
        return <CancelOrders />
    }
  }

  useEffect(() => {
    if (paths[1] === 'orders') {
      setBreadcrumbItem(paths[2])
    } else {
      setBreadcrumbItem(null)
    }
  }, [paths])

  return (
    <Box paddingX={{ xs: "16px", sm: "52px" }} paddingTop={"20px"}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <AppBreadcrumbs item={breadcrumbItem}/>
        <Typography fontSize={"14px"}>
          {`Chào mừng, ${currentUser?.fullname}!`}
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
