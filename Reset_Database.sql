-- ⚠️ DANGER: THIS SCRIPT DELETES EVERYTHING ⚠️
-- Run this only if you want a completely fresh start.

-- 1. DELETE ALL CONTENT
-- Checks constraints and wipes Semesters, which cascades to Subjects, Documents, and Purchases.
TRUNCATE TABLE public.semesters CASCADE;
-- If you have strict foreign keys, we might need to delete from purchases first:
DELETE FROM public.purchases;
DELETE FROM public.semesters; 
-- (TRUNCATE is faster, but DELETE is safer with complex FKs sometimes)

-- 2. DELETE ALL USERS
-- This tries to wipe the Auth service users. 
-- NOTE: If this fails due to permissions, you must delete users manually in:
-- Supabase Dashboard -> Authentication -> Users -> Select All -> Delete
DELETE FROM auth.users;

-- 3. RE-APPLY FIXES (To ensure the fresh DB works)

-- Enable RLS
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public Read Access
DROP POLICY IF EXISTS "Public can view semesters" ON public.semesters;
CREATE POLICY "Public can view semesters" ON public.semesters FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view subjects" ON public.subjects;
CREATE POLICY "Public can view subjects" ON public.subjects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view documents" ON public.documents;
CREATE POLICY "Public can view documents" ON public.documents FOR SELECT USING (true);

-- Profile Access
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles 
FOR ALL USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Admin Rights (Drop first to avoid errors)
DROP POLICY IF EXISTS "Admins can insert semesters" ON public.semesters;
DROP POLICY IF EXISTS "Admins can update semesters" ON public.semesters;
DROP POLICY IF EXISTS "Admins can delete semesters" ON public.semesters;

CREATE POLICY "Admins can insert semesters" ON public.semesters FOR INSERT WITH CHECK (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
CREATE POLICY "Admins can update semesters" ON public.semesters FOR UPDATE USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
CREATE POLICY "Admins can delete semesters" ON public.semesters FOR DELETE USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- (Repeat for Subjects)
DROP POLICY IF EXISTS "Admins can insert subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can update subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can delete subjects" ON public.subjects;

CREATE POLICY "Admins can insert subjects" ON public.subjects FOR INSERT WITH CHECK (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
CREATE POLICY "Admins can update subjects" ON public.subjects FOR UPDATE USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
CREATE POLICY "Admins can delete subjects" ON public.subjects FOR DELETE USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- (Repeat for Documents)
DROP POLICY IF EXISTS "Admins can insert documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can update documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can delete documents" ON public.documents;

CREATE POLICY "Admins can insert documents" ON public.documents FOR INSERT WITH CHECK (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
CREATE POLICY "Admins can update documents" ON public.documents FOR UPDATE USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
CREATE POLICY "Admins can delete documents" ON public.documents FOR DELETE USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
