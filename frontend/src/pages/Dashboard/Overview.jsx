import { useState, useEffect } from 'react'
import {
    CalendarDays, Wallet, TrendingUp, TrendingDown, HelpCircle,
    Send, PlusCircle, History, CreditCard, Eye, EyeOff, ChevronDown,
    CreditCard as CardIcon, ArrowRight, Bell, RefreshCw, Landmark, Copy, Check,
} from 'lucide-react'
import ThemeToggleButton from '../../components/ThemeToggleButton'
import { useOutletContext, NavLink } from 'react-router-dom'

// ─── Color map ────────────────────────────────────────────────────────────────
const colorMap = {
    blue:   { bg: 'bg-zen-primary/10 dark:bg-zen-primary/10',   text: 'text-zen-primary' },
    green:  { bg: 'bg-green-500/10 dark:bg-green-500/10',        text: 'text-green-500' },
    red:    { bg: 'bg-red-500/10 dark:bg-red-500/10',            text: 'text-red-500' },
    purple: { bg: 'bg-purple-500/10 dark:bg-purple-500/10',      text: 'text-purple-500' },
    yellow: { bg: 'bg-yellow-500/10 dark:bg-yellow-500/10',      text: 'text-yellow-500' },
}

// ─── Static data ──────────────────────────────────────────────────────────────
const statCards = [
    { label: 'Current Balance',   value: '$0',          color: 'blue',   icon: <Wallet size={18} /> },
    { label: 'Monthly Income',    value: '$0',          color: 'green',  icon: <TrendingUp size={18} /> },
    { label: 'Monthly Outgoing',  value: '$0',          color: 'red',    icon: <TrendingDown size={18} /> },
    { label: 'Transaction Limit', value: '$500,000.00', color: 'purple', icon: <HelpCircle size={18} /> },
]

const actionCards = [
    { label: 'IRS Refund', icon: <RefreshCw size={22} />,  bg: 'bg-zen-light-card dark:bg-zen-card', iconColor: 'text-zen-light-muted dark:text-zen-muted', path: '/dashboard/tax-refund' },
    { label: 'To Bank',    icon: <Landmark size={22} />,   bg: 'bg-zen-primary',                      iconColor: 'text-zen-text',                             path: '/dashboard/local-transfer' },
    { label: 'Deposit',    icon: <PlusCircle size={22} />, bg: 'bg-green-500/10 dark:bg-green-500/10',iconColor: 'text-green-500',                            path: '/dashboard/deposit' },
    { label: 'ATM Card',   icon: <CreditCard size={22} />, bg: 'bg-purple-500/10',                    iconColor: 'text-purple-500',                           path: '/dashboard/cards' },
]

const accountStats = [
    { color: 'blue',   label: 'Transaction Limit',   value: '$500,000.00', icon: <CardIcon size={16} /> },
    { color: 'yellow', label: 'Pending Transactions', value: '$0.00',       icon: <History size={16} /> },
    { color: 'green',  label: 'Transaction Volume',   value: '$0.00',       icon: <TrendingUp size={16} /> },
    { color: 'purple', label: 'Account Age',          value: '3 days',      icon: <CalendarDays size={16} /> },
]

const transferOptions = [
    { label: 'Local Transfer',         sub: '0% Handling charges', globe: false },
    { label: 'International Transfer', sub: 'Global reach, 0% fee', globe: true },
]

const mobileServices = [
    { label: 'Loan',               icon: <Landmark size={20} />,   bg: 'bg-purple-500/10', color: 'text-purple-500', path: '/dashboard/loan-request' },
    { label: 'International Wire', icon: <ArrowRight size={20} />, bg: 'bg-zen-primary/10',color: 'text-zen-primary', path: '/dashboard/international' },
    { label: 'Local Wire',         icon: <Send size={20} />,       bg: 'bg-green-500/10',  color: 'text-green-500',  path: '/dashboard/local-transfer' },
    { label: 'Transactions',       icon: <History size={20} />,    bg: 'bg-yellow-500/10', color: 'text-yellow-500', path: '/dashboard/transactions' },
    { label: 'Add Money',          icon: <PlusCircle size={20} />, bg: 'bg-green-500/10',  color: 'text-green-500',  path: '/dashboard/deposit' },
    { label: 'ATM Card',           icon: <CreditCard size={20} />, bg: 'bg-red-500/10',    color: 'text-red-500',    path: '/dashboard/cards' },
    { label: 'Pay with QR',        icon: <Send size={20} />,       bg: 'bg-zen-primary/10',color: 'text-zen-primary', extra: true },
    { label: 'Pay Bills',          icon: <History size={20} />,    bg: 'bg-purple-500/10', color: 'text-purple-500', extra: true },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

const MobileServices = () => {
    const [showMore, setShowMore] = useState(false)
    const visible = mobileServices.filter(s => !s.extra || showMore)
    return (
        <div className='xl:hidden'>
            <p className='text-sm font-medium text-zen-light-muted dark:text-zen-muted mb-3'>Services</p>
            <div className='grid grid-cols-3 gap-2'>
                {visible.map(({ label, icon, bg, color, path }) => (
                    <NavLink key={label} to={path}
                        className='flex flex-col items-center gap-2 p-3 rounded-xl bg-zen-light-card dark:bg-zen-card border border-zen-light-border dark:border-zen-border hover:opacity-80 transition'>
                        <div className={`w-10 h-10 rounded-full ${bg} ${color} flex items-center justify-center`}>{icon}</div>
                        <span className='text-[11px] font-medium text-zen-light-text dark:text-zen-text text-center leading-tight'>{label}</span>
                    </NavLink>
                ))}
            </div>
            <button
                onClick={() => setShowMore(p => !p)}
                className='mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zen-light-border dark:border-zen-border text-sm text-zen-light-muted dark:text-zen-muted hover:bg-zen-light-card dark:hover:bg-zen-card transition'
            >
                {showMore ? 'Show less' : 'More services'}
                <ChevronDown size={14} className={`transition-transform ${showMore ? 'rotate-180' : ''}`} />
            </button>
        </div>
    )
}

const StatCard = ({ label, value, color, icon }) => {
    const c = colorMap[color]
    return (
        <div className='bg-zen-light-card dark:bg-zen-card rounded-xl p-4 flex items-center justify-between border border-zen-light-border dark:border-zen-border'>
            <div>
                <p className='text-xs text-zen-light-muted dark:text-zen-muted mb-1'>{label}</p>
                <p className={`text-lg font-semibold ${c.text}`}>{value}</p>
            </div>
            <div className={`w-10 h-10 rounded-full ${c.bg} ${c.text} flex items-center justify-center`}>{icon}</div>
        </div>
    )
}

const ActionCard = ({ label, icon, bg, iconColor, path }) => (
    <NavLink to={path} className={`${bg} border border-zen-light-border dark:border-zen-border rounded-xl p-2 xl:p-5 flex flex-col items-center gap-2 xl:gap-3 w-full hover:opacity-90 transition`}>
        <span className={iconColor}>{icon}</span>
        <span className='text-xs xl:text-sm font-medium text-zen-light-text dark:text-zen-text'>{label}</span>
    </NavLink>
)

const StatRow = ({ label, value, color, icon }) => {
    const c = colorMap[color]
    return (
        <div className='flex items-center gap-3'>
            <div className={`w-9 h-9 rounded-full ${c.bg} ${c.text} flex items-center justify-center shrink-0`}>{icon}</div>
            <div>
                <p className='text-xs text-zen-light-muted dark:text-zen-muted'>{label}</p>
                <p className='text-sm font-semibold text-zen-light-text dark:text-zen-text'>{value}</p>
            </div>
        </div>
    )
}

const TransferOption = ({ label, sub, globe }) => (
    <NavLink to={globe ? '/dashboard/international' : '/dashboard/local-transfer'}
        className='flex items-center justify-between p-3 rounded-xl bg-zen-light-card dark:bg-zen-card border border-zen-light-border dark:border-zen-border hover:opacity-80 transition'>
        <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-full bg-zen-primary/10 text-zen-primary flex items-center justify-center'>
                {globe ? <ArrowRight size={16} /> : <Send size={16} />}
            </div>
            <div>
                <p className='text-sm font-medium text-zen-light-text dark:text-zen-text'>{label}</p>
                <p className='text-xs text-zen-light-muted dark:text-zen-muted'>{sub}</p>
            </div>
        </div>
        <ArrowRight size={16} className='text-zen-light-muted dark:text-zen-muted' />
    </NavLink>
)

// ─── Account number with copy button ─────────────────────────────────────────
const AccountNumber = ({ accountNo, show }) => {
    const [copied, setCopied] = useState(false)

    const copy = (e) => {
        e.stopPropagation()
        navigator.clipboard.writeText(accountNo ?? '')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const display = show
        ? (accountNo ?? '—')
        : '•••• •••• ••••'

    return (
        <div className='flex items-center gap-2'>
            <div>
                <p className='text-[10px] text-white/50 uppercase tracking-wider mb-0.5'>Account Number</p>
                <p className='text-sm font-mono font-semibold text-white tracking-widest'>{display}</p>
            </div>
            {show && accountNo && (
                <button
                    onClick={copy}
                    className='ml-1 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition'
                    title='Copy account number'
                >
                    {copied
                        ? <Check size={13} className='text-green-300' />
                        : <Copy size={13} className='text-white/70' />
                    }
                </button>
            )}
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const Overview = () => {
    const { theme, setTheme, user } = useOutletContext()

    const [showBalance, setShowBalance] = useState(true)
    const [showNotif, setShowNotif]     = useState(false)
    const [time, setTime]               = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const date = time.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })

    const hour     = time.getHours()
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

    const firstName  = user?.first_name  ?? ''
    const lastName   = user?.last_name   ?? ''
    const fullName   = user ? `${firstName} ${lastName}`.trim() : 'Loading...'
    const initials   = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || '?'
    const accountNo  = user?.account_number ?? null

    const NotifDropdown = ({ width }) => (
        showNotif && (
            <div className={`absolute right-0 top-10 ${width} p-3 rounded-xl border border-zen-light-border dark:border-zen-border shadow-lg bg-zen-light-card dark:bg-zen-card z-50`}>
                <div className='flex justify-between border-b border-zen-light-border dark:border-zen-border p-2'>
                    <p className='text-zen-light-text dark:text-zen-text font-medium text-sm'>Notifications</p>
                    <p className='text-zen-primary cursor-pointer text-xs'>Mark as read</p>
                </div>
                <p className='text-center text-xs text-zen-light-muted dark:text-zen-muted py-6'>No new notifications</p>
            </div>
        )
    )

    return (
        <div className='flex min-h-screen bg-zen-light-bg dark:bg-zen-bg' onClick={() => setShowNotif(false)}>
            <div className='flex flex-1 overflow-hidden'>

                {/* ── CENTER ── */}
                <main className='flex-1 overflow-y-auto p-4 xl:p-6 space-y-5'>

                    {/* Desktop top bar */}
                    <div className='hidden xl:flex items-center justify-between'>
                        <div className='flex items-center gap-2 text-zen-light-muted dark:text-zen-muted text-sm'>
                            <CalendarDays size={16} />
                            <span>{date}</span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <div className='relative' onClick={e => e.stopPropagation()}>
                                <button onClick={() => setShowNotif(p => !p)} className='p-2 rounded-full hover:bg-zen-light-card dark:hover:bg-zen-card'>
                                    <Bell size={24} className='text-zen-light-muted dark:text-zen-muted' />
                                </button>
                                <NotifDropdown width='w-[350px]' />
                            </div>
                            <ThemeToggleButton theme={theme} setTheme={setTheme} />
                        </div>
                    </div>

                    {/* Mobile top bar */}
                    <div className='flex xl:hidden items-center justify-between'>
                        <div>
                            <p className='text-xs text-zen-light-muted dark:text-zen-muted'>{greeting}</p>
                            <p className='text-sm font-semibold text-zen-light-text dark:text-zen-text'>{firstName || 'Loading...'}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='relative' onClick={e => e.stopPropagation()}>
                                <button onClick={() => setShowNotif(p => !p)} className='p-2 rounded-full hover:bg-zen-light-card dark:hover:bg-zen-card'>
                                    <Bell size={20} className='text-zen-light-muted dark:text-zen-muted' />
                                </button>
                                <NotifDropdown width='w-[290px]' />
                            </div>
                            <ThemeToggleButton theme={theme} setTheme={setTheme} />
                        </div>
                    </div>

                    {/* ── Balance card ── */}
                    <div className='w-full rounded-2xl px-4 py-5 xl:px-6 xl:py-6 text-white'
                        style={{ background: 'linear-gradient(135deg, #0f4c6b 0%, #1a7a8a 60%, #1e9e9e 100%)' }}>

                        {/* Top row — user greeting + badge */}
                        <div className='flex items-center justify-between mb-5'>
                            <div className='flex items-center gap-3'>
                                <div className='w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0'>
                                    {initials}
                                </div>
                                <div>
                                    <p className='text-[11px] text-white/50'>{greeting}</p>
                                    <p className='text-sm font-semibold text-white leading-tight'>{fullName}</p>
                                </div>
                            </div>
                            {/* hide/show toggle */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowBalance(p => !p) }}
                                className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-xs text-white/80'
                            >
                                {showBalance ? <EyeOff size={13} /> : <Eye size={13} />}
                                {showBalance ? 'Hide' : 'Show'}
                            </button>
                        </div>

                        {/* Balance */}
                        <div className='mb-1'>
                            <p className='text-[11px] text-white/50 uppercase tracking-wider mb-1'>Available Balance</p>
                            <p className='text-2xl xl:text-3xl font-bold tracking-tight'>
                                {showBalance ? '$0.00 USD' : '•••••••'}
                            </p>
                        </div>

                        {/* Divider */}
                        <div className='my-4 border-t border-white/10' />

                        {/* Account number row — visible on BOTH mobile and desktop */}
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                            <AccountNumber accountNo={accountNo} show={showBalance} />

                            {/* Quick action pills */}
                            <div className='flex gap-2'>
                                <NavLink to='/dashboard/deposit'
                                    className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-xs text-white font-medium'>
                                    <PlusCircle size={13} /> Deposit
                                </NavLink>
                                <NavLink to='/dashboard/local-transfer'
                                    className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-xs text-white font-medium'>
                                    <Send size={13} /> Transfer
                                </NavLink>
                            </div>
                        </div>
                    </div>

                    {/* Quick action cards */}
                    <div className='grid grid-cols-4 gap-3 xl:gap-4'>
                        {actionCards.map(({ label, icon, bg, iconColor, path }) => (
                            <ActionCard key={label} label={label} icon={icon} bg={bg} iconColor={iconColor} path={path} />
                        ))}
                    </div>

                    <MobileServices />

                    {/* Quick Transfer — mobile only */}
                    <div className='xl:hidden'>
                        <p className='font-semibold text-zen-light-text dark:text-zen-text mb-3'>Quick Transfer</p>
                        <div className='space-y-3'>
                            {transferOptions.map(({ label, sub, globe }) => (
                                <TransferOption key={label} label={label} sub={sub} globe={globe} />
                            ))}
                        </div>
                    </div>

                    {/* Your Cards */}
                    <div>
                        <div className='flex justify-between items-center mb-4'>
                            <div className='flex items-center gap-2 text-zen-light-text dark:text-zen-text font-semibold text-sm'>
                                <CreditCard size={16} />
                                <span>Your Cards</span>
                            </div>
                            <NavLink to='/dashboard/cards' className='text-sm text-zen-primary flex items-center gap-1 hover:text-zen-secondary transition'>
                                View all <ArrowRight size={14} />
                            </NavLink>
                        </div>
                        <div className='rounded-xl border border-zen-light-border dark:border-zen-border p-8 flex flex-col items-center justify-center gap-3 bg-zen-light-card dark:bg-zen-card'>
                            <div className='w-12 h-12 rounded-full bg-zen-light-bg dark:bg-zen-bg flex items-center justify-center'>
                                <CreditCard size={22} className='text-zen-light-muted dark:text-zen-muted' />
                            </div>
                            <p className='text-sm text-zen-light-muted dark:text-zen-muted'>No cards yet. Add a card to get started.</p>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div>
                        <div className='flex justify-between items-center mb-4'>
                            <div className='flex items-center gap-2 text-zen-light-text dark:text-zen-text font-semibold text-sm'>
                                <History size={16} />
                                <span>Recent Transactions</span>
                            </div>
                            <NavLink to='/dashboard/transactions' className='text-sm text-zen-primary flex items-center gap-1 hover:text-zen-secondary transition'>
                                View all <ArrowRight size={14} />
                            </NavLink>
                        </div>
                        <div className='rounded-xl border border-zen-light-border dark:border-zen-border p-10 flex flex-col items-center justify-center gap-3 bg-zen-light-card dark:bg-zen-card'>
                            <div className='w-12 h-12 rounded-full bg-zen-light-bg dark:bg-zen-bg flex items-center justify-center'>
                                <History size={22} className='text-zen-light-muted dark:text-zen-muted' />
                            </div>
                            <p className='text-sm text-zen-light-muted dark:text-zen-muted'>No transactions yet.</p>
                            <p className='text-xs text-zen-light-muted dark:text-zen-muted opacity-60'>Your transaction history will appear here.</p>
                        </div>
                    </div>

                </main>

                {/* ── RIGHT PANEL — desktop only ── */}
                <aside className='hidden xl:block w-72 shrink-0 border-l border-zen-light-border dark:border-zen-border overflow-y-auto p-6 space-y-8 bg-zen-light-bg dark:bg-zen-bg'>

                    {/* User card — name + account type only, no duplicate account number */}
                    <div className='rounded-xl border border-zen-light-border dark:border-zen-border bg-zen-light-card dark:bg-zen-card p-4'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-full bg-zen-primary flex items-center justify-center text-zen-text text-sm font-bold shrink-0'>
                                {initials}
                            </div>
                            <div className='min-w-0'>
                                <p className='text-sm font-semibold text-zen-light-text dark:text-zen-text truncate'>{fullName}</p>
                                <p className='text-xs text-zen-light-muted dark:text-zen-muted'>Personal Account</p>
                            </div>
                        </div>
                        <div className='mt-3 pt-3 border-t border-zen-light-border dark:border-zen-border flex items-center gap-1.5'>
                            <div className='w-2 h-2 rounded-full bg-green-500 shrink-0' />
                            <p className='text-xs text-zen-light-muted dark:text-zen-muted'>Account active</p>
                        </div>
                    </div>

                    {/* Account Statistics */}
                    <div>
                        <p className='font-semibold text-zen-light-text dark:text-zen-text mb-4 text-sm'>Account Statistics</p>
                        <div className='space-y-4'>
                            {accountStats.map(({ color, label, value, icon }) => (
                                <StatRow key={label} color={color} label={label} value={value} icon={icon} />
                            ))}
                        </div>
                    </div>

                    {/* Quick Transfer */}
                    <div>
                        <p className='font-semibold text-zen-light-text dark:text-zen-text mb-3 text-sm'>Quick Transfer</p>
                        <div className='space-y-3'>
                            {transferOptions.map(({ label, sub, globe }) => (
                                <TransferOption key={label} label={label} sub={sub} globe={globe} />
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Overview
