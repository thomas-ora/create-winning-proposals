import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateKeyRequest {
  name: string
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

    // For now, we'll allow anyone to create API keys
    // In production, this should require admin authentication
    const { name } = await req.json() as GenerateKeyRequest

    if (!name || name.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'API key name is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Generate a secure random API key (32 bytes = 64 hex characters)
    const keyBytes = new Uint8Array(32)
    crypto.getRandomValues(keyBytes)
    const apiKey = Array.from(keyBytes, byte => byte.toString(16).padStart(2, '0')).join('')

    // Hash the API key for storage
    const encoder = new TextEncoder()
    const keyData = encoder.encode(apiKey)
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Store in database
    const { data, error } = await supabaseClient
      .from('api_keys')
      .insert({
        name: name.trim(),
        key_hash: keyHash,
        is_active: true
      })
      .select('id, name, created_at')
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response(JSON.stringify({ error: 'Failed to create API key' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Return the unhashed key (only time it's shown)
    return new Response(JSON.stringify({
      success: true,
      api_key: apiKey,
      name: data.name,
      id: data.id,
      created_at: data.created_at,
      warning: 'This API key will only be shown once. Please save it securely.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in generate-api-key function:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})