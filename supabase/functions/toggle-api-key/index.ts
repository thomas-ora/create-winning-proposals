import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ToggleKeyRequest {
  id: string;
  is_active: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { id, is_active }: ToggleKeyRequest = await req.json();

    if (!id || typeof is_active !== 'boolean') {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: id and is_active' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`Toggling API key ${id} to ${is_active ? 'active' : 'inactive'}`);

    // Update the API key status
    const { data, error } = await supabase
      .from('api_keys')
      .update({ is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling API key:', error);
      throw error;
    }

    console.log('Successfully toggled API key status');

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          id: data.id,
          name: data.name,
          is_active: data.is_active,
          created_at: data.created_at,
          last_used: data.last_used
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in toggle-api-key function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to toggle API key',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});