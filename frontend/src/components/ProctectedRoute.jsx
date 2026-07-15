import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
    const { authStatus } = useAuth(); // "checking" | "authenticated" | "unauthenticated"


    if (authStatus === "checking") {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (authStatus === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;