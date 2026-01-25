-- FIX INFINITE RECURSION ERROR
-- This script replaces the recursive RLS policies with a safe helper function.

-- 1. Create Helper Function (Bypasses RLS loop)
-- SECURITY DEFINER means this runs with owner privileges, ignoring RLS on the table itself.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Fix PROFILES table (The source of the recursion)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING ( public.is_admin() );

-- 3. Update other tables to use the safe function (Best Practice)

-- Semesters
DROP POLICY IF EXISTS "Admins can insert semesters" ON public.semesters;
DROP POLICY IF EXISTS "Admins can update semesters" ON public.semesters;
DROP POLICY IF EXISTS "Admins can delete semesters" ON public.semesters;

CREATE POLICY "Admins can insert semesters" ON public.semesters FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update semesters" ON public.semesters FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete semesters" ON public.semesters FOR DELETE USING (public.is_admin());

-- Subjects
DROP POLICY IF EXISTS "Admins can insert subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can update subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can delete subjects" ON public.subjects;

CREATE POLICY "Admins can insert subjects" ON public.subjects FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update subjects" ON public.subjects FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete subjects" ON public.subjects FOR DELETE USING (public.is_admin());

-- Documents
DROP POLICY IF EXISTS "Admins can insert documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can update documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can delete documents" ON public.documents;

CREATE POLICY "Admins can insert documents" ON public.documents FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update documents" ON public.documents FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete documents" ON public.documents FOR DELETE USING (public.is_admin());
