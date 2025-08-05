import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // DEPLOYMENT VERSION: 2025-08-04-v2 - Force redeploy
  console.log('🚀 GET-PROPOSAL FUNCTION START - VERSION 2025-08-04-v2:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  })

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get data from request body (when called via supabase.functions.invoke)
    let requestData: any = {}
    
    if (req.method === 'POST') {
      try {
        requestData = await req.json()
      } catch (e) {
        console.log('No JSON body provided, checking URL parameters')
      }
    }
    
    // Fallback to URL path for direct calls
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/').filter(Boolean)
    const urlProposalId = pathParts[pathParts.length - 1]
    const isSlugFromPath = pathParts.includes('slug')
    const urlPassword = url.searchParams.get('password')
    
    // Use request body data if available, otherwise fallback to URL
    const proposalId = requestData.id || requestData.slug || urlProposalId
    const isSlugLookup = !!requestData.slug || (isSlugFromPath && !requestData.id)
    const password = requestData.password || urlPassword

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

    // TEMPORARY: Simplified date check with extensive debugging
    console.log('🔍 EXPIRATION CHECK - Raw data from database:', {
      proposalId: proposal.id,
      validUntilFromDB: proposal.valid_until,
      typeOfValidUntil: typeof proposal.valid_until,
      currentTime: new Date().toISOString(),
      currentTimestamp: Date.now()
    })

    if (proposal.valid_until) {
      // Simple string comparison for debugging
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      const expirationStr = proposal.valid_until.toString().split('T')[0] // YYYY-MM-DD
      
      console.log('📅 SIMPLIFIED DATE COMPARISON:', {
        proposalId: proposal.id,
        todayStr: today,
        expirationStr: expirationStr,
        isExpiredSimple: expirationStr < today,
        stringComparison: `${expirationStr} < ${today} = ${expirationStr < today}`
      })
      
      // Only fail if clearly expired
      if (expirationStr < today) {
        console.log('❌ Proposal expired (simple string comparison):', {
          proposalId: proposal.id,
          validUntil: proposal.valid_until,
          todayDate: today,
          comparison: `${expirationStr} < ${today}`
        })
        return new Response(JSON.stringify({ error: 'Proposal has expired' }), {
          status: 410,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      } else {
        console.log('✅ Proposal is valid (not expired):', {
          proposalId: proposal.id,
          validUntil: proposal.valid_until,
          todayDate: today,
          comparison: `${expirationStr} >= ${today}`
        })
      }
    } else {
      console.log('ℹ️ No expiration date set for proposal:', proposal.id)
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