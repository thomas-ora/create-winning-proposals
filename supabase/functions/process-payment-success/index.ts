import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const n8nWebhookUrl = Deno.env.get("N8N_WEBHOOK_URL");
    
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { session_id, proposal_id } = await req.json();
    logStep("Request data received", { session_id, proposal_id });

    if (!session_id) {
      throw new Error("Missing session_id");
    }

    // Initialize Stripe and verify session
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    logStep("Stripe session retrieved", { 
      sessionId: session.id, 
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email 
    });

    if (session.payment_status !== 'paid') {
      throw new Error(`Payment not completed. Status: ${session.payment_status}`);
    }

    // Update payment record
    const { data: payment, error: paymentUpdateError } = await supabaseClient
      .from('agreement_payments')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString()
      })
      .eq('stripe_session_id', session_id)
      .select()
      .single();

    if (paymentUpdateError) {
      logStep("ERROR updating payment record", paymentUpdateError);
    } else {
      logStep("Payment record updated", { paymentId: payment.id });
    }

    // Get full proposal and client data for N8N webhook
    const { data: proposalData, error: proposalError } = await supabaseClient
      .from('proposals')
      .select(`
        *,
        clients (*),
        sales_agreements (*)
      `)
      .eq('id', proposal_id || session.metadata?.proposal_id)
      .single();

    if (proposalError) {
      logStep("ERROR fetching proposal data", proposalError);
      throw new Error(`Failed to fetch proposal: ${proposalError.message}`);
    }

    logStep("Proposal data fetched for webhook", { 
      proposalTitle: proposalData.title,
      clientName: proposalData.clients.name 
    });

    // Trigger N8N onboarding workflow if webhook URL is configured
    if (n8nWebhookUrl) {
      try {
        const n8nPayload = {
          event_type: "payment_completed",
          proposal: {
            id: proposalData.id,
            title: proposalData.title,
            amount: session.amount_total,
            currency: session.currency
          },
          client: {
            id: proposalData.clients.id,
            name: proposalData.clients.name,
            email: proposalData.clients.email,
            company: proposalData.clients.company,
            phone: proposalData.clients.phone
          },
          payment: {
            stripe_session_id: session_id,
            amount: session.amount_total,
            paid_at: new Date().toISOString()
          },
          onboarding_data: {
            project_type: proposalData.title,
            client_industry: proposalData.clients.industry,
            project_value: session.amount_total,
            estimated_timeline: "4-6 weeks" // Default value
          }
        };

        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(n8nPayload)
        });

        if (n8nResponse.ok) {
          logStep("N8N webhook triggered successfully", { statusCode: n8nResponse.status });
        } else {
          logStep("N8N webhook failed", { 
            statusCode: n8nResponse.status,
            statusText: n8nResponse.statusText 
          });
        }
      } catch (webhookError) {
        logStep("ERROR triggering N8N webhook", { error: webhookError });
        // Don't fail the whole function if webhook fails
      }
    } else {
      logStep("N8N webhook URL not configured, skipping workflow trigger");
    }

    return new Response(JSON.stringify({
      success: true,
      payment_status: 'completed',
      proposal_id: proposalData.id,
      client_name: proposalData.clients.name,
      amount: session.amount_total,
      message: "Payment processed and onboarding initiated"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in process-payment-success", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});