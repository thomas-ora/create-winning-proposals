import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle, Home, BarChart3 } from "lucide-react";
import { ProposalSkeleton } from "@/components/proposal/ProposalSkeleton";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { PsychologyOptimizedProposal } from "@/components/proposal/PsychologyOptimizedProposal";
import { useProposal } from "@/hooks/useProposal";
import { useProposalTracking } from "@/hooks/useProposalTracking";

const ProposalView = () => {
  const { proposalId } = useParams();
  const { proposal, loading, error, refetch } = useProposal(proposalId);
  
  // Initialize proposal tracking
  const tracking = useProposalTracking(proposalId || '');

  // Enhanced CTA tracking with psychology triggers
  const handleCTAClick = (action: string, data?: any) => {
    // Map actions to valid CTA types
    const ctaTypeMap: { [key: string]: 'accept' | 'contact' | 'download' } = {
      'accept_proposal': 'accept',
      'schedule_call': 'contact',
      'select_tier': 'accept',
      'calculator_use': 'download'
    };

    const ctaType = ctaTypeMap[action] || 'contact';
    
    tracking.trackCTAClick(ctaType, {
      action,
      ...data,
      timestamp: Date.now(),
      proposal_id: proposalId,
      psychology_trigger: data?.urgency || 'medium'
    });

    // Additional interaction tracking for non-standard actions
    if (!ctaTypeMap[action]) {
      tracking.trackInteraction(action, {
        ...data,
        timestamp: Date.now()
      });
    }
  };

  if (loading) {
    return <ProposalSkeleton />;
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-card/50 backdrop-blur shadow-card">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4">
            {error === "Proposal not found" ? "Proposal Not Found" : "Error Loading Proposal"}
          </h1>
          
          <p className="text-muted-foreground mb-6">
            {error === "Proposal not found" 
              ? "The proposal you're looking for doesn't exist or has been removed." 
              : "We encountered an error while loading this proposal. Please try again."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={refetch}
              className="flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="flex items-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Transform proposal data for the psychology-optimized component
  const optimizedProposal = {
    id: proposal.id,
    title: proposal.title,
    client_name: proposal.client?.name || 'Valued Client',
    company_name: proposal.client?.company || 'Your Company',
    executive_summary: proposal.sections?.find(s => s.title.toLowerCase().includes('summary'))?.content as string || '',
    financial_amount: proposal.financial?.amount || 50000,
    financial_currency: proposal.financial?.currency || 'USD',
    valid_until: proposal.timeline?.expiresAt?.toISOString() || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    prepared_by: proposal.author?.name || 'ORA Systems',
    logo_url: proposal.branding?.logo,
    brand_color: proposal.branding?.primaryColor,
    sections: proposal.sections || []
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {/* Psychology-Optimized Proposal */}
        <PsychologyOptimizedProposal 
          proposal={optimizedProposal}
          onCTAClick={handleCTAClick}
        />

        {/* Analytics Button - Fixed Position */}
        <div className="fixed bottom-6 left-6 z-40">
          <Button 
            asChild
            variant="outline" 
            className="shadow-lg bg-background/80 backdrop-blur-sm"
          >
            <Link to={`/proposals/${proposalId}/analytics`}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Link>
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProposalView;