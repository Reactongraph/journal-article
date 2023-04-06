import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

export const PrivateRoute = () => {
  const token = Cookies.get("token");
  const auth = token;
  return auth ? <Outlet /> : <Navigate to="/login" />;
};