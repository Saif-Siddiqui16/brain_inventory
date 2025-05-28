import { useEffect, useState } from "react";
import api from "../api/axios";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(()=>{
    const verifyUser=async()=>{
try {
  await api.get('/auth/me')
  setIsAuthenticated(true);
} catch (error) {
  console.log(error)
  setIsAuthenticated(false);
}finally {
        setLoading(false);
      }
    }

    verifyUser()
  },[])
if (loading) {
    return <div className="text-white p-4">Checking authentication...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
  
}

export default ProtectedRoute;
