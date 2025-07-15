import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('🔍 Debug endpoint called')

    // Get last created proposals
    const { data: proposals, error: proposalsError } = await supabaseClient
      .from('proposals')
      .select(`
        *,
        client:clients(*),
        psychology_profile:psychology_profiles(*)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    if (proposalsError) {
      console.error('❌ Error fetching proposals:', proposalsError)
    }

    // Get all clients
    const { data: clients, error: clientsError } = await supabaseClient
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (clientsError) {
      console.error('❌ Error fetching clients:', clientsError)
    }

    // Get recent events
    const { data: events, error: eventsError } = await supabaseClient
      .from('proposal_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (eventsError) {
      console.error('❌ Error fetching events:', eventsError)
    }

    // Get API keys (without sensitive data)
    const { data: apiKeys, error: apiKeysError } = await supabaseClient
      .from('api_keys')
      .select('id, name, created_at, last_used, is_active')
      .order('created_at', { ascending: false })

    if (apiKeysError) {
      console.error('❌ Error fetching API keys:', apiKeysError)
    }

    const debugData = {
      timestamp: new Date().toISOString(),
      database_status: {
        proposals: {
          count: proposals?.length || 0,
          error: proposalsError?.message || null,
          data: proposals || []
        },
        clients: {
          count: clients?.length || 0,
          error: clientsError?.message || null,
          data: clients || []
        },
        events: {
          count: events?.length || 0,
          error: eventsError?.message || null,
          data: events || []
        },
        api_keys: {
          count: apiKeys?.length || 0,
          error: apiKeysError?.message || null,
          data: apiKeys || []
        }
      },
      environment: {
        supabase_url: Deno.env.get('SUPABASE_URL'),
        has_service_role_key: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      }
    }

    console.log('✅ Debug data collected:', {
      proposalsCount: proposals?.length,
      clientsCount: clients?.length,
      eventsCount: events?.length
    })

    return new Response(JSON.stringify(debugData, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('💥 Debug endpoint error:', error)
    return new Response(JSON.stringify({ 
      error: 'Debug endpoint failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})