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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
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
    .select('id, user_id')
    .eq('key_hash', hashedKey)
    .eq('is_active', true)
    .single();

  if (keyError || !keyData) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Proposal ID is required' });
  }

  try {
    // Get proposal with client info
    const { data: proposalData, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('id', id)
      .single();

    if (proposalError) {
      if (proposalError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Proposal not found' });
      }
      throw proposalError;
    }

    // Log API usage
    await supabase
      .from('api_usage')
      .insert({
        api_key_id: keyData.id,
        endpoint: '/get-proposal',
        method: 'GET',
        response_status: 200
      });

    return res.status(200).json(proposalData);

  } catch (error: any) {
    console.error('Error fetching proposal:', error);

    // Log failed API usage
    await supabase
      .from('api_usage')
      .insert({
        api_key_id: keyData.id,
        endpoint: '/get-proposal',
        method: 'GET',
        response_status: 500
      });

    return res.status(500).json({
      error: 'Failed to fetch proposal',
      message: error.message
    });
  }
}