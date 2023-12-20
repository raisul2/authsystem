import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.authuser);

  return user ? <Outlet /> : <Navigate to="/login" />;
};
