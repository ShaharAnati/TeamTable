import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {  useAuth } from "../../../auth/AuthProvider";

const Home: React.FC = (props): JSX.Element => {
  const auth = useAuth();
  const location = useLocation();

  // if (!auth.user) {
  //   return <Navigate to="/login-screen" state={{ from: location }} replace />;
  // }

  return (
    <div>
        Home Page
    </div>
  );
};

export default Home;