import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting cleanup of test API keys...');

    // Get all API keys to see what we're deleting
    const { data: existingKeys, error: fetchError } = await supabase
      .from('api_keys')
      .select('id, name, created_at');

    if (fetchError) {
      console.error('Error fetching API keys:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${existingKeys?.length || 0} API keys to delete`);

    // Delete all API keys (they're all test keys)
    const { error: deleteError } = await supabase
      .from('api_keys')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except impossible UUID

    if (deleteError) {
      console.error('Error deleting API keys:', deleteError);
      throw deleteError;
    }

    console.log(`Successfully deleted ${existingKeys?.length || 0} test API keys`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        deletedCount: existingKeys?.length || 0,
        message: `Deleted ${existingKeys?.length || 0} test API keys`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in cleanup-test-api-keys function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to cleanup API keys',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});