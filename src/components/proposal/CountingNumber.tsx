import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountingNumberProps {
  target: number;
  duration?: number;
  format?: 'currency' | 'number' | 'percentage';
  currency?: string;
  className?: string;
  increment?: number;
  startCounting?: boolean;
}

export const CountingNumber = ({ 
  target, 
  duration = 3000,
  format = 'number',
  currency = 'USD',
  className = "",
  increment = 1,
  startCounting = true
}: CountingNumberProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    const steps = Math.abs(target / increment);
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newValue = Math.min(currentStep * increment, target);
      setCurrent(newValue);

      if (newValue >= target) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration, increment, startCounting]);

  const formatValue = (value: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
      default:
        return value.toFixed(0);
    }
  };

  return (
    <motion.span
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {formatValue(current)}
    </motion.span>
  );
};