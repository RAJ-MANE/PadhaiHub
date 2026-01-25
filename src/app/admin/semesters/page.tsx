import Link from "next/link";
import { deleteSemester } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import DeleteSemesterButton from "@/components/admin/DeleteSemesterButton";
import { createClient } from "@/utils/supabase/server";
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";

export default async function SemestersPage() {
    const supabase = await createClient();
    const { data: semesters } = await supabase.from("semesters").select("*").order("created_at", { ascending: false });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Semesters</h1>
                    <p className="text-muted-foreground">Manage your semester offerings.</p>
                </div>
                <Link href="/admin/semesters/new">
                    <Button>Create Semester</Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {semesters?.map((semester) => (
                    <Card key={semester.id} className="hover:border-primary/50 transition-colors group relative flex flex-col justify-between">
                        <Link href={`/admin/semesters/${semester.id}`} className="flex-1">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="group-hover:text-primary transition-colors">{semester.title}</CardTitle>
                                    <span className="text-sm font-mono bg-white/10 px-2 py-1 rounded">${semester.price}</span>
                                </div>
                                <CardDescription>{semester.description}</CardDescription>
                            </CardHeader>
                        </Link>

                        <CardFooter className="text-muted-foreground text-sm flex justify-between items-center z-10 px-6 pb-6">
                            <span>Click to manage subjects</span>
                            <DeleteSemesterButton semesterId={semester.id} />
                        </CardFooter>
                    </Card>
                ))}
                {(!semesters || semesters.length === 0) && (
                    <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed border-white/10 rounded-xl">
                        No semesters found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
