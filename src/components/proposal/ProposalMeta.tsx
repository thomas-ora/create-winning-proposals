import { Card } from "@/components/ui/card";
import { Calendar, DollarSign, Clock } from "lucide-react";
import { ProposalData } from "@/data/types";

interface ProposalMetaProps {
  proposal: ProposalData;
}

export const ProposalMeta = ({ proposal }: ProposalMetaProps) => {
  return (
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
  );
};