"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/Button";

export default function AdminMobileSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="md:hidden mb-6">
            <Button variant="outline" onClick={toggleMenu} className="w-full justify-between">
                <span>Admin Menu</span>
                {isOpen ? <X size={16} /> : <Menu size={16} />}
            </Button>

            {isOpen && (
                <div className="mt-2 p-4 bg-black/40 border border-white/10 rounded-xl space-y-2 animate-in slide-in-from-top-2 duration-200">
                    <Link href="/admin" onClick={toggleMenu}>
                        <Button variant="ghost" className="w-full justify-start">
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/semesters" onClick={toggleMenu}>
                        <Button variant="ghost" className="w-full justify-start">
                            Semesters
                        </Button>
                    </Link>
                    <Link href="/admin/uploads" onClick={toggleMenu}>
                        <Button variant="ghost" className="w-full justify-start">
                            Uploads
                        </Button>
                    </Link>
                    <Link href="/admin/users" onClick={toggleMenu}>
                        <Button variant="ghost" className="w-full justify-start">
                            Users
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
