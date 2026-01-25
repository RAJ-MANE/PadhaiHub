import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function DebugAuthPage() {
    const supabase = await createClient();

    // 1. Check Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // 2. Check Profile (Raw)
    let profileData = null;
    let profileError = null;

    if (user) {
        const result = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
        profileData = result.data;
        profileError = result.error;
    }

    // 3. Check Public Data (Semesters)
    const { count: semesterCount, error: semesterError } = await supabase
        .from("semesters")
        .select("*", { count: "exact", head: true });

    return (
        <div className="p-8 bg-black text-white min-h-screen font-mono whitespace-pre-wrap">
            <h1 className="text-2xl font-bold mb-4 text-yellow-400">Auth & Permissions Debugger</h1>

            <div className="space-y-6">
                <section className="border p-4 rounded border-gray-700">
                    <h2 className="text-xl border-b border-gray-700 pb-2 mb-2">1. Authenticated User</h2>
                    {authError ? (
                        <div className="text-red-500">Error: {authError.message}</div>
                    ) : user ? (
                        <div className="text-green-400">
                            ID: {user.id} <br />
                            Email: {user.email}
                        </div>
                    ) : (
                        <div className="text-gray-500">No user logged in.</div>
                    )}
                </section>

                <section className="border p-4 rounded border-gray-700">
                    <h2 className="text-xl border-b border-gray-700 pb-2 mb-2">2. Profile Table Access</h2>
                    <p className="text-sm text-gray-400 mb-2">
                        Trying to read: <code className="bg-gray-800 px-1">SELECT * FROM public.profiles WHERE id = '{user?.id}'</code>
                    </p>

                    {profileError ? (
                        <div className="bg-red-900/30 p-4 border border-red-500 text-red-200">
                            <strong>QUERY FAILED</strong> <br />
                            Code: {profileError.code} <br />
                            Message: {profileError.message} <br />
                            Details: {profileError.details} <br />
                            Hint: {profileError.hint || "Likely RLS Policy missing (Row Level Security)"}
                        </div>
                    ) : profileData ? (
                        <div className="bg-green-900/30 p-4 border border-green-500 text-green-200">
                            <strong>SUCCESS</strong> <br />
                            Role Found: <strong>{profileData.role}</strong> <br />
                            Full Record: {JSON.stringify(profileData, null, 2)}
                        </div>
                    ) : (
                        <div className="text-yellow-500">
                            Result is NULL. (Row might not exist, or RLS hides it)
                        </div>
                    )}
                </section>

                <section className="border p-4 rounded border-gray-700">
                    <h2 className="text-xl border-b border-gray-700 pb-2 mb-2">3. Public Data Access (Semesters)</h2>
                    <p className="text-sm text-gray-400 mb-2">
                        Checking if 'semesters' table is readable:
                    </p>
                    {semesterError ? (
                        <div className="bg-red-900/30 p-4 border border-red-500 text-red-200">
                            <strong>READ FAILED</strong> <br />
                            Message: {semesterError.message} <br />
                            Hint: RLS Policy for 'SELECT' might be missing.
                        </div>
                    ) : (
                        <div className="bg-green-900/30 p-4 border border-green-500 text-green-200">
                            <strong>SUCCESS</strong> <br />
                            Rows Found: {semesterCount} <br />
                            (If 0, table might be empty, but access is working)
                        </div>
                    )}
                </section>

                <section className="border p-4 rounded border-gray-700">
                    <h2 className="text-xl border-b border-gray-700 pb-2 mb-2">3. Recommended SQL Fix</h2>
                    <p className="mb-2">If Section 2 failed or Role is "user", run this in Supabase SQL Editor:</p>
                    <div className="bg-gray-800 p-4 select-all">
                        {`-- 1. Create Profile if missing & Make Admin
INSERT INTO public.profiles (id, full_name, role)
VALUES ('${user?.id}', 'Admin User', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 2. Allow Users to View their own Profile (Fix RLS)
-- This is likely why the app can't see your role!
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- 3. Allow Users to Insert their own Profile (for signup)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 4. Allow Admins to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));`}
                    </div>
                </section>
            </div>
        </div>
    );
}
