-- Create the api_keys table for storing API key information
CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used TIMESTAMP WITH TIME ZONE,
  rate_limit INTEGER DEFAULT 100
);

-- Enable Row Level Security
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for API key management
-- For now, allow service role to manage API keys (used by edge functions)
-- In production, you may want to restrict this to admin users only
CREATE POLICY "Service role can manage API keys" 
ON public.api_keys 
FOR ALL 
USING (true);

-- Create an index on key_hash for faster lookups during authentication
CREATE INDEX idx_api_keys_key_hash ON public.api_keys(key_hash);

-- Create an index on is_active for filtering active keys
CREATE INDEX idx_api_keys_active ON public.api_keys(is_active);

-- Add a function to update the last_used timestamp
CREATE OR REPLACE FUNCTION public.update_api_key_last_used(key_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.api_keys 
  SET last_used = now() 
  WHERE id = key_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;