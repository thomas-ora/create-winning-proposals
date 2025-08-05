import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface APIKey {
  id: string
  name: string
  key_hash: string
  is_active: boolean
  created_at: string
  last_used?: string
}

interface RateLimitState {
  requests: number
  windowStart: number
}

const rateLimitWindows = new Map<string, RateLimitState>()

// Rate limiting helper (100 requests per minute)
function checkRateLimit(apiKeyId: string): { allowed: boolean; remainingRequests: number } {
  const now = Date.now()
  const windowDuration = 60 * 1000 // 1 minute
  const maxRequests = 100

  const existing = rateLimitWindows.get(apiKeyId)
  
  if (!existing || (now - existing.windowStart) >= windowDuration) {
    rateLimitWindows.set(apiKeyId, {
      requests: 1,
      windowStart: now
    })
    return { allowed: true, remainingRequests: maxRequests - 1 }
  }

  if (existing.requests >= maxRequests) {
    return { allowed: false, remainingRequests: 0 }
  }

  existing.requests += 1
  rateLimitWindows.set(apiKeyId, existing)

  return { 
    allowed: true, 
    remainingRequests: maxRequests - existing.requests 
  }
}

// Validate API key
async function validateAPIKey(apiKey: string, supabaseClient: any): Promise<APIKey | null> {
  if (!apiKey) return null

  try {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(apiKey)
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    const { data, error } = await supabaseClient
      .from('api_keys')
      .select('*')
      .eq('key_hash', keyHash)
      .eq('is_active', true)
      .single()

    if (error || !data) return null
    return data as APIKey
  } catch (error) {
    console.error('API key validation error:', error)
    return null
  }
}

interface ProposalRequest {
  client: {
    first_name: string
    last_name: string
    email: string
    phone?: string
    title?: string
    linkedin_url?: string
    company_name: string
    company_website?: string
    industry?: string
    employee_count?: number
    revenue_range?: string
    growth_stage?: string
    consultation_date?: string
  }
  psychology_profile?: {
    primary_type?: string
    secondary_type?: string
    analytical_score?: number
    driver_score?: number
    expressive_score?: number
    amiable_score?: number
    decision_style?: string
    decision_authority?: string
    risk_tolerance?: string
  }
  proposal: {
    title: string
    executive_summary: string
    sections: any[]
    financial_amount: number
    financial_currency: string
    payment_terms: string
    pricing_tiers?: any
    valid_until: string
    prepared_by: string
    password_protected?: boolean
    password?: string
    brand_color?: string
    logo_url?: string
  }
}

Deno.serve(async (req) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  
  console.log(`🚀 CREATE-PROPOSAL FUNCTION START - VERSION 2025-08-05-v3: {
  timestamp: "${timestamp}",
  method: "${method}",
  url: "${url}"
}`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request handled');
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    console.log(`❌ Invalid method: ${req.method}, expected POST`);
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Extract and validate API key
    const authHeader = req.headers.get('authorization')
    const apiKey = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing API key' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const validatedKey = await validateAPIKey(apiKey, supabaseClient)
    if (!validatedKey) {
      return new Response(JSON.stringify({ error: 'Invalid API key' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check rate limit
    const rateLimit = checkRateLimit(validatedKey.id)
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), {
        status: 429,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': '60'
        }
      })
    }

    // Log API usage
    console.log('API Key Usage:', {
      keyId: validatedKey.id,
      keyName: validatedKey.name,
      endpoint: 'create-proposal',
      timestamp: new Date().toISOString(),
      remainingRequests: rateLimit.remainingRequests
    })

    const proposalData: ProposalRequest = await req.json()
    
    console.log('📝 Proposal Request Data:', {
      clientEmail: proposalData.client.email,
      proposalTitle: proposalData.proposal.title,
      financialAmount: proposalData.proposal.financial_amount,
      financialCurrency: proposalData.proposal.financial_currency,
      sectionsCount: proposalData.proposal.sections.length,
      hasPassword: !!proposalData.proposal.password_protected,
      hasLogo: !!proposalData.proposal.logo_url
    })

    // Create or get client
    let clientId: string
    const { data: existingClient } = await supabaseClient
      .from('clients')
      .select('id')
      .eq('email', proposalData.client.email)
      .single()

    if (existingClient) {
      clientId = existingClient.id
      console.log('🔄 Updating existing client:', clientId)
      // Update existing client
      await supabaseClient
        .from('clients')
        .update({
          ...proposalData.client,
          name: `${proposalData.client.first_name || ''} ${proposalData.client.last_name || ''}`.trim() || proposalData.client.email,
          consultation_date: proposalData.client.consultation_date || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId)
    } else {
      // Create new client
      console.log('➕ Creating new client for email:', proposalData.client.email)
      const { data: newClient, error: clientError } = await supabaseClient
        .from('clients')
        .insert({
          ...proposalData.client,
          name: `${proposalData.client.first_name || ''} ${proposalData.client.last_name || ''}`.trim() || proposalData.client.email,
          consultation_date: proposalData.client.consultation_date || null
        })
        .select('id')
        .single()

      if (clientError) {
        console.error('❌ Client creation error:', clientError)
        return new Response(JSON.stringify({ error: 'Failed to create client', details: clientError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      console.log('✅ Client created with ID:', newClient.id)
      clientId = newClient.id
    }

    // Create or update psychology profile if provided
    if (proposalData.psychology_profile) {
      console.log('🧠 Processing psychology profile for client:', clientId)
      const { data: existingProfile } = await supabaseClient
        .from('psychology_profiles')
        .select('id')
        .eq('client_id', clientId)
        .single()

      if (existingProfile) {
        console.log('🔄 Updating existing psychology profile')
        await supabaseClient
          .from('psychology_profiles')
          .update(proposalData.psychology_profile)
          .eq('client_id', clientId)
      } else {
        console.log('➕ Creating new psychology profile')
        await supabaseClient
          .from('psychology_profiles')
          .insert({
            ...proposalData.psychology_profile,
            client_id: clientId
          })
      }
    }

    // Generate URL-safe slug from company name and proposal title
    function slugify(text: string): string {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    }
    
    const companySlug = slugify(proposalData.client.company_name || proposalData.client.company || 'company')
    const titleSlug = slugify(proposalData.proposal.title)
    const baseSlug = `${companySlug}-${titleSlug}`.substring(0, 100) // Limit length
    
    // Generate unique slug using database function
    const { data: uniqueSlug, error: slugError } = await supabaseClient
      .rpc('generate_unique_slug', {
        base_slug: baseSlug,
        table_name: 'proposals',
        column_name: 'slug'
      })
    
    if (slugError) {
      console.error('❌ Slug generation error:', slugError)
      // Continue without slug if generation fails
    }
    
    console.log('🔗 Generated slug:', uniqueSlug || 'none')

    // Hash password if provided
    let passwordHash = null
    if (proposalData.proposal.password_protected && proposalData.proposal.password) {
      const encoder = new TextEncoder()
      const data = encoder.encode(proposalData.proposal.password)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    }

    // Create proposal
    // Validate and fix the valid_until date
    const currentDate = new Date()
    let validUntilDate = proposalData.proposal.valid_until
    
    if (validUntilDate) {
      const providedDate = new Date(validUntilDate)
      if (providedDate <= currentDate) {
        console.warn('⚠️ Provided valid_until date is in the past, setting to 30 days from now')
        validUntilDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    } else {
      // Default to 30 days from now if no date provided
      validUntilDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
    
    // Extract JWT token and get authenticated user (for web UI proposals)
    let authenticatedUserId = null
    
    // Try to extract user from JWT token (reusing existing authHeader from line 136)
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      
      // Check if this is likely a JWT token (not an API key)
      // JWT tokens are much longer and contain dots
      if (token.includes('.') && token.length > 100) {
        try {
          const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
          if (!userError && user) {
            authenticatedUserId = user.id
            console.log(`👤 Authenticated user found: ${authenticatedUserId}`)
          }
        } catch (error) {
          console.log('🔍 Token is not a valid JWT, treating as API key request')
        }
      } else {
        console.log('🔑 Authorization header contains API key, not JWT token')
      }
    }
    
    console.log(`👤 User context: ${authenticatedUserId ? `Authenticated user ${authenticatedUserId}` : 'API-only request'}`)

    console.log('📄 Creating proposal with data:', {
      clientId,
      title: proposalData.proposal.title,
      sectionsCount: proposalData.proposal.sections.length,
      financialAmount: proposalData.proposal.financial_amount,
      currency: proposalData.proposal.financial_currency,
      hasPassword: !!passwordHash,
      slug: uniqueSlug,
      validUntilDate,
      userId: authenticatedUserId
    })
    
    const { data: proposal, error: proposalError } = await supabaseClient
      .from('proposals')
      .insert({
        client_id: clientId,
        title: proposalData.proposal.title,
        executive_summary: proposalData.proposal.executive_summary,
        sections: proposalData.proposal.sections,
        slug: uniqueSlug || null,
        // Provide values for both old and new financial columns
        financial_amount: proposalData.proposal.financial_amount,
        financial_currency: proposalData.proposal.financial_currency,
        total_value: proposalData.proposal.financial_amount, // Map to old column
        currency: proposalData.proposal.financial_currency, // Map to old column
        payment_terms: proposalData.proposal.payment_terms,
        pricing_tiers: proposalData.proposal.pricing_tiers,
        valid_until: validUntilDate,
        prepared_by: proposalData.proposal.prepared_by,
        status: 'sent',
        password_hash: passwordHash,
        brand_color: proposalData.proposal.brand_color,
        logo_url: proposalData.proposal.logo_url,
        created_by_api_key: validatedKey.id,
        user_id: authenticatedUserId // Set user_id for authenticated users
      })
      .select('id, slug')
      .single()

    if (proposalError) {
      console.error('❌ Proposal creation error:', proposalError)
      return new Response(JSON.stringify({ 
        error: 'Failed to create proposal', 
        details: proposalError.message,
        code: proposalError.code 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    console.log('✅ Proposal created successfully with ID:', proposal.id)

    // Update API key last_used timestamp
    await supabaseClient
      .from('api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('id', validatedKey.id)

    // Use slug for URL if available, otherwise fall back to ID
    const urlPath = proposal.slug ? `/proposal/${proposal.slug}` : `/p/${proposal.id}`
    const proposalUrl = `${req.headers.get('origin') || 'https://your-domain.com'}${urlPath}`
    
    console.log('🚀 Proposal creation complete:', {
      proposalId: proposal.id,
      slug: proposal.slug,
      url: proposalUrl,
      clientId: clientId,
      apiKeyUsed: validatedKey.name
    })

    return new Response(JSON.stringify({
      success: true,
      proposal_id: proposal.id,
      slug: proposal.slug,
      url: proposalUrl,
      expires_at: proposalData.proposal.valid_until
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': rateLimit.remainingRequests.toString()
      }
    })

  } catch (error) {
    console.error('💥 Critical error in create-proposal function:', {
      message: error.message,
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