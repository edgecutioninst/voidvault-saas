"use client"
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import Link from 'next/link'
import VideoCard from '@/components/VideoCard'
import { Video } from '@/app/generated/prisma/client'
import toast from 'react-hot-toast'
import { FileUp, Loader2, Video as VideoIcon } from 'lucide-react'

function Home() {

    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<String | null>(null);

    const fetchVideos = useCallback(async () => {
        try {
            const res = await axios.get('/api/videos')
            if (Array.isArray(res.data)) {
                setVideos(res.data);
            } else {
                throw new Error("Failed to fetch videos")
            }
        } catch (error: any) {
            console.error(error);
            setError(error.message);
            toast.error(error?.response?.data?.message || "Failed to load videos")
        } finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos])

    const handleDownload = useCallback((url: string, title: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${title}.mp4`);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 lg:p-8">

            <div className="flex items-center gap-2 mb-8">
                <VideoIcon className="w-8 h-8 text-blue-500" />
                <h1 className="text-3xl font-bold tracking-tight text-white">Latest Videos</h1>
            </div>

            {videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-12 p-12 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="bg-blue-500/10 p-4 rounded-full mb-4">
                        <FileUp className="w-12 h-12 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">No videos yet</h3>
                    <p className="text-gray-400 mb-6 text-center max-w-sm">
                        It looks like our gallery is empty. Be the first creator to share something awesome!
                    </p>
                    <Link
                        href="/video-upload"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 active:scale-95"
                    >
                        <FileUp className="w-4 h-4" />
                        Upload Video
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((video: Video) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            onDownload={handleDownload}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;