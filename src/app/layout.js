import { Geist, Geist_Mono,Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthProvider";
import { Analytics } from "@vercel/analytics/next"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],

});

const poppins =Poppins({
  variable:  "--font-poppins",
  weight: ["100","200","300",'400',"500","600","700","800","900"],
  subsets: ["latin"]
})
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bitlinks - Your Trusted URL Shortener",
  description: "Bitlinks helps you shorten your url easily.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Analytics/>
      <AuthProvider>
      <body
        className={`${poppins.className} ${geistSans.variable} antialiased`}
      ><Navbar/>
        {children}
      </body>
      </AuthProvider>
    </html>
  );
}
