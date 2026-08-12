import { useState } from 'react'
import ThemeToggleButton from '../../components/ThemeToggleButton'
import {
    CalendarDays, Bell, ChevronRight, PiggyBank, CheckCircle2,
    Clock, Percent, FileText, ShieldCheck, Layers, Home, Car,
    Briefcase, Users, CreditCard, HeartPulse, Info, HelpCircle,
} from 'lucide-react'

const LoanReq = ({ theme, setTheme }) => {
    const [showNotif, setShowNotif] = useState(false)
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })

    const whyChooseUs = [
        { id: 'quick_approval',    name: 'Quick Approval',       description: 'Get a decision within hours and funds within days',                icon: <Clock size={20} strokeWidth={2} /> },
        { id: 'competitive_rates', name: 'Competitive Rates',    description: 'Enjoy some of the lowest interest rates available in the market',  icon: <Percent size={20} strokeWidth={2} /> },
        { id: 'simple_process',    name: 'Simple Process',       description: 'Straightforward application with minimal paperwork',               icon: <FileText size={20} strokeWidth={2} /> },
        { id: 'secure',            name: 'Secure & Confidential',description: 'Your information is protected with bank-level security',           icon: <ShieldCheck size={20} strokeWidth={2} /> },
    ]

    const loanTypes = [
        { id: 'home',      name: 'Personal Home Loans', description: 'Finance your dream home with competitive rates',          icon: <Home size={20} strokeWidth={2} /> },
        { id: 'auto',      name: 'Automobile Loans',    description: 'Get on the road with flexible auto financing',            icon: <Car size={20} strokeWidth={2} /> },
        { id: 'business',  name: 'Business Loans',      description: 'Grow your business with tailored financing solutions',    icon: <Briefcase size={20} strokeWidth={2} /> },
        { id: 'mortgage',  name: 'Joint Mortgage',      description: 'Share responsibility with a co-borrower',                icon: <Users size={20} strokeWidth={2} /> },
        { id: 'overdraft', name: 'Secured Overdraft',   description: 'Access funds when needed with asset backing',            icon: <CreditCard size={20} strokeWidth={2} /> },
        { id: 'health',    name: 'Health Finance',      description: 'Cover medical expenses with flexible payment options',   icon: <HeartPulse size={20} strokeWidth={2} /> },
    ]

    const howItWorksSteps = [
        { id: 'apply',    name: 'Apply Online',           description: 'Complete our simple online application form with your details and loan requirements' },
        { id: 'review',   name: 'Quick Review',           description: 'Our team reviews your application and may contact you for additional information' },
        { id: 'approval', name: 'Approval & Disbursement',description: 'Once approved, the loan amount will be transferred to your account' },
    ]

    const faqs = [
        { id: 'docs',     question: 'What documents do I need to apply?',   answer: "You'll need identification, proof of income, and address verification. Additional documents may be requested based on loan type." },
        { id: 'time',     question: 'How long does approval take?',          answer: 'Standard applications are typically processed within 1-3 business days, depending on verification requirements.' },
    ]

    // ── Sub-components ────────────────────────────────────────────────────────

    function SectionHeader({ icon, title }) {
        return (
            <div className='flex items-center gap-3 mb-5'>
                <div className='w-9 h-9 rounded-full bg-zen-primary flex items-center justify-center shrink-0 text-zen-text'>
                    {icon}
                </div>
                <h2 className='text-base sm:text-lg font-semibold text-zen-light-text dark:text-zen-text'>{title}</h2>
            </div>
        )
    }

    function InfoCard({ item }) {
        return (
            <div className='bg-zen-light-bg dark:bg-zen-bg border border-zen-light-border dark:border-zen-border rounded-xl p-4 sm:p-5 hover:border-zen-primary/40 transition-all'>
                <div className='flex items-center gap-2.5 mb-2'>
                    <span className='text-zen-primary'>{item.icon}</span>
                    <span className='font-medium text-zen-light-text dark:text-zen-text text-sm'>{item.name}</span>
                </div>
                <p className='text-sm text-zen-light-muted dark:text-zen-muted leading-relaxed'>{item.description}</p>
            </div>
        )
    }

    function StepItem({ step, index, isLast }) {
        return (
            <div className='relative flex gap-4 pb-8 last:pb-0'>
                {!isLast && (
                    <span className='absolute left-[15px] top-8 bottom-0 w-px bg-zen-light-border dark:bg-zen-border' />
                )}
                <span className='w-8 h-8 rounded-full bg-zen-primary text-zen-text text-sm font-semibold flex items-center justify-center shrink-0 z-10'>
                    {index + 1}
                </span>
                <div className='pt-0.5'>
                    <p className='font-medium text-zen-light-text dark:text-zen-text text-sm'>{step.name}</p>
                    <p className='text-sm text-zen-light-muted dark:text-zen-muted mt-0.5'>{step.description}</p>
                </div>
            </div>
        )
    }

    function FaqItem({ faq }) {
        return (
            <div className='bg-zen-light-bg dark:bg-zen-bg border border-zen-light-border dark:border-zen-border rounded-xl p-4'>
                <p className='font-medium text-zen-light-text dark:text-zen-text text-sm'>{faq.question}</p>
                <p className='text-sm text-zen-light-muted dark:text-zen-muted mt-1 leading-relaxed'>{faq.answer}</p>
            </div>
        )
    }

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div className='space-y-6 px-3 py-4 xl:py-0' onClick={() => setShowNotif(false)}>

            {/* ── Desktop top bar ── */}
            <div className='hidden xl:flex items-center justify-between'>
                <div className='flex items-center gap-2 text-zen-light-muted dark:text-zen-muted text-sm'>
                    <CalendarDays size={16} />
                    <span>{date}</span>
                </div>
                <div className='flex items-center gap-3'>
                    <div className='relative' onClick={e => e.stopPropagation()}>
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

            {/* ── Page heading ── */}
            <div>
                <h1 className='text-xl sm:text-2xl font-bold text-zen-light-text dark:text-zen-text'>Loan Services</h1>
                <p className='text-sm text-zen-light-muted dark:text-zen-muted mt-0.5'>
                    <span className='hover:underline cursor-pointer'>Dashboard</span>
                    <span className='mx-2'>›</span>
                    <span>Loan Services</span>
                </p>
            </div>

            {/* ── Main card ── */}
            <div className='rounded-2xl overflow-hidden border border-zen-light-border dark:border-zen-border'>

                {/* Hero banner — same gradient as the balance card in Overview */}
                <div className='relative flex justify-center pt-8 sm:pt-10 pb-14 sm:pb-16 px-4 sm:px-6 text-center overflow-hidden'
                    style={{ background: 'linear-gradient(135deg, #0f4c6b 0%, #1a7a8a 60%, #1e9e9e 100%)' }}>
                    <div className='relative z-10'>
                        <div className='w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-zen-text/15 flex items-center justify-center mb-3 sm:mb-4'>
                            <PiggyBank size={28} className='text-zen-text' strokeWidth={1.75} />
                        </div>
                        <h2 className='text-xl sm:text-2xl font-bold text-zen-text'>Loan Services</h2>
                        <p className='text-zen-text/70 text-xs sm:text-sm mt-1 max-w-xs mx-auto'>
                            Flexible loan options designed to meet your financial needs
                        </p>
                    </div>
                    {/* wave */}
                    <svg className='absolute bottom-0 left-0 w-full h-8 sm:h-10 text-zen-light-card dark:text-zen-card'
                        viewBox='0 0 1440 100' preserveAspectRatio='none' fill='currentColor'>
                        <path opacity='0.35' d='M0,60 C240,10 480,90 720,50 C960,10 1200,80 1440,40 L1440,100 L0,100 Z' />
                        <path d='M0,80 C240,40 480,100 720,70 C960,30 1200,90 1440,60 L1440,100 L0,100 Z' />
                    </svg>
                </div>

                {/* ── Body ── */}
                <div className='px-4 sm:px-6 py-8 space-y-10 bg-zen-light-card dark:bg-zen-card'>

                    {/* Why Choose Us */}
                    <section>
                        <SectionHeader icon={<CheckCircle2 size={18} />} title='Why Choose Our Loan Services' />
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {whyChooseUs.map(item => <InfoCard key={item.id} item={item} />)}
                        </div>
                    </section>

                    {/* Loan Types */}
                    <section>
                        <SectionHeader icon={<Layers size={18} />} title='Available Loan Types' />
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {loanTypes.map(item => <InfoCard key={item.id} item={item} />)}
                        </div>
                        <button className='mx-auto mt-5 flex items-center gap-1 text-sm font-medium text-zen-primary hover:text-zen-secondary transition-colors'>
                            View all loan options
                            <ChevronRight size={16} />
                        </button>
                    </section>

                    {/* How It Works */}
                    <section>
                        <SectionHeader icon={<Info size={18} />} title='How It Works' />
                        {howItWorksSteps.map((step, index) => (
                            <StepItem
                                key={step.id}
                                step={step}
                                index={index}
                                isLast={index === howItWorksSteps.length - 1}
                            />
                        ))}
                    </section>

                    {/* FAQ */}
                    <section className='bg-zen-light-bg dark:bg-zen-bg border border-zen-light-border dark:border-zen-border rounded-xl p-4 sm:p-6'>
                        <div className='flex items-center gap-2.5 mb-4'>
                            <HelpCircle size={20} className='text-zen-primary' />
                            <h2 className='text-base sm:text-lg font-semibold text-zen-light-text dark:text-zen-text'>Frequently Asked Questions</h2>
                        </div>
                        <div className='space-y-3'>
                            {faqs.map(faq => <FaqItem key={faq.id} faq={faq} />)}
                        </div>
                        <button className='mt-4 flex items-center gap-1 text-sm font-medium text-zen-primary hover:text-zen-secondary transition-colors'>
                            View all FAQs
                            <ChevronRight size={16} />
                        </button>
                    </section>

                    {/* CTA */}
                    <section className='rounded-2xl p-6 sm:p-10 text-center border border-zen-primary/20'
                        style={{ background: 'linear-gradient(135deg, rgba(14,165,255,0.12) 0%, rgba(29,78,216,0.08) 100%)' }}>
                        <h2 className='text-lg sm:text-2xl font-bold text-zen-light-text dark:text-zen-text'>Ready to get started?</h2>
                        <p className='text-sm sm:text-base text-zen-light-muted dark:text-zen-muted mt-2'>
                            Apply now and get a decision on your loan application quickly
                        </p>
                        <button className='mt-5 bg-zen-primary hover:bg-zen-secondary text-zen-text font-medium rounded-lg px-6 py-3 transition-colors'>
                            Apply for a Loan
                        </button>
                    </section>

                </div>
            </div>

        </div>
    )
}

export default LoanReq
