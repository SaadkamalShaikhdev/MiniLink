"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
    const { data: session, status } = useSession()
    const loading = status === "loading"
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen)
    }

    return (
        <nav className='relative bg-white text-black shadow-sm'>
            <div className='h-16 md:h-26 flex justify-between items-center px-4 md:px-10'>
                {/* Logo */}
                <div className="logo font-bold text-2xl">
                    <Link className="relative block w-32 md:w-64 h-12 md:h-16" href="/">
                        <Image src="/logo.png" fill={true} alt="Logo" className="object-contain" />
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMobileMenu}
                    className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <X className="w-6 h-6 text-gray-700" />
                    ) : (
                        <Menu className="w-6 h-6 text-gray-700" />
                    )}
                </button>

                {/* Desktop Menu */}
                <ul className='hidden md:flex gap-10 px-10 items-center'>
                    <li className='flex gap-6'>
                        <Link href="/">
                            <button className='flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-white shadow-md cursor-pointer font-bold bg-gradient-to-r from-[#21cbf1] to-cyan-500 hover:shadow-lg'>
                                Home
                            </button>
                        </Link>

                        {loading ? (
                            <div className='text-white shadow-lg px-4 py-2 font-bold rounded-lg bg-gradient-to-r from-[#21cbf1] to-cyan-500'>
                                Loading...
                            </div>
                        ) : session ? (
                            <Link className='bg-gradient-to-r from-[#21cbf1] to-cyan-500 shadow-lg px-4 py-2 font-bold cursor-pointer text-white rounded-lg hover:shadow-xl transition-shadow' href={"/dashboard"}>
                                Dashboard
                            </Link>
                        ) : (
                            <button
                                onClick={() => signIn("google")}
                                className='flex bg-white px-4 py-2 cursor-pointer border gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150'
                            >
                                <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                                <span>Login with Google</span>
                            </button>
                        )}
                    </li>
                </ul>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className='md:hidden bg-white border-t border-gray-200 shadow-lg'>
                    <ul className='flex flex-col p-4 gap-3'>
                        <li>
                            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                                <button className='w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all text-white shadow-md font-bold bg-gradient-to-r from-[#21cbf1] to-cyan-500 hover:shadow-lg'>
                                    Home
                                </button>
                            </Link>
                        </li>

                        {loading ? (
                            <li>
                                <div className='w-full text-center text-white shadow-lg px-4 py-3 font-bold rounded-lg bg-gradient-to-r from-[#21cbf1] to-cyan-500'>
                                    Loading...
                                </div>
                            </li>
                        ) : session ? (
                            <li>
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                    <button className='w-full bg-gradient-to-r from-[#21cbf1] to-cyan-500 shadow-lg px-4 py-3 font-bold text-white rounded-lg hover:shadow-xl transition-shadow'>
                                        Dashboard
                                    </button>
                                </Link>
                            </li>
                        ) : (
                            <li>
                                <button
                                    onClick={() => {
                                        signIn("google")
                                        setMobileMenuOpen(false)
                                    }}
                                    className='w-full flex items-center justify-center bg-white px-4 py-3 cursor-pointer border gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150'
                                >
                                    <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                                    <span>Login with Google</span>
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    )
}

export default Navbar