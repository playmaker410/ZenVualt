import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CreditCard,
  HandCoins,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import Footer from './Footer'

const services = [
  { key: 'business', label: 'Business', to: '/business', icon: BriefcaseBusiness },
  { key: 'personal', label: 'Personal', to: '/personal', icon: UserRound },
  { key: 'card', label: 'Cards', to: '/card', icon: CreditCard },
  { key: 'loan', label: 'Loans', to: '/loan', icon: HandCoins },
]

const ServicePage = ({
  serviceKey,
  eyebrow,
  title,
  highlightedTitle,
  description,
  image,
  imageAlt,
  imageClassName = 'object-contain',
  badge,
  highlights,
  benefits,
  steps,
}) => (
  <main className='overflow-hidden bg-[#f7f9fd] text-slate-950 dark:bg-[#050816] dark:text-white'>
    <section className='relative isolate'>
      <div className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_8%_10%,rgba(14,165,255,.14),transparent_34%),radial-gradient(circle_at_92%_35%,rgba(29,78,216,.10),transparent_35%)] dark:bg-[radial-gradient(circle_at_8%_10%,rgba(14,165,255,.12),transparent_34%),radial-gradient(circle_at_92%_35%,rgba(29,78,216,.18),transparent_35%)]' />

      <div className='mx-auto max-w-[1440px] px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pb-28 xl:px-12'>
        <nav aria-label='Breadcrumb' className='mb-10 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400'>
          <Link to='/' className='transition-colors hover:text-[#0b5cff]'>Home</Link>
          <ChevronRight size={14} />
          <span className='font-semibold text-slate-800 dark:text-slate-200'>{title}</span>
        </nav>

        <div className='grid items-center gap-12 lg:grid-cols-2 xl:gap-20'>
          <div className='max-w-2xl'>
            <div className='inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0b5cff] shadow-sm backdrop-blur dark:border-blue-400/20 dark:bg-blue-400/5 dark:text-blue-300'>
              <Sparkles size={14} /> {eyebrow}
            </div>
            <h1 className='mt-6 text-[clamp(2.7rem,6.5vw,5.6rem)] font-bold leading-[0.98] tracking-[-0.06em]'>
              {title} <span className='block bg-gradient-to-r from-[#0b5cff] via-[#0e9eff] to-[#18b8c9] bg-clip-text text-transparent'>{highlightedTitle}</span>
            </h1>
            <p className='mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 dark:text-slate-300'>{description}</p>
            <div className='mt-9 flex flex-col gap-3 sm:flex-row'>
              <Link to='/register' className='group inline-flex items-center justify-center gap-2 rounded-full bg-[#0b5cff] px-7 py-4 text-sm font-bold text-white shadow-[0_16px_40px_rgba(11,92,255,.26)] transition-all hover:-translate-y-0.5 hover:bg-[#084bd1]'>
                Get started <ArrowRight size={18} className='transition-transform group-hover:translate-x-1' />
              </Link>
              <Link to='/contact' className='inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/70 px-7 py-4 text-sm font-bold text-slate-800 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:text-[#0b5cff] dark:border-white/15 dark:bg-white/5 dark:text-white'>
                Talk to our team <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>

          <div className='relative mx-auto w-full max-w-[680px]'>
            <div className='absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-br from-blue-500/20 via-cyan-300/10 to-transparent blur-2xl' />
            <div className='relative min-h-[380px] overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-br from-white via-blue-50 to-[#e7f1ff] p-6 shadow-[0_35px_90px_rgba(15,23,42,.16)] sm:min-h-[480px] sm:rounded-[2.5rem] sm:p-10 dark:border-white/10 dark:bg-[linear-gradient(145deg,#0c1830,#081020)]'>
              <div className='absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(11,92,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(11,92,255,.07)_1px,transparent_1px)] [background-size:34px_34px]' />
              <img src={image} alt={imageAlt} className={`relative z-10 h-[330px] w-full sm:h-[410px] ${imageClassName}`} />
              <div className='absolute bottom-5 left-5 right-5 z-20 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-lg backdrop-blur-xl sm:bottom-7 sm:left-7 sm:right-auto sm:min-w-[265px] dark:border-white/10 dark:bg-[#07142e]/85'>
                <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'><ShieldCheck size={20} /></span>
                <div>
                  <p className='text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400'>Zenvault advantage</p>
                  <p className='mt-0.5 text-sm font-bold'>{badge}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-16 grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,.05)] md:grid-cols-3 dark:border-white/10 dark:bg-white/[.035]'>
          {highlights.map(({ icon: Icon, title: itemTitle, text }, index) => (
            <div key={itemTitle} className={`flex items-start gap-4 p-6 sm:p-7 ${index ? 'border-t border-slate-200 md:border-l md:border-t-0 dark:border-white/10' : ''}`}>
              <span className='grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#0b5cff] dark:bg-blue-400/10 dark:text-blue-300'><Icon size={21} /></span>
              <div><h2 className='font-bold'>{itemTitle}</h2><p className='mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400'>{text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className='border-y border-slate-200/80 bg-white dark:border-white/10 dark:bg-white/[.025]'>
      <div className='mx-auto grid max-w-[1440px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-28 xl:gap-24 xl:px-12'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.2em] text-[#0b5cff] dark:text-blue-300'>Designed around you</p>
          <h2 className='mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl'>More clarity. More control.</h2>
          <p className='mt-5 max-w-md leading-7 text-slate-600 dark:text-slate-400'>Useful financial tools should feel natural from the first tap. Everything is organized to help you act quickly and confidently.</p>
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          {benefits.map(({ icon: Icon, title: itemTitle, text }) => (
            <article key={itemTitle} className='rounded-3xl border border-slate-200 bg-[#f8faff] p-6 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_45px_rgba(11,92,255,.08)] dark:border-white/10 dark:bg-white/[.035] dark:hover:border-blue-400/25'>
              <span className='grid size-11 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950'><Icon size={20} /></span>
              <h3 className='mt-6 text-lg font-bold'>{itemTitle}</h3>
              <p className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400'>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className='mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28 xl:px-12'>
      <div className='grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-start xl:gap-20'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.2em] text-[#0b5cff] dark:text-blue-300'>Simple from the start</p>
          <h2 className='mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl'>Get going in three clear steps.</h2>
          <div className='mt-10 space-y-4'>
            {steps.map((step, index) => (
              <div key={step.title} className='flex gap-5 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-white/10 dark:bg-white/[.035]'>
                <span className='grid size-11 shrink-0 place-items-center rounded-full bg-[#0b5cff] text-sm font-bold text-white shadow-[0_8px_24px_rgba(11,92,255,.24)]'>{String(index + 1).padStart(2, '0')}</span>
                <div><h3 className='font-bold'>{step.title}</h3><p className='mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400'>{step.text}</p></div>
              </div>
            ))}
          </div>
        </div>

        <aside className='rounded-[2rem] bg-[#07142e] p-6 text-white sm:p-8'>
          <p className='text-xs font-bold uppercase tracking-[0.18em] text-cyan-300'>Explore Zenvault</p>
          <h2 className='mt-3 text-2xl font-bold'>Other services</h2>
          <div className='mt-7 space-y-2'>
            {services.map(({ key, label, to, icon: Icon }) => (
              <Link key={key} to={to} className={`group flex items-center justify-between rounded-2xl px-4 py-4 transition-colors ${key === serviceKey ? 'bg-white text-[#07142e]' : 'text-slate-200 hover:bg-white/8'}`}>
                <span className='flex items-center gap-3'><Icon size={19} /><span className='font-semibold'>{label}</span></span>
                {key === serviceKey ? <Check size={17} /> : <ArrowRight size={17} className='opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100' />}
              </Link>
            ))}
          </div>
          <div className='mt-8 rounded-2xl bg-gradient-to-br from-[#0b5cff] to-[#0788e8] p-5'>
            <p className='text-lg font-bold'>Need a hand choosing?</p>
            <p className='mt-2 text-sm leading-6 text-blue-50'>Our support team can help you find the right option.</p>
            <Link to='/contact' className='mt-5 inline-flex items-center gap-2 text-sm font-bold'>Contact us <ArrowUpRight size={16} /></Link>
          </div>
        </aside>
      </div>
    </section>

    <section className='px-4 pb-8 sm:px-6 lg:px-8 xl:px-12'>
      <div className='mx-auto max-w-[1344px] overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#0b5cff] to-[#0788e8] px-6 py-12 text-center text-white sm:px-12 sm:py-16'>
        <h2 className='mx-auto max-w-3xl text-3xl font-bold tracking-[-0.04em] sm:text-5xl'>A smarter way forward starts here.</h2>
        <p className='mx-auto mt-4 max-w-xl text-blue-50'>Create your account and put modern financial tools to work.</p>
        <Link to='/register' className='mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-[#0b5cff] shadow-xl transition-transform hover:-translate-y-0.5'>Open an account <ArrowRight size={17} /></Link>
      </div>
    </section>

    <div className='mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12'><Footer /></div>
  </main>
)

export default ServicePage
