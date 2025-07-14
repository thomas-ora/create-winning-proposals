import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, Minus, FileDown } from 'lucide-react';
import { ComparisonTable } from '@/components/proposal/ComparisonTable';
import { useProposalList } from '@/hooks/useProposalList';
import { ProposalData } from '@/data/types';

const CompareProposals = () => {
  const [searchParams] = useSearchParams();
  const { proposals, loading } = useProposalList();
  const [selectedProposals, setSelectedProposals] = useState<ProposalData[]>([]);
  const [availableProposals, setAvailableProposals] = useState<ProposalData[]>([]);

  // Initialize selected proposals from URL params
  useEffect(() => {
    if (proposals.length > 0) {
      const proposalIds = searchParams.get('ids')?.split(',') || [];
      const selected = proposals.filter(p => proposalIds.includes(p.id));
      setSelectedProposals(selected);
      setAvailableProposals(proposals.filter(p => !proposalIds.includes(p.id)));
    }
  }, [proposals, searchParams]);

  const addProposal = (proposal: ProposalData) => {
    if (selectedProposals.length < 3) {
      setSelectedProposals(prev => [...prev, proposal]);
      setAvailableProposals(prev => prev.filter(p => p.id !== proposal.id));
    }
  };

  const removeProposal = (proposalId: string) => {
    const proposalToRemove = selectedProposals.find(p => p.id === proposalId);
    if (proposalToRemove) {
      setSelectedProposals(prev => prev.filter(p => p.id !== proposalId));
      setAvailableProposals(prev => [...prev, proposalToRemove]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-64"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link to="/proposals" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Proposals
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Compare Proposals</h1>
              <p className="text-muted-foreground">
                Analyze up to 3 proposals side by side to make informed decisions
              </p>
            </div>
          </div>

          {/* Proposal Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Selected Proposals */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Selected Proposals ({selectedProposals.length}/3)
                </h2>
                {selectedProposals.length >= 2 && (
                  <Badge variant="default" className="bg-green-500">
                    Ready to Compare
                  </Badge>
                )}
              </div>
              
              <div className="space-y-4">
                {selectedProposals.map((proposal) => (
                  <Card key={proposal.id} className="p-4 bg-card/50 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{proposal.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {proposal.client.company} • ${proposal.financial.amount.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProposal(proposal.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                
                {selectedProposals.length === 0 && (
                  <Card className="p-8 text-center bg-card/30">
                    <p className="text-muted-foreground">
                      Select proposals from the available list to start comparing
                    </p>
                  </Card>
                )}
              </div>
            </div>

            {/* Available Proposals */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Available Proposals</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availableProposals.map((proposal) => (
                  <Card 
                    key={proposal.id} 
                    className="p-3 bg-card/30 hover:bg-card/50 transition-colors cursor-pointer"
                    onClick={() => addProposal(proposal)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{proposal.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {proposal.client.company}
                        </p>
                        <p className="text-xs font-medium">
                          ${proposal.financial.amount.toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={selectedProposals.length >= 3}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                
                {availableProposals.length === 0 && (
                  <Card className="p-6 text-center bg-card/30">
                    <p className="text-sm text-muted-foreground">
                      All proposals are selected for comparison
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          {selectedProposals.length >= 2 && (
            <Card className="p-6 bg-card/50 backdrop-blur">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Detailed Comparison</h2>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileDown className="w-4 h-4" />
                  Export PDF
                </Button>
              </div>
              
              <ComparisonTable proposals={selectedProposals} />
            </Card>
          )}

          {/* Instructions */}
          {selectedProposals.length < 2 && (
            <Card className="p-8 text-center bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <h3 className="text-lg font-semibold mb-2">How to Compare Proposals</h3>
              <div className="text-muted-foreground space-y-2 max-w-2xl mx-auto">
                <p>1. Select 2-3 proposals from the available list</p>
                <p>2. Review the side-by-side comparison table</p>
                <p>3. Export the comparison as PDF for sharing</p>
                <p className="text-sm mt-4 text-primary">
                  Select at least 2 proposals to enable the comparison view
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareProposals;