-- Add missing columns to clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS company_website TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS employee_count INTEGER,
ADD COLUMN IF NOT EXISTS revenue_range TEXT,
ADD COLUMN IF NOT EXISTS growth_stage TEXT,
ADD COLUMN IF NOT EXISTS consultation_date TIMESTAMP WITH TIME ZONE;

-- Migrate existing data: split name into first_name and last_name
UPDATE public.clients 
SET 
  first_name = TRIM(SPLIT_PART(name, ' ', 1)),
  last_name = CASE 
    WHEN POSITION(' ' IN name) > 0 
    THEN TRIM(SUBSTRING(name FROM POSITION(' ' IN name) + 1))
    ELSE ''
  END,
  company_name = company
WHERE first_name IS NULL;

-- Add missing columns to proposals table
ALTER TABLE public.proposals 
ADD COLUMN IF NOT EXISTS financial_amount NUMERIC(12,2),
ADD COLUMN IF NOT EXISTS financial_currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS executive_summary TEXT,
ADD COLUMN IF NOT EXISTS payment_terms TEXT,
ADD COLUMN IF NOT EXISTS pricing_tiers JSONB,
ADD COLUMN IF NOT EXISTS prepared_by TEXT,
ADD COLUMN IF NOT EXISTS brand_color TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Migrate existing data from old columns to new ones
UPDATE public.proposals 
SET 
  financial_amount = total_value,
  financial_currency = currency
WHERE financial_amount IS NULL;

-- Insert demo API key for testing (hash of "demo-api-key-12345")
INSERT INTO public.api_keys (id, name, key_hash, is_active, rate_limit)
VALUES (
  gen_random_uuid(),
  'Demo API Key',
  encode(sha256('demo-api-key-12345'::bytea), 'hex'),
  true,
  100
)
ON CONFLICT (key_hash) DO NOTHING;