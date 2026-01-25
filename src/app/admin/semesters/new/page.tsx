import { createSemester } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NewSemesterPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Semester</h1>
                <p className="text-muted-foreground">Add a new semester plan.</p>
            </div>

            <form action={createSemester} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <input
                        name="title"
                        required
                        placeholder="e.g. Semester 1"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Cover Image</label>
                    <input
                        name="image"
                        type="file"
                        accept="image/*"
                        className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Price (₹)</label>
                    <input
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        placeholder="49.99"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        className="w-full p-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="What's included in this semester..."
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <Link href="/admin/semesters">
                        <Button type="button" variant="ghost">Cancel</Button>
                    </Link>
                    <Button type="submit">Create Semester</Button>
                </div>
            </form>
        </div>
    );
}
