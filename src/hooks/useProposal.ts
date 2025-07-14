import { useState, useEffect, useCallback } from 'react';
import { ProposalData } from '@/data/types';
import { getProposalById } from '@/data/mockProposals';

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
      setError("No proposal ID provided");
      setProposal(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const proposalData = getProposalById(proposalId);
      
      if (!proposalData) {
        setError("Proposal not found");
        setProposal(null);
      } else {
        setProposal(proposalData);
      }
    } catch (error) {
      console.error("Error fetching proposal:", error);
      setError("Failed to load proposal");
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