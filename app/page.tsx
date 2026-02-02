import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { ArrowRight, Video, ImageIcon, Zap, Shield } from 'lucide-react'

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">

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

      <main className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-neutral-900 border border-white/10 px-4 py-2 rounded-full text-xs font-medium text-gray-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Now leveraging Cloudinary AI
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 pb-2 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Media processing <br />
            reimagined.
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Compress videos by up to 80% without losing quality. Resize images for any social platform instantly. The ultimate toolkit for content creators.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={userId ? "/home" : "/sign-up"}>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/20 active:scale-95">
                Start Creating Free <ArrowRight size={20} />
              </button>
            </Link>
            <a href="#features" className="text-gray-400 hover:text-white font-medium px-6 py-4 transition-colors">
              See how it works
            </a>
          </div>
        </div>
      </main>

      <section id="features" className="py-24 bg-neutral-950/50 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black border border-white/10 p-8 rounded-2xl hover:border-white/20 transition-all group">
              <div className="bg-blue-500/10 w-12 h-12 flex items-center justify-center rounded-xl mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Zap className="text-blue-500" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Compression</h3>
              <p className="text-gray-500 leading-relaxed">
                Upload huge video files and let our AI reduce the file size by up to 80% while maintaining crisp 1080p quality.
              </p>
            </div>

            <div className="bg-black border border-white/10 p-8 rounded-2xl hover:border-white/20 transition-all group">
              <div className="bg-purple-500/10 w-12 h-12 flex items-center justify-center rounded-xl mb-6 group-hover:bg-purple-500/20 transition-colors">
                <ImageIcon className="text-purple-500" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Social Resizing</h3>
              <p className="text-gray-500 leading-relaxed">
                Perfectly crop images for Instagram Stories, Twitter Headers, and LinkedIn posts in one click.
              </p>
            </div>

            <div className="bg-black border border-white/10 p-8 rounded-2xl hover:border-white/20 transition-all group">
              <div className="bg-green-500/10 w-12 h-12 flex items-center justify-center rounded-xl mb-6 group-hover:bg-green-500/20 transition-colors">
                <Shield className="text-green-500" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Storage</h3>
              <p className="text-gray-500 leading-relaxed">
                Your content is stored safely in the cloud with enterprise-grade security and instant global delivery.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}