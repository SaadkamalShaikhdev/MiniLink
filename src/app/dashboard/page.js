"use client"
import React, { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Link2, TrendingUp, MousePointerClick, Activity, BarChart3,
  Copy, Check, Trash2, ExternalLink, Search, RefreshCw
} from "lucide-react"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Toaster, toast } from "react-hot-toast"

const MySwal = withReactContent(Swal)

const Dashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [data, setData] = useState([])
  const [totalClicks, setTotalClicks] = useState(0)
  const [totalLinks, setTotalLinks] = useState(0)
  const [averageClicks, setAverageClicks] = useState(0)
  const [mostClick, setMostClick] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [fetchError, setFetchError] = useState("")
  const [copiedLinks, setCopiedLinks] = useState({})
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/')
  }, [status, router])

  const getData = async (silent = false) => {
    try {
      silent ? setRefreshing(true) : setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/dashboardData`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json.data?.urls || [])
      setTotalClicks(json.data?.totalClicks || 0)
      setTotalLinks(json.data?.totalLinks || 0)
      setAverageClicks(json.data?.averageClicks?.toFixed(1) || '0.0')
      setMostClick(json.data?.mostClicked?.clicks || 0)
      setFetchError("")
    } catch (err) {
      setFetchError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') getData()
  }, [status])

  const deleteUrl = async (shortUrl) => {
    const result = await MySwal.fire({
      title: 'Delete this link?',
      text: "This can't be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    })
    if (!result.isConfirmed) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/dashboardData`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shortUrl }),
      })
      if (!res.ok) throw new Error()
      toast.success("Link deleted")
      getData(true)
    } catch {
      toast.error("Failed to delete")
    }
  }

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedLinks(prev => ({ ...prev, [id]: true }))
      toast.success("Copied!")
      setTimeout(() => setCopiedLinks(prev => ({ ...prev, [id]: false })), 2000)
    } catch {
      toast.error("Failed to copy")
    }
  }

  const filtered = data.filter(item =>
    item.shortUrl?.toLowerCase().includes(search.toLowerCase()) ||
    item.url?.toLowerCase().includes(search.toLowerCase())
  )

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const stats = [
    { label: 'Total Links', value: totalLinks, icon: <Link2 className="w-5 h-5" />, color: '#00BCD4', bg: '#e0f7fa' },
    { label: 'Total Clicks', value: totalClicks, icon: <MousePointerClick className="w-5 h-5" />, color: '#818CF8', bg: '#ede9fe' },
    { label: 'Avg. Clicks / Link', value: averageClicks, icon: <Activity className="w-5 h-5" />, color: '#34D399', bg: '#d1fae5' },
    { label: 'Most Clicked', value: mostClick, icon: <BarChart3 className="w-5 h-5" />, color: '#F59E0B', bg: '#fef3c7' },
  ]

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Toaster position="top-center" />

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt="avatar"
                width={44}
                height={44}
                className="rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ background: 'linear-gradient(135deg, #00E5FF, #818CF8)' }}>
                {session.user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {session.user?.name?.split(' ')[0]}'s Dashboard
              </h1>
              <p className="text-sm text-gray-400">{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="self-start sm:self-auto text-sm text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: bg, color }}>
                  {icon}
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-0.5"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {value}
              </p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Links section header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Your Links
            </h2>
            <p className="text-sm text-gray-400">{data.length} link{data.length !== 1 ? 's' : ''} total</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search links…"
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-300 w-48"
              />
            </div>
            {/* Refresh */}
            <button
              onClick={() => getData(true)}
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-cyan-500 hover:border-cyan-300 transition-all"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── Links list ── */}
        <div className="space-y-3">
          {loading ? (
            // Skeleton
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                  </div>
                  <div className="w-16 h-16 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))
          ) : fetchError ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <p className="text-red-500 font-medium">Failed to load links</p>
              <p className="text-red-400 text-sm mt-1">{fetchError}</p>
              <button onClick={() => getData()} className="mt-4 text-sm text-red-500 underline">Try again</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Link2 className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">{search ? 'No links match your search' : 'No links yet'}</p>
              <p className="text-gray-400 text-sm mt-1">{search ? 'Try a different keyword' : 'Go shorten a URL to get started'}</p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const id = item._id || item.id || index
              const shortFull = `${process.env.NEXT_PUBLIC_HOST}${item.shortUrl}`
              const date = new Date(item.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })

              return (
                <div
                  key={id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5"
                >
                  <div className="flex items-start gap-4">

                    {/* Left: URL info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-2">{date}</p>

                      {/* Short URL row */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className="text-sm font-bold truncate max-w-[260px]"
                          style={{ color: '#00BCD4' }}
                        >
                          {shortFull}
                        </span>
                        <button
                          onClick={() => copyToClipboard(shortFull, id)}
                          className="p-1.5 rounded-lg hover:bg-cyan-50 transition-colors flex-shrink-0"
                          title="Copy short URL"
                        >
                          {copiedLinks[id]
                            ? <Check className="w-3.5 h-3.5 text-emerald-500" />
                            : <Copy className="w-3.5 h-3.5 text-gray-400" />
                          }
                        </button>
                        <a
                          href={shortFull}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                          title="Open link"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                        </a>
                      </div>

                      {/* Original URL */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                        <p className="text-xs text-gray-400 truncate max-w-[320px] sm:max-w-[480px]">
                          {item.url}
                        </p>
                      </div>
                    </div>

                    {/* Right: clicks + delete */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold"
                        style={{ background: '#e0f7fa', color: '#00838f' }}
                      >
                        <MousePointerClick className="w-3.5 h-3.5" />
                        {item.clicks || 0}
                        <span className="text-xs font-normal opacity-70">clicks</span>
                      </div>
                      <button
                        onClick={() => deleteUrl(item.shortUrl)}
                        className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>
    </div>
  )
}

export default Dashboard