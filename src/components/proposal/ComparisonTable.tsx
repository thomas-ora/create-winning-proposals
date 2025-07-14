import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { ProposalData } from '@/data/types';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { type CurrencyType } from '@/utils/constants';

interface ComparisonTableProps {
  proposals: ProposalData[];
}

type SortMetric = 'amount' | 'timeline' | 'engagement' | 'value';

interface ComparisonMetric {
  label: string;
  getValue: (proposal: ProposalData) => number | string;
  format?: (value: any) => string;
  type: 'number' | 'string' | 'currency' | 'date';
  highlight?: boolean;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ proposals }) => {
  const [sortBy, setSortBy] = useState<SortMetric>('amount');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Responsive breakpoint detection
  React.useEffect(() => {
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? 'cards' : 'table');
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const metrics: ComparisonMetric[] = [
    {
      label: 'Total Amount',
      getValue: (p) => p.financial.amount,
      format: (v) => formatCurrency(v, proposals[0]?.financial.currency as CurrencyType),
      type: 'currency',
      highlight: true
    },
    {
      label: 'Currency',
      getValue: (p) => p.financial.currency,
      type: 'string'
    },
    {
      label: 'Project Duration',
      getValue: (p) => {
        // Use estimatedDuration if available, otherwise calculate from createdAt + estimate
        if (p.timeline.estimatedDuration) {
          const match = p.timeline.estimatedDuration.match(/(\d+)/);
          return match ? parseInt(match[1]) : 12;
        }
        return 12; // Default fallback
      },
      format: (v) => `${v} weeks`,
      type: 'number'
    },
    {
      label: 'Created Date',
      getValue: (p) => formatDate(new Date(p.timeline.createdAt), 'MEDIUM'),
      type: 'string'
    },
    {
      label: 'Expires Date',
      getValue: (p) => p.timeline.expiresAt ? formatDate(new Date(p.timeline.expiresAt), 'MEDIUM') : 'Not set',
      type: 'string'
    },
    {
      label: 'Payment Terms',
      getValue: (p) => p.financial.paymentTerms,
      type: 'string'
    },
    {
      label: 'Number of Sections',
      getValue: (p) => p.sections.length,
      format: (v) => `${v} sections`,
      type: 'number'
    },
    {
      label: 'Status',
      getValue: (p) => p.status,
      type: 'string'
    }
  ];

  // Calculate value metrics
  const getValueScore = (proposal: ProposalData) => {
    const duration = metrics[2].getValue(proposal) as number;
    const monthlyValue = proposal.financial.amount / duration;
    return Math.round(monthlyValue);
  };

  const getBestValue = () => {
    return proposals.reduce((best, current) => 
      getValueScore(current) < getValueScore(best) ? current : best
    );
  };

  const getHighestValue = () => {
    return proposals.reduce((highest, current) => 
      current.financial.amount > highest.financial.amount ? current : highest
    );
  };

  const findDifferences = (metric: ComparisonMetric) => {
    const values = proposals.map(p => metric.getValue(p));
    const unique = [...new Set(values)];
    return unique.length > 1;
  };

  const getComparisonIcon = (proposal: ProposalData, metric: ComparisonMetric) => {
    if (metric.type !== 'number' && metric.type !== 'currency') return null;
    
    const values = proposals.map(p => metric.getValue(p) as number);
    const currentValue = metric.getValue(proposal) as number;
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    
    if (currentValue === maxValue && maxValue !== minValue) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (currentValue === minValue && maxValue !== minValue) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  if (viewMode === 'cards') {
    return (
      <div className="space-y-6">
        {/* Value Insights - Mobile */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="p-4 bg-green-500/10 border-green-500/20">
            <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">Best Value</h4>
            <p className="text-sm">{getBestValue().title}</p>
            <p className="text-xs text-muted-foreground">
              ${getValueScore(getBestValue()).toLocaleString()}/month
            </p>
          </Card>
        </div>

        {/* Proposal Cards */}
        <div className="space-y-4">
          {proposals.map((proposal, index) => (
            <Card key={proposal.id} className="p-4 bg-card/50 backdrop-blur">
              <div className="mb-4">
                <h3 className="font-semibold text-lg">{proposal.title}</h3>
                <p className="text-sm text-muted-foreground">{proposal.client.company}</p>
              </div>
              
              <div className="space-y-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        metric.highlight ? 'text-primary font-semibold' : ''
                      }`}>
                        {metric.format 
                          ? metric.format(metric.getValue(proposal))
                          : metric.getValue(proposal)
                        }
                      </span>
                      {getComparisonIcon(proposal, metric)}
                    </div>
                  </div>
                ))}
                
                <div className="pt-2 border-t border-muted/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Value</span>
                    <span className="text-sm font-semibold">
                      ${getValueScore(proposal).toLocaleString()}/month
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Value Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-green-500/10 border-green-500/20">
          <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">Best Value</h4>
          <p className="text-sm">{getBestValue().title}</p>
          <p className="text-xs text-muted-foreground">
            ${getValueScore(getBestValue()).toLocaleString()}/month
          </p>
        </Card>
        
        <Card className="p-4 bg-blue-500/10 border-blue-500/20">
          <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-1">Highest Investment</h4>
          <p className="text-sm">{getHighestValue().title}</p>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(getHighestValue().financial.amount, getHighestValue().financial.currency as CurrencyType)}
          </p>
        </Card>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-muted">
              <th className="text-left py-3 px-4 font-semibold">Metric</th>
              {proposals.map((proposal, index) => (
                <th key={proposal.id} className="text-left py-3 px-4 font-semibold min-w-48">
                  <div>
                    <div className="font-semibold">{proposal.title}</div>
                    <div className="text-xs text-muted-foreground font-normal">
                      {proposal.client.company}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => {
              const hasDifferences = findDifferences(metric);
              
              return (
                <tr 
                  key={metric.label} 
                  className={`border-b border-muted/50 ${
                    hasDifferences ? 'bg-yellow-50/30 dark:bg-yellow-900/10' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-medium">
                    <div className="flex items-center gap-2">
                      {metric.label}
                      {hasDifferences && (
                        <Badge variant="secondary" className="text-xs">
                          Differs
                        </Badge>
                      )}
                    </div>
                  </td>
                  {proposals.map((proposal) => (
                    <td key={proposal.id} className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={metric.highlight ? 'font-semibold text-primary' : ''}>
                          {metric.format 
                            ? metric.format(metric.getValue(proposal))
                            : metric.getValue(proposal)
                          }
                        </span>
                        {getComparisonIcon(proposal, metric)}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
            
            {/* Value Analysis Row */}
            <tr className="border-b border-muted/50 bg-accent/20">
              <td className="py-3 px-4 font-medium">
                <div className="flex items-center gap-2">
                  Monthly Value
                  <Badge variant="default" className="text-xs">
                    Calculated
                  </Badge>
                </div>
              </td>
              {proposals.map((proposal) => (
                <td key={proposal.id} className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      ${getValueScore(proposal).toLocaleString()}/month
                    </span>
                    {proposal.id === getBestValue().id && (
                      <Badge variant="default" className="text-xs bg-green-500">
                        Best Value
                      </Badge>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary Insights */}
      <Card className="p-4 bg-muted/20">
        <h4 className="font-semibold mb-2">Comparison Summary</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>
            • Price range: {formatCurrency(Math.min(...proposals.map(p => p.financial.amount)), proposals[0]?.financial.currency as CurrencyType)} - {formatCurrency(Math.max(...proposals.map(p => p.financial.amount)), proposals[0]?.financial.currency as CurrencyType)}
          </p>
          <p>
            • Best monthly value: {getBestValue().title} at ${getValueScore(getBestValue()).toLocaleString()}/month
          </p>
          <p>
            • Average project duration: {Math.round(proposals.reduce((sum, p) => sum + (metrics[2].getValue(p) as number), 0) / proposals.length)} months
          </p>
        </div>
      </Card>
    </div>
  );
};