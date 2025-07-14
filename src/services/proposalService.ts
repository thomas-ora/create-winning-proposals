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
  private async callEdgeFunction(functionName: string, options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    params?: URLSearchParams;
  } = {}) {
    const { method = 'GET', body, headers = {}, params } = options;
    
    let url = `${SUPABASE_URL}/functions/v1/${functionName}`;
    if (params) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async createProposal(data: CreateProposalRequest, apiKey: string): Promise<CreateProposalResponse> {
    return this.callEdgeFunction('create-proposal', {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
  }

  async getProposal(id: string, password?: string): Promise<any> {
    const params = new URLSearchParams();
    if (password) {
      params.set('password', password);
    }

    return this.callEdgeFunction(`get-proposal/${id}`, {
      params: params.toString() ? params : undefined,
    });
  }

  async getProposals(): Promise<ProposalData[]> {
    // For now, return empty array since we don't have tables set up in types yet
    // This will be updated once database schema is properly reflected in types
    return [];
  }

  async trackEvent(proposalId: string, eventData: TrackEventRequest): Promise<void> {
    await this.callEdgeFunction(`track-event/${proposalId}`, {
      method: 'POST',
      body: eventData,
    });
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