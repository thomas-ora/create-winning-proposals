import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Validate API key
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid API key' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const apiKey = authHeader.substring(7)
    const { data: keyData, error: keyError } = await supabaseClient
      .from('api_keys')
      .select('id')
      .eq('key_hash', apiKey)
      .eq('is_active', true)
      .single()

    if (keyError || !keyData) {
      return new Response(JSON.stringify({ error: 'Invalid API key' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const proposalData: ProposalRequest = await req.json()

    // Create or get client
    let clientId: string
    const { data: existingClient } = await supabaseClient
      .from('clients')
      .select('id')
      .eq('email', proposalData.client.email)
      .single()

    if (existingClient) {
      clientId = existingClient.id
      // Update existing client
      await supabaseClient
        .from('clients')
        .update({
          ...proposalData.client,
          consultation_date: proposalData.client.consultation_date || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId)
    } else {
      // Create new client
      const { data: newClient, error: clientError } = await supabaseClient
        .from('clients')
        .insert({
          ...proposalData.client,
          consultation_date: proposalData.client.consultation_date || null
        })
        .select('id')
        .single()

      if (clientError) {
        console.error('Client creation error:', clientError)
        return new Response(JSON.stringify({ error: 'Failed to create client' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      clientId = newClient.id
    }

    // Create or update psychology profile if provided
    if (proposalData.psychology_profile) {
      const { data: existingProfile } = await supabaseClient
        .from('psychology_profiles')
        .select('id')
        .eq('client_id', clientId)
        .single()

      if (existingProfile) {
        await supabaseClient
          .from('psychology_profiles')
          .update(proposalData.psychology_profile)
          .eq('client_id', clientId)
      } else {
        await supabaseClient
          .from('psychology_profiles')
          .insert({
            ...proposalData.psychology_profile,
            client_id: clientId
          })
      }
    }

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
    const { data: proposal, error: proposalError } = await supabaseClient
      .from('proposals')
      .insert({
        client_id: clientId,
        title: proposalData.proposal.title,
        executive_summary: proposalData.proposal.executive_summary,
        sections: proposalData.proposal.sections,
        financial_amount: proposalData.proposal.financial_amount,
        financial_currency: proposalData.proposal.financial_currency,
        payment_terms: proposalData.proposal.payment_terms,
        pricing_tiers: proposalData.proposal.pricing_tiers,
        valid_until: proposalData.proposal.valid_until,
        prepared_by: proposalData.proposal.prepared_by,
        status: 'sent',
        password_protected: proposalData.proposal.password_protected || false,
        password_hash: passwordHash,
        brand_color: proposalData.proposal.brand_color,
        logo_url: proposalData.proposal.logo_url,
        created_by_api_key: keyData.id
      })
      .select('id')
      .single()

    if (proposalError) {
      console.error('Proposal creation error:', proposalError)
      return new Response(JSON.stringify({ error: 'Failed to create proposal' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Update API key last_used
    await supabaseClient
      .from('api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('id', keyData.id)

    const proposalUrl = `${req.headers.get('origin') || 'https://your-domain.com'}/p/${proposal.id}`

    return new Response(JSON.stringify({
      success: true,
      proposal_id: proposal.id,
      url: proposalUrl,
      expires_at: proposalData.proposal.valid_until
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in create-proposal function:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})