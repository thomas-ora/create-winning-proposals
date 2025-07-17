import { useState, useEffect, useCallback } from 'react';
import { ProposalData } from '@/data/types';
import { proposalService } from '@/services/proposalService';

interface UseProposalReturn {
  proposal: ProposalData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProposal = (proposalId: string | undefined): UseProposalReturn => {
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProposal = useCallback(async () => {
    if (!proposalId) {
      console.error('❌ No proposal ID provided');
      setError("No proposal ID provided");
      setProposal(null);
      setLoading(false);
      return;
    }

    console.log('🔍 Fetching proposal:', proposalId);

    try {
      setLoading(true);
      setError(null);
      
      console.log('📡 Calling proposalService.getProposal with:', proposalId);
      const proposalData = await proposalService.getProposal(proposalId);
      console.log('📦 Raw proposal data received:', proposalData);
      
      if (!proposalData) {
        console.error('❌ No proposal data returned from service');
        setError("Proposal not found");
        setProposal(null);
      } else {
        // Transform the database proposal to ProposalData format
        const transformedProposal: ProposalData = {
          id: proposalData.id,
          title: proposalData.title,
          client: {
            name: `${proposalData.client?.first_name || ''} ${proposalData.client?.last_name || ''}`.trim(),
            email: proposalData.client?.email || '',
            company: proposalData.client?.company_name || '',
            industry: proposalData.client?.industry,
            revenue_range: proposalData.client?.revenue_range,
            employee_count: proposalData.client?.employee_count,
            growth_stage: proposalData.client?.growth_stage,
          },
          author: {
            name: proposalData.prepared_by || '',
            email: '',
            company: '',
          },
          financial: {
            amount: proposalData.financial_amount || 0,
            currency: proposalData.financial_currency || 'USD',
            paymentTerms: proposalData.payment_terms || '',
          },
          timeline: {
            createdAt: new Date(proposalData.created_at),
            expiresAt: proposalData.valid_until ? new Date(proposalData.valid_until) : undefined,
          },
          status: proposalData.status,
          sections: proposalData.sections || [],
          template: 'custom',
          branding: {
            primaryColor: proposalData.brand_color || '#7B7FEB',
            logo: proposalData.logo_url,
          },
          analytics: {
            views: 0,
            lastViewed: undefined,
          },
        };
        console.log('✅ Transformed proposal data:', transformedProposal);
        setProposal(transformedProposal);
      }
    } catch (error) {
      console.error("❌ Error fetching proposal:", {
        proposalId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      setError(error instanceof Error ? error.message : "Failed to load proposal");
      setProposal(null);
    } finally {
      setLoading(false);
    }
  }, [proposalId]);

  const refetch = useCallback(() => {
    fetchProposal();
  }, [fetchProposal]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  return {
    proposal,
    loading,
    error,
    refetch
  };
};