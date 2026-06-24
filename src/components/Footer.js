import React from 'react'
import Link from 'next/link'
import { Github, Twitter, Mail } from 'lucide-react'

const Footer = () => {
  return (
     <footer className="bg-[#0A0F1E] border-t border-white/[0.06] py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <h3
                className="text-2xl font-extrabold mb-3"
                style={{
                  background: "linear-gradient(90deg, #00E5FF, #818CF8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                MiniLink
              </h3>
              <p className="text-[#8892A4] text-sm leading-relaxed mb-5 max-w-xs">
                The fastest way to shorten URLs and track real-time analytics. Simple, secure, and reliable.
              </p>
              <div className="flex gap-4">
                {[Github, Twitter, Mail].map((Icon, i) => (
                  <a key={i} href="#" className="text-[#8892A4] hover:text-[#00E5FF] transition-colors">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Product</h4>
              <ul className="space-y-2.5">
                {[["Home", "/"], ["Shorten URL", "/shorten"], ["Dashboard", "/dashboard"]].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-[#8892A4] hover:text-white text-sm transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Support</h4>
              <ul className="space-y-2.5">
                {["Help Center", "API Docs", "Contact Us"].map((label) => (
                  <li key={label}>
                    <a href="#" className="text-[#8892A4] hover:text-white text-sm transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[#8892A4] text-sm">
              © {new Date().getFullYear()} MiniLink. All rights reserved.
            </p>
            <p className="text-[#8892A4] text-xs">Built with ❤️ for the web</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer
