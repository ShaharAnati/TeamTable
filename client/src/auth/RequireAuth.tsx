import React from 'react';
import { useAuth } from './AuthProvider';
import {Navigate, useLocation} from "react-router-dom";

function RequireAuth({ children }: { children: JSX.Element }) {
    const { loggedInUser } = useAuth();
    let location = useLocation();

    if (!loggedInUser) {
        return <Navigate to="/login-screen" state={{ from: location }} replace />;
    }

    return children;
}

export default RequireAuth;
