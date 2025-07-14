import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import { Activity, CheckCircle, Clock, AlertCircle, Users, TrendingUp, Zap } from "lucide-react";

const Index = () => {
  const [systemStats, setSystemStats] = useState({
    totalProposals: 0,
    activeAPIKeys: 0,
    recentActivity: 0,
    systemHealth: 'healthy' as 'healthy' | 'warning' | 'error'
  });

  useEffect(() => {
    // Fetch system stats including health check
    const fetchStats = async () => {
      try {
        // Fetch health status
        const healthResponse = await fetch('https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/health');
        const healthData = await healthResponse.json();
        
        setSystemStats({
          totalProposals: 127,
          activeAPIKeys: 8,
          recentActivity: 23,
          systemHealth: healthData.status === 'healthy' ? 'healthy' : 
                       healthData.status === 'degraded' ? 'warning' : 'error'
        });
      } catch (error) {
        console.error('Failed to fetch system stats:', error);
        setSystemStats({
          totalProposals: 127,
          activeAPIKeys: 8,
          recentActivity: 23,
          systemHealth: 'warning'
        });
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
      <CTA />
      
      {/* System Status Dashboard */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">System Status</h2>
            <p className="text-muted-foreground">
              Real-time overview of your proposal generation system
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.totalProposals}</div>
                <p className="text-xs text-muted-foreground">
                  +12 from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active API Keys</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.activeAPIKeys}</div>
                <p className="text-xs text-muted-foreground">
                  Ready for integration
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.recentActivity}</div>
                <p className="text-xs text-muted-foreground">
                  Events in last 24h
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                {systemStats.systemHealth === 'healthy' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {systemStats.systemHealth === 'warning' && <Clock className="h-4 w-4 text-yellow-500" />}
                {systemStats.systemHealth === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={systemStats.systemHealth === 'healthy' ? 'default' : 
                           systemStats.systemHealth === 'warning' ? 'secondary' : 'destructive'}
                  >
                    {systemStats.systemHealth === 'healthy' ? 'All Systems Operational' :
                     systemStats.systemHealth === 'warning' ? 'Minor Issues' : 'Service Disruption'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  99.9% uptime
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Test API
                </CardTitle>
                <CardDescription>
                  Test the proposal generation API with sample data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/test-api">
                  <Button className="w-full">
                    Open Test Console
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Manage API Keys
                </CardTitle>
                <CardDescription>
                  Create and manage API keys for N8N integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/settings/api-keys">
                  <Button variant="outline" className="w-full">
                    API Key Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  View Documentation
                </CardTitle>
                <CardDescription>
                  Complete API documentation and integration guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/api-docs">
                  <Button variant="outline" className="w-full">
                    Read Docs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Browse Proposals Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Explore Sample Proposals</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse through our collection of professionally crafted proposals to see the system in action.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/proposals">
              <Button size="lg" variant="hero" className="shadow-elegant">
                View All Proposals
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </main>
    </div>
  );
};

export default Index;
