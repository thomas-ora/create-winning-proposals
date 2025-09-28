import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'
import Stripe from 'https://esm.sh/stripe@14.25.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the signature from headers
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      throw new Error('No signature provided')
    }

    // Get raw body for signature verification
    const body = await req.text()

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2024-12-18.acacia',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Verify webhook signature
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    let event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Update payment session
        await supabase
          .from('payment_sessions')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            stripe_payment_intent_id: session.payment_intent as string
          })
          .eq('stripe_session_id', session.id)

        // Update proposal status
        if (session.metadata?.proposal_id) {
          await supabase
            .from('proposals')
            .update({
              status: 'accepted',
              accepted_at: new Date().toISOString()
            })
            .eq('id', session.metadata.proposal_id)

          // Log event
          await supabase
            .from('proposal_events')
            .insert({
              proposal_id: session.metadata.proposal_id,
              event_type: 'payment_completed',
              event_data: {
                amount: session.amount_total ? session.amount_total / 100 : 0,
                currency: session.currency,
                payment_intent: session.payment_intent,
                customer_email: session.customer_details?.email
              }
            })

          // Send confirmation email
          const { data: proposal } = await supabase
            .from('proposals')
            .select('*, clients(*)')
            .eq('id', session.metadata.proposal_id)
            .single()

          if (proposal && proposal.clients?.email) {
            await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                to: proposal.clients.email,
                type: 'proposal_accepted',
                templateData: {
                  title: proposal.title,
                  clientName: proposal.clients.name,
                  value: `${session.currency?.toUpperCase()} ${session.amount_total ? session.amount_total / 100 : 0}`,
                  acceptedAt: new Date().toISOString(),
                  companyName: proposal.clients.company
                }
              })
            })
          }
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session

        // Update payment session
        await supabase
          .from('payment_sessions')
          .update({
            status: 'expired',
            expired_at: new Date().toISOString()
          })
          .eq('stripe_session_id', session.id)

        // Update proposal status back to draft
        if (session.metadata?.proposal_id) {
          await supabase
            .from('proposals')
            .update({ status: 'draft' })
            .eq('id', session.metadata.proposal_id)
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice

        // Update payment session
        await supabase
          .from('payment_sessions')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('stripe_session_id', invoice.id)

        // Update proposal if linked
        if (invoice.metadata?.proposal_id) {
          await supabase
            .from('proposals')
            .update({
              status: 'accepted',
              accepted_at: new Date().toISOString()
            })
            .eq('id', invoice.metadata.proposal_id)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        // Update payment session
        await supabase
          .from('payment_sessions')
          .update({
            status: 'failed',
            failed_at: new Date().toISOString()
          })
          .eq('stripe_session_id', invoice.id)

        // Log the failure
        if (invoice.metadata?.proposal_id) {
          await supabase
            .from('proposal_events')
            .insert({
              proposal_id: invoice.metadata.proposal_id,
              event_type: 'payment_failed',
              event_data: {
                invoice_id: invoice.id,
                amount: invoice.amount_due / 100,
                currency: invoice.currency,
                attempt: invoice.attempt_count
              }
            })
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('Subscription event:', event.type, subscription.id)
        // Handle subscription events if needed for recurring proposals
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})