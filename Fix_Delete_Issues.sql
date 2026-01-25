-- FIX DELETE ISSUES (Cascade & Permissions)

-- 1. DROP existing constraints and re-add them with ON DELETE CASCADE
-- This ensures when you delete a Semester, all its Subjects and Documents vanish too.

-- Subject -> Semester
ALTER TABLE public.subjects
DROP CONSTRAINT IF EXISTS subjects_semester_id_fkey;

ALTER TABLE public.subjects
ADD CONSTRAINT subjects_semester_id_fkey
FOREIGN KEY (semester_id) REFERENCES public.semesters(id)
ON DELETE CASCADE;

-- Document -> Subject
ALTER TABLE public.documents
DROP CONSTRAINT IF EXISTS documents_subject_id_fkey;

ALTER TABLE public.documents
ADD CONSTRAINT documents_subject_id_fkey
FOREIGN KEY (subject_id) REFERENCES public.subjects(id)
ON DELETE CASCADE;

-- Purchase -> Semester (Prevent deletion if people bought it? Or just cascade?)
-- Safe choice: Set NULL or Cascade. We will use Cascade for now to allow full deletion.
ALTER TABLE public.purchases
DROP CONSTRAINT IF EXISTS purchases_semester_id_fkey;

ALTER TABLE public.purchases
ADD CONSTRAINT purchases_semester_id_fkey
FOREIGN KEY (semester_id) REFERENCES public.semesters(id)
ON DELETE CASCADE;


-- 2. ENSURE RLS POLICIES FOR DELETE
-- Allow admins to delete rows

CREATE POLICY "Admins can delete semesters" ON public.semesters
FOR DELETE TO authenticated
USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

CREATE POLICY "Admins can delete subjects" ON public.subjects
FOR DELETE TO authenticated
USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

CREATE POLICY "Admins can delete documents" ON public.documents
FOR DELETE TO authenticated
USING (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 3. ENSURE RLS FOR 'insert' (Just in case it was missing for creation too)
CREATE POLICY "Admins can insert semesters" ON public.semesters
FOR INSERT TO authenticated
WITH CHECK (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
