import { createClient } from "@/utils/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function BrowsePage() {
    const supabase = await createClient();
    const { data: semesters } = await supabase.from("semesters").select("*").order("created_at", { ascending: false });

    return (
        <div className="container min-h-screen flex flex-col justify-center py-12 space-y-8 animate-in fade-in duration-500">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Browse Semesters</h1>
                <p className="text-muted-foreground text-lg">Choose your semester and unlock premium resources.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {semesters?.map((semester) => (
                    <Card key={semester.id} className="border-0 bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="aspect-video bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-t-xl flex items-center justify-center">
                            {/* Image Placeholder */}
                            <span className="text-4xl">📚</span>
                        </div>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl">{semester.title}</CardTitle>
                                <span className="font-bold text-primary text-xl">₹{semester.price}</span>
                            </div>
                            <CardDescription className="line-clamp-2">{semester.description}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Link href={`/browse/${semester.id}`} className="w-full">
                                <Button className="w-full" variant="default" size="lg">View Details</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
