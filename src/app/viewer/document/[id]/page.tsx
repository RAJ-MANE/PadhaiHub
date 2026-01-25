import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";

export default async function DocumentViewerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Verify Auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Fetch Document
    const { data: doc } = await supabase.from("documents").select("*").eq("id", id).single();
    if (!doc) notFound();

    // Verify Purchase (Mocked for now - or query logic)
    const hasAccess = true;

    if (!hasAccess) {
        return (
            <div className="flex h-screen items-center justify-center text-center p-4">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-muted-foreground">You must purchase the semester to view this content.</p>
                </div>
            </div>
        );
    }

    // Generate Signed URL if it's a private path (doesn't start with http)
    let finalUrl = doc.file_url;
    if (!doc.file_url.startsWith("http")) {
        const { data, error } = await supabase.storage
            .from("course-content")
            .createSignedUrl(doc.file_url, 3600); // 1 hour expiry

        if (data?.signedUrl) {
            finalUrl = data.signedUrl;
        }
    }

    return (
        <div className="flex flex-col h-screen bg-black overflow-hidden select-none" onContextMenu={() => "return false;"}>
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-white/10 z-50">
                <h1 className="font-semibold text-white truncate">{doc.title}</h1>
                <div className="text-xs text-muted-foreground">Secure Viewer</div>
            </div>

            {/* Content Area - Protected Canvas/Frame */}
            <div className="flex-1 relative flex items-center justify-center bg-zinc-950 secure-view">
                {/* Anti-screenshot overlay (Visual deterrent) */}
                <div className="absolute inset-0 pointer-events-none z-50 bg-repeat opacity-[0.03]" style={{ backgroundImage: "url('/watermark_pattern.png')" }}></div>

                {doc.type === 'pdf' ? (
                    <iframe
                        src={`${finalUrl}#toolbar=0&navpanes=0`}
                        className="w-full h-full border-none pointer-events-auto"
                        style={{ pointerEvents: 'auto' }}
                    />
                ) : (
                    <div className="text-white">Video Player Placeholder</div>
                )}
            </div>

            {/* Watermark Overlay dynamic */}
            <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center opacity-[0.02] -rotate-45">
                <span className="text-9xl font-bold whitespace-nowrap">{user.email}</span>
            </div>
        </div>
    );
}
