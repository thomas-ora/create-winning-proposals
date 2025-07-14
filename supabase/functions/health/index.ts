import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HealthCheck {
  component: string;
  status: 'healthy' | 'degraded' | 'down';
  details?: string;
  response_time?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const startTime = Date.now();
    const healthChecks: HealthCheck[] = [];

    // Check Supabase connection
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const dbStart = Date.now();
      const { data, error } = await supabaseClient
        .from('api_keys')
        .select('id')
        .limit(1);

      const dbTime = Date.now() - dbStart;

      healthChecks.push({
        component: 'database',
        status: error ? 'down' : 'healthy',
        details: error ? error.message : 'Connected successfully',
        response_time: dbTime
      });
    } catch (error) {
      healthChecks.push({
        component: 'database',
        status: 'down',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check Edge Functions
    try {
      const functionsStart = Date.now();
      
      // Test if functions are reachable
      const functionTests = [
        'create-proposal',
        'get-proposal',
        'track-event',
        'generate-api-key'
      ];

      let functionsHealthy = true;
      for (const func of functionTests) {
        try {
          const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/${func}`, {
            method: 'OPTIONS'
          });
          if (response.status >= 500) {
            functionsHealthy = false;
            break;
          }
        } catch {
          functionsHealthy = false;
          break;
        }
      }

      const functionsTime = Date.now() - functionsStart;

      healthChecks.push({
        component: 'edge_functions',
        status: functionsHealthy ? 'healthy' : 'degraded',
        details: functionsHealthy ? 'All functions responding' : 'Some functions may be down',
        response_time: functionsTime
      });
    } catch (error) {
      healthChecks.push({
        component: 'edge_functions',
        status: 'down',
        details: error instanceof Error ? error.message : 'Functions not reachable'
      });
    }

    // Check API Key validation system
    try {
      const apiKeyStart = Date.now();
      
      // Test API key generation endpoint
      const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-api-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'health-check-test' })
      });

      const apiKeyTime = Date.now() - apiKeyStart;
      const isHealthy = response.status === 200 || response.status === 400; // 400 is OK (bad request, but function works)

      healthChecks.push({
        component: 'api_keys',
        status: isHealthy ? 'healthy' : 'degraded',
        details: isHealthy ? 'API key system operational' : 'API key system may be down',
        response_time: apiKeyTime
      });
    } catch (error) {
      healthChecks.push({
        component: 'api_keys',
        status: 'down',
        details: error instanceof Error ? error.message : 'API key system not reachable'
      });
    }

    // Overall system status
    const totalTime = Date.now() - startTime;
    const hasDown = healthChecks.some(check => check.status === 'down');
    const hasDegraded = healthChecks.some(check => check.status === 'degraded');
    
    const overallStatus = hasDown ? 'down' : hasDegraded ? 'degraded' : 'healthy';
    const httpStatus = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;

    const healthResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      response_time: totalTime,
      version: '1.0.0',
      checks: healthChecks,
      summary: {
        total_checks: healthChecks.length,
        healthy: healthChecks.filter(c => c.status === 'healthy').length,
        degraded: healthChecks.filter(c => c.status === 'degraded').length,
        down: healthChecks.filter(c => c.status === 'down').length
      }
    };

    return new Response(JSON.stringify(healthResponse), {
      status: httpStatus,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    const errorResponse = {
      status: 'down',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: []
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})