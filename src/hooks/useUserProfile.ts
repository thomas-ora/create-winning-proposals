import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data || {
        id: user.id,
        email: user.email || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile({
        id: user.id,
        email: user.email || '',
      });
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = () => {
    if (!profile) return 'User';
    
    if (profile.first_name || profile.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    
    return profile.email.split('@')[0];
  };

  const getInitials = () => {
    if (!profile) return 'U';
    
    if (profile.first_name || profile.last_name) {
      const first = profile.first_name?.[0] || '';
      const last = profile.last_name?.[0] || '';
      return (first + last).toUpperCase() || 'U';
    }
    
    return profile.email[0].toUpperCase();
  };

  return {
    profile,
    loading,
    displayName: getDisplayName(),
    initials: getInitials(),
    refetch: fetchProfile,
  };
};