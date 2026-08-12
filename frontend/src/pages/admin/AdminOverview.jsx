import React from 'react'
import {
    Users, ShieldCheck, UserPlus, ShieldAlert, CreditCard, Landmark,
    ChevronDown, Calendar, MoreVertical, ArrowLeftRight, ArrowDown, ArrowUp,
    UserCircle2, FileText, DollarSign, TrendingUp, TrendingDown, Wallet,
    HandCoins, Ticket,
} from 'lucide-react'
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from 'recharts'
import { useAdminAuth } from './admincontext/AdminAuthContext'

export const AdminOverview = () => {
    const { admin } = useAdminAuth()

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })

    const statCards = [
        { icon: Users, label: 'Total Users', value: '24,561', change: '5.2%', trend: 'up', note: 'from last month' },
        { icon: ShieldCheck, label: 'Active Accounts', value: '24,003', change: '4.8%', trend: 'up', note: 'from last month' },
        { icon: UserPlus, label: 'Pending Registrations', value: '32', note: 'Needs review', noteTone: 'warn' },
        { icon: ShieldAlert, label: 'KYC Pending', value: '17', note: 'Waiting approval', noteTone: 'info' },
        { icon: HandCoins, label: 'Pending Loans', value: '24', note: 'Needs review', noteTone: 'warn' },
        { icon: CreditCard, label: 'Card Requests', value: '12', note: 'Ready to process', noteTone: 'success' },
        { icon: Landmark, label: 'Bank Balance', value: '$48.50M', change: '8.4%', trend: 'up', note: 'from last month' },
    ]

    const transactionsData = [
        { date: 'Jul 1', deposits: 22, withdrawals: 10, transfers: 15 },
        { date: 'Jul 6', deposits: 23, withdrawals: 11, transfers: 15 },
        { date: 'Jul 11', deposits: 25, withdrawals: 10, transfers: 16 },
        { date: 'Jul 16', deposits: 27, withdrawals: 11, transfers: 19 },
        { date: 'Jul 21', deposits: 29, withdrawals: 12, transfers: 19 },
        { date: 'Jul 26', deposits: 31, withdrawals: 14, transfers: 22 },
        { date: 'Jul 31', deposits: 36, withdrawals: 15, transfers: 24 },
    ]

    const revenueData = [
        { week: 'Jul 1', value: 2.6 },
        { week: 'Jul 8', value: 2.9 },
        { week: 'Jul 15', value: 3.0 },
        { week: 'Jul 22', value: 2.85 },
        { week: 'Jul 29', value: 3.24 },
    ]

    const activities = [
        { icon: UserCircle2, title: 'New user registration', detail: 'John Doe registered', time: '2 mins ago' },
        { icon: FileText, title: 'Loan application', detail: 'Michael Brown applied for a loan', time: '8 mins ago' },
        { icon: CreditCard, title: 'Card request', detail: 'Sarah Johnson requested a debit card', time: '12 mins ago' },
        { icon: ShieldCheck, title: 'KYC verification', detail: 'David Wilson KYC approved', time: '25 mins ago' },
        { icon: DollarSign, title: 'Manual credit', detail: 'Admin credited $500.00 to John Doe', time: '35 mins ago' },
    ]

    const quickSummary = [
        { icon: ShieldCheck, label: 'Total Deposits (This Month)', value: '$18.42M', change: '15.3%', trend: 'up' },
        { icon: Wallet, label: 'Total Withdrawals (This Month)', value: '$9.65M', change: '9.8%', trend: 'up' },
        { icon: Users, label: 'Total Loans (Outstanding)', value: '$23.44M', change: '7.1%', trend: 'up' },
        { icon: CreditCard, label: 'Total Cards Issued', value: '8,542', change: '6.4%', trend: 'up' },
        { icon: Ticket, label: 'Support Tickets (Open)', value: '6', change: '14.3%', trend: 'down' },
    ]

    const typeMeta = {
        Deposit: { icon: ArrowDown, tone: 'success' },
        Withdrawal: { icon: ArrowUp, tone: 'danger' },
        Transfer: { icon: ArrowLeftRight, tone: 'info' },
    }

    const statusTone = {
        Completed: 'bg-emerald-500/10 text-emerald-500',
        Failed: 'bg-red-500/10 text-red-500',
        Pending: 'bg-orange-500/10 text-orange-500',
    }

    const transactions = [
        { id: 'TXN-250729-001', user: 'John Doe', type: 'Deposit', amount: '+ $2,500.00', positive: true, status: 'Completed', time: '2 mins ago' },
        { id: 'TXN-250729-002', user: 'Jane Smith', type: 'Withdrawal', amount: '- $1,200.00', positive: false, status: 'Completed', time: '5 mins ago' },
        { id: 'TXN-250729-003', user: 'Michael Brown', type: 'Transfer', amount: '- $850.00', positive: false, status: 'Completed', time: '8 mins ago' },
        { id: 'TXN-250729-004', user: 'Emily Davis', type: 'Deposit', amount: '+ $5,000.00', positive: true, status: 'Completed', time: '12 mins ago' },
        { id: 'TXN-250729-005', user: 'David Wilson', type: 'Transfer', amount: '- $2,300.00', positive: false, status: 'Failed', time: '15 mins ago' },
    ]

    const avatarColors = ['bg-blue-500', 'bg-violet-500', 'bg-orange-500', 'bg-emerald-500', 'bg-pink-500']
    const initials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

    const toneClasses = {
        warn: 'text-orange-500',
        info: 'text-indigo-500',
        success: 'text-emerald-500',
        danger: 'text-red-500',
    }

    return (
        <div className="flex flex-col gap-6 p-6 bg-zen-light-bg-2 dark:bg-zen-bg-2 min-h-screen">

            {/* Page header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-zen-light-text dark:text-zen-text flex items-center gap-2">
                        {new Date().getHours() < 12
                            ? "Good Morning"
                            : new Date().getHours() < 18
                                ? "Good Afternoon"
                                : "Good Evening"
                        }, {admin?.first_name}
                        <span aria-hidden>👋</span>
                    </h1>
                    <p className="text-sm text-zen-light-muted dark:text-zen-muted mt-1">
                        Here's what's happening in Zenvault Bank today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 text-sm text-zen-light-text dark:text-zen-text bg-zen-light-bg dark:bg-zen-bg border border-gray-200/40 dark:border-white/10 rounded-xl px-3 py-2">
                        <Calendar className="w-4 h-4 text-zen-light-muted dark:text-zen-muted" />
                        {today}
                    </span>
                    <button className="flex items-center gap-1 bg-zen-primary text-white text-sm font-medium rounded-xl px-4 py-2 hover:opacity-90 transition-opacity">
                        Quick Actions
                        <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {statCards.map(({ icon: Icon, label, value, change, trend, note, noteTone }) => (
                    <div
                        key={label}
                        className="bg-zen-light-bg dark:bg-zen-bg border border-gray-200/40 dark:border-white/10 rounded-xl p-4 flex flex-col gap-3"
                    >
                        <div className="flex items-center gap-2">
                            <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-zen-primary/10 shrink-0">
                                <Icon className="w-4.5 h-4.5 text-zen-primary" />
                            </span>
                            <span className="text-sm text-zen-light-muted dark:text-zen-muted truncate">{label}</span>
                        </div>
                        <div className="text-2xl font-semibold text-zen-light-text dark:text-zen-text">{value}</div>
                        <div className="text-xs flex items-center gap-1">
                            {change ? (
                                <>
                                    <span className="flex items-center gap-0.5 text-emerald-500 font-medium">
                                        <TrendingUp className="w-3 h-3" />
                                        {change}
                                    </span>
                                    <span className="text-zen-light-muted dark:text-zen-muted">{note}</span>
                                </>
                            ) : (
                                <span className={`font-medium ${toneClasses[noteTone] || 'text-zen-light-muted dark:text-zen-muted'}`}>
                                    {note}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                {/* Transactions Overview */}
                <div className="xl:col-span-2 bg-zen-light-bg dark:bg-zen-bg border border-gray-200/40 dark:border-white/10 rounded-xl p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-zen-light-text dark:text-zen-text">Transactions Overview</h3>
                        <button className="flex items-center gap-1 text-sm text-zen-light-muted dark:text-zen-muted border border-gray-200/40 dark:border-white/10 rounded-lg px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                            This Month
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="flex items-center gap-5 mb-4 text-xs text-zen-light-muted dark:text-zen-muted">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Deposits</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Withdrawals</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Transfers</span>
                    </div>
                    <div className="h-64 -ml-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={transactionsData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid stroke="currentColor" className="text-gray-100 dark:text-white/5" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tickFormatter={(v) => `$${v}M`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(v) => [`$${v}M`]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                                <Line type="monotone" dataKey="deposits" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                                <Line type="monotone" dataKey="withdrawals" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                                <Line type="monotone" dataKey="transfers" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-zen-light-bg dark:bg-zen-bg border border-gray-200/40 dark:border-white/10 rounded-xl p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-zen-light-text dark:text-zen-text">Recent Activities</h3>
                        <button className="text-sm text-zen-primary font-medium hover:underline">View All</button>
                    </div>
                    <ul className="flex flex-col gap-4">
                        {activities.map(({ icon: Icon, title, detail, time }, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-zen-primary/10 shrink-0">
                                    <Icon className="w-4 h-4 text-zen-primary" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-zen-light-text dark:text-zen-text truncate">{title}</p>
                                    <p className="text-xs text-zen-light-muted dark:text-zen-muted truncate">{detail}</p>
                                </div>
                                <span className="text-xs text-zen-light-muted dark:text-zen-muted whitespace-nowrap">{time}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Bank Performance */}
                <div className="bg-zen-primary rounded-xl p-5 flex flex-col text-white">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Bank Performance</h3>
                        <button className="flex items-center gap-1 text-xs text-white/70 border border-white/20 rounded-lg px-3 py-1.5 hover:bg-white/10 transition-colors">
                            This Month
                            <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <p className="text-sm text-white/70 mb-1">Total Revenue</p>
                    <p className="text-3xl font-semibold mb-1">$3.24M</p>
                    <p className="text-xs text-emerald-300 flex items-center gap-1 mb-4">
                        <TrendingUp className="w-3 h-3" /> 12.6% from last month
                    </p>
                    <div className="h-36 -ml-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#cbd5e1' }} axisLine={false} tickLine={false} />
                                <YAxis tickFormatter={(v) => `$${v}M`} tick={{ fontSize: 10, fill: '#cbd5e1' }} axisLine={false} tickLine={false} width={30} />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.08)' }} formatter={(v) => [`$${v}M`, 'Revenue']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                                <Bar dataKey="value" fill="#ffffff" fillOpacity={0.85} radius={[4, 4, 0, 0]} barSize={22} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Tables row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Latest Transactions */}
                <div className="xl:col-span-2 bg-zen-light-bg dark:bg-zen-bg border border-gray-200/40 dark:border-white/10 rounded-xl p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-zen-light-text dark:text-zen-text">Latest Transactions</h3>
                        <button className="text-sm text-zen-primary font-medium hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto -mx-5">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-zen-light-muted dark:text-zen-muted border-b border-gray-100 dark:border-white/5">
                                    <th className="font-medium px-5 py-2">ID</th>
                                    <th className="font-medium px-5 py-2">User</th>
                                    <th className="font-medium px-5 py-2">Type</th>
                                    <th className="font-medium px-5 py-2">Amount</th>
                                    <th className="font-medium px-5 py-2">Status</th>
                                    <th className="font-medium px-5 py-2">Time</th>
                                    <th className="font-medium px-5 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t, i) => {
                                    const TypeIcon = typeMeta[t.type].icon
                                    return (
                                        <tr key={t.id} className="border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-5 py-3 text-zen-light-muted dark:text-zen-muted whitespace-nowrap">{t.id}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                                                        {initials(t.user)}
                                                    </span>
                                                    <span className="font-medium text-zen-light-text dark:text-zen-text whitespace-nowrap">{t.user}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="flex items-center gap-1.5 text-zen-light-muted dark:text-zen-muted whitespace-nowrap">
                                                    <TypeIcon className="w-3.5 h-3.5" />
                                                    {t.type}
                                                </span>
                                            </td>
                                            <td className={`px-5 py-3 font-medium whitespace-nowrap ${t.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {t.amount}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusTone[t.status]}`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-zen-light-muted dark:text-zen-muted whitespace-nowrap">{t.time}</td>
                                            <td className="px-5 py-3 text-right">
                                                <button className="text-zen-light-muted dark:text-zen-muted hover:text-zen-primary">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-zen-light-muted dark:text-zen-muted pt-4 px-1">Showing 1 to 5 of 2,548 transactions</p>
                </div>

                {/* Quick Summary */}
                <div className="bg-zen-light-bg dark:bg-zen-bg border border-gray-200/40 dark:border-white/10 rounded-xl p-5 flex flex-col">
                    <h3 className="font-semibold text-zen-light-text dark:text-zen-text mb-4">Quick Summary</h3>
                    <ul className="flex flex-col gap-4">
                        {quickSummary.map(({ icon: Icon, label, value, change, trend }, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <span className="w-9 h-9 rounded-lg flex items-center justify-center bg-zen-primary/10 shrink-0">
                                    <Icon className="w-4 h-4 text-zen-primary" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-zen-light-muted dark:text-zen-muted truncate">{label}</p>
                                    <p className="text-sm font-semibold text-zen-light-text dark:text-zen-text">{value}</p>
                                </div>
                                <span className={`text-xs font-medium flex items-center gap-0.5 whitespace-nowrap ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {change}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}