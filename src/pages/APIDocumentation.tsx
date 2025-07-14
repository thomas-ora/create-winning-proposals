import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Book, Code, Key, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';

const APIDocumentation: React.FC = () => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied',
        description: 'Code copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'json' }) => (
    <div className="relative">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <Button
        variant="outline"
        size="sm"
        className="absolute top-2 right-2"
        onClick={() => copyToClipboard(code)}
      >
        <Copy className="w-4 h-4" />
      </Button>
    </div>
  );

  const baseUrl = 'https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1';

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Book className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">API Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Complete guide to integrating with the Proposal Generation API
        </p>
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Start
          </CardTitle>
          <CardDescription>
            Get started with the Proposal API in minutes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Key className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">1. Get API Key</h3>
              <p className="text-sm text-muted-foreground">Generate an API key from the settings page</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Code className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">2. Make Request</h3>
              <p className="text-sm text-muted-foreground">Send proposal data to the API endpoint</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <ExternalLink className="w-8 h-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">3. Get URL</h3>
              <p className="text-sm text-muted-foreground">Receive the public proposal URL</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>
            All API requests require authentication using a Bearer token
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Include your API key in the Authorization header:</p>
          <CodeBlock
            language="http"
            code={`Authorization: Bearer YOUR_API_KEY_HERE`}
          />
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div className="text-sm">
              <strong>Rate Limit:</strong> 100 requests per minute per API key
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">API Endpoints</h2>

        {/* Create Proposal */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Create Proposal</CardTitle>
              <Badge variant="secondary">POST</Badge>
            </div>
            <CardDescription>
              {baseUrl}/create-proposal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Request Body:</h4>
              <CodeBlock
                code={`{
  "client": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@company.com",
    "phone": "+1-555-0123",
    "title": "CEO",
    "company_name": "Acme Corp",
    "company_website": "https://acme.com",
    "industry": "Technology",
    "employee_count": 150,
    "revenue_range": "$1M-$10M",
    "growth_stage": "Growth",
    "consultation_date": "2024-07-15T10:00:00Z"
  },
  "psychology_profile": {
    "primary_type": "Driver",
    "secondary_type": "Analytical",
    "decision_style": "Fast",
    "decision_authority": "Full",
    "risk_tolerance": "Moderate"
  },
  "proposal": {
    "title": "Digital Transformation Strategy",
    "executive_summary": "Comprehensive analysis and recommendations...",
    "sections": [
      {
        "type": "text",
        "title": "Current State Analysis",
        "content": "Your current systems and processes...",
        "order": 1
      }
    ],
    "financial_amount": 50000,
    "financial_currency": "USD",
    "payment_terms": "Net 30",
    "valid_until": "2024-08-15T23:59:59Z",
    "prepared_by": "Jane Smith",
    "password_protected": false,
    "brand_color": "#7B7FEB"
  }
}`}
              />
            </div>

            <div>
              <h4 className="font-semibold mb-2">Response:</h4>
              <CodeBlock
                code={`{
  "success": true,
  "proposal_id": "123e4567-e89b-12d3-a456-426614174000",
  "url": "https://your-domain.com/p/123e4567-e89b-12d3-a456-426614174000",
  "expires_at": "2024-08-15T23:59:59Z"
}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Get Proposal */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Get Proposal</CardTitle>
              <Badge variant="outline">GET</Badge>
            </div>
            <CardDescription>
              {baseUrl}/get-proposal/[proposal_id]
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">URL Parameters:</h4>
              <CodeBlock
                language="http"
                code={`GET ${baseUrl}/get-proposal/123e4567-e89b-12d3-a456-426614174000`}
              />
            </div>

            <div>
              <h4 className="font-semibold mb-2">Query Parameters (optional):</h4>
              <CodeBlock
                language="http"
                code={`?password=secret123`}
              />
            </div>

            <div>
              <h4 className="font-semibold mb-2">Response:</h4>
              <CodeBlock
                code={`{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Digital Transformation Strategy",
  "client": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@company.com",
    "company_name": "Acme Corp"
  },
  "proposal": {
    "executive_summary": "...",
    "sections": [...],
    "financial_amount": 50000,
    "valid_until": "2024-08-15T23:59:59Z"
  },
  "status": "viewed"
}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Track Event */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Track Event</CardTitle>
              <Badge variant="secondary">POST</Badge>
            </div>
            <CardDescription>
              {baseUrl}/track-event/[proposal_id]
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Request Body:</h4>
              <CodeBlock
                code={`{
  "event_type": "section_view",
  "section": "pricing",
  "duration": 45,
  "event_data": {
    "additional_context": "user scrolled to pricing section"
  }
}`}
              />
            </div>

            <div>
              <h4 className="font-semibold mb-2">Event Types:</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <Badge variant="outline">view</Badge>
                <Badge variant="outline">section_view</Badge>
                <Badge variant="outline">click</Badge>
                <Badge variant="outline">download</Badge>
                <Badge variant="outline">calculator_use</Badge>
                <Badge variant="outline">cta_click</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* N8N Integration */}
      <Card>
        <CardHeader>
          <CardTitle>N8N Integration</CardTitle>
          <CardDescription>
            Step-by-step guide to integrate with N8N workflows
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">HTTP Request Node Configuration:</h4>
            
            <div className="space-y-4">
              <div>
                <h5 className="font-medium mb-2">1. Basic Settings:</h5>
                <CodeBlock
                  language="json"
                  code={`{
  "method": "POST",
  "url": "${baseUrl}/create-proposal",
  "authentication": "headerAuth",
  "sendHeaders": true
}`}
                />
              </div>

              <div>
                <h5 className="font-medium mb-2">2. Headers:</h5>
                <CodeBlock
                  language="json"
                  code={`{
  "Authorization": "Bearer YOUR_API_KEY",
  "Content-Type": "application/json"
}`}
                />
              </div>

              <div>
                <h5 className="font-medium mb-2">3. Body (JSON):</h5>
                <CodeBlock
                  code={`{
  "client": {
    "first_name": "{{ $json.client_first_name }}",
    "last_name": "{{ $json.client_last_name }}",
    "email": "{{ $json.client_email }}",
    "company_name": "{{ $json.company_name }}"
  },
  "proposal": {
    "title": "{{ $json.proposal_title }}",
    "executive_summary": "{{ $json.executive_summary }}",
    "sections": {{ $json.sections }},
    "financial_amount": {{ $json.amount }},
    "financial_currency": "USD",
    "payment_terms": "Net 30",
    "valid_until": "{{ $json.valid_until }}",
    "prepared_by": "{{ $json.prepared_by }}"
  }
}`}
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="text-sm">
                <strong>Pro Tip:</strong> Store the returned proposal URL in your CRM or send it directly to clients via email automation.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Codes */}
      <Card>
        <CardHeader>
          <CardTitle>Error Codes</CardTitle>
          <CardDescription>
            Common error responses and how to handle them
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <Badge variant="destructive">400</Badge>
                <span className="ml-2 font-medium">Bad Request</span>
              </div>
              <span className="text-sm text-muted-foreground">Invalid or missing required fields</span>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <Badge variant="destructive">401</Badge>
                <span className="ml-2 font-medium">Unauthorized</span>
              </div>
              <span className="text-sm text-muted-foreground">Invalid or missing API key</span>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <Badge variant="destructive">404</Badge>
                <span className="ml-2 font-medium">Not Found</span>
              </div>
              <span className="text-sm text-muted-foreground">Proposal does not exist</span>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <Badge variant="destructive">429</Badge>
                <span className="ml-2 font-medium">Too Many Requests</span>
              </div>
              <span className="text-sm text-muted-foreground">Rate limit exceeded (100/min)</span>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <Badge variant="destructive">500</Badge>
                <span className="ml-2 font-medium">Server Error</span>
              </div>
              <span className="text-sm text-muted-foreground">Internal server error</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </AppLayout>
  );
};

export default APIDocumentation;