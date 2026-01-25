-- FORCE CREATE ADMIN USER (SQL Only)
-- This creates a user directly in the database so you can Log In immediately.
-- LOGIN: admin@padhaihub.com
-- PASSWORD: admin123

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  new_uid uuid := gen_random_uuid();
BEGIN
  -- 1. Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_uid,
    'authenticated',
    'authenticated',
    'admin@padhaihub.com',
    crypt('admin123', gen_salt('bf')), -- Password: admin123
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "System Admin"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- 2. Insert into public.profiles (Admin Role)
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new_uid, 'System Admin', 'admin');

  -- 3. Insert into auth.identities (Required for login to work properly)
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    new_uid,
    format('{"sub": "%s", "email": "admin@padhaihub.com"}', new_uid)::jsonb,
    'email',
    now(),
    now(),
    now()
  );
END $$;
