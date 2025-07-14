import { useState, useEffect, useCallback } from 'react';
import { ProposalData } from '@/data/types';
import { proposalService } from '@/services/proposalService';

interface UseProposalListReturn {
  proposals: ProposalData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProposalList = (): UseProposalListReturn => {
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const proposalsData = await proposalService.getProposals();
      setProposals(proposalsData);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      setError(error instanceof Error ? error.message : "Failed to load proposals");
      setProposals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchProposals();
  }, [fetchProposals]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  return {
    proposals,
    loading,
    error,
    refetch
  };
};