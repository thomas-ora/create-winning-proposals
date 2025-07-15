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
    <section className="py-40 px-6 bg-muted">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <Badge className="mb-6 bg-accent text-foreground rounded-full px-6 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Immediate Impact
          </Badge>
          <h2 className="text-5xl font-bold mb-8 text-foreground">
            See Results in Your First Week
          </h2>
          <p className="text-xl font-light text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
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
                <div className="text-sm text-primary/70 font-light">Week 1 Value</div>
                <div className="text-4xl font-mono font-light text-foreground">
                  $<AnimatedNumber value={totalValue} format="number" />
                </div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <div className="text-sm text-primary/70 font-light">Implementation</div>
                <div className="text-4xl font-mono font-light text-foreground">7 Days</div>
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
              <Card className="p-12 h-full rounded-2xl shadow-card premium-hover border-0">
                <div className="text-center mb-8">
                  <motion.div
                    className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                  >
                    <win.icon className="w-8 h-8 text-primary" />
                  </motion.div>
                  <Badge className="mb-4 rounded-full bg-primary/10 text-primary border-primary/20">
                    <Clock className="w-3 h-3 mr-1" />
                    {win.timeframe}
                  </Badge>
                  <h3 className="text-2xl font-semibold mb-4 text-foreground">
                    {win.title}
                  </h3>
                </div>
                
                <p className="text-muted-foreground mb-6 font-light text-center">
                  {win.description}
                </p>
                
                <div className="text-center">
                  <div className="text-sm text-muted-foreground font-light">Immediate Savings</div>
                  <div className="text-4xl font-mono font-light text-foreground">
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