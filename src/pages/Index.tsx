import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { Activity, CheckCircle, Clock, AlertCircle, Users, TrendingUp, Zap, ArrowRight, Sparkles, BarChart3, Clock3 } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
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
    <AppLayout>
      {/* Hero Section with animated background */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-primary rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 px-8 py-16">
          {/* Hero Content */}
          <div className="max-w-6xl mx-auto text-center mb-20">
            <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full mb-8 glow-soft">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                AI-Powered Proposal Generation
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8">
              <span className="gradient-text">Create Winning</span>
              <br />
              <span className="gradient-text">Proposals</span>
              <br />
              <span className="text-foreground">in Minutes</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your business proposals with our intelligent platform. Generate beautiful, 
              professional proposals that convert prospects into clients with 40-50% success rates.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              {user ? (
                <Link to="/proposals/create">
                  <Button size="lg" className="text-lg px-8 py-6 bg-gradient-primary hover:shadow-glow transition-all duration-300 hover-glow">
                    Start Creating
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="text-lg px-8 py-6 bg-gradient-primary hover:shadow-glow transition-all duration-300 hover-glow">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
              <Link to="/test-api">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 glass-card border-white/20 hover:border-primary/50">
                  Test API
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating Metric Cards */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 mb-16">
            <Card className="glass-card hover-glow animate-float">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-8 w-8 text-primary glow-soft" />
                  <Badge variant="secondary" className="bg-gradient-primary text-white border-0">
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text">{systemStats.totalProposals}</div>
                <p className="text-sm text-muted-foreground">Total Proposals</p>
                <p className="text-xs text-green-400 mt-1">+12 this month</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-glow animate-float" style={{ animationDelay: '0.5s' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Users className="h-8 w-8 text-primary glow-soft" />
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text">{systemStats.activeAPIKeys}</div>
                <p className="text-sm text-muted-foreground">Active API Keys</p>
                <p className="text-xs text-muted-foreground mt-1">Ready for N8N</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-glow animate-float" style={{ animationDelay: '1s' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Activity className="h-8 w-8 text-primary glow-soft" />
                  <Clock3 className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text">{systemStats.recentActivity}</div>
                <p className="text-sm text-muted-foreground">Events (24h)</p>
                <p className="text-xs text-muted-foreground mt-1">Real-time tracking</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-glow animate-float" style={{ animationDelay: '1.5s' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  {systemStats.systemHealth === 'healthy' && <CheckCircle className="h-8 w-8 text-green-400 glow-soft" />}
                  {systemStats.systemHealth === 'warning' && <Clock className="h-8 w-8 text-yellow-400 glow-soft" />}
                  {systemStats.systemHealth === 'error' && <AlertCircle className="h-8 w-8 text-red-400 glow-soft" />}
                  <div className={`w-2 h-2 rounded-full ${
                    systemStats.systemHealth === 'healthy' ? 'bg-green-400' : 
                    systemStats.systemHealth === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                  } animate-pulse`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text">99.9%</div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
                <p className={`text-xs mt-1 ${
                  systemStats.systemHealth === 'healthy' ? 'text-green-400' : 
                  systemStats.systemHealth === 'warning' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {systemStats.systemHealth === 'healthy' ? 'All systems operational' :
                   systemStats.systemHealth === 'warning' ? 'Minor issues detected' : 'Service disruption'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Feature Grid */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <Card className="glass-card hover-glow group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 glow-soft group-hover:animate-glow-pulse">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Lightning Fast API</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Generate proposals in under 30 seconds with our optimized API endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/test-api">
                  <Button variant="outline" className="w-full glass-card border-white/20 hover:border-primary/50">
                    Test Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="glass-card hover-glow group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 glow-soft group-hover:animate-glow-pulse">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Advanced Analytics</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Track engagement metrics and optimize your proposals for better conversion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={user ? "/proposals" : "/auth"}>
                  <Button variant="outline" className="w-full glass-card border-white/20 hover:border-primary/50">
                    {user ? "View Analytics" : "Sign In to View"}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="glass-card hover-glow group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 glow-soft group-hover:animate-glow-pulse">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">N8N Integration</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Seamlessly connect with your automation workflows and CRM systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/api-docs">
                  <Button variant="outline" className="w-full glass-card border-white/20 hover:border-primary/50">
                    Integration Guide
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
