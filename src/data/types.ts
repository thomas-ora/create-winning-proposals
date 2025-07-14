export interface PricingTable {
  headers: string[];
  rows: Array<{ [key: string]: string | number }>;
  total?: number;
}

export interface ProposalSection {
  id: string;
  type: 'text' | 'list' | 'table' | 'image' | 'pricing' | 'roi_calculator';
  title: string;
  content: string | string[] | PricingTable;
  order: number;
}

export interface ProposalData {
  id: string;
  title: string;
  client: {
    name: string;
    email: string;
    company: string;
  };
  author: {
    name: string;
    email: string;
    company: string;
  };
  financial: {
    amount: number;
    currency: string;
    paymentTerms: string;
  };
  timeline: {
    createdAt: Date;
    expiresAt?: Date;
    estimatedDuration?: string;
  };
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  sections: ProposalSection[];
  template: string;
  branding?: {
    primaryColor: string;
    logo?: string;
  };
  analytics?: {
    views: number;
    lastViewed?: Date;
    timeSpent?: number;
  };
}