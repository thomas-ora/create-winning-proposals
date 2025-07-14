import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";
import { ProposalData } from "@/data/types";

interface ProposalHeaderProps {
  proposal: ProposalData;
}

export const ProposalHeader = ({ proposal }: ProposalHeaderProps) => {
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
  );
};