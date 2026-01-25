-- PROMOTE TO ADMIN
-- 1. Sign Up/Login with ANY email (e.g. raj@example.com)
-- 2. Run this script to make that user an Admin

UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 1
);

-- OR, if you want to be specific, replace lines 6-9 with:
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'your_email@example.com');
