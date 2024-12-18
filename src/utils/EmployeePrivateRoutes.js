import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const EmployeePrivateRoutes = () => {
  const { checking } = useAuth();
  const accessToken = localStorage.getItem("accessToken");
  const parsedToken = accessToken ? JSON.parse(accessToken) : null;
  const accountType = JSON.parse(localStorage.getItem("accountType"));

  if (checking) {
    return null;
  }

  if (parsedToken && accountType === "employee") {
    return <Outlet />;
  } else {
    return <Navigate to="/admin/login" />;
  }
};

export default EmployeePrivateRoutes;
