-- Proposal Generation System Database Setup
-- ==========================================

-- Create the api_keys table for storing API key information
CREATE TABLE IF NOT EXISTS public.api_keys (
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
CREATE POLICY "Service role can manage API keys"
ON public.api_keys
FOR ALL
USING (true);

-- Create an index on key_hash for faster lookups during authentication
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON public.api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON public.api_keys(is_active);

-- Add a function to update the last_used timestamp
CREATE OR REPLACE FUNCTION public.update_api_key_last_used(key_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.api_keys
  SET last_used = now()
  WHERE id = key_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create psychology_profiles table
CREATE TABLE IF NOT EXISTS public.psychology_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  risk_tolerance TEXT,
  decision_making_style TEXT,
  communication_preference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create proposals table
CREATE TABLE IF NOT EXISTS public.proposals (
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
CREATE TABLE IF NOT EXISTS public.proposal_events (
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

-- Create email_logs table for tracking all sent emails
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipients TEXT[] NOT NULL,
  subject TEXT NOT NULL,
  type TEXT,
  service TEXT NOT NULL DEFAULT 'console',
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent',
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email_templates table for customizable templates
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  html_template TEXT NOT NULL,
  text_template TEXT NOT NULL,
  variables JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification_preferences table for user preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL UNIQUE,
  proposal_created BOOLEAN NOT NULL DEFAULT true,
  proposal_viewed BOOLEAN NOT NULL DEFAULT true,
  proposal_accepted BOOLEAN NOT NULL DEFAULT true,
  proposal_expired BOOLEAN NOT NULL DEFAULT false,
  weekly_summary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for email tables
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for email tables
CREATE POLICY "Service role can manage email logs"
ON public.email_logs
FOR ALL
USING (true);

CREATE POLICY "Service role can manage email templates"
ON public.email_templates
FOR ALL
USING (true);

CREATE POLICY "Users can manage their own notification preferences"
ON public.notification_preferences
FOR ALL
USING (true);

-- Create indexes for email tables
CREATE INDEX IF NOT EXISTS idx_email_logs_recipients ON public.email_logs USING gin(recipients);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON public.email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON public.email_logs(type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);

-- Create triggers for email template updates
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default email templates
INSERT INTO public.email_templates (name, subject, html_template, text_template, variables)
VALUES
(
  'proposal_created',
  'New Proposal: {{title}}',
  '<h1>Proposal Created</h1><p>Your proposal "{{title}}" for {{clientName}} has been created.</p><a href="{{proposalUrl}}">View Proposal</a>',
  'Proposal Created\n\nYour proposal "{{title}}" for {{clientName}} has been created.\n\nView: {{proposalUrl}}',
  '{"title": "string", "clientName": "string", "proposalUrl": "string"}'::jsonb
),
(
  'proposal_viewed',
  'Proposal Viewed: {{title}}',
  '<h1>Proposal Viewed</h1><p>{{clientName}} has viewed your proposal "{{title}}".</p>',
  'Proposal Viewed\n\n{{clientName}} has viewed your proposal "{{title}}".',
  '{"title": "string", "clientName": "string"}'::jsonb
),
(
  'proposal_accepted',
  '🎉 Proposal Accepted: {{title}}',
  '<h1>Congratulations!</h1><p>{{clientName}} has accepted your proposal "{{title}}" worth {{value}}.</p>',
  'Congratulations!\n\n{{clientName}} has accepted your proposal "{{title}}" worth {{value}}.',
  '{"title": "string", "clientName": "string", "value": "string"}'::jsonb
)
ON CONFLICT (name) DO NOTHING;

-- Create initial API key for testing
DO $$
DECLARE
  test_key_exists BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM public.api_keys WHERE name = 'Development Key') INTO test_key_exists;

  IF NOT test_key_exists THEN
    INSERT INTO public.api_keys (name, key_hash, is_active)
    VALUES (
      'Development Key',
      '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5',  -- SHA256 of '12345'
      true
    );
    RAISE NOTICE 'Created development API key. Use key: 12345 for testing';
  END IF;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Success message
SELECT 'Database setup completed successfully!' as message;