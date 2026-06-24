"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Menu, X, LinkIcon, LogOut, LayoutDashboard } from 'lucide-react'

const Navbar = () => {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMobileOpen(false)

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: '#ffffff',
          borderBottom: scrolled ? '1px solid #e5e7eb' : '1px solid #f3f4f6',
          boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.07)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* ── Wordmark ── */}
          <Link href="/" onClick={close} className="flex items-center gap-2">
            {/* <span
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #00E5FF, #818CF8)' }}
            >
              <LinkIcon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </span> */}
            <span
              className="text-xl font-extrabold tracking-tight"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                background: 'linear-gradient(90deg, #0A0F1E, #334155)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MiniLink
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/shorten">Shorten</NavLink>

            {loading ? (
              <span className="w-24 h-9 rounded-lg bg-gray-100 animate-pulse ml-2" />
            ) : session ? (
              <>
                <NavLink href="/dashboard">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </NavLink>

                {/* Avatar + name chip */}
                <div className="ml-3 flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-full pl-1 pr-3 py-1">
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-cyan-400 to-indigo-400 flex items-center justify-center">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'avatar'}
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-white text-xs font-bold">
                        {session.user?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-700 text-xs font-semibold max-w-[90px] truncate">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                </div>

                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 ml-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="flex items-center gap-2 ml-3 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
                style={{ background: 'linear-gradient(90deg, #00BCD4, #818CF8)' }}
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-4 h-4"
                  alt="Google"
                />
                Sign in
              </button>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div
        className="fixed inset-0 z-40 md:hidden"
        style={{ pointerEvents: mobileOpen ? 'auto' : 'none' }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/30 transition-opacity duration-300"
          style={{ opacity: mobileOpen ? 1 : 0 }}
          onClick={close}
        />
        {/* Panel */}
        <div
          className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg transition-all duration-300"
          style={{
            transform: mobileOpen ? 'translateY(0)' : 'translateY(-6px)',
            opacity: mobileOpen ? 1 : 0,
          }}
        >
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            <MobileNavLink href="/" onClick={close}>Home</MobileNavLink>
            <MobileNavLink href="/shorten" onClick={close}>Shorten</MobileNavLink>

            {loading ? (
              <div className="h-10 rounded-lg bg-gray-100 animate-pulse" />
            ) : session ? (
              <>
                <MobileNavLink href="/dashboard" onClick={close}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </MobileNavLink>
                <div className="border-t border-gray-100 my-2" />
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-cyan-400 to-indigo-400 flex items-center justify-center">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'avatar'}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-white text-sm font-bold">
                        {session.user?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-800 text-sm font-semibold">{session.user?.name}</p>
                    <p className="text-gray-400 text-xs">{session.user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { signOut(); close() }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-100 my-2" />
                <button
                  onClick={() => { signIn('google'); close() }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(90deg, #00BCD4, #818CF8)' }}
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
                  Sign in with Google
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&display=swap');
      `}</style>
    </>
  )
}

const NavLink = ({ href, children }) => (
  <Link
    href={href}
    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
  >
    {children}
  </Link>
)

const MobileNavLink = ({ href, onClick, children }) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-sm font-medium transition-colors"
  >
    {children}
  </Link>
)

export default Navbar