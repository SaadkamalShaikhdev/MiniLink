import dbConnect from "@/libs/dbConnect";
import UrlModel from "@/models/UrlModel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js"

export async function GET() {
   const session = await getServerSession(authOptions)
   await dbConnect();
   try {
    if (!session) {
        return new Response({
            success: false,
            message: "Unauthorized"
        }, {status: 401} )
    }
    const userEmail = session.user.email;
    const userUrls = await UrlModel.find({ email: userEmail });
    const totalLinks = userUrls.length;
    const totalClicks = userUrls.reduce((acc, url) => acc + (url.clicks || 0), 0);
    return new Response(JSON.stringify({
        success: true,
        data: {
            totalLinks,
            totalClicks,
            urls: userUrls,
            averageClicks: totalLinks > 0 ? (totalClicks / totalLinks) : 0,
            mostClicked: userUrls.reduce((max, url) => url.clicks > (max.clicks || 0) ? url : max, {})
        }
    }), {status: 200} )

   } catch (error) {
    return new Response({
        success: false,
        message: "An error occurred while fetching dashboard data", error
    }, {status: 500} )
   }
}