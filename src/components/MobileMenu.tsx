"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/Button";

export default function MobileMenu({ user, isAdmin }: { user: any, isAdmin: boolean }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="relative z-[60]">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {/* Backdrop Blur Layer (Optional, for content below) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-[50]"
                    onClick={toggleMenu}
                />
            )}

            {/* Glass Curtain Menu */}
            <div className={`fixed top-16 left-0 w-full bg-black/80 backdrop-blur-2xl border-b border-white/10 z-[55] transition-all duration-300 ease-in-out transform origin-top ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}>
                <div className="flex flex-col p-6 space-y-4">
                    <Link href="/" onClick={toggleMenu} className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 group-hover:scale-110 transition-transform">
                            🏠
                        </div>
                        <span className="text-xl font-medium">Home</span>
                    </Link>

                    <Link href="/browse" onClick={toggleMenu} className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all">
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                            📚
                        </div>
                        <span className="text-xl font-medium">Browse Semesters</span>
                    </Link>

                    {user && (
                        <Link href="/dashboard" onClick={toggleMenu} className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all">
                            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                                📊
                            </div>
                            <span className="text-xl font-medium">Dashboard</span>
                        </Link>
                    )}

                    {isAdmin && (
                        <Link href="/admin" onClick={toggleMenu} className="group flex items-center gap-4 p-4 rounded-xl hover:bg-red-500/10 transition-all border border-red-500/20">
                            <div className="p-2 bg-red-500/20 rounded-lg text-red-500 group-hover:scale-110 transition-transform">
                                🛡️
                            </div>
                            <span className="text-xl font-medium text-red-500">Admin Panel</span>
                        </Link>
                    )}

                    {!user && (
                        <Link href="/login" onClick={toggleMenu} className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all">
                            <div className="p-2 bg-white/10 rounded-lg text-white group-hover:scale-110 transition-transform">
                                🔐
                            </div>
                            <span className="text-xl font-medium">Sign In</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
