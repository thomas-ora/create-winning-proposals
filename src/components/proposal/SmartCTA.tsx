import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MessageSquare, CheckCircle2, Clock, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SmartCTAProps {
  scrollDepth: number;
  timeOnPage: number;
  sectionsViewed: string[];
  onCTAClick: (action: string, data?: any) => void;
}

export const SmartCTA = ({ 
  scrollDepth, 
  timeOnPage, 
  sectionsViewed, 
  onCTAClick 
}: SmartCTAProps) => {
  const [currentCTA, setCurrentCTA] = useState<'initial' | 'engaged' | 'final'>('initial');
  const [showExitIntent, setShowExitIntent] = useState(false);

  // Determine CTA type based on engagement
  useEffect(() => {
    if (scrollDepth > 80 && sectionsViewed.length > 5) {
      setCurrentCTA('final');
    } else if (scrollDepth > 40 && timeOnPage > 120) {
      setCurrentCTA('engaged');
    } else {
      setCurrentCTA('initial');
    }
  }, [scrollDepth, timeOnPage, sectionsViewed.length]);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitIntent && timeOnPage > 60) {
        setShowExitIntent(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [showExitIntent, timeOnPage]);

  const CTAContent = {
    initial: {
      title: "Learn More About This Solution",
      subtitle: "Schedule a 15-minute discovery call",
      action: "schedule_call",
      icon: Calendar,
      buttonText: "Schedule Call",
      urgent: false
    },
    engaged: {
      title: "Ready to Transform Your Business?",
      subtitle: "Let's discuss your specific needs",
      action: "contact_sales",
      icon: MessageSquare,
      buttonText: "Contact Sales",
      urgent: false
    },
    final: {
      title: "Accept This Proposal",
      subtitle: "Start your transformation today",
      action: "accept_proposal",
      icon: CheckCircle2,
      buttonText: "Accept Proposal",
      urgent: true
    }
  };

  const currentContent = CTAContent[currentCTA];
  const IconComponent = currentContent.icon;

  const handleCTAClick = () => {
    onCTAClick(currentContent.action, {
      scrollDepth,
      timeOnPage,
      sectionsViewed: sectionsViewed.length,
      ctaType: currentCTA
    });
  };

  return (
    <>
      {/* Main CTA Section */}
      <motion.div
        key={currentCTA}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm mb-6 ${
            currentContent.urgent 
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
          }`}
          animate={currentContent.urgent ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {currentContent.urgent && <Clock className="w-4 h-4" />}
          <span>
            {currentContent.urgent ? 'Limited Time Offer' : 'Next Step'}
          </span>
        </motion.div>

        <h2 className="text-4xl font-bold mb-4">{currentContent.title}</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {currentContent.subtitle}
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            size="lg"
            onClick={handleCTAClick}
            className={`text-lg px-8 py-4 ${
              currentContent.urgent 
                ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700' 
                : 'bg-gradient-to-r from-primary to-accent'
            }`}
          >
            <IconComponent className="w-6 h-6 mr-3" />
            {currentContent.buttonText}
          </Button>
        </motion.div>

        {currentCTA === 'final' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center justify-center space-x-4">
              <span>✓ 30-day money-back guarantee</span>
              <span>✓ Free implementation support</span>
              <span>✓ ROI guarantee</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitIntent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="relative"
            >
              <Card className="p-8 max-w-md bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 border-red-200 dark:border-red-800">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExitIntent(false)}
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>

                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Zap className="w-16 h-16 mx-auto mb-4 text-red-600" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-red-800 dark:text-red-200">
                    Wait! Don't Miss This Opportunity
                  </h3>
                  
                  <p className="text-red-700 dark:text-red-300 mb-6">
                    You're leaving without seeing how much you could save. 
                    Get a personalized savings report - takes just 2 minutes.
                  </p>

                  <div className="space-y-3">
                    <Button 
                      onClick={() => {
                        onCTAClick('exit_intent_calculator', { timeOnPage, scrollDepth });
                        setShowExitIntent(false);
                      }}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      Get My Savings Report
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => {
                        onCTAClick('exit_intent_call', { timeOnPage, scrollDepth });
                        setShowExitIntent(false);
                      }}
                      className="w-full"
                    >
                      Schedule Quick Call Instead
                    </Button>
                  </div>

                  <p className="text-xs text-red-600 dark:text-red-400 mt-4">
                    This offer expires when you leave this page
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};