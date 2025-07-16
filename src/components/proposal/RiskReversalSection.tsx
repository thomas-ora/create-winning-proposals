import React from 'react';
import { motion } from 'framer-motion';
import { Shield, DollarSign, TrendingUp, CheckCircle2, Clock, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const RiskReversalSection = () => {
  const guarantees = [
    {
      title: "30-day implementation guarantee",
      description: "or we keep working for free",
      icon: Clock,
      badge: "Implementation"
    },
    {
      title: "ROI in 90 days",
      description: "or full refund",
      icon: TrendingUp,
      badge: "ROI Guarantee"
    },
    {
      title: "Weekly progress updates",
      description: "with full transparency",
      icon: CheckCircle2,
      badge: "Transparency"
    },
    {
      title: "No lock-in contracts",
      description: "pay as you grow",
      icon: Shield,
      badge: "Flexibility"
    }
  ];

  const successMetrics = [
    { metric: "Average ROI", value: "425%", description: "Within 6 months" },
    { metric: "Success Rate", value: "97%", description: "Client satisfaction" },
    { metric: "Payback Period", value: "4.2 months", description: "Average time to break-even" }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Shield className="w-4 h-4 mr-2" />
            100% Risk-Free
          </Badge>
          <h2 className="text-4xl font-bold mb-6 text-blue-800 dark:text-blue-200">
            Your Success is Guaranteed
          </h2>
          <p className="text-xl text-blue-700 dark:text-blue-300 max-w-2xl mx-auto mb-4">
            As your automation partner, I personally ensure every workflow delivers the promised value.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {guarantees.map((guarantee, index) => (
            <motion.div
              key={guarantee.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="p-6 h-full bg-white dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <guarantee.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2 text-blue-600 border-blue-300">
                      {guarantee.badge}
                    </Badge>
                    <h3 className="text-xl font-bold mb-2 text-blue-800 dark:text-blue-200">
                      {guarantee.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-blue-700 dark:text-blue-300">
                  {guarantee.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Success Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-blue-900/30 rounded-2xl p-8 border border-blue-200 dark:border-blue-800"
        >
          <div className="text-center mb-8">
            <Award className="w-16 h-16 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-200">
              Proven Track Record
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              Our guarantees are backed by real results from 500+ successful implementations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successMetrics.map((metric, index) => (
              <motion.div
                key={metric.metric}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {metric.value}
                </div>
                <div className="font-bold text-blue-800 dark:text-blue-200 mb-1">
                  {metric.metric}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  {metric.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Move Forward Risk-Free?</h3>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            With our comprehensive guarantees, you have everything to gain and nothing to lose. 
            Let's start transforming your business today.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>30-Day Guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>ROI Protection</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Performance-Based Options</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};