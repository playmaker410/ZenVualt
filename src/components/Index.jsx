import React from 'react'
import assets from '../assets/assets'

const Index = ({ }) => {
  return (
    <div
      className='py-20 px-4 sm:px-10 lg:px-24 xl:px-40 w-full dark:text-white bg-zen-light-gradient dark:bg-zen-gradient'>

      <div className='grid xl:grid-cols-2  gap-10 '>

        <div>

          <div
            className='inline-flex gap-2 border-zen-light-border dark:border-zen-border border-2 p-1  xl:p-3 rounded-full  w-fit text-zen-primary'>
            <p
              className='text-xs font-medium xl:font-extrabold xl:text-[18px]' >
              SECURE
            </p>
            <p
              className='text-xs font-medium xl:font-extrabold xl:text-[18px]'>
              FAST
            </p>
            <p
              className='text-xs font-medium xl:font-extrabold xl:text-[18px]'>
              GLOBAL
            </p>
          </div>
          <h1
            className='text-4xl sm:text-5xl md:text-6xl xl:text-[84px] font-medium xl:leading-[95px]  max-w-5xl'>
            Secure Banking for <br /> <span className='text-zen-primary'> Modern Life  </span>
          </h1>

          <p
            className='font-normal text-sm xl:text-lg  pt-3.5 px-0.5 '>
            Built for individuals, businesses, and the future of finance. Zenvault offers innovative
            digital banking services that simplify financial management while keeping security and convenience at the center
          </p>

          <button
            className='bg-sky-400 hover:bg-blue-950 transition-colors active:scale-105 mt-3.5 px-9 py-3 xl:py-5 
          xl:px-13 rounded-md text-white dark:not-only:text-black font-bold xl:text-lg sm:text-sm '>
            Get Started
          </button>

        </div>


        <div className='relative flex justify-center items-center mt-10 xl:mt-0 '>
          {/* Light Background image */}
          <img
            src={assets.bglight}
            alt=""
            className='dark:hidden absolute top-0 left-0 z-0 w-full '
          />

          {/*Dark Background image   */}
          <img
            src={assets.bgdark}
            alt=""
            className='hidden dark:block absolute top-0 left-0 w-full '
          />

          {/* Customer image dark background */}
          <img
            src={assets.indexbgpc}
            alt=""
            className='hidden dark:block relative z-10 w-[85%] sm:w-[75%]  md:w-[65%] xl:w-full mx-auto'
          />

          <img
            src={assets.lgindexpc}
            alt=""
            className='dark:hidden relative z-10 w-[85%] md:[65%] sm:w-[75%] xl:w-full mx-auto '
          />
        </div>
      </div>

      {/* =================================================================================================Home Page Ends here==================================================================================== */}
      <section className='pt-10  xl:pt-20'>
        <div>
          <p
            className='text-center text-zen-glow font-extrabold  text-lg xl:leading-5'>
            Why Zenvault
          </p>
          <h1
            className='text-center font-extrabold xl:text-6xl text-3xl'>
            Global Payment Solutions
          </h1>
        </div>

        <div
          className='py-12 grid md:grid-cols-3 gap-7 px-5 text-black'>

          <div className='flex flex-col items-center justify-center text-center bg-zen-light-card dark:bg-zen-card py-3 px-10 
          rounded-xl border border-zen-light-border dark:border-zen-border dark:text-zen-text
           hover:bg-zen-glow active:bg-zen-glow'>

            <img
              src={assets.atmimg}
              alt=""
              className=' w-fit xl:w-16 sm:w-5 '
            />

            <p className='font-bold text-lg'>
              Secure Banking
            </p>
          </div>

          <div
            className='flex flex-col items-center justify-center text-center bg-zen-light-card
           dark:bg-zen-card py-3 px-10 rounded-xl border border-zen-light-border dark:border-zen-border dark:text-zen-text 
           hover:bg-zen-glow active:bg-zen-glow'>

            <img
              src={assets.finance}
              alt=""
              className='xl:w-16 sm:w-10'
            />

            <p className='font-bold text-lg'>
              Flexible Loan
            </p>
          </div>

          <div
            className='flex flex-col items-center justify-center text-center bg-zen-light-card dark:bg-zen-card py-3 px-10
            rounded-xl border border-zen-light-border dark:border-zen-border dark:text-zen-text
             hover:bg-zen-glow active:bg-zen-glow'>

            <img
              src={assets.banking}
              alt=""
              className='xl:w-16 sm:w-10 '
            />

            <p className='font-bold text-lg'>
              Online Banking
            </p>
          </div>

        </div>



      </section>

    </div>


  )
}

export default Index