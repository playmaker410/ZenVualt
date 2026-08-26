import assets from '../assets/assets'


const Footer = () => {
    return (
        <div>


            <footer className='pt-16 pb-8 border-t border-zen-light-border dark:border-zen-border mt-10'>

                {/* Top grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10 pb-12'>

                    {/* Brand column */}
                    <div className='flex flex-col gap-5 sm:col-span-2 xl:col-span-1'>
                        <img
                            src={assets.lglogo}
                            alt="Zenvault"
                            className='w-32 dark:hidden'
                        />
                        <img
                            src={assets.darkbglogo}
                            alt="Zenvault"
                            className='hidden dark:block w-32'
                        />
                        <p className='text-sm leading-7 text-zen-light-muted dark:text-zen-muted max-w-xs'>
                            Modern banking tools designed to make managing, moving, and growing your money feel clear and secure.
                        </p>
                        {/* Social icons */}
                        <div className='flex gap-4 mt-1'>
                            <a href="#" aria-label="Facebook"
                                className='w-9 h-9 flex items-center justify-center rounded-full border border-zen-light-border dark:border-zen-border hover:bg-zen-primary hover:border-zen-primary hover:text-white transition-colors'>
                                <img src={assets.facebook_icon} alt="Facebook" className='w-4 h-4' />
                            </a>
                            <a href="#" aria-label="Instagram"
                                className='w-9 h-9 flex items-center justify-center rounded-full border border-zen-light-border dark:border-zen-border hover:bg-zen-primary hover:border-zen-primary hover:text-white transition-colors'>
                                <img src={assets.instagram_icon} alt="Instagram" className='w-4 h-4' />
                            </a>
                            <a href="#" aria-label="Twitter"
                                className='w-9 h-9 flex items-center justify-center rounded-full border border-zen-light-border dark:border-zen-border hover:bg-zen-primary hover:border-zen-primary hover:text-white transition-colors'>
                                <img src={assets.twitter_icon} alt="Twitter" className='w-4 h-4' />
                            </a>
                            <a href="#" aria-label="Email"
                                className='w-9 h-9 flex items-center justify-center rounded-full border border-zen-light-border dark:border-zen-border hover:bg-zen-primary hover:border-zen-primary hover:text-white transition-colors'>
                                <img src={assets.email_icon} alt="Email" className='w-4 h-4' />
                            </a>
                        </div>
                    </div>

                    {/* Company links */}
                    <div className='flex flex-col gap-4'>
                        <h3 className='font-bold text-base uppercase tracking-widest text-zen-light-text dark:text-zen-text'>
                            Company
                        </h3>
                        <ul className='flex flex-col gap-3 text-sm text-zen-light-muted dark:text-zen-muted'>
                            {['About Us', 'Careers', 'Blog', 'Press'].map(item => (
                                <li key={item}>
                                    <a href="#" className='hover:text-zen-primary transition-colors'>{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support links */}
                    <div className='flex flex-col gap-4'>
                        <h3 className='font-bold text-base uppercase tracking-widest text-zen-light-text dark:text-zen-text'>
                            Support
                        </h3>
                        <ul className='flex flex-col gap-3 text-sm text-zen-light-muted dark:text-zen-muted'>
                            {['FAQs', 'Contact Us', 'Privacy Policy', 'Terms & Conditions'].map(item => (
                                <li key={item}>
                                    <a href="#" className='hover:text-zen-primary transition-colors'>{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Transfer links */}
                    <div className='flex flex-col gap-4'>
                        <h3 className='font-bold text-base uppercase tracking-widest text-zen-light-text dark:text-zen-text'>
                            Transfer Money
                        </h3>
                        <ul className='flex flex-col gap-3 text-sm text-zen-light-muted dark:text-zen-muted'>
                            {['Register / Login', 'IBank Transfer', 'USA Money Transfer', 'UK Money Transfer', 'Euro Money Transfer'].map(item => (
                                <li key={item}>
                                    <a href="#" className='hover:text-zen-primary transition-colors'>{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className='border-t border-zen-light-border dark:border-zen-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zen-light-muted dark:text-zen-muted'>
                    <p>© {new Date().getFullYear()} Zenvault. All rights reserved.</p>
                    <div className='flex flex-wrap justify-center gap-x-5 gap-y-2'>
                        <a href="#" className='hover:text-zen-primary transition-colors'>Privacy Policy</a>
                        <a href="#" className='hover:text-zen-primary transition-colors'>Terms of Service</a>
                        <a href="#" className='hover:text-zen-primary transition-colors'>Cookie Policy</a>
                    </div>
                </div>

            </footer>
        </div>
    )
}

export default Footer
