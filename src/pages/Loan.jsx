import React from 'react'
import assets from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { C, ChevronRight } from '@boxicons/react'
import Footer from '../components/Footer'

const Loan = () => {

    return (
        <div className='bg-zen-light-bg dark:bg-zen-bg px-4 '>

            <div className='xl:flex xl:p-12  xl:justify-between'>

                <div className='flex flex-col gap-2 w-full' >
                    <p className='text-2xl xl:text-5xl font-bold '>Loans</p>
                    <div className='flex justify-self-start w-fit'>
                        <NavLink to="/" className="">Home </NavLink>
                        <ChevronRight />
                        <NavLink to="/loan" className={({ isActive }) => ` xl:text-lg ${isActive ? ' text-blue-500' : ''}`}> Loan</NavLink>
                    </div>

                </div>

                <div className='py-15'>
                    <img src={assets.breadcrumb} alt="breadcrumb" className='hidden xl:flex' />


                </div>

            </div>

            <div className='grid xl:grid-cols-2 place-items-end xl:mx-[12.5rem]'>

                <div className=' order-1 xl:order-1'>
                    <img src={assets.personal} alt="" className='rounded h-auto w-full ' />
                </div>

                <div className='flex flex-col gap-7 text-bold xl:w-100 w-full p-5 bg-[#f9f9f9] dark:bg-[#0a0a0a] rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-gray-200/40 dark:border-white/10 order-3 xl:order-2  '>
                    <h2 className='text-2xl xl:text-3xl font-bold text-[#1a1a1a] dark:text-white' >All Services</h2>

                    <Link to="/buisness" className='flex  justify-between p-4 bg-[#ffffff] dark:bg-[#1c1c1c] rounded-md hover:text-zen-primary' >Business <ChevronRight className='rounded-full w-6 h-6 shrink-0' /></Link>
                    <Link to="/personal" className='flex justify-between p-4 bg-[#ffffff] dark:bg-[#1c1c1c] rounded-md hover:text-zen-primary'>Personal <ChevronRight className='rounded-full w-6 h-6 shrink-0' /></Link>
                    <Link to="/card" className='flex justify-between p-4 bg-[#ffffff] dark:bg-[#1c1c1c] rounded-md  hover:text-zen-primary'>Card<ChevronRight className='rounded-full  w-6 h-6 shrink-0' /></Link>
                    <Link to="/loan" className='flex justify-between p-4 bg-[#ffffff] dark:bg-[#1c1c1c] rounded-md hover:text-zen-primary'>Loan <ChevronRight className='rounded-full w-6 h-6 shrink-0' /></Link>
                </div>


                <div className='py-25 order-2 xl:order-3 '>

                    <div>
                        <p className='text-2xl xl:text-3xl font-bold mb-5 '>Loans</p>
                        <p className='text-zen-light-muted dark:text-zen-muted'>Business Accounts are designed to support companies, entrepreneurs, and organizations with financial tools built specifically for commercial use. They provide everything needed to manage funds efficiently, process transactions at scale, and access tailored financing solutions.
                            With support for high transaction volumes, operational payments, and structured lending, Business Accounts are built to keep your operations running smoothly. Advanced reporting tools and controlled access features give authorized team members the visibility and oversight your organization needs.
                            Whether you're a growing startup or an established enterprise, our Business Account delivers the reliable digital banking infrastructure and cash-flow support to power your business forward.</p>
                    </div>

                </div>


            </div>
            <Footer />





        </div>
    )
}

export default Loan