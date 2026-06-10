import React, { useState } from 'react';
import assets from '../assets/assets';
import { Menu, User, X, BriefcaseAlt2, Home, CreditCardAlt, PriceTag, InfoCircle } from '@boxicons/react'
import { Link, NavLink } from 'react-router-dom'
import ThemeToggleButton from './ThemeToggleButton'
{/*Navbar open and close*/ }
const Navbar = ({ theme, setTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  {/*Desktop Menu*/ }
  return (


    <div className='h-20 w-full flex  justify-between items-center px-5 lg:px-5 md:px-10 
      sm:px-5 sticky top-0 z-50  font-medium bg-zen-light-bg drop-shadow-md
       dark:bg-zen-bg border-b border-gray-200/40 dark:border-white/10  shadow-[0_4px_20px_rgba(0,0,0,0.08)]
      dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300'>
      {/* logo image here*/}

      <div>
        <Link to='/'>
          <img src={theme == 'dark' ? assets.darkbglogo : assets.lglogo} className=' w-32 lg:w-40 md:w-35 sm:w-20 hover:scale-105 transition-all' alt="" />
        </Link>
      </div>


      <div className='hidden lg:flex gap-6 text-md dark:text-white font-semibold text-base '>
        <NavLink to="/" end className={({ isActive }) => `lg:hover:border-b-2 hover:text-sky-500 transition-all delay-300 duration-500 dark:text-white ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}>Home</NavLink>
        <NavLink to="/buisness" className={({ isActive }) => `lg:hover:border-b-2 hover:text-sky-500 transition-all delay-300 duration-500 dark:text-white ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}>Buisness</NavLink>
        <NavLink to="/personal" className={({ isActive }) => `lg:hover:border-b-2 hover:text-sky-500 transition-all delay-300 duration-500 dark:text-white ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}>Personal</NavLink>
        <NavLink to="/card" className={({ isActive }) => `lg:hover:border-b-2 hover:text-sky-500 transition-all delay-300 duration-500 dark:text-white ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}>Card</NavLink>
        <NavLink to="/loan" className={({ isActive }) => `lg:hover:border-b-2 hover:text-sky-500 transition-all delay-300 duration-500 dark:text-white ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}>Loans</NavLink>
        <NavLink to="/contact" className={({ isActive }) => `lg:hover:border-b-2 hover:text-sky-500 transition-all delay-300 duration-500 dark:text-white ${isActive ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}>Contact Us</NavLink>
      </div>


      {/* Desktop buttons */}
      <div className='flex gap-2 '>
        <div className='hidden lg:flex'>
          <ThemeToggleButton theme={theme} setTheme={setTheme} className='' />
        </div>

        <Link to='/login'>
          <button className='hidden lg:flex bg-sky-400 hover:bg-blue-950 transition-colors hover:scale-105 px-9 py-2 rounded-full text-white font-bold text-lg '>
            Log in
          </button>
        </Link>

        <Link to='/register'> <button className='hidden lg:flex border-gray-500 border px-5 py-2 rounded-md hover:scale-105 text-lg dark:text-white'>
          Get Started
        </button>
        </Link>
      </div>
      {/*Desktop button and Desktop ends here */}



      {/*================================================================Responsive Navbar ===============================================================================*/}


      {/* Mobile menu */}
      <div className='flex gap-1.5 lg:hidden md:gap-6 '>

        <ThemeToggleButton theme={theme} setTheme={setTheme} />
        {/*<User color='white' stroke='white' pack='filled' className='lg:hidden bg-black rounded-full' size={window.innerWidth < 768 ? 16 : 32} />*/}
        <Menu className='lg:hidden text-black dark:text-white w-10 h-10 md:w-8 md-h-10' onClick={() => setIsMenuOpen(!isMenuOpen)} size={window.innerWidth < 768 ? 16 : 32} />

      </div>

      <div className={`fixed lg:hidden top-0 left-0 w-[80%]  h-dvh px-4 pt-10 bg-white dark:bg-gray-900 z-50 flex flex-col gap-2 font-semibold dark:text-white text-black  transition-all duration-800 ${isMenuOpen ? "opacity-100 translate-x-0 " : "opacity-0 -translate-x-full "
        }`}>
        <X className='ml-auto' onClick={closeMenu} size={window.innerWidth < 768 ? 16 : 32} />
        <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => `p-4 cursor-pointer flex items-center gap-2 ${isActive ? 'text-blue-500' : 'text-black dark:text-white'}`}><Home size={18} />Home</NavLink>
        <NavLink to="/buisness" onClick={closeMenu} className={({ isActive }) => `p-4 cursor-pointer flex items-center gap-2 ${isActive ? 'text-blue-500' : 'text-black dark:text-white'}`}><BriefcaseAlt2 size={18} />Buisness</NavLink>
        <NavLink to="/personal" onClick={closeMenu} className={({ isActive }) => `p-4 cursor-pointer flex items-center gap-2 ${isActive ? 'text-blue-500' : 'text-black dark:text-white'}`}><User size={18} /> Personal</NavLink>
        <NavLink to="/card" onClick={closeMenu} className={({ isActive }) => `p-4 cursor-pointer flex items-center gap-2 ${isActive ? 'text-blue-500' : 'text-black dark:text-white'}`}><CreditCardAlt size={18} />Card</NavLink>
        <NavLink to="/loan" onClick={closeMenu} className={({ isActive }) => `p-4 cursor-pointer flex items-center gap-2 ${isActive ? 'text-blue-500' : 'text-black dark:text-white'}`}><PriceTag size={18} />Loans</NavLink>
        <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => `p-4 cursor-pointer flex items-center gap-2 ${isActive ? 'text-blue-500' : 'text-black dark:text-white'}`}><InfoCircle size={18} /> Contact Us</NavLink>
        {/*Mobile Navbar button */}
        <Link to='/login'>
          <button onClick={closeMenu} className='w-full bg-zen-primary rounded-md py-4 text-lg font-bold dark:text-white shadow-neon active:scale-105 transition' >
            Log in
          </button>
        </Link>

        <Link to='/register'>
          <button onClick={closeMenu} className='w-full bg-white dark:text-black text-black rounded-md py-4 text-lg font-bold shadow-neon active:scale-105 transition' >
            Register
          </button>
        </Link>




      </div>


    </div>

  );
}

export default Navbar;