import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function DocumentViewerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Verify Auth (DISABLED for Public Access)
    const { data: { user } } = await supabase.auth.getUser();
    // if (!user) redirect("/login");

    try {
        // Fetch Document
        const { data: doc, error: docError } = await supabase.from("documents").select("*").eq("id", id).single();
        if (docError) throw new Error("DB Error: " + docError.message);
        if (!doc) notFound();

        // Generate Signed URL if it's a private path (doesn't start with http)
        let finalUrl = doc.file_url;
        if (!doc.file_url.startsWith("http")) {
            try {
                // Try public URL direct since bucket is public now
                const { data: publicData } = supabase.storage.from("course-content").getPublicUrl(doc.file_url);
                finalUrl = publicData.publicUrl;
            } catch (e) {
                console.error("Exception signing URL:", e);
            }
        }

        return (
            <div className="flex flex-col h-screen bg-black overflow-hidden select-none">
                {/* Top Bar */}
                <div className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-white/10 z-50">
                    <h1 className="font-semibold text-white truncate">{doc.title}</h1>
                    <div className="text-xs text-muted-foreground">Secure Viewer</div>
                </div>

                {/* Content Area - Protected Canvas/Frame */}
                <div className="flex-1 relative flex flex-col bg-zinc-950 secure-view min-h-0">
                    {/* Anti-screenshot overlay (Visual deterrent) */}
                    <div className="absolute inset-0 pointer-events-none z-50 bg-repeat opacity-[0.03]" style={{ backgroundImage: "url('/watermark_pattern.png')" }}></div>

                    {doc.type === 'pdf' ? (
                        <div className="w-full h-full relative z-10">
                            <iframe
                                src={`${finalUrl}#toolbar=0&navpanes=0`}
                                className="w-full h-full border-none"
                                title={doc.title}
                            />
                        </div>
                    ) : (
                        <div className="text-white">Video Player Placeholder</div>
                    )}
                </div>

                {/* Watermark Overlay dynamic */}
                <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center opacity-[0.02] -rotate-45">
                    <span className="text-9xl font-bold whitespace-nowrap">{user?.email || "Guest Viewer"}</span>
                </div>
            </div>
        );
    } catch (err: any) {
        return (
            <div className="p-8 text-white">
                <h1 className="text-xl font-bold text-red-500">Critical Error</h1>
                <pre className="mt-4 p-4 bg-zinc-900 rounded overflow-auto">{err.message}</pre>
                <p>Params ID: {id}</p>
            </div>
        );
    }


}
