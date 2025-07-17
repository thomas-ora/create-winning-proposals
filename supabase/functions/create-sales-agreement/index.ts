import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-AGREEMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { proposal_id, signer_name, signer_email, signature_data } = await req.json();
    logStep("Request data received", { proposal_id, signer_name, signer_email });

    if (!proposal_id || !signer_name || !signer_email || !signature_data) {
      throw new Error("Missing required fields");
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

    logStep("Proposal fetched", { title: proposal.title, clientId: proposal.client_id });

    // Create sales agreement
    const agreementData = {
      proposal_title: proposal.title,
      proposal_amount: proposal.financial_amount || proposal.total_value,
      client_data: proposal.clients,
      agreement_terms: {
        payment_terms: proposal.payment_terms || "Setup fee due upon signing",
        project_timeline: "To be confirmed after payment",
        service_description: proposal.description || proposal.title
      }
    };

    const { data: agreement, error: agreementError } = await supabaseClient
      .from('sales_agreements')
      .insert({
        proposal_id,
        client_id: proposal.client_id,
        agreement_data: agreementData,
        status: 'signed',
        signed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (agreementError) {
      logStep("ERROR creating agreement", agreementError);
      throw new Error(`Failed to create agreement: ${agreementError.message}`);
    }

    logStep("Agreement created", { agreementId: agreement.id });

    // Store signature
    const { error: signatureError } = await supabaseClient
      .from('signatures')
      .insert({
        agreement_id: agreement.id,
        signer_name,
        signer_email,
        signature_data,
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent')
      });

    if (signatureError) {
      logStep("ERROR storing signature", signatureError);
      throw new Error(`Failed to store signature: ${signatureError.message}`);
    }

    logStep("Signature stored successfully");

    return new Response(JSON.stringify({
      success: true,
      agreement_id: agreement.id,
      message: "Agreement signed successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-sales-agreement", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});