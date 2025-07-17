import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { proposal_id, amount } = await req.json();
    logStep("Request data received", { proposal_id, amount });

    if (!proposal_id || !amount) {
      throw new Error("Missing required fields: proposal_id and amount");
    }

    // Get proposal and client data
    const { data: proposal, error: proposalError } = await supabaseClient
      .from('proposals')
      .select(`
        *,
        clients (*)
      `)
      .eq('id', proposal_id)
      .single();

    if (proposalError) {
      logStep("ERROR fetching proposal", proposalError);
      throw new Error(`Failed to fetch proposal: ${proposalError.message}`);
    }

    logStep("Proposal fetched", { title: proposal.title, clientEmail: proposal.clients.email });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if customer exists in Stripe
    const customers = await stripe.customers.list({ 
      email: proposal.clients.email, 
      limit: 1 
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing Stripe customer found", { customerId });
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: proposal.clients.email,
        name: proposal.clients.name,
        metadata: {
          proposal_id: proposal_id,
          client_id: proposal.client_id
        }
      });
      customerId = customer.id;
      logStep("New Stripe customer created", { customerId });
    }

    // Create Stripe checkout session
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Setup Fee - ${proposal.title}`,
              description: `Initial setup and onboarding for ${proposal.clients.name}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&proposal_id=${proposal_id}`,
      cancel_url: `${origin}/p/${proposal_id}/accept?step=payment`,
      metadata: {
        proposal_id: proposal_id,
        client_id: proposal.client_id,
        type: "setup_fee"
      }
    });

    logStep("Stripe session created", { sessionId: session.id, url: session.url });

    // Store payment record
    const { error: paymentError } = await supabaseClient
      .from('agreement_payments')
      .insert({
        proposal_id,
        stripe_session_id: session.id,
        amount,
        status: 'pending'
      });

    if (paymentError) {
      logStep("ERROR storing payment record", paymentError);
      // Continue anyway - payment record is for tracking only
    } else {
      logStep("Payment record stored");
    }

    return new Response(JSON.stringify({
      success: true,
      url: session.url,
      session_id: session.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-agreement-payment", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});