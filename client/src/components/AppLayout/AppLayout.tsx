import React from "react";
import { Outlet } from "react-router";
import AppBar from "../AppBar/AppBar";
import ActiveGroupAvailability from "../ActiveGroupAvailability/ActiveGroupAvailability";
import "./AppLayout.css";

function AppLayout({}) {
  return (
    <div className="AppLayout">
      <AppBar />
      <div style={{ height: "calc(100vh - 71px)", overflow: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
