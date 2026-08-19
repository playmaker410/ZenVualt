import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [authStatus, setAuthStatus] = useState('checking') // "checking" | "authenticated" | "unauthenticated"

    const checkAuth = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:8080/api/me', {
                credentials: 'include',
            })

            if (res.ok) {
                const data = await res.json()
                setUser(data)
                setAuthStatus('authenticated')
                return true
            } else {
                setUser(null)
                setAuthStatus('unauthenticated')
                return false  // was missing — callers got undefined instead of false
            }
        } catch (err) {
            setUser(null)
            setAuthStatus('unauthenticated')
            return false
        }
    }, [])

    const login = useCallback(async (email, password) => {
        const res = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        })

        if (!res.ok) {
            const data = await res.json().catch(() => ({}))
            throw new Error(data.error || 'Invalid email or Password.')
        }

        // Cookie is now set by the server. Call checkAuth so that the state
        // update (authStatus → "authenticated") is fully committed in React
        // before Login.jsx calls navigate(). Without this await, navigate()
        // fires while authStatus is still "unauthenticated" and ProtectedRoute
        // bounces the user straight back to /login.
        await checkAuth()
    }, [checkAuth])

    const logout = useCallback(async () => {
        try {
            await fetch('http://localhost:8080/api/logout', {
                method: 'POST',
                credentials: 'include',
            })
        } catch (err) {
            // clear local state regardless
        } finally {
            setUser(null)
            setAuthStatus('unauthenticated')
        }
    }, [])

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    return (
        <AuthContext.Provider value={{ user, authStatus, setUser, checkAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
