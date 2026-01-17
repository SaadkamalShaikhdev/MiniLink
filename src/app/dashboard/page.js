"use client"
import React, { useEffect, useState } from 'react'
import { signOut, signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Link, TrendingUp, MousePointerClick, Activity, BarChart3 } from "lucide-react"

const Dashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState([])
  const [totalClicks, setTotalClicks] = useState(0)
  const [totalLinks, setTotalLinks] = useState(0)
  const [averageClicks, setAverageClicks] = useState(0)
  const [mostClick, setMostClick] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  const getData = async () => {
    try {
      setLoading(true)
      const fetchingData = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/dashboardData`)
      
      if (!fetchingData.ok) {
        throw new Error(`HTTP error! status: ${fetchingData.status}`)
      }
      
      const res = await fetchingData.json()
      console.log('API Response:', res) // Debug log
      
      // Data is inside res.data, not directly in res
      setData(res.data?.urls || [])
      setTotalClicks(res.data?.totalClicks || 0)
      setTotalLinks(res.data?.totalLinks || 0)
      setAverageClicks(res.data?.averageClicks || 0)
      setMostClick(res.data?.mostClicked?.clicks || 0)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      getData()
    }
  }, [status])
  
  if (status === 'loading') {
    return (
      <div className='min-h-screen w-full bg-gradient-to-br from-cyan-50 via-cyan-50 to-white flex items-center justify-center'>
        <p className='text-lg'>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-cyan-50 via-cyan-50 to-white'>
      <div className='max-w-7xl mx-auto px-4 py-12'>
        <h2 className='text-4xl font-bold mb-2'>Analytics Dashboard</h2>
        <p className='text-lg mb-10'>Monitor your link performance and engagement metrics</p>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between mb-3'>
              <div className='p-2 rounded-lg bg-cyan-50'>
                <Link className='text-cyan-500'/>
              </div>
              <TrendingUp className='h-5 w-5 text-green-500'/>
            </div>
            <p className='text-3xl font-bold text-gray-900 mb-1'>{totalLinks}</p>
            <p className='text-sm text-gray-600'>Total Links</p>
          </div>

          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between mb-3'>
              <div className='p-2 rounded-lg bg-cyan-50'>
                <MousePointerClick className='text-cyan-500'/>
              </div>
              <TrendingUp className='h-5 w-5 text-green-500'/>
            </div>
            <p className='text-3xl font-bold text-gray-900 mb-1'>{totalClicks}</p>
            <p className='text-sm text-gray-600'>Total Clicks</p>
          </div>

          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between mb-3'>
              <div className='p-2 rounded-lg bg-cyan-50'>
                <Activity className='text-cyan-500'/>
              </div>
              <TrendingUp className='h-5 w-5 text-green-500'/>
            </div>
            <p className='text-3xl font-bold text-gray-900 mb-1'>{averageClicks}</p>
            <p className='text-sm text-gray-600'>Avg. Clicks/Link</p>
          </div>

          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'>
            <div className='flex items-center justify-between mb-3'>
              <div className='p-2 rounded-lg bg-cyan-50'>
                <BarChart3 className='text-cyan-500'/>
              </div>
              <TrendingUp className='h-5 w-5 text-green-500'/>
            </div>
            <p className='text-3xl font-bold text-gray-900 mb-1'>{mostClick}</p>
            <p className='text-sm text-gray-600'>Most Clicked</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between my-6">
          <h3 className="text-2xl font-bold">All Links</h3>
          <div className="text-sm text-gray-600">{data.length} links total</div>
        </div>

        <div className='space-y-4'>
          {loading ? (
            <p className='text-center py-8 text-gray-600'>Loading links...</p>
          ) : error ? (
            <p className='text-center py-8 text-red-600'>Error: {error}</p>
          ) : data.length === 0 ? (
            <p className='text-center py-8 text-gray-600'>No links found</p>
          ) : (
            data.map((item, index) => (
              <div 
                key={item._id || item.id || index} 
                className='bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <p className='text-sm text-gray-500 mb-1'>
                      {new Date(item.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className='text-xs text-gray-500 mb-2'>Short URL</p>
                    <div className='flex items-center gap-2 mb-3'>
                      <span className='text-cyan-500 font-medium'>localhost:3000/{item.shortUrl}</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(`localhost:3000/${item.shortUrl}`)}
                        className='p-1 hover:bg-gray-100 rounded transition-colors'
                      >
                        <svg className='w-4 h-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                        </svg>
                      </button>
                    </div>
                    <div className='flex items-center gap-2'>
                      <p className='text-xs text-gray-500'>Original URL</p>
                      <a 
                        href={item.url} 
                        target='_blank' 
                        rel='noopener noreferrer'
                        className='p-1 hover:bg-gray-100 rounded transition-colors'
                      >
                        <svg className='w-4 h-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
                        </svg>
                      </a>
                    </div>
                    <p className='text-sm text-gray-700 mt-1'>{item.url}</p>
                  </div>
                  
                  <div className='flex flex-col items-center gap-3 ml-6'>
                    <div className='bg-cyan-50 flex flex-col items-center rounded-lg px-7 py-2 text-right border border-cyan-400'>
                      <div className='flex items-center justify-center gap-2'>
                        <svg className='w-5 h-5 text-cyan-500 mx-auto mb-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                      </svg>
                      <p className='text-2xl font-bold text-cyan-500'>{item.clicks || 0}</p>
                      </div>
                    
                      <p className='text-xs text-gray-600'>clicks</p>
                    </div>
                    <button 
                      onClick={() => {/* Add delete functionality */}}
                      className='p-2 hover:bg-red-50 rounded transition-colors'
                    >
                      <svg className='w-5 h-5 text-gray-400 hover:text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard