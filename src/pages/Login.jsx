import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight, Zap, Headphones } from 'lucide-react'
import assets from '../assets/assets'

const Login = ({ theme }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({ email: '', password: '', remember: false })
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => setLoading(false), 2000)
    }

    const features = [
        { icon: ShieldCheck, title: 'Bank-Grade Security', desc: '256-bit encryption keeps you safe' },
        { icon: Zap, title: 'Instant Transfer', desc: 'Send & receive money instantly' },
        { icon: Headphones, title: '24/7 Support', desc: 'We are here to help you anytime' },
    ]

    return (
        <div className="min-h-screen bg-zen-light-bg dark:bg-zen-bg flex">

            {/* ── Left Panel ── */}
            <div className="hidden xl:flex xl:w-1/2 relative flex-col justify-between p-12 overflow-hidden">

                {/* background glow blobs */}
                <div className="absolute inset-0 bg-zen-light-gradient dark:bg-zen-gradient" />
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-zen-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-15 -right-15 w-80 h-80 bg-zen-secondary/15 rounded-full blur-3xl" />

                {/* logo */}
                <div className="relative z-10">
                    <Link to="/">
                        <img
                            src={theme === 'dark' ? assets.darkbglogo : assets.lglogo}
                            className="w-36 hover:scale-105 transition-transform"
                            alt="logo"
                        />
                    </Link>
                </div>

                {/* headline */}
                <div className="relative z-10">
                    <p className="text-zen-primary font-semibold text-sm tracking-widest uppercase mb-3">Welcome Back</p>
                    <h1 className="text-4xl xl:text-5xl font-extrabold text-zen-light-text dark:text-zen-text leading-tight mb-4">
                        Secure Banking <br /> for{' '}
                        <span className="text-zen-primary">Modern Life</span>
                    </h1>
                    <p className="text-zen-light-muted dark:text-zen-muted text-base max-w-sm">
                        Access your accounts, transfer funds, pay bills and manage your finances securely from anywhere.
                    </p>

                    {/* feature list */}
                    <div className="mt-10 flex flex-col gap-6">
                        {features.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex items-center gap-4">
                                <div className="bg-zen-primary/10 dark:bg-[#0f1d4a] border border-zen-primary/20 rounded-xl p-3 shrink-0">
                                    <Icon className="w-6 h-6 text-zen-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-zen-light-text dark:text-zen-text">{title}</h4>
                                    <p className="text-sm text-zen-light-muted dark:text-zen-muted">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* bottom badge */}
                <div className="relative z-10 flex items-center gap-2 bg-white/60 dark:bg-white/5 border border-zen-light-border dark:border-zen-border backdrop-blur rounded-full px-5 py-3 w-fit">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-medium text-zen-light-muted dark:text-zen-muted">
                        Your data is protected by bank-level encryption
                    </span>
                </div>
            </div>

            {/* ── Right Panel (Form) ── */}
            <div className="flex-1 relative flex flex-col justify-center items-center px-6 py-12 xl:px-16 overflow-hidden bg-gradient-to-br from-blue-50 via-sky-100/60 to-indigo-100 dark:from-zen-bg dark:via-[#0a1022] dark:to-zen-bg">
                {/* decorative blobs */}
                <div className="absolute -top-15 -right-15 w-72 h-72 bg-zen-primary/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-40 w-64 h-64 bg-zen-secondary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-200/30 dark:bg-zen-primary/5 rounded-full blur-3xl pointer-events-none" />

                {/* mobile logo */}
                <div className="xl:hidden flex justify-center mb-6 relative z-10">
                    <Link to="/">
                        <img
                            src={theme === 'dark' ? assets.darkbglogo : assets.lglogo}
                            className="w-36 hover:scale-105 transition-transform"
                            alt="logo"
                        />
                    </Link>
                </div>

                <div className="w-full max-w-md relative z-10">

                    {/* card */}
                    <div className="relative z-10 bg-white/90 backdrop-blur-sm dark:bg-zen-card border border-white/80 dark:border-zen-border rounded-2xl p-8 shadow-2xl shadow-blue-200/60 dark:shadow-[0_0_40px_rgba(14,165,255,0.06)]">

                        <div className="mb-8">
                            <h2 className="text-2xl font-extrabold text-zen-light-text dark:text-zen-text">Sign in to your account</h2>
                            <p className="text-zen-light-muted dark:text-zen-muted text-sm mt-1">
                                Don&apos;t have an account?{' '}
                                <Link to="/register" className="text-zen-primary hover:underline font-medium">
                                    Create one free
                                </Link>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5">
                                    Email address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-sm font-semibold text-zen-light-text dark:text-zen-text">
                                        Password
                                    </label>
                                    <a href="#" className="text-xs text-zen-primary hover:underline">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zen-light-muted dark:text-zen-muted hover:text-zen-primary transition"
                                        aria-label="Toggle password"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember me */}
                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={form.remember}
                                    onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                                    className="w-4 h-4 accent-zen-primary rounded"
                                />
                                <span className="text-sm text-zen-light-muted dark:text-zen-muted">Remember me for 30 days</span>
                            </label>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-zen-primary hover:bg-zen-secondary text-white font-bold text-sm transition-all duration-300 hover:shadow-neon active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Sign In <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>
                        </form>

                        {/* divider */}
                        {/* <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-zen-light-border dark:bg-zen-border" />
                            <span className="text-xs text-zen-light-muted dark:text-zen-muted">or continue with</span>
                            <div className="flex-1 h-px bg-zen-light-border dark:bg-zen-border" />
                        </div> */}

                        {/* Social logins
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Google', icon: 'https://www.svgrepo.com/show/475656/google-color.svg' },
                                { label: 'Apple', icon: 'https://www.svgrepo.com/show/452222/apple.svg' },
                            ].map(({ label, icon }) => (
                                <button
                                    key={label}
                                    className="flex items-center justify-center gap-2 border border-zen-light-border dark:border-zen-border rounded-xl py-2.5 text-sm font-medium text-zen-light-text dark:text-zen-text hover:bg-zen-light-bg dark:hover:bg-zen-bg transition"
                                >
                                    <img src={icon} className="w-4 h-4" alt={label} />
                                    {label}
                                </button>
                            ))}
                        </div> */}
                    </div>

                    {/* footer note */}
                    <p className="text-center text-xs text-zen-light-muted dark:text-zen-muted mt-6">
                        By signing in, you agree to our{' '}
                        <a href="#" className="text-zen-primary hover:underline">Terms of Service</a> and{' '}
                        <a href="#" className="text-zen-primary hover:underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
