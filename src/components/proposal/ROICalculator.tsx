import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calculator, TrendingUp, Clock, DollarSign, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { AnimatedNumber } from './AnimatedNumber';

interface ROICalculatorProps {
  title?: string;
  className?: string;
  standalone?: boolean;
  onCalculatorUse?: (data: Record<string, any>) => void;
  data?: any;
}

interface ROIInputs {
  currentHourlyRate: number;
  hoursPerWeek: number;
  errorRate: number;
  automationSavings: number;
  implementationCost: number;
  timeToImplement: number;
}

export const ROICalculator = ({ 
  title = "ROI Calculator", 
  className = "",
  standalone = false,
  onCalculatorUse,
  data
}: ROICalculatorProps) => {
  const [inputs, setInputs] = useState<ROIInputs>({
    currentHourlyRate: 75,
    hoursPerWeek: 40,
    errorRate: 15,
    automationSavings: 60,
    implementationCost: 25000,
    timeToImplement: 12
  });

  const [results, setResults] = useState({
    currentAnnualCost: 0,
    automatedAnnualCost: 0,
    annualSavings: 0,
    monthlyROI: 0,
    breakEvenMonths: 0,
    threeYearSavings: 0,
    productivityGain: 0
  });

  const updateInput = (field: keyof ROIInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    
    // Track calculator usage
    if (onCalculatorUse) {
      onCalculatorUse({
        field,
        value,
        ...inputs,
        timestamp: Date.now()
      });
    }
  };

  useEffect(() => {
    // Calculate ROI metrics
    const weeksPerYear = 52;
    const currentAnnualHours = inputs.hoursPerWeek * weeksPerYear;
    const currentAnnualCost = currentAnnualHours * inputs.currentHourlyRate;
    
    // Factor in error costs (errors require rework)
    const errorCostMultiplier = 1 + (inputs.errorRate / 100);
    const adjustedCurrentCost = currentAnnualCost * errorCostMultiplier;
    
    // Calculate automated costs
    const savingsMultiplier = inputs.automationSavings / 100;
    const automatedAnnualCost = adjustedCurrentCost * (1 - savingsMultiplier);
    
    const annualSavings = adjustedCurrentCost - automatedAnnualCost;
    const monthlyROI = annualSavings / 12;
    const breakEvenMonths = inputs.implementationCost / monthlyROI;
    const threeYearSavings = (annualSavings * 3) - inputs.implementationCost;
    const productivityGain = (inputs.automationSavings * inputs.hoursPerWeek) / 100;

    setResults({
      currentAnnualCost: adjustedCurrentCost,
      automatedAnnualCost,
      annualSavings,
      monthlyROI,
      breakEvenMonths,
      threeYearSavings,
      productivityGain
    });
  }, [inputs]);

  const chartData = [
    {
      name: 'Current Process',
      value: results.currentAnnualCost,
      color: '#ef4444'
    },
    {
      name: 'With Automation',
      value: results.automatedAnnualCost,
      color: '#22c55e'
    },
    {
      name: 'Annual Savings',
      value: results.annualSavings,
      color: '#3b82f6'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className={`${className} ${standalone ? 'p-6' : ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="p-8 bg-gradient-to-br from-card/40 via-card/60 to-card/40 backdrop-blur-xl border border-white/10 shadow-2xl">
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {title}
              </h3>
              <p className="text-muted-foreground">Based on what you shared in our consultation, here's the real cost of your current processes:</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="p-6 bg-background/50 backdrop-blur-sm border border-white/10">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-primary" />
                Current Situation
              </h4>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={inputs.currentHourlyRate}
                    onChange={(e) => updateInput('currentHourlyRate', Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="hoursPerWeek">Hours per Week</Label>
                  <div className="mt-2">
                    <Slider
                      value={[inputs.hoursPerWeek]}
                      onValueChange={([value]) => updateInput('hoursPerWeek', value)}
                      max={60}
                      min={10}
                      step={1}
                      className="mb-2"
                    />
                    <div className="text-sm text-muted-foreground text-center">
                      {inputs.hoursPerWeek} hours/week
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="errorRate">Error Rate (%)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[inputs.errorRate]}
                      onValueChange={([value]) => updateInput('errorRate', value)}
                      max={50}
                      min={0}
                      step={1}
                      className="mb-2"
                    />
                    <div className="text-sm text-muted-foreground text-center">
                      {inputs.errorRate}% errors requiring rework
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-background/50 backdrop-blur-sm border border-white/10">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Automation Parameters
              </h4>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="automationSavings">Time Savings (%)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[inputs.automationSavings]}
                      onValueChange={([value]) => updateInput('automationSavings', value)}
                      max={90}
                      min={10}
                      step={5}
                      className="mb-2"
                    />
                    <div className="text-sm text-muted-foreground text-center">
                      {inputs.automationSavings}% time savings
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="implementationCost">Implementation Cost ($)</Label>
                  <Input
                    id="implementationCost"
                    type="number"
                    value={inputs.implementationCost}
                    onChange={(e) => updateInput('implementationCost', Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="timeToImplement">Implementation Time (weeks)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[inputs.timeToImplement]}
                      onValueChange={([value]) => updateInput('timeToImplement', value)}
                      max={24}
                      min={4}
                      step={1}
                      className="mb-2"
                    />
                    <div className="text-sm text-muted-foreground text-center">
                      {inputs.timeToImplement} weeks
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Results Panel */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-sm border border-green-500/20">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Current efficiency gap:</div>
                  <div className="text-2xl font-bold text-green-600">
                    <AnimatedNumber 
                      value={results.annualSavings} 
                      format="currency"
                      duration={0.8}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">We calculated this together using your actual business metrics</div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm border border-blue-500/20">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Break Even</div>
                  <div className="text-2xl font-bold text-blue-600 flex items-center justify-center">
                    <Clock className="w-5 h-5 mr-1" />
                    <AnimatedNumber 
                      value={results.breakEvenMonths} 
                      format="number"
                      duration={0.8}
                    />
                    <span className="text-sm ml-1">mo</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-sm border border-purple-500/20">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">3-Year Savings</div>
                  <div className="text-2xl font-bold text-purple-600">
                    <AnimatedNumber 
                      value={results.threeYearSavings} 
                      format="currency"
                      duration={0.8}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 backdrop-blur-sm border border-orange-500/20">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Weekly Time Saved</div>
                  <div className="text-2xl font-bold text-orange-600">
                    <AnimatedNumber 
                      value={results.productivityGain} 
                      format="number"
                      duration={0.8}
                    />
                    <span className="text-sm ml-1">hrs</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Comparison Chart */}
            <Card className="p-6 bg-background/50 backdrop-blur-sm border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Annual Cost Comparison</h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground hover:text-primary cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Companies using automation report 35-40% efficiency gains</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Based on 2024 industry automation benchmarks - Your opportunity for improvement</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* ROI Summary */}
            <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm border border-white/10">
              <h4 className="text-lg font-semibold mb-3">ROI Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly ROI:</span>
                  <span className="font-semibold">
                    <AnimatedNumber value={results.monthlyROI} format="currency" />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Implementation ROI:</span>
                  <span className="font-semibold text-green-600">
                    <AnimatedNumber 
                      value={(results.threeYearSavings / inputs.implementationCost) * 100} 
                      format="percentage" 
                    />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Productivity Increase:</span>
                  <span className="font-semibold text-blue-600">
                    <AnimatedNumber value={inputs.automationSavings} format="percentage" />
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-8 text-center">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mb-4">
            <p className="text-sm text-muted-foreground italic">
              "Our role is to help you capture this value, not let it slip away"
            </p>
          </div>
          {standalone && (
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              Get Started with Automation
            </Button>
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
};