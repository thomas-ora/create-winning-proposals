import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5'
import Stripe from 'https://esm.sh/stripe@14.25.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  proposalId: string
  amount: number
  currency: string
  customerEmail: string
  customerName: string
  description?: string
  metadata?: Record<string, string>
  paymentMethod?: 'card' | 'bank_transfer' | 'invoice'
  successUrl?: string
  cancelUrl?: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const paymentRequest: PaymentRequest = await req.json()

    // Initialize Stripe with key from environment
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2024-12-18.acacia',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get proposal details
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('*, clients(*)')
      .eq('id', paymentRequest.proposalId)
      .single()

    if (proposalError || !proposal) {
      throw new Error('Proposal not found')
    }

    // Create or retrieve Stripe customer
    let customer
    const customers = await stripe.customers.list({
      email: paymentRequest.customerEmail,
      limit: 1
    })

    if (customers.data.length > 0) {
      customer = customers.data[0]
    } else {
      customer = await stripe.customers.create({
        email: paymentRequest.customerEmail,
        name: paymentRequest.customerName,
        metadata: {
          proposal_id: paymentRequest.proposalId,
          company: proposal.clients?.company || ''
        }
      })
    }

    // Create payment session based on payment method
    let paymentSession

    if (paymentRequest.paymentMethod === 'invoice') {
      // Create an invoice for bank transfer or manual payment
      const invoice = await stripe.invoices.create({
        customer: customer.id,
        collection_method: 'send_invoice',
        days_until_due: 30,
        description: paymentRequest.description || `Payment for proposal: ${proposal.title}`,
        metadata: {
          proposal_id: paymentRequest.proposalId,
          ...paymentRequest.metadata
        }
      })

      // Add line items
      await stripe.invoiceItems.create({
        customer: customer.id,
        invoice: invoice.id,
        amount: Math.round(paymentRequest.amount * 100), // Convert to cents
        currency: paymentRequest.currency.toLowerCase(),
        description: proposal.title
      })

      // Finalize and send invoice
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)
      await stripe.invoices.sendInvoice(invoice.id)

      paymentSession = {
        id: finalizedInvoice.id,
        url: finalizedInvoice.hosted_invoice_url,
        type: 'invoice'
      }

    } else {
      // Create checkout session for card payments
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: paymentRequest.currency.toLowerCase(),
            product_data: {
              name: proposal.title,
              description: paymentRequest.description || `Payment for proposal: ${proposal.title}`,
              metadata: {
                proposal_id: paymentRequest.proposalId
              }
            },
            unit_amount: Math.round(paymentRequest.amount * 100) // Convert to cents
          },
          quantity: 1
        }],
        mode: 'payment',
        success_url: paymentRequest.successUrl || `${Deno.env.get('APP_URL')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: paymentRequest.cancelUrl || `${Deno.env.get('APP_URL')}/proposal/${paymentRequest.proposalId}`,
        metadata: {
          proposal_id: paymentRequest.proposalId,
          ...paymentRequest.metadata
        }
      })

      paymentSession = {
        id: session.id,
        url: session.url,
        type: 'checkout'
      }
    }

    // Store payment session in database
    const { error: insertError } = await supabase
      .from('payment_sessions')
      .insert({
        proposal_id: paymentRequest.proposalId,
        stripe_session_id: paymentSession.id,
        stripe_customer_id: customer.id,
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        status: 'pending',
        payment_method: paymentRequest.paymentMethod || 'card',
        payment_url: paymentSession.url
      })

    if (insertError) {
      console.error('Failed to store payment session:', insertError)
    }

    // Update proposal status
    await supabase
      .from('proposals')
      .update({ status: 'payment_pending' })
      .eq('id', paymentRequest.proposalId)

    // Log payment event
    await supabase
      .from('proposal_events')
      .insert({
        proposal_id: paymentRequest.proposalId,
        event_type: 'payment_initiated',
        event_data: {
          amount: paymentRequest.amount,
          currency: paymentRequest.currency,
          payment_method: paymentRequest.paymentMethod,
          stripe_session_id: paymentSession.id
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        paymentUrl: paymentSession.url,
        sessionId: paymentSession.id,
        type: paymentSession.type
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Payment creation error:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'Payment processing failed. Please check your configuration.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})