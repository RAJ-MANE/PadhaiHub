import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import AuthButton from "./AuthButton";
import MobileMenu from "./MobileMenu";

export default async function Navbar() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    let isAdmin = false;
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role === 'admin') {
            isAdmin = true;
        }
    }

    return (
        <nav className="fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">

                    <span>PadhaiHub</span>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <Link href="/browse" className="hover:text-foreground transition-colors">
                            Browse
                        </Link>
                        {user && (
                            <Link href="/dashboard" className="hover:text-foreground transition-colors">
                                Dashboard
                            </Link>
                        )}
                        {isAdmin && (
                            <Link href="/admin" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                                Admin Panel
                            </Link>
                        )}
                    </div>

                    <AuthButton user={user} />
                    <MobileMenu user={user} isAdmin={isAdmin} />
                </div>
            </div>
        </nav>
    );
}
