import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard, ArrowLeftRight, CreditCard, Send,
    Globe, Download, FileText, RefreshCw, History,
    Settings, LifeBuoy, ShieldCheck
} from 'lucide-react'
import assets from '../../assets/assets'


const navItems = [
    {
        group: 'MAIN MENU',
        items: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/overview' },
            { icon: ArrowLeftRight, label: 'Transactions', path: '/dashboard/transactions' },
            { icon: CreditCard, label: 'Cards', path: '/dashboard/cards' },
        ]
    },
    {
        group: 'TRANSFERS',
        items: [
            { icon: Send, label: 'Local Transfer', path: '/dashboard/local-transfer' },
            { icon: Globe, label: 'International Wire', path: '/dashboard/international' },
            { icon: Download, label: 'Deposit', path: '/dashboard/deposit' },
        ]
    },
    {
        group: 'SERVICES',
        items: [
            { icon: FileText, label: 'Loan Request', path: '/dashboard/loan-request' },
            { icon: RefreshCw, label: 'IRS Tax Refund', path: '/dashboard/tax-refund' },
            { icon: History, label: 'Loan History', path: '/dashboard/loan-history' },
        ]
    },
    {
        group: 'ACCOUNT',
        items: [
            { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
            { icon: LifeBuoy, label: 'Support Ticket', path: '/dashboard/support' },
        ]
    },
]

const Sidebar = ({ theme }) => {
    const location = useLocation()

    const navigate = useNavigate()
    const handleLogout = async () => {
        await fetch('http://localhost:8080/api/logout', {
            method: 'POST',
            credentials: 'include'
        })
        navigate('/login')
    }

    return (
        <div className='w-70 h-screen sticky top-0 hidden  xl:flex xl:flex-col bg-zen-light-bg dark:bg-zen-bg border-r border-gray-200/40 dark:border-white/10 shadow-[4px_0_20px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_20px_rgba(0,0,0,0.4)] transition-all duration-300 '>

            {/* Logo */}
            <div className="px-4 pt-4 pb-2">
                <Link to="/">
                    <img
                        src={theme === 'dark' ? assets.darkbglogo : assets.lglogo}
                        className="w-32 hover:scale-105 transition-transform"
                        alt="logo"
                    />
                </Link>
            </div>

            {/* User info */}
            <div className="px-4 py-3 border border-gray-200/40 dark:border-white/10 text-base font-meduim ">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-zen-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                        HS
                    </div>
                    <div>
                        <p className="text-sm font-bold text-zen-light-text dark:text-zen-text leading-none">Hel Smut</p>
                        {/* <p className="text-[11px] text-zen-light-muted dark:text-zen-muted mt-0.5">ID: 01774742051</p> */}
                    </div>
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                    <span className=" text-red-300 border border-red-300 rounded-md px-3 py-0.1 text-base w-full text-center">Verify KYC</span>
                </div>


                <div className="flex gap-2 mt-2 text-base font-meduim ">
                    <button className="flex-1 py-1 rounded-lg border border-gray-200 dark:border-zen-border text-zen-light-text dark:text-zen-text hover:bg-gray-100 dark:hover:bg-white/5 transition">
                        Profile
                    </button>
                    <button onClick={handleLogout} className="flex-1 py-1 rounded-lg bg-zen-primary text-white hover:bg-zen-secondary transition">
                        Logout
                    </button>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-4">
                {navItems.map(({ group, items }) => (
                    <div key={group}>
                        <p className="text-base font-meduim tracking-widest text-zen-light-muted dark:text-zen-muted mb-1.5 px-1">
                            {group}
                        </p>

                        <div className="flex flex-col gap-0.5">
                            {items.map(({ icon: Icon, label, path }) => {
                                const active = location.pathname === path
                                return (
                                    <Link
                                        key={path}
                                        to={path}
                                        className={`flex items-center gap-3 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200
                                            ${active
                                                ? 'bg-zen-primary text-white'
                                                : 'text-zen-light-text dark:text-zen-text hover:bg-gray-100 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        {label}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-200/40 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-zen-light-muted dark:text-zen-muted">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                    Secure Banking
                </div>
                <span className="text-[11px] text-zen-light-muted dark:text-zen-muted">v1.2.0</span>
            </div>
        </div>
    )
}

export default Sidebar