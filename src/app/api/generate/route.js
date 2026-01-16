import dbConnect from "@/libs/dbConnect"
import UrlModel from "@/models/UrlModel"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js"

export async function POST(request) {
  try {
    const body = await request.json();
    console.log(body)
    
    await dbConnect()
    
    // Get session (works for both logged-in and anonymous users)
    const session = await getServerSession(authOptions)
    
    // Check if shortUrl already exists (do this BEFORE creating)
    const existingShortUrl = await UrlModel.findOne({ shortUrl: body.shortUrl })
    if (existingShortUrl) {
      return Response.json({
        success: false,
        message: "Short URL already exists. Please try another."
      }, { status: 400 })
    }
    
    // Create new URL document
    const newData = new UrlModel({
      url: body.url,
      shortUrl: body.shortUrl,
      email: session?.user?.email || null, // Add email if user is logged in
    })
    
    const saved = await newData.save()
    
    if (!saved) {
      return Response.json({
        success: false,
        message: "Failed to save URL to database"
      }, { status: 500 })
    }
    
    return Response.json({
      success: true,
      message: session ? "URL generated successfully and saved to your account" : "URL generated successfully",
      data: {
        url: saved.url,
        shortUrl: saved.shortUrl
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error("Error in POST /api/url:", error)
    return Response.json({
      success: false,
      message: "An error occurred while processing your request"
    }, { status: 500 })
  }
}