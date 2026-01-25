import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/Button";
import { notFound } from "next/navigation";
import Link from "next/link";
import RazorpayButton from "@/components/RazorpayButton";

export default async function SemesterConfig({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: semester } = await supabase.from("semesters").select("*").eq("id", id).single();
    if (!semester) notFound();

    // Check purchase status
    let isPurchased = false;
    if (user) {
        const { data: purchase } = await supabase
            .from("purchases")
            .select("status")
            .eq("user_id", user.id)
            .eq("semester_id", id)
            .eq("status", "completed")
            .single();
        if (purchase) isPurchased = true;
    }

    return (
        <div className="container max-w-5xl py-12 animate-in fade-in duration-500">
            <Link href="/browse" className="text-muted-foreground hover:text-white mb-8 inline-block transition-colors">
                ← Back to Browse
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                    <div className="aspect-video rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                        {/* Placeholder for actual image if available in future */}
                        <span className="text-6xl">📚</span>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                        <h3 className="text-xl font-semibold mb-4">What&apos;s Inside</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <span className="text-green-400">✓</span> Premium Subject Notes
                            </li>
                            {/* Video Lectures Removed as requested */}
                            <li className="flex items-center gap-2">
                                <span className="text-green-400">✓</span> 24/7 Access
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-400">✓</span> PDF Downloads
                            </li>
                            <li className="flex items-center gap-2 text-muted-foreground">
                                <span>🔒</span> Secure Viewer
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="space-y-8 lg:sticky lg:top-24">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{semester.title}</h1>
                        <p className="text-xl text-muted-foreground">{semester.description}</p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6">
                        <div className="flex items-baseline justify-between">
                            <span className="text-muted-foreground">Price</span>
                            <span className="text-4xl font-bold text-primary">₹{semester.price}</span>
                        </div>

                        {isPurchased ? (
                            <Button className="w-full bg-green-500 hover:bg-green-600 text-lg h-12">
                                Access Content
                            </Button>
                        ) : (
                            <RazorpayButton
                                semesterId={semester.id}
                                price={semester.price}
                                title={semester.title}
                            />
                        )}
                        <p className="text-xs text-center text-muted-foreground">
                            Secure payment via Razorpay. Instant access after purchase.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
