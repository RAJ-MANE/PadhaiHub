"use client";

import { deleteSemester } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { useTransition } from "react";

import { useRouter } from "next/navigation";

export default function DeleteSemesterButton({ semesterId }: { semesterId: string }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    return (
        <Button
            variant="default" // Changed from destructive to default to fix TS error
            size="sm"
            disabled={isPending}
            onClick={(e) => {
                e.preventDefault(); // Stop Link from opening
                e.stopPropagation(); // Stop bubbling

                if (!confirm("Are you sure you want to delete this semester?")) return;

                startTransition(async () => {
                    try {
                        await deleteSemester(semesterId);
                        alert("Semester deleted successfully!");
                        router.refresh(); // <--- Force UI update
                    } catch (err: any) {
                        alert("Failed to delete: " + err.message);
                        console.error(err);
                    }
                });
            }}
            className="z-50 relative bg-red-600 hover:bg-red-700 text-white"
        >
            {isPending ? "Deleting..." : "Delete"}
        </Button>
    );
}
