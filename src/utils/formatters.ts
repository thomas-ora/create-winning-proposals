import { CURRENCY_SYMBOLS, DATE_FORMATS, STATUS_COLORS, type StatusType, type DateFormatType, type CurrencyType } from './constants';

/**
 * Format currency amount with proper symbol and locale formatting
 */
export const formatCurrency = (amount: number, currency: CurrencyType = 'USD'): string => {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  
  // Use built-in number formatting for consistency
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return `${symbol}${formattedAmount}`;
};

/**
 * Format date with consistent styling
 */
export const formatDate = (date: Date, format: DateFormatType = 'MEDIUM'): string => {
  let options: Intl.DateTimeFormatOptions;
  
  switch (format) {
    case 'SHORT':
      options = { month: 'numeric', day: 'numeric', year: '2-digit' };
      break;
    case 'MEDIUM':
      options = { month: 'numeric', day: 'numeric', year: 'numeric' };
      break;
    case 'LONG':
      options = { month: 'long', day: 'numeric', year: 'numeric' };
      break;
    case 'FULL':
      options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
      break;
    default:
      options = { month: 'numeric', day: 'numeric', year: 'numeric' };
  }

  return date.toLocaleDateString('en-US', options);
};

/**
 * Format status with proper casing and return associated color class
 */
export const formatStatus = (status: StatusType): { text: string; colorClass: string } => {
  const formattedText = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  const colorClass = STATUS_COLORS[status] || STATUS_COLORS.draft;
  
  return {
    text: formattedText,
    colorClass
  };
};

/**
 * Truncate text with ellipsis if it exceeds maxLength
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength).trim() + '...';
};