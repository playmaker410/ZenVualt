import React, { useState } from 'react'
import { Await, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight, Zap, Headphones, User, Phone } from 'lucide-react'
import assets from '../assets/assets'

const Login = ({ theme }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({ email: '', password: '', remember: false })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                }),

            })

            const { CheckAuth } = useAuth()


            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Login Failed')
                setLoading(false)
                return;
            }

            await CheckAuth()
            navigate('/dashboard/overview')
        } catch (err) {
            setError('Could not Connect to server ')
            setLoading(false)
        }
    }




    const features = [
        { icon: ShieldCheck, title: 'Bank-Grade Security', desc: '256-bit encryption keeps you safe' },
        { icon: Zap, title: 'Instant Transfer', desc: 'Send & receive money instantly' },
        { icon: Headphones, title: '24/7 Support', desc: 'We are here to help you anytime' },
    ]

    const qualities = [
        { icon: User, title: '10M+', desc: 'Happy Customer' },
        { icon: ShieldCheck, title: '99.9%', desc: 'Uptime Security' },
        { icon: Phone, title: '24/7', desc: 'Support Available' },
    ]

    return (
        <div className="min-h-screen xl:grid xl:grid-cols-[2fr_3fr_2fr]">

            {/* ── Left Panel ── */}
            <div className="hidden xl:block px-10 relative">

                <div className="absolute inset-0 bg-zen-light-gradient dark:bg-zen-gradient" />
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-zen-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-15 -right-15 w-80 h-80 bg-zen-secondary/15 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <Link to="/">
                        <img
                            src={theme === 'dark' ? assets.darkbglogo : assets.lglogo}
                            className="w-36 transition-transform"
                            alt="logo"
                        />
                    </Link>
                </div>

                <div className="flex flex-col pt-30 relative">
                    <p className="text-zen-primary font-semibold text-sm tracking-wider uppercase mb-3">Welcome Back</p>
                    <h1 className="text-3xl xl:text-5xl font-extrabold text-zen-light-text dark:text-zen-text leading-tight mb-4">
                        Secure Banking <br /> for{' '}
                        <span className="text-zen-primary">Modern Life</span>
                    </h1>
                    <p className="text-zen-light-muted dark:text-zen-muted text-base max-w-sm">
                        Access your accounts, transfer funds, pay bills and manage your finances
                        securely from anywhere.
                    </p>
                </div>

                <div className="flex relative">
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

                        <div className="mt-25 gap-3 z-10 flex items-center bg-white/60 dark:bg-white/5 border border-zen-light-border dark:border-zen-border backdrop-blur rounded-full px-5 py-3 w-fit">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            <span className="text-xs font-medium text-zen-light-muted dark:text-zen-muted">
                                Your data is protected by bank-level encryption
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Middle Panel (Image) ── */}
            <div className="relative hidden xl:flex flex-col items-center justify-center gap-15">
                <img
                    src={theme === 'dark' ? assets.logindk : assets.login}
                    alt=""
                    className="max-w-full h-full max-h-[600px] object-contain"
                />

                <div className="flex gap-4">
                    {qualities.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="flex items-center gap-2">
                            <div className="bg-zen-primary/10 dark:bg-[#0f1d4a] border border-zen-primary/20 rounded-xl p-3 shrink-0">
                                <Icon className="w-4 h-4 text-zen-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-zen-light-text dark:text-zen-text">{title}</h4>
                                <p className="text-sm text-zen-light-muted dark:text-zen-muted">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right Panel (Form) ── */}
            <div className="flex-1 relative overflow-hidden px-4 py-8 xl:py-0 bg-zen-light-bg dark:bg-zen-bg">

                <div className="absolute -top-15 -right-15 w-72 h-72 bg-zen-primary/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-40 w-64 h-64 bg-zen-secondary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-200/30 dark:bg-zen-primary/5 rounded-full blur-3xl pointer-events-none" />

                {/* mobile logo */}
                <div className="xl:hidden flex justify-center mb-6">
                    <Link to="/">
                        <img
                            src={theme === 'dark' ? assets.darkbglogo : assets.lglogo}
                            className="w-40 hover:scale-105 transition-transform"
                            alt="logo"
                        />
                    </Link>
                </div>

                <div className="max-w-md mx-auto pt-6 xl:pt-50 z-10">

                    <div className="relative z-10 bg-white/90 backdrop-blur-sm dark:bg-zen-card border border-white/80 dark:border-zen-border rounded-2xl p-8">

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-zen-light-text dark:text-zen-text">Sign in to your account</h2>
                            <p className="text-zen-light-muted dark:text-zen-muted text-sm mt-1">
                                Don&apos;t have an account?{' '}
                                <Link to="/register" className="text-zen-primary hover:underline font-medium">
                                    Create one free
                                </Link>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

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
                    </div>

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