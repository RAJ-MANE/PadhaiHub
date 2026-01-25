import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";
import AdminMobileSidebar from "@/components/admin/AdminMobileSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Verify admin role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

    if (!profile || profile.role !== 'admin') {
        const sqlToRun = `
-- 1. Create Profile & Promote to Admin (Robust)
INSERT INTO public.profiles (id, full_name, role)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'full_name', 'Admin User'), 
  'admin'
FROM auth.users
WHERE id = '${user.id}'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';

-- 2. FIX PERMISSIONS (Critical: App cannot see your role without this)
-- Enable RLS and allow users to read their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 3. Fix Delete Policies (for Semesters/Subjects/etc)
ALTER TABLE public.subjects DROP CONSTRAINT IF EXISTS subjects_semester_id_fkey;
ALTER TABLE public.subjects ADD CONSTRAINT subjects_semester_id_fkey
    FOREIGN KEY (semester_id) REFERENCES public.semesters(id) ON DELETE CASCADE;

ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_subject_id_fkey;
ALTER TABLE public.documents ADD CONSTRAINT documents_subject_id_fkey
    FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;

ALTER TABLE public.purchases DROP CONSTRAINT IF EXISTS purchases_semester_id_fkey;
ALTER TABLE public.purchases ADD CONSTRAINT purchases_semester_id_fkey
    FOREIGN KEY (semester_id) REFERENCES public.semesters(id) ON DELETE CASCADE;

CREATE POLICY "Admins can delete semesters" ON public.semesters
FOR DELETE TO authenticated
USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

CREATE POLICY "Admins can delete subjects" ON public.subjects
FOR DELETE TO authenticated
USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

CREATE POLICY "Admins can delete documents" ON public.documents
FOR DELETE TO authenticated
USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
`;

        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white p-8 font-sans">
                <div className="max-w-3xl space-y-8 w-full">
                    <div className="border border-red-900/50 bg-red-950/20 p-8 rounded-2xl">
                        <h1 className="text-3xl font-bold text-red-500 mb-4">⚠️ Admin Access Required</h1>
                        <p className="text-lg text-gray-300">
                            You are logged in as <span className="font-mono bg-gray-900 px-2 py-1 rounded text-white">{user.email}</span>,
                            but you do not have the <strong>admin</strong> role in the database.
                        </p>
                        <p className="mt-2 text-gray-400">
                            Because of this, you cannot access this panel, and "Delete" operations will fail silently.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">How to Fix</h2>
                        <p className="text-gray-400">
                            Copy and run the following SQL command in your <a href="https://supabase.com/dashboard" target="_blank" className="underline text-blue-400">Supabase SQL Editor</a>:
                        </p>

                        <div className="relative group">
                            <pre className="bg-black/50 p-6 rounded-xl overflow-x-auto border border-gray-800 text-green-400 text-sm leading-relaxed font-mono shadow-inner">
                                {sqlToRun.trim()}
                            </pre>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <Link href="/">
                            <Button variant="outline" className="border-white/20 hover:bg-white/10">
                                Back to Home
                            </Button>
                        </Link>
                        <Link href="/admin">
                            <Button className="bg-green-600 hover:bg-green-700">
                                I&apos;ve Run the SQL (Refresh)
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen pt-16">
            <aside className="w-64 border-r border-white/10 hidden md:block bg-black/20 overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4">Admin Console</h2>
                    <nav className="space-y-2">
                        <Link href="/admin">
                            <Button variant="ghost" className="w-full justify-start">
                                Dashboard
                            </Button>
                        </Link>
                        <Link href="/admin/semesters">
                            <Button variant="ghost" className="w-full justify-start">
                                Semesters
                            </Button>
                        </Link>
                        <Link href="/admin/uploads">
                            <Button variant="ghost" className="w-full justify-start">
                                Uploads
                            </Button>
                        </Link>
                        <Link href="/admin/users">
                            <Button variant="ghost" className="w-full justify-start">
                                Users
                            </Button>
                        </Link>
                    </nav>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    <AdminMobileSidebar />
                    {children}
                </div>
            </main>
        </div>
    );
}
