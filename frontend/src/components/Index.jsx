import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  CreditCard,
  Globe2,
  HandCoins,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRound,
  WalletCards,
  Zap,
} from 'lucide-react'
import assets from '../assets/assets'
import Footer from './Footer'

const products = [
  {
    title: 'Personal banking',
    description: 'A clear, simple account for spending, saving, and moving money with confidence.',
    to: '/personal',
    icon: UserRound,
    accent: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
  },
  {
    title: 'Business banking',
    description: 'Smart cash-flow tools, team access, and payments designed for growing companies.',
    to: '/business',
    icon: BriefcaseBusiness,
    accent: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
  },
  {
    title: 'Cards',
    description: 'Secure virtual and physical cards with the control you need, wherever you go.',
    to: '/card',
    icon: CreditCard,
    accent: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
  },
  {
    title: 'Loans',
    description: 'Straightforward financing with clear terms and a simple digital application.',
    to: '/loan',
    icon: HandCoins,
    accent: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
  },
]

const trustPoints = [
  { icon: ShieldCheck, title: 'Protected by design', text: 'Multiple layers of account security' },
  { icon: Zap, title: 'Fast by default', text: 'Simple, responsive money movement' },
  { icon: Globe2, title: 'Ready to travel', text: 'Bank wherever life takes you' },
]

const Index = () => (
  <main className='overflow-hidden bg-[#f7f9fd] text-slate-950 dark:bg-[#050816] dark:text-white'>
    <section className='relative isolate'>
      <div className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-[760px] bg-[radial-gradient(circle_at_12%_10%,rgba(14,165,255,0.14),transparent_36%),radial-gradient(circle_at_90%_12%,rgba(29,78,216,0.12),transparent_34%)] dark:bg-[radial-gradient(circle_at_12%_10%,rgba(14,165,255,0.15),transparent_35%),radial-gradient(circle_at_88%_5%,rgba(29,78,216,0.23),transparent_36%)]' />

      <div className='mx-auto grid max-w-[1440px] items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24 xl:gap-20 xl:px-12'>
        <div className='relative z-10 max-w-2xl'>
          <div className='mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#0b5cff] shadow-sm backdrop-blur dark:border-blue-400/20 dark:bg-blue-400/5 dark:text-blue-300'>
            <Sparkles size={14} /> Banking, made brilliantly simple
          </div>

          <h1 className='max-w-[760px] text-[clamp(2.8rem,7vw,5.9rem)] font-bold leading-[0.95] tracking-[-0.06em]'>
            Money moves.
            <span className='mt-2 block bg-gradient-to-r from-[#0b5cff] via-[#0e9eff] to-[#18b8c9] bg-clip-text text-transparent'>Move with it.</span>
          </h1>

          <p className='mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-300'>
            One secure place to spend, save, borrow, and grow. Zenvault gives people and businesses modern financial tools without the complexity.
          </p>

          <div className='mt-9 flex flex-col gap-3 sm:flex-row'>
            <Link
              to='/register'
              className='group inline-flex items-center justify-center gap-2 rounded-full bg-[#0b5cff] px-7 py-4 text-sm font-bold text-white shadow-[0_16px_40px_rgba(11,92,255,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#084bd1]'
            >
              Open an account
              <ArrowRight size={18} className='transition-transform group-hover:translate-x-1' />
            </Link>
            <Link
              to='/personal'
              className='inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/70 px-7 py-4 text-sm font-bold text-slate-800 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:text-[#0b5cff] dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-blue-400/40'
            >
              Explore banking <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className='mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600 dark:text-slate-300'>
            {['Quick digital setup', 'Clear, simple controls', 'Support when you need it'].map((item) => (
              <span key={item} className='flex items-center gap-2'>
                <span className='grid size-5 place-items-center rounded-full bg-emerald-500/12 text-emerald-600 dark:text-emerald-300'><Check size={13} strokeWidth={3} /></span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className='relative mx-auto w-full max-w-[720px]'>
          <div className='absolute -inset-5 -z-10 rounded-[3rem] bg-gradient-to-br from-blue-500/20 via-cyan-300/10 to-transparent blur-2xl' />
          <div className='relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-900 shadow-[0_35px_90px_rgba(15,23,42,0.22)] sm:rounded-[2.5rem] dark:border-white/10'>
            <img
              src={assets.zenvaultHero}
              alt='Entrepreneur confidently managing her finances on a phone'
              className='aspect-[4/3] w-full object-cover object-[65%_center] sm:aspect-[3/2]'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-[#06122e]/75 via-transparent to-transparent' />

            <div className='absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/15 bg-[#071329]/75 p-4 text-white shadow-xl backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-auto sm:min-w-[280px] sm:p-5'>
              <div className='flex items-center gap-3'>
                <span className='grid size-11 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300'><ShieldCheck size={23} /></span>
                <div>
                  <p className='text-xs text-slate-300'>Account protection</p>
                  <p className='mt-0.5 font-bold'>Security is always on</p>
                </div>
              </div>
              <span className='ml-3 size-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,0.12)]' />
            </div>
          </div>

          <div className='absolute -right-3 top-7 hidden rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur sm:block dark:border-white/10 dark:bg-[#0d1528]/90'>
            <div className='flex items-center gap-3'>
              <span className='grid size-9 place-items-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-300'><WalletCards size={19} /></span>
              <div>
                <p className='text-[11px] text-slate-500 dark:text-slate-400'>Everything together</p>
                <p className='text-sm font-bold'>One simple app</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12'>
        <div className='grid overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.06)] md:grid-cols-3 dark:border-white/10 dark:bg-white/[0.035]'>
          {trustPoints.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className={`flex items-center gap-4 p-6 sm:p-7 ${index > 0 ? 'border-t border-slate-200/80 md:border-l md:border-t-0 dark:border-white/10' : ''}`}>
              <span className='grid size-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#0b5cff] dark:bg-blue-400/10 dark:text-blue-300'><Icon size={23} /></span>
              <div>
                <h2 className='font-bold'>{title}</h2>
                <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className='mx-auto max-w-[1440px] px-4 py-24 sm:px-6 lg:px-8 lg:py-32 xl:px-12'>
      <div className='flex flex-col justify-between gap-5 md:flex-row md:items-end'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.2em] text-[#0b5cff] dark:text-blue-300'>Made for real life</p>
          <h2 className='mt-4 max-w-2xl text-3xl font-bold tracking-[-0.04em] sm:text-5xl'>The right account for every next move.</h2>
        </div>
        <p className='max-w-md text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400'>From your first account to your next business milestone, choose tools that fit the way you live and work.</p>
      </div>

      <div className='mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {products.map(({ title, description, to, icon: Icon, accent }) => (
          <Link
            key={title}
            to={to}
            className='group flex min-h-[270px] flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-[0_24px_60px_rgba(11,92,255,0.11)] dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-blue-400/30'
          >
            <span className={`grid size-12 place-items-center rounded-2xl ${accent}`}><Icon size={23} /></span>
            <h3 className='mt-8 text-xl font-bold tracking-[-0.02em]'>{title}</h3>
            <p className='mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400'>{description}</p>
            <span className='mt-auto inline-flex items-center gap-2 pt-7 text-sm font-bold text-[#0b5cff] dark:text-blue-300'>Explore <ArrowRight size={16} className='transition-transform group-hover:translate-x-1' /></span>
          </Link>
        ))}
      </div>
    </section>

    <section className='mx-auto max-w-[1440px] px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32 xl:px-12'>
      <div className='grid overflow-hidden rounded-[2rem] bg-[#07142e] text-white lg:grid-cols-2 lg:rounded-[2.5rem]'>
        <div className='flex flex-col justify-center p-7 sm:p-12 lg:p-16'>
          <p className='text-xs font-bold uppercase tracking-[0.2em] text-cyan-300'>Control in your hands</p>
          <h2 className='mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl'>A card experience that feels effortless.</h2>
          <p className='mt-6 max-w-lg leading-7 text-slate-300'>Track spending, stay informed, and manage your card with controls designed to be understood at a glance.</p>
          <div className='mt-8 grid gap-4 sm:grid-cols-2'>
            {[
              { icon: LockKeyhole, text: 'Freeze and unfreeze controls' },
              { icon: ShieldCheck, text: 'Real-time security alerts' },
              { icon: CreditCard, text: 'Clear card management' },
              { icon: Globe2, text: 'Built for global use' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className='flex items-center gap-3 text-sm font-semibold text-slate-200'>
                <span className='grid size-9 shrink-0 place-items-center rounded-xl bg-white/8 text-cyan-300'><Icon size={17} /></span>
                {text}
              </div>
            ))}
          </div>
          <Link to='/card' className='mt-9 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#07142e] transition-transform hover:-translate-y-0.5'>Discover cards <ArrowRight size={17} /></Link>
        </div>
        <div className='relative min-h-[360px] overflow-hidden bg-[radial-gradient(circle_at_70%_30%,rgba(14,165,255,0.35),transparent_38%)] p-8 sm:p-12'>
          <div className='absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:40px_40px]' />
          <img src={assets.compressed} alt='Zenvault card with digital banking controls' className='relative z-10 h-full w-full object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.35)] transition-transform duration-700 hover:scale-105' />
        </div>
      </div>
    </section>

    <section className='px-4 pb-8 sm:px-6 lg:px-8 xl:px-12'>
      <div className='mx-auto max-w-[1344px] overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#0b5cff] to-[#0788e8] px-6 py-12 text-center text-white shadow-[0_30px_80px_rgba(11,92,255,0.2)] sm:px-12 sm:py-16'>
        <h2 className='mx-auto max-w-3xl text-3xl font-bold tracking-[-0.04em] sm:text-5xl'>Ready for banking that keeps up?</h2>
        <p className='mx-auto mt-4 max-w-xl text-blue-50'>Open your Zenvault account and take your next financial step with clarity.</p>
        <Link to='/register' className='mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-[#0b5cff] shadow-xl transition-transform hover:-translate-y-0.5'>Get started today <ArrowRight size={17} /></Link>
      </div>
    </section>

    <div className='mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12'>
      <Footer />
    </div>
  </main>
)

export default Index
