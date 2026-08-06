/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react'
import { getCldVideoUrl } from 'next-cloudinary'
import { Download, Clock, FileDown, FileUp, Play,Loader2, Link as LinkIcon, Trash2 } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { filesize } from 'filesize'
import toast from 'react-hot-toast'
import { Video } from '@/app/generated/prisma/client'
import Image from 'next/image'

dayjs.extend(relativeTime)

interface VideoCardProps {
    video: Video
    onDownload: (url: string, title: string) => void
    onDelete: (id: string) => Promise<void>
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload, onDelete }) => {

    const [isHovered, setIsHovered] = useState(false);
    const [previewError, setPreviewError] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const getThumbnailUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 400,
            height: 225,
            crop: 'fill',
            gravity: 'auto',
            format: 'jpg',
            quality: 'auto',
            assetType: 'video'
        })
    }, [])

    const getFullVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 1920,
            height: 1080
        })
    }, [])

    const getPreviewVideoUrl = useCallback((publicId: string) => {
        return getCldVideoUrl({
            src: publicId,
            width: 400,
            height: 225,
            rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"]
        })
    }, [])

    const formatSize = useCallback((size: number) => {
        return filesize(size)
    }, [])

    const formatDuration = useCallback((seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreviewError(false);
    }, [isHovered]);

    const handlePreviewError = () => {
        setPreviewError(true);
    };

    const handleCopyLink = () => {
        const shareUrl = `${window.location.origin}/v/${video.id}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };


    return (
        <div
            className="group relative bg-black border border-white/10 rounded-xl overflow-hidden transition-colors duration-200 hover:border-white/30"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <figure className="aspect-video relative overflow-hidden bg-neutral-900">
                {isHovered ? (
                    previewError ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-800 text-gray-500 gap-2">
                            <Play size={32} className="opacity-50" />
                            <p className="text-xs">Preview unavailable</p>
                        </div>
                    ) : (
                        <video
                            src={getPreviewVideoUrl(video.publicId)}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={handlePreviewError}
                        />  
                    )
                ) : (
                    <Image
                        src={getThumbnailUrl(video.publicId)}
                        alt={video.title}
                        fill
                        className="object-cover"
                        />
                )}

                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md text-xs font-medium text-white flex items-center gap-1">
                    <Clock size={12} />
                    {formatDuration(video.duration)}
                </div>
            </figure>

            <div className="p-5 flex flex-col gap-4">
                <div>
                    <h2 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-gray-300 transition-colors">
                        {video.title}
                    </h2>

                    <p className="text-sm text-neutral-500 line-clamp-2 min-h-10">
                        {video.description || "No description provided."}
                    </p>

                    <p className="text-xs text-neutral-600 mt-2 font-mono">
                        Uploaded {dayjs(video.createdAt).fromNow()}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-neutral-900/50 rounded-lg p-3 border border-white/5">
                    <div className="flex flex-col gap-1 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-neutral-500 text-[10px] uppercase tracking-tighter font-bold">
                            <FileUp size={11} /> Original
                        </div>

                        <div className="text-sm text-neutral-300 font-mono">
                            {formatSize(Number(video.originalSize))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 text-center border-l border-white/5">
                        <div className="flex items-center justify-center gap-1.5 text-neutral-500 text-[10px] uppercase tracking-tighter font-bold">
                            <FileDown size={11} /> Compressed
                        </div>

                        <div className="text-sm text-neutral-300 font-mono">
                            {video.compressedUrl
                                ? formatSize(Number(video.compressedSize))
                                : (
                                    <span className="text-xs text-neutral-500">
                                        Cannot be compressed further
                                    </span>
                                )
                            }
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/5">

                    <div className="flex items-center gap-2">

                        {/* Copy Link */}
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center justify-center p-2.5 rounded-lg bg-neutral-900 border border-white/10 hover:bg-neutral-800 transition-colors text-gray-400 hover:text-white"
                            title="Copy Public Link"
                        >
                            <LinkIcon className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                            onClick={async () => {
                                setIsDeleting(true);

                                try {
                                    await onDelete(video.id);
                                } finally {
                                    setIsDeleting(false);
                                }
                            }}
                            disabled={isDeleting}
                            className="flex items-center justify-center p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Video"
                        >
                            {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                        </button>

                    </div>

                    {/* Download */}
                    <button
                        className="flex items-center gap-2 bg-white hover:bg-neutral-200 text-black px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200"
                        onClick={() =>
                            onDownload(
                                video.compressedUrl || getFullVideoUrl(video.publicId),
                                video.title
                            )
                        }
                    >
                        <Download size={16} />
                        Download
                    </button>

                </div>
            </div>
        </div>
    );
}

export default VideoCard;