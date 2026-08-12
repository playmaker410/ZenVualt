import { useState } from 'react'
import { CalendarDays, Bell, Filter, Download, Search, Inbox } from 'lucide-react'
import ThemeToggleButton from '../../components/ThemeToggleButton'

const Transactions = ({ theme, setTheme }) => {
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
    const [showNotif, setShowNotif] = useState(false)
    const [search, setSearch] = useState('')

    const transactions = []

    return (
        <div className='space-y-6 px-3 py-4 xl:py-0' onClick={() => setShowNotif(false)}>

            {/* ── Desktop top bar ── */}
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

            {/* ── Page heading + actions ── */}
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
                    <button className='flex items-center gap-2 px-3 py-2 bg-zen-primary hover:bg-zen-secondary text-zen-text rounded-lg text-sm transition'>
                        <Download size={15} />
                        <span className='hidden sm:inline'>Export</span>
                    </button>
                </div>
            </div>

            {/* ── Search ── */}
            <div className='relative'>
                <Search size={16} className='absolute left-4 top-1/2 -translate-y-1/2 text-zen-light-muted dark:text-zen-muted' />
                <input
                    type='text'
                    placeholder='Search by transaction reference...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='w-full pl-10 pr-4 py-3 rounded-xl border border-zen-light-border dark:border-zen-border bg-zen-light-bg dark:bg-zen-bg text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/40 focus:border-zen-primary transition'
                />
            </div>

            {/* ── Transaction list ── */}
            <div className='rounded-xl border border-zen-light-border dark:border-zen-border overflow-hidden bg-zen-light-card dark:bg-zen-card'>

                {transactions.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-20 sm:py-24 gap-3 px-6 text-center'>
                        <div className='w-16 h-16 rounded-full bg-zen-light-bg dark:bg-zen-bg flex items-center justify-center'>
                            <Inbox size={28} className='text-zen-light-muted dark:text-zen-muted' />
                        </div>
                        <p className='text-sm font-medium text-zen-light-text dark:text-zen-text'>No transactions found</p>
                        <p className='text-xs text-zen-light-muted dark:text-zen-muted'>
                            Try adjusting your search or filter parameters
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className='hidden xl:block overflow-x-auto'>
                            <table className='w-full text-sm'>
                                <thead>
                                    <tr className='border-b border-zen-light-border dark:border-zen-border bg-zen-light-bg dark:bg-zen-bg'>
                                        {['Amount', 'Type', 'Status', 'Reference ID', 'Description', 'Scope', 'Created', 'Action'].map(col => (
                                            <th key={col} className='px-5 py-3 text-left text-xs font-semibold text-zen-light-muted dark:text-zen-muted tracking-wider'>
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-zen-light-border dark:divide-zen-border'>
                                    {transactions.map((tx, i) => (
                                        <tr key={i} className='hover:bg-zen-light-bg dark:hover:bg-zen-bg transition'>
                                            <td className='px-5 py-4 font-medium text-zen-light-text dark:text-zen-text'>{tx.amount}</td>
                                            <td className='px-5 py-4 text-zen-light-muted dark:text-zen-muted'>{tx.type}</td>
                                            <td className='px-5 py-4'>{tx.status}</td>
                                            <td className='px-5 py-4 text-zen-light-muted dark:text-zen-muted font-mono text-xs'>{tx.reference}</td>
                                            <td className='px-5 py-4 text-zen-light-muted dark:text-zen-muted'>{tx.description}</td>
                                            <td className='px-5 py-4 text-zen-light-muted dark:text-zen-muted'>{tx.scope}</td>
                                            <td className='px-5 py-4 text-zen-light-muted dark:text-zen-muted'>{tx.created}</td>
                                            <td className='px-5 py-4'>{tx.action}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile card list */}
                        <div className='xl:hidden divide-y divide-zen-light-border dark:divide-zen-border'>
                            {transactions.map((tx, i) => (
                                <div key={i} className='p-4 space-y-2'>
                                    <div className='flex items-center justify-between'>
                                        <span className='font-semibold text-zen-light-text dark:text-zen-text'>{tx.amount}</span>
                                        <span>{tx.status}</span>
                                    </div>
                                    <div className='flex items-center justify-between text-sm text-zen-light-muted dark:text-zen-muted'>
                                        <span>{tx.type}</span>
                                        <span>{tx.created}</span>
                                    </div>
                                    <p className='text-xs text-zen-light-muted dark:text-zen-muted font-mono truncate'>{tx.reference}</p>
                                    {tx.description && (
                                        <p className='text-xs text-zen-light-muted dark:text-zen-muted'>{tx.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

        </div>
    )
}

export default Transactions
