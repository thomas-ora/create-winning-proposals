import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DashboardStats {
  totalProposals: number;
  activeAPIKeys: number;
  recentActivity: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  loading: boolean;
  isDemo: boolean;
}

const DEMO_STATS: DashboardStats = {
  totalProposals: 127,
  activeAPIKeys: 8,
  recentActivity: 23,
  systemHealth: 'healthy' as const,
  loading: false,
  isDemo: true,
};

export const useUserDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    ...DEMO_STATS,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        // Show demo data for non-authenticated users
        setStats({ ...DEMO_STATS, loading: false });
        return;
      }

      try {
        setStats(prev => ({ ...prev, loading: true, isDemo: false }));

        // Fetch user's proposals count
        const { count: proposalsCount, error: proposalsError } = await supabase
          .from('proposals')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (proposalsError) throw proposalsError;

        // Fetch user's API keys count
        const { count: apiKeysCount, error: apiKeysError } = await supabase
          .from('api_keys')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        if (apiKeysError) throw apiKeysError;

        // Fetch recent activity (last 24 hours) on user's proposals
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const { data: userProposals, error: userProposalsError } = await supabase
          .from('proposals')
          .select('id')
          .eq('user_id', user.id);

        if (userProposalsError) throw userProposalsError;

        const proposalIds = userProposals?.map(p => p.id) || [];
        
        let recentActivityCount = 0;
        if (proposalIds.length > 0) {
          const { count: activityCount, error: activityError } = await supabase
            .from('proposal_events')
            .select('*', { count: 'exact', head: true })
            .in('proposal_id', proposalIds)
            .gte('created_at', yesterday.toISOString());

          if (activityError) throw activityError;
          recentActivityCount = activityCount || 0;
        }

        // Fetch system health
        let systemHealth: 'healthy' | 'warning' | 'error' = 'healthy';
        try {
          const healthResponse = await fetch('https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/health');
          const healthData = await healthResponse.json();
          systemHealth = healthData.status === 'healthy' ? 'healthy' : 
                        healthData.status === 'degraded' ? 'warning' : 'error';
        } catch (error) {
          console.error('Failed to fetch system health:', error);
          systemHealth = 'warning';
        }

        setStats({
          totalProposals: proposalsCount || 0,
          activeAPIKeys: apiKeysCount || 0,
          recentActivity: recentActivityCount,
          systemHealth,
          loading: false,
          isDemo: false,
        });

      } catch (error) {
        console.error('Failed to fetch user dashboard stats:', error);
        // Fallback to demo stats on error
        setStats({
          ...DEMO_STATS,
          loading: false,
          systemHealth: 'warning',
        });
      }
    };

    fetchStats();
  }, [user]);

  return stats;
};