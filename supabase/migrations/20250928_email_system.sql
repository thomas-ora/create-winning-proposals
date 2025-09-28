-- Create email_logs table for tracking all sent emails
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  to TEXT[] NOT NULL,
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

-- Enable RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create indexes
CREATE INDEX idx_email_logs_to ON public.email_logs USING gin(to);
CREATE INDEX idx_email_logs_sent_at ON public.email_logs(sent_at DESC);
CREATE INDEX idx_email_logs_type ON public.email_logs(type);
CREATE INDEX idx_email_logs_status ON public.email_logs(status);

-- Insert default email templates
INSERT INTO public.email_templates (name, subject, html_template, text_template, variables) VALUES
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
);

-- Add trigger for updating timestamps
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();