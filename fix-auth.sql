-- Fix Authentication Issues
-- Run this in Supabase SQL Editor

-- 1. Check if there are any users
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 2. Manually confirm the test user email
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'test@orasystems.com';

-- 3. Create a new confirmed user directly
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@orasystems.com',
  crypt('Admin123456', gen_salt('bf')),
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Admin", "last_name": "User", "company": "OraSystems"}',
  false,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  false,
  NULL
);

-- 4. Verify the users exist and are confirmed
SELECT
  email,
  CASE
    WHEN email_confirmed_at IS NOT NULL THEN 'Confirmed ✓'
    ELSE 'Not Confirmed ✗'
  END as status,
  created_at
FROM auth.users
WHERE email IN ('test@orasystems.com', 'admin@orasystems.com')
ORDER BY created_at DESC;