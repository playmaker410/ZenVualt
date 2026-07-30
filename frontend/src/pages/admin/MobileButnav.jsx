import { useLocation, useNavigate } from 'react-router-dom'
import { Home, BarChart2, CreditCard, User, Users, Bell, Ellipsis } from 'lucide-react'

export const MobileButnav = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const tabs = [
        { label: 'Home', icon: <Home size={22} />, path: '/dashboard/overview' },
        { label: 'Users', icon: <Users size={22} />, path: '/dashboard/transactions' },
        { label: 'Notifications', icon: <Bell size={22} />, path: '/dashboard/cards' },
        { label: 'More', icon: <Ellipsis size={22} />, path: '/dashboard/profile' },
    ]

    return (
        <nav className='xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-zen-light-bg dark:bg-zen-bg border-t border-zen-light-border dark:border-zen-border'>
            <div className='flex items-center justify-around px-2 py-2 pb-[env(safe-area-inset-bottom)]'>
                {tabs.map(({ label, icon, path }) => {
                    const active = location.pathname === path
                    return (
                        <button
                            key={label}
                            onClick={() => navigate(path)}
                            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${active ? 'text-teal-500' : 'text-zen-light-muted dark:text-zen-muted'
                                }`}
                        >
                            {icon}
                            <span className={`text-[10px] font-medium ${active ? 'text-teal-500' : ''}`}>
                                {label}
                            </span>
                            {active && <span className='w-1 h-1 rounded-full bg-teal-500' />}
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}

