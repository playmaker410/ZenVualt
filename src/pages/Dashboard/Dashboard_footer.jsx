import React from 'react'

const Dashboard_footer = () => {
    return (
        <div>

            {/* Footer */}
            <div className='border-t border-zen-light-border dark:border-zen-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zen-light-muted dark:text-zen-muted'>
                <p>© {new Date().getFullYear()} Zenvault. All rights reserved.</p>
                <div className='flex gap-6'>
                    <a href="#" className='hover:text-zen-primary transition-colors'>Privacy Policy</a>
                    <a href="#" className='hover:text-zen-primary transition-colors'>Terms of Service</a>
                    <a href="#" className='hover:text-zen-primary transition-colors'>Cookie Policy</a>
                </div>
            </div>
        </div>
    )
}

export default Dashboard_footer