import { React, useState } from 'react'
import assets from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ChevronRight } from '@boxicons/react'
import Footer from '../components/Footer'

const Contact = () => {
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    // form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })

    // handlers
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            const res = await fetch('http://localhost:8080/api/contactus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })


            if (res.ok) {
                setSuccess("Message sent! We'll get back to you soon.")
                setFormData({ name: '', email: '', subject: '', message: '' })
            } else {
                setError("Something went wrong. Please try again.")
            }
        } catch (err) {
            setError("Network error. Please check your connection.")

        }
    }

    return (
        <div className='bg-zen-light-bg dark:bg-zen-bg px-4'>

            {/* breadcrumb header */}
            <div className='xl:flex xl:p-12 xl:justify-between'>
                <div className='flex flex-col gap-2 w-full'>
                    <p className='text-2xl xl:text-5xl font-bold'>Contact</p>
                    <div className='flex justify-self-start w-fit'>
                        <NavLink to="/">Home </NavLink>
                        <ChevronRight />
                        <NavLink to="/contact" className={({ isActive }) => `xl:text-lg ${isActive ? ' text-blue-500' : ''}`}> Contact</NavLink>
                    </div>
                </div>
                <div className='py-5 xl:py-15'>
                    <img src={assets.breadcrumb} alt="breadcrumb" className='hidden xl:flex' />
                </div>
            </div>

            {/* main content */}
            <div className='grid xl:grid-cols-2 gap-10 xl:mx-50 py-10'>

                {/* left: contact info */}
                <div className='flex flex-col gap-7'>
                    <p className='text-2xl xl:text-3xl font-bold'>Get in Touch</p>
                    <p className='text-zen-light-muted dark:text-zen-muted'>
                        Have a question about your account, a transaction, or our services? Our team is here to help.
                        Reach out using the form or the details below, and we'll get back to you as soon as possible.
                    </p>

                    <div className='flex flex-col gap-4 mt-4'>
                        <div className='p-4 bg-[#f9f9f9] dark:bg-[#1c1c1c] rounded-md border border-gray-200/40 dark:border-white/10'>
                            <p className='font-bold text-[#1a1a1a] dark:text-white'>Email</p>
                            <p className='text-zen-light-muted dark:text-zen-muted'>support@zenvault.com</p>
                        </div>
                        <div className='p-4 bg-[#f9f9f9] dark:bg-[#1c1c1c] rounded-md border border-gray-200/40 dark:border-white/10'>
                            <p className='font-bold text-[#1a1a1a] dark:text-white'>Phone</p>
                            <p className='text-zen-light-muted dark:text-zen-muted'>+1 (800) 123-4567</p>
                        </div>
                        <div className='p-4 bg-[#f9f9f9] dark:bg-[#1c1c1c] rounded-md border border-gray-200/40 dark:border-white/10'>
                            <p className='font-bold text-[#1a1a1a] dark:text-white'>Office</p>
                            <p className='text-zen-light-muted dark:text-zen-muted'>123 Finance Street, Suite 400</p>
                        </div>
                    </div>
                </div>

                {/* right: contact form */}
                <div className='flex flex-col gap-5 p-5 bg-[#f9f9f9] dark:bg-[#0a0a0a] rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-gray-200/40 dark:border-white/10'>
                    <h2 className='text-2xl xl:text-3xl font-bold text-[#1a1a1a] dark:text-white'>Send a Message</h2>
                    {error && (
                        <p className='text-red-500 bg-red-100 dark:bg-red-900/20 p-3 rounded-md'>{error}</p>
                    )}
                    {success && (
                        <p className='text-green-600 bg-green-100 dark:bg-green-900/20 p-3 rounded-md'> {success}</p>
                    )}

                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            className='p-4 bg-[#ffffff] dark:bg-[#1c1c1c] rounded-md outline-none border border-gray-200/40 dark:border-white/10'
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            className='p-4 bg-[#ffffff] dark:bg-[#1c1c1c] rounded-md outline-none border border-gray-200/40 dark:border-white/10'
                            required
                        />
                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className='p-4 bg-[#ffffff] dark:bg-[#1c1c1c] rounded-md outline-none border border-gray-200/40 dark:border-white/10'
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            className='p-4 bg-[#ffffff] dark:bg-[#1c1c1c] rounded-md outline-none border border-gray-200/40 dark:border-white/10 resize-none'
                            required
                        />
                        <button
                            type="submit"
                            className='flex justify-between items-center p-4 bg-zen-primary text-white rounded-md hover:opacity-90'
                        >
                            Send Message <ChevronRight className='rounded-full w-6 h-6 shrink-0' />
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Contact