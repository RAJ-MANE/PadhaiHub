-- ALLOW PUBLIC READ ACCESS
-- Run this to ensure EVERYONE (logged in or not) can see the list of content.

-- 1. Semesters
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view semesters" ON public.semesters;
CREATE POLICY "Public can view semesters" ON public.semesters FOR SELECT USING (true);

-- 2. Subjects
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view subjects" ON public.subjects;
CREATE POLICY "Public can view subjects" ON public.subjects FOR SELECT USING (true);

-- 3. Documents (Usage: Viewing the list, not necessarily downloading if Storage is private)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view documents" ON public.documents;
CREATE POLICY "Public can view documents" ON public.documents FOR SELECT USING (true);

-- 4. Storage (Optional: If you want files to be public too)
-- Note: This requires the "storage" schema permissions which are handled differently,
-- but typically table access is the first blocker.
