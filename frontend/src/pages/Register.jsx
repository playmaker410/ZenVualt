import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight, ArrowLeft,
    User, Phone, Globe, CreditCard, Check, Zap, Headphones
} from 'lucide-react'
import assets from '../assets/assets'

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso",
    "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
    "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Republic of the)",
    "Congo (Democratic Republic)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
    "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
    "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
    "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
    "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
    "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
    "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova",
    "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
    "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
    "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine",
    "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
    "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
    "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
    "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
    "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
]

const steps = [
    { id: 1, label: 'Personal Details' },
    { id: 2, label: 'Contact Details' },
    { id: 3, label: 'Account Setup' },
    { id: 4, label: 'Security' },
]

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
const Register = ({ theme }) => {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [showPin, setShowPin] = useState(false)
    const [showConfirmPin, setShowConfirmPin] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [form, setForm] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        phone: '',
        email: '',
        country: '',
        pin: '',
        confirmPin: '',
        password: '',
        confirmPassword: '',
    })

    const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

    const validateStep = () => {
        setError('')

        if (step === 1) {
            if (!form.firstName.trim() || !form.lastName.trim()) {
                setError('First name and legal last name are required')
                return false
            }
        }

        if (step === 2) {
            if (!form.phone.trim() || !form.email.trim() || !form.country) {
                setError('Please fill in all contact details')
                return false
            }
        }

        if (step === 3) {
            if (form.pin.length !== 4 || form.confirmPin.length !== 4) {
                setError('Your bank PIN must be exactly 4 digits')
                return false
            }
            if (form.pin !== form.confirmPin) {
                setError('PINs do not match')
                return false
            }
        }

        if (step === 4) {
            if (form.password.length < 8) {
                setError('Password must be at least 8 characters')
                return false
            }
            if (form.password !== form.confirmPassword) {
                setError('Passwords do not match')
                return false
            }
        }

        return true
    }

    const handleNext = () => {
        if (!validateStep()) return
        setStep((s) => Math.min(s + 1, steps.length))
    }

    const handlePrev = () => {
        setError('')
        setStep((s) => Math.max(s - 1, 1))
    }
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateStep()) return
        setLoading(true)
        setError('')

        try {
            const res = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: form.firstName,
                    middle_name: form.middleName,
                    last_name: form.lastName,
                    phone: form.phone,
                    email: form.email,
                    country: form.country,
                    bank_pin: form.pin,
                    password: form.password
                }),
            })


            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Registration failed')
                setLoading(false)
                return
            }


            navigate('/dashboard/overview')
        } catch (err) {
            setError('Could not Connect to server ')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen xl:grid xl:grid-cols-[2fr_3fr_2fr] px-3">

            {/* ── Left Panel ── */}
            <div className=" hidden xl:block px-10 relative" >

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


                <div className="flex flex-col pt-30 relative ">
                    <p className="text-zen-primary font-semibold text-sm tracking-wider uppercase mb-3">Get Started</p>
                    <h1 className="text-3xl xl:text-5xl font-extrabold text-zen-light-text dark:text-zen-text leading-tight mb-4">
                        Open Your Account <br /> in{' '}
                        <span className="text-zen-primary">Minutes</span>
                    </h1>
                    <p className="text-zen-light-muted dark:text-zen-muted text-base max-w-sm">
                        Create your Zenvault account and unlock secure banking, instant transfers,
                        and tools to manage your finances from anywhere.
                    </p>
                </div>

                <div className='flex relative '>
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


                        <div className="mt-25 gap-3 z-10 flex items-center  bg-white/60 dark:bg-white/5 border border-zen-light-border dark:border-zen-border backdrop-blur rounded-full px-5 py-3 w-fit">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            <span className="text-xs font-medium text-zen-light-muted dark:text-zen-muted">
                                Your data is protected by bank-level encryption
                            </span>
                        </div>
                    </div>
                </div>



            </div>





            <div className=" relative hidden xl:flex flex-col items-center justify-center gap-15">
                <img src={theme === 'dark' ? assets.logindk : assets.login} alt="" className=" max-w-full h-full max-h-[600px]  object-contain" />


                <div className='flex gap-4 '>
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
            <div className="flex-1 relative overflow-hidden px-4 py-8 xl:py-0 bg-zen-light-bg dark:bg-zen-bg ">

                <div className="absolute -top-15 -right-15 w-72 h-72 bg-zen-primary/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-40 w-64 h-64 bg-zen-secondary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-200/30 dark:bg-zen-primary/5 rounded-full blur-3xl pointer-events-none" />

                {/* mobile logo */}
                <div className="xl:hidden flex justify-center  mb-6 ">
                    <Link to="/">
                        <img
                            src={theme === 'dark' ? assets.darkbglogo : assets.lglogo}
                            className="w-40 hover:scale-105 transition-transform"
                            alt="logo"
                        />
                    </Link>
                </div>

                <div className="max-w-md mx-auto  pt-6  xl:pt-50 z-10">

                    <div className="relative z-10 bg-white/90 backdrop-blur-sm dark:bg-zen-card border border-white/80 dark:border-zen-border rounded-2xl p-8">

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-zen-light-text dark:text-zen-text">Create your account</h2>
                            <p className="text-zen-light-muted dark:text-zen-muted text-sm mt-1">
                                Already have an account?{' '}
                                <Link to="/login" className="text-zen-primary hover:underline font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>

                        {/* ── Progress Tracker ── */}
                        <div className="flex items-center mb-8">
                            {steps.map((s, i) => (
                                <React.Fragment key={s.id}>
                                    <div className="flex flex-col items-center gap-2 shrink-0">
                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${step > s.id
                                                ? 'bg-zen-primary border-zen-primary text-white'
                                                : step === s.id
                                                    ? 'border-zen-primary text-zen-primary'
                                                    : 'border-zen-light-border dark:border-zen-border text-zen-light-muted dark:text-zen-muted'
                                                }`}
                                        >
                                            {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                                        </div>
                                        <span
                                            className={`text-[10px] font-medium text-center hidden sm:block w-16 leading-tight ${step >= s.id
                                                ? 'text-zen-light-text dark:text-zen-text'
                                                : 'text-zen-light-muted dark:text-zen-muted'
                                                }`}
                                        >
                                            {s.label}
                                        </span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div
                                            className={`flex-1 h-0.5 mx-2 transition-colors ${step > s.id ? 'bg-zen-primary' : 'bg-zen-light-border dark:bg-zen-border'
                                                }`}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                            {/* ── Step 1: Personal Details ── */}
                            {step === 1 && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5">
                                            First name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="John"
                                                value={form.firstName}
                                                onChange={(e) => update('firstName', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5">
                                            Middle name <span className="text-zen-light-muted dark:text-zen-muted font-normal">(optional)</span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted" />
                                            <input
                                                type="text"
                                                placeholder="Michael"
                                                value={form.middleName}
                                                onChange={(e) => update('middleName', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5">
                                            Legal last name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="Doe"
                                                value={form.lastName}
                                                onChange={(e) => update('lastName', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ── Step 2: Contact Details ── */}
                            {step === 2 && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5">
                                            Phone number
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted" />
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+1 (555) 123-4567"
                                                value={form.phone}
                                                onChange={(e) => update('phone', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition"
                                            />
                                        </div>
                                    </div>

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
                                                onChange={(e) => update('email', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5">
                                            Country
                                        </label>
                                        <div className="relative">
                                            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted pointer-events-none" />
                                            <select
                                                required
                                                value={form.country}
                                                onChange={(e) => update('country', e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition appearance-none"
                                            >
                                                <option value="" disabled>Select your country</option>
                                                {countries.map((c) => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ── Step 3: Account Setup ── */}
                            {step === 3 && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5">
                                            Bank PIN
                                        </label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted" />
                                            <input
                                                type={showPin ? 'text' : 'password'}
                                                required
                                                inputMode="numeric"
                                                maxLength={4}
                                                placeholder="4-digit PIN"
                                                value={form.pin}
                                                onChange={(e) => update('pin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                className="w-full pl-10 pr-10 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPin(!showPin)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zen-light-muted dark:text-zen-muted hover:text-zen-primary transition"
                                                aria-label="Toggle PIN visibility"
                                            >
                                                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5">
                                            Confirm PIN
                                        </label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted" />
                                            <input
                                                type={showConfirmPin ? 'text' : 'password'}
                                                required
                                                inputMode="numeric"
                                                maxLength={4}
                                                placeholder="Re-enter your PIN"
                                                value={form.confirmPin}
                                                onChange={(e) => update('confirmPin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                className="w-full pl-10 pr-10 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPin(!showConfirmPin)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zen-light-muted dark:text-zen-muted hover:text-zen-primary transition"
                                                aria-label="Toggle confirm PIN visibility"
                                            >
                                                {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-zen-light-muted dark:text-zen-muted mt-1.5">
                                            This 4-digit PIN will be used to authorize transactions.
                                        </p>
                                    </div>
                                </>
                            )}

                            {/* ── Step 4: Security ── */}
                            {step === 4 && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                placeholder="Create a password"
                                                value={form.password}
                                                onChange={(e) => update('password', e.target.value)}
                                                className="w-full pl-10 pr-10 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zen-light-muted dark:text-zen-muted hover:text-zen-primary transition"
                                                aria-label="Toggle password visibility"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-zen-light-muted dark:text-zen-muted mt-1.5">
                                            Must be at least 8 characters.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5">
                                            Confirm password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted" />
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                required
                                                placeholder="Re-enter your password"
                                                value={form.confirmPassword}
                                                onChange={(e) => update('confirmPassword', e.target.value)}
                                                className="w-full pl-10 pr-10 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zen-light-muted dark:text-zen-muted hover:text-zen-primary transition"
                                                aria-label="Toggle confirm password visibility"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ── Error message ── */}
                            {error && (
                                <p className="text-sm text-red-500 -mt-2">{error}</p>
                            )}

                            {/* ── Navigation buttons ── */}
                            <div className="flex items-center gap-3">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl border border-zen-light-border dark:border-zen-border text-zen-light-text dark:text-zen-text font-bold text-sm hover:bg-zen-light-bg dark:hover:bg-zen-bg transition active:scale-[0.98]"
                                    >
                                        <ArrowLeft className="w-4 h-4" /> Previous
                                    </button>
                                )}

                                {step < steps.length ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl bg-zen-primary hover:bg-zen-secondary text-white font-bold text-sm transition-all duration-300 hover:shadow-neon active:scale-[0.98]"
                                    >
                                        Next <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl bg-zen-primary hover:bg-zen-secondary text-white font-bold text-sm transition-all duration-300 hover:shadow-neon active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>Create Account <ArrowRight className="w-4 h-4" /></>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <p className="text-center text-xs text-zen-light-muted dark:text-zen-muted mt-6">
                        By creating an account, you agree to our{' '}
                        <a href="#" className="text-zen-primary hover:underline">Terms of Service</a> and{' '}
                        <a href="#" className="text-zen-primary hover:underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div >
    )
}

export default Register