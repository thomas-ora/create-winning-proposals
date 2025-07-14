import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  format?: 'currency' | 'number' | 'percentage';
  currency?: string;
  className?: string;
}

export const AnimatedNumber = ({ 
  value, 
  duration = 1, 
  format = 'number', 
  currency = 'USD',
  className = ""
}: AnimatedNumberProps) => {
  const spring = useSpring(value, { duration: duration * 1000 });
  const display = useTransform(spring, (latest) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(latest);
      case 'percentage':
        return `${latest.toFixed(1)}%`;
      case 'number':
      default:
        return latest.toFixed(0);
    }
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span>{display}</motion.span>
    </motion.span>
  );
};