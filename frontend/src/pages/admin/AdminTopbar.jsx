import React, { useState } from 'react'
import { Search, Moon, Sun, Bell, ChevronDown, Menu, User, Settings, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from "./admincontext/AdminAuthContext";
export const AdminTopbar = ({
    theme,
    toggleTheme,
    onMenuClick,
    notificationCount = 0,
    admin = { name: 'Admin User', role: 'Super Admin', avatar: null }
}) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [showNotif, setShowNotif] = useState(false)
    const navigate = useNavigate()
    const { admin_logout } = useAdminAuth()

    const handleLogout = async () => {
        await admin_logout
        navigate('/admin/login')

    }

    return (
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 md:gap-4 px-4 md:px-6 py-3 bg-zen-light-bg dark:bg-zen-bg border-b border-gray-200/40 dark:border-white/10">

            {/* Mobile menu toggle */}
            <button
                onClick={onMenuClick}
                className="xl:hidden shrink-0 p-2 rounded-lg text-zen-light-text dark:text-zen-text hover:bg-gray-100 dark:hover:bg-white/5"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="hidden md:block flex-1 max-w-xl">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-transparent focus-within:border-zen-primary/40 transition-colors">
                    <Search className="w-4 h-4 shrink-0 text-zen-light-muted dark:text-zen-muted" />
                    <input
                        type="text"
                        placeholder="Search for users, accounts, transactions..."
                        className="flex-1 min-w-0 bg-transparent text-sm text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted focus:outline-none"
                    />
                    <kbd className="hidden sm:inline-block shrink-0 text-xs font-medium px-1.5 py-0.5 rounded-md bg-white dark:bg-white/10 text-zen-light-muted dark:text-zen-muted border border-gray-200/60 dark:border-white/10">
                        ⌘K
                    </kbd>
                </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 md:gap-3 shrink-0">

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-zen-light-text dark:text-zen-text hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notifications */}
                <button
                    onClick={() => setShowNotif(!showNotif)} className='p-2 rounded-full hover:bg-zen-light-card dark:hover:bg-zen-card'
                    className="relative p-2 rounded-lg text-zen-light-text dark:text-zen-text hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                // aria-label="Notifications"
                >
                    <Bell className="w-5 h-5" />
                    {showNotif && (

                        <div className='absolute right-0  mt-2 py-1.5 w-80 rounded-md border border-gray-200/60 shadow-lg dark:border-white/10 dark:shadow-[4px_0_20px_rgba(0,0,0,0.4)] bg-zen-light-bg dark:bg-zen-bg z-20 '>
                            <div className='flex justify-between border-b border-gray-200/40 dark:border-white/10 p-2'>
                                <p className='text-gray-900 dark:text-white font-medium'>Notifications</p>
                                <p className='text-blue-500 cursor-pointer text-sm'>Mark as read</p>
                            </div>
                        </div>
                    )}
                    {notificationCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold">
                            {notificationCount}
                        </span>
                    )}
                </button>

                {/* Divider */}
                <div className="hidden sm:block w-px h-8 bg-gray-200/60 dark:bg-white/10 mx-1" />

                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(prev => !prev)}
                        className="flex items-center gap-2.5 pl-1 pr-1.5 sm:pr-2.5 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                        {admin.avatar ? (
                            <img
                                src={admin.avatar}
                                alt={admin.name}
                                className="w-9 h-9 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-zen-primary/10 flex items-center justify-center">
                                <User className="w-4.5 h-4.5 text-zen-primary" />
                            </div>
                        )}
                        <div className="hidden sm:block text-left leading-tight">
                            <p className="text-sm font-semibold text-zen-light-text dark:text-zen-text">
                                {admin.name}
                            </p>
                            <p className="text-xs text-zen-light-muted dark:text-zen-muted">
                                {admin.role}
                            </p>
                        </div>
                        <ChevronDown className={`hidden sm:block w-4 h-4 text-zen-light-muted dark:text-zen-muted transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isProfileOpen && (
                        <>
                            <div
                                onClick={() => setIsProfileOpen(false)}
                                className="fixed inset-0 z-10"
                            />
                            <div className="absolute right-0 mt-2 w-48 py-1.5 rounded-xl bg-zen-light-bg dark:bg-zen-bg border border-gray-200/60 dark:border-white/10 shadow-lg z-20">
                                <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-zen-light-text dark:text-zen-text hover:bg-gray-100 dark:hover:bg-white/5">
                                    <User className="w-4 h-4" />
                                    Profile
                                </button>
                                <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-zen-light-text dark:text-zen-text hover:bg-gray-100 dark:hover:bg-white/5">
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </button>
                                <div className="my-1 h-px bg-gray-200/60 dark:bg-white/10" />
                                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}