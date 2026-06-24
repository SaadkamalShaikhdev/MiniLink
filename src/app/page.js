"use client"
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import { LinkIcon, Copy, Check, Zap, BarChart3, Shield, ArrowRight, Github, Twitter, Mail } from "lucide-react";

// ─── Animated typing hook ────────────────────────────────────────────────────
function useTypingEffect(text, speed = 60) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return displayed;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("minilink.app/");

  const displayedPreview = useTypingEffect(preview, 40);

  // Update preview as user types
  useEffect(() => {
    setPreview(`minilink.app/${shortUrl || "my-link"}`);
  }, [shortUrl]);

  const generate = async () => {
    if (!url) { toast.error("Please enter a URL"); return; }
    if (!shortUrl) { toast.error("Please choose a short URL"); return; }
    if (shortUrl.includes(" ") || url.includes(" ")) { toast.error("No spaces allowed"); return; }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      toast.error("URL must start with http:// or https://"); return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, shortUrl }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setGenerated(`${process.env.NEXT_PUBLIC_HOST}${shortUrl}`);
        setUrl("");
        setShortUrl("");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <main className="bg-[#F0FBFF] min-h-screen font-[Inter,sans-serif]">
      <Toaster position="top-center" />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0F1E] relative overflow-hidden">
        {/* Subtle grid backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#00E5FF 1px, transparent 1px), linear-gradient(90deg, #00E5FF 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 right-0 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 pt-24 pb-32 text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-[#00E5FF] text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-8">
            <Zap className="w-3 h-3" /> Fast · Free · Trackable
          </span>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Turn long links{" "}
            <span
              className="block mt-1"
              style={{
                background: "linear-gradient(90deg, #00E5FF, #818CF8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              into tiny ones.
            </span>
          </h1>

          <p className="text-[#8892A4] text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Paste any URL, pick a custom slug, and share a link that's clean, clickable, and tracked.
          </p>

          {/* ── LIVE DEMO CARD ─────────────────────────────────────────── */}
          <div className="bg-[#1A2235] rounded-2xl border border-white/[0.07] shadow-2xl p-6 sm:p-8 text-left max-w-2xl mx-auto">
            {/* Animated preview strip */}
            <div className="flex items-center gap-3 mb-6 bg-[#0A0F1E] rounded-lg px-4 py-3 border border-white/[0.06]">
              <span className="text-[#00E5FF] text-xs font-mono opacity-60">→</span>
              <span className="text-[#00E5FF] font-mono text-sm tracking-wide flex-1 truncate">
                {displayedPreview}
                <span className="animate-pulse">|</span>
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {/* Long URL input */}
              <div>
                <label className="block text-xs font-semibold text-[#8892A4] uppercase tracking-wider mb-1.5">
                  Long URL
                </label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generate()}
                  type="url"
                  className="w-full bg-[#0A0F1E] border border-white/10 text-white placeholder-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00E5FF]/60 transition-colors"
                  placeholder="https://example.com/very/long/url/that/nobody-wants-to-share"
                />
              </div>

              {/* Short slug row */}
              <div>
                <label className="block text-xs font-semibold text-[#8892A4] uppercase tracking-wider mb-1.5">
                  Custom Slug
                </label>
                <div className="flex items-stretch gap-0 rounded-lg overflow-hidden border border-white/10 focus-within:border-[#00E5FF]/60 transition-colors">
                  <span className="bg-white/[0.04] text-[#8892A4] text-sm px-3 flex items-center border-r border-white/10 whitespace-nowrap flex-shrink-0">
                    {process.env.NEXT_PUBLIC_HOST || "minilink.app/"}
                  </span>
                  <input
                    value={shortUrl}
                    onChange={(e) => setShortUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && generate()}
                    type="text"
                    className="flex-1 bg-[#0A0F1E] text-white placeholder-white/20 px-3 py-3 text-sm focus:outline-none min-w-0"
                    placeholder="my-link"
                  />
                </div>
              </div>

              {/* Generated result */}
              {generated && (
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Link ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-[#00E5FF] font-mono text-sm break-all">
                      <Link href={generated} target="_blank" className="hover:underline underline-offset-2">
                        {generated}
                      </Link>
                    </code>
                    <button
                      onClick={() => copyToClipboard(generated)}
                      className="p-2 rounded hover:bg-white/10 transition-colors flex-shrink-0"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#8892A4]" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={generate}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-[#0A0F1E] text-sm transition-all disabled:opacity-50"
                style={{
                  background: loading
                    ? "#8892A4"
                    : "linear-gradient(90deg, #00E5FF, #818CF8)",
                  boxShadow: loading ? "none" : "0 0 24px rgba(0,229,255,0.25)",
                }}>
                {loading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-[#0A0F1E]/40 border-t-[#0A0F1E] rounded-full" />
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4" />
                    Shorten URL
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-3 divide-x divide-gray-100 text-center">
          {[
            { num: "2M+", label: "Links created" },
            { num: "98ms", label: "Avg. redirect time" },
            { num: "99.9%", label: "Uptime" },
          ].map(({ num, label }) => (
            <div key={label} className="px-4">
              <p
                className="text-2xl sm:text-3xl font-extrabold mb-1"
                style={{
                  background: "linear-gradient(90deg, #00BCD4, #818CF8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                {num}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <p className="text-center text-xs font-semibold text-[#00BCD4] uppercase tracking-widest mb-3">Why MiniLink</p>
        <h2
          className="text-center text-3xl sm:text-4xl font-extrabold text-[#0A0F1E] mb-14"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Everything you need, nothing you don't.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-5 h-5" />,
              title: "Instant shortening",
              body: "Shorten any URL in under a second. No account required to get started.",
              accent: "#00E5FF",
            },
            {
              icon: <BarChart3 className="w-5 h-5" />,
              title: "Click analytics",
              body: "See exactly how many times your link was clicked, tracked in real time on your dashboard.",
              accent: "#818CF8",
            },
            {
              icon: <Shield className="w-5 h-5" />,
              title: "Custom slugs",
              body: "Pick a memorable slug instead of random characters. Your brand, your link.",
              accent: "#34D399",
            },
          ].map(({ icon, title, body, accent }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm hover:shadow-md transition-shadow group">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${accent}18`, color: accent }}>
                {icon}
              </div>
              <h3
                className="text-lg font-bold text-[#0A0F1E] mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="bg-[#0A0F1E] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-[#00E5FF] uppercase tracking-widest mb-3">How it works</p>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-white mb-14"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Three steps, done.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            {[
              { step: "01", title: "Paste your URL", body: "Drop in any link — blog post, product page, Google doc, whatever." },
              { step: "02", title: "Pick a slug", body: "Choose a short, memorable name. We'll tell you if it's taken." },
              { step: "03", title: "Share & track", body: "Copy your link and watch clicks roll in on your analytics dashboard." },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex flex-col gap-3">
                <span
                  className="text-5xl font-black leading-none"
                  style={{
                    background: "linear-gradient(90deg, #00E5FF, #818CF8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                  {step}
                </span>
                <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {title}
                </h3>
                <p className="text-[#8892A4] text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-[#0A0F1E] mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Ready to shorten?
          </h2>
          <p className="text-gray-500 mb-8 text-lg">Free forever. No credit card. No nonsense.</p>
          <Link href="/shorten">
            <button
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-[#0A0F1E] text-base transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(90deg, #00E5FF, #818CF8)",
                boxShadow: "0 0 32px rgba(0,229,255,0.3)",
              }}>
              Start shortening <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
     

      {/* Font import via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');
      `}</style>
    </main>
  );
}