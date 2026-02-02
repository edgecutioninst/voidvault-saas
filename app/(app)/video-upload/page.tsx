"use client";
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast';
import { FileVideo, Type, AlignLeft, Loader2 } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

function VideoUpload() {

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [publicId, setPublicId] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(0);
    const [originalSize, setOriginalSize] = useState<string>('0');
    const [isSaving, setIsSaving] = useState(false);

    const router = useRouter();

    const handleUploadSuccess = (result: any) => {
        if (result.info) {
            setPublicId(result.info.public_id);
            setDuration(result.info.duration);
            setOriginalSize(result.info.bytes);
            toast.success("Video uploaded to cloud!", { style: { background: '#000', color: '#fff', border: '1px solid #333' } });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!publicId) {
            toast.error("Please upload a video first", { style: { background: '#000', color: '#fff', border: '1px solid #333' } });
            return;
        }

        setIsSaving(true);
        const loadingToast = toast.loading("Saving details...", { style: { background: '#000', color: '#fff', border: '1px solid #333' } });

        try {
            const res = await axios.post('/api/video-upload', {
                title,
                description,
                publicId,
                duration,
                originalSize
            });

            if (res.status === 200) {
                toast.dismiss(loadingToast);
                toast.success("Published successfully!", { style: { background: '#000', color: '#fff', border: '1px solid #333' } });
                router.push("/home");
            }

        } catch (error) {
            console.error(error);
            toast.dismiss(loadingToast);
            toast.error("Failed to save video details", { style: { background: '#000', color: '#fff', border: '1px solid #333' } });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl min-h-[calc(100vh-64px)] flex flex-col justify-center">

            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Upload Video</h1>
                <p className="text-gray-500">Add to your collection.</p>
            </div>

            <div className="bg-black border border-white/10 rounded-2xl shadow-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Title */}
                    <div>
                        <label className="text-gray-400 font-medium flex items-center gap-2 mb-2 text-sm uppercase tracking-wider">
                            <Type size={14} /> Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/10 text-white focus:outline-none focus:border-white/30 rounded-lg px-4 py-3 transition-all"
                            placeholder="Video title"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-gray-400 font-medium flex items-center gap-2 mb-2 text-sm uppercase tracking-wider">
                            <AlignLeft size={14} /> Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-32 bg-neutral-900 border border-white/10 text-white focus:outline-none focus:border-white/30 resize-none rounded-lg px-4 py-3 transition-all"
                            placeholder="Video description"
                        />
                    </div>

                    {/* Upload Widget */}
                    <div>
                        <label className="text-gray-400 font-medium flex items-center gap-2 mb-2 text-sm uppercase tracking-wider">
                            <FileVideo size={14} /> Video File
                        </label>

                        <CldUploadWidget
                            uploadPreset="saas_uploads"
                            onSuccess={handleUploadSuccess}
                            options={{
                                resourceType: "video",
                                clientAllowedFormats: ["mp4", "mov"],
                                maxFileSize: 100000000,
                                theme: "minimal"
                            }}
                        >
                            {({ open }) => {
                                return (
                                    <div
                                        onClick={() => open()}
                                        className={`border border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 
                                            ${publicId ? 'border-green-500/50 bg-green-500/5' : 'border-white/20 hover:border-white/40 hover:bg-white/5 bg-neutral-900/30'}
                                        `}
                                    >
                                        {publicId ? (
                                            <div className="text-center">
                                                <div className="bg-green-500/10 p-3 rounded-full mb-3 mx-auto w-fit">
                                                    <FileVideo className="w-6 h-6 text-green-500" />
                                                </div>
                                                <p className="text-white font-medium">Upload Complete!</p>
                                                <p className="text-gray-500 text-sm mt-1">{(Number(originalSize) / (1024 * 1024)).toFixed(2)} MB</p>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <div className="bg-white/5 p-3 rounded-full mb-3 mx-auto w-fit">
                                                    <FileVideo className="w-6 h-6 text-gray-300" />
                                                </div>
                                                <p className="text-gray-300 font-medium">Click to upload video</p>
                                                <p className="text-gray-500 text-xs mt-1">Supports MP4, MOV up to 100MB</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            }}
                        </CldUploadWidget>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white hover:bg-neutral-200 active:scale-95 text-black py-3 text-lg font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white flex justify-center items-center"
                        disabled={!publicId || isSaving}
                    >
                        {isSaving ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin w-5 h-5" /> Saving...
                            </div>
                        ) : (
                            "Publish Video"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VideoUpload;