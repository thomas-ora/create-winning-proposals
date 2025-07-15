import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  Gauge
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ROICalculator } from './ROICalculator';
import { AnimatedNumber } from './AnimatedNumber';
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
  };
  onCTAClick: (action: string, data?: any) => void;
}

export const PsychologyOptimizedProposal = ({ 
  proposal, 
  onCTAClick 
}: PsychologyOptimizedProposalProps) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [dailyLoss, setDailyLoss] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const readingProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Calculate daily loss from financial data
  useEffect(() => {
    // Simulate current inefficient process costs
    const annualLoss = proposal.financial_amount * 2.5; // Assume 2.5x current cost due to inefficiencies
    const dailyAmount = annualLoss / 365;
    setDailyLoss(dailyAmount);
  }, [proposal.financial_amount]);

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
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Fixed Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
        style={{ scaleX: scrollYProgress }}
        initial={{ scaleX: 0 }}
      />

      {/* Fixed Daily Loss Counter */}
      <motion.div 
        className="fixed top-4 right-4 z-40 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <div className="flex items-center space-x-2">
          <TrendingDown className="w-5 h-5" />
          <div>
            <div className="text-xs opacity-90">Daily Loss</div>
            <div className="text-lg font-bold">
              $<AnimatedNumber value={dailyLoss} format="number" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        
        <motion.div 
          className="relative z-10 text-center max-w-4xl mx-auto px-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Company Logos */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            {proposal.logo_url && (
              <img 
                src={proposal.logo_url} 
                alt="Company Logo" 
                className="h-16 object-contain"
              />
            )}
            <div className="text-muted-foreground text-2xl">×</div>
            <div className="h-16 w-32 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold text-xl">
              ORASYSTEMS
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <Badge variant="secondary" className="mb-4">
              <Clock className="w-4 h-4 mr-2" />
              Valid until {new Date(proposal.valid_until).toLocaleDateString()}
            </Badge>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {proposal.title}
          </motion.h1>

          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            A comprehensive automation solution designed specifically for {proposal.company_name} 
            to eliminate inefficiencies and maximize productivity.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Potential Annual Savings</div>
              <div className="text-3xl font-bold text-green-600">
                $<AnimatedNumber value={proposal.financial_amount * 2} format="number" />
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Implementation Time</div>
              <div className="text-3xl font-bold text-blue-600">6-12 weeks</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-sm text-muted-foreground">ROI Guarantee</div>
              <div className="text-3xl font-bold text-purple-600">300%+</div>
            </div>
          </motion.div>

          <motion.div 
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <ChevronDown className="w-8 h-8 mx-auto text-muted-foreground animate-bounce" />
          </motion.div>
        </motion.div>
      </section>

      {/* Executive Summary with Loss Framing */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">The Hidden Cost of Inaction</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every day you delay, you're losing money. Here's what staying with your current process is really costing you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
                <div className="text-center">
                  <TrendingDown className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Daily Revenue Loss</h3>
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    $<AnimatedNumber value={dailyLoss} format="number" />
                  </div>
                  <p className="text-sm text-muted-foreground">Due to inefficient processes</p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
                <div className="text-center">
                  <Clock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Time Wasted Weekly</h3>
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    <AnimatedNumber value={32} format="number" /> hrs
                  </div>
                  <p className="text-sm text-muted-foreground">On manual, repetitive tasks</p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Error Rate</h3>
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    <AnimatedNumber value={15} format="number" />%
                  </div>
                  <p className="text-sm text-muted-foreground">Requiring costly rework</p>
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-4 text-red-700 dark:text-red-400">
              Cost of Waiting Just One More Month
            </h3>
            <div className="text-5xl font-bold text-red-600 mb-4">
              $<AnimatedNumber value={dailyLoss * 30} format="number" />
            </div>
            <p className="text-red-600 dark:text-red-400">
              That's money you'll never get back. Every day you wait is revenue walking out the door.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Current State Analysis */}
      <section className="py-20 px-6 bg-muted/20">
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

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-muted/20">
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