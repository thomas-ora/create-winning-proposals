import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  TrendingDown, 
  Clock, 
  ArrowRight, 
  CheckCircle2,
  CheckCircle, 
  Trophy, 
  Shield, 
  Zap,
  Target,
  Calendar,
  DollarSign,
  BarChart3,
  Star,
  ChevronDown,
  AlertTriangle,
  Gauge,
  Users,
  Brain,
  TrendingUp,
  Timer,
  Check,
  X,
  Mail,
  Settings,
  Rocket,
  GitBranch,
  MessageCircle,
  Sparkles,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ROICalculator } from './ROICalculator';
import { AnimatedNumber } from './AnimatedNumber';
import { CountingNumber } from './CountingNumber';
import { ComparisonMatrix } from './ComparisonMatrix';
import { QuickWinsSection } from './QuickWinsSection';
import { RiskReversalSection } from './RiskReversalSection';
import { EnhancedROICalculator } from './EnhancedROICalculator';
import { SmartCTA } from './SmartCTA';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

interface PsychologyOptimizedProposalProps {
  proposal: {
    id: string;
    title: string;
    client_name: string;
    company_name: string;
    executive_summary?: string;
    financial_amount: number;
    financial_currency: string;
    valid_until: string;
    prepared_by?: string;
    logo_url?: string;
    brand_color?: string;
    pricing_tiers?: any;
    sections: any[];
    psychology_profile?: {
      decision_making_style?: string;
      risk_tolerance?: string;
      communication_preference?: string;
    };
    client?: {
      industry?: string;
      revenue_range?: string;
      employee_count?: number;
      growth_stage?: string;
    };
  };
  onCTAClick: (action: string, data?: any) => void;
}

export const PsychologyOptimizedProposal = ({ 
  proposal, 
  onCTAClick 
}: PsychologyOptimizedProposalProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [dailyLoss, setDailyLoss] = useState(0);
  const [scrollDepth, setScrollDepth] = useState(0);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [sectionsViewed, setSectionsViewed] = useState<string[]>([]);
  const [startTime] = useState(Date.now());
  const [showExitIntent, setShowExitIntent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef);
  const isMobile = useIsMobile();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const readingProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  // Psychology profile detection
  const psychologyProfile = proposal.psychology_profile || {};
  const decisionStyle = psychologyProfile.decision_making_style || 'balanced';
  const riskTolerance = psychologyProfile.risk_tolerance || 'medium';
  const communicationStyle = psychologyProfile.communication_preference || 'balanced';

  // Personalization utility functions
  const getPersonalization = (clientName: string) => {
    const firstName = clientName?.split(' ')[0] || '';
    return {
      firstName,
      hasName: Boolean(firstName),
      personalizedGreeting: firstName ? `${firstName}, ` : '',
      formalAddress: firstName ? `${firstName}` : 'valued client'
    };
  };

  const personalization = getPersonalization(proposal.client_name);

  // Simple 4-phase timeline
  const timelinePhases = [
    { 
      phase: 'Planning', 
      color: '#3b82f6', 
      description: 'Discovery and strategic planning to understand your unique needs' 
    },
    { 
      phase: 'Design', 
      color: '#8b5cf6', 
      description: 'Architecture and user experience design tailored for your business' 
    },
    { 
      phase: 'Development', 
      color: '#06b6d4', 
      description: 'Building and integrating your custom solution with precision' 
    },
    { 
      phase: 'Delivery', 
      color: '#22c55e', 
      description: 'Launch, training, and ensuring your success from day one' 
    }
  ];

  // Calculate daily loss from financial data
  useEffect(() => {
    // Simulate current inefficient process costs
    const annualLoss = proposal.financial_amount * 2.5; // Assume 2.5x current cost due to inefficiencies
    const dailyAmount = annualLoss / 365;
    setDailyLoss(dailyAmount);
  }, [proposal.financial_amount]);


  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitIntent && timeOnPage > 30) {
        setShowExitIntent(true);
        onCTAClick('exit_intent', { timeOnPage, sectionsViewed: sectionsViewed.length });
      }
    };

    if (!isMobile) {
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }
  }, [showExitIntent, timeOnPage, sectionsViewed.length, isMobile, onCTAClick]);

  // Track time on page and scroll depth
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnPage(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    const handleScroll = () => {
      const scrolled = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      setScrollDepth(Math.max(scrollDepth, scrolled));

      // Track section views
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        const sectionId = section.getAttribute('data-section');
        
        if (isInView && sectionId && !sectionsViewed.includes(sectionId)) {
          setSectionsViewed(prev => [...prev, sectionId]);
          onCTAClick('section_view', { 
            sectionId, 
            scrollDepth: scrolled, 
            timeOnPage: Math.floor((Date.now() - startTime) / 1000) 
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollDepth, sectionsViewed, startTime, onCTAClick, showExitIntent, timeOnPage, isMobile]);

  // Mock data for various charts
  const lossOverTimeData = [
    { month: 'Jan', loss: 12000, potential: 8000 },
    { month: 'Feb', loss: 13500, potential: 8200 },
    { month: 'Mar', loss: 14200, potential: 8500 },
    { month: 'Apr', loss: 15100, potential: 8800 },
    { month: 'May', loss: 16000, potential: 9000 },
    { month: 'Jun', loss: 16800, potential: 9200 }
  ];

  const competitorData = [
    { name: 'Current Process', efficiency: 45, color: '#ef4444' },
    { name: 'Industry Average', efficiency: 65, color: '#f59e0b' },
    { name: 'Our Solution', efficiency: 95, color: '#22c55e' }
  ];


  const sections = [
    { id: 'hero', title: 'Overview' },
    { id: 'problem', title: 'Current State' },
    { id: 'solution', title: 'Our Solution' },
    { id: 'roi', title: 'ROI Analysis' },
    { id: 'pricing', title: 'Investment Options' },
    { id: 'timeline', title: 'Implementation' },
    { id: 'guarantees', title: 'Risk Protection' },
    { id: 'cta', title: 'Next Steps' }
  ];

  const pricingTiers = [
    {
      name: 'Quick Win',
      subtitle: 'Essential Foundation',
      setup: 2000,
      revenueShare: '20% of monthly savings',
      valueProposition: 'Perfect for immediate cost reductions',
      estimatedROI: '3-5x',
      features: [
        { text: 'Core process automation', icon: Zap },
        { text: 'Monthly savings tracking', icon: BarChart3 },
        { text: '90-day implementation', icon: Calendar },
        { text: 'Email support', icon: Mail },
        { text: 'Basic reporting dashboard', icon: BarChart3 }
      ],
      recommended: false,
      tier: 'standard'
    },
    {
      name: 'Transformation',
      subtitle: 'Strategic Advancement',
      setup: 3500,
      revenueShare: '20% of monthly value',
      valueProposition: 'Complete operational overhaul',
      estimatedROI: '5-8x',
      features: [
        { text: 'Complete automation suite', icon: Settings },
        { text: 'Advanced analytics dashboard', icon: TrendingUp },
        { text: 'Priority support & success manager', icon: Users },
        { text: '60-day accelerated rollout', icon: Rocket },
        { text: 'Custom workflow optimization', icon: GitBranch }
      ],
      recommended: true,
      tier: 'recommended'
    },
    {
      name: 'Business Brain',
      subtitle: 'AI-Powered Intelligence',
      setup: 5000,
      revenueShare: '20% of all value created',
      valueProposition: 'Your business becomes an intelligent AI you can converse with',
      estimatedROI: '10-15x',
      description: 'Transform your business into a self-learning AI that you can literally have a conversation with.',
      conversationFeature: 'Ask your business questions. Get instant insights. Make decisions with AI-powered intelligence.',
      features: [
        { text: 'Conversational AI interface', icon: MessageCircle },
        { text: 'Self-learning systems', icon: Brain },
        { text: 'Predictive analytics', icon: Eye },
        { text: 'Real-time decision support', icon: Zap },
        { text: '30-day white-glove setup', icon: Sparkles }
      ],
      recommended: false,
      tier: 'premium'
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-proposal-bg">
      {/* Fixed Progress Bar - Clean and subtle */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-50"
        style={{ scaleX: scrollYProgress }}
        initial={{ scaleX: 0 }}
      />

      {/* Removed sticky navigation for cleaner header approach */}

      {/* Elegant Daily Loss Counter */}
      <motion.div 
        className="fixed top-20 right-4 z-40 text-center"
        style={{
          backgroundColor: '#F7F8FA',
          padding: '48px',
          borderRadius: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
          border: 'none'
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <TrendingDown className="w-6 h-6 text-red-500 mx-auto mb-3" />
        <div className="text-sm text-gray-500 mb-2">Daily Loss</div>
        <div 
          className="text-red-600"
          style={{ fontSize: '64px', fontWeight: '600', lineHeight: '1' }}
        >
          $<CountingNumber 
            target={dailyLoss} 
            duration={2000} 
            increment={Math.max(1, Math.floor(dailyLoss / 100))}
            startCounting={timeOnPage > 3}
          />
        </div>
      </motion.div>

      {/* Hero Section - Simplified */}
      <section 
        ref={heroRef}
        data-section="hero"
        style={{ backgroundColor: '#FAFBFC', paddingTop: '80px', paddingBottom: '80px' }}
        className="relative px-6"
      >
        <div className="alter-container text-center">
          {/* Valid Until Badge - Subtle positioning */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-3 py-1 bg-white rounded-full text-xs text-gray-500 border border-gray-200">
              <Clock className="w-3 h-3 mr-1" />
              Valid until {new Date(proposal.valid_until).toLocaleDateString()}
            </div>
            
            {/* Subtle urgency indicator */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="mt-2 inline-flex items-center px-2 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-medium"
            >
              ⚡ Limited availability - 3 spots remaining this quarter
            </motion.div>
          </motion.div>

          {/* Main Headline - Smaller and centered */}
          <motion.h1 
            className="font-bold text-text-heading mb-8 leading-tight mx-auto max-w-4xl"
            style={{ fontSize: '48px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {proposal.title}
          </motion.h1>

          {/* Company Partnership - Simplified */}
          <motion.div 
            className="flex items-center justify-center space-x-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {proposal.logo_url && (
              <img 
                src={proposal.logo_url} 
                alt="Company Logo" 
                className="h-8 object-contain"
              />
            )}
            <div className="text-gray-400 text-sm">×</div>
            <div className="text-gray-700 font-medium text-sm">ORASYSTEMS</div>
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            A comprehensive automation solution designed specifically for {personalization.formalAddress} at {proposal.company_name} 
            to eliminate inefficiencies and maximize productivity.
          </motion.p>

          {/* EXACT Alter Stats Cards */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="alter-stat-card text-center relative">
              <DollarSign className="w-6 h-6 text-primary absolute top-8 left-8" />
              <div className="text-sm text-text-muted" style={{ color: '#64748B', fontSize: '14px' }}>
                Potential Annual Savings
              </div>
              <div className="font-semibold mt-2" style={{ fontSize: '48px', fontWeight: '600' }}>
                $<CountingNumber 
                  target={proposal.financial_amount * 2} 
                  duration={3000}
                  startCounting={isHeroInView}
                  increment={Math.max(100, Math.floor(proposal.financial_amount * 2 / 200))}
                />
              </div>
            </div>

            <div className="alter-stat-card text-center relative">
              <Clock className="w-6 h-6 text-primary absolute top-8 left-8" />
              <div className="text-sm text-text-muted" style={{ color: '#64748B', fontSize: '14px' }}>
                Implementation Time
              </div>
              <div className="font-semibold mt-2" style={{ fontSize: '48px', fontWeight: '600' }}>
                4-6
              </div>
              <div className="text-sm" style={{ color: '#64748B', fontSize: '14px' }}>weeks</div>
            </div>

            <div className="alter-stat-card text-center relative">
              <TrendingUp className="w-6 h-6 text-primary absolute top-8 left-8" />
              <div className="text-sm text-text-muted" style={{ color: '#64748B', fontSize: '14px' }}>
                ROI Guarantee
              </div>
              <div className="font-semibold mt-2" style={{ fontSize: '48px', fontWeight: '600' }}>
                300%+
              </div>
            </div>
          </motion.div>

          {/* Clean CTA */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <button 
              className="alter-button-primary inline-flex items-center"
              onClick={() => onCTAClick('view_proposal', { section: 'hero' })}
            >
              View Full Proposal
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-3"
              onClick={() => onCTAClick('schedule_call', { section: 'hero' })}
            >
              Schedule Call
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Executive Summary - Alter Style */}
      <section data-section="executive-summary" className="proposal-section">
        <div className="alter-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text-heading mb-6">The Hidden Cost of Inaction</h2>
            <p className="text-xl text-text-body max-w-3xl mx-auto leading-relaxed">
              {personalization.personalizedGreeting}imagine walking into your office knowing everything runs perfectly. 
              Every day you delay this transformation, you're losing money. Here's what staying with your current process is really costing you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="alter-stat-card text-center relative"
            >
              <TrendingDown className="w-6 h-6 text-red-500 absolute top-8 left-8" />
              <div className="text-sm" style={{ color: '#64748B', fontSize: '14px' }}>Daily Revenue Loss</div>
              <div className="font-semibold text-red-600 mt-2" style={{ fontSize: '48px', fontWeight: '600' }}>
                $<CountingNumber 
                  target={dailyLoss} 
                  duration={2000}
                  increment={Math.max(1, Math.floor(dailyLoss / 50))}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="alter-stat-card text-center relative"
            >
              <Clock className="w-6 h-6 text-orange-500 absolute top-8 left-8" />
              <div className="text-sm" style={{ color: '#64748B', fontSize: '14px' }}>Time Wasted Weekly</div>
              <div className="font-semibold text-orange-600 mt-2" style={{ fontSize: '48px', fontWeight: '600' }}>
                <CountingNumber target={32} duration={1500} increment={1} />
              </div>
              <div className="text-sm" style={{ color: '#64748B', fontSize: '14px' }}>hours</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="alter-stat-card text-center relative"
            >
              <AlertTriangle className="w-6 h-6 text-yellow-500 absolute top-8 left-8" />
              <div className="text-sm" style={{ color: '#64748B', fontSize: '14px' }}>Error Rate</div>
              <div className="font-semibold text-yellow-600 mt-2" style={{ fontSize: '48px', fontWeight: '600' }}>
                <CountingNumber target={15} duration={1000} increment={1} />%
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="proposal-card p-10 text-center border-red-200"
          >
            <h3 className="text-2xl font-bold mb-4 text-red-600">
              Cost of Waiting Just One More Month
            </h3>
            <div className="text-5xl font-bold text-red-600 mb-4">
              $<CountingNumber 
                target={dailyLoss * 30} 
                duration={3000}
                increment={Math.max(10, Math.floor(dailyLoss * 30 / 100))}
              />
            </div>
            <p className="text-text-body max-w-2xl mx-auto">
              That's money you'll never get back. Every day you wait is revenue walking out the door.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Redesigned Current State Analysis */}
      <section data-section="current-state" className="proposal-section bg-gradient-to-br from-slate-50/50 to-blue-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
        <div className="alter-container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-heading">
              Your Current Reality vs What's Possible
            </h2>
            <p className="text-xl text-text-body max-w-3xl mx-auto leading-relaxed">
              See exactly where your business stands today and the transformation waiting on the other side.
            </p>
          </motion.div>

          <div className="space-y-16">
            {/* 1. Three Summary Cards First */}
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-red-500/50 bg-red-500/5 hover:scale-105 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                      <span className="text-sm font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full">CRITICAL</span>
                    </div>
                    <div className="text-4xl font-bold text-red-600 mb-3">
                      <CountingNumber target={47} duration={2000} increment={2} />
                    </div>
                    <div className="text-lg font-medium text-red-700 dark:text-red-300">Manual Tasks Daily</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-orange-500/50 bg-orange-500/5 hover:scale-105 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Clock className="w-6 h-6 text-orange-500" />
                      <span className="text-sm font-bold text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">HIGH IMPACT</span>
                    </div>
                    <div className="text-4xl font-bold text-orange-600 mb-3">
                      <CountingNumber target={32} duration={2000} increment={1} />
                    </div>
                    <div className="text-lg font-medium text-orange-700 dark:text-orange-300">Hours Lost Weekly</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-green-500/50 bg-green-500/5 hover:scale-105 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Target className="w-6 h-6 text-green-500" />
                      <span className="text-sm font-bold text-green-500 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">POTENTIAL</span>
                    </div>
                    <div className="text-4xl font-bold text-green-600 mb-3">
                      <CountingNumber target={94} duration={2000} increment={1} />%
                    </div>
                    <div className="text-lg font-medium text-green-700 dark:text-green-300">Target Efficiency</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* 2. Standalone Efficiency Comparison Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-10">
                <h3 className="text-3xl font-bold mb-10 text-center">Efficiency Comparison</h3>
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold">Your Current Efficiency</span>
                      <span className="text-3xl font-bold text-red-500">34%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                      <div className="bg-red-500 h-6 rounded-full transition-all duration-1000" style={{ width: '34%' }}></div>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400">Typical for businesses without automation</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold">Average Business Efficiency</span>
                      <span className="text-3xl font-bold text-orange-500">50%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                      <div className="bg-orange-500 h-6 rounded-full transition-all duration-1000 delay-300" style={{ width: '50%' }}></div>
                    </div>
                    <p className="text-sm text-orange-600 dark:text-orange-400">Industry standard • Most SMBs operate here</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold">Your Potential with OraSystems</span>
                      <span className="text-3xl font-bold text-green-500">90%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                      <div className="bg-green-500 h-6 rounded-full transition-all duration-1000 delay-600" style={{ width: '90%' }}></div>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400">Where our clients typically reach • Based on real results</p>
                  </div>
                </div>
                
                <div className="mt-10 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-xl text-center">
                  <p className="text-2xl">
                    <span className="font-bold text-green-600 text-3xl">56% efficiency gain</span>
                    <span className="text-gray-600 dark:text-gray-400"> = </span>
                    <span className="font-bold text-blue-600 text-3xl">$124,800 annual savings</span>
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* 3. Before/After Workflow Comparison - Enhanced */}
            <div className="grid lg:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Card className="border-red-500/30 h-full">
                  <CardHeader className="pb-6 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
                      <X className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-red-600 text-3xl mb-2">Current Workflow</CardTitle>
                    <p className="text-red-500 text-lg">Manual, time-consuming, error-prone</p>
                  </CardHeader>
                  <CardContent className="space-y-8 px-8 pb-8">
                    <div className="flex items-start gap-6 p-6 rounded-xl bg-red-50 dark:bg-red-950/20">
                      <Clock className="w-7 h-7 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-red-800 dark:text-red-200 text-lg">Manual Data Entry</div>
                        <div className="text-red-600 dark:text-red-400 mt-1">Hours of work, prone to errors</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-6 p-6 rounded-xl bg-red-50 dark:bg-red-950/20">
                      <Clock className="w-7 h-7 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-red-800 dark:text-red-200 text-lg">Email Follow-ups</div>
                        <div className="text-red-600 dark:text-red-400 mt-1">Often forgotten, inconsistent timing</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-6 p-6 rounded-xl bg-red-50 dark:bg-red-950/20">
                      <TrendingDown className="w-7 h-7 text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-bold text-red-800 dark:text-red-200 text-lg">Business Intelligence</div>
                        <div className="text-red-600 dark:text-red-400 mt-1">Limited insights, reactive decisions</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <Card className="border-green-500/50 h-full bg-gradient-to-br from-green-50/50 to-primary/5 dark:from-green-950/20 dark:to-primary-900/20 relative overflow-hidden shadow-xl">
                  {/* Enhanced glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-primary/10 opacity-50" />
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl" />
                  
                  <div className="relative z-10">
                    <CardHeader className="pb-6 text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-primary/20 dark:from-green-900/30 dark:to-primary-900/30 rounded-full mb-6">
                        <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                      </div>
                      <CardTitle className="text-green-600 text-3xl mb-2">With OraSystems</CardTitle>
                      <p className="text-green-500 text-lg font-semibold">Intelligence-Driven Operations</p>
                      <div className="text-primary font-bold text-sm mt-2 bg-primary/10 px-4 py-2 rounded-full">
                        🚀 TIER 3: STRATEGIC ADVANTAGE
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-8 px-8 pb-8">
                      <div className="flex items-start gap-6 p-6 rounded-xl bg-gradient-to-r from-green-50 to-primary/10 dark:from-green-950/20 dark:to-primary-950/20 border border-green-200/50 dark:border-green-800/50">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="font-bold text-green-800 dark:text-green-200 text-lg">Automated Data Processing</div>
                          <div className="text-green-600 dark:text-green-400 mt-1">Instant, 99.9% accurate with AI validation</div>
                          <div className="text-primary font-bold text-sm mt-2">⚡ 47x faster than manual entry</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-6 p-6 rounded-xl bg-gradient-to-r from-green-50 to-primary/10 dark:from-green-950/20 dark:to-primary-950/20 border border-green-200/50 dark:border-green-800/50">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <div className="font-bold text-green-800 dark:text-green-200 text-lg">Intelligent Follow-ups</div>
                          <div className="text-green-600 dark:text-green-400 mt-1">AI-powered timing, personalized messaging</div>
                          <div className="text-primary font-bold text-sm mt-2">📈 92% higher response rates</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-6 p-6 rounded-xl bg-gradient-to-r from-green-50 to-primary/10 dark:from-green-950/20 dark:to-primary-950/20 border border-green-200/50 dark:border-green-800/50">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-bold text-green-800 dark:text-green-200 text-lg">Predictive Analytics</div>
                          <div className="text-green-600 dark:text-green-400 mt-1">Real-time insights, proactive strategy recommendations</div>
                          <div className="text-primary font-bold text-sm mt-2">🎯 Predict opportunities 3 months ahead</div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* 4. Industry Reality Check */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800/30">
                <CardContent className="p-10">
                  <h3 className="text-3xl font-bold mb-8 text-blue-800 dark:text-blue-200 text-center">Industry Reality Check</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-3">73%</div>
                      <div className="text-blue-700 dark:text-blue-300">of businesses still use manual processes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-3">$47k</div>
                      <div className="text-blue-700 dark:text-blue-300">average annual cost per employee</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-3">15hrs</div>
                      <div className="text-blue-700 dark:text-blue-300">wasted per week on repetitive tasks</div>
                    </div>
                  </div>
                  <div className="mt-8 text-center text-sm text-blue-600 dark:text-blue-400">
                    Source: 2025 Business Automation Industry Report
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="proposal-section">
        <div className="alter-container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Calculate Your ROI</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {personalization.personalizedGreeting}see exactly how much you'll save and how quickly you'll see returns with our interactive calculator.
            </p>
          </motion.div>

          <ROICalculator 
            onCalculatorUse={(data) => onCTAClick('calculator_use', data)} 
            standalone 
            clientData={{
              financial_amount: proposal.financial_amount,
              industry: proposal.client?.industry || 'Business Services',
              revenue_range: proposal.client?.revenue_range || '$1M-5M',
              employee_count: proposal.client?.employee_count || 50,
              growth_stage: proposal.client?.growth_stage || 'Growth'
            }}
          />
        </div>
      </section>

      {/* Psychology-Adapted Content */}
      {decisionStyle === 'analytical' && (
        <section data-section="detailed-analysis" className="proposal-section">
          <div className="alter-container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Brain className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-4xl font-bold mb-6">Detailed Performance Analysis</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive data breakdown for informed decision-making.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Performance Metrics Comparison</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Processing Speed</span>
                    <span className="font-bold">15x faster</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Accuracy Rate</span>
                    <span className="font-bold">99.2% vs 85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cost per Transaction</span>
                    <span className="font-bold">$2 vs $45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Scalability Factor</span>
                    <span className="font-bold">Unlimited vs Linear</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Risk Assessment Matrix</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Implementation Risk</span>
                    <Badge variant="secondary">Low</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Technology Risk</span>
                    <Badge variant="secondary">Minimal</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Financial Risk</span>
                    <Badge className="bg-green-100 text-green-800">Protected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Operational Risk</span>
                    <Badge variant="secondary">Managed</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {decisionStyle === 'driver' && (
        <section data-section="competitive-advantage" className="proposal-section bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
          <div className="alter-container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Trophy className="w-16 h-16 mx-auto mb-4 text-orange-600" />
              <h2 className="text-4xl font-bold mb-6">Dominate Your Competition</h2>
              <p className="text-xl text-orange-700 dark:text-orange-300 max-w-2xl mx-auto">
                Get ahead of competitors with automation they don't have.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 border-orange-200 dark:border-orange-800">
                <TrendingUp className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">First-Mover Advantage</h3>
                <p className="text-muted-foreground">
                  Be the first in your market to implement this level of automation.
                </p>
              </Card>

              <Card className="p-6 border-orange-200 dark:border-orange-800">
                <Zap className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Speed to Market</h3>
                <p className="text-muted-foreground">
                  Launch new initiatives 10x faster than competitors.
                </p>
              </Card>

              <Card className="p-6 border-orange-200 dark:border-orange-800">
                <Target className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Market Leadership</h3>
                <p className="text-muted-foreground">
                  Position yourself as the innovation leader in your industry.
                </p>
              </Card>
            </div>
          </div>
        </section>
      )}

      {decisionStyle === 'expressive' && (
        <section data-section="vision" className="proposal-section bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <div className="alter-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Star className="w-16 h-16 mx-auto mb-4 text-purple-600" />
              <h2 className="text-4xl font-bold mb-6">Your Future Vision Realized</h2>
              <blockquote className="text-2xl italic text-purple-700 dark:text-purple-300 mb-8 max-w-3xl mx-auto">
                "Imagine walking into your office knowing that everything runs perfectly, 
                automatically, and profitably. Your team is focused on innovation, not 
                tedious tasks. Your business is a model for the industry."
              </blockquote>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                This isn't just about software. It's about transforming your entire organization 
                into a beacon of efficiency and innovation.
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {decisionStyle === 'amiable' && (
        <section data-section="support" className="proposal-section bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <div className="alter-container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Users className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-4xl font-bold mb-6">You're Never Alone</h2>
              <p className="text-xl text-blue-700 dark:text-blue-300 max-w-2xl mx-auto">
                Our gradual, supported approach ensures everyone on your team feels comfortable.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Gradual Implementation Plan</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Week 1-2: Team training and preparation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Week 3-4: Pilot program with select processes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Week 5-8: Gradual rollout with constant support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Week 9+: Full implementation with ongoing care</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Comprehensive Support</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>Dedicated success manager</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>24/7 technical support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>Team training and coaching</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span>Monthly check-ins and optimization</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Risk Reversal Section */}
      <RiskReversalSection />

      {/* Pricing Section - Streamlined Hybrid Revenue Share */}
      <section data-section="pricing" className="proposal-section bg-proposal-bg">
        <div className="alter-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text-heading mb-6">Investment Scaled to Your Value</h2>
            <p className="text-xl text-text-body max-w-3xl mx-auto leading-relaxed">
              Your investment, {personalization.formalAddress}, is proportional to the value we create together. 
              {personalization.hasName ? 'We believe in your success, which is why our model aligns with your results.' : 'The more you save, the more we both benefit.'}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative proposal-card group hover:shadow-hover transition-all duration-300 ${
                  tier.tier === 'premium' ? 'lg:scale-105 lg:-mt-4' : ''
                } ${tier.recommended ? 'border-2 border-primary' : ''} ${
                  tier.tier === 'premium' ? 'border-2 border-purple-300/50 overflow-hidden' : ''
                }`}
              >
                {/* Business Brain Enhanced Animated Background */}
                {tier.tier === 'premium' && (
                  <div className="absolute inset-0 z-0 overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-purple-600/8 to-indigo-600/8 animate-[pulse_6s_ease-in-out_infinite]"></div>
                    <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full animate-[pulse_4s_ease-in-out_infinite] blur-xl"></div>
                    <div className="absolute bottom-8 left-8 w-24 h-24 bg-gradient-to-br from-purple-400/12 to-indigo-400/12 rounded-full animate-[pulse_5s_ease-in-out_infinite] blur-xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-blue-300/8 to-purple-300/8 rounded-full animate-[pulse_7s_ease-in-out_infinite] blur-2xl"></div>
                  </div>
                )}

                {/* Tier Badges */}
                {tier.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      RECOMMENDED
                    </div>
                  </div>
                )}

                {tier.tier === 'premium' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-xl">
                      PREMIUM
                    </div>
                  </div>
                )}
                
                <div className="relative z-10 p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-text-heading mb-2">{tier.name}</h3>
                    <p className="text-text-muted text-sm mb-4">{tier.subtitle}</p>
                    <p className="text-text-body font-medium mb-6">{tier.valueProposition}</p>
                    
                    {/* Pricing Display */}
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-text-heading mb-2">
                        ${tier.setup.toLocaleString()}
                      </div>
                      <div className="text-sm text-text-muted mb-2">
                        Setup Investment
                      </div>
                      <div className="text-lg font-semibold text-primary mb-2">
                        + {tier.revenueShare}
                      </div>
                      <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        🎯 {tier.estimatedROI} Expected ROI
                      </div>
                    </div>

                    {/* Business Brain Special Description */}
                    {tier.tier === 'premium' && (
                      <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border border-purple-200/30 dark:border-purple-700/30">
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            AI-Powered Intelligence
                          </h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            Experience natural conversations with your data. Ask questions, get insights, and make decisions faster than ever before.
                          </p>
                        </div>
                        
                        <div className="mb-4 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-blue-200/30">
                          <p className="text-xs text-blue-800 dark:text-blue-200 font-medium italic">
                            "Show me this quarter's performance vs last year"
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            Get instant analytics with conversational AI
                          </p>
                        </div>
                        
                        {/* AI Demo Button */}
                        <motion.button
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onCTAClick('demo_ai', { tier: 'Business Brain' })}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <span>🧠</span>
                            <span>Experience AI Demo</span>
                          </span>
                        </motion.button>
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <feature.icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-primary" />
                        <span className="text-sm text-text-body leading-relaxed">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      tier.recommended 
                        ? 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl' 
                        : tier.tier === 'premium'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                        : 'border-2 border-border text-text-heading hover:border-primary hover:bg-primary/5 hover:shadow-md'
                    }`}
                    onClick={() => onCTAClick('select_tier', { tier: tier.name, setup: tier.setup, revenueShare: tier.revenueShare })}
                  >
                    {tier.tier === 'premium' ? 'Activate Business Brain' : `Choose ${tier.name}`}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Value Model Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="proposal-card p-8 border-primary/20 bg-primary/5 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold mb-4 text-text-heading">
                💡 Why Revenue Share Works
              </h3>
              <p className="text-text-body mb-6">
                Our success is directly tied to yours. We only profit when you do.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <span className="font-medium">No Results, No Ongoing Fees</span>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <span className="font-medium">Aligned Success Incentives</span>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <span className="font-medium">Proven ROI Track Record</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="proposal-section">
        <div className="alter-container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Your Personalized Roadmap to Success</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {personalization.personalizedGreeting}here's exactly how we'll transform your business operations step by step.
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Main Timeline Phases */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-border" />
              
              {timelinePhases.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className={`flex items-center mb-4 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                          style={{ backgroundColor: phase.color }}
                        >
                          {index + 1}
                        </div>
                        <div className={`${index % 2 === 0 ? 'ml-4' : 'mr-4'}`}>
                          <h3 className="text-xl font-bold">{phase.phase}</h3>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{phase.description}</p>
                    </Card>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                </motion.div>
              ))}
            </div>

            {/* Extended Timeline to Future */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="flex justify-center mt-8"
            >
              <div className="relative">
                {/* Extended timeline line */}
                <div className="w-0.5 h-32 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent mx-auto" />
                
                {/* Time dots along the line */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary/30 rounded-full" />
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary/20 rounded-full" />
                <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary/10 rounded-full" />
              </div>
            </motion.div>

            {/* Future Potential Card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              whileInView={{ 
                opacity: 0.9, 
                y: 0, 
                scale: 1,
              }}
              viewport={{ once: true }}
              transition={{ 
                duration: 1.2, 
                delay: 0.8,
                ease: "easeOut"
              }}
              className="flex justify-center mt-8"
            >
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                {/* Floating Question Marks */}
                <motion.div
                  animate={{ 
                    y: [0, -12, 0],
                    x: [0, 8, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0
                  }}
                  className="absolute -top-4 -left-6 text-lg text-purple-400/30"
                >
                  ?
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    x: [0, -6, 0],
                    rotate: [0, -8, 8, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute -top-2 -right-8 text-sm text-blue-400/25"
                >
                  ?
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    x: [0, 4, 0],
                    rotate: [0, 15, -5, 0]
                  }}
                  transition={{ 
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                  className="absolute -bottom-3 -left-4 text-xs text-purple-300/20"
                >
                  ?
                </motion.div>

                {/* Floating glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-purple-400/20 rounded-full blur-xl scale-150" />
                
                {/* Main card */}
                <Card className="relative p-4 bg-gradient-to-br from-purple-100/30 via-blue-50/40 to-purple-100/30 border-purple-200/20 backdrop-blur-sm shadow-lg w-40 text-center">
                  <h3 className="text-sm font-medium bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Future Potential
                  </h3>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Guarantees and Risk Reversal */}
      <section className="proposal-section bg-muted/20">
        <div className="alter-container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Your Success is Guaranteed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're so confident in our solution that we back it with ironclad guarantees. Your investment is protected.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 text-center bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                <Shield className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">ROI Guarantee</h3>
                <p className="text-muted-foreground mb-4">
                  If you don't see a 300% ROI within 12 months, we'll refund the difference.
                </p>
                <div className="text-2xl font-bold text-green-600">300%+ ROI</div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 text-center bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                <Trophy className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">Performance Promise</h3>
                <p className="text-muted-foreground mb-4">
                  We guarantee 60%+ efficiency improvement or your money back.
                </p>
                <div className="text-2xl font-bold text-blue-600">60% Better</div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-8 text-center bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
                <Zap className="w-16 h-16 text-purple-500 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">Fast Implementation</h3>
                <p className="text-muted-foreground mb-4">
                  Results in 30 days or we extend support at no additional cost.
                </p>
                <div className="text-2xl font-bold text-purple-600">30 Days</div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Simplified Closing Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="alter-container max-w-4xl mx-auto text-center">
          
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Ready to Transform Your Business{personalization.hasName ? `, ${personalization.firstName}` : ''}?
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {personalization.personalizedGreeting}your success story starts with a single decision. 
              Stop losing ${Math.round(dailyLoss).toLocaleString()} every day and unlock your true potential.
            </p>
          </motion.div>

          {/* Three Simple Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-12 mb-16"
          >
            <div className="space-y-3">
              <Zap className="w-8 h-8 text-primary mx-auto" />
              <h3 className="text-lg font-semibold">60% More Efficient</h3>
            </div>
            
            <div className="space-y-3">
              <TrendingUp className="w-8 h-8 text-primary mx-auto" />
              <h3 className="text-lg font-semibold">Unlimited Growth</h3>
            </div>
            
            <div className="space-y-3">
              <Target className="w-8 h-8 text-primary mx-auto" />
              <h3 className="text-lg font-semibold">Total Focus</h3>
            </div>
          </motion.div>

          {/* Call-to-Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
              <Button 
                size="lg" 
                className="flex-1 text-lg px-8 py-4 font-semibold"
                onClick={() => onCTAClick('accept_proposal', { section: 'closing', sentiment: 'positive' })}
              >
                Accept Proposal & Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="flex-1 text-lg px-8 py-4"
                onClick={() => onCTAClick('schedule_call', { section: 'closing', sentiment: 'positive' })}
              >
                Have Questions? Let's Talk
              </Button>
            </div>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Setup begins within 48 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>See first results in 7 days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>No lock-in contracts</span>
              </div>
            </div>
          </motion.div>

          {/* Simple Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="border-t border-border pt-8"
          >
            <p className="text-sm text-muted-foreground">
              Powered by <span className="font-medium text-primary">OraSystems</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Exit Intent Modal */}
      <AnimatePresence>
        {showExitIntent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowExitIntent(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowExitIntent(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2">Wait, {proposal.client_name}!</h3>
                <p className="text-gray-600 mb-6">
                  You're about to miss out on ${(proposal.financial_amount * 2).toLocaleString()} in potential savings.
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      onCTAClick('exit_intent_accept', { urgency: 'high' });
                      setShowExitIntent(false);
                    }}
                    className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors touch-manipulation"
                  >
                    Yes, I Want This Solution
                  </button>
                  
                  <button
                    onClick={() => {
                      onCTAClick('exit_intent_contact', { urgency: 'high' });
                      setShowExitIntent(false);
                    }}
                    className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors touch-manipulation"
                  >
                    Schedule a Quick Call
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};