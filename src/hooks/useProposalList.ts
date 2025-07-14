import { useState, useEffect, useCallback } from 'react';
import { ProposalData } from '@/data/types';
import { mockProposals } from '@/data/mockProposals';

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
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate potential API failure (5% chance)
      if (Math.random() < 0.05) {
        throw new Error("Network error");
      }
      
      setProposals(mockProposals);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      setError("Failed to load proposals");
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