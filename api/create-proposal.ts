import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate API key
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid API key' });
  }

  const apiKey = authHeader.replace('Bearer ', '');
  const hashedKey = createHash('sha256').update(apiKey).digest('hex');

  // Check API key in database
  const { data: keyData, error: keyError } = await supabase
    .from('api_keys')
    .select('id, user_id, name')
    .eq('key_hash', hashedKey)
    .eq('is_active', true)
    .single();

  if (keyError || !keyData) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  const { client, psychology_profile, proposal } = req.body;

  try {
    // Create client
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert({
        ...client,
        created_by: keyData.user_id
      })
      .select()
      .single();

    if (clientError) throw clientError;

    // Create psychology profile if provided
    if (psychology_profile) {
      const { error: psychError } = await supabase
        .from('psychology_profiles')
        .insert({
          client_id: clientData.id,
          ...psychology_profile
        });

      if (psychError) throw psychError;
    }

    // Create proposal
    const { data: proposalData, error: proposalError } = await supabase
      .from('proposals')
      .insert({
        client_id: clientData.id,
        ...proposal,
        created_by: keyData.user_id,
        status: 'draft'
      })
      .select()
      .single();

    if (proposalError) throw proposalError;

    // Log API usage
    await supabase
      .from('api_usage')
      .insert({
        api_key_id: keyData.id,
        endpoint: '/create-proposal',
        method: 'POST',
        response_status: 200
      });

    return res.status(200).json({
      success: true,
      proposalId: proposalData.id,
      proposalUrl: `${req.headers.host}/proposal/${proposalData.id}`,
      password: proposal.password_protected ? proposal.password : undefined
    });

  } catch (error: any) {
    console.error('Error creating proposal:', error);

    // Log failed API usage
    await supabase
      .from('api_usage')
      .insert({
        api_key_id: keyData.id,
        endpoint: '/create-proposal',
        method: 'POST',
        response_status: 500
      });

    return res.status(500).json({
      error: 'Failed to create proposal',
      message: error.message
    });
  }
}