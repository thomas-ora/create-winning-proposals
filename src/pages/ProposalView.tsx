import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, DollarSign, Clock, Download, Eye } from "lucide-react";
import { ProposalData, PricingTable } from "@/data/types";
import { getProposalById } from "@/data/mockProposals";

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
      <div className="bg-card/50 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{proposal.title}</h1>
                <p className="text-muted-foreground">For {proposal.client.company}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="hero" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Accept Proposal
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Proposal Meta */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 bg-card/50 backdrop-blur shadow-card">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="font-semibold text-lg">${proposal.financial.amount.toLocaleString()}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-card/50 backdrop-blur shadow-card">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-semibold">{proposal.timeline.createdAt.toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-card/50 backdrop-blur shadow-card">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold text-orange-600 capitalize">{proposal.status}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Proposal Sections */}
          <div className="space-y-6">
            {proposal.sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
              <Card key={section.id} className="p-8 bg-card/50 backdrop-blur shadow-card">
                <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                <div className="prose prose-gray max-w-none">
                  {section.type === 'text' && typeof section.content === 'string' && (
                    section.content.split('\n').map((paragraph, i) => (
                      <p key={i} className="text-foreground leading-relaxed mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))
                  )}
                  {section.type === 'list' && Array.isArray(section.content) && (
                    <ul className="space-y-2">
                      {section.content.map((item, i) => (
                        <li key={i} className="text-foreground leading-relaxed flex items-start">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.type === 'pricing' && typeof section.content === 'object' && !Array.isArray(section.content) && section.content !== null && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            {(section.content as PricingTable).headers.map((header, i) => (
                              <th key={i} className="text-left py-3 px-4 font-semibold">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(section.content as PricingTable).rows.map((row, i) => (
                            <tr key={i} className="border-b border-muted">
                              {(section.content as PricingTable).headers.map((header, j) => (
                                <td key={j} className="py-3 px-4">
                                  {row[header]}
                                </td>
                              ))}
                            </tr>
                          ))}
                          {(section.content as PricingTable).total && (
                            <tr className="border-t-2 border-primary font-semibold">
                              <td className="py-3 px-4" colSpan={(section.content as PricingTable).headers.length - 1}>
                                Total Investment
                              </td>
                              <td className="py-3 px-4">
                                ${(section.content as PricingTable).total!.toLocaleString()}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </Card>
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