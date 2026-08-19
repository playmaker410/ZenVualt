import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import {
    Check, ChevronRight, Copy, Eye, EyeOff, KeyRound, Laptop,
    LockKeyhole, LogOut, Mail, Monitor, Moon, ShieldCheck, Smartphone,
    Sun, UserRound, X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const SettingsCard = ({ icon: Icon, title, description, children }) => (
    <section className='overflow-hidden rounded-2xl border border-zen-light-border bg-zen-light-card shadow-sm dark:border-zen-border dark:bg-zen-card'>
        <div className='flex gap-3 border-b border-zen-light-border p-5 dark:border-zen-border'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zen-primary/10 text-zen-primary'>
                <Icon size={19} />
            </div>
            <div>
                <h2 className='font-semibold text-zen-light-text dark:text-zen-text'>{title}</h2>
                <p className='mt-0.5 text-sm text-zen-light-muted dark:text-zen-muted'>{description}</p>
            </div>
        </div>
        <div className='p-5'>{children}</div>
    </section>
)

const Setting = () => {
    const { theme, setTheme, user } = useOutletContext()
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [showAccountNumber, setShowAccountNumber] = useState(false)
    const [copied, setCopied] = useState(false)
    const [notice, setNotice] = useState('')
    const [showPINDialog, setShowPINDialog] = useState(false)
    const [pinForm, setPinForm] = useState({ currentPIN: '', newPIN: '', confirmPIN: '' })
    const [pinError, setPinError] = useState('')
    const [isChangingPIN, setIsChangingPIN] = useState(false)

    const copyAccountNumber = async () => {
        if (!user?.account_number) return
        try {
            await navigator.clipboard.writeText(user.account_number)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1800)
        } catch {
            setNotice('Unable to copy your account number. Please copy it manually.')
        }
    }

    const handleLogout = async () => {
        await logout()
        navigate('/login', { replace: true })
    }

    const closePINDialog = () => {
        if (isChangingPIN) return
        setShowPINDialog(false)
        setPinError('')
        setPinForm({ currentPIN: '', newPIN: '', confirmPIN: '' })
    }

    const handleChangePIN = async (event) => {
        event.preventDefault()
        setPinError('')

        if (!/^\d{4}$/.test(pinForm.currentPIN) || !/^\d{4}$/.test(pinForm.newPIN)) {
            setPinError('Enter a 4-digit current PIN and a 4-digit new PIN.')
            return
        }
        if (pinForm.newPIN !== pinForm.confirmPIN) {
            setPinError('The new PIN entries do not match.')
            return
        }
        if (pinForm.currentPIN === pinForm.newPIN) {
            setPinError('Your new PIN must be different from your current PIN.')
            return
        }

        setIsChangingPIN(true)
        try {
            const response = await fetch('http://localhost:8080/api/change-pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ current_pin: pinForm.currentPIN, new_pin: pinForm.newPIN }),
            })
            const data = await response.json().catch(() => ({}))
            if (!response.ok) throw new Error(data.error || 'Unable to change your PIN.')

            setShowPINDialog(false)
            setPinForm({ currentPIN: '', newPIN: '', confirmPIN: '' })
            setNotice(data.message || 'Bank PIN changed successfully.')
        } catch (error) {
            setPinError(error.message || 'Unable to change your PIN.')
        } finally {
            setIsChangingPIN(false)
        }
    }

    const unavailable = (feature) => setNotice(`${feature} needs a secure server endpoint before it can be changed here.`)
    const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase() || '--'

    return (
        <div className='min-h-full bg-zen-light-bg p-4 text-zen-light-text dark:bg-zen-bg dark:text-zen-text sm:p-6'>
            <div className='mx-auto max-w-5xl'>
                <header className='mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
                    <div>
                        <p className='text-sm font-medium text-zen-primary'>Account centre</p>
                        <h1 className='mt-1 text-2xl font-bold'>Settings & security</h1>
                        <p className='mt-1 text-sm text-zen-light-muted dark:text-zen-muted'>Manage how you access and receive updates from your account.</p>
                    </div>
                    <div className='flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400'>
                        <ShieldCheck size={17} /> Your session is protected
                    </div>
                </header>

                {notice && (
                    <div className='mb-5 flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300'>
                        <span>{notice}</span>
                        <button type='button' onClick={() => setNotice('')} aria-label='Dismiss message' className='font-bold'>×</button>
                    </div>
                )}

                <div className='grid gap-5 lg:grid-cols-2'>
                    <SettingsCard icon={UserRound} title='Personal details' description='Your identity details are managed securely.'>
                        <div className='flex items-center gap-3'>
                            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-zen-primary text-sm font-bold text-white'>{initials}</div>
                            <div className='min-w-0'>
                                <p className='truncate font-semibold'>{user ? `${user.first_name} ${user.last_name}` : 'Loading account...'}</p>
                                <p className='truncate text-sm text-zen-light-muted dark:text-zen-muted'>{user?.email ?? '—'}</p>
                            </div>
                        </div>
                        <div className='mt-5 grid gap-3 sm:grid-cols-2'>
                            <div className='rounded-xl bg-zen-light-bg p-3 dark:bg-zen-bg'>
                                <p className='text-xs text-zen-light-muted dark:text-zen-muted'>Email address</p>
                                <p className='mt-1 truncate text-sm font-medium'>{user?.email ?? '—'}</p>
                            </div>
                            <div className='rounded-xl bg-zen-light-bg p-3 dark:bg-zen-bg'>
                                <p className='text-xs text-zen-light-muted dark:text-zen-muted'>Account number</p>
                                <div className='mt-1 flex items-center gap-2'>
                                    <span className='min-w-0 truncate font-mono text-sm font-medium'>{showAccountNumber ? user?.account_number ?? '—' : '•••• •••• ••••'}</span>
                                    <button type='button' onClick={() => setShowAccountNumber(value => !value)} aria-label={showAccountNumber ? 'Hide account number' : 'Show account number'} className='text-zen-primary'>
                                        {showAccountNumber ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    {showAccountNumber && user?.account_number && <button type='button' onClick={copyAccountNumber} aria-label='Copy account number' className='text-zen-primary'>{copied ? <Check size={16} /> : <Copy size={16} />}</button>}
                                </div>
                            </div>
                        </div>
                        <button type='button' onClick={() => unavailable('Editing personal details')} className='mt-4 flex items-center gap-1 text-sm font-medium text-zen-primary hover:underline'>Request a details update <ChevronRight size={15} /></button>
                    </SettingsCard>

                    <SettingsCard icon={Monitor} title='Appearance' description='Choose the display mode for this device.'>
                        <div className='grid grid-cols-2 gap-3'>
                            <button type='button' onClick={() => setTheme('light')} className={`rounded-xl border p-4 text-left transition ${theme === 'light' ? 'border-zen-primary bg-zen-primary/10 ring-1 ring-zen-primary' : 'border-zen-light-border hover:border-zen-primary/50 dark:border-zen-border'}`}>
                                <Sun size={19} className='text-amber-500' />
                                <p className='mt-3 text-sm font-semibold'>Light</p>
                                <p className='mt-0.5 text-xs text-zen-light-muted dark:text-zen-muted'>Use a bright interface</p>
                            </button>
                            <button type='button' onClick={() => setTheme('dark')} className={`rounded-xl border p-4 text-left transition ${theme === 'dark' ? 'border-zen-primary bg-zen-primary/10 ring-1 ring-zen-primary' : 'border-zen-light-border hover:border-zen-primary/50 dark:border-zen-border'}`}>
                                <Moon size={19} className='text-indigo-400' />
                                <p className='mt-3 text-sm font-semibold'>Dark</p>
                                <p className='mt-0.5 text-xs text-zen-light-muted dark:text-zen-muted'>Reduce brightness at night</p>
                            </button>
                        </div>
                    </SettingsCard>

                    <SettingsCard icon={LockKeyhole} title='Security' description='Keep your account and personal data secure.'>
                        <div className='space-y-2'>
                            <button type='button' onClick={() => setShowPINDialog(true)} className='flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-zen-light-bg dark:hover:bg-zen-bg'>
                                <LockKeyhole size={18} className='text-zen-primary' /><span className='flex-1'><span className='block text-sm font-medium'>Change bank PIN</span><span className='text-xs text-zen-light-muted dark:text-zen-muted'>Confirm your current PIN before choosing a new 4-digit PIN.</span></span><ChevronRight size={17} className='text-zen-light-muted dark:text-zen-muted' />
                            </button>
                            <button type='button' onClick={() => unavailable('Changing your password')} className='flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-zen-light-bg dark:hover:bg-zen-bg'>
                                <KeyRound size={18} className='text-zen-primary' /><span className='flex-1'><span className='block text-sm font-medium'>Change password</span><span className='text-xs text-zen-light-muted dark:text-zen-muted'>Use a unique password you do not reuse elsewhere.</span></span><ChevronRight size={17} className='text-zen-light-muted dark:text-zen-muted' />
                            </button>
                            <button type='button' onClick={() => unavailable('Two-step verification')} className='flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-zen-light-bg dark:hover:bg-zen-bg'>
                                <Smartphone size={18} className='text-zen-primary' /><span className='flex-1'><span className='block text-sm font-medium'>Two-step verification</span><span className='text-xs text-zen-light-muted dark:text-zen-muted'>Add another layer of protection to sign-in.</span></span><ChevronRight size={17} className='text-zen-light-muted dark:text-zen-muted' />
                            </button>
                            <div className='flex items-center gap-3 rounded-xl p-3'>
                                <Laptop size={18} className='text-green-600 dark:text-green-400' /><span><span className='block text-sm font-medium'>Current session</span><span className='text-xs text-zen-light-muted dark:text-zen-muted'>This browser is currently signed in.</span></span>
                            </div>
                        </div>
                    </SettingsCard>
                </div>

                <section className='mt-5 rounded-2xl border border-red-200 bg-red-50/50 p-5 dark:border-red-900/40 dark:bg-red-950/10'>
                    <h2 className='font-semibold text-red-800 dark:text-red-300'>Session controls</h2>
                    <p className='mt-1 text-sm text-red-700/80 dark:text-red-300/80'>If you are using a shared or public device, sign out when you are finished.</p>
                    <button type='button' onClick={handleLogout} className='mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700'><LogOut size={16} /> Sign out of this device</button>
                </section>

                <p className='mt-5 flex items-center gap-2 text-xs text-zen-light-muted dark:text-zen-muted'><Mail size={14} /> For suspected fraud or an account access problem, contact support immediately.</p>
            </div>

            {showPINDialog && (
                <div className='fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-4 sm:items-center' role='dialog' aria-modal='true' aria-labelledby='change-pin-title'>
                    <form onSubmit={handleChangePIN} className='w-full max-w-md rounded-2xl bg-zen-light-card p-6 shadow-2xl dark:bg-zen-card'>
                        <div className='flex items-start justify-between gap-4'>
                            <div><h2 id='change-pin-title' className='text-lg font-bold'>Change bank PIN</h2><p className='mt-1 text-sm text-zen-light-muted dark:text-zen-muted'>For your protection, enter your current PIN first.</p></div>
                            <button type='button' onClick={closePINDialog} disabled={isChangingPIN} aria-label='Close change PIN dialog' className='rounded-lg p-1 text-zen-light-muted hover:bg-zen-light-bg dark:text-zen-muted dark:hover:bg-zen-bg'><X size={20} /></button>
                        </div>
                        <div className='mt-5 space-y-4'>
                            {[
                                ['currentPIN', 'Current PIN'],
                                ['newPIN', 'New 4-digit PIN'],
                                ['confirmPIN', 'Confirm new PIN'],
                            ].map(([name, label]) => (
                                <label key={name} className='block text-sm font-medium'>{label}
                                    <input required inputMode='numeric' autoComplete={name === 'currentPIN' ? 'current-password' : 'new-password'} pattern='[0-9]{4}' maxLength='4' type='password' value={pinForm[name]} onChange={(event) => setPinForm({ ...pinForm, [name]: event.target.value.replace(/\D/g, '') })} className='mt-1.5 w-full rounded-xl border border-zen-light-border bg-zen-light-bg px-3 py-3 text-center font-mono tracking-[0.5em] outline-none transition focus:border-zen-primary focus:ring-2 focus:ring-zen-primary/20 dark:border-zen-border dark:bg-zen-bg' />
                                </label>
                            ))}
                        </div>
                        {pinError && <p className='mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300'>{pinError}</p>}
                        <div className='mt-6 flex gap-3'>
                            <button type='button' onClick={closePINDialog} disabled={isChangingPIN} className='flex-1 rounded-xl border border-zen-light-border py-2.5 text-sm font-semibold hover:bg-zen-light-bg disabled:opacity-60 dark:border-zen-border dark:hover:bg-zen-bg'>Cancel</button>
                            <button type='submit' disabled={isChangingPIN} className='flex-1 rounded-xl bg-zen-primary py-2.5 text-sm font-semibold text-white hover:bg-zen-secondary disabled:opacity-60'>{isChangingPIN ? 'Changing…' : 'Change PIN'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Setting
