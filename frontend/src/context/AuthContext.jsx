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
            }
        } catch (err) {
            setUser(null)
            setAuthStatus('unauthenticated')
            return false
        }
    }, [])

    useEffect(() => {
        checkAuth()
    }, [checkAuth])


    return (
        <AuthContext.Provider value={{ user, authStatus, setUser, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}