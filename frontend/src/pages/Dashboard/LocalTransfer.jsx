import { useState } from 'react'
import {
    CalendarDays, Bell, ArrowRightLeft, Send, User,
    Hash, Layers, DollarSign, FileText,
    ShieldCheck, AlertCircle, ArrowLeft, ArrowRight,
    CreditCard, CheckCircle2, Eye, EyeOff
} from 'lucide-react'
import ThemeToggleButton from '../../components/ThemeToggleButton'


const recentBeneficiaries = [
    { name: 'Sarah Johnson', account: '****4521', initials: 'SJ', color: 'bg-purple-500' },
    { name: 'Mike Peters', account: '****8834', initials: 'MP', color: 'bg-teal-600' },
    { name: 'Amara Osei', account: '****2210', initials: 'AO', color: 'bg-blue-500' },
]

const steps = [
    { id: 1, label: 'Beneficiary' },
    { id: 2, label: 'Amount' },
    { id: 3, label: 'Confirm & PIN' },
]

const LocalTransfer = ({ theme, setTheme }) => {
    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })

    const [showNotif, setShowNotif] = useState(false)
    const [showPin, setShowPin] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [step, setStep] = useState(1)

    const [form, setForm] = useState({
        beneficiaryName: '',
        accountNumber: '',
        bankName: '',
        amount: '',
        note: '',
        pin: '',
    })

    const update = (field, value) => {
        setError('')
        setForm(prev => ({ ...prev, [field]: value }))
    }



    const validateStep = () => {
        setError('')
        if (step === 1) {
            if (!form.beneficiaryName.trim()) { setError('Beneficiary name is required'); return false }
            if (!form.accountNumber.trim() || form.accountNumber.length < 6) { setError('Enter a valid account number'); return false }
            if (!form.bankName.trim()) { setError('Please enter the bank name'); return false }
        }
        if (step === 2) {
            if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) { setError('Enter a valid amount'); return false }
        }
        if (step === 3) {
            if (form.pin.length !== 4) { setError('Enter your 4-digit bank PIN'); return false }
        }
        return true
    }

    const handleNext = () => {
        if (!validateStep()) return
        setStep(s => Math.min(s + 1, 3))
    }

    const handleBack = () => {
        setError('')
        setStep(s => Math.max(s - 1, 1))
    }

    const handleSubmit = () => {
        if (!validateStep()) return
        setLoading(true)
        setError('')
        // Replace with real fetch to /api/verify-pin then process transfer
        setTimeout(() => {
            setLoading(false)
            setSuccess(true)
        }, 2000)
    }

    const handleReset = () => {
        setSuccess(false)
        setStep(1)
        setForm({ beneficiaryName: '', accountNumber: '', bankName: '', amount: '', note: '', pin: '' })
    }

    const fillBeneficiary = (b) => {
        setError('')
        setForm(prev => ({
            ...prev,
            beneficiaryName: b.name,
            accountNumber: b.account.replace('****', ''),
        }))
    }

    // ── Success Screen ──
    if (success) {
        return (
            <div className='min-h-full bg-slate-50 px-4 py-6 dark:bg-zen-bg sm:px-6'>
                <div className='mx-auto max-w-5xl space-y-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 text-zen-light-muted dark:text-zen-muted text-sm'>
                        <CalendarDays size={16} /><span>{date}</span>
                    </div>
                    <ThemeToggleButton theme={theme} setTheme={setTheme} />
                </div>

                <div className='mx-auto max-w-md'>
                    <div className='rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-[0_12px_32px_rgba(15,23,42,0.08)] dark:border-zen-border dark:bg-zen-card'>
                        <div className='mx-auto flex w-fit rounded-full bg-emerald-50 p-5 dark:bg-emerald-950/30'>
                            <CheckCircle2 className='w-12 h-12 text-green-500' />
                        </div>
                        <h2 className='mt-4 text-xl font-bold text-zen-light-text dark:text-zen-text'>Transfer successful</h2>
                        <p className='mt-2 text-sm text-zen-light-muted dark:text-zen-muted'>
                            You sent <span className='text-zen-primary font-bold'>${parseFloat(form.amount).toFixed(2)}</span> to <span className='font-semibold text-zen-light-text dark:text-zen-text'>{form.beneficiaryName}</span>
                        </p>

                        <div className='mt-6 w-full space-y-2.5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-zen-border dark:bg-zen-bg'>
                            {[
                                { label: 'Recipient', value: form.beneficiaryName },
                                { label: 'Account', value: `****${form.accountNumber.slice(-4)}` },
                                { label: 'Bank', value: form.bankName },
                                { label: 'Amount', value: `$${parseFloat(form.amount).toFixed(2)}` },
                                { label: 'Fee', value: '$0.00' },
                                { label: 'Status', value: 'Processing' },
                            ].map(({ label, value }) => (
                                <div key={label} className='flex justify-between text-sm'>
                                    <span className='text-zen-light-muted dark:text-zen-muted'>{label}</span>
                                    <span className={`font-medium ${label === 'Status' ? 'text-yellow-500' : 'text-zen-light-text dark:text-zen-text'}`}>{value}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleReset}
                            className='mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-zen-primary dark:hover:bg-zen-secondary'
                        >
                            Make Another Transfer
                        </button>
                    </div>
                </div>

                </div>
            </div>
        )
    }

    return (
        <div className='min-h-full bg-slate-50 px-4 py-6 dark:bg-zen-bg sm:px-6' onClick={() => { setShowNotif(false); }}>
            <div className='mx-auto max-w-6xl space-y-6'>

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

            {/* ── Page heading ── */}
            <div className='border-b border-slate-200 pb-5 dark:border-zen-border'>
                <p className='text-xs font-semibold uppercase tracking-[0.16em] text-zen-primary'>Payments</p>
                <h1 className='mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-zen-text'>Local transfer</h1>
                <p className='mt-1 text-sm text-slate-500 dark:text-zen-muted'>Send money securely to an account within your country.</p>
            </div>

            <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]'>

                {/* ── Main Form Card ── */}
                <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.06)] dark:border-zen-border dark:bg-zen-card'>

                    {/* Card Header */}
                    <div className='flex items-center gap-3 border-b border-slate-200 bg-slate-50/80 p-5 dark:border-zen-border dark:bg-zen-bg/40'>
                        <div className='rounded-xl bg-slate-900 p-2.5 text-white dark:bg-zen-primary'>
                            <ArrowRightLeft className='h-5 w-5' />
                        </div>
                        <div>
                            <h3 className='text-zen-light-text dark:text-zen-text font-semibold'>Transfer Details</h3>
                            <p className='text-xs text-zen-light-muted dark:text-zen-muted'>Step {step} of {steps.length} — {steps[step - 1].label}</p>
                        </div>
                    </div>

                    {/* ── Step Progress ── */}
                    <div className='mb-1 flex items-center px-6 pt-6'>
                        {steps.map((s, i) => (
                            <div key={s.id} className='flex items-center flex-1 last:flex-none'>
                                <div className='flex flex-col items-center gap-1'>
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${step > s.id ? 'border-slate-900 bg-slate-900 text-white dark:border-zen-primary dark:bg-zen-primary' : step === s.id ? 'border-slate-900 bg-white text-slate-900 dark:border-zen-primary dark:bg-zen-card dark:text-zen-text' : 'border-slate-200 text-slate-400 dark:border-zen-border dark:text-zen-muted'}`}>
                                        {step > s.id ? <ShieldCheck className='w-4 h-4' /> : s.id}
                                    </div>
                                    <span className={`text-[10px] font-medium hidden sm:block whitespace-nowrap ${step >= s.id ? 'text-zen-light-text dark:text-zen-text' : 'text-zen-light-muted dark:text-zen-muted'}`}>{s.label}</span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className={`mb-4 mx-2 h-0.5 flex-1 transition-colors ${step > s.id ? 'bg-slate-900 dark:bg-zen-primary' : 'bg-slate-200 dark:bg-zen-border'}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className='space-y-6 p-5 sm:p-6'>

                        {/* ── STEP 1: Beneficiary ── */}
                        {step === 1 && (
                            <>
                                {/* Recent Beneficiaries quick-fill */}
                                <div>
                                    <p className='mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-zen-muted'>Recent beneficiaries</p>
                                    <div className='flex gap-3 overflow-x-auto pb-1'>
                                        {recentBeneficiaries.map(b => (
                                            <button
                                                key={b.name}
                                                type='button'
                                                onClick={() => fillBeneficiary(b)}
                                                className='flex flex-col items-center gap-1.5 shrink-0 group'
                                            >
                                                <div className={`${b.color} flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-transparent transition group-hover:ring-slate-900 dark:group-hover:ring-zen-primary`}>
                                                    {b.initials}
                                                </div>
                                                <span className='text-[10px] text-zen-light-muted dark:text-zen-muted w-14 text-center truncate'>{b.name.split(' ')[0]}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className='space-y-4 border-t border-slate-100 pt-5 dark:border-zen-border'>
                                    {/* Beneficiary Name */}
                                    <div>
                                        <label className='block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5'>Beneficiary Name</label>
                                        <div className='relative'>
                                            <User className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted' />
                                            <input
                                                type='text'
                                                placeholder='Full name of recipient'
                                                value={form.beneficiaryName}
                                                onChange={e => update('beneficiaryName', e.target.value)}
                                                className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-900/5 dark:border-zen-border dark:bg-zen-bg dark:text-zen-text dark:placeholder:text-zen-muted dark:focus:border-zen-primary dark:focus:bg-zen-card dark:focus:ring-zen-primary/15'
                                            />
                                        </div>
                                    </div>

                                    {/* Account Number */}
                                    <div>
                                        <label className='block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5'>Account Number</label>
                                        <div className='relative'>
                                            <Hash className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted' />
                                            <input
                                                type='text'
                                                inputMode='numeric'
                                                placeholder='Enter account number'
                                                value={form.accountNumber}
                                                onChange={e => update('accountNumber', e.target.value.replace(/\D/g, ''))}
                                                className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 font-mono text-sm tracking-wider text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-900/5 dark:border-zen-border dark:bg-zen-bg dark:text-zen-text dark:placeholder:text-zen-muted dark:focus:border-zen-primary dark:focus:bg-zen-card dark:focus:ring-zen-primary/15'
                                            />
                                        </div>
                                    </div>

                                    {/* Transfer Type */}
                                    {/* Bank Name */}
                                    <div>
                                        <label className='block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5'>Bank Name</label>
                                        <div className='relative'>
                                            <Layers className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted' />
                                            <input
                                                type='text'
                                                value={form.bankName}
                                                onChange={e => update('bankName', e.target.value)}
                                                className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-900/5 dark:border-zen-border dark:bg-zen-bg dark:text-zen-text dark:placeholder:text-zen-muted dark:focus:border-zen-primary dark:focus:bg-zen-card dark:focus:ring-zen-primary/15'
                                            />
                                        </div>
                                    </div>
                                </div>

                            </>
                        )}

                        {/* ── STEP 2: Amount ── */}
                        {step === 2 && (
                            <>
                                {/* Mini beneficiary recap */}
                                <div className='flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-zen-border dark:bg-zen-bg'>
                                    <div className='bg-zen-primary/20 w-9 h-9 rounded-full flex items-center justify-center text-zen-primary font-bold text-sm shrink-0'>
                                        {form.beneficiaryName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className='text-zen-light-text dark:text-zen-text text-sm font-semibold'>{form.beneficiaryName}</p>
                                        <p className='text-zen-light-muted dark:text-zen-muted text-xs'>****{form.accountNumber.slice(-4)} · {form.bankName}</p>
                                    </div>
                                </div>

                                {/* Amount */}
                                <div>
                                    <label className='block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5'>Amount</label>
                                    <div className='relative'>
                                        <DollarSign className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted' />
                                        <input
                                            type='number'
                                            min='0'
                                            step='0.01'
                                            placeholder='0.00'
                                            value={form.amount}
                                            onChange={e => update('amount', e.target.value)}
                                            className='w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-10 pr-4 font-mono text-xl font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-900/5 dark:border-zen-border dark:bg-zen-bg dark:text-zen-text dark:placeholder:text-zen-muted dark:focus:border-zen-primary dark:focus:bg-zen-card dark:focus:ring-zen-primary/15'
                                        />
                                    </div>
                                    <p className='text-xs text-zen-light-muted dark:text-zen-muted mt-1.5'>
                                        Available balance: <span className='text-zen-primary font-semibold'>$0.00</span>
                                    </p>
                                </div>

                                {/* Note */}
                                <div>
                                    <label className='block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5'>
                                        Note <span className='text-zen-light-muted dark:text-zen-muted font-normal'>(optional)</span>
                                    </label>
                                    <div className='relative'>
                                        <FileText className='absolute left-3.5 top-3.5 w-4 h-4 text-zen-light-muted dark:text-zen-muted' />
                                        <textarea
                                            rows={3}
                                            placeholder='What is this transfer for?'
                                            value={form.note}
                                            onChange={e => update('note', e.target.value)}
                                            className='w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-900/5 dark:border-zen-border dark:bg-zen-bg dark:text-zen-text dark:placeholder:text-zen-muted dark:focus:border-zen-primary dark:focus:bg-zen-card dark:focus:ring-zen-primary/15'
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── STEP 3: Confirm & PIN ── */}
                        {step === 3 && (
                            <>
                                {/* Full Summary */}
                                <div>
                                    <p className='text-xs font-semibold text-zen-light-muted dark:text-zen-muted uppercase tracking-wider mb-3'>Transfer Summary</p>
                                    <div className='space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-zen-border dark:bg-zen-bg'>
                                        {[
                                            { label: 'To', value: form.beneficiaryName },
                                            { label: 'Account', value: `****${form.accountNumber.slice(-4)}` },
                                            { label: 'Bank', value: form.bankName },
                                            { label: 'Amount', value: `$${parseFloat(form.amount || 0).toFixed(2)}` },
                                            { label: 'Fee', value: '$0.00' },
                                            ...(form.note ? [{ label: 'Note', value: form.note }] : []),
                                        ].map(({ label, value }) => (
                                            <div key={label} className='flex justify-between text-sm'>
                                                <span className='text-zen-light-muted dark:text-zen-muted'>{label}</span>
                                                <span className='text-zen-light-text dark:text-zen-text font-medium text-right max-w-[60%]'>{value}</span>
                                            </div>
                                        ))}
                                        <div className='border-t border-gray-200 dark:border-white/10 pt-3 flex justify-between'>
                                            <span className='text-zen-light-text dark:text-zen-text font-bold text-sm'>Total</span>
                                            <span className='text-zen-primary font-bold text-base'>${parseFloat(form.amount || 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* PIN Entry */}
                                <div>
                                    <label className='block text-sm font-semibold text-zen-light-text dark:text-zen-text mb-1.5'>
                                        Enter Bank PIN to Confirm
                                    </label>
                                    <div className='relative'>
                                        <CreditCard className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zen-light-muted dark:text-zen-muted' />
                                        <input
                                            type={showPin ? 'text' : 'password'}
                                            inputMode='numeric'
                                            maxLength={4}
                                            placeholder='••••'
                                            value={form.pin}
                                            onChange={e => update('pin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            className='w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-center text-lg font-bold tracking-[0.5em] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:bg-white focus:ring-4 focus:ring-slate-900/5 dark:border-zen-border dark:bg-zen-bg dark:text-zen-text dark:placeholder:text-zen-muted dark:focus:border-zen-primary dark:focus:bg-zen-card dark:focus:ring-zen-primary/15'
                                        />
                                        <button
                                            type='button'
                                            onClick={() => setShowPin(!showPin)}
                                            className='absolute right-3.5 top-1/2 -translate-y-1/2 text-zen-light-muted dark:text-zen-muted hover:text-zen-primary transition'
                                        >
                                            {showPin ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                                        </button>
                                    </div>
                                    <p className='text-xs text-zen-light-muted dark:text-zen-muted mt-1.5 flex items-center gap-1'>
                                        <ShieldCheck className='w-3 h-3 text-green-500' />
                                        Your PIN is encrypted and never stored in plain text
                                    </p>
                                </div>
                            </>
                        )}

                        {/* ── Error ── */}
                        {error && (
                            <div className='flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300'>
                                <AlertCircle className='w-4 h-4 shrink-0' />
                                {error}
                            </div>
                        )}

                        {/* ── Navigation Buttons ── */}
                        <div className='flex gap-3 pt-1'>
                            {step > 1 && (
                                <button
                                    type='button'
                                    onClick={handleBack}
                                    className='flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] dark:border-zen-border dark:text-zen-text dark:hover:bg-zen-bg'
                                >
                                    <ArrowLeft className='w-4 h-4' /> Back
                                </button>
                            )}

                            {step < 3 ? (
                                <button
                                    type='button'
                                    onClick={handleNext}
                                    className='flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98] dark:bg-zen-primary dark:hover:bg-zen-secondary'
                                >
                                    Continue <ArrowRight className='w-4 h-4' />
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className='flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zen-primary dark:hover:bg-zen-secondary'
                                >
                                    {loading ? (
                                        <span className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                                    ) : (
                                        <><Send className='w-4 h-4' /> Send Transfer</>
                                    )}
                                </button>
                            )}
                        </div>

                    </div>
                </div>

                {/* ── Right Side Panel (desktop only) ── */}
                <div className='hidden xl:block space-y-4'>

                    {/* Live Summary */}
                    <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] dark:border-zen-border dark:bg-zen-card'>
                        <p className='text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-zen-muted'>Transfer review</p>
                        <h3 className='mt-1 text-base font-semibold text-zen-light-text dark:text-zen-text'>Live summary</h3>
                        <div className='my-4 border-t border-slate-100 dark:border-zen-border' />
                        <div className='space-y-3'>
                            {[
                                { label: 'To', value: form.beneficiaryName || '—' },
                                { label: 'Account', value: form.accountNumber ? `****${form.accountNumber.slice(-4)}` : '—' },
                                { label: 'Bank', value: form.bankName || '—' },
                                { label: 'Amount', value: form.amount ? `$${parseFloat(form.amount).toFixed(2)}` : '—' },
                                { label: 'Fee', value: '$0.00' },
                            ].map(({ label, value }) => (
                                <div key={label} className='flex justify-between text-sm'>
                                    <span className='text-zen-light-muted dark:text-zen-muted'>{label}</span>
                                    <span className='text-zen-light-text dark:text-zen-text font-medium'>{value}</span>
                                </div>
                            ))}
                            <div className='border-t border-gray-200 dark:border-white/10 pt-3 flex justify-between'>
                                <span className='text-zen-light-text dark:text-zen-text font-bold text-sm'>Total</span>
                                <span className='text-zen-primary font-bold text-base'>
                                    {form.amount ? `$${parseFloat(form.amount).toFixed(2)}` : '$0.00'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Beneficiaries */}
                    <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] dark:border-zen-border dark:bg-zen-card'>
                        <h3 className='text-zen-light-text dark:text-zen-text font-semibold mb-4 text-sm'>Recent Beneficiaries</h3>
                        <div className='space-y-3'>
                            {recentBeneficiaries.map(b => (
                                <button
                                    key={b.name}
                                    type='button'
                                    onClick={() => { fillBeneficiary(b); setStep(1) }}
                                    className='group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-white/5'
                                >
                                    <div className={`${b.color} w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                        {b.initials}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-zen-light-text dark:text-zen-text text-sm font-medium truncate'>{b.name}</p>
                                        <p className='text-zen-light-muted dark:text-zen-muted text-xs'>{b.account}</p>
                                    </div>
                                    <Send className='w-3.5 h-3.5 text-zen-light-muted dark:text-zen-muted opacity-0 group-hover:opacity-100 transition shrink-0' />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Security note */}
                    <div className='flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-800/30 dark:bg-emerald-900/10'>
                        <ShieldCheck className='w-4 h-4 text-green-500 mt-0.5 shrink-0' />
                        <p className='text-xs text-green-700 dark:text-green-400 leading-relaxed'>
                            All transfers are protected with bank-grade encryption and require PIN verification before processing.
                        </p>
                    </div>
                </div>

            </div>


            </div>
        </div>
    )
}

export default LocalTransfer
