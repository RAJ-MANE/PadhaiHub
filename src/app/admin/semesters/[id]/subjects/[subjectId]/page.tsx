import { createDocument, deleteDocument } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SubjectDetailsPage({ params }: { params: Promise<{ id: string; subjectId: string }> }) {
    const { id: semesterId, subjectId } = await params;
    const supabase = await createClient();

    // Fetch Subject
    const { data: subject } = await supabase
        .from("subjects")
        .select("*, semesters(title)")
        .eq("id", subjectId)
        .single();

    if (!subject) notFound();

    // Fetch Documents
    const { data: documents } = await supabase
        .from("documents")
        .select("*")
        .eq("subject_id", subjectId)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="/admin/semesters" className="hover:text-foreground">Semesters</Link>
                <span>/</span>
                <Link href={`/admin/semesters/${semesterId}`} className="hover:text-foreground">
                    {/* @ts-ignore Supabase join types are tricky sometimes */}
                    {subject.semesters?.title || "Semester"}
                </Link>
                <span>/</span>
                <span className="text-foreground font-medium">{subject.title}</span>
            </div>

            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{subject.title}</h1>
                    <p className="text-muted-foreground">Manage documents.</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    {documents?.map((doc) => (
                        <Card key={doc.id} className="flex items-center justify-between p-4">
                            <div>
                                <div className="font-medium">{doc.title}</div>
                                <div className="text-xs text-muted-foreground uppercase">{doc.type}</div>
                            </div>
                            <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {doc.file_url}
                            </div>
                            <form action={async () => {
                                "use server";
                                await deleteDocument(doc.id, subjectId, semesterId);
                            }}>
                                <button className="ml-4 text-red-500 hover:text-red-400 text-xs font-medium opacity-50 hover:opacity-100 transition-opacity">
                                    Delete
                                </button>
                            </form>
                        </Card>
                    ))}
                    {(!documents || documents.length === 0) && (
                        <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-muted-foreground">
                            No documents uploaded.
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Document</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form action={createDocument} className="space-y-4">
                                <input type="hidden" name="subjectId" value={subjectId} />
                                <input type="hidden" name="semesterId" value={semesterId} />

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title</label>
                                    <input
                                        name="title"
                                        required
                                        className="w-full h-9 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="e.g. Lecture Notes 1"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Type</label>
                                    <select name="type" className="w-full h-9 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                                        <option value="pdf">PDF Document</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">File Upload</label>
                                    <input
                                        name="file"
                                        type="file"
                                        required
                                        accept=".pdf,video/*"
                                        className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                                    />
                                    <p className="text-xs text-muted-foreground">Upload a PDF file.</p>
                                </div>

                                <Button type="submit" className="w-full">Add Document</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
