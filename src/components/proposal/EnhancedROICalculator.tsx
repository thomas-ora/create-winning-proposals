import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Download, Mail, TrendingUp, DollarSign, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatedNumber } from './AnimatedNumber';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ROICalculatorProps {
  onCalculatorUse: (data: any) => void;
  onExportPDF: () => void;
  onEmailResults: (email: string, results: any) => void;
}

export const EnhancedROICalculator = ({ 
  onCalculatorUse, 
  onExportPDF, 
  onEmailResults 
}: ROICalculatorProps) => {
  const [currentCosts, setCurrentCosts] = useState({
    monthlyProcessingCost: 25000,
    errorCostPerMonth: 8000,
    opportunityCostPerMonth: 12000,
    staffHoursPerWeek: 40,
    hourlyRate: 75
  });

  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  const calculateSavings = useCallback(() => {
    const monthlySavings = 
      currentCosts.monthlyProcessingCost * 0.7 + // 70% reduction in processing costs
      currentCosts.errorCostPerMonth * 0.9 + // 90% reduction in errors
      currentCosts.opportunityCostPerMonth * 0.6; // 60% reduction in opportunity costs

    const annualSavings = monthlySavings * 12;
    const implementationCost = 75000; // Base implementation cost
    const breakEvenMonths = implementationCost / monthlySavings;
    const threeYearROI = ((annualSavings * 3 - implementationCost) / implementationCost) * 100;

    return {
      monthlySavings,
      annualSavings,
      implementationCost,
      breakEvenMonths,
      threeYearROI,
      netPresentValue: annualSavings * 3 - implementationCost
    };
  }, [currentCosts]);

  const results = calculateSavings();

  // Generate chart data for break-even visualization
  const breakEvenData = Array.from({ length: 24 }, (_, i) => {
    const month = i + 1;
    const cumulativeSavings = results.monthlySavings * month;
    const netValue = cumulativeSavings - results.implementationCost;
    return {
      month,
      cumulativeSavings,
      implementationCost: results.implementationCost,
      netValue: Math.max(0, netValue)
    };
  });

  const handleInputChange = (field: string, value: number) => {
    setCurrentCosts(prev => ({ ...prev, [field]: value }));
    onCalculatorUse({ field, value, results: calculateSavings() });
  };

  const handleExportPDF = () => {
    onExportPDF();
    // In a real implementation, this would generate and download a PDF
  };

  const handleEmailResults = () => {
    if (email) {
      onEmailResults(email, results);
      setShowEmailInput(false);
      setEmail('');
    }
  };

  return (
    <div className="proposal-card p-8">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Calculator className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h3 className="text-3xl font-bold mb-4">Interactive ROI Calculator</h3>
          <p className="text-text-body mb-4">
            Based on what you shared in our consultation, here's the real cost of your current processes:
          </p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Input Controls */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-6 bg-white border border-border rounded-xl">
              <Label className="text-lg font-semibold mb-4 block text-text-heading">
                Monthly Processing Costs: ${currentCosts.monthlyProcessingCost.toLocaleString()}
              </Label>
              <div className="relative">
                <input
                  type="range"
                  value={currentCosts.monthlyProcessingCost}
                  onChange={(e) => handleInputChange('monthlyProcessingCost', Number(e.target.value))}
                  max={100000}
                  min={5000}
                  step={1000}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #5046E5 0%, #5046E5 ${(currentCosts.monthlyProcessingCost - 5000) / (100000 - 5000) * 100}%, #e5e7eb ${(currentCosts.monthlyProcessingCost - 5000) / (100000 - 5000) * 100}%, #e5e7eb 100%)`
                  }}
                />
              </div>
              <p className="text-sm text-text-muted mt-2">
                Current monthly costs for manual processing and operations
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Label className="text-lg font-semibold mb-4 block">
              Error-Related Costs: ${currentCosts.errorCostPerMonth.toLocaleString()}/month
            </Label>
            <Slider
              value={[currentCosts.errorCostPerMonth]}
              onValueChange={([value]) => handleInputChange('errorCostPerMonth', value)}
              max={50000}
              min={1000}
              step={500}
              className="mb-4"
            />
            <p className="text-sm text-muted-foreground">
              Monthly costs due to errors, rework, and corrections
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Label className="text-lg font-semibold mb-4 block">
              Opportunity Cost: ${currentCosts.opportunityCostPerMonth.toLocaleString()}/month
            </Label>
            <Slider
              value={[currentCosts.opportunityCostPerMonth]}
              onValueChange={([value]) => handleInputChange('opportunityCostPerMonth', value)}
              max={75000}
              min={2000}
              step={1000}
              className="mb-4"
            />
            <p className="text-sm text-muted-foreground">
              Lost revenue due to delays and inefficiencies
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Label className="text-lg font-semibold mb-4 block">
              Staff Time: {currentCosts.staffHoursPerWeek} hours/week @ ${currentCosts.hourlyRate}/hour
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hours per week</Label>
                <Slider
                  value={[currentCosts.staffHoursPerWeek]}
                  onValueChange={([value]) => handleInputChange('staffHoursPerWeek', value)}
                  max={160}
                  min={10}
                  step={5}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Hourly rate ($)</Label>
                <Slider
                  value={[currentCosts.hourlyRate]}
                  onValueChange={([value]) => handleInputChange('hourlyRate', value)}
                  max={200}
                  min={25}
                  step={5}
                  className="mt-2"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Results Display */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6"
          >
            <h4 className="text-2xl font-bold mb-6 text-center">Your ROI Results</h4>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="alter-stat-card text-center relative">
                <div className="text-sm" style={{ color: '#64748B', fontSize: '14px' }}>Current efficiency gap:</div>
                <div className="font-semibold text-green-600 mt-2" style={{ fontSize: '48px', fontWeight: '600' }}>
                  $<AnimatedNumber value={results.monthlySavings} format="number" />
                </div>
                <div className="text-xs" style={{ color: '#64748B', fontSize: '12px' }}>We calculated this together using your actual business metrics</div>
              </div>
              <div className="alter-stat-card text-center relative">
                <div className="text-sm" style={{ color: '#64748B', fontSize: '14px' }}>Your opportunity for improvement</div>
                <div className="font-semibold text-green-600 mt-2" style={{ fontSize: '48px', fontWeight: '600' }}>
                  $<AnimatedNumber value={results.annualSavings} format="number" />
                </div>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground hover:text-primary cursor-help inline ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Based on 2024 industry automation benchmarks</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
              <div className="alter-stat-card text-center relative">
                <div className="text-sm" style={{ color: '#64748B', fontSize: '14px' }}>Break-even</div>
                <div className="font-semibold text-blue-600 mt-2" style={{ fontSize: '48px', fontWeight: '600' }}>
                  <AnimatedNumber value={results.breakEvenMonths} format="number" />
                </div>
                <div className="text-sm" style={{ color: '#64748B', fontSize: '14px' }}>months</div>
              </div>
              <div className="alter-stat-card text-center relative">
                <div className="text-sm" style={{ color: '#64748B', fontSize: '14px' }}>3-Year ROI</div>
                <div className="font-semibold text-purple-600 mt-2" style={{ fontSize: '48px', fontWeight: '600' }}>
                  <AnimatedNumber value={results.threeYearROI} format="number" />%
                </div>
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl">
              <div className="text-sm opacity-90">Total 3-Year Value</div>
              <div className="text-3xl font-bold">
                $<AnimatedNumber value={results.netPresentValue} format="number" />
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={handleExportPDF}
              className="w-full"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>

            {!showEmailInput ? (
              <Button 
                onClick={() => setShowEmailInput(true)}
                className="w-full"
                variant="outline"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Results to Yourself
              </Button>
            ) : (
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleEmailResults}
                    className="flex-1"
                  >
                    Send Results
                  </Button>
                  <Button 
                    onClick={() => setShowEmailInput(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Break-even Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <h4 className="text-xl font-bold text-center">Break-even Analysis</h4>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Companies using automation report 35-40% efficiency gains</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={breakEvenData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="cumulativeSavings" 
                stroke="#22c55e" 
                strokeWidth={3}
                name="Cumulative Savings"
              />
              <Line 
                type="monotone" 
                dataKey="implementationCost" 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Implementation Cost"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-muted-foreground text-center mt-4">
          You'll break even in {results.breakEvenMonths.toFixed(1)} months, then enjoy pure profit.
        </p>
      </motion.div>
      
      {/* Partnership Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-8 text-center"
      >
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground italic">
            "Our role is to help you capture this value, not let it slip away"
          </p>
        </div>
      </motion.div>
    </div>
  );
};