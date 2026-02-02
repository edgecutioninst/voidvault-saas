"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
    LogOutIcon,
    MenuIcon,
    LayoutDashboardIcon,
    Share2Icon,
    UploadIcon,
    ImageIcon,
    X,
} from "lucide-react";

const sidebarItems = [
    { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
    { href: "/social-share", icon: Share2Icon, label: "Social Share" },
    { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useClerk();
    const { user } = useUser();

    const handleLogoClick = () => {
        router.push("/");
    };

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <div className="flex h-screen bg-black text-white overflow-hidden">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-md"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-6 h-16 border-b border-white/5">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
                            <ImageIcon className="w-8 h-8 text-blue-500" />
                            <span className="font-bold text-xl tracking-tight text-white">Void Vault</span>
                        </div>
                        <button className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-grow p-4 space-y-2 overflow-y-auto custom-scrollbar">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ${pathname === item.href
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                        : "text-neutral-500 hover:bg-white/5 hover:text-white"
                                    }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {user && (
                        <div className="p-4 border-t border-white/5 bg-black">
                            <button
                                onClick={handleSignOut}
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-500/80 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all font-medium"
                            >
                                <LogOutIcon size={18} />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            <div className="flex-grow flex flex-col min-w-0 h-full overflow-hidden">
                <header className="h-16 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-30">
                    <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
                        <button
                            className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-white"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <MenuIcon />
                        </button>

                        <div className="flex items-center ml-auto space-x-4">
                            {user && (
                                <>
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className="text-sm font-medium text-white truncate max-w-[150px]">
                                            {user.username || user.emailAddresses[0].emailAddress}
                                        </span>
                                    </div>
                                    <div className="w-9 h-9 rounded-full border border-white/10 overflow-hidden ring-2 ring-white/5">
                                        <img
                                            src={user.imageUrl}
                                            className="w-full h-full object-cover"
                                            alt="Profile"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-grow overflow-y-auto p-4 lg:p-8 custom-scrollbar bg-black">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}