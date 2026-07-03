import { useState } from 'react'
import { CalendarDays, Bell, Filter, Download, Search, Inbox } from 'lucide-react'
import ThemeToggleButton from '../../components/ThemeToggleButton'

const Transactions = ({ theme, setTheme }) => {
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
    const [showNotif, setShowNotif] = useState(false)
    const [search, setSearch] = useState('')

    return (
        <div className='space-y-6 px-3' onClick={() => setShowNotif(false)}>

            {/* Top bar */}
            <div className='hidden xl:flex items-center justify-between '>
                <div className='flex items-center gap-2 text-zen-light-muted dark:text-zen-muted text-sm'>
                    <CalendarDays size={16} />
                    <span>{date}</span>
                </div>

                <div className='flex items-center gap-3'>
                    <div className='relative' onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowNotif(!showNotif)} className='p-2 rounded-full hover:bg-zen-light-card dark:hover:bg-zen-card'>
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

            {/* Page heading */}
            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                <div>
                    <h1 className='text-xl sm:text-2xl font-bold text-zen-light-text dark:text-zen-text'>Transactions</h1>
                    <p className='text-sm text-zen-light-muted dark:text-zen-muted mt-0.5'>
                        <span className='hover:underline cursor-pointer'>Dashboard</span>
                        <span className='mx-2'>›</span>
                        <span>Transactions</span>
                    </p>
                </div>
                <div className='flex gap-2'>
                    <button className='flex items-center gap-2 px-3 py-2 border border-zen-light-border dark:border-zen-border rounded-lg text-sm text-zen-light-text dark:text-zen-text hover:bg-zen-light-card dark:hover:bg-zen-card transition'>
                        <Filter size={15} />
                        <span className='hidden sm:inline'>Filter</span>
                    </button>
                    <button className='flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm transition'>
                        <Download size={15} />
                        <span className='hidden sm:inline'>Export</span>
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className='relative'>
                <Search size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-zen-light-muted dark:text-zen-muted' />
                <input
                    type='text'
                    placeholder='Search by transaction reference...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='w-full pl-10 pr-4 py-3 rounded-xl border border-zen-light-border dark:border-zen-border bg-zen-light-bg dark:bg-zen-bg text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:border-teal-500 transition'
                />
            </div>

            {/* Table */}
            <div className='rounded-xl border border-zen-light-border dark:border-zen-border overflow-hidden'>


                {/* Table header */}
                <div className='grid grid-cols-8 px-6 py-3 border-b border-zen-light-border dark:border-zen-border'>
                    {['AMOUNT', 'TYPE', 'STATUS', 'REFERENCE ID', 'DESCRIPTION', 'SCOPE', 'CREATED', 'ACTION'].map(col => (
                        <p key={col} className='text-xs font-semibold text-zen-light-muted dark:text-zen-muted tracking-wider'>
                            {col}
                        </p>
                    ))}
                </div>

                {/* Empty state */}
                <div className='flex flex-col items-center justify-center py-24 gap-3'>
                    <div className='w-16 h-16 rounded-full bg-zen-light-card dark:bg-zen-card flex items-center justify-center'>
                        <Inbox size={28} className='text-zen-light-muted dark:text-zen-muted' />
                    </div>
                    <p className='text-sm font-medium text-zen-light-text dark:text-zen-text'>No transactions found</p>
                    <p className='text-xs text-zen-light-muted dark:text-zen-muted'>Try adjusting your search or filter parameters</p>
                </div>
            </div>


        </div>


    )
}

export default Transactions