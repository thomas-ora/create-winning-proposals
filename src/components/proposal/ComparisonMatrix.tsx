import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, ArrowRight, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ComparisonItem {
  category: string;
  current: {
    status: string;
    description: string;
    value?: string;
  };
  future: {
    status: string;
    description: string;
    value?: string;
  };
}

interface ComparisonMatrixProps {
  onAnimationComplete?: () => void;
}

export const ComparisonMatrix = ({ onAnimationComplete }: ComparisonMatrixProps) => {
  const [showTransition, setShowTransition] = useState(false);

  const comparisonData: ComparisonItem[] = [
    {
      category: "Process Efficiency",
      current: {
        status: "poor",
        description: "Manual processes, frequent errors",
        value: "45% efficiency"
      },
      future: {
        status: "excellent",
        description: "Automated workflows, error-free",
        value: "95% efficiency"
      }
    },
    {
      category: "Time to Complete Tasks",
      current: {
        status: "poor",
        description: "4-6 hours per process",
        value: "5.2 hrs avg"
      },
      future: {
        status: "excellent",
        description: "Automated in minutes",
        value: "0.3 hrs avg"
      }
    },
    {
      category: "Error Rate",
      current: {
        status: "poor",
        description: "Human errors, inconsistency",
        value: "15% error rate"
      },
      future: {
        status: "excellent",
        description: "Validated automation",
        value: "<1% error rate"
      }
    },
    {
      category: "Reporting & Analytics",
      current: {
        status: "poor",
        description: "Manual reports, delayed insights",
        value: "Weekly reports"
      },
      future: {
        status: "excellent",
        description: "Real-time dashboards",
        value: "Live insights"
      }
    },
    {
      category: "Scalability",
      current: {
        status: "poor",
        description: "Linear growth requires more staff",
        value: "Limited scale"
      },
      future: {
        status: "excellent",
        description: "Automatic scaling",
        value: "Unlimited scale"
      }
    },
    {
      category: "Cost per Transaction",
      current: {
        status: "poor",
        description: "High labor costs",
        value: "$45 per task"
      },
      future: {
        status: "excellent",
        description: "Automated processing",
        value: "$2 per task"
      }
    }
  ];

  const handleTransition = () => {
    setShowTransition(true);
    onAnimationComplete?.();
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-background to-muted/20">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-4">Current State vs Future State</h3>
        <p className="text-muted-foreground mb-6">
          See the dramatic transformation your business will experience
        </p>
        <Button 
          onClick={handleTransition}
          disabled={showTransition}
          className="mb-6"
        >
          <Zap className="w-4 h-4 mr-2" />
          {showTransition ? 'Transformation in Progress...' : 'Visualize Transformation'}
        </Button>
      </div>

      <div className="space-y-6">
        {comparisonData.map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="grid md:grid-cols-3 gap-4 items-center">
              {/* Current State */}
              <motion.div 
                className={`p-4 rounded-lg border-2 transition-all duration-1000 ${
                  showTransition 
                    ? 'border-red-500/30 bg-red-500/5 scale-95 opacity-50' 
                    : 'border-red-500/50 bg-red-500/10'
                }`}
                animate={showTransition ? { x: -20, opacity: 0.5 } : { x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <X className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-red-700 dark:text-red-400">Current</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{item.current.description}</p>
                {item.current.value && (
                  <p className="text-lg font-bold text-red-600">{item.current.value}</p>
                )}
              </motion.div>

              {/* Category & Arrow */}
              <div className="text-center">
                <h4 className="font-bold mb-2">{item.category}</h4>
                <motion.div
                  animate={showTransition ? { scale: 1.2, color: '#22c55e' } : { scale: 1 }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                >
                  <ArrowRight className="w-6 h-6 mx-auto text-muted-foreground" />
                </motion.div>
              </div>

              {/* Future State */}
              <motion.div 
                className={`p-4 rounded-lg border-2 transition-all duration-1000 ${
                  showTransition 
                    ? 'border-green-500/50 bg-green-500/10 scale-105' 
                    : 'border-green-500/30 bg-green-500/5'
                }`}
                animate={showTransition ? { x: 20, scale: 1.05 } : { x: 0, scale: 1 }}
                transition={{ delay: index * 0.2 + 1 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-green-700 dark:text-green-400">Future</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{item.future.description}</p>
                {item.future.value && (
                  <p className="text-lg font-bold text-green-600">{item.future.value}</p>
                )}
              </motion.div>
            </div>

            {/* Transformation Effect */}
            {showTransition && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 + 1.5, duration: 0.5 }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {showTransition && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mt-8 text-center p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg"
        >
          <h4 className="text-xl font-bold text-green-600 mb-2">Transformation Complete!</h4>
          <p className="text-muted-foreground">
            This is exactly what your business will look like in 60-90 days after implementation.
          </p>
        </motion.div>
      )}
    </Card>
  );
};