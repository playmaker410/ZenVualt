import React, { useState } from 'react'
import { CalendarDays, Bell, ChevronRight, Landmark, Bitcoin, ShieldCheck, MoreHorizontal } from "lucide-react";
import ThemeToggleButton from '../../components/ThemeToggleButton'

const InternationalWire = ({ setTheme, theme }) => {
    const [showNotif, setShowNotif] = useState(false)
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })


    const transferMethods = [
        {
            id: "wire",
            name: "Wire Transfer",
            description: "Transfer funds directly to international bank accounts.",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            icon: <span className="font-semibold text-sm">Wi</span>,
        },
        {
            id: "crypto",
            name: "Cryptocurrency",
            description: "Send funds to your cryptocurrency wallet.",
            iconBg: "bg-orange-500",
            iconColor: "text-white",
            icon: <Bitcoin size={18} strokeWidth={2} />,
        },
        {
            id: "paypal",
            name: "PayPal",
            description: "Transfer funds to your PayPal account.",
            iconBg: "bg-slate-100",
            iconColor: "text-slate-900",
            icon: <span className="font-bold text-base">P</span>,
        },
        {
            id: "wise",
            name: "Wise Transfer",
            description: "Transfer with lower fees using Wise.",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-700",
            icon: <span className="font-bold text-sm">^7</span>,
        },
        {
            id: "cashapp",
            name: "Cash App",
            description: "Quick transfers to your Cash App account.",
            iconBg: "bg-pink-100",
            iconColor: "text-black",
            icon: <span className="font-bold text-base bg-black text-white w-5 h-5 rounded flex items-center justify-center">$</span>,
        },
        {
            id: "more",
            name: "More Options",
            description: "Zelle, Venmo, Revolut, and more.",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            icon: <MoreHorizontal size={18} strokeWidth={2.5} />,
        },
    ];


    function MethodCard({ method, onSelect }) {
        return (
            <button
                onClick={() => onSelect(method.id)}
                className="group text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
                <div className="flex items-center gap-3 mb-3">
                    <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${method.iconBg} ${method.iconColor}`}
                    >
                        {method.icon}
                    </div>
                    <span className="font-semibold text-slate-900">{method.name}</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{method.description}</p>
            </button>
        );
    }

    const handleSelect = (id) => {
        console.log("Selected transfer method:", id);
    }

    return (

        <div className='space-y-6 px-3' onClick={() => { setShowNotif(false); }}>

            {/* ── Top bar ── */}
            <div className='hidden xl:flex items-center justify-between'>
                <div className='flex items-center gap-2 text-zen-light-muted dark:text-zen-muted text-sm'>
                    <CalendarDays size={16} /><span>{date}</span>
                </div>
                <div className='flex items-center gap-3'>
                    <div className='relative' onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowNotif(!showNotif)} className='p-2 rounded-full hover:bg-zen-light-card dark:hover:bg-zen-card'>
                            <Bell size={24} className='text-zen-light-muted dark:text-zen-muted' />
                        </button>
                        {showNotif && (
                            <div className='absolute right-0 top-10 w-[350px] p-3 rounded-md border border-white/10 shadow-lg bg-white dark:bg-zinc-900 z-50'>
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


            <div>
                <h1 className='text-2xl font-bold text-zen-light-text dark:text-zen-text'>International Transfer</h1>
                <p className='text-sm text-zen-light-muted dark:text-zen-muted mt-0.5'>
                    <span className='hover:underline cursor-pointer'>Dashboard</span>
                    <span className='mx-2'>›</span>
                    <span>International Transfer</span>
                </p>
            </div>

            <div className='flex flex-col justify-center items-center'>
                <h2 className="flex justify-self-start text-lg font-semibold text-slate-900 mb-4">Select Transfer Method</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                    {transferMethods.map((method) => (
                        <MethodCard key={method.id} method={method} onSelect={handleSelect} />
                    ))}
                </div>

                <div className="w-full max-w-4xl mt-6 bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-3">
                    <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="font-semibold text-slate-900 text-sm">Secure Transaction</p>
                        <p className="text-sm text-slate-500 mt-0.5">
                            All transfers are encrypted and processed securely. Never share your PIN with anyone.
                        </p>
                    </div>
                </div>

            </div>

        </div>

    )
}

export default InternationalWire