import React, { useState } from 'react'
import {
    CalendarDays, Bell, PiggyBank,
    CreditCard,
    Landmark,
    Bitcoin,
    ArrowLeft,
    ShieldCheck
} from "lucide-react";
import ThemeToggleButton from '../../components/ThemeToggleButton';

const Deposit = ({ theme, setTheme }) => {

    const [showNotif, setShowNotif] = useState(false)
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })


    const depositMethods = [
        {
            id: "credit_card",
            name: "Credit Card",
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-600",
            icon: <CreditCard size={20} strokeWidth={2} />,
        },
        {
            id: "usdt",
            name: "USDT",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            icon: <span className="font-bold text-sm">₮</span>,
        },
        {
            id: "bank_transfer",
            name: "Bank Transfer",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            icon: <Landmark size={20} strokeWidth={2} />,
        },
        {
            id: "bitcoin",
            name: "Bitcoin",
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            icon: <Bitcoin size={20} strokeWidth={2} />,
        },
    ];

    const quickAmounts = [100, 500, 1000, 5000, 10000];
    const [selectedMethod, setSelectedMethod] = useState("credit_card");
    const [amount, setAmount] = useState("");

    const handleContinue = () => {
        console.log("Continue to deposit:", { method: selectedMethod, amount });
    };


    function DepositMethodCard({ method, selected, onSelect }) {
        return (
            <button
                onClick={() => onSelect(method.id)}
                className={`flex items-center justify-between gap-3 bg-white border rounded-xl px-5 py-4 transition-all text-left
        ${selected ? "border-teal-500 ring-1 ring-teal-500" : "border-slate-200 hover:border-slate-300"}`}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${method.iconBg} ${method.iconColor}`}
                    >
                        {method.icon}
                    </div>
                    <span className="font-medium text-slate-900">{method.name}</span>
                </div>
                <span
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center
          ${selected ? "border-teal-500" : "border-slate-300"}`}
                >
                    {selected && <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />}
                </span>
            </button>
        );
    }



    return (
        <div className='space-y-6 px-4 sm:px-6' onClick={() => { setShowNotif(false); }}>

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
                            <div className='absolute right-0 top-10 w-[min(350px,90vw)] p-3 rounded-md border border-white/10 shadow-lg bg-white dark:bg-zinc-900 z-50'>
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
                <h1 className='text-xl sm:text-2xl font-bold text-zen-light-text dark:text-zen-text'>Deposit Funds</h1>
                <p className='text-sm text-zen-light-muted dark:text-zen-muted mt-0.5'>
                    <span className='hover:underline cursor-pointer'>Dashboard</span>
                    <span className='mx-2'>›</span>
                    <span>Deposit</span>
                </p>
            </div>

            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-lg shadow-slate-200/50">

                {/* Header */}
                <div className="relative flex justify-center items-center bg-gradient-to-r from-teal-800 to-cyan-700 pt-8 sm:pt-10 pb-14 sm:pb-16 px-4 sm:px-6 text-center overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-white/15 flex items-center justify-center mb-3 sm:mb-4">
                            <PiggyBank size={26} className="text-white sm:hidden" strokeWidth={1.75} />
                            <PiggyBank size={30} className="text-white hidden sm:block" strokeWidth={1.75} />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white">Fund Your Account</h1>
                        <p className="text-teal-100/80 text-xs sm:text-sm mt-1 px-2">
                            Choose your preferred deposit method and amount
                        </p>
                    </div>
                    <svg
                        className="absolute bottom-0 left-0 w-full h-8 sm:h-10 text-white"
                        viewBox="0 0 1440 100"
                        preserveAspectRatio="none"
                        fill="currentColor"
                    >
                        <path
                            opacity="0.35"
                            d="M0,60 C240,10 480,90 720,50 C960,10 1200,80 1440,40 L1440,100 L0,100 Z"
                        />
                        <path d="M0,80 C240,40 480,100 720,70 C960,30 1200,90 1440,60 L1440,100 L0,100 Z" />
                    </svg>
                </div>

                {/* Form body */}
                <div className="bg-white/80 backdrop-blur-sm px-4 sm:px-8 py-6 sm:py-8 -mt-2 space-y-5 sm:space-y-6">

                    {/* Deposit method */}
                    <div>
                        <p className="text-sm text-slate-500 mb-3">Select Deposit Method</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {depositMethods.map((method) => (
                                <DepositMethodCard
                                    key={method.id}
                                    method={method}
                                    selected={selectedMethod === method.id}
                                    onSelect={setSelectedMethod}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Deposit amount */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
                        <p className="text-sm text-slate-500 mb-3">Deposit Amount</p>
                        <div className="flex items-center border border-teal-400 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 bg-white focus-within:ring-2 focus-within:ring-teal-400/40">
                            <span className="text-xl sm:text-2xl text-slate-300 font-light mr-2">$</span>
                            <input
                                type="number"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="flex-1 min-w-0 text-xl sm:text-2xl font-light text-slate-700 placeholder-slate-300 outline-none bg-transparent
                                [appearance:textfield]
                                [&::-webkit-outer-spin-button]:appearance-none
                                [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {quickAmounts.map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setAmount(String(val))}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors
                                    ${Number(amount) === val
                                            ? "bg-teal-600 text-white"
                                            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                                        }`}
                                >
                                    ${val.toLocaleString()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action */}
                    <button
                        onClick={handleContinue}
                        className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-semibold text-sm sm:text-base rounded-xl py-3 sm:py-3.5 shadow-sm hover:shadow-md transition-all duration-150"
                    >
                        <CreditCard size={18} />
                        Continue to Deposit
                    </button>

                </div>
            </div>

            <div className="w-full max-w-5xl mx-auto mb-4 mt-6 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex items-start gap-3">
                <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                <div>
                    <p className="font-semibold text-slate-900 text-sm">Secure Transaction</p>
                    <p className="text-sm text-slate-500 mt-0.5">
                        All transfers are encrypted and processed securely. Never share your PIN with anyone.
                    </p>
                </div>
            </div>

        </div>
    )









}

export default Deposit