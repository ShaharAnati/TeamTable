
import React from 'react';
import {Navigate, Route, useLocation} from "react-router-dom";
// @ts-ignore
import {Redirect} from "react-router";

function RequireAuth({ children }: { children: JSX.Element }) {
    let auth = sessionStorage.getItem('user_token');
    let location = useLocation();

    if (!auth) {
        return <Navigate to="/login-screen" state={{ from: location }} replace />;
    }

    return children;
}

export default RequireAuth;
