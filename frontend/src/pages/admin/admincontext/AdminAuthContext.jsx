import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
    const [admin, setAdmin] = useState(null)
    const [authStatus, setAuthStatus] = useState("Checking")

    // Runs on mount — restores session if an admin_token cookie already exists
    const checkAuth = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:8080/api/admin_me", {
                credentials: "include",
            })

            if (res.ok) {
                const data = await res.json()
                setAdmin(data)
                setAuthStatus("authenticated")
                return true
            } else {
                setAdmin(null)
                setAuthStatus("unauthenticated")
                return false
            }
        } catch (err) {
            setAdmin(null)
            setAuthStatus("unauthenticated")
            return false
        }
    }, [])

    // Called from the login form — POSTs credentials to the backend
    const admin_login = useCallback(async (email, password) => {
        const res = await fetch("http://localhost:8080/api/adminlogin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        })

        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data.error || "Invalid email or password.")
        }

        const data = await res.json()
        setAdmin(data.admin)
        setAuthStatus("authenticated")
        return data
    }, [])

    // Clears admin state on logout

    const admin_logout = useCallback(async () => {
        try {
            await fetch("http://localhost:8080/api/adminlogout", {
                method: "POST",
                credentials: "include",
            })
        } catch (err) {
            // clear local state regardless
        } finally {
            setAdmin(null)
            setAuthStatus("unauthenticated")
        }
    }, [])

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    return (
        <AdminAuthContext.Provider value={{ admin, authStatus, setAdmin, checkAuth, admin_login, admin_logout }}>
            {children}
        </AdminAuthContext.Provider>
    )
}

export function useAdminAuth() {
    return useContext(AdminAuthContext)
}
