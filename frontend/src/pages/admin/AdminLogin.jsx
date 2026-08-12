/**
 * AdminLogin.jsx
 * ---------------------------------------------------------------------------
 * The login screen shown at /admin/login. This is a PUBLIC route — no
 * auth required to view it (obviously, since its whole job is to let
 * someone log in). It's the page AdminProtectedRoute.jsx redirects to
 * when someone hits an /admin/* URL without being authenticated.
 *
 * ASSUMPTIONS ABOUT YOUR AUTH SETUP (adjust to match your real code):
 *   Since you mentioned you already have JWT auth with httpOnly cookies
 *   and an AuthContext from earlier work, this assumes:
 *     - You have a `useAuth()` hook (or similar) exposing:
 *         login(email, password) -> Promise, resolves on success,
 *                                    throws/rejects on failure
 *         user                   -> the logged-in user object, or null
 *     - Your backend's login endpoint sets an httpOnly cookie itself
 *       (that's why there's no token-storage logic here — the browser
 *       handles the cookie automatically on subsequent requests).
 *     - After login succeeds, `user` should include something that
 *       identifies them as an admin (e.g. user.role === "admin" or
 *       user.isAdmin === true) — AdminProtectedRoute.jsx checks this.
 *
 *   If your actual useAuth/AuthContext has different method/field names,
 *   just rename the calls below (search for `login(` and `useAuth`) —
 *   the rest of the page (form, validation, error display) doesn't care
 *   what your auth implementation looks like internally.
 *+
 * REDIRECT-AFTER-LOGIN LOGIC:
 *   When AdminProtectedRoute.jsx redirects an unauthenticated visitor
 *   here, it attaches where they were TRYING to go via router state:
 *     navigate("/admin/login", { state: { from: location } })
 *   This page reads that back out (`location.state?.from`) so that after
 *   a successful login, it sends them to the page they originally
 *   wanted instead of always dumping them on the dashboard root. Falls
 *   back to "/admin" if there's no `from` (e.g. they typed
 *   /admin/login directly).
 * ---------------------------------------------------------------------------
 */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { useAdminAuth } from "./admincontext/AdminAuthContext";// <-- adjust path to your real hook

export const AdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { admin_login } = useAdminAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Where to send them after a successful login. If AdminProtectedRoute
    // redirected them here, `location.state.from` holds the page they were
    // trying to reach originally.
    const redirectTo = location.state?.from?.pathname || "/admin/dashboard";

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Please enter both email and password.");
            return;
        }

        setIsSubmitting(true);
        try {
            await admin_login(email.trim(), password);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-zen-light-bg p-6 dark:bg-zen-bg">
            <div className="w-full max-w-sm">
                {/* Logo / brand mark */}
                <div className="mb-6 flex flex-col items-center gap-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zen-primary/10">
                        <ShieldCheck size={24} className="text-zen-primary" />
                    </div>
                    <h1 className="text-xl font-semibold text-zen-light-text dark:text-zen-text">
                        Zenvault Admin
                    </h1>
                    <p className="text-sm text-zen-light-muted dark:text-zen-muted">
                        Sign in to access the admin dashboard
                    </p>
                </div>

                {/* Login form card */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-zen-light-border bg-zen-light-card p-6 shadow-sm dark:border-zen-border dark:bg-zen-card"
                >
                    {error && (
                        <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="mb-1.5 block text-xs font-medium text-zen-light-muted dark:text-zen-muted">
                            Email
                        </label>
                        <div className="relative">
                            <Mail
                                size={16}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zen-light-muted dark:text-zen-muted"
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@zenvault.com"
                                autoComplete="email"
                                className="w-full rounded-lg border border-zen-light-border bg-zen-light-bg py-2.5 pl-9 pr-3 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="mb-1.5 block text-xs font-medium text-zen-light-muted dark:text-zen-muted">
                            Password
                        </label>
                        <div className="relative">
                            <Lock
                                size={16}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zen-light-muted dark:text-zen-muted"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className="w-full rounded-lg border border-zen-light-border bg-zen-light-bg py-2.5 pl-9 pr-3 text-sm text-zen-light-text outline-none focus:border-zen-primary dark:border-zen-border dark:bg-zen-bg dark:text-zen-text"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-zen-primary py-2.5 text-sm font-medium text-white hover:bg-zen-secondary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>

                <p className="mt-4 text-center text-xs text-zen-light-muted dark:text-zen-muted">
                    Restricted access. Contact your administrator if you need credentials.
                </p>
            </div>
        </div>
    );
}