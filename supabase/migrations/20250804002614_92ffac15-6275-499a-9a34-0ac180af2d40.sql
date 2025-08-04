-- Update existing proposals to assign them to authenticated users
-- This will allow existing proposals to be deleted by the RLS policy
-- We'll assign all existing proposals with null user_id to the first available user

UPDATE public.proposals 
SET user_id = (
  SELECT id 
  FROM auth.users 
  WHERE email IS NOT NULL 
  LIMIT 1
)
WHERE user_id IS NULL;