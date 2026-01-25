"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSemester(formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const image = formData.get("image") as File;

    let imageUrl = null;
    if (image && image.size > 0) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
            .from("semester-images")
            .upload(fileName, image);

        if (error) throw new Error("Image upload failed: " + error.message);

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from("semester-images")
            .getPublicUrl(data.path);

        imageUrl = publicUrl;
    }

    const { error } = await supabase.from("semesters").insert({
        title,
        description,
        price,
        image_url: imageUrl,
    });

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/admin/semesters");
    redirect("/admin/semesters");
}

export async function createSubject(formData: FormData) {
    const supabase = await createClient();

    const semesterId = formData.get("semesterId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    const { error } = await supabase.from("subjects").insert({
        semester_id: semesterId,
        title,
        description,
    });

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath(`/admin/semesters/${semesterId}`);
}

export async function createDocument(formData: FormData) {
    const supabase = await createClient();

    const subjectId = formData.get("subjectId") as string;
    const semesterId = formData.get("semesterId") as string;
    const title = formData.get("title") as string;
    const type = formData.get("type") as "pdf" | "video";

    // Handle File Upload
    const file = formData.get("file") as File;
    let fileUrl = "";

    if (file && file.size > 0) {
        console.log("Uploading file:", file.name, file.size);
        const fileName = `${Date.now()}-${file.name}`;

        // Upload to 'course-content' bucket (Private)
        const { data, error } = await supabase.storage
            .from("course-content")
            .upload(fileName, file);

        if (error) {
            console.error("Supabase Storage Error:", error);
            throw new Error("File upload failed: " + error.message);
        }

        // Store the path (key) for private files, we sign it on retrieval
        fileUrl = data.path;
    } else {
        throw new Error("File is required.");
    }

    // Save to Database
    const { error } = await supabase.from("documents").insert({
        subject_id: subjectId,
        title,
        type,
        file_url: fileUrl,
    });

    if (error) {
        console.error("Database Error:", error);
        throw new Error(error.message);
    }

    revalidatePath(`/admin/semesters/${semesterId}/subjects/${subjectId}`);
}

export async function deleteSemester(semesterId: string) {
    console.log("Beginning deleteSemester for ID:", semesterId);

    const supabase = await createClient();

    // Check User Role Debug
    const { data: { user } } = await supabase.auth.getUser();
    console.log("Current User:", user?.id);

    if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        console.log("Current Role:", profile?.role);
    }

    // Deleting semester will cascade delete subjects/documents if DB is configured, 
    // but we should probably clean up storage too if we were being thorough. 
    // For now, let's just delete the record.
    // Use select() to get back the deleted row. If null, nothing was deleted.
    const { data: deleted, error } = await supabase.from("semesters").delete().eq("id", semesterId).select();

    if (error) {
        console.error("Supabase Delete Error:", error);
        throw new Error(error.message);
    }

    if (!deleted || deleted.length === 0) {
        console.error("Delete failed: Record not found or permission denied.");
        throw new Error("Could not delete. Are you sure you are an Admin?");
    }

    console.log("Delete successful, revalidating...");
    revalidatePath("/admin/semesters");
}

export async function deleteSubject(subjectId: string, semesterId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("subjects").delete().eq("id", subjectId);

    if (error) throw new Error(error.message);
    revalidatePath(`/admin/semesters/${semesterId}`);
}

export async function deleteDocument(documentId: string, subjectId: string, semesterId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("documents").delete().eq("id", documentId);

    if (error) throw new Error(error.message);
    revalidatePath(`/admin/semesters/${semesterId}/subjects/${subjectId}`);
}
