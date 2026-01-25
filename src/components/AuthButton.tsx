"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

export default function AuthButton({ user }: { user: User | null }) {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return user ? (
        <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-medium">{user.user_metadata.full_name || user.email}</span>
                <span className="text-xs text-muted-foreground capitalize">
                    {user.user_metadata.role || "User"}
                </span>
            </div>
            <form action={handleSignOut}>
                <Button variant="outline" size="sm">
                    Sign Out
                </Button>
            </form>
        </div>
    ) : (
        <div className="flex items-center gap-2">
            <Link href="/login">
                <Button variant="ghost" size="sm">
                    Login
                </Button>
            </Link>
            <Link href="/register">
                <Button variant="default" size="sm">
                    Get Started
                </Button>
            </Link>
        </div>
    );
}
