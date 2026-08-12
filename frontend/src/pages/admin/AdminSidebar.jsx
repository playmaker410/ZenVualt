import React, { useState } from 'react'
import assets from '../../assets/assets'
import {
    LayoutDashboard, UserPlus, ShieldCheck, CreditCard, FileText,
    Users, UserCheck, UserX, Clock, UserMinus,
    Landmark, ArrowLeftRight, DollarSign, Bell, LifeBuoy,
    BarChart3, History, KeyRound, Settings, User, LogOut,
    Menu, X
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export const AdminSidebar = ({ theme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const closeMenu = () => setIsMenuOpen(false)
    const location = useLocation()

    const navItems = [
        {
            group: 'MAIN MENU',
            items: [
                { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
            ]
        },
        {
            group: 'APPROVALS',
            items: [
                // { icon: UserPlus, label: 'Pending Registrations', path: '/admin/pending-registrations', badge: 32 },
                { icon: ShieldCheck, label: 'KYC Verification', path: '/admin/kyc-verification', badge: 17 },
                { icon: CreditCard, label: 'Card Requests', path: '/admin/card-requests', badge: 9 },
                { icon: FileText, label: 'Loan Requests', path: '/admin/loan-requests', badge: 14 },
            ]
        },
        {
            group: 'USERS',
            items: [
                { icon: Users, label: 'All Users', path: '/admin/users/all' },

            ]
        },
        {
            group: 'MANAGEMENT',
            items: [
                { icon: Landmark, label: 'Accounts', path: '/admin/accounts' },
                { icon: ArrowLeftRight, label: 'Transactions', path: '/admin/transactions' },
                { icon: DollarSign, label: 'Manual Credit / Debit', path: '/admin/manual-credit-debit' },
                { icon: Bell, label: 'Notifications', path: '/admin/notifications' },

            ]
        },
        {
            group: 'INSIGHTS',
            items: [

                { icon: History, label: 'Audit Logs', path: '/admin/audit-logs' },

            ]
        },
        {
            group: 'ACCOUNT',
            items: [
                { icon: Settings, label: 'Settings', path: '/admin/settings' },
            ]
        },
    ]

    return (
        <>
            {/* Mobile hamburger trigger */}
            <button
                onClick={() => setIsMenuOpen(true)}
                className="xl:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-zen-light-bg dark:bg-zen-bg border border-gray-200/40 dark:border-white/10 shadow-md text-zen-light-text dark:text-zen-text"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile backdrop */}
            {isMenuOpen && (
                <div
                    onClick={closeMenu}
                    className="xl:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                />
            )}

            {/* Sidebar */}
            <div
                className={`w-70 h-screen fixed xl:sticky top-0 left-0 z-50 flex flex-col
                bg-zen-light-bg dark:bg-zen-bg border-r border-gray-200/40 dark:border-white/10
                shadow-[4px_0_20px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_20px_rgba(0,0,0,0.4)]
                transition-transform duration-300 ease-in-out
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} xl:translate-x-0`}
            >

                {/* Logo */}
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                    <Link to="#" onClick={closeMenu}>
                        <img
                            src={theme === 'dark' ? assets.darkbglogo : assets.lglogo}
                            className="w-39 hover:scale-105 transition-transform"
                            alt="logo"
                        />
                    </Link>
                    <button
                        onClick={closeMenu}
                        className="xl:hidden p-1.5 rounded-lg text-zen-light-text dark:text-zen-text hover:bg-gray-100 dark:hover:bg-white/5"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-4">
                    {navItems.map(({ group, items }) => (
                        <div key={group}>
                            <p className="text-xs font-medium tracking-widest text-zen-light-muted dark:text-zen-muted mb-1.5 px-1">
                                {group}
                            </p>

                            <div className="flex flex-col gap-0.5">
                                {items.map(({ icon: Icon, label, path, badge }) => {
                                    const active = location.pathname === path
                                    return (
                                        <Link
                                            key={path}
                                            to={path}
                                            onClick={closeMenu}
                                            className={`flex items-center gap-3 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200
                                            ${active
                                                    ? 'bg-zen-primary text-white'
                                                    : 'text-zen-light-text dark:text-zen-text hover:bg-gray-100 dark:hover:bg-white/5'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4 shrink-0" />
                                            <span className="flex-1">{label}</span>
                                            {badge != null && (
                                                <span
                                                    className={`text-xs font-semibold rounded-full px-2 py-0.5
                                                    ${active
                                                            ? 'bg-white/20 text-white'
                                                            : 'bg-zen-primary/10 text-zen-primary'
                                                        }`}
                                                >
                                                    {badge}
                                                </span>
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

            </div>
        </>
    )
}