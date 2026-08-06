import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { ArrowRight, Video, ImageIcon, Shield, Crop, Link as LinkIcon, Check } from 'lucide-react'

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">

      {/* Navbar (Kept exactly as you had it) */}
      <nav className="border-b border-white/10 backdrop-blur-md fixed w-full z-50 top-0 bg-black/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white text-black p-1.5 rounded-lg flex items-center justify-center">
              <Video size={20} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight">Void Vault</span>
          </div>

          <div className="flex items-center gap-4">
            {userId ? (
              <Link href="/home">
                <button className="bg-white text-black px-5 py-2 rounded-full font-semibold text-sm hover:bg-gray-200 transition-all active:scale-95">
                  Dashboard
                </button>
              </Link>
            ) : (
              <div className="flex items-center gap-6">
                <Link href="/sign-in" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/sign-up">
                  <button className="bg-white text-black px-5 py-2 rounded-full font-semibold text-sm hover:bg-gray-200 transition-all active:scale-95">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-40 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-neutral-900 border border-white/10 px-4 py-2 rounded-full text-xs font-medium text-blue-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            New: AI-Powered Subject Tracking
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 pb-2 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Media processing <br />
            reimagined.
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Compress heavy video files, generate smart social crops with AI, and share public vaults instantly. The ultimate developer-grade media toolkit.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={userId ? "/home" : "/sign-up"}>
              <button className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95">
                Start Creating Free <ArrowRight size={20} />
              </button>
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Explore features
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}