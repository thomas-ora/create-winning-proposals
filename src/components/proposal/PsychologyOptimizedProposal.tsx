import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  TrendingDown, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
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
  Timer
} from 'lucide-react';
import { Card } from '@/components/ui/card';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef);
  
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

  // Calculate daily loss from financial data
  useEffect(() => {
    // Simulate current inefficient process costs
    const annualLoss = proposal.financial_amount * 2.5; // Assume 2.5x current cost due to inefficiencies
    const dailyAmount = annualLoss / 365;
    setDailyLoss(dailyAmount);
  }, [proposal.financial_amount]);

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
  }, [scrollDepth, sectionsViewed, startTime, onCTAClick]);

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

  const timelineData = [
    { phase: 'Planning', duration: 2, start: 0, color: '#3b82f6' },
    { phase: 'Implementation', duration: 8, start: 2, color: '#8b5cf6' },
    { phase: 'Testing', duration: 2, start: 10, color: '#f59e0b' },
    { phase: 'Launch', duration: 1, start: 12, color: '#22c55e' }
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
      name: 'Efficiency',
      subtitle: 'Start Smart',
      percentage: '60%',
      price: Math.round(proposal.financial_amount * 0.6),
      originalPrice: Math.round(proposal.financial_amount * 0.8),
      savings: Math.round(proposal.financial_amount * 0.2),
      payback: '8 months',
      features: [
        'Core automation workflows',
        'Basic reporting dashboard',
        'Email support',
        '90-day implementation',
        'ROI guarantee'
      ],
      recommended: false
    },
    {
      name: 'Growth',
      subtitle: 'Most Popular',
      percentage: '100%',
      price: proposal.financial_amount,
      originalPrice: Math.round(proposal.financial_amount * 1.3),
      savings: Math.round(proposal.financial_amount * 0.3),
      payback: '6 months',
      features: [
        'Complete automation suite',
        'Advanced analytics',
        'Priority support',
        '60-day implementation',
        'ROI guarantee + bonus',
        'Training included',
        'Performance monitoring'
      ],
      recommended: true
    },
    {
      name: 'Transformation',
      subtitle: 'Maximum Impact',
      percentage: '150%',
      price: Math.round(proposal.financial_amount * 1.5),
      originalPrice: Math.round(proposal.financial_amount * 2),
      savings: Math.round(proposal.financial_amount * 0.5),
      payback: '4 months',
      features: [
        'Enterprise automation platform',
        'AI-powered optimization',
        'Dedicated success manager',
        '30-day implementation',
        'ROI guarantee + 2x bonus',
        'Comprehensive training',
        'White-glove onboarding',
        'Custom integrations'
      ],
      recommended: false
    }
  ];

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen"
      style={{ 
        background: '#FFFFFF',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 20px'
      }}
    >
      {/* Fixed Progress Bar - Clean and subtle */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-50"
        style={{ scaleX: scrollYProgress }}
        initial={{ scaleX: 0 }}
      />

      {/* Removed sticky navigation for cleaner header approach */}

      {/* Elegant Daily Loss Counter */}
      <motion.div 
        className="fixed top-4 right-4 z-40 text-center"
        style={{
          background: '#FAFBFC',
          border: 'none',
          boxShadow: 'none',
          padding: '60px',
          borderRadius: '32px'
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <TrendingDown className="w-6 h-6 text-red-500 mx-auto mb-3" />
        <div className="text-xs text-gray-400 mb-2">Daily Loss</div>
        <div 
          className="text-red-600"
          style={{ 
            fontSize: '80px', 
            fontWeight: '700', 
            letterSpacing: '-0.03em',
            fontFeatureSettings: '"tnum"'
          }}
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
        style={{ 
          background: '#FAFBFC',
          border: 'none',
          boxShadow: 'none',
          padding: '60px',
          borderRadius: '32px',
          marginTop: '200px',
          marginBottom: '120px'
        }}
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
          </motion.div>

          {/* Main Headline - Smaller and centered */}
          <motion.h1 
            className="text-text-heading mb-8 mx-auto max-w-4xl"
            style={{ 
              fontSize: '42px',
              fontWeight: '600',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}
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
            A comprehensive automation solution designed specifically for {proposal.company_name} 
            to eliminate inefficiencies and maximize productivity.
          </motion.p>

          {/* EXACT Alter Stats Cards */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div 
              className="text-center relative"
              style={{
                background: '#FAFBFC',
                border: 'none',
                boxShadow: 'none',
                padding: '60px',
                borderRadius: '32px'
              }}
            >
              <DollarSign className="w-6 h-6 text-primary absolute top-8 left-8" />
              <div className="text-xs" style={{ color: '#9CA3AF' }}>
                Potential Annual Savings
              </div>
              <div className="mt-2" style={{ 
                fontSize: '80px', 
                fontWeight: '700',
                letterSpacing: '-0.03em',
                fontFeatureSettings: '"tnum"'
              }}>
                $<CountingNumber 
                  target={proposal.financial_amount * 2} 
                  duration={3000}
                  startCounting={isHeroInView}
                  increment={Math.max(100, Math.floor(proposal.financial_amount * 2 / 200))}
                />
              </div>
            </div>

            <div 
              className="text-center relative"
              style={{
                background: '#FAFBFC',
                border: 'none',
                boxShadow: 'none',
                padding: '60px',
                borderRadius: '32px'
              }}
            >
              <Clock className="w-6 h-6 text-primary absolute top-8 left-8" />
              <div className="text-xs" style={{ color: '#9CA3AF' }}>
                Implementation Time
              </div>
              <div className="mt-2" style={{ 
                fontSize: '80px', 
                fontWeight: '700',
                letterSpacing: '-0.03em',
                fontFeatureSettings: '"tnum"'
              }}>
                6-12
              </div>
              <div className="text-xs" style={{ color: '#9CA3AF' }}>weeks</div>
            </div>

            <div 
              className="text-center relative"
              style={{
                background: '#FAFBFC',
                border: 'none',
                boxShadow: 'none',
                padding: '60px',
                borderRadius: '32px'
              }}
            >
              <TrendingUp className="w-6 h-6 text-primary absolute top-8 left-8" />
              <div className="text-xs" style={{ color: '#9CA3AF' }}>
                ROI Guarantee
              </div>
              <div className="mt-2" style={{ 
                fontSize: '80px', 
                fontWeight: '700',
                letterSpacing: '-0.03em',
                fontFeatureSettings: '"tnum"'
              }}>
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
            className="mb-16"
          >
            <h2 style={{ fontSize: '42px', fontWeight: '600', letterSpacing: '-0.02em', lineHeight: '1.2', marginBottom: '24px' }} className="text-text-heading">The Hidden Cost of Inaction</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#64748B' }} className="max-w-3xl leading-relaxed">
              Every day you delay, you're losing money. Here's what staying with your current process is really costing you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center relative"
              style={{
                background: '#FAFBFC',
                border: 'none',
                boxShadow: 'none',
                padding: '60px',
                borderRadius: '32px'
              }}
            >
              <TrendingDown className="w-6 h-6 text-red-500 absolute top-8 left-8" />
              <div className="text-sm" style={{ color: '#64748B', fontSize: '14px' }}>Daily Revenue Loss</div>
              <div className="text-red-600 mt-2" style={{ fontSize: '80px', fontWeight: '700', letterSpacing: '-0.03em' }}>
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
              className="text-center relative"
              style={{
                background: '#FAFBFC',
                border: 'none',
                boxShadow: 'none',
                padding: '60px',
                borderRadius: '32px'
              }}
            >
              <Clock className="w-6 h-6 text-orange-500 absolute top-8 left-8" />
              <div className="text-sm" style={{ color: '#64748B', fontSize: '14px' }}>Time Wasted Weekly</div>
              <div className="text-orange-600 mt-2" style={{ fontSize: '80px', fontWeight: '700', letterSpacing: '-0.03em' }}>
                <CountingNumber target={32} duration={1500} increment={1} />
              </div>
              <div className="text-sm" style={{ color: '#64748B', fontSize: '14px' }}>hours</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center relative"
              style={{
                background: '#FAFBFC',
                border: 'none',
                boxShadow: 'none',
                padding: '60px',
                borderRadius: '32px'
              }}
            >
              <AlertTriangle className="w-6 h-6 text-yellow-500 absolute top-8 left-8" />
              <div className="text-sm" style={{ color: '#64748B', fontSize: '14px' }}>Error Rate</div>
              <div className="text-yellow-600 mt-2" style={{ fontSize: '80px', fontWeight: '700', letterSpacing: '-0.03em' }}>
                <CountingNumber target={15} duration={1000} increment={1} />%
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
            style={{
              background: '#FAFBFC',
              border: 'none',
              boxShadow: 'none',
              padding: '60px',
              borderRadius: '32px'
            }}
          >
            <h3 style={{ fontSize: '42px', fontWeight: '600', letterSpacing: '-0.02em', lineHeight: '1.2', marginBottom: '24px' }} className="text-red-600">
              Cost of Waiting Just One More Month
            </h3>
            <div className="text-red-600 mb-4" style={{ fontSize: '80px', fontWeight: '700', letterSpacing: '-0.03em' }}>
              $<CountingNumber 
                target={dailyLoss * 30} 
                duration={3000}
                increment={Math.max(10, Math.floor(dailyLoss * 30 / 100))}
              />
            </div>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#64748B' }} className="max-w-2xl mx-auto">
              That's money you'll never get back. Every day you wait is revenue walking out the door.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Current State Analysis */}
      <section data-section="current-state" className="proposal-section">
        <div className="alter-container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 style={{ fontSize: '42px', fontWeight: '600', letterSpacing: '-0.02em', lineHeight: '1.2', marginBottom: '24px' }} className="text-text-heading">Where You Stand Today</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#64748B' }} className="max-w-2xl">
              A detailed analysis of your current operational efficiency compared to industry standards.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card 
                className="text-left"
                style={{
                  background: '#FAFBFC',
                  border: 'none',
                  boxShadow: 'none',
                  padding: '60px',
                  borderRadius: '32px'
                }}
              >
                <h3 style={{ fontSize: '42px', fontWeight: '600', letterSpacing: '-0.02em', lineHeight: '1.2', marginBottom: '24px' }} className="text-text-heading">Efficiency Comparison</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={competitorData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="efficiency" radius={[4, 4, 0, 0]}>
                        {competitorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: 'none' }}>
                <h3 style={{ fontSize: '42px', fontWeight: '600', letterSpacing: '-0.02em', lineHeight: '1.2', marginBottom: '24px' }} className="text-text-heading">Loss Trajectory</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lossOverTimeData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="loss" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        name="Current Loss"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="potential" 
                        stroke="#22c55e" 
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        name="With Our Solution"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
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
            className="mb-16"
          >
            <h2 style={{ fontSize: '42px', fontWeight: '600', letterSpacing: '-0.02em', lineHeight: '1.2', marginBottom: '24px' }} className="text-text-heading">Calculate Your ROI</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#64748B' }} className="max-w-2xl">
              See exactly how much you'll save and how quickly you'll see returns with our interactive calculator.
            </p>
          </motion.div>

          <ROICalculator onCalculatorUse={(data) => onCTAClick('calculator_use', data)} standalone />
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
              <Card 
                className="text-left"
                style={{
                  background: '#FAFBFC',
                  border: 'none',
                  boxShadow: 'none',
                  padding: '60px',
                  borderRadius: '32px'
                }}
              >
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

              <Card className="p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: 'none' }}>
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
        <section data-section="competitive-advantage" className="proposal-section">
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
        <section data-section="vision" className="proposal-section">
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
        <section data-section="support" className="proposal-section">
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

      {/* Pricing Section - Clean Alter Style */}
      <section data-section="pricing" className="proposal-section bg-proposal-bg">
        <div className="alter-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 style={{ fontSize: '42px', fontWeight: '600', letterSpacing: '-0.02em', lineHeight: '1.2', marginBottom: '24px' }} className="text-text-heading">Investment Options</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#64748B' }} className="max-w-3xl leading-relaxed">
              Choose the solution that best fits your needs. All options include our ROI guarantee.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
                style={{
                  background: '#FAFBFC',
                  border: 'none',
                  boxShadow: 'none',
                  padding: '60px',
                  borderRadius: '32px'
                }}
              >
                {tier.recommended && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="text-gray-600 text-xs font-medium">
                      Recommended
                    </div>
                  </div>
                )}
                
                <div className="h-full">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-text-heading mb-2">{tier.name}</h3>
                    <p className="text-text-muted mb-6">{tier.subtitle}</p>
                    
                    <div className="mb-6">
                      <div className="text-xs text-gray-400 line-through mb-1">
                        ${tier.originalPrice.toLocaleString()}
                      </div>
                      <div className="text-text-heading mb-2" style={{ 
                        fontSize: '80px', 
                        fontWeight: '700', 
                        letterSpacing: '-0.03em',
                        lineHeight: '1.1',
                        fontFeatureSettings: '"tnum"'
                      }}>
                        ${tier.price.toLocaleString()}
                      </div>
                      <div className="text-xs font-medium text-primary">
                        Save ${tier.savings.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-sm text-text-muted mb-6">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {tier.payback} payback
                      </div>
                      <div className="w-1 h-1 bg-text-subtle rounded-full"></div>
                      <div className="flex items-center">
                        <Gauge className="w-4 h-4 mr-1" />
                        {tier.percentage} solution
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-text-body">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    className={`w-full transition-all ${
                      tier.recommended 
                        ? 'alter-button-primary' 
                        : 'px-6 py-3 border border-border hover:shadow-card rounded-lg bg-white'
                    }`}
                    onClick={() => onCTAClick('select_tier', { tier: tier.name, price: tier.price })}
                  >
                    Select {tier.name}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="proposal-card p-8 border-primary/20 bg-primary/5">
              <h3 className="text-xl font-bold mb-4 text-text-heading">
                Limited Time Offer: 30% Savings
              </h3>
              <p className="text-text-body mb-4">
                Act before {new Date(proposal.valid_until).toLocaleDateString()} to lock in these special rates. 
                Prices increase by 30% after this date.
              </p>
              <div className="text-sm text-text-muted font-medium">
                Offer expires in: {Math.ceil((new Date(proposal.valid_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
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
            className="mb-16"
          >
            <h2 style={{ fontSize: '42px', fontWeight: '600', letterSpacing: '-0.02em', lineHeight: '1.2', marginBottom: '24px' }} className="text-text-heading">Implementation Roadmap</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#64748B' }} className="max-w-2xl">
              A clear, step-by-step plan to get you from where you are to where you want to be.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-border" />
            
            {timelineData.map((phase, index) => (
              <div
                key={phase.phase}
                className={`relative flex items-center mb-16 ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <Card 
                    className="text-left"
                    style={{
                      background: '#FAFBFC',
                      border: 'none',
                      boxShadow: 'none',
                      padding: '60px',
                      borderRadius: '32px'
                    }}
                  >
                    <div className={`flex items-center mb-4 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: phase.color }}
                      >
                        {index + 1}
                      </div>
                      <div className={`${index % 2 === 0 ? 'ml-4' : 'mr-4'}`}>
                        <h3 className="text-xl font-bold">{phase.phase}</h3>
                        <p className="text-muted-foreground">{phase.duration} weeks</p>
                      </div>
                    </div>
                    <Progress value={(phase.duration / 13) * 100} className="mb-2" />
                    <div className="text-sm text-muted-foreground">
                      Weeks {phase.start + 1}-{phase.start + phase.duration}
                    </div>
                  </Card>
                </div>
                
                <div 
                  className="absolute left-1/2 transform -translate-x-1/2 rounded-full border-4 border-background" 
                  style={{ width: '8px', height: '8px', backgroundColor: '#E5E7EB' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees and Risk Reversal */}
      <section className="proposal-section">
        <div className="alter-container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 style={{ fontSize: '42px', fontWeight: '600', letterSpacing: '-0.02em', lineHeight: '1.2', marginBottom: '24px' }} className="text-text-heading">Your Success is Guaranteed</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#64748B' }} className="max-w-2xl">
              We're so confident in our solution that we back it with ironclad guarantees. Your investment is protected.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Card className="p-8 text-center" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: 'none' }}>
                <Shield className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">ROI Guarantee</h3>
                <p className="text-muted-foreground mb-4">
                  If you don't see a 300% ROI within 12 months, we'll refund the difference.
                </p>
                <div className="text-2xl font-bold text-green-600">300%+ ROI</div>
              </Card>
            </div>

            <div>
              <Card className="p-8 text-center" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: 'none' }}>
                <Trophy className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">Performance Promise</h3>
                <p className="text-muted-foreground mb-4">
                  We guarantee 60%+ efficiency improvement or your money back.
                </p>
                <div className="text-2xl font-bold text-blue-600">60% Better</div>
              </Card>
            </div>

            <div>
              <Card className="p-8 text-center" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <Zap className="w-16 h-16 text-purple-500 mx-auto mb-6" />
                <h3 className="text-xl font-bold mb-4">Fast Implementation</h3>
                <p className="text-muted-foreground mb-4">
                  Results in 30 days or we extend support at no additional cost.
                </p>
                <div className="text-2xl font-bold text-purple-600">30 Days</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="proposal-section">
        <div className="alter-container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-primary/20">
              <h2 className="text-4xl font-bold mb-6">Ready to Stop Losing Money?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Every day you wait costs you <span className="font-bold text-red-600">${Math.round(dailyLoss).toLocaleString()}</span>. 
                Start saving immediately with our proven automation solution.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    $<AnimatedNumber value={proposal.financial_amount * 2} format="number" />
                  </div>
                  <div className="text-sm text-muted-foreground">Annual Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">6 months</div>
                  <div className="text-sm text-muted-foreground">Payback Period</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">300%+</div>
                  <div className="text-sm text-muted-foreground">Guaranteed ROI</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-4"
                  onClick={() => onCTAClick('accept_proposal', { urgency: 'high' })}
                >
                  Accept Proposal & Start Saving
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-4"
                  onClick={() => onCTAClick('schedule_call', { urgency: 'medium' })}
                >
                  Schedule Strategy Call
                </Button>
              </div>

              <div className="mt-8 text-sm text-muted-foreground">
                ⚡ Limited time offer expires {new Date(proposal.valid_until).toLocaleDateString()} • 
                ✅ 30-day implementation guarantee • 
                🔒 100% risk-free with our guarantees
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};