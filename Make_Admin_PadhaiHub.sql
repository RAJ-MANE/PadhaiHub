-- Make specific user Admin
-- PRE-REQUISITE: You must have already signed up with 'admin@padhaihub.com' in the app.

UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@padhaihub.com'
);

-- Verify it worked
SELECT * FROM public.profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@padhaihub.com');
