"use client";

import React, { useState } from 'react';
import { CldUploadWidget, getCldVideoUrl } from 'next-cloudinary';
import { Upload, Video, Download, Smartphone, Layout } from 'lucide-react';

const videoFormats = {
    "TikTok / IG Reels (9:16)": {
        width: 1080, height: 1920, aspectRatio: "9:16",
        uiClass: "aspect-[9/16] max-w-[280px] rounded-[2rem] border-[8px]"
    },
    "Instagram Square (1:1)": {
        width: 1080, height: 1080, aspectRatio: "1:1",
        uiClass: "aspect-square max-w-[360px] rounded-2xl border-4"
    },
    "Standard Web (16:9)": {
        width: 1920, height: 1080, aspectRatio: "16:9",
        uiClass: "aspect-video max-w-[480px] rounded-2xl border-4"
    },
};

type VideoFormat = keyof typeof videoFormats;

export default function VideoCropperPage() {
    const [uploadedVideoId, setUploadedVideoId] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<VideoFormat>("TikTok / IG Reels (9:16)");
    const [isProcessing, setIsProcessing] = useState(false);
    const [retryKey, setRetryKey] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!transformedVideoUrl) return;

        setIsDownloading(true);
        try {
            const response = await fetch(transformedVideoUrl);

            if (!response.ok) throw new Error("Failed to fetch video");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${selectedFormat.replace(/[^a-zA-Z0-9]/g, "_")}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Video is still rendering. Please wait a few seconds and try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const transformedVideoUrl = uploadedVideoId ? getCldVideoUrl({
        src: uploadedVideoId,
        width: videoFormats[selectedFormat].width,
        height: videoFormats[selectedFormat].height,
        crop: 'fill',
        gravity: 'auto',
        format: 'mp4'
    }) : null;

    const downloadUrl = transformedVideoUrl?.replace('/upload/', '/upload/fl_attachment/');

    return (
        <div className="container mx-auto p-4 max-w-5xl min-h-[calc(100vh-64px)] flex flex-col justify-center">

            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                    AI Video Cropper
                </h1>
                <p className="text-gray-500">Track subjects and convert landscape videos to vertical.</p>
            </div>

            <div className="bg-black border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8 flex flex-col justify-center">

                        {/* Upload Section */}
                        <div>
                            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                                <Upload className="w-4 h-4 text-blue-500" />
                                1. Upload Master Video
                            </h2>
                            <CldUploadWidget
                                uploadPreset="saas_uploads"
                                options={{ multiple: false, resourceType: "video" }}
                                onSuccess={(result: any) => {
                                    setIsProcessing(true);
                                    setUploadedVideoId(result.info.public_id);
                                }}
                            >
                                {({ open }) => (
                                    <div
                                        onClick={() => open?.()}
                                        className="border border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 border-white/20 hover:border-blue-500/50 hover:bg-blue-500/5 bg-neutral-900/50 cursor-pointer group"
                                    >
                                        <div className="bg-white/5 p-4 rounded-full mb-3 group-hover:bg-blue-500/20 transition-colors">
                                            <Video className="w-8 h-8 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <p className="text-white font-medium">Click to upload video</p>
                                        <p className="text-gray-500 text-sm mt-1">MP4, WebM, MOV</p>
                                    </div>
                                )}
                            </CldUploadWidget>
                        </div>

                        {/* Format Selection */}
                        <div className={uploadedVideoId ? "opacity-100 transition-opacity duration-500" : "opacity-30 pointer-events-none"}>
                            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                                <Layout className="w-4 h-4 text-blue-500" />
                                2. Choose Social Format
                            </h2>
                            <div className="relative">
                                <select
                                    className="w-full bg-neutral-900 border border-white/10 text-white rounded-lg px-4 py-4 focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer font-medium"
                                    value={selectedFormat}
                                    onChange={(e) => {
                                        setIsProcessing(true);
                                        setSelectedFormat(e.target.value as VideoFormat);
                                    }}
                                >
                                    {Object.keys(videoFormats).map((format) => (
                                        <option key={format} value={format} className="bg-black text-white">{format}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                                    <Smartphone size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Download Button */}
                        {transformedVideoUrl && (
                            <div className="pt-4 border-t border-white/5">
                                {isProcessing ? (
                                    <button
                                        disabled
                                        className="w-full bg-neutral-800 text-gray-500 px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                                    >
                                        <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                                        AI Rendering in Progress...
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleDownload}
                                        disabled={isDownloading}
                                        className="w-full bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-1 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:-translate-y-0"
                                    >
                                        {isDownloading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                                Downloading...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-5 h-5" />
                                                Download {selectedFormat.split(" ")[0]} Ready
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Mobile Device Preview */}
                    <div className="bg-neutral-900/30 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center min-h-[500px]">

                        <div className={`relative w-full bg-black border-neutral-800 shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-500 ${videoFormats[selectedFormat].uiClass}`}>

                            {/* Invisible loading overlay */}
                            {isProcessing && uploadedVideoId && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                    <p className="text-xs text-blue-500 font-medium uppercase tracking-widest animate-pulse">AI Cropping</p>
                                    <p className="text-xs text-blue-500 font-medium uppercase tracking-widest animate-pulse">May take a while...</p>
                                </div>
                            )}

                            {uploadedVideoId && transformedVideoUrl ? (
                                <video
                                    key={retryKey}
                                    src={`${transformedVideoUrl}?retry=${retryKey}`}
                                    autoPlay
                                    loop
                                    muted
                                    controls={false}
                                    className="w-full h-full object-cover"
                                    onCanPlay={() => setIsProcessing(false)}
                                    onError={() => {
                                        setTimeout(() => setRetryKey(prev => prev + 1), 3000);
                                    }}
                                />
                            ) : (
                                <div className="text-center space-y-4 opacity-40">
                                    <Smartphone className="w-10 h-10 mx-auto" />
                                    <p className="text-xs font-medium uppercase tracking-widest">Preview Area</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}