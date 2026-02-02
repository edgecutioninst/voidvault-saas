"use client";
import React, { useState, useEffect, useRef } from 'react'
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { Upload, Image as ImageIcon, Download, Loader2, Layout } from 'lucide-react';

const socialFormats = {
    "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
    "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
    "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
    "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
    "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
};

type socialFormat = keyof typeof socialFormats;

export default function SocialShare() {

    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<socialFormat>("Instagram Square (1:1)");
    const [isTransforming, setIsTransforming] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (uploadedImage) {
            setIsTransforming(true);
        }
    }, [selectedFormat, uploadedImage])

    const handleDownload = () => {
        if (!imageRef.current) return;

        fetch(imageRef.current.src)
            .then((res) => res.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${selectedFormat.replace(" ", "_")}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl min-h-[calc(100vh-64px)] flex flex-col justify-center">

            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                    Social Media Creator
                </h1>
                <p className="text-gray-500">Format images for any platform.</p>
            </div>

            <div className="bg-black border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8">

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <Upload className="w-4 h-4" />
                            Upload Image
                        </h2>

                        <CldUploadWidget
                            uploadPreset="saas_uploads"
                            options={{
                                multiple: false,
                                resourceType: "image"
                            }}
                            onSuccess={(result: any) => {
                                setUploadedImage(result.info.public_id);
                            }}
                        >
                            {({ open }) => {
                                return (
                                    <div
                                        onClick={() => open()}
                                        className="relative group cursor-pointer"
                                    >
                                        <div className={`border border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all duration-300 border-white/20 hover:border-white/50 hover:bg-white/5 bg-neutral-900/50`}>
                                            <div className="bg-white/5 p-3 rounded-full mb-3 group-hover:bg-white/10 transition-colors">
                                                <ImageIcon className="w-6 h-6 text-gray-300" />
                                            </div>
                                            <p className="text-gray-300 font-medium">Click to upload image</p>
                                            <p className="text-gray-600 text-sm mt-1">PNG, JPG, WebP</p>
                                        </div>
                                    </div>
                                );
                            }}
                        </CldUploadWidget>
                    </div>

                    {uploadedImage && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Replaced 'divider' with standard border */}
                            <div className="w-full h-px bg-white/10 my-8"></div>

                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                    <Layout className="w-4 h-4" />
                                    Choose Format
                                </h2>
                                <div className="relative">
                                    <select
                                        className="w-full bg-neutral-900 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-white/30 transition-all appearance-none cursor-pointer"
                                        value={selectedFormat}
                                        onChange={(e) => setSelectedFormat(e.target.value as socialFormat)}
                                    >
                                        {Object.keys(socialFormats).map((format) => (
                                            <option key={format} value={format} className="bg-black">
                                                {format}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                                        <Layout size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-neutral-900/50 rounded-xl p-4 border border-white/5 flex justify-center items-center min-h-[400px] relative overflow-hidden">
                                {isTransforming && (
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                                        <Loader2 className="w-10 h-10 text-white animate-spin mb-2" />
                                        <p className="text-gray-400 text-sm">Resizing with AI...</p>
                                    </div>
                                )}

                                <div className="relative shadow-2xl shadow-black">
                                    <CldImage
                                        width={socialFormats[selectedFormat].width}
                                        height={socialFormats[selectedFormat].height}
                                        src={uploadedImage}
                                        sizes="100vw"
                                        alt="transformed image"
                                        crop="fill"
                                        aspectRatio={socialFormats[selectedFormat].aspectRatio}
                                        gravity='auto'
                                        ref={imageRef}
                                        onLoad={() => setIsTransforming(false)}
                                        className="max-w-full max-h-[500px] object-contain rounded-sm"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    className="bg-white hover:bg-gray-200 text-black px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                    onClick={handleDownload}
                                    disabled={isTransforming}
                                >
                                    <Download className="w-5 h-5" />
                                    Download for {selectedFormat}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}