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
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="relative z-50">
                {isOpen ? <X /> : <Menu />}
            </Button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-200">
                    <Link href="/" onClick={toggleMenu} className="text-2xl font-bold hover:text-primary transition-colors">
                        Home
                    </Link>
                    <Link href="/browse" onClick={toggleMenu} className="text-2xl font-bold hover:text-primary transition-colors">
                        Browse
                    </Link>
                    {user && (
                        <Link href="/dashboard" onClick={toggleMenu} className="text-2xl font-bold hover:text-primary transition-colors">
                            Dashboard
                        </Link>
                    )}
                    {isAdmin && (
                        <Link href="/admin" onClick={toggleMenu} className="text-2xl font-bold text-red-500 hover:text-red-400 transition-colors">
                            Admin Panel
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
