"use client"
import Link from 'next/link'
import React, { useState } from 'react'

const Shorten = () => {
    const [url, seturl] = useState("")
    const [shortUrl, setshortUrl] = useState("")
    const [generated, setgenerated] = useState("")

    const generate = (()=>{
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

fetch("http://localhost:3000/api/generate", requestOptions)
  .then((response) => response.json())
  .then((result) =>{ alert(result.message)
 setgenerated(`${process.env.NEXT_PUBLIC_HOST}${shortUrl}`)
  setshortUrl("")
  seturl("")
  })
  .catch((error) => console.error(error));
 
    })
    
  return (
    <div className='md:mx-auto max-w-2xl mx-4 bg-purple-100 my-16 rounded-2xl flex flex-col gap-4 p-8'>
      <h1 className='text-2xl font-bold'>Generate your short URLs</h1>
      <div className='flex flex-col gap-3'>
        <input value={url} name='url' className='px-4 py-3 focus:outline-purple-600 bg-purple-50 rounded-md' type="text" placeholder='Enter your URL' 
        onChange={(e)=>seturl(e.target.value)} />

        <input type="text" className='px-4 py-3 focus:outline-purple-600 bg-purple-50 rounded-b-md'
         placeholder='Enter your Preferred short URL Text' 
         onChange={(e)=>setshortUrl(e.target.value)} value={shortUrl} />
        <button onClick={()=>generate()} className='bg-purple-400 shaow-lg px-3 py-2 font-bold cursor-pointer hover:bg-[#cb8dff] rounded-lg text-white'>Generate</button>
      </div>
      {generated &&<div className='flex flex-col gap-2'>
      <span className='font-bold text-lg'>Your Link</span><code> <Link target='_blank' href={generated}> {generated}</Link></code>  </div>}
     
    </div>
  )
}

export default Shorten
