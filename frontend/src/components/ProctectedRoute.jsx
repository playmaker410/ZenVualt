import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const [authStatus, setAuthStatus] = useState("checking"); // "checking" | "authenticated" | "unauthenticated"

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch("http://localhost:8080/api/me", {
                    credentials: "include", // required to send httpOnly cookies
                });

                if (res.ok) {
                    setAuthStatus("authenticated");
                } else {
                    setAuthStatus("unauthenticated");
                }
            } catch (err) {
                setAuthStatus("unauthenticated");
            }
        }

        checkAuth();
    }, []);

    if (authStatus === "checking") {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (authStatus === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;