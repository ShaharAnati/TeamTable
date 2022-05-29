import React from 'react';
import { isUserLoggedIn } from './AuthProvider';
import { Navigate, useLocation } from "react-router-dom";

function RequireAuth({ children }: { children: JSX.Element }) {
    let location = useLocation();

    if (!isUserLoggedIn()) {
        return <Navigate to="/login-screen" state={{ from: location }} replace />;
    }
        return children;
}

export default RequireAuth;
