import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"

const CustomerPrivateRoutes = () => {
  const { openAuthModal, checking } = useAuth();

  const accessToken = localStorage.getItem('accessToken');
  const parsedToken  = accessToken ? JSON.parse(accessToken) : null;
  const accountType = JSON.parse(localStorage.getItem('accountType'));

  if (checking) {
    return null;
  }

  if (parsedToken && accountType === 'customer') {
    return <Outlet />  
  } else {
    openAuthModal();
    return <Navigate to="/" />
  }
}

export default CustomerPrivateRoutes