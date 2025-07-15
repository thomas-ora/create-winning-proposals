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
    <div ref={containerRef} className="min-h-screen bg-background animated-grid">
      {/* Premium Progress Bar with Glow */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-primary z-50 shadow-glow-soft"
        style={{ scaleX: scrollYProgress }}
        initial={{ scaleX: 0 }}
      />

      {/* Premium Daily Loss Counter */}
      <motion.div 
        className="fixed top-6 right-6 z-40 glass-premium px-8 py-4 rounded-2xl border border-red-500/30 hover-glow"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        whileHover={{ scale: 1.02, y: -2 }}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <div className="text-xs text-red-400 font-medium tracking-wide">DAILY LOSS</div>
            <div className="text-2xl font-bold text-white text-shadow-soft">
              $<CountingNumber 
                target={dailyLoss} 
                duration={2000} 
                increment={Math.max(1, Math.floor(dailyLoss / 100))}
                startCounting={timeOnPage > 3}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Premium Hero Section */}
      <section 
        ref={heroRef}
        data-section="hero"
        className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden section-spacing-large"
      >
        {/* Premium Animated Background */}
        <motion.div 
          className="absolute inset-0 bg-mesh opacity-30" 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]) }}
        />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        <motion.div 
          className="relative z-10 text-center max-w-6xl mx-auto px-6"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Premium Company Logos */}
          <motion.div 
            className="flex items-center justify-center space-x-12 mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {proposal.logo_url && (
              <div className="glass-card p-4 rounded-2xl">
                <img 
                  src={proposal.logo_url} 
                  alt="Company Logo" 
                  className="h-20 object-contain filter brightness-110"
                />
              </div>
            )}
            <div className="text-muted-foreground/60 text-3xl font-light">×</div>
            <div className="glass-premium p-6 rounded-2xl glow-hover">
              <div className="h-20 w-40 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl tracking-wide">
                ORASYSTEMS
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <div className="glass-card px-6 py-3 rounded-full inline-flex items-center border-primary/30">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-white/90">
                Valid until {new Date(proposal.valid_until).toLocaleDateString()}
              </span>
            </div>
          </motion.div>

          <motion.h1 
            className="text-headline gradient-text-large mb-8 text-shadow-soft"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            {proposal.title}
          </motion.h1>

          <motion.p 
            className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
          >
            A sophisticated automation solution engineered specifically for {proposal.company_name} 
            to eliminate operational inefficiencies and amplify productivity at scale.
          </motion.p>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 1 }}
          >
            <motion.div 
              className="glass-premium p-8 rounded-2xl hover-float text-center border-green-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-sm text-green-400 font-medium tracking-wider mb-2">ANNUAL SAVINGS</div>
              <div className="text-4xl font-bold text-white mb-2">
                $<CountingNumber 
                  target={proposal.financial_amount * 2} 
                  duration={3000}
                  startCounting={isHeroInView}
                  increment={Math.max(100, Math.floor(proposal.financial_amount * 2 / 200))}
                />
              </div>
              <div className="text-green-400/80 text-sm">Projected first year</div>
            </motion.div>

            <motion.div 
              className="glass-premium p-8 rounded-2xl hover-float text-center border-blue-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-sm text-blue-400 font-medium tracking-wider mb-2">IMPLEMENTATION</div>
              <div className="text-4xl font-bold text-white mb-2">6-12</div>
              <div className="text-blue-400/80 text-sm">Weeks to full deployment</div>
            </motion.div>

            <motion.div 
              className="glass-premium p-8 rounded-2xl hover-float text-center border-purple-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-sm text-purple-400 font-medium tracking-wider mb-2">ROI GUARANTEE</div>
              <div className="text-4xl font-bold text-white mb-2">300%+</div>
              <div className="text-purple-400/80 text-sm">Or money back</div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="glass-card p-4 rounded-full inline-block">
              <ChevronDown className="w-6 h-6 text-primary animate-bounce" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Premium Executive Summary with Loss Framing */}
      <section data-section="executive-summary" className="section-spacing px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-display gradient-text mb-8">The Hidden Cost of Inaction</h2>
            <p className="text-2xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed">
              Every moment you delay costs real money. Here's the sophisticated analysis of what 
              maintaining your current operational state is actually costing you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="glass-premium p-8 rounded-3xl hover-float border-red-500/20 text-center">
                <div className="w-16 h-16 mx-auto mb-6 glass-card rounded-2xl flex items-center justify-center">
                  <TrendingDown className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Daily Revenue Loss</h3>
                <div className="text-4xl font-bold text-red-400 mb-3">
                  $<CountingNumber 
                    target={dailyLoss} 
                    duration={2000}
                    increment={Math.max(1, Math.floor(dailyLoss / 50))}
                  />
                </div>
                <p className="text-sm text-white/60 font-light">Due to operational inefficiencies</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-premium p-8 rounded-3xl hover-float border-orange-500/20 text-center">
                <div className="w-16 h-16 mx-auto mb-6 glass-card rounded-2xl flex items-center justify-center">
                  <Clock className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Time Wasted Weekly</h3>
                <div className="text-4xl font-bold text-orange-400 mb-3">
                  <CountingNumber target={32} duration={1500} increment={1} /> hrs
                </div>
                <p className="text-sm text-white/60 font-light">On manual, repetitive processes</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="glass-premium p-8 rounded-3xl hover-float border-yellow-500/20 text-center">
                <div className="w-16 h-16 mx-auto mb-6 glass-card rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Error Rate</h3>
                <div className="text-4xl font-bold text-yellow-400 mb-3">
                  <CountingNumber target={15} duration={1000} increment={1} />%
                </div>
                <p className="text-sm text-white/60 font-light">Requiring expensive rework</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-premium p-12 rounded-3xl text-center border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-600/5"
          >
            <h3 className="text-3xl font-bold mb-6 text-red-400">
              Cost of Waiting Just One More Month
            </h3>
            <div className="text-6xl font-bold text-white mb-6 text-shadow-soft">
              $<CountingNumber 
                target={dailyLoss * 30} 
                duration={3000}
                increment={Math.max(10, Math.floor(dailyLoss * 30 / 100))}
              />
            </div>
            <p className="text-xl text-red-400/90 font-light max-w-2xl mx-auto">
              Revenue that vanishes forever. Every moment of hesitation is profit walking out your door—
              profit your competitors are capturing while you deliberate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Current State Analysis */}
      <section data-section="current-state" className="py-20 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Where You Stand Today</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A detailed analysis of your current operational efficiency compared to industry standards.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6">Efficiency Comparison</h3>
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
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6">Loss Trajectory</h3>
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
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Calculate Your ROI</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See exactly how much you'll save and how quickly you'll see returns with our interactive calculator.
            </p>
          </motion.div>

          <ROICalculator onCalculatorUse={(data) => onCTAClick('calculator_use', data)} standalone />
        </div>
      </section>

      {/* Psychology-Adapted Content */}
      {decisionStyle === 'analytical' && (
        <section data-section="detailed-analysis" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
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
        <section data-section="competitive-advantage" className="py-20 px-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
          <div className="max-w-6xl mx-auto">
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
        <section data-section="vision" className="py-20 px-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <div className="max-w-6xl mx-auto text-center">
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
        <section data-section="support" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <div className="max-w-6xl mx-auto">
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

      {/* Pricing Section */}
      <section data-section="pricing" className="py-20 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Investment Options</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the solution that best fits your needs. All options include our ROI guarantee.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${tier.recommended ? 'lg:-mt-4 lg:mb-4' : ''}`}
              >
                {tier.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`p-8 h-full relative overflow-hidden ${
                  tier.recommended 
                    ? 'border-primary shadow-2xl bg-gradient-to-br from-primary/5 to-accent/5' 
                    : 'hover:shadow-xl transition-shadow'
                }`}>
                  {tier.recommended && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full -translate-y-16 translate-x-16" />
                  )}
                  
                  <div className="relative">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                      <p className="text-muted-foreground mb-4">{tier.subtitle}</p>
                      
                      <div className="mb-4">
                        <div className="text-sm text-muted-foreground line-through">
                          ${tier.originalPrice.toLocaleString()}
                        </div>
                        <div className="text-4xl font-bold text-primary">
                          ${tier.price.toLocaleString()}
                        </div>
                        <div className="text-green-600 font-semibold">
                          Save ${tier.savings.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-4 text-sm mb-6">
                        <div className="flex items-center text-green-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {tier.payback} payback
                        </div>
                        <div className="flex items-center text-blue-600">
                          <Gauge className="w-4 h-4 mr-1" />
                          {tier.percentage} solution
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={`w-full ${
                        tier.recommended 
                          ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90' 
                          : ''
                      }`}
                      size="lg"
                      onClick={() => onCTAClick('select_tier', { tier: tier.name, price: tier.price })}
                    >
                      Select {tier.name}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Card className="p-8 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
              <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-400">
                💰 Limited Time Offer: 30% Savings
              </h3>
              <p className="text-green-600 dark:text-green-400 mb-4">
                Act before {new Date(proposal.valid_until).toLocaleDateString()} to lock in these special rates. 
                Prices increase by 30% after this date.
              </p>
              <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
                ⏰ Offer expires in: {Math.ceil((new Date(proposal.valid_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Implementation Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Implementation Roadmap</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A clear, step-by-step plan to get you from where you are to where you want to be.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-0.5 w-1 h-full bg-border" />
            
            {timelineData.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex items-center mb-16 ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <Card className="p-6">
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
                
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees and Risk Reversal */}
      <section className="py-20 px-6 bg-muted/20">
        <div className="max-w-4xl mx-auto">
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

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
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