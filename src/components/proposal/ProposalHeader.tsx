import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Loader2, BarChart3 } from "lucide-react";
import { ProposalData } from "@/data/types";
import { downloadPDF, trackPDFDownload } from "@/utils/generatePDF";
import { toast } from "@/hooks/use-toast";

interface ProposalHeaderProps {
  proposal: ProposalData;
}

export const ProposalHeader = ({ proposal }: ProposalHeaderProps) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      // Generate and download PDF
      await downloadPDF({ proposal });
      
      // Track the download event
      await trackPDFDownload(proposal.id);
      
      toast({
        title: "PDF Downloaded",
        description: "The proposal has been downloaded successfully.",
      });
    } catch (error) {
      console.error('PDF download failed:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  return (
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
            <Button variant="outline" size="sm" asChild>
              <Link to={`/proposals/${proposal.id}/analytics`}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button variant="hero" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Accept Proposal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};