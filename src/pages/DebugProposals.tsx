import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Eye, Calendar, User, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';

interface DebugProposal {
  id: string;
  title: string;
  slug?: string;
  client_name?: string;
  company_name?: string;
  status: string;
  created_at: string;
  valid_until?: string;
  financial_amount?: number;
  financial_currency?: string;
}

const DebugProposals: React.FC = () => {
  const [proposals, setProposals] = useState<DebugProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDebugData();
  }, []);

  const fetchDebugData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching debug proposals...');
      
      const response = await fetch('https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/debug-proposal');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const debugData = await response.json();
      console.log('📦 Debug data received:', debugData);

      if (debugData.database_status?.proposals?.data) {
        const proposalsData = debugData.database_status.proposals.data.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          client_name: p.client?.name || `${p.client?.first_name || ''} ${p.client?.last_name || ''}`.trim(),
          company_name: p.client?.company_name || p.client?.company,
          status: p.status,
          created_at: p.created_at,
          valid_until: p.valid_until,
          financial_amount: p.financial_amount,
          financial_currency: p.financial_currency,
        }));
        
        setProposals(proposalsData);
        console.log('✅ Processed proposals:', proposalsData);
      }
    } catch (err) {
      console.error('❌ Error fetching debug data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch debug data');
      toast({
        title: 'Error',
        description: 'Failed to fetch proposals data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const testProposalAccess = async (proposal: DebugProposal) => {
    // Test both UUID and slug access
    const testUrls = [
      `/p/${proposal.id}`,
      proposal.slug ? `/proposal/${proposal.slug}` : null
    ].filter(Boolean);

    console.log(`🔗 Testing proposal access for: ${proposal.title}`);
    
    for (const url of testUrls) {
      try {
        console.log(`Testing URL: ${url}`);
        const response = await fetch(url as string);
        console.log(`${url} - Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          toast({
            title: 'Success',
            description: `Proposal accessible at ${url}`,
          });
          // Open the working URL
          window.open(url as string, '_blank');
          return;
        }
      } catch (error) {
        console.error(`❌ Error testing ${url}:`, error);
      }
    }

    toast({
      title: 'Error',
      description: 'Proposal not accessible via any URL',
      variant: 'destructive',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, label: 'Draft' },
      sent: { variant: 'default' as const, label: 'Sent' },
      viewed: { variant: 'outline' as const, label: 'Viewed' },
      accepted: { variant: 'default' as const, label: 'Accepted' },
      rejected: { variant: 'destructive' as const, label: 'Rejected' },
      expired: { variant: 'destructive' as const, label: 'Expired' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { 
      variant: 'secondary' as const, 
      label: status 
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount?: number, currency?: string) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto p-6">
          <div className="text-center py-8">
            <div className="animate-pulse">Loading debug data...</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Debug: Proposals Database</h1>
            <p className="text-muted-foreground">
              View and test all proposals in the database
            </p>
          </div>
          <Button onClick={fetchDebugData} variant="outline">
            Refresh Data
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              Error: {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          {proposals.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No proposals found in database</p>
              </CardContent>
            </Card>
          ) : (
            proposals.map((proposal) => (
              <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{proposal.title}</CardTitle>
                      <CardDescription>
                        ID: {proposal.id}
                        {proposal.slug && (
                          <span className="block">Slug: {proposal.slug}</span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(proposal.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{proposal.client_name || 'No Name'}</p>
                        <p className="text-xs text-muted-foreground">Client</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{proposal.company_name || 'No Company'}</p>
                        <p className="text-xs text-muted-foreground">Company</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{formatDate(proposal.created_at)}</p>
                        <p className="text-xs text-muted-foreground">Created</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-sm font-medium">
                          {formatCurrency(proposal.financial_amount, proposal.financial_currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">Value</p>
                      </div>
                    </div>
                  </div>

                  {proposal.valid_until && (
                    <div className="mb-4">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Valid until:</span>{' '}
                        {formatDate(proposal.valid_until)}
                        {new Date(proposal.valid_until) < new Date() && (
                          <Badge variant="destructive" className="ml-2">Expired</Badge>
                        )}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testProposalAccess(proposal)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Test Access
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/p/${proposal.id}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View (UUID)
                    </Button>
                    
                    {proposal.slug && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/proposal/${proposal.slug}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View (Slug)
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Debug Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • Use "Test Access" to check if a proposal loads correctly
            </p>
            <p className="text-sm text-muted-foreground">
              • Check browser console for detailed error logs
            </p>
            <p className="text-sm text-muted-foreground">
              • Compare UUID vs Slug access methods
            </p>
            <p className="text-sm text-muted-foreground">
              • Expired proposals may show different behavior
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DebugProposals;