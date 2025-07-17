-- Create sales agreements table
CREATE TABLE public.sales_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  agreement_data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create signatures table
CREATE TABLE public.signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID REFERENCES public.sales_agreements(id) ON DELETE CASCADE,
  signer_name TEXT NOT NULL,
  signer_email TEXT NOT NULL,
  signature_data TEXT NOT NULL, -- base64 encoded signature
  signed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Create payments table for sales agreements
CREATE TABLE public.agreement_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID REFERENCES public.sales_agreements(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL, -- amount in cents
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sales_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agreement_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sales_agreements
CREATE POLICY "Agreements are viewable by everyone" 
ON public.sales_agreements 
FOR SELECT 
USING (true);

CREATE POLICY "API keys can manage agreements" 
ON public.sales_agreements 
FOR ALL 
USING (true);

-- RLS Policies for signatures
CREATE POLICY "Signatures are viewable by everyone" 
ON public.signatures 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert signatures" 
ON public.signatures 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for agreement_payments
CREATE POLICY "Payments are viewable by everyone" 
ON public.agreement_payments 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert payments" 
ON public.agreement_payments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "API keys can update payments" 
ON public.agreement_payments 
FOR UPDATE 
USING (true);

-- Create trigger for updating updated_at
CREATE TRIGGER update_sales_agreements_updated_at
BEFORE UPDATE ON public.sales_agreements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();