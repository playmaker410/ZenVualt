import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import Dashboard_footer from './Dashboard_footer'
import BottomNav from './BottomNav'

const Dashboard = ({ theme, accountno, setTheme }) => {
    return (
        <div className='flex min-h-screen bg-zen-light-bg dark:bg-zen-bg'>
            <Sidebar theme={theme} />
            <div className='flex flex-1 min-h-0'>
                <main className='flex-1 overflow-hidden flex flex-col'>
                    <div className='flex-1 overflow-y-auto pb-16 xl:pb-0'>
                        <Outlet context={{ theme, setTheme, accountno }} />
                    </div>
                    <div className='hidden xl:block border-t border-zen-light-border dark:border-zen-border px-6 py-3 bg-zen-light-bg dark:bg-zen-bg shrink-0'>
                        <Dashboard_footer />
                    </div>
                </main>
            </div>
            <BottomNav />
        </div>
    )
}

export default Dashboard