import { createClient } from "@/utils/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Purchases
    const { data: purchases } = await supabase
        .from('purchases')
        .select('*, semesters(*)')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });

    if (!purchases) {
        // Handle error or empty case gracefully if needed, though purchases can be null/empty array
    }

    return (
        <div className="container py-12 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Library</h1>
                <p className="text-muted-foreground">Manage your purchased content.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {purchases?.map((purchase) => (
                    <Card key={purchase.id}>
                        <CardHeader>
                            <CardTitle>{purchase.semesters.title}</CardTitle>
                            <CardDescription>Active</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Link href={`/browse/${purchase.semesters.id}`} className="w-full">
                                <Button className="w-full">Access Content</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
                {(!purchases || purchases.length === 0) && (
                    <div className="col-span-full text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                        <p className="text-muted-foreground mb-4">You haven't purchased any semesters yet.</p>
                        <Link href="/browse">
                            <Button variant="default">Browse Catalog</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
