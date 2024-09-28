import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"
import { useEffect } from "react";

const CustomerPrivateRoutes = () => {
  const { token, openAuthModal } = useAuth();

  console.log(token)

  if (token) {
    return <Outlet />  
  } else {
    return <Navigate to="/" />
  }
}

export default CustomerPrivateRoutes