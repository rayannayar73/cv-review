-- Create a special anonymous user for anonymous uploads
DO $$
BEGIN
  -- Create a special UUID for anonymous uploads
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    aud,
    role
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'anonymous@cv-review.app',
    '$2a$10$dummy.hash.for.anonymous.user.that.cannot.login',
    NOW(),
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

  -- Create corresponding profile
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    is_admin
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'anonymous@cv-review.app',
    'Anonymous User',
    false
  ) ON CONFLICT (id) DO NOTHING;
END $$;