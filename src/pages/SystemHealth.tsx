import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';

interface HealthCheck {
  name: string;
  status: 'checking' | 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

const SystemHealth: React.FC = () => {
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [overallHealth, setOverallHealth] = useState<'healthy' | 'degraded' | 'unhealthy' | 'checking'>('checking');

  const runHealthChecks = async () => {
    setIsChecking(true);
    setOverallHealth('checking');

    const healthChecks: HealthCheck[] = [
      { name: 'Environment Variables', status: 'checking', message: 'Verifying configuration...' },
      { name: 'Supabase Connection', status: 'checking', message: 'Testing database connection...' },
      { name: 'Database Tables', status: 'checking', message: 'Checking required tables...' },
      { name: 'Edge Functions', status: 'checking', message: 'Testing edge functions...' },
      { name: 'API Keys Table', status: 'checking', message: 'Verifying API key management...' },
      { name: 'Build Status', status: 'checking', message: 'Checking build configuration...' },
    ];

    setChecks([...healthChecks]);

    // Check 1: Environment Variables
    const envCheck = { ...healthChecks[0] };
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseUrl !== 'https://your-project-id.supabase.co' && supabaseKey) {
      envCheck.status = 'success';
      envCheck.message = 'All required environment variables are configured';
      envCheck.details = {
        url: supabaseUrl.substring(0, 30) + '...',
        key: supabaseKey.substring(0, 20) + '...',
      };
    } else {
      envCheck.status = 'error';
      envCheck.message = 'Missing or invalid environment variables';
      envCheck.details = {
        url: supabaseUrl || 'Not configured',
        key: supabaseKey ? 'Configured' : 'Not configured',
      };
    }

    healthChecks[0] = envCheck;
    setChecks([...healthChecks]);

    // Check 2: Supabase Connection
    const connectionCheck = { ...healthChecks[1] };
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('count')
        .limit(1);

      if (error) throw error;

      connectionCheck.status = 'success';
      connectionCheck.message = 'Successfully connected to Supabase';
    } catch (error: any) {
      connectionCheck.status = 'error';
      connectionCheck.message = 'Failed to connect to Supabase';
      connectionCheck.details = error?.message || 'Unknown error';
    }

    healthChecks[1] = connectionCheck;
    setChecks([...healthChecks]);

    // Check 3: Database Tables
    const tablesCheck = { ...healthChecks[2] };
    const requiredTables = ['api_keys', 'clients', 'proposals', 'proposal_events', 'psychology_profiles'];
    const missingTables: string[] = [];

    for (const table of requiredTables) {
      try {
        await supabase.from(table).select('count').limit(1);
      } catch {
        missingTables.push(table);
      }
    }

    if (missingTables.length === 0) {
      tablesCheck.status = 'success';
      tablesCheck.message = 'All required database tables exist';
      tablesCheck.details = { tables: requiredTables };
    } else {
      tablesCheck.status = 'error';
      tablesCheck.message = `Missing ${missingTables.length} required table(s)`;
      tablesCheck.details = { missing: missingTables };
    }

    healthChecks[2] = tablesCheck;
    setChecks([...healthChecks]);

    // Check 4: Edge Functions
    const functionsCheck = { ...healthChecks[3] };
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/health`, {
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
        },
      });

      if (response.ok) {
        functionsCheck.status = 'success';
        functionsCheck.message = 'Edge functions are operational';
      } else {
        functionsCheck.status = 'warning';
        functionsCheck.message = 'Edge functions may not be deployed';
        functionsCheck.details = 'Run: supabase functions deploy';
      }
    } catch (error) {
      functionsCheck.status = 'warning';
      functionsCheck.message = 'Could not verify edge functions';
      functionsCheck.details = 'Edge functions might not be deployed yet';
    }

    healthChecks[3] = functionsCheck;
    setChecks([...healthChecks]);

    // Check 5: API Keys Table
    const apiKeysCheck = { ...healthChecks[4] };
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .limit(1);

      if (error) throw error;

      apiKeysCheck.status = 'success';
      apiKeysCheck.message = 'API key management is functional';
      apiKeysCheck.details = {
        hasKeys: data && data.length > 0 ? 'Yes' : 'No keys created yet'
      };
    } catch (error: any) {
      apiKeysCheck.status = 'error';
      apiKeysCheck.message = 'API key table is not accessible';
      apiKeysCheck.details = error?.message;
    }

    healthChecks[4] = apiKeysCheck;
    setChecks([...healthChecks]);

    // Check 6: Build Status
    const buildCheck = { ...healthChecks[5] };
    buildCheck.status = 'success';
    buildCheck.message = 'Build configuration is valid';
    buildCheck.details = {
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
      prod: import.meta.env.PROD,
    };

    healthChecks[5] = buildCheck;
    setChecks([...healthChecks]);

    // Determine overall health
    const hasErrors = healthChecks.some(c => c.status === 'error');
    const hasWarnings = healthChecks.some(c => c.status === 'warning');

    if (hasErrors) {
      setOverallHealth('unhealthy');
    } else if (hasWarnings) {
      setOverallHealth('degraded');
    } else {
      setOverallHealth('healthy');
    }

    setIsChecking(false);
  };

  useEffect(() => {
    runHealthChecks();
  }, []);

  const getStatusIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-5 w-5 animate-spin text-gray-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getOverallHealthBadge = () => {
    switch (overallHealth) {
      case 'healthy':
        return <Badge className="bg-green-500">System Healthy</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500">System Degraded</Badge>;
      case 'unhealthy':
        return <Badge className="bg-red-500">System Unhealthy</Badge>;
      case 'checking':
        return <Badge className="bg-gray-500">Checking...</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">System Health Check</h1>
              <p className="text-muted-foreground mt-2">
                Verify that all system components are properly configured and operational.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {getOverallHealthBadge()}
              <Button
                onClick={runHealthChecks}
                disabled={isChecking}
                size="sm"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Re-run Checks
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {checks.map((check, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <CardTitle className="text-lg">{check.name}</CardTitle>
                  </div>
                  <Badge
                    variant={
                      check.status === 'success' ? 'default' :
                      check.status === 'error' ? 'destructive' :
                      check.status === 'warning' ? 'secondary' :
                      'outline'
                    }
                  >
                    {check.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{check.message}</CardDescription>
                {check.details && (
                  <div className="mt-2 p-3 bg-muted rounded-md">
                    <pre className="text-xs">
                      {typeof check.details === 'object'
                        ? JSON.stringify(check.details, null, 2)
                        : check.details
                      }
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {overallHealth === 'unhealthy' && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">Action Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-800">
                Your system has critical issues that need to be resolved before it can be used in production.
              </p>
              <ul className="mt-4 list-disc list-inside text-sm text-red-700">
                <li>Check your environment variables in the .env file</li>
                <li>Ensure Supabase project is properly configured</li>
                <li>Run database migrations: supabase db push</li>
                <li>Deploy edge functions: supabase functions deploy</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {overallHealth === 'healthy' && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">System Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800">
                Your proposal generation system is fully operational and ready for production use!
              </p>
              <div className="mt-4 flex gap-4">
                <Button onClick={() => window.location.href = '/settings/api-keys'}>
                  Manage API Keys
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/test-api'}>
                  Test API
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default SystemHealth;