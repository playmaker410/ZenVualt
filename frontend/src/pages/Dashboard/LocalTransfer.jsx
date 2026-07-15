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
            <div className='space-y-6'>
                <div className='flex items-center justify-between px-4'>
                    <div className='flex items-center gap-2 text-zen-light-muted dark:text-zen-muted text-sm'>
                        <CalendarDays size={16} /><span>{date}</span>
                    </div>
                    <ThemeToggleButton theme={theme} setTheme={setTheme} />
                </div>

                <div className='max-w-md mx-auto'>
                    <div className='bg-white dark:bg-zen-card border border-gray-200 dark:border-white/10 rounded-2xl p-10 flex flex-col items-center text-center gap-4'>
                        <div className='bg-green-100 dark:bg-green-900/30 rounded-full p-5'>
                            <CheckCircle2 className='w-12 h-12 text-green-500' />
                        </div>
                        <h2 className='text-xl font-bold text-zen-light-text dark:text-zen-text'>Transfer Successful!</h2>
                        <p className='text-zen-light-muted dark:text-zen-muted text-sm'>
                            You sent <span className='text-zen-primary font-bold'>${parseFloat(form.amount).toFixed(2)}</span> to <span className='font-semibold text-zen-light-text dark:text-zen-text'>{form.beneficiaryName}</span>
                        </p>

                        <div className='w-full bg-gray-50 dark:bg-zen-bg rounded-xl p-4 space-y-2.5 mt-2'>
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
                            className='w-full py-3 rounded-xl bg-zen-primary hover:bg-zen-secondary text-white font-bold text-sm transition mt-2'
                        >
                            Make Another Transfer
                        </button>
                    </div>
                </div>

            </div>
        )
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

            {/* ── Page heading ── */}
            <div>
                <h1 className='text-2xl font-bold text-zen-light-text dark:text-zen-text'>Local Transfer</h1>
                <p className='text-sm text-zen-light-muted dark:text-zen-muted mt-0.5'>
                    <span className='hover:underline cursor-pointer'>Dashboard</span>
                    <span className='mx-2'>›</span>
                    <span>Local Transfer</span>
                </p>
            </div>

            <div className='grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6'>

                {/* ── Main Form Card ── */}
                <div className='bg-white dark:bg-zen-card border border-gray-200 dark:border-white/10 rounded-2xl'>

                    {/* Card Header */}
                    <div className='flex items-center gap-3 p-5 border-b border-gray-200 dark:border-white/10'>
                        <div className='bg-zen-primary/10 dark:bg-[#0f1d4a] border border-zen-primary/20 rounded-xl p-2.5'>
                            <ArrowRightLeft className='w-5 h-5 text-zen-primary' />
                        </div>
                        <div>
                            <h3 className='text-zen-light-text dark:text-zen-text font-semibold'>Transfer Details</h3>
                            <p className='text-xs text-zen-light-muted dark:text-zen-muted'>Step {step} of {steps.length} — {steps[step - 1].label}</p>
                        </div>
                    </div>

                    {/* ── Step Progress ── */}
                    <div className='flex items-center px-6 pt-6 mb-2'>
                        {steps.map((s, i) => (
                            <div key={s.id} className='flex items-center flex-1 last:flex-none'>
                                <div className='flex flex-col items-center gap-1'>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${step > s.id ? 'bg-zen-primary border-zen-primary text-white' : step === s.id ? 'border-zen-primary text-zen-primary' : 'border-gray-200 dark:border-zen-border text-zen-light-muted dark:text-zen-muted'}`}>
                                        {step > s.id ? <ShieldCheck className='w-4 h-4' /> : s.id}
                                    </div>
                                    <span className={`text-[10px] font-medium hidden sm:block whitespace-nowrap ${step >= s.id ? 'text-zen-light-text dark:text-zen-text' : 'text-zen-light-muted dark:text-zen-muted'}`}>{s.label}</span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${step > s.id ? 'bg-zen-primary' : 'bg-gray-200 dark:bg-zen-border'}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className='p-6 space-y-5'>

                        {/* ── STEP 1: Beneficiary ── */}
                        {step === 1 && (
                            <>
                                {/* Recent Beneficiaries quick-fill */}
                                <div>
                                    <p className='text-xs font-semibold text-zen-light-muted dark:text-zen-muted uppercase tracking-wider mb-2'>Recent</p>
                                    <div className='flex gap-3 overflow-x-auto pb-1'>
                                        {recentBeneficiaries.map(b => (
                                            <button
                                                key={b.name}
                                                type='button'
                                                onClick={() => fillBeneficiary(b)}
                                                className='flex flex-col items-center gap-1.5 shrink-0 group'
                                            >
                                                <div className={`${b.color} w-11 h-11 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-transparent group-hover:ring-zen-primary transition`}>
                                                    {b.initials}
                                                </div>
                                                <span className='text-[10px] text-zen-light-muted dark:text-zen-muted w-14 text-center truncate'>{b.name.split(' ')[0]}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className='border-t border-gray-100 dark:border-white/5 pt-4 space-y-4'>
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
                                                className='w-full pl-10 pr-4 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition'
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
                                                className='w-full pl-10 pr-4 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition font-mono tracking-wider'
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
                                                className='w-full pl-10 pr-4 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition'
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
                                <div className='flex items-center gap-3 bg-blue-50 dark:bg-zen-bg rounded-xl px-4 py-3'>
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
                                            className='w-full pl-10 pr-4 py-4 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-xl font-bold focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition font-mono'
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
                                            className='w-full pl-10 pr-4 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-sm focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition resize-none'
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
                                    <div className='bg-gray-50 dark:bg-zen-bg rounded-xl p-4 space-y-3'>
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
                                            className='w-full pl-10 pr-10 py-3 rounded-xl bg-blue-50/80 dark:bg-zen-bg border border-blue-200 dark:border-zen-border text-zen-light-text dark:text-zen-text placeholder:text-zen-light-muted dark:placeholder:text-zen-muted text-lg tracking-[0.5em] font-bold text-center focus:outline-none focus:ring-2 focus:ring-zen-primary/50 focus:border-zen-primary transition'
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
                            <div className='flex items-center gap-2 text-red-500 text-sm'>
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
                                    className='flex items-center justify-center gap-2 flex-1 py-3 rounded-xl border border-gray-200 dark:border-zen-border text-zen-light-text dark:text-zen-text font-bold text-sm hover:bg-gray-50 dark:hover:bg-zen-bg transition active:scale-[0.98]'
                                >
                                    <ArrowLeft className='w-4 h-4' /> Back
                                </button>
                            )}

                            {step < 3 ? (
                                <button
                                    type='button'
                                    onClick={handleNext}
                                    className='flex items-center justify-center gap-2 flex-1 py-3 rounded-xl bg-zen-primary hover:bg-zen-secondary text-white font-bold text-sm transition active:scale-[0.98]'
                                >
                                    Continue <ArrowRight className='w-4 h-4' />
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className='flex items-center justify-center gap-2 flex-1 py-3 rounded-xl bg-zen-primary hover:bg-zen-secondary text-white font-bold text-sm transition active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed'
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
                    <div className='bg-white dark:bg-zen-card border border-gray-200 dark:border-white/10 rounded-2xl p-5'>
                        <h3 className='text-zen-light-text dark:text-zen-text font-semibold mb-4 text-sm'>Live Summary</h3>
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
                    <div className='bg-white dark:bg-zen-card border border-gray-200 dark:border-white/10 rounded-2xl p-5'>
                        <h3 className='text-zen-light-text dark:text-zen-text font-semibold mb-4 text-sm'>Recent Beneficiaries</h3>
                        <div className='space-y-3'>
                            {recentBeneficiaries.map(b => (
                                <button
                                    key={b.name}
                                    type='button'
                                    onClick={() => { fillBeneficiary(b); setStep(1) }}
                                    className='w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-white/5 transition text-left group'
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
                    <div className='flex items-start gap-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-xl p-4'>
                        <ShieldCheck className='w-4 h-4 text-green-500 mt-0.5 shrink-0' />
                        <p className='text-xs text-green-700 dark:text-green-400 leading-relaxed'>
                            All transfers are protected with bank-grade encryption and require PIN verification before processing.
                        </p>
                    </div>
                </div>

            </div>


        </div>
    )
}

export default LocalTransfer