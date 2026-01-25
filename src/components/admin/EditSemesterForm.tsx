"use client";

import { updateSemester } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

interface EditSemesterFormProps {
    semester: {
        id: string;
        title: string;
        description: string | null;
        price: number;
    };
}

export default function EditSemesterForm({ semester }: EditSemesterFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await updateSemester(formData);
            alert("Semester updated successfully!");
        } catch (error: any) {
            alert("Error updating semester: " + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <input type="hidden" name="id" value={semester.id} />

            <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input
                    name="title"
                    defaultValue={semester.title}
                    required
                    className="w-full h-9 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Price (₹)</label>
                <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={semester.price}
                    required
                    className="w-full h-9 px-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                    name="description"
                    defaultValue={semester.description || ""}
                    rows={3}
                    className="w-full p-3 rounded-md border border-input bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Save Changes"}
            </Button>
        </form>
    );
}
