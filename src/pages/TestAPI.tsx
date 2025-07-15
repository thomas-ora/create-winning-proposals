import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Play, CheckCircle, XCircle, AlertTriangle, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';

const TestAPI: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Sample payloads for different client types
  const samplePayloads = {
    analytical: {
      client: {
        first_name: "Robert",
        last_name: "Chen",
        email: "robert.chen@techcorp.com",
        phone: "+1-555-0101",
        title: "CTO",
        company_name: "TechCorp Analytics",
        company_website: "https://techcorp-analytics.com",
        industry: "Technology",
        employee_count: 250,
        revenue_range: "$10M-$50M",
        growth_stage: "Growth",
        consultation_date: "2024-07-20T14:00:00Z"
      },
      psychology_profile: {
        primary_type: "Analytical",
        secondary_type: "Driver",
        analytical_score: 85,
        driver_score: 65,
        expressive_score: 30,
        amiable_score: 20,
        decision_style: "Deliberate",
        decision_authority: "Full",
        risk_tolerance: "Conservative"
      },
      proposal: {
        title: "Enterprise Data Analytics Platform Implementation",
        executive_summary: "Our comprehensive analysis reveals significant opportunities to optimize your data infrastructure and unlock actionable insights. This proposal outlines a systematic approach to implementing a modern analytics platform that will reduce data processing time by 60% and improve decision-making accuracy by 40%.",
        sections: [
          {
            type: "text",
            title: "Current State Analysis",
            content: "Based on our technical assessment, your current data infrastructure faces several critical challenges: fragmented data sources, manual reporting processes, and limited real-time analytics capabilities. Our analysis shows these inefficiencies cost approximately $2.3M annually in lost productivity.",
            order: 1
          },
          {
            type: "text",
            title: "Proposed Solution Architecture",
            content: "We recommend implementing a cloud-native analytics platform with automated data pipelines, real-time dashboards, and predictive modeling capabilities. The solution includes data lake architecture, ETL automation, and advanced visualization tools.",
            order: 2
          },
          {
            type: "pricing",
            title: "Investment Analysis",
            content: {
              headers: ["Component", "Year 1", "Year 2", "Year 3"],
              rows: [
                { Component: "Platform Setup", "Year 1": "$125,000", "Year 2": "$0", "Year 3": "$0" },
                { Component: "Implementation Services", "Year 1": "$200,000", "Year 2": "$50,000", "Year 3": "$25,000" },
                { Component: "Training & Support", "Year 1": "$75,000", "Year 2": "$40,000", "Year 3": "$40,000" },
                { Component: "Total Investment", "Year 1": "$400,000", "Year 2": "$90,000", "Year 3": "$65,000" }
              ]
            },
            order: 3
          }
        ],
        financial_amount: 400000,
        financial_currency: "USD",
        payment_terms: "Net 30",
        pricing_tiers: {
          efficiency: {
            name: "Data Efficiency Package",
            price: 250000,
            features: ["Basic analytics platform", "Standard reporting", "Email support"]
          },
          growth: {
            name: "Growth Analytics Package", 
            price: 400000,
            features: ["Advanced analytics", "Real-time dashboards", "Priority support", "Custom integrations"]
          },
          transformation: {
            name: "Digital Transformation Package",
            price: 650000,
            features: ["Enterprise platform", "AI/ML capabilities", "24/7 support", "Dedicated team", "Strategic consulting"]
          }
        },
        valid_until: "2024-08-20T23:59:59Z",
        prepared_by: "Sarah Martinez, Solutions Architect",
        password_protected: false,
        brand_color: "#1E40AF"
      }
    },
    driver: {
      client: {
        first_name: "Alex",
        last_name: "Rodriguez",
        email: "alex@rapidgrowth.com",
        phone: "+1-555-0202",
        title: "CEO",
        company_name: "RapidGrowth Ventures",
        company_website: "https://rapidgrowth.com",
        industry: "E-commerce",
        employee_count: 75,
        revenue_range: "$5M-$10M",
        growth_stage: "Growth",
        consultation_date: "2024-07-18T09:00:00Z"
      },
      psychology_profile: {
        primary_type: "Driver",
        secondary_type: "Expressive",
        analytical_score: 40,
        driver_score: 90,
        expressive_score: 70,
        amiable_score: 25,
        decision_style: "Fast",
        decision_authority: "Full",
        risk_tolerance: "Aggressive"
      },
      proposal: {
        title: "Revenue Acceleration Program",
        executive_summary: "BOTTOM LINE: We'll increase your revenue by 150% in 6 months. Our proven system has generated $50M+ for similar companies. Let's get started immediately.",
        sections: [
          {
            type: "text",
            title: "The Opportunity",
            content: "Your company is positioned for explosive growth. Current revenue of $8M can reach $20M within 12 months with the right acceleration strategy. We've done this 47 times before.",
            order: 1
          },
          {
            type: "text", 
            title: "Our Proven System",
            content: "Three-phase approach: (1) Optimize conversion funnels - 40% improvement guaranteed, (2) Scale advertising spend - 3x ROAS minimum, (3) Launch new revenue streams - 2-3 additional channels.",
            order: 2
          }
        ],
        financial_amount: 150000,
        financial_currency: "USD",
        payment_terms: "50% upfront, 50% at 90 days",
        valid_until: "2024-07-25T23:59:59Z",
        prepared_by: "Mike Thompson, Growth Strategist",
        password_protected: false,
        brand_color: "#DC2626"
      }
    },
    expressive: {
      client: {
        first_name: "Maria",
        last_name: "Silva",
        email: "maria@creativeagency.com",
        phone: "+1-555-0303",
        title: "Creative Director",
        company_name: "Inspire Creative Agency",
        company_website: "https://inspirecreative.com",
        industry: "Marketing & Advertising",
        employee_count: 35,
        revenue_range: "$2M-$5M",
        growth_stage: "Growth",
        consultation_date: "2024-07-19T11:00:00Z"
      },
      psychology_profile: {
        primary_type: "Expressive",
        secondary_type: "Amiable",
        analytical_score: 35,
        driver_score: 45,
        expressive_score: 85,
        amiable_score: 70,
        decision_style: "Moderate",
        decision_authority: "Partial",
        risk_tolerance: "Moderate"
      },
      proposal: {
        title: "Brand Transformation & Digital Experience Revolution",
        executive_summary: "Imagine your brand not just being seen, but being FELT by your audience. This isn't just a marketing campaign - it's a complete brand renaissance that will position you as the industry leader everyone wants to work with. Together, we'll create something extraordinary.",
        sections: [
          {
            type: "text",
            title: "Your Brand's Potential",
            content: "Your creative vision deserves a platform that amplifies its impact. We see the incredible potential in your brand story - let's unleash it through innovative digital experiences that captivate and convert.",
            order: 1
          },
          {
            type: "text",
            title: "The Collaborative Journey",
            content: "This partnership is about co-creating magic. Our team becomes an extension of yours, working hand-in-hand to bring your boldest creative visions to life through cutting-edge technology and storytelling.",
            order: 2
          }
        ],
        financial_amount: 85000,
        financial_currency: "USD", 
        payment_terms: "Monthly payments over 6 months",
        valid_until: "2024-08-19T23:59:59Z",
        prepared_by: "Jessica Park, Brand Strategist",
        password_protected: false,
        brand_color: "#7C3AED"
      }
    },
    amiable: {
      client: {
        first_name: "David",
        last_name: "Wilson",
        email: "david@familybusiness.com",
        phone: "+1-555-0404",
        title: "Operations Manager",
        company_name: "Wilson Family Hardware",
        company_website: "https://wilsonhardware.com",
        industry: "Retail",
        employee_count: 12,
        revenue_range: "$1M-$2M", 
        growth_stage: "Mature",
        consultation_date: "2024-07-21T15:00:00Z"
      },
      psychology_profile: {
        primary_type: "Amiable",
        secondary_type: "Analytical",
        analytical_score: 60,
        driver_score: 20,
        expressive_score: 30,
        amiable_score: 90,
        decision_style: "Deliberate",
        decision_authority: "Partial",
        risk_tolerance: "Conservative"
      },
      proposal: {
        title: "Gentle Digital Modernization for Family Business",
        executive_summary: "We understand how important it is to preserve what makes your family business special while carefully introducing helpful technology. This proposal outlines a supportive, step-by-step approach that respects your values and supports your team every step of the way.",
        sections: [
          {
            type: "text",
            title: "Understanding Your Needs",
            content: "We know that change can feel overwhelming, especially for a business with such strong traditions. Our approach prioritizes your comfort and your team's confidence, ensuring everyone feels supported throughout the process.",
            order: 1
          },
          {
            type: "text",
            title: "Gradual, Supportive Implementation",
            content: "We'll start small with the most helpful improvements first. Each step will be thoroughly tested and approved by you before moving forward. Your team will receive patient, ongoing training and support.",
            order: 2
          }
        ],
        financial_amount: 25000,
        financial_currency: "USD",
        payment_terms: "Quarterly payments with no penalties for delays",
        valid_until: "2024-09-21T23:59:59Z",
        prepared_by: "Jennifer Adams, Customer Success Manager",
        password_protected: false,
        brand_color: "#059669"
      }
    }
  };

  const [selectedPayload, setSelectedPayload] = useState<keyof typeof samplePayloads>('analytical');
  const [customPayload, setCustomPayload] = useState(JSON.stringify(samplePayloads.analytical, null, 2));

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied',
        description: 'Content copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const testAPI = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an API key',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const payload = JSON.parse(customPayload);
      
      console.log('🚀 Sending API Request:', {
        url: 'https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/create-proposal',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.substring(0, 10)}...`,
        },
        payload: payload
      });
      
      const response = await fetch('https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/create-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('📡 Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      const result = await response.json();
      console.log('📦 Response data:', result);

      if (!response.ok) {
        console.error('❌ API Error:', result);
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      setResponse({
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: result,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: 'Success',
        description: 'Proposal created successfully!',
      });

      // Test the generated URL immediately
      if (result.url) {
        console.log('🔗 Testing generated URL:', result.url);
        testProposalUrl(result.url, result.proposal_id);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('💥 API Test Error:', error);
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const testProposalUrl = async (url: string, proposalId: string) => {
    try {
      console.log('🔍 Testing proposal URL access...');
      const testResponse = await fetch(url.replace(window.location.origin, '') + '?test=true');
      console.log('📄 Proposal page response:', {
        status: testResponse.status,
        statusText: testResponse.statusText,
        url: url
      });
    } catch (error) {
      console.error('❌ Error testing proposal URL:', error);
    }
  };

  const debugDatabase = async () => {
    try {
      console.log('🔍 Fetching debug data...');
      const response = await fetch('https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/debug-proposal');
      const debugData = await response.json();
      console.log('🗄️ Database Debug Data:', debugData);
      
      toast({
        title: 'Debug Complete',
        description: 'Check console for database status',
      });
    } catch (error) {
      console.error('💥 Debug error:', error);
      toast({
        title: 'Debug Error',
        description: 'Failed to fetch debug data',
        variant: 'destructive',
      });
    }
  };

  const handlePayloadChange = (type: keyof typeof samplePayloads) => {
    setSelectedPayload(type);
    setCustomPayload(JSON.stringify(samplePayloads[type], null, 2));
  };

  const downloadN8NTemplate = () => {
    const template = {
      "name": "Proposal Generation Workflow",
      "nodes": [
        {
          "parameters": {
            "url": "https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/create-proposal",
            "authentication": "headerAuth",
            "sendHeaders": true,
            "headerParameters": {
              "parameters": [
                {
                  "name": "Authorization",
                  "value": "Bearer YOUR_API_KEY_HERE"
                },
                {
                  "name": "Content-Type", 
                  "value": "application/json"
                }
              ]
            },
            "sendBody": true,
            "bodyContentType": "json",
            "jsonParameters": JSON.stringify(samplePayloads.analytical, null, 2)
          },
          "type": "n8n-nodes-base.httpRequest",
          "typeVersion": 4.1,
          "position": [380, 240],
          "name": "Create Proposal"
        }
      ],
      "connections": {}
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'n8n-proposal-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded',
      description: 'N8N template downloaded successfully',
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">API Testing Console</h1>
            <p className="text-muted-foreground">
              Test the proposal creation API with different client psychology profiles
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={debugDatabase} variant="outline">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Debug Database
            </Button>
            <Button onClick={downloadN8NTemplate} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download N8N Template
            </Button>
          </div>
        </div>

        {/* Environment Check */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Environment:</strong> Development | 
            <strong> Supabase URL:</strong> Configured ✓ | 
            <strong> API Endpoint:</strong> https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/create-proposal
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Test Form */}
          <Card>
            <CardHeader>
              <CardTitle>API Test Form</CardTitle>
              <CardDescription>
                Test the create-proposal endpoint with sample data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div>
                <Label>Client Psychology Profile</Label>
                <Tabs value={selectedPayload} onValueChange={(value) => handlePayloadChange(value as keyof typeof samplePayloads)}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="analytical">Analytical</TabsTrigger>
                    <TabsTrigger value="driver">Driver</TabsTrigger>
                    <TabsTrigger value="expressive">Expressive</TabsTrigger>
                    <TabsTrigger value="amiable">Amiable</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="payload">Request Payload</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(customPayload)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <Textarea
                  id="payload"
                  value={customPayload}
                  onChange={(e) => setCustomPayload(e.target.value)}
                  className="font-mono text-sm h-40"
                  placeholder="JSON payload..."
                />
              </div>

              <Button onClick={testAPI} disabled={loading} className="w-full">
                {loading ? (
                  'Testing...'
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Test API
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Response Display */}
          <Card>
            <CardHeader>
              <CardTitle>API Response</CardTitle>
              <CardDescription>
                Response from the proposal creation endpoint
              </CardDescription>
            </CardHeader>
            <CardContent>
              {response && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <Badge variant="default">Success</Badge>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>

                  {response.url && (
                    <div className="space-y-2">
                      <Label>Generated Proposal URL:</Label>
                      <div className="flex gap-2">
                        <Input value={response.url} readOnly />
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(response.url)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.open(response.url, '_blank')}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <Badge variant="destructive">Error</Badge>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {!response && !error && (
                <div className="text-center py-8 text-muted-foreground">
                  <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Click "Test API" to see the response</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* N8N Integration Examples */}
        <Card>
          <CardHeader>
            <CardTitle>N8N Integration Examples</CardTitle>
            <CardDescription>
              Sample configurations for different client types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="analytical">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="analytical">Analytical Client</TabsTrigger>
                <TabsTrigger value="driver">Driver Client</TabsTrigger>
                <TabsTrigger value="expressive">Expressive Client</TabsTrigger>
                <TabsTrigger value="amiable">Amiable Client</TabsTrigger>
              </TabsList>
              
              {Object.entries(samplePayloads).map(([type, payload]) => (
                <TabsContent key={type} value={type} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Client Profile:</h4>
                      <ul className="text-sm space-y-1">
                        <li><strong>Type:</strong> {payload.psychology_profile?.primary_type}</li>
                        <li><strong>Decision Style:</strong> {payload.psychology_profile?.decision_style}</li>
                        <li><strong>Risk Tolerance:</strong> {payload.psychology_profile?.risk_tolerance}</li>
                        <li><strong>Authority:</strong> {payload.psychology_profile?.decision_authority}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Proposal Approach:</h4>
                      <p className="text-sm text-muted-foreground">
                        {payload.proposal.executive_summary.substring(0, 200)}...
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => copyToClipboard(JSON.stringify(payload, null, 2))}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-60">
                      {JSON.stringify(payload, null, 2)}
                    </pre>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TestAPI;