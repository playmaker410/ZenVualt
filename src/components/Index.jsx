import React, { useState } from 'react'
import assets from '../assets/assets'
import { Check, DollarCircle, ListUl, ChartTrend, Bell } from '@boxicons/react'


const Index = ({ }) => {
  const [activeCard, setActiveCard] = useState(null)
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
            className='dark:hidden absolute top-0 left-0 z-0 w-full mask-t-from-50%'
          />

          {/*Dark Background image   */}
          <img
            src={assets.bgdark}
            alt=""
            className='hidden dark:block absolute top-0 left-0 w-full mask-t-from-50% '
          />

          {/* Customer image dark background */}
          <img
            src={assets.indexbgpc}
            alt=""
            className='hidden dark:block relative z-10 w-[85%] sm:w-[75%]  md:w-[65%] xl:w-full mx-auto mask-t-from-80%'
          />

          <img
            src={assets.lgindexpc}
            alt=""
            className='dark:hidden relative z-10 w-[85%] md:[65%] sm:w-[75%] xl:w-full mx-auto mask-t-from-80%'
          />
        </div>
      </div>

      {/* =================================================================================================Home Page Ends here==================================================================================== */}


      {/* ===================================================================Our features ================================================================================== */}
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

        <div className='py-12 grid md:grid-cols-3 gap-7 px-5 text-black'>

          {/* Card 1 */}
          <div
            onClick={() => setActiveCard(activeCard === 1 ? null : 1)}
            className='group relative overflow-hidden flex flex-col items-center 
  justify-center text-center bg-zen-light-card dark:bg-zen-card 
  py-3 px-10 rounded-xl border border-zen-light-border 
  dark:border-zen-border dark:text-zen-text cursor-pointer'
          >
            {/* Animated Background */}
            <div
              className={`absolute inset-x-0 bottom-0 bg-zen-glow
    transition-all duration-500 ease-in-out
    group-hover:h-full
    ${activeCard === 1 ? 'h-full' : 'h-0'}`}
            ></div>

            {/* Content */}
            <img src={assets.atmimg} alt="" className='relative z-10 xl:w-16 sm:w-10' />
            <p className='relative z-10 font-bold text-lg'>Secure Banking</p>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => setActiveCard(activeCard === 2 ? null : 2)}
            className='group relative overflow-hidden flex flex-col items-center 
  justify-center text-center bg-zen-light-card dark:bg-zen-card 
  py-3 px-10 rounded-xl border border-zen-light-border 
  dark:border-zen-border dark:text-zen-text cursor-pointer'
          >
            {/* Animated Background */}
            <div
              className={`absolute inset-x-0 bottom-0 bg-zen-glow
    transition-all duration-500 ease-in-out
    group-hover:h-full
    ${activeCard === 2 ? 'h-full' : 'h-0'}`}
            ></div>

            {/* Content */}
            <img src={assets.finance} alt="" className='relative z-10 xl:w-16 sm:w-10' />
            <p className='relative z-10 font-bold text-lg'>Flexible Loan</p>
          </div>


          {/* Card 3 */}
          <div
            onClick={() => setActiveCard(activeCard === 3 ? null : 3)}
            className='group relative overflow-hidden flex flex-col items-center 
  justify-center text-center bg-zen-light-card dark:bg-zen-card 
  py-3 px-10 rounded-xl border border-zen-light-border 
  dark:border-zen-border dark:text-zen-text cursor-pointer'
          >
            {/* Animated Background */}
            <div
              className={`absolute inset-x-0 bottom-0 bg-zen-glow
    transition-all duration-500 ease-in-out
    group-hover:h-full
    ${activeCard === 3 ? 'h-full' : 'h-0'}`}
            ></div>

            {/* Content */}
            <img src={assets.banking} alt="" className='relative z-10 xl:w-16 sm:w-10' />
            <p className='relative z-10 font-bold text-lg'>Online Banking</p>
          </div>


        </div>

      </section>

      {/* ====================================================================Smart Banking ====================================================================== */}

      <section
        className='grid xl:grid-cols-2 py-20 gap-16 px-5'>

        <div className='w-full relative'>
          <img
            src={assets.happybanking} alt=""
            className='relative z-10 rounded-2xl w-full object-cover' />

          <img src={assets.bgimage1} alt="" className='absolute -bottom-10 -right-5 z-0 w-52 sm:w-44 xl:w-fit dark:hidden' />
        </div>

        <div
          className='flex flex-col justify-center gap-4'>
          <p className='text-blue-500 font-semibold'>
            Smart Banking
          </p>

          <h1
            className='text-3xl sm:text-4xl xl:text-5xl font-extrabold'>
            We Create Seamless Financial Experiences
          </h1>
          <p
            className='font-light text-zen-muted  pb-6'>
            We've grown into one of the most trusted names in digital finance, driven by a commitment to making smart, secure banking accessible to everyone. At Zenvault, we're constantly innovating to simplify how individuals and businesses manage, move, and grow their money because great banking should feel effortless.
          </p>

          <div className='flex flex-col gap-4 mt-2'>
            <p
              className='flex gap-3  items-center'> <Check fill='white' className='rounded-full  bg-[#1E3A8A] w-6 h-6 shrink-0' />
              Cards that work all across the world.
            </p>

            <p
              className='flex gap-3  items-center'> <Check fill='white' className='rounded-full  bg-[#1E3A8A] w-6 h-6 shrink-0' />
              Unlock Greater Investment Potential
            </p>

            <p
              className='flex gap-3  items-center'> <Check fill='white' className='rounded-full  bg-[#1E3A8A] w-6 h-6 shrink-0' />
              No ATM Fees. No Minimum Balance.No Overdraft Charges.
            </p>
          </div>

        </div>

      </section>



      {/* ==========================================================================WHY CHOOSE US ============================================================================== */}

      <section
        className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 py-20 gap-8 px-4 sm:px-6 sm:py-10 xl:px-8'>

        {/* card 1 */}
        <div className='bg-light-card-gradient dark:bg-card-col-gradient rounded-2xl p-5 flex flex-col gap-4 h-full active:scale-110 duration-100 active:border-b-4'>
          <DollarCircle className='bg-[#10B981] rounded-2xl w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 border border-[rgba(16,185,129, 0.3)] ' />
          <a href="#" className='text-2xl font-bold '> Money Transfer</a>
          <p className='leading-7 text-md flex-1'>With our digital platform, you may send money to relatives and friends all around the world in real time</p>
        </div>
        {/* CARD 2 */}

        <div className='bg-light-card-gradient dark:bg-card-col-gradient rounded-2xl p-5 flex flex-col gap-4 h-full active:scale-110 duration-100 active:border-b-4'>
          <ListUl className='bg-[#F97316] rounded-2xl w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 border border-[rgba(16,185,129, 0.3)] ' />
          <a href='#' className='text-2xl font-bold'>Late Alert </a>
          <p className='leading-7 text-md flex-1'>Reach anyone, anywhere. Our platform makes sending money to friends and family around the world instant and effortless.</p>
        </div>

        {/* card 3 */}
        <div className='bg-light-card-gradient dark:bg-card-col-gradient rounded-2xl p-5 flex flex-col gap-4 h-full active:scale-110 duration-100 active:border-b-4'>
          <ChartTrend className='bg-[#8B5CF6] rounded-2xl w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 border border-[rgba(16,185,129, 0.3)] ' />
          <a href="#" className='text-2xl font-bold'> Currency Chart </a>
          <p className='leading-7 text-md flex-1'>Track every market shift in real time and trade smarter with live, interactive currency charts.</p>
        </div>

        {/* card 4 */}

        <div className='bg-light-card-gradient dark:bg-card-col-gradient rounded-2xl p-5 flex flex-col gap-7 h-full active:scale-110 duration-100 active:border-b-4'>
          <Bell className='bg-[#22D3EE] rounded-2xl w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12 border border-[rgba(16,185,129, 0.3)] ' />
          <a href="#" className='text-2xl font-bold'> Notification </a>
          <p className='leading-7 text-md flex-1'>Stay informed with real-time transaction alerts protected by end-to-end encryption, every step of the way.</p>
        </div>
      </section>



      {/* ==============================================================================Security================================================================ */}


      <section
        className='grid xl:grid-cols-2 py-20 gap-16 px-5'>

        <div className='w-full relative order-2'>
          <img
            src={assets.security} alt=""
            className='relative z-10 rounded-2xl w-fit object-contain' />


        </div>



        <div
          className='flex flex-col justify-center gap-4 order-1'>
          <p className='text-blue-500 font-semibold '>
            Banking Protection
          </p>

          <h1
            className='text-3xl sm:text-4xl xl:text-5xl font-extrabold'>
            Your Benefits
          </h1>
          <p
            className='font-light text-zen-muted  pb-3'>
            Your one-stop digital banking platform.
          </p>

          <div className='flex flex-col gap-4 '>
            <p
              className='flex gap-3  items-center'> <Check fill='white' className='rounded-full  bg-[#1E3A8A] w-6 h-6 shrink-0' />
              Global Coverage
            </p>

            <p
              className='flex gap-3  items-center'> <Check fill='white' className='rounded-full  bg-[#1E3A8A] w-6 h-6 shrink-0' />
              Easy Transfer Method
            </p>

            <p
              className='flex gap-3  items-center'> <Check fill='white' className='rounded-full  bg-[#1E3A8A] w-6 h-6 shrink-0' />
              Global 24/7 Support
            </p>

            <p
              className='flex gap-3  items-center'> <Check fill='white' className='rounded-full  bg-[#1E3A8A] w-6 h-6 shrink-0' />
              Lowest Fee
            </p>

            <p
              className='flex gap-3  items-center'> <Check fill='white' className='rounded-full  bg-[#1E3A8A] w-6 h-6 shrink-0' />
              Instant Processing
            </p>

            <p
              className='flex gap-3  items-center'> <Check fill='white' className='rounded-full  bg-[#1E3A8A] w-6 h-6 shrink-0' />
              Bank Lavel Security
            </p>

          </div>

        </div>

      </section>



      {/* =================================================================== Our Reviews ========================================================================= */}

      <section>
        <p className='text-blue-500 text-center font-semibold '>
          Banking Protection
        </p>
      </section>




    </div>

  )
}

export default Index