import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CreditCard,
  HandCoins,
  Headphones,
  Home,
  UserRound,
} from 'lucide-react'
import assets from '../assets/assets'
import ThemeToggleButton from './ThemeToggleButton'

const navItems = [
  { label: 'Home', to: '/', icon: Home, end: true },
  { label: 'Business', to: '/business', icon: BriefcaseBusiness },
  { label: 'Personal', to: '/personal', icon: UserRound },
  { label: 'Cards', to: '/card', icon: CreditCard },
  { label: 'Loans', to: '/loan', icon: HandCoins },
  { label: 'Contact', to: '/contact', icon: Headphones },
]

const Navbar = ({ theme, setTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isMenuOpen])

  const navLinkClass = ({ isActive }) =>
    `relative py-2 text-sm font-semibold transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-zen-primary after:transition-transform after:duration-300 ${isActive
      ? 'text-zen-primary after:scale-x-100'
      : 'text-slate-600 after:scale-x-0 hover:text-slate-950 hover:after:scale-x-100 dark:text-slate-300 dark:hover:text-white'
    }`

  return (
    <header className='sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#070b18]/85'>
      <div className='mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-12'>
        <Link to='/' onClick={() => setIsMenuOpen(false)} aria-label='Zenvault home' className='relative z-[70] shrink-0'>
          <img
            src={theme === 'dark' ? assets.darkbglogo : assets.lglogo}
            className='h-11 w-32 object-contain object-left sm:w-36'
            alt='Zenvault'
          />
        </Link>

        <nav aria-label='Main navigation' className='hidden items-center gap-7 lg:flex'>
          {navItems.map(({ label, to, end }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClass}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className='hidden items-center gap-2.5 lg:flex'>
          <ThemeToggleButton theme={theme} setTheme={setTheme} />
          <Link
            to='/login'
            className='rounded-full px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10'
          >
            Log in
          </Link>
          <Link
            to='/register'
            className='inline-flex items-center gap-2 rounded-full bg-[#0b5cff] px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(11,92,255,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#084bd1]'
          >
            Open an account <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className='relative z-[70] flex items-center gap-2 lg:hidden'>
          <ThemeToggleButton theme={theme} setTheme={setTheme} />
          <button
            type='button'
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls='mobile-navigation'
            onClick={() => setIsMenuOpen((open) => !open)}
            className='flex size-11 flex-col items-center justify-center gap-[5px] rounded-full border border-slate-200 bg-white text-slate-950 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zen-primary dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'
          >
            <span className={`h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${isMenuOpen ? 'scale-x-0 opacity-0' : ''}`} />
            <span className={`h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-out ${isMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      <button
        type='button'
        aria-label='Close navigation menu'
        tabIndex={isMenuOpen ? 0 : -1}
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-x-0 bottom-0 top-[74px] z-[55] bg-slate-950/45 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
      />

      <aside
        id='mobile-navigation'
        aria-hidden={!isMenuOpen}
        className={`fixed right-0 top-[74px] z-[60] flex h-[calc(100dvh-74px)] w-full max-w-[390px] flex-col overflow-y-auto border-l border-slate-200 bg-white px-5 pb-6 pt-6 shadow-[-24px_0_80px_rgba(15,23,42,0.18)] transition-transform duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] dark:border-white/10 dark:bg-[#080d1d] lg:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className='mb-5'>
          <p className='text-xs font-bold uppercase tracking-[0.18em] text-zen-primary'>Menu</p>
          <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>Banking built around you</p>
        </div>

        <nav aria-label='Mobile navigation' className='flex flex-col gap-1'>
          {navItems.map(({ label, to, icon: Icon, end }, index) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setIsMenuOpen(false)}
              tabIndex={isMenuOpen ? 0 : -1}
              style={{ transitionDelay: isMenuOpen ? `${80 + index * 35}ms` : '0ms' }}
              className={({ isActive }) => `group flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-300 ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'
                } ${isActive ? 'bg-blue-50 text-[#0b5cff] dark:bg-blue-500/10' : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5'}`}
            >
              <span className='flex items-center gap-3.5'>
                <span className='grid size-9 place-items-center rounded-xl border border-slate-200 bg-white shadow-sm group-hover:border-blue-200 dark:border-white/10 dark:bg-white/5'>
                  <Icon size={18} />
                </span>
                <span className='font-semibold'>{label}</span>
              </span>
              <ArrowUpRight size={17} className='opacity-40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100' />
            </NavLink>
          ))}
        </nav>

        <div className='mt-auto border-t border-slate-200 pt-5 dark:border-white/10'>
          <div className='grid grid-cols-2 gap-3'>
            <Link
              to='/login'
              onClick={() => setIsMenuOpen(false)}
              tabIndex={isMenuOpen ? 0 : -1}
              className='rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-800 dark:border-white/15 dark:text-white'
            >

              Log in
            </Link>
            <Link
              to='/register'
              onClick={() => setIsMenuOpen(false)}
              tabIndex={isMenuOpen ? 0 : -1}
              className='rounded-xl bg-[#0b5cff] px-4 py-3 text-center text-sm font-bold text-white shadow-[0_10px_30px_rgba(11,92,255,0.25)]'
            >
              Get started
            </Link>
          </div>
          <p className='mt-5 text-center text-xs text-slate-400'>Secure digital banking · 24/7 support</p>
        </div>
      </aside>
    </header>
  )
}

export default Navbar
