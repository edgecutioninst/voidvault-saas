import React from 'react';
import { notFound } from 'next/navigation';
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { getCldVideoUrl } from 'next-cloudinary';
import { Play } from 'lucide-react';
import Link from 'next/link';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function PublicVideoPage({ params }: { params: Promise<{ id: string }> }) {

    const resolvedParams = await params;
    const videoId = resolvedParams.id;

    const video = await prisma.video.findUnique({
        where: {
            id: videoId
        }
    });

    if (!video) return notFound();


    const videoUrl = getCldVideoUrl({
        src: video.publicId,
        width: 1920,
        height: 1080
    });

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full space-y-6">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-white tracking-tight">{video.title}</h1>
                    {video.description && (
                        <p className="text-neutral-400">{video.description}</p>
                    )}
                </div>

                {/* Video Player */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10 bg-neutral-900 aspect-video">
                    <video
                        src={videoUrl}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Branding Footer */}
                <div className="pt-8 flex justify-center">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300"
                    >
                        <Play className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                        <span className="text-gray-400 group-hover:text-white text-sm font-medium transition-colors">
                            Powered by <strong className="text-white">Void Vault</strong> <span className="mx-1 opacity-50">•</span> Create your own
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}