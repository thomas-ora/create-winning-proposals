-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create psychology_profiles table
CREATE TABLE public.psychology_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  risk_tolerance TEXT,
  decision_making_style TEXT,
  communication_preference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create proposals table
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  psychology_profile_id UUID REFERENCES public.psychology_profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  total_value DECIMAL(12,2),
  currency TEXT NOT NULL DEFAULT 'USD',
  valid_until DATE,
  sections JSONB,
  settings JSONB,
  status TEXT NOT NULL DEFAULT 'draft',
  password_hash TEXT,
  created_by_api_key UUID REFERENCES public.api_keys(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create proposal_events table for tracking
CREATE TABLE public.proposal_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychology_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients
CREATE POLICY "API keys can manage clients" 
ON public.clients 
FOR ALL 
USING (true);

-- RLS Policies for psychology_profiles
CREATE POLICY "API keys can manage psychology profiles" 
ON public.psychology_profiles 
FOR ALL 
USING (true);

-- RLS Policies for proposals
CREATE POLICY "Proposals are viewable by everyone" 
ON public.proposals 
FOR SELECT 
USING (true);

CREATE POLICY "API keys can manage proposals" 
ON public.proposals 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "API keys can update proposals" 
ON public.proposals 
FOR UPDATE 
USING (true);

-- RLS Policies for proposal_events
CREATE POLICY "Anyone can insert events" 
ON public.proposal_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "API keys can view events" 
ON public.proposal_events 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_psychology_profiles_updated_at
  BEFORE UPDATE ON public.psychology_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();