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
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/').filter(Boolean)
    let proposalId = pathParts[pathParts.length - 1]
    let isSlugLookup = false
    
    // Check if this is a slug lookup (path contains '/slug/')
    if (pathParts.includes('slug')) {
      isSlugLookup = true
      proposalId = pathParts[pathParts.length - 1]
    }
    
    const password = url.searchParams.get('password')

    if (!proposalId) {
      return new Response(JSON.stringify({ error: 'Proposal ID or slug is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Looking up proposal:', { proposalId, isSlugLookup })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Build query based on lookup type
    let query = supabaseClient
      .from('proposals')
      .select(`
        *,
        client:clients(*),
        psychology_profile:psychology_profiles(*)
      `)
    
    // Query by slug or ID
    if (isSlugLookup) {
      query = query.eq('slug', proposalId)
    } else {
      query = query.eq('id', proposalId)
    }
    
    const { data: proposal, error: proposalError } = await query.single()

    if (proposalError || !proposal) {
      console.log('Proposal not found:', { proposalId, isSlugLookup, error: proposalError })
      return new Response(JSON.stringify({ error: 'Proposal not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check if proposal has expired
    if (proposal.valid_until && new Date(proposal.valid_until) < new Date()) {
      return new Response(JSON.stringify({ error: 'Proposal has expired' }), {
        status: 410,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check password protection
    if (proposal.password_protected && proposal.password_hash) {
      if (!password) {
        return new Response(JSON.stringify({ 
          error: 'Password required',
          password_required: true 
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Hash provided password and compare
      const encoder = new TextEncoder()
      const data = encoder.encode(password)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const providedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

      if (providedHash !== proposal.password_hash) {
        return new Response(JSON.stringify({ error: 'Invalid password' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    // Track view event
    const userAgent = req.headers.get('user-agent') || ''
    const forwardedFor = req.headers.get('x-forwarded-for')
    const ipAddress = forwardedFor?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown'

    await supabaseClient
      .from('proposal_events')
      .insert({
        proposal_id: proposal.id, // Always use the actual UUID for tracking
        event_type: 'view',
        event_data: {
          timestamp: new Date().toISOString(),
          page: 'proposal_view',
          accessed_via: isSlugLookup ? 'slug' : 'id',
          slug_used: isSlugLookup ? proposalId : null
        },
        ip_address: ipAddress,
        user_agent: userAgent
      })

    // Update proposal status to viewed if it was sent
    if (proposal.status === 'sent') {
      await supabaseClient
        .from('proposals')
        .update({ 
          status: 'viewed',
          updated_at: new Date().toISOString()
        })
        .eq('id', proposal.id) // Always use the actual UUID for updates
    }

    // Remove sensitive data from response
    const { password_hash, created_by_api_key, ...safeProposal } = proposal

    return new Response(JSON.stringify(safeProposal), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in get-proposal function:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})