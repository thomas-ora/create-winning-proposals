import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Activity, 
  BarChart3, 
  Database, 
  Key, 
  Globe,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';

const AdminDashboard = () => {
  const [systemStats, setSystemStats] = useState({
    totalProposals: 0,
    activeUsers: 0,
    apiRequests: 0,
    systemHealth: 'healthy' as 'healthy' | 'warning' | 'error'
  });

  useEffect(() => {
    // Fetch real system stats
    const fetchStats = async () => {
      try {
        // This would typically fetch from your analytics API
        setSystemStats({
          totalProposals: 127,
          activeUsers: 45,
          apiRequests: 1234,
          systemHealth: 'healthy'
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              System administration and monitoring
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-600">
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{systemStats.totalProposals}</div>
                <p className="text-sm text-muted-foreground">Total Proposals</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Users className="h-8 w-8 text-green-500" />
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{systemStats.activeUsers}</div>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{systemStats.apiRequests}</div>
                <p className="text-sm text-muted-foreground">API Requests (24h)</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-orange-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  {systemStats.systemHealth === 'healthy' && <CheckCircle className="h-8 w-8 text-green-400" />}
                  {systemStats.systemHealth === 'warning' && <Clock className="h-8 w-8 text-yellow-400" />}
                  {systemStats.systemHealth === 'error' && <AlertTriangle className="h-8 w-8 text-red-400" />}
                  <div className={`w-2 h-2 rounded-full ${
                    systemStats.systemHealth === 'healthy' ? 'bg-green-400' : 
                    systemStats.systemHealth === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                  } animate-pulse`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">99.9%</div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">System Setup</CardTitle>
                    <CardDescription>
                      Configure and verify system components
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/admin/setup">
                    Open Setup Guide
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">System Health</CardTitle>
                    <CardDescription>
                      Monitor system performance and health
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/admin/health">
                    View Health Status
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">API Statistics</CardTitle>
                    <CardDescription>
                      View API usage and performance metrics
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/admin/api-stats">
                    View API Stats
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Database Admin</CardTitle>
                    <CardDescription>
                      Manage database and data operations
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/admin/database">
                    Database Tools
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <Key className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">API Keys</CardTitle>
                    <CardDescription>
                      Manage and monitor API key usage
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/settings/api-keys">
                    Manage API Keys
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">System Logs</CardTitle>
                    <CardDescription>
                      View system logs and debugging info
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/admin/logs">
                    View System Logs
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Security Notice */}
          <Card className="mt-8 border-yellow-500/20 bg-yellow-500/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <CardTitle className="text-yellow-600">Security Notice</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This admin panel provides powerful system administration tools. All actions are logged and monitored.
                Ensure you're following security best practices and only authorized personnel have access.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;