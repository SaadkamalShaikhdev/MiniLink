"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { LinkIcon, Copy, Check } from 'lucide-react'

const Shorten = () => {
    const [url, seturl] = useState("")
    const [shortUrl, setshortUrl] = useState("")
    const [generated, setgenerated] = useState("")
    const [copied, setCopied] = useState(false)

    const generate = async () => {
        if (!url) {
            toast.error("Please enter a URL")
            return
        }
        if (!shortUrl) {
            toast.error("Please enter a Preferred short URL Text")
            return
        }
        if (shortUrl.includes(" ") || url.includes(" ")) {
            toast.error("Preferred short URL Text cannot contain spaces")
            return
        }
        if (!url.includes("http://") && !url.includes("https://")) {
            toast.error("Please enter a valid URL with http:// or https://")
            return
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "url": url,
            "shortUrl": shortUrl
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/generate`, requestOptions)
            const result = await response.json()
            if (result.success) {
                toast.success(result.message)
                setgenerated(`${process.env.NEXT_PUBLIC_HOST}${shortUrl}`)
                setshortUrl("")
                seturl("")
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        }
    }

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            toast.success("Copied to clipboard!")
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error("Failed to copy")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 py-8 md:py-16">
            <Toaster />
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4">
                        Shorten Your URLs
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                        Create custom short links with advanced analytics and tracking.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 md:p-8 pb-0">
                        <div className="flex items-center gap-3 mb-2">
                            <LinkIcon className="w-6 h-6 text-cyan-500" />
                            <p className="font-bold text-xl md:text-2xl text-gray-800">Generate Short URL</p>
                        </div>
                        <p className="text-gray-600">Enter your long URL and create a custom short link</p>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col gap-6">
                        <div>
                            <label className="block font-medium text-gray-700 mb-2" htmlFor="url">Long URL <span className="text-red-400">*</span></label>
                            <input
                                value={url}
                                onChange={(e) => seturl(e.target.value)}
                                type="url"
                                className="px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 border border-gray-200 rounded-lg transition-all"
                                placeholder='https://example.com/very-long-url'
                            />
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700 mb-2" htmlFor="short">Custom Short URL</label>
                            <div className="flex gap-2 flex-col sm:flex-row">
                                <span className="text-sm text-gray-500 px-3 py-3 bg-gray-100 border border-gray-200 rounded-lg flex-shrink-0 flex items-center">{process.env.NEXT_PUBLIC_HOST}</span>
                                <input
                                    value={shortUrl}
                                    onChange={(e) => setshortUrl(e.target.value)}
                                    type="text"
                                    className='px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50 rounded-lg w-full border border-gray-200 transition-all'
                                    placeholder='my-short-link'
                                />
                            </div>
                        </div>

                        {generated && <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                            <div className="flex items-center gap-2 mb-2">
                                <Check className="w-5 h-5 text-green-500" />
                                <span className='font-semibold text-green-800'>Your Short Link</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white rounded border p-3">
                                <code className="flex-1 text-cyan-600 font-mono text-sm break-all">
                                    <Link target='_blank' href={generated} className="hover:underline"> {generated}</Link>
                                </code>
                                <button onClick={() => copyToClipboard(generated)} className="p-2 hover:bg-gray-100 rounded transition-colors">
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                                </button>
                            </div>
                        </div>}

                        <button
                            onClick={generate}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl transition-all text-white shadow-lg cursor-pointer font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <LinkIcon className="w-5 h-5" />
                            Shorten URL
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shorten
