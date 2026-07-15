import { useState } from 'react'
import { CalendarDays, Bell, Filter, Download, Search, Inbox, CreditCard, Hourglass, Wallet, ShieldCheck, Globe, SlidersHorizontal, Zap, PlusCircle, ClipboardList, CircleCheckBig, ShoppingCart } from 'lucide-react'
import ThemeToggleButton from '../../components/ThemeToggleButton'
import Footer from '../../components/Footer'

const Cards = ({ theme, setTheme }) => {
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
    const [showNotif, setShowNotif] = useState(false)

    const Cards = [
        { icon: CreditCard, value: '0', desc: 'Active Cards', prefix: '', suffix: '' },
        { icon: Hourglass, value: '0', desc: 'Pending Applications', prefix: '', suffix: '' },
        { icon: Wallet, value: '0.00', desc: 'Total Card Balance', prefix: '$', suffix: '' },
    ]

    const Card_features = [
        { icon: ShieldCheck, title: 'Secure Payments', desc: 'Protect your main account with separate virtual cards' },
        { icon: Globe, title: 'Global Acceptance', desc: 'Use anywhere major cards are accepted online' },
        { icon: SlidersHorizontal, title: 'Spending Controls', desc: 'Set limits and monitor transactions in real-time' },
        { icon: Zap, title: 'Instant Issuance', desc: 'Create and use cards within minutes' },
    ]

    return (
        <div className='space-y-6 px-3' onClick={() => setShowNotif(false)}>


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
            <div className='flex '>
                <div>
                    <h1 className='text-xl sm:text-2xl font-bold text-zen-light-text dark:text-zen-text'>Cards</h1>
                    <p className='text-sm text-zen-light-muted dark:text-zen-muted mt-0.5'>
                        <span className='hover:underline cursor-pointer'>Dashboard</span>
                        <span className='mx-2'>›</span>
                        <span>Cards</span>
                    </p>
                </div>
            </div>

            {/* PAGE FIRST  CARDS  */}

            <div>

            </div><div className='py-5'>
                <div className='grid  xl:grid-cols-3 gap-4'>
                    {Cards.map(({ icon: Icon, value, desc, prefix }) => (
                        <div key={desc} className="flex items-center gap-4 bg-white dark:bg-zen-card border border-gray-200 dark:border-white/10 rounded-xl p-5 shadow-sm">
                            <div className="bg-zen-primary/10 dark:bg-[#0f1d4a] border border-zen-primary/20 rounded-xl p-3 shrink-0">
                                <Icon className="w-6 h-6 text-zen-primary" />
                            </div>

                            <div>
                                <p className="text-sm text-zen-light-muted dark:text-zen-muted">{desc}</p>
                                <h4 className="text-lg font-semibold text-zen-light-text dark:text-zen-text mt-0.5">
                                    {prefix && <span className='mr-1'>{prefix}</span>}
                                    {value}
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* PAGE SECOND CARD(DESCRIPTION OF  CARD ) */}

            <div className='relative bg-[#1a56a0] dark:bg-[#0f2d6b] rounded-2xl p-4  overflow-hidden'>

                <div    >
                    {/* Heading */}
                    <h2 className='text-white font-bold text-xl mb-2'>Virtual Cards Made Easy</h2>
                    <p className='text-blue-100 text-lg mb-6 leading-relaxed'>
                        Create virtual cards for secure online payments, subscription management, and more.
                        Our virtual cards offer enhanced security and control over your spending.
                    </p>

                    {/* Features grid */}
                    <div className='grid xl:grid-cols-2 gap-x-10 gap-y-4 mb-8'>
                        {Card_features.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className='flex items-start gap-3'>
                                <div className='bg-white/10 rounded-lg p-2 shrink-0 mt-0.5'>
                                    <Icon className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <p className='text-white text-sm font-medium'>{title}</p>
                                    <p className='text-blue-100 text-xs mt-0.5'>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <button className='bg-white text-[#1a56a0] hover:bg-blue-50 text-sm font-semibold px-6 py-2.5 rounded-lg transition'>
                        Apply Now
                    </button>
                </div>

                {/* Right side — placeholder for card image */}
                {/* {/* <div className='absolute right-8 top-1/2 -translate-y-1/2 w-[220px] h-[140px] bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center'>
                    <p className='text-white/40 text-xs text-center px-4'>Drop your card image here</p>
                </div> */}

            </div>


            {/* EMPTY CARD  */}

            {/* Cards Section */}
            <div className='bg-white dark:bg-zen-card border border-gray-200 dark:border-white/10 rounded-2xl'>
                <div className='flex items-center justify-between p-5 border-b border-gray-200 dark:border-white/10'>
                    <h3 className='text-zen-light-text dark:text-zen-text font-medium'>Your Cards</h3>
                    <button className='flex items-center gap-1.5 text-teal-600 hover:text-teal-700 text-sm font-medium transition'>
                        <PlusCircle size={16} />
                        New Card
                    </button>
                </div>

                {/* Empty state */}
                <div className='flex flex-col items-center justify-center py-16 px-6 text-center'>
                    <div className='bg-gray-100 dark:bg-white/10 rounded-full p-4 mb-4'>
                        <CreditCard className='w-6 h-6 text-gray-400 dark:text-zen-muted' />
                    </div>
                    <h4 className='text-zen-light-text dark:text-zen-text font-medium mb-2'>No cards yet</h4>
                    <p className='text-zen-light-muted dark:text-zen-muted text-sm max-w-sm mb-6'>
                        You haven't applied for any virtual cards yet. Apply for a new card to get started with secure online payments.
                    </p>
                    <button className='bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition'>
                        Apply for Card
                    </button>
                </div>
            </div>



            {/* How Virtual Cards Work (Grid)*/}
            <div>
                <h3 className='text-zen-light-text dark:text-zen-text font-bold text-lg mb-4'>How Virtual Cards Work</h3>
                <div className='grid xl:grid-cols-3 gap-4'>
                    {[
                        {
                            icon: ClipboardList,
                            step: '1. Apply',
                            desc: 'Complete the application form for your virtual card. Select your preferred card type and set your spending limits.',
                        },
                        {
                            icon: CircleCheckBig,
                            step: '2. Activate',
                            desc: 'Once approved, your virtual card will be ready to use. View the card details and activate it from your dashboard.',
                        },
                        {
                            icon: ShoppingCart,
                            step: '3. Use',
                            desc: 'Use your virtual card for online transactions anywhere major credit cards are accepted. Monitor transactions in real-time.',
                        },
                    ].map(({ icon: Icon, step, desc }) => (
                        <div key={step} className='bg-white dark:bg-zen-card border border-gray-200 dark:border-white/10 rounded-2xl p-6'>
                            <div className='bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mb-4'>
                                <Icon className='w-5 h-5 text-white' />
                            </div>
                            <h4 className='text-zen-light-text dark:text-zen-text font-semibold mb-2'>{step}</h4>
                            <p className='text-zen-light-muted dark:text-zen-muted text-sm leading-relaxed'>{desc}</p>
                        </div>
                    ))}
                </div>
            </div>






            {/* FAQ Section */}
            <div className='bg-white dark:bg-zen-card border border-gray-200 dark:border-white/10 rounded-2xl'>
                <div className='p-5 border-b border-gray-200 dark:border-white/10'>
                    <h3 className='text-zen-light-text dark:text-zen-text font-medium'>Frequently Asked Questions</h3>
                </div>

                <div className='divide-y divide-gray-200 dark:divide-white/10'>
                    {[
                        {
                            q: 'What is a virtual card?',
                            a: 'A virtual card is a digital payment card that can be used for online transactions. It works just like a physical card but exists only in digital form, providing enhanced security for online purchases.',
                        },
                        {
                            q: 'How secure are virtual cards?',
                            a: "Virtual cards offer additional security as they're separate from your primary account. You can create cards with specific spending limits and even create single-use cards for enhanced protection against fraud.",
                        },
                        {
                            q: 'Can I have multiple virtual cards?',
                            a: 'Yes, you can apply for multiple virtual cards for different purposes - such as one for subscriptions, another for shopping, etc. Each card can have its own limits and settings.',
                        },
                        {
                            q: 'How long does it take to get a virtual card?',
                            a: 'Virtual cards are typically issued within minutes after approval. Once approved, you can immediately view and use the card details for online transactions.',
                        },
                    ].map(({ q, a }) => (
                        <div key={q} className='px-5 py-4'>
                            <h4 className='text-zen-light-text dark:text-zen-text text-sm font-semibold mb-1'>{q}</h4>
                            <p className='text-zen-light-muted dark:text-zen-muted text-sm leading-relaxed'>{a}</p>
                        </div>
                    ))}
                </div>
            </div>











        </div >
    )
}

export default Cards