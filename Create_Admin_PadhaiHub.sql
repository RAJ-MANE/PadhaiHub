-- FORCE CREATE ADMIN USER (Correct Email)
-- LOGIN: admin@padhaihub.com
-- PASSWORD: admin123

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  target_uid uuid;
BEGIN
  -- 1. Check if user already exists
  SELECT id INTO target_uid FROM auth.users WHERE email = 'admin@padhaihub.com';

  IF target_uid IS NOT NULL THEN
    -- User exists: Just promote to Admin and ensure password
    -- Note: We can't easily update password via SQL without knowing the salt/hash algo internals perfectly, 
    -- but usually Supabase uses pgcrypto. Let's try to update it if needed, or primarily ensure Role.
    
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (target_uid, 'Admin User', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
    
    RAISE NOTICE 'User admin@padhaihub.com already exists. Updated role to Admin.';
  
  ELSE
    -- User does NOT exist: Create new
    target_uid := gen_random_uuid();

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
      target_uid,
      'authenticated',
      'authenticated',
      'admin@padhaihub.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Admin User"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    -- 2. Insert/Update Profile
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (target_uid, 'Admin User', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin', full_name = 'Admin User';

    -- 3. Insert Identity
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      target_uid,
      format('{"sub": "%s", "email": "admin@padhaihub.com"}', target_uid)::jsonb,
      'email',
      target_uid,
      now(),
      now(),
      now()
    );
    
    RAISE NOTICE 'Created new user admin@padhaihub.com with Admin role.';
  END IF;
END $$;
