import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Clock, 
  Download, 
  TrendingUp,
  FileText,
  Users,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { getProposalEvents, getProposalAnalytics } from '@/utils/analytics';
import { formatDate } from '@/utils/formatters';
import AppLayout from '@/components/layout/AppLayout';

// Mock data for demonstration - in real app this would come from API
const mockProposals = [
  { id: '1', title: 'Digital Marketing Strategy', client: 'TechCorp Inc' },
  { id: '2', title: 'Website Redesign Project', client: 'StartupXYZ' },
  { id: '3', title: 'Cloud Migration Plan', client: 'Enterprise Ltd' }
];

const GeneralAnalytics = () => {
  // Get analytics for all proposals
  const allAnalytics = React.useMemo(() => {
    return mockProposals.map(proposal => {
      const analytics = getProposalAnalytics(proposal.id);
      const events = getProposalEvents(proposal.id);
      return {
        ...proposal,
        analytics,
        events
      };
    });
  }, []);

  // Calculate totals
  const totals = React.useMemo(() => {
    return allAnalytics.reduce((acc, proposal) => {
      if (proposal.analytics) {
        acc.totalViews += proposal.analytics.totalViews;
        acc.totalTimeSpent += proposal.analytics.timeSpent;
        acc.totalDownloads += proposal.analytics.pdfDownloads;
        acc.totalEngagementScore += proposal.analytics.engagementScore;
      }
      return acc;
    }, {
      totalViews: 0,
      totalTimeSpent: 0,
      totalDownloads: 0,
      totalEngagementScore: 0
    });
  }, [allAnalytics]);

  // Process data for charts
  const proposalPerformance = React.useMemo(() => {
    return allAnalytics.map(proposal => ({
      name: proposal.title.substring(0, 20) + '...',
      views: proposal.analytics?.totalViews || 0,
      engagement: proposal.analytics?.engagementScore || 0
    }));
  }, [allAnalytics]);

  // Get recent activity across all proposals
  const recentActivity = React.useMemo(() => {
    const allEvents = allAnalytics.flatMap(proposal => 
      proposal.events.map(event => ({
        ...event,
        proposalTitle: proposal.title
      }))
    );
    return allEvents
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }, [allAnalytics]);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Overview of all proposal performance</p>
            </div>
            <Button asChild>
              <Link to="/proposals">
                <FileText className="w-4 h-4 mr-2" />
                View Proposals
              </Link>
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-3xl font-bold">{totals.totalViews}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Time</p>
                  <p className="text-3xl font-bold">{Math.round(totals.totalTimeSpent / 60)}m</p>
                </div>
                <Clock className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                  <p className="text-3xl font-bold">{totals.totalDownloads}</p>
                </div>
                <Download className="w-8 h-8 text-purple-500" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Engagement</p>
                  <p className="text-3xl font-bold">
                    {allAnalytics.length > 0 ? Math.round(totals.totalEngagementScore / allAnalytics.length) : 0}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Proposal Performance */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Proposal Performance</h3>
              {proposalPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={proposalPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  No proposal data available
                </div>
              )}
            </Card>

            {/* Engagement Scores */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Engagement Scores</h3>
              {proposalPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={proposalPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="engagement" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                  No engagement data available
                </div>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Proposal List with Analytics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Individual Proposals</h3>
              <div className="space-y-4">
                {allAnalytics.map((proposal) => (
                  <div key={proposal.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{proposal.title}</h4>
                      <p className="text-sm text-muted-foreground">{proposal.client}</p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {proposal.analytics?.totalViews || 0} views
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {proposal.analytics?.pdfDownloads || 0} downloads
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        Score: {proposal.analytics?.engagementScore || 0}
                      </Badge>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/proposals/${proposal.id}/analytics`}>
                          <BarChart3 className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentActivity.map((event, index) => (
                  <div key={`${event.id}-${index}`} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium capitalize">
                        {event.eventType.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {event.proposalTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(new Date(event.timestamp), 'SHORT')}
                      </p>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No recent activity
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default GeneralAnalytics;