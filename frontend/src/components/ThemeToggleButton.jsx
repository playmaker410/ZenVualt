import { Moon, Sun } from 'lucide-react'

const ThemeToggleButton = ({ theme, setTheme }) => {
  const isDark = theme === 'dark'

  return (
    <button
      type='button'
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className='grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:text-zen-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zen-primary dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-blue-400/40'
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

export default ThemeToggleButton
