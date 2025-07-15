import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Zap, Target, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedNumber } from './AnimatedNumber';

interface QuickWin {
  title: string;
  description: string;
  value: string;
  timeframe: string;
  icon: React.ElementType;
}

export const QuickWinsSection = () => {
  const quickWins: QuickWin[] = [
    {
      title: "Automated Report Generation",
      description: "Replace 8-hour manual reporting with automated insights",
      value: "$2,400",
      timeframe: "Day 3",
      icon: Target
    },
    {
      title: "Error Elimination",
      description: "Remove human errors from data entry processes",
      value: "$1,800",
      timeframe: "Day 5", 
      icon: CheckCircle2
    },
    {
      title: "Workflow Optimization",
      description: "Streamline approval processes by 70%",
      value: "$3,200",
      timeframe: "Day 7",
      icon: TrendingUp
    }
  ];

  const totalValue = 7400;

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <Zap className="w-4 h-4 mr-2" />
            Immediate Impact
          </Badge>
          <h2 className="text-4xl font-bold mb-6 text-green-800 dark:text-green-200">
            See Results in Your First Week
          </h2>
          <p className="text-xl text-green-700 dark:text-green-300 max-w-2xl mx-auto mb-8">
            Don't wait months for ROI. These quick wins will show immediate value 
            and pay for themselves in the first 7 days.
          </p>
          
          <motion.div 
            className="inline-flex items-center space-x-4 bg-white dark:bg-green-900 rounded-2xl p-6 shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center">
              <div className="text-sm text-green-600 dark:text-green-400">Week 1 Value</div>
              <div className="text-3xl font-bold text-green-800 dark:text-green-200">
                $<AnimatedNumber value={totalValue} format="number" />
              </div>
            </div>
            <div className="h-12 w-px bg-green-200 dark:bg-green-700" />
            <div className="text-center">
              <div className="text-sm text-green-600 dark:text-green-400">Implementation</div>
              <div className="text-3xl font-bold text-green-800 dark:text-green-200">7 Days</div>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {quickWins.map((win, index) => (
            <motion.div
              key={win.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="p-6 h-full bg-white dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                    <win.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2 text-green-600 border-green-300">
                      <Clock className="w-3 h-3 mr-1" />
                      {win.timeframe}
                    </Badge>
                    <h3 className="text-xl font-bold mb-2 text-green-800 dark:text-green-200">
                      {win.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-green-700 dark:text-green-300 mb-4">
                  {win.description}
                </p>
                
                <div className="mt-auto">
                  <div className="text-sm text-green-600 dark:text-green-400">Immediate Savings</div>
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {win.value}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center"
        >
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-80" />
          <h3 className="text-2xl font-bold mb-4">Your First Milestone</h3>
          <p className="text-green-100 text-lg mb-6 max-w-2xl mx-auto">
            By Day 7, you'll have eliminated manual reporting, reduced errors by 90%, 
            and optimized your core workflows. Your team will already be working 
            more efficiently and you'll see the savings in your next weekly report.
          </p>
          <div className="bg-white/20 rounded-lg p-4 inline-block">
            <div className="text-sm opacity-80">Guaranteed Week 1 ROI</div>
            <div className="text-3xl font-bold">
              $<AnimatedNumber value={totalValue} format="number" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};