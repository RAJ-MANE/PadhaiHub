import { createSubject, deleteSubject } from "@/app/admin/actions";
import EditSemesterForm from "@/components/admin/EditSemesterForm";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SemesterDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch Semester
    const { data: semester } = await supabase
        .from("semesters")
        .select("*")
        .eq("id", id)
        .single();

    if (!semester) notFound();

    // Fetch Subjects
    const { data: subjects } = await supabase
        .from("subjects")
        .select("*")
        .eq("semester_id", id)
        .order("created_at", { ascending: true });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link href="/admin/semesters" className="text-muted-foreground hover:text-foreground">
                    Semesters
                </Link>
                <span className="text-muted-foreground">/</span>
                <h1 className="text-2xl font-bold tracking-tight">{semester.title}</h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content: Subjects List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-semibold">Subjects</h2>
                    <div className="grid gap-4">
                        {subjects?.map((subject) => (
                            <div key={subject.id} className="group relative">
                                <Link href={`/admin/semesters/${id}/subjects/${subject.id}`}>
                                    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                                        <CardHeader className="py-4 flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{subject.title}</CardTitle>
                                                <CardDescription>{subject.description}</CardDescription>
                                            </div>
                                            {/* Spacer */}
                                            <div className="w-16"></div>
                                        </CardHeader>
                                    </Card>
                                </Link>
                                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <form action={async () => {
                                        "use server";
                                        await deleteSubject(subject.id, id);
                                    }}>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10 hover:text-red-400">
                                            Delete
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ))}
                        {(!subjects || subjects.length === 0) && (
                            <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-muted-foreground">
                                No subjects created yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: Add Subject Form */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Semester Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EditSemesterForm semester={semester} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Add Subject</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form action={createSubject} className="space-y-4">
                                <input type="hidden" name="semesterId" value={id} />
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title</label>
                                    <input
                                        name="title"
                                        required
                                        className="w-full h-9 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="e.g. Mathematics"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea
                                        name="description"
                                        rows={3}
                                        className="w-full p-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Short description..."
                                    />
                                </div>
                                <Button type="submit" className="w-full">Add Subject</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
