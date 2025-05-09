import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ isAllowed, children }) {
  return isAllowed ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;
