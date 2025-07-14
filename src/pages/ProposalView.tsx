import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle, Home } from "lucide-react";
import { ProposalHeader } from "@/components/proposal/ProposalHeader";
import { ProposalMeta } from "@/components/proposal/ProposalMeta";
import { ProposalSection } from "@/components/proposal/ProposalSection";
import { ProposalSkeleton } from "@/components/proposal/ProposalSkeleton";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useProposal } from "@/hooks/useProposal";
import { useProposalTracking } from "@/hooks/useProposalTracking";

const ProposalView = () => {
  const { proposalId } = useParams();
  const { proposal, loading, error, refetch } = useProposal(proposalId);
  
  // Initialize proposal tracking
  const tracking = useProposalTracking(proposalId || '');

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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        {/* Header */}
        <ProposalHeader proposal={proposal} />

        {/* Proposal Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Proposal Meta */}
            <ProposalMeta proposal={proposal} />

            {/* Proposal Sections */}
            <div className="space-y-6">
              {proposal.sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <div
                    key={section.id}
                    data-section-id={section.id}
                    data-section-title={section.title}
                  >
                    <ProposalSection 
                      section={section} 
                      onCalculatorUse={tracking.trackCalculatorUse}
                      onLinkClick={tracking.trackLinkClick}
                    />
                  </div>
                ))}
            </div>

            {/* Call to Action */}
            <Card className="p-8 bg-gradient-primary text-white mt-8 shadow-elegant">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-white/90 mb-6">
                  We're excited to work with you on this project. Click below to accept this proposal and begin the process.
                </p>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => tracking.trackCTAClick('accept', { location: 'bottom_cta' })}
                >
                  Accept Proposal
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProposalView;