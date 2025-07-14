import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { ProposalData } from "@/data/types";
import { getProposalById } from "@/data/mockProposals";
import { ProposalHeader } from "@/components/proposal/ProposalHeader";
import { ProposalMeta } from "@/components/proposal/ProposalMeta";
import { ProposalSection } from "@/components/proposal/ProposalSection";

const ProposalView = () => {
  const { proposalId } = useParams();
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch proposal data
    const fetchProposal = async () => {
      try {
        // Mock delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const proposalData = getProposalById(proposalId || "");
        setProposal(proposalData || null);
      } catch (error) {
        console.error("Error fetching proposal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [proposalId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <p className="text-muted-foreground">Loading proposal...</p>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Proposal Not Found</h1>
          <p className="text-muted-foreground">The proposal you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
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
                <ProposalSection key={section.id} section={section} />
              ))}
          </div>

          {/* Call to Action */}
          <Card className="p-8 bg-gradient-primary text-white mt-8 shadow-elegant">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-white/90 mb-6">
                We're excited to work with you on this project. Click below to accept this proposal and begin the process.
              </p>
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Accept Proposal
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProposalView;