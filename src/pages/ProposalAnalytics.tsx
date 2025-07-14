import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Eye, 
  Clock, 
  Download, 
  Calculator,
  MousePointerClick,
  TrendingUp,
  Users,
  Globe,
  Smartphone,
  Monitor
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
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useProposal } from '@/hooks/useProposal';
import { getProposalEvents, getProposalAnalytics } from '@/utils/analytics';
import { formatDate } from '@/utils/formatters';
import MainLayout from '@/components/layout/MainLayout';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

const ProposalAnalytics = () => {
  const { proposalId } = useParams();
  const { proposal, loading } = useProposal(proposalId);
  
  const events = React.useMemo(() => 
    proposalId ? getProposalEvents(proposalId) : [], 
    [proposalId]
  );
  
  const analytics = React.useMemo(() => 
    proposalId ? getProposalAnalytics(proposalId) : null, 
    [proposalId]
  );

  // Process events for charts
  const viewsOverTime = React.useMemo(() => {
    const viewEvents = events.filter(e => e.eventType === 'view');
    const dailyViews = new Map<string, number>();
    
    viewEvents.forEach(event => {
      const date = new Date(event.timestamp).toLocaleDateString();
      dailyViews.set(date, (dailyViews.get(date) || 0) + 1);
    });
    
    return Array.from(dailyViews.entries()).map(([date, views]) => ({
      date,
      views
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  const sectionViews = React.useMemo(() => {
    const sectionEvents = events.filter(e => e.eventType === 'section_view');
    const sectionCounts = new Map<string, number>();
    
    sectionEvents.forEach(event => {
      const sectionTitle = event.metadata?.sectionTitle || 'Unknown Section';
      sectionCounts.set(sectionTitle, (sectionCounts.get(sectionTitle) || 0) + 1);
    });
    
    return Array.from(sectionCounts.entries()).map(([section, views]) => ({
      section: section.substring(0, 20) + (section.length > 20 ? '...' : ''),
      views
    })).sort((a, b) => b.views - a.views);
  }, [events]);

  const deviceBreakdown = React.useMemo(() => {
    const deviceCounts = new Map<string, number>();
    
    events.forEach(event => {
      if (event.userAgent) {
        let deviceType = 'Desktop';
        if (/Mobile|Android|iPhone/.test(event.userAgent)) {
          deviceType = 'Mobile';
        } else if (/iPad|Tablet/.test(event.userAgent)) {
          deviceType = 'Tablet';
        }
        deviceCounts.set(deviceType, (deviceCounts.get(deviceType) || 0) + 1);
      }
    });
    
    return Array.from(deviceCounts.entries()).map(([device, count]) => ({
      device,
      count,
      percentage: Math.round((count / events.length) * 100)
    }));
  }, [events]);

  if (loading) {
    return (
      <MainLayout
        title="Proposal Analytics"
        description="Loading analytics data..."
      >
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!proposal || !analytics) {
    return (
      <MainLayout
        title="Analytics Not Available"
        description="We couldn't load analytics for this proposal"
      >
        <div className="flex items-center justify-center py-16">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">No Data Available</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't load analytics for this proposal.
            </p>
            <Button asChild>
              <Link to="/proposals">Back to Proposals</Link>
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Proposal Analytics"
      description={proposal.title}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link to="/proposals" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Proposals
              </Link>
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-3xl font-bold">{analytics.totalViews}</p>
                </div>
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Time Spent</p>
                  <p className="text-3xl font-bold">{Math.round(analytics.timeSpent / 60)}m</p>
                </div>
                <Clock className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">PDF Downloads</p>
                  <p className="text-3xl font-bold">{analytics.pdfDownloads}</p>
                </div>
                <Download className="w-8 h-8 text-purple-500" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Engagement Score</p>
                  <p className="text-3xl font-bold">{analytics.engagementScore}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Views Over Time */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
              {viewsOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={viewsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
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
                      dataKey="views" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No view data available
                </div>
              )}
            </Card>

            {/* Section Views */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Most Viewed Sections</h3>
              {sectionViews.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={sectionViews} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      type="number" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="section" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      width={100}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No section view data available
                </div>
              )}
            </Card>

            {/* Device Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
              {deviceBreakdown.length > 0 ? (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={deviceBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ device, percentage }) => `${device} (${percentage}%)`}
                      >
                        {deviceBreakdown.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-3 gap-4">
                    {deviceBreakdown.map((item, index) => (
                      <div key={item.device} className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          {item.device === 'Mobile' && <Smartphone className="w-5 h-5" />}
                          {item.device === 'Tablet' && <Smartphone className="w-5 h-5" />}
                          {item.device === 'Desktop' && <Monitor className="w-5 h-5" />}
                        </div>
                        <p className="text-sm font-medium">{item.device}</p>
                        <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No device data available
                </div>
              )}
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {events.slice(-10).reverse().map((event, index) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium capitalize">
                        {event.eventType.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(new Date(event.timestamp), 'FULL')}
                      </p>
                    </div>
                    {event.metadata?.sectionTitle && (
                      <Badge variant="secondary" className="text-xs">
                        {event.metadata.sectionTitle}
                      </Badge>
                    )}
                  </div>
                ))}
                {events.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No activity recorded yet
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Calculator Usage</h3>
              </div>
              <p className="text-2xl font-bold">{analytics.calculatorUses}</p>
              <p className="text-sm text-muted-foreground">
                Times calculator was used
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MousePointerClick className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Section Views</h3>
              </div>
              <p className="text-2xl font-bold">{analytics.sectionViews}</p>
              <p className="text-sm text-muted-foreground">
                Sections viewed by visitors
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Last Activity</h3>
              </div>
                <p className="text-lg font-bold">
                  {analytics.lastActivity ? formatDate(analytics.lastActivity, 'SHORT') : 'Never'}
                </p>
              <p className="text-sm text-muted-foreground">
                Most recent engagement
              </p>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProposalAnalytics;