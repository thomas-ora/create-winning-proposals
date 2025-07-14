import { Card } from "@/components/ui/card";
import { Calendar, DollarSign, Clock } from "lucide-react";
import { ProposalData } from "@/data/types";
import { formatCurrency, formatDate, formatStatus } from "@/utils/formatters";
import { type CurrencyType } from "@/utils/constants";

interface ProposalMetaProps {
  proposal: ProposalData;
}

export const ProposalMeta = ({ proposal }: ProposalMetaProps) => {
  const { text: statusText, colorClass: statusColor } = formatStatus(proposal.status as any);
  
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-8">
      <Card className="p-4 bg-card/50 backdrop-blur shadow-card">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="font-semibold text-lg">
              {formatCurrency(proposal.financial.amount, proposal.financial.currency as CurrencyType)}
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4 bg-card/50 backdrop-blur shadow-card">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-semibold">{formatDate(proposal.timeline.createdAt)}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4 bg-card/50 backdrop-blur shadow-card">
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className={`font-semibold ${statusColor}`}>{statusText}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};