import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import AppLayout from "./AppLayout/AppLayout";
import RequireAuth from "../auth/RequireAuth";
import ActiveGroupAvailability from "./ActiveGroupAvailability/ActiveGroupAvailability";

import HomeScreen from "./screens/AlternativeHome/AltHome";
// import HomeScreen from "./screens/home/Home";
import LogInScreen from "./screens/login/LoginScreen";
import Register from "./screens/register/RegisterScreen";
import {CreateRestaurantWrapper} from "./screens/createRestaurant/CreateRestaurantWrapper";
import VerifyRestaurants from "./screens/verifyRestaurants/VerifyRestaurants";

import CreateGroupContainer from "./screens/createGroup/CreateGroupContainer";
import GroupView from "./screens/groupView/GroupView";
import "./App.css";
import UserProfile from "./screens/userProfile/UserProfile";

const App: React.FC = (props): JSX.Element => {
    return (
        <Router>
            <Routes>
                {/* Unauthorized Routes */}
                <Route path="/" element={<AppLayout/>}>
                    <Route path="" element={<HomeScreen/>}/>
                    <Route path="login-screen" element={<LogInScreen/>}/>
                    <Route path="register-screen" element={<Register/>}/>
                </Route>

                {/* Authorized Routes */}
                <Route
                    path="/"
                    element={
                        <RequireAuth>
                            <AppLayout/>
                        </RequireAuth>
                    }
                >
                    <Route
                        path="create-group-screen"
                        element={<CreateGroupContainer/>}
                    />
                    <Route path="group-page/:id" element={<GroupView/>}/>
                    <Route path="create-restaurant" element={<CreateRestaurantWrapper/>}/>
                    <Route path="user-profile-screen" element={<UserProfile/>}/>
                </Route>

                {/* Admin Routes */}
                <Route
                    path="/"
                    element={
                        <RequireAuth adminAuth={true}>
                            <AppLayout/>
                        </RequireAuth>
                    }
                >
                    <Route path="verify-restaurant" element={<VerifyRestaurants/>}/>
                </Route>
            </Routes>
            <ActiveGroupAvailability/>
        </Router>
    );
};

export default App;
