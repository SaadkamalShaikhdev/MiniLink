"use client"
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Toaster,toast } from "react-hot-toast";

export default function Home() {
     const [url, seturl] = useState("")
      const [shortUrl, setshortUrl] = useState("")
      const [generated, setgenerated] = useState("")

        const generate = ( async()=>{
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

const a = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/generate`, requestOptions)
  const res = await a.json()
  if(res.success){
toast.success(res.message)
setgenerated(`${process.env.NEXT_PUBLIC_HOST}${shortUrl}`)
  setshortUrl("")
  seturl("")
  }else{
    toast.error(res.message)
  }
        })
  return (
   <main className="min-h-screen bg-gradient-to-br from-cyan-150 via-cyan-50 to-white">
    <Toaster/>
     <div className="max-w-6xl mx-auto px-4 py-12">
      
    <h1 className="text-center text-4xl md:text-5xl font-extrabold 
bg-gradient-to-r from-[#0bc3eb] via-cyan-400 to-blue-500
bg-clip-text text-transparent mb-2">Make Your Link Shorter</h1>
<p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-12">Transform long, complex URLs into short, shareable links in seconds. Track clicks and manage all your links in one place.</p>
<div className="md:max-w-3/4 bg-white rounded-2xl mx-auto">
<div className="p-6 pb-0">
  <p className="font-bold text-2xl">Shorten Your URL</p>
  <p className="">Paste Your Long URl below</p>
</div>
<div className="p-6 flex flex-col gap-2">
  <label className="block font-medium text-gray-700" htmlFor="long">Long URL <span className="text-red-400">*</span></label>
    <input   onChange={(e)=>seturl(e.target.value)} type="text" className="px-4 py-3 w-full focus:outline-cyan-600 bg-white border border-gray-300 rounded-md" placeholder='Enter your URL' />
      <label className="block font-medium text-gray-700" htmlFor="long">Preffered URL</label>
<div className="flex gap-2 md:flex-row flex-col">
  <span className="text-sm text-gray-500 px-3 py-3 bg-gray-50 border border-gray-300 rounded-xl">{process.env.NEXT_PUBLIC_HOST}</span>
   <input   onChange={(e)=>setshortUrl(e.target.value)} type="text" className='px-4 py-3 focus:outline-cyan-600 bg-white rounded-b-md w-full border border-gray-300 rounded-md'
         placeholder='Enter your Preferred short URL Text' />
</div>
{generated &&<div className='flex flex-col gap-2'>
      <span className='font-bold text-lg'>Your Link</span><code> <Link target='_blank' href={generated}> {generated}</Link></code>  </div>}
<button onClick={()=>generate()} className="flex w-fit items-center gap-2 px-6 py-3 rounded-lg transition-all text-white shadow-md cursor-pointer font-bold bg-gradient-to-r from-[#21cbf1] to-cyan-500">
  Shorten URL
</button>
</div>
</div>
</div>
  </main>
  );
}
