import { supabase } from '@/integrations/supabase/client';
import { ProposalData } from '@/data/types';

const SUPABASE_URL = "https://axqqqpomxdjwrpkbfawl.supabase.co";

export interface CreateProposalRequest {
  client: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    title?: string;
    linkedin_url?: string;
    company_name: string;
    company_website?: string;
    industry?: string;
    employee_count?: number;
    revenue_range?: string;
    growth_stage?: string;
    consultation_date?: string;
  };
  psychology_profile?: {
    primary_type?: string;
    secondary_type?: string;
    analytical_score?: number;
    driver_score?: number;
    expressive_score?: number;
    amiable_score?: number;
    decision_style?: string;
    decision_authority?: string;
    risk_tolerance?: string;
  };
  proposal: {
    title: string;
    executive_summary: string;
    sections: any[];
    financial_amount: number;
    financial_currency: string;
    payment_terms: string;
    pricing_tiers?: any;
    valid_until: string;
    prepared_by: string;
    password_protected?: boolean;
    password?: string;
    brand_color?: string;
    logo_url?: string;
  };
}

export interface CreateProposalResponse {
  success: boolean;
  proposal_id: string;
  slug?: string;
  url: string;
  expires_at: string;
}

export interface TrackEventRequest {
  event_type: string;
  event_data?: any;
  section?: string;
  value?: number;
  duration?: number;
}

class ProposalService {
  private supabaseClient = supabase;

  private async invokeFunction(functionName: string, options: {
    body?: any;
    headers?: Record<string, string>;
  } = {}) {
    const { body, headers = {} } = options;
    
    console.log('🌐 Invoking Supabase function:', { functionName, hasBody: !!body });

    const { data, error } = await this.supabaseClient.functions.invoke(functionName, {
      body,
      headers,
    });

    console.log('📡 Function response:', { data, error });

    if (error) {
      console.error('❌ Function Error:', error);
      throw new Error(error.message || 'Function execution failed');
    }

    console.log('📋 Function data:', data);
    return data;
  }

  async createProposal(data: CreateProposalRequest, apiKey: string): Promise<CreateProposalResponse> {
    return this.invokeFunction('create-proposal', {
      body: data,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
  }

  async getProposal(idOrSlug: string, password?: string): Promise<any> {
    console.log('🔎 ProposalService.getProposal called with:', { idOrSlug, hasPassword: !!password });
    
    // Check if it's a UUID or slug and call appropriate endpoint
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);
    const functionName = isUuid ? `get-proposal/${idOrSlug}` : `get-proposal/slug/${idOrSlug}`;

    console.log('🛣️ Using function:', { functionName, isUuid });

    // Add password as query parameter if provided
    const params = new URLSearchParams();
    if (password) {
      params.set('password', password);
    }
    // Add cache-busting timestamp
    params.set('t', Date.now().toString());

    const functionNameWithParams = params.toString() ? `${functionName}?${params.toString()}` : functionName;

    try {
      const result = await this.invokeFunction(functionNameWithParams, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      console.log('✅ Function response:', result);
      return result;
    } catch (error) {
      console.error('❌ Function error:', error);
      throw error;
    }
  }

  async getProposals(): Promise<ProposalData[]> {
    try {
      const { data, error } = await this.supabaseClient
        .from('proposals')
        .select(`
          *,
          clients (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(proposal => this.transformDatabaseProposal(proposal)) || [];
    } catch (error) {
      console.error('Error fetching proposals:', error);
      throw error;
    }
  }

  async createUserProposal(data: CreateProposalRequest): Promise<CreateProposalResponse> {
    // Get the current session token for authenticated users
    const { data: { session } } = await this.supabaseClient.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No active session found. Please log in to create proposals.');
    }
    
    return this.invokeFunction('create-proposal', {
      body: data,
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });
  }

  async trackEvent(proposalId: string, eventData: TrackEventRequest): Promise<void> {
    await this.invokeFunction('track-event', {
      body: { proposalId, ...eventData },
    });
  }

  async deleteProposal(proposalId: string): Promise<void> {
    const { error } = await this.supabaseClient
      .from('proposals')
      .delete()
      .eq('id', proposalId);
    
    if (error) throw error;
  }

  async deleteProposals(proposalIds: string[]): Promise<void> {
    const { error } = await this.supabaseClient
      .from('proposals')
      .delete()
      .in('id', proposalIds);
    
    if (error) throw error;
  }

  async getNotifications(): Promise<any[]> {
    try {
      const { data, error } = await this.supabaseClient
        .from('proposal_events')
        .select(`
          *,
          proposals (title, id)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  private transformDatabaseProposal(dbProposal: any): ProposalData {
    return {
      id: dbProposal.id,
      title: dbProposal.title,
      client: {
        name: `${dbProposal.client?.first_name || ''} ${dbProposal.client?.last_name || ''}`.trim(),
        email: dbProposal.client?.email || '',
        company: dbProposal.client?.company_name || '',
      },
      author: {
        name: dbProposal.prepared_by || '',
        email: '', // Not stored in current schema
        company: '', // Not stored in current schema
      },
      financial: {
        amount: dbProposal.financial_amount || 0,
        currency: dbProposal.financial_currency || 'USD',
        paymentTerms: dbProposal.payment_terms || '',
      },
      timeline: {
        createdAt: new Date(dbProposal.created_at),
        expiresAt: dbProposal.valid_until ? new Date(dbProposal.valid_until) : undefined,
      },
      status: dbProposal.status as any,
      sections: dbProposal.sections || [],
      template: 'custom', // Default template
      branding: {
        primaryColor: dbProposal.brand_color || '#7B7FEB',
        logo: dbProposal.logo_url,
      },
      analytics: {
        views: 0, // Would need to calculate from events
        lastViewed: undefined, // Would need to calculate from events
      },
    };
  }
}

export const proposalService = new ProposalService();