import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from '../admincontext/AdminAuthContext'

export const AdminProtectedRoute = () => {
    const location = useLocation();
    const { admin, authStatus } = useAdminAuth();

    // Still checking — don't redirect yet
    if (authStatus === "Checking") {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-zen-light-bg dark:bg-zen-bg">
                <Loader2 size={28} className="animate-spin text-zen-primary" />
            </div>
        );
    }

    // Not authenticated -> bounce to login, remembering where they were headed
    if (!admin) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Authenticated admin -> render the nested route
    return <Outlet />;
}
