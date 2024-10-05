import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"
import { useEffect } from "react";

const CustomerPrivateRoutes = () => {
  const { openAuthModal, checking } = useAuth();

  const accessToken = sessionStorage.getItem('accessToken');
  const parsedToken  = accessToken ? JSON.parse(accessToken) : null;

  if (checking) {
    return null;
  }

  if (parsedToken) {
    return <Outlet />  
  } else {
    openAuthModal();
    return <Navigate to="/" />
  }
}

export default CustomerPrivateRoutes