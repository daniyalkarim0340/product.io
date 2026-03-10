import { Navigate, Outlet } from "react-router-dom";
import useAuthHook from "../hooks/useUser";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuthHook();

  if (loading) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
