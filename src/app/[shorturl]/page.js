import { redirect } from "next/navigation"
import dbConnect from "@/libs/dbConnect"
import UrlModel from "@/models/UrlModel"

export default async function Page({ params }) {
  const { shorturl } = await params
  
  await dbConnect()
  const shortUrlFromDB = await UrlModel.findOne({ shortUrl: shorturl })
  
  if (shortUrlFromDB) {
    const updateClicks = await UrlModel.updateOne(
    { shortUrl: shorturl },
    { $inc: { clicks: 1 } }
  )
    redirect(shortUrlFromDB.url)
  
  } else {
    redirect(`${process.env.NEXT_PUBLIC_HOST}`)
  }
}