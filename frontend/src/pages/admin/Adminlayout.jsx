import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from './AdminSidebar'
import { AdminTopbar } from './AdminTopbar'
import { MobileButnav } from './MobileButnav'
import { BottomNav } from './BottomNav'

export const Adminlayout = ({ theme, setTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

    return (
        <div className='flex min-h-screen bg-zen-light-bg dark:bg-zen-bg'>

            <AdminSidebar
                theme={theme}
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />

            <div className='flex flex-1 flex-col min-w-0 min-h-screen'>

                <AdminTopbar
                    theme={theme}
                    toggleTheme={toggleTheme}
                    onMenuClick={() => setIsMenuOpen(true)}
                />

                <main className='flex-1 overflow-hidden flex flex-col'>
                    <div className='flex-1 overflow-y-auto pb-16 xl:pb-0'>
                        <Outlet />
                    </div>
                    <div className='hidden xl:block border-t border-zen-light-border dark:border-zen-border px-6 py-3 bg-zen-light-bg dark:bg-zen-bg shrink-0'>
                        <BottomNav />
                    </div>
                </main>

            </div>
            <MobileButnav />
        </div>
    )
}