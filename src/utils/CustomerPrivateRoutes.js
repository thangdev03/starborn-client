import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"
import { useEffect } from "react";

const CustomerPrivateRoutes = () => {
  const { openAuthModal } = useAuth();

  const accessToken = JSON.parse(sessionStorage.getItem('accessToken'))

  if (accessToken) {
    return <Outlet />  
  } else {
    openAuthModal();
    return <Navigate to="/" />
  }
}

export default CustomerPrivateRoutes