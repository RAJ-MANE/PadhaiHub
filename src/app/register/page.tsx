import { signup } from "@/app/auth/actions";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const error = (await searchParams).error;

    return (
        <div className="min-h-screen flex items-center justify-center auth-bg p-4">
            <div className="glass-card w-full max-w-md p-8 rounded-2xl animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                    <p className="text-muted-foreground">Get started with premium resources</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md mb-4 text-sm text-center">
                        {error}
                        {String(error).includes("rate limit") && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                Please contact admin or try again later.
                            </p>
                        )}
                    </div>
                )}

                <form className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="fullName">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            required
                            className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="••••••••"
                        />
                    </div>
                    <Button formAction={signup} className="w-full" size="lg">
                        Create Account
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-muted-foreground">Already have an account? </span>
                    <Link href="/login" className="text-primary hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
