import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AlertCircle, FileText, Plus, RefreshCw, Eye, BarChart3, GitCompare, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProposalList } from "@/hooks/useProposalList";
import { formatCurrency, formatDate, formatStatus } from "@/utils/formatters";
import { getProposalAnalytics } from "@/utils/analytics";
import { type CurrencyType } from "@/utils/constants";
import { proposalService } from "@/services/proposalService";
import AppLayout from "@/components/layout/AppLayout";
import React from "react";

const ProposalListSkeleton = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="p-6 bg-card/50 backdrop-blur shadow-card">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-18" />
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

const ProposalList = () => {
  const navigate = useNavigate();
  const { proposals, loading, error, refetch } = useProposalList();
  const [selectedProposals, setSelectedProposals] = React.useState<string[]>([]);
  const [selectionMode, setSelectionMode] = React.useState(false);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const { toast } = useToast();

  const toggleSelection = (proposalId: string) => {
    setSelectedProposals(prev => 
      prev.includes(proposalId) 
        ? prev.filter(id => id !== proposalId)
        : [...prev, proposalId]
    );
  };

  const handleCompareSelected = () => {
    if (selectedProposals.length >= 2) {
      navigate(`/proposals/compare?ids=${selectedProposals.join(',')}`);
    }
  };

  const clearSelection = () => {
    setSelectedProposals([]);
    setSelectionMode(false);
  };

  const handleDeleteProposal = async (proposalId: string) => {
    try {
      setDeleting(proposalId);
      await proposalService.deleteProposal(proposalId);
      toast({
        title: "Proposal deleted",
        description: "The proposal has been successfully deleted.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await proposalService.deleteProposals(selectedProposals);
      toast({
        title: "Proposals deleted",
        description: `${selectedProposals.length} proposals have been deleted.`,
      });
      clearSelection();
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the proposals. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <Skeleton className="h-10 w-48 mb-2" />
                <Skeleton className="h-5 w-64" />
              </div>
              <Skeleton className="h-10 w-36" />
            </div>
            
            <ProposalListSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-card/50 backdrop-blur shadow-card">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Error Loading Proposals</h1>
          <p className="text-muted-foreground mb-6">
            We encountered an error while loading the proposals. Please try again.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={refetch} className="flex items-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" asChild>
              <Link to="/" className="flex items-center">
                Go Home
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">All Proposals</h1>
              <p className="text-muted-foreground">
                Manage and track your client proposals
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {proposals.length > 1 && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectionMode(!selectionMode)}
                    className="flex items-center"
                  >
                    <GitCompare className="w-4 h-4 mr-2" />
                    {selectionMode ? 'Cancel' : 'Compare'}
                  </Button>
                  
                  {selectionMode && selectedProposals.length >= 2 && (
                    <Button 
                      onClick={handleCompareSelected}
                      className="flex items-center bg-green-600 hover:bg-green-700"
                    >
                      <GitCompare className="w-4 h-4 mr-2" />
                      Compare Selected ({selectedProposals.length})
                    </Button>
                  )}
                  
                  {selectionMode && selectedProposals.length > 0 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="flex items-center">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Selected ({selectedProposals.length})
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Proposals</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {selectedProposals.length} proposal{selectedProposals.length > 1 ? 's' : ''}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteSelected} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </>
              )}
              
              <Button asChild className="flex items-center">
                <Link to="/proposals/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Proposal
                </Link>
              </Button>
            </div>
          </div>

          {/* Proposals Grid */}
          {proposals.length === 0 ? (
            <Card className="p-12 text-center bg-card/50 backdrop-blur shadow-card">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Proposals Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first proposal to get started with client management.
              </p>
              <Button asChild className="flex items-center mx-auto">
                <Link to="/proposals/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Proposal
                </Link>
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proposals.map((proposal) => {
                const { text: statusText, colorClass: statusColor } = formatStatus(proposal.status as any);
                const analytics = getProposalAnalytics(proposal.id);
                const isSelected = selectedProposals.includes(proposal.id);
                
                return (
                  <div key={proposal.id} className="group relative">
                    {/* Selection Mode Overlay */}
                    {selectionMode && (
                      <div className="absolute top-2 left-2 z-10">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelection(proposal.id)}
                          disabled={!isSelected && selectedProposals.length >= 3}
                          className="bg-background/80 backdrop-blur"
                        />
                      </div>
                    )}
                    
                    <Link
                      to={`/proposal/${proposal.id}`}
                      className={`block ${selectionMode ? 'pointer-events-none' : ''}`}
                    >
                      <Card className={`p-6 bg-card/50 backdrop-blur shadow-card hover:shadow-elegant transition-all duration-200 group-hover:scale-[1.02] cursor-pointer ${
                        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}>
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                                {proposal.title}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {proposal.client.company}
                              </p>
                            </div>
                            {/* Analytics Badge */}
                            {analytics.totalViews > 0 && !selectionMode && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {analytics.totalViews}
                              </Badge>
                            )}
                          </div>

                          {/* Details */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Amount</span>
                              <span className="font-semibold">
                                {formatCurrency(proposal.financial.amount, proposal.financial.currency as CurrencyType)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Date</span>
                              <span className="text-sm">
                                {formatDate(proposal.timeline.createdAt)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Status</span>
                              <span className={`text-sm font-medium ${statusColor}`}>
                                {statusText}
                              </span>
                            </div>
                          </div>

                          {/* Analytics Preview */}
                          {analytics.totalViews > 0 && !selectionMode && (
                            <div className="pt-3 border-t border-muted/20">
                              <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {analytics.totalViews} views
                                </span>
                                {analytics.lastActivity && (
                                  <span>
                                    {formatDate(analytics.lastActivity, 'SHORT')}
                                  </span>
                                )}
                              </div>
                              {analytics.engagementScore > 0 && (
                                <div className="mt-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">Engagement</span>
                                    <span className="text-xs font-medium">{analytics.engagementScore}%</span>
                                  </div>
                                  <div className="w-full bg-muted/30 rounded-full h-1.5 mt-1">
                                    <div 
                                      className="bg-primary h-1.5 rounded-full transition-all duration-300" 
                                      style={{ width: `${analytics.engagementScore}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>
                    </Link>
                    
                    {/* Action Buttons */}
                    {!selectionMode && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        {analytics.totalViews > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="bg-background/80 backdrop-blur"
                            onClick={(e) => e.preventDefault()}
                          >
                            <Link 
                              to={`/proposals/${proposal.id}/analytics`}
                              className="flex items-center gap-1"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="bg-background/80 backdrop-blur text-destructive hover:text-destructive"
                              disabled={deleting === proposal.id}
                              onClick={(e) => e.preventDefault()}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Proposal</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{proposal.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteProposal(proposal.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ProposalList;