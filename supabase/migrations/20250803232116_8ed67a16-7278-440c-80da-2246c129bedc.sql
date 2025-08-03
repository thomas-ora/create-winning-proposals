-- Create profiles table for user data
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text NOT NULL,
  first_name text,
  last_name text,
  company_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Add user_id column to proposals table
ALTER TABLE public.proposals 
ADD COLUMN user_id uuid REFERENCES public.profiles(id);

-- Update proposals RLS policies to include user-specific access
DROP POLICY IF EXISTS "Proposals are viewable by everyone" ON public.proposals;

-- API keys can still manage all proposals (for external API)
-- Users can view their own proposals 
-- Proposals without user_id remain publicly viewable (for API-created ones)
CREATE POLICY "Users can view their own proposals" 
ON public.proposals 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  user_id IS NULL OR
  auth.role() = 'service_role'
);

CREATE POLICY "Users can create their own proposals" 
ON public.proposals 
FOR INSERT 
WITH CHECK (
  user_id = auth.uid() OR 
  auth.role() = 'service_role'
);

CREATE POLICY "Users can update their own proposals" 
ON public.proposals 
FOR UPDATE 
USING (
  user_id = auth.uid() OR 
  auth.role() = 'service_role'
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$$;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add updated_at trigger to profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();