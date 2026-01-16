"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'

const Navbar = () => {
    const { data: session, status } = useSession()
    const loading = status === "loading"

    return (
        <nav className='md:h-26 h-16 bg-white text-black flex justify-between items-center md:px-10'>
            <div className="logo font-bold text-2xl">
                <Link className="relative block md:w-64 w-50 h-40" href="/">
                    <Image src="/logo.png" fill={true} alt="Logo" className="object-contain" />
                </Link>
            </div>
            <button
                onClick={() => signIn("google")}
                className='flex md:hidden bg-white px-4 py-2 cursor-pointer border gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150'
            >
                <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                <span>Login with Google</span>
            </button>
            <ul className='hidden gap-10 px-10 items-center md:flex'>
                <li className='flex gap-6'>
                    <Link href="/">
                        <button className='flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-white shadow-md cursor-pointer font-bold bg-gradient-to-r from-[#21cbf1] to-cyan-500'>
                            Home                        </button>
                    </Link>


                    {loading ? (
                        <div className='text-white shadow-lg px-3 py-2 font-bold rounded-lg  bg-gradient-to-r from-[#21cbf1] to-cyan-500'>

                            Loading...
                        </div>
                    ) : session ? (
                        <Link className=' bg-gradient-to-r from-[#21cbf1] to-cyan-500 shadow-lg px-3 py-2 font-bold cursor-pointer text-white rounded-lg' href={"/dashboard"}>
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
        </nav>
    )
}

export default Navbar