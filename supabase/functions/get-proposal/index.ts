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

    console.log('🔍 Get Proposal Request:', {
      fullUrl: req.url,
      pathParts,
      proposalId,
      isSlugLookup,
      hasPassword: !!password,
      method: req.method
    })

    if (!proposalId) {
      console.error('❌ No proposal ID provided')
      return new Response(JSON.stringify({ error: 'Proposal ID or slug is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

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

    console.log('📊 Database Query Result:', {
      proposalFound: !!proposal,
      error: proposalError?.message,
      proposalId: proposal?.id,
      clientName: proposal?.client?.name,
      title: proposal?.title,
      status: proposal?.status
    })

    if (proposalError || !proposal) {
      console.error('❌ Proposal not found:', { 
        searchId: proposalId, 
        isSlugLookup, 
        error: proposalError?.message || 'No data returned'
      })
      return new Response(JSON.stringify({ 
        error: 'Proposal not found',
        details: {
          searchId: proposalId,
          isSlugLookup,
          errorMessage: proposalError?.message
        }
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check if proposal has expired - use robust UTC date comparison
    if (proposal.valid_until) {
      // Force UTC dates to eliminate timezone issues completely
      const now = new Date()
      const currentUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
      
      // Parse the valid_until date and create UTC date
      const validUntilDate = new Date(proposal.valid_until)
      const expirationUTC = new Date(Date.UTC(validUntilDate.getUTCFullYear(), validUntilDate.getUTCMonth(), validUntilDate.getUTCDate()))
      
      console.log('🔍 DEBUGGING: Date comparison with UTC normalization:', {
        proposalId: proposal.id,
        validUntilRaw: proposal.valid_until,
        validUntilParsed: validUntilDate.toISOString(),
        currentTimeRaw: now.toISOString(),
        currentUTC: currentUTC.toISOString(),
        expirationUTC: expirationUTC.toISOString(),
        isExpiredUTC: expirationUTC < currentUTC,
        timeDiffDays: Math.floor((expirationUTC.getTime() - currentUTC.getTime()) / (1000 * 60 * 60 * 24))
      })
      
      // Only check expiration if the expiration date is actually before today
      if (expirationUTC < currentUTC) {
        console.log('❌ Proposal expired (UTC comparison):', {
          proposalId: proposal.id,
          validUntil: proposal.valid_until,
          currentUTC: currentUTC.toISOString(),
          expirationUTC: expirationUTC.toISOString(),
          daysPastExpiration: Math.floor((currentUTC.getTime() - expirationUTC.getTime()) / (1000 * 60 * 60 * 24))
        })
        return new Response(JSON.stringify({ error: 'Proposal has expired' }), {
          status: 410,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
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

    console.log('✅ Proposal successfully retrieved:', {
      proposalId: proposal.id,
      title: proposal.title,
      clientName: proposal.client?.name,
      hasClient: !!proposal.client,
      hasPsychologyProfile: !!proposal.psychology_profile,
      sectionsCount: proposal.sections?.length || 0
    })

    return new Response(JSON.stringify(safeProposal), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('💥 Critical error in get-proposal function:', {
      error: error.message,
      stack: error.stack,
      name: error.name
    })
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})