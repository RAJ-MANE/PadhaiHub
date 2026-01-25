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

    // Fetch Subjects and Documents (PUBLIC ACCESS)
    const { data: subjects } = await supabase
        .from("subjects")
        .select("*, documents(*)")
        .eq("semester_id", id)
        .order("created_at", { ascending: true });

    return (
        <div className="container max-w-6xl py-12 animate-in fade-in duration-500">
            <Link href="/browse" className="text-muted-foreground hover:text-white mb-8 inline-block transition-colors">
                ← Back to Browse
            </Link>

            <div className="grid lg:grid-cols-3 gap-12 items-start">
                {/* Left: Info */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="aspect-video rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                        <span className="text-6xl">📚</span>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">{semester.title}</h1>
                        <p className="text-muted-foreground">{semester.description}</p>
                        <div className="mt-4 flex items-center gap-2 text-green-400 font-medium bg-green-900/20 p-2 rounded border border-green-900/50 w-fit">
                            <span>🔓</span> Free Access Enabled
                        </div>
                    </div>
                </div>

                {/* Right: Content List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold mb-4">Course Content</h2>

                    {subjects?.length === 0 ? (
                        <div className="text-muted-foreground text-center py-12 bg-white/5 rounded-xl border border-white/10">
                            No subjects found in this semester.
                        </div>
                    ) : (
                        subjects?.map((subject) => (
                            <div key={subject.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                                <div className="px-6 py-4 bg-white/5 border-b border-white/5">
                                    <h3 className="font-semibold text-lg">{subject.title}</h3>
                                </div>
                                <div className="divide-y divide-white/5">
                                    {subject.documents && subject.documents.length > 0 ? (
                                        subject.documents.map((doc: any) => (
                                            <div key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl group-hover:scale-110 transition-transform">
                                                        {doc.type === 'pdf' ? '📄' : '🎥'}
                                                    </span>
                                                    <div>
                                                        <p className="font-medium group-hover:text-primary transition-colors">{doc.title}</p>
                                                        <p className="text-xs text-muted-foreground uppercase">{doc.type}</p>
                                                    </div>
                                                </div>
                                                <Link href={`/viewer/document/${doc.id}`} target="_blank">
                                                    <Button variant="outline" size="sm" className="gap-2">
                                                        View <span className="text-xs">↗</span>
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-6 py-4 text-sm text-muted-foreground italic">
                                            No documents yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
