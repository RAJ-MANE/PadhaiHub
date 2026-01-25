-- FIX ALL PERMISSIONS (Universal Fix)

-- 1. Enable RLS on all tables (Best Practice)
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Allow PUBLIC READ access (Anyone can see content)
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view semesters" ON public.semesters;
DROP POLICY IF EXISTS "Public can view subjects" ON public.subjects;
DROP POLICY IF EXISTS "Public can view documents" ON public.documents;

-- Re-create them widely
CREATE POLICY "Public can view semesters" ON public.semesters FOR SELECT USING (true);
CREATE POLICY "Public can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Public can view documents" ON public.documents FOR SELECT USING (true);

-- 3. Fix Profiles (Users can see their own, Admins can see all)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles 
FOR ALL USING (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

-- 4. Ensure Admin Role for specific user (Replace Email if needed)
-- This tries to find the user by email and set role to admin
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@padhaihub.com'
);

-- 5. Grant Admin Delete/Update/Insert Rights
-- (These might already exist from previous scripts, but good to ensure)
CREATE POLICY "Admins can insert semesters" ON public.semesters FOR INSERT WITH CHECK (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
CREATE POLICY "Admins can update semesters" ON public.semesters FOR UPDATE USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
CREATE POLICY "Admins can delete semesters" ON public.semesters FOR DELETE USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Repeat for Subjects
CREATE POLICY "Admins can insert subjects" ON public.subjects FOR INSERT WITH CHECK (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
CREATE POLICY "Admins can update subjects" ON public.subjects FOR UPDATE USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
CREATE POLICY "Admins can delete subjects" ON public.subjects FOR DELETE USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Repeat for Documents
CREATE POLICY "Admins can insert documents" ON public.documents FOR INSERT WITH CHECK (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
CREATE POLICY "Admins can update documents" ON public.documents FOR UPDATE USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
CREATE POLICY "Admins can delete documents" ON public.documents FOR DELETE USING (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
