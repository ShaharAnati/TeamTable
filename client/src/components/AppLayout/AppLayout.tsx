import React from "react";
import { Outlet } from "react-router";
import AppBar from "../AppBar/AppBar";
import ActiveGroupAvailability from '../ActiveGroupAvailability/ActiveGroupAvailability';
import "./AppLayout.css";

function AppLayout({}) {
  return (
    <div className="AppLayout">
      <AppBar />
      <div style={{ minHeight: "100vh", paddingTop: 70 }}>
        <Outlet />
      </div>
      <ActiveGroupAvailability />
    </div>
  );
}

export default AppLayout;
