import React from 'react'
import assets from '../assets/assets'
import Footer from './Footer'
import Features from './Features'
import { Link } from 'react-router-dom'


const Index = ({ }) => {


  return (
    <div className='py-20 px-3 sm:px-10 lg:px-24 xl:px-40 w-full dark:text-white bg-zen-light-gradient dark:bg-zen-gradient'>

      <div className='grid xl:grid-cols-2 gap-10'>
        <div>
          <div className='inline-flex gap-2 border-zen-light-border dark:border-zen-border border-2 p-1 xl:p-3 rounded-full w-fit text-zen-primary'>
            <p className='text-xs font-medium xl:font-extrabold xl:text-[18px]'>SECURE</p>
            <p className='text-xs font-medium xl:font-extrabold xl:text-[18px]'>FAST</p>
            <p className='text-xs font-medium xl:font-extrabold xl:text-[18px]'>GLOBAL</p>
          </div>
          <h1 className='text-4xl sm:text-5xl md:text-6xl xl:text-[80px] font-bold xl:leading-[95px] max-w-5xl'>
            Secure Banking for <br /> <span className='text-zen-primary'> Modern Life </span>
          </h1>
          <p className='font-normal text-sm xl:text-lg pt-3.5 px-0.5'>
            Built for individuals, businesses, and the future of finance. Zenvault offers innovative
            digital banking services that simplify financial management while keeping security and convenience at the center
          </p>
          <Link to='/login'> <button className='bg-sky-400 hover:bg-blue-950 transition-colors active:scale-105 mt-3.5 px-9 py-3 xl:py-5 
            xl:px-13 rounded-md text-white dark:not-only:text-black font-bold xl:text-lg sm:text-sm'>
            Get Started
          </button>
          </Link>

        </div>

        <div className='relative flex justify-center items-center mt-10 xl:mt-0'>
          <img src={assets.bglight} alt="" className='dark:hidden absolute top-0 left-0 z-0 w-full mask-t-from-50%' />
          <img src={assets.bgdark} alt="" className='hidden dark:block absolute top-0 left-0 w-full mask-t-from-50%' />
          <img src={assets.indexbgpc} alt="" className='hidden dark:block relative z-10 w-[85%] sm:w-[75%] md:w-[65%] xl:w-full mx-auto mask-t-from-80%' />
          <img src={assets.lgindexpc} alt="" className='dark:hidden relative z-10 w-[85%] md:[65%] sm:w-[75%] xl:w-full mx-auto mask-t-from-80%' />
        </div>
      </div>
      <Features />
      <Footer />



    </div>







  )
}

export default Index