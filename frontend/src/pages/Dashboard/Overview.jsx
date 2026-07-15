import React, { useState, useEffect } from 'react'
import {
    CalendarDays, Wallet, TrendingUp, TrendingDown, HelpCircle,
    Send, PlusCircle, History, Info, CreditCard, Eye, EyeOff, ChevronDown,
    CreditCard as CardIcon, ArrowRight, Bell, RefreshCw, Landmark
} from 'lucide-react'
import ThemeToggleButton from '../../components/ThemeToggleButton'
import { useOutletContext, NavLink } from 'react-router-dom'


// ─── Data ────────────────────────────────────────────────────────────────────

const colorMap = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-500' },
    green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-500' },
    red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-500' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-500' },
    yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-500' },
}

const statCards = [
    { label: 'Current Balance', value: '$0', color: 'blue', icon: <Wallet size={18} /> },
    { label: 'Monthly Income', value: '$0', color: 'green', icon: <TrendingUp size={18} /> },
    { label: 'Monthly Outgoing', value: '$0', color: 'red', icon: <TrendingDown size={18} /> },
    { label: 'Transaction Limit', value: '$500,000.00', color: 'purple', icon: <HelpCircle size={18} /> },
]

const actionCards = [
    { label: 'Irs Refund', icon: <RefreshCw size={24} />, bg: 'bg-zen-light-card dark:bg-zen-card', iconColor: 'text-zen-light-muted dark:text-zen-muted', textColor: undefined, path: '/dashboard/tax-refund' },
    { label: 'To Bank', icon: <Landmark size={24} />, bg: 'bg-blue-500', iconColor: 'text-white', textColor: 'text-white', path: '/dashboard/local-transfer' },
    { label: 'Deposit', icon: <PlusCircle size={24} />, bg: 'bg-green-50 dark:bg-green-900/20', iconColor: 'text-green-500', textColor: undefined, path: '/dashboard/deposit' },
    { label: 'Atm Card', icon: <CreditCard size={24} />, bg: 'bg-purple-50 dark:bg-purple-900/20', iconColor: 'text-purple-500', textColor: undefined, path: '/dashboard/cards' },
]

const accountStats = [
    { color: 'blue', label: 'Transaction Limit', value: '$500,000.00', icon: <CardIcon size={16} /> },
    { color: 'yellow', label: 'Pending Transactions', value: '$0.00', icon: <History size={16} /> },
    { color: 'green', label: 'Transaction Volume', value: '$0.00', icon: <TrendingUp size={16} /> },
    { color: 'purple', label: 'Account Age', value: '3 days', icon: <CalendarDays size={16} /> },
]

const transferOptions = [
    { label: 'Local Transfer', sub: '0% Handling charges', globe: false },
    { label: 'International Transfer', sub: 'Global reach, 0% fee', globe: true },
]

const mobileServices = [
    { label: 'Loan', icon: <Landmark size={20} />, bg: 'bg-purple-50 dark:bg-purple-900/20', color: 'text-purple-500', path: '/dashboard/loan-request' },
    { label: 'International wire', icon: <ArrowRight size={20} />, bg: 'bg-blue-50 dark:bg-blue-900/20', color: 'text-blue-500', path: '/dashboard/international' },
    { label: 'Local wire', icon: <Send size={20} />, bg: 'bg-green-50 dark:bg-green-900/20', color: 'text-green-500', path: '/dashboard/local-transfer' },
    { label: 'Transactions', icon: <History size={20} />, bg: 'bg-yellow-50 dark:bg-yellow-900/20', color: 'text-yellow-500', path: '/dashboard/transactions' },
    { label: 'Add money', icon: <PlusCircle size={20} />, bg: 'bg-green-50 dark:bg-green-900/20', color: 'text-green-500', path: '/dashboard/deposit' },
    { label: 'ATM card', icon: <CreditCard size={20} />, bg: 'bg-red-50 dark:bg-red-900/20', color: 'text-red-500', path: '/dashboard/cards' },
    // extras shown after "More"
    { label: 'Pay with QR', icon: <Send size={20} />, bg: 'bg-blue-50 dark:bg-blue-900/20', color: 'text-blue-500', extra: true },
    { label: 'Pay bills', icon: <History size={20} />, bg: 'bg-purple-50 dark:bg-purple-900/20', color: 'text-purple-500', extra: true },
]

const MobileServices = () => {
    const [showMore, setShowMore] = useState(false)
    const visible = mobileServices.filter(s => !s.extra || showMore)
    const hasExtras = mobileServices.some(s => s.extra)

    return (
        <div className='xl:hidden'>
            <p className='text-sm font-medium text-zen-light-muted dark:text-zen-muted mb-3'>Services</p>
            <div className='grid grid-cols-3 gap-2'>
                {visible.map(({ label, icon, bg, color, path }) => (

                    <NavLink
                        key={label}
                        to={path}
                        className='flex flex-col items-center gap-2 p-3 rounded-xl bg-zen-light-card dark:bg-zen-card border border-zen-light-border dark:border-zen-border hover:opacity-80 transition'>
                        <div className={`w-10 h-10 rounded-full ${bg} ${color} flex items-center justify-center`}>
                            {icon}
                        </div>
                        <span className='text-[11px] font-medium text-zen-light-text dark:text-zen-text text-center leading-tight'>{label}</span>
                    </NavLink>

                ))}
            </div>
            {hasExtras && (
                <button
                    onClick={() => setShowMore(!showMore)}
                    className='mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zen-light-border dark:border-zen-border text-sm text-zen-light-muted dark:text-zen-muted hover:bg-zen-light-card dark:hover:bg-zen-card transition'
                >
                    {showMore ? 'Show less' : 'More services'}
                    <ChevronDown size={14} className={`transition-transform ${showMore ? 'rotate-180' : ''}`} />
                </button>
            )}
        </div>
    )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ label, value, color, icon }) => {
    const c = colorMap[color]
    return (
        <div className='bg-zen-light-card dark:bg-zen-card rounded-xl p-4 flex items-center justify-between'>
            <div>
                <p className='text-xs text-zen-light-muted dark:text-zen-muted mb-1'>{label}</p>
                <p className={`text-lg font-semibold ${c.text}`}>{value}</p>
            </div>
            <div className={`w-10 h-10 rounded-full ${c.bg} ${c.text} flex items-center justify-center`}>
                {icon}
            </div>
        </div>
    )
}

const ActionCard = ({ label, icon, bg, iconColor, textColor = 'text-zen-light-text dark:text-zen-text', path }) => (
    <NavLink to={path} className={`${bg} rounded-xl p-2 xl:p-6 flex flex-col items-center gap-2 xl:gap-3 w-full hover:opacity-90 transition`}>
        <span className={iconColor}>{icon}</span>
        <span className={`text-xs xl:text-sm font-medium ${textColor}`}>{label}</span>
    </NavLink>
)

const StatRow = ({ label, value, color, icon }) => {
    const c = colorMap[color]
    return (
        <div className='flex items-center gap-3'>
            <div className={`w-9 h-9 rounded-full ${c.bg} ${c.text} flex items-center justify-center shrink-0`}>
                {icon}
            </div>
            <div>
                <p className='text-xs text-zen-light-muted dark:text-zen-muted'>{label}</p>
                <p className='text-sm font-semibold text-zen-light-text dark:text-zen-text'>{value}</p>
            </div>
        </div>
    )
}

const TransferOption = ({ label, sub, globe }) => (
    <div className='flex items-center justify-between p-3 rounded-xl bg-zen-light-card dark:bg-zen-card cursor-pointer hover:opacity-80 transition'>
        <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center'>
                {globe ? <ArrowRight size={16} /> : <Send size={16} />}
            </div>
            <div>
                <p className='text-sm font-medium text-zen-light-text dark:text-zen-text'>{label}</p>
                <p className='text-xs text-zen-light-muted dark:text-zen-muted'>{sub}</p>
            </div>
        </div>
        <ArrowRight size={16} className='text-zen-light-muted dark:text-zen-muted' />
    </div>
)


// ─── Main Component ───────────────────────────────────────────────────────────

const Overview = () => {
    const { theme, setTheme, accountno } = useOutletContext()

    const [showBalance, setShowBalance] = useState(true)
    const [showNotif, setShowNotif] = useState(false)
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const date = time.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })

    const timeStr = time.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    })

    const hour = time.getHours()
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

    return (
        <div className='flex min-h-screen bg-zen-light-bg dark:bg-zen-bg' onClick={() => setShowNotif(false)}>

            <div className='flex flex-1 overflow-hidden'>

                {/* CENTER */}
                <main className='flex-1 overflow-y-auto p-4 xl:p-6 space-y-5'>

                    {/* Top bar — desktop only */}
                    <div className='hidden xl:flex items-center justify-between'>
                        <div className='flex items-center gap-2 text-zen-light-muted dark:text-zen-muted text-sm'>
                            <CalendarDays size={16} />
                            <span>{date}</span>
                        </div>

                        <div className='flex items-center gap-3'>
                            <div className='relative' onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setShowNotif(!showNotif)}
                                    className='p-2 rounded-full hover:bg-zen-light-card dark:hover:bg-zen-card'
                                >
                                    <Bell size={24} className='text-zen-light-muted dark:text-zen-muted' />
                                </button>
                                {showNotif && (
                                    <div className='absolute right-0 top-10 w-[350px] p-3 rounded-md border border-white/10 shadow-[4px_0_20px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_20px_rgba(0,0,0,0.4)] bg-white dark:bg-zinc-900 z-50'>
                                        <div className='flex justify-between border-b border-gray-200/40 dark:border-white/10 p-2'>
                                            <p className='text-gray-900 dark:text-white font-medium'>Notifications</p>
                                            <p className='text-blue-500 cursor-pointer text-sm'>Mark as read</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <ThemeToggleButton theme={theme} setTheme={setTheme} />
                        </div>
                    </div>

                    {/* Mobile top bar */}
                    <div className='flex xl:hidden items-center justify-between'>
                        <div>
                            <p className='text-xs text-zen-light-muted dark:text-zen-muted'>{greeting}</p>
                            <p className='text-sm font-semibold text-zen-light-text dark:text-zen-text'>Hel</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='relative' onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setShowNotif(!showNotif)}
                                    className='p-2 rounded-full hover:bg-zen-light-card dark:hover:bg-zen-card'
                                >
                                    <Bell size={20} className='text-zen-light-muted dark:text-zen-muted' />
                                </button>
                                {showNotif && (
                                    <div className='absolute right-0 top-10 w-[300px] p-3 rounded-md border border-white/10 shadow-lg bg-white dark:bg-zinc-900 z-50'>
                                        <div className='flex justify-between border-b border-gray-200/40 dark:border-white/10 p-2'>
                                            <p className='text-gray-900 dark:text-white font-medium'>Notifications</p>
                                            <p className='text-blue-500 cursor-pointer text-sm'>Mark as read</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <ThemeToggleButton theme={theme} setTheme={setTheme} />
                        </div>
                    </div>

                    {/* Stat cards — desktop: 4 cols, mobile: 2 cols */}
                    <div className='hidden grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4'>
                        {statCards.map(({ label, value, color, icon }) => (
                            <StatCard key={label} label={label} value={value} color={color} icon={icon} />
                        ))}
                    </div>

                    {/* Balance card — full width with px padding */}
                    <div className='w-full rounded-2xl px-4 py-6 xl:px-6 xl:py-6 text-white' style={{ background: 'linear-gradient(135deg, #0f4c6b 0%, #1a7a8a 60%, #1e9e9e 100%)' }}>

                        {/* Desktop: show greeting top-left */}
                        <div className='hidden xl:flex justify-between items-start mb-6'>
                            <div className='flex items-center gap-3'>
                                <div className='w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold'>HS</div>
                                <div>
                                    <p className='text-xs text-white/60'>{greeting}</p>
                                    <p className='text-sm font-semibold'>Hel</p>
                                </div>
                            </div>
                        </div>

                        {/* Balance */}
                        <div className='flex items-center gap-3 mb-1'>
                            <p className='text-xs text-white/60'>Available Balance</p>
                            <button onClick={() => setShowBalance(!showBalance)}>
                                {showBalance
                                    ? <Eye size={14} className='text-white/60' />
                                    : <EyeOff size={14} className='text-white/60' />
                                }
                            </button>
                        </div>
                        <p className='text-2xl xl:text-3xl font-bold mb-6'>{showBalance ? '$0 USD' : '••••••'}</p>

                        {/* Account number + actions */}
                        <div className='flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4'>
                            <div className='flex items-center gap-3'>

                            </div>

                        </div>
                    </div>

                    {/* Quick actions */}
                    <div>
                        <div className='grid grid-cols-4 gap-3 xl:gap-4'>
                            {actionCards.map(({ label, icon, bg, iconColor, textColor, path }) => (
                                <ActionCard key={label} label={label} icon={icon} bg={bg} iconColor={iconColor} textColor={textColor} path={path} />
                            ))}
                        </div>
                    </div>

                    <MobileServices />

                    {/* Account Statistics — mobile only (right panel hidden on mobile) */}
                    {/* <div className='xl:hidden'>
                        <p className='font-semibold text-zen-light-text dark:text-zen-text mb-4'>Account Statistics</p>
                        <div className='grid grid-cols-2 gap-3'>
                            {accountStats.map(({ color, label, value, icon }) => (
                                <div key={label} className='bg-zen-light-card dark:bg-zen-card rounded-xl p-3'>
                                    <StatRow color={color} label={label} value={value} icon={icon} />
                                </div>
                            ))}
                        </div>
                    </div> */}

                    {/* Quick Transfer — mobile only */}
                    <div className='xl:hidden'>
                        <p className='font-semibold text-zen-light-text dark:text-zen-text mb-4'>Quick Transfer</p>
                        <div className='space-y-3'>
                            {transferOptions.map(({ label, sub, globe }) => (
                                <TransferOption key={label} label={label} sub={sub} globe={globe} />
                            ))}
                        </div>
                    </div>

                    {/* Your Cards */}
                    <div>
                        <div className='flex justify-between items-center mb-4'>
                            <div className='flex items-center gap-2 text-zen-light-text dark:text-zen-text font-semibold'>
                                <CreditCard size={16} />
                                <span>Your Cards</span>
                            </div>
                            <button className='text-sm text-blue-500 flex items-center gap-1'>
                                View all <ArrowRight size={14} />
                            </button>
                        </div>
                        <div className='rounded-xl border border-zen-light-border dark:border-zen-border p-8 flex flex-col items-center justify-center gap-3'>
                            <div className='w-14 h-14 rounded-full bg-zen-light-card dark:bg-zen-card flex items-center justify-center'>
                                <CreditCard size={24} className='text-zen-light-muted dark:text-zen-muted' />
                            </div>
                            <p className='text-sm text-zen-light-muted dark:text-zen-muted'>No cards yet. Add a card to get started.</p>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div>
                        <div className='flex justify-between items-center mb-4'>
                            <div className='flex items-center gap-2 text-zen-light-text dark:text-zen-text font-semibold'>
                                <History size={16} />
                                <span>Recent Transactions</span>
                            </div>
                            <button className='text-sm text-blue-500 flex items-center gap-1'>
                                View all <ArrowRight size={14} />
                            </button>
                        </div>
                        <div className='rounded-xl border border-zen-light-border dark:border-zen-border p-12 flex flex-col items-center justify-center gap-3'>
                            <div className='w-14 h-14 rounded-full bg-zen-light-card dark:bg-zen-card flex items-center justify-center'>
                                <History size={24} className='text-zen-light-muted dark:text-zen-muted' />
                            </div>
                            <p className='text-sm text-zen-light-muted dark:text-zen-muted'>No transactions yet.</p>
                            <p className='text-xs text-zen-light-muted dark:text-zen-muted opacity-60'>Your transaction history will appear here.</p>
                        </div>
                    </div>

                </main>

                {/* RIGHT PANEL — desktop only */}
                <aside className='hidden xl:block w-72 shrink-0 border-l border-zen-light-border dark:border-zen-border overflow-y-auto p-6 space-y-8 bg-zen-light-bg dark:bg-zen-bg'>

                    {/* Account Statistics */}
                    <div>
                        <p className='font-semibold text-zen-light-text dark:text-zen-text mb-4'>Account Statistics</p>
                        <div className='space-y-5'>
                            {accountStats.map(({ color, label, value, icon }) => (
                                <StatRow key={label} color={color} label={label} value={value} icon={icon} />
                            ))}
                        </div>
                    </div>

                    {/* Quick Transfer */}
                    <div>
                        <p className='font-semibold text-zen-light-text dark:text-zen-text mb-4'>Quick Transfer</p>
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