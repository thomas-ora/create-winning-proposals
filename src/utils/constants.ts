export const STATUS_COLORS = {
  draft: 'text-gray-600',
  sent: 'text-blue-600',
  viewed: 'text-orange-600',
  accepted: 'text-green-600',
  rejected: 'text-red-600',
  expired: 'text-gray-500'
} as const;

export const DATE_FORMATS = {
  SHORT: 'short',
  MEDIUM: 'medium',
  LONG: 'long',
  FULL: 'full'
} as const;

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$'
} as const;

export type StatusType = keyof typeof STATUS_COLORS;
export type DateFormatType = keyof typeof DATE_FORMATS;
export type CurrencyType = keyof typeof CURRENCY_SYMBOLS;