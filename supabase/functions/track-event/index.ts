import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TrackEventRequest {
  event_type: string
  event_data?: any
  section?: string
  value?: number
  duration?: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const proposalId = url.pathname.split('/').pop()

    if (!proposalId) {
      return new Response(JSON.stringify({ error: 'Proposal ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const eventData: TrackEventRequest = await req.json()

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify proposal exists
    const { data: proposal, error: proposalError } = await supabaseClient
      .from('proposals')
      .select('id, status')
      .eq('id', proposalId)
      .single()

    if (proposalError || !proposal) {
      return new Response(JSON.stringify({ error: 'Proposal not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get client info from request headers
    const userAgent = req.headers.get('user-agent') || ''
    const forwardedFor = req.headers.get('x-forwarded-for')
    const ipAddress = forwardedFor?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown'

    // Create event record
    const { error: eventError } = await supabaseClient
      .from('proposal_events')
      .insert({
        proposal_id: proposalId,
        event_type: eventData.event_type,
        event_data: {
          ...eventData.event_data,
          section: eventData.section,
          value: eventData.value,
          duration: eventData.duration,
          timestamp: new Date().toISOString()
        },
        ip_address: ipAddress,
        user_agent: userAgent
      })

    if (eventError) {
      console.error('Event tracking error:', eventError)
      return new Response(JSON.stringify({ error: 'Failed to track event' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Update proposal status based on event type
    let newStatus = proposal.status
    if (eventData.event_type === 'cta_click' && proposal.status === 'viewed') {
      newStatus = 'accepted'
    }

    if (newStatus !== proposal.status) {
      await supabaseClient
        .from('proposals')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', proposalId)
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Event tracked successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in track-event function:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})