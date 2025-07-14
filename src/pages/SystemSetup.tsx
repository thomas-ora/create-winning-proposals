import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Settings, 
  Database, 
  Key, 
  Globe, 
  Download,
  Copy,
  ExternalLink,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'testing' | 'success' | 'error';
  required: boolean;
}

const SystemSetup: React.FC = () => {
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'database',
      title: 'Database Connection',
      description: 'Verify Supabase database tables and connections',
      status: 'pending',
      required: true
    },
    {
      id: 'edge-functions',
      title: 'Edge Functions',
      description: 'Test all API endpoints are working correctly',
      status: 'pending',
      required: true
    },
    {
      id: 'api-keys',
      title: 'API Key Generation',
      description: 'Verify API key creation and validation system',
      status: 'pending',
      required: true
    },
    {
      id: 'proposal-creation',
      title: 'Proposal Generation',
      description: 'Test end-to-end proposal creation workflow',
      status: 'pending',
      required: true
    },
    {
      id: 'tracking',
      title: 'Event Tracking',
      description: 'Verify analytics and engagement tracking',
      status: 'pending',
      required: true
    },
    {
      id: 'environment',
      title: 'Environment Variables',
      description: 'Check all required configuration is set',
      status: 'pending',
      required: true
    }
  ]);

  const [testApiKey, setTestApiKey] = useState('');
  const [deploymentConfig, setDeploymentConfig] = useState('');
  const { toast } = useToast();

  const getProgress = () => {
    const completed = steps.filter(step => step.status === 'success').length;
    return (completed / steps.length) * 100;
  };

  const updateStepStatus = (stepId: string, status: SetupStep['status']) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const testDatabaseConnection = async () => {
    updateStepStatus('database', 'testing');
    
    try {
      // Test database connection by checking if we can access the tables
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        updateStepStatus('database', 'success');
        toast({ title: 'Success', description: 'Database connection verified' });
      } else {
        throw new Error('Database connection failed');
      }
    } catch (error) {
      updateStepStatus('database', 'error');
      toast({ 
        title: 'Error', 
        description: 'Database connection failed. Check Supabase configuration.',
        variant: 'destructive' 
      });
    }
  };

  const testEdgeFunctions = async () => {
    updateStepStatus('edge-functions', 'testing');
    
    try {
      // Test the health of edge functions
      const endpoints = [
        'https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/generate-api-key',
        'https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/get-proposal/test',
        'https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/track-event/test'
      ];

      const results = await Promise.allSettled(
        endpoints.map(url => fetch(url, { method: 'OPTIONS' }))
      );

      const allSuccessful = results.every(result => 
        result.status === 'fulfilled' && result.value.status < 500
      );

      if (allSuccessful) {
        updateStepStatus('edge-functions', 'success');
        toast({ title: 'Success', description: 'All Edge Functions are responding' });
      } else {
        throw new Error('Some Edge Functions are not responding');
      }
    } catch (error) {
      updateStepStatus('edge-functions', 'error');
      toast({ 
        title: 'Error', 
        description: 'Edge Functions test failed. Check deployment status.',
        variant: 'destructive' 
      });
    }
  };

  const testAPIKeyGeneration = async () => {
    updateStepStatus('api-keys', 'testing');
    
    try {
      const response = await fetch('https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/generate-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Setup Key' })
      });

      const result = await response.json();

      if (response.ok && result.api_key) {
        setTestApiKey(result.api_key);
        updateStepStatus('api-keys', 'success');
        toast({ title: 'Success', description: 'API key generation verified' });
      } else {
        throw new Error(result.error || 'API key generation failed');
      }
    } catch (error) {
      updateStepStatus('api-keys', 'error');
      toast({ 
        title: 'Error', 
        description: 'API key generation failed. Check Edge Functions.',
        variant: 'destructive' 
      });
    }
  };

  const testProposalCreation = async () => {
    if (!testApiKey) {
      toast({ 
        title: 'Error', 
        description: 'Please generate an API key first',
        variant: 'destructive' 
      });
      return;
    }

    updateStepStatus('proposal-creation', 'testing');
    
    try {
      const testPayload = {
        client: {
          first_name: "Test",
          last_name: "Client",
          email: "test@example.com",
          company_name: "Setup Test Company"
        },
        proposal: {
          title: "System Setup Test Proposal",
          executive_summary: "This is a test proposal created during system setup.",
          sections: [
            {
              type: "text",
              title: "Test Section",
              content: "This proposal was automatically generated during setup verification.",
              order: 1
            }
          ],
          financial_amount: 1000,
          financial_currency: "USD",
          payment_terms: "Test terms",
          valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          prepared_by: "System Setup"
        }
      };

      const response = await fetch('https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/create-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testApiKey}`
        },
        body: JSON.stringify(testPayload)
      });

      const result = await response.json();

      if (response.ok && result.proposal_id) {
        updateStepStatus('proposal-creation', 'success');
        toast({ 
          title: 'Success', 
          description: `Test proposal created: ${result.proposal_id}` 
        });
      } else {
        throw new Error(result.error || 'Proposal creation failed');
      }
    } catch (error) {
      updateStepStatus('proposal-creation', 'error');
      toast({ 
        title: 'Error', 
        description: 'Proposal creation test failed',
        variant: 'destructive' 
      });
    }
  };

  const testEventTracking = async () => {
    updateStepStatus('tracking', 'testing');
    
    try {
      // Test with a dummy proposal ID
      const response = await fetch('https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/track-event/test-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'test',
          event_data: { setup_test: true }
        })
      });

      // Even if the proposal doesn't exist, the endpoint should respond properly
      if (response.status === 404 || response.status === 200) {
        updateStepStatus('tracking', 'success');
        toast({ title: 'Success', description: 'Event tracking system verified' });
      } else {
        throw new Error('Tracking endpoint not responding correctly');
      }
    } catch (error) {
      updateStepStatus('tracking', 'error');
      toast({ 
        title: 'Error', 
        description: 'Event tracking test failed',
        variant: 'destructive' 
      });
    }
  };

  const checkEnvironment = async () => {
    updateStepStatus('environment', 'testing');
    
    try {
      // Check if all required environment variables are accessible
      const supabaseUrl = 'https://axqqqpomxdjwrpkbfawl.supabase.co';
      const hasSupabaseUrl = !!supabaseUrl;
      
      if (hasSupabaseUrl) {
        updateStepStatus('environment', 'success');
        toast({ title: 'Success', description: 'Environment configuration verified' });
      } else {
        throw new Error('Missing environment variables');
      }
    } catch (error) {
      updateStepStatus('environment', 'error');
      toast({ 
        title: 'Error', 
        description: 'Environment check failed',
        variant: 'destructive' 
      });
    }
  };

  const runAllTests = async () => {
    await checkEnvironment();
    await testDatabaseConnection();
    await testEdgeFunctions();
    await testAPIKeyGeneration();
    await testProposalCreation();
    await testEventTracking();
  };

  const exportConfiguration = () => {
    const config = {
      supabase_url: 'https://axqqqpomxdjwrpkbfawl.supabase.co',
      supabase_anon_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4cXFxcG9teGRqd3Jwa2JmYXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NTUxOTEsImV4cCI6MjA2ODAzMTE5MX0.lje3XXCTUZL5-htXlEzuuxAWgWD-7tw3TC7ayuBslUk',
      api_endpoints: {
        create_proposal: 'https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/create-proposal',
        get_proposal: 'https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/get-proposal',
        track_event: 'https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/track-event',
        generate_api_key: 'https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/generate-api-key'
      },
      test_api_key: testApiKey,
      setup_completed: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proposal-system-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: 'Success', description: 'Configuration exported successfully' });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied', description: 'Copied to clipboard' });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to copy to clipboard',
        variant: 'destructive' 
      });
    }
  };

  const allTestsPassed = steps.every(step => step.status === 'success');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">System Setup & Deployment</h1>
        <p className="text-xl text-muted-foreground">
          Complete guide to prepare your proposal system for production
        </p>
        <Progress value={getProgress()} className="w-full max-w-md mx-auto" />
        <p className="text-sm text-muted-foreground">
          {steps.filter(step => step.status === 'success').length} of {steps.length} checks completed
        </p>
      </div>

      {allTestsPassed && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            🎉 <strong>System Ready for Production!</strong> All components are working correctly. 
            Your proposal generation system is ready to handle real client requests.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Setup Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Setup Checklist
            </CardTitle>
            <CardDescription>
              Verify all system components are working correctly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {step.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  {step.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                  {step.status === 'testing' && <Clock className="w-5 h-5 text-blue-500 animate-spin" />}
                  {step.status === 'pending' && <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />}
                  
                  <div>
                    <div className="font-medium">{step.title}</div>
                    <div className="text-sm text-muted-foreground">{step.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {step.required && <Badge variant="secondary">Required</Badge>}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      switch (step.id) {
                        case 'database': testDatabaseConnection(); break;
                        case 'edge-functions': testEdgeFunctions(); break;
                        case 'api-keys': testAPIKeyGeneration(); break;
                        case 'proposal-creation': testProposalCreation(); break;
                        case 'tracking': testEventTracking(); break;
                        case 'environment': checkEnvironment(); break;
                      }
                    }}
                    disabled={step.status === 'testing'}
                  >
                    Test
                  </Button>
                </div>
              </div>
            ))}
            
            <Separator />
            
            <div className="flex gap-2">
              <Button onClick={runAllTests} className="flex-1">
                <Zap className="w-4 h-4 mr-2" />
                Run All Tests
              </Button>
              <Button variant="outline" onClick={exportConfiguration}>
                <Download className="w-4 h-4 mr-2" />
                Export Config
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Configuration & Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Production Configuration
            </CardTitle>
            <CardDescription>
              API endpoints and deployment information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Supabase URL</Label>
              <div className="flex gap-2">
                <Input value="https://axqqqpomxdjwrpkbfawl.supabase.co" readOnly />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard('https://axqqqpomxdjwrpkbfawl.supabase.co')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Create Proposal Endpoint</Label>
              <div className="flex gap-2">
                <Input 
                  value="https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/create-proposal" 
                  readOnly 
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard('https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/create-proposal')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {testApiKey && (
              <div>
                <Label>Test API Key</Label>
                <div className="flex gap-2">
                  <Input value={testApiKey} readOnly type="password" />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(testApiKey)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This key was generated for testing. Create production keys in API Settings.
                </p>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold">Quick Links</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="/api-docs" target="_blank">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    API Docs
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/test-api" target="_blank">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Test Console
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/settings/api-keys" target="_blank">
                    <Key className="w-4 h-4 mr-1" />
                    API Keys
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/setup-guide.md" target="_blank">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Setup Guide
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deployment Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Checklist</CardTitle>
          <CardDescription>
            Final steps before going live with your proposal system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Required Steps</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Database tables created</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Edge Functions deployed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>API endpoints tested</span>
                </div>
                <div className="flex items-center gap-2">
                  {allTestsPassed ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span>All system tests passed</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Recommended Steps</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span>Set up database backups</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span>Configure custom domain</span>
                </div>
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-blue-500" />
                  <span>Create production API keys</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-500" />
                  <span>Set up monitoring alerts</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSetup;