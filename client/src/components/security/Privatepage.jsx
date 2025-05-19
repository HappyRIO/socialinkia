import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../fragments/Loader";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ content }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const validateUser = async () => {
    try {
      const response = await fetch(`/api/auth/check-user`, {
        method: "GET",
        credentials: "include"
      });
      setIsAuthenticated(response.ok);
    } catch (err) {
      setIsAuthenticated(false);
      console.error("Error validating user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validateUser();
  }, []);

  if (loading) return <Loader />;
  return isAuthenticated ? content : <Navigate to="/login" />;
};

export default PrivateRoute;
