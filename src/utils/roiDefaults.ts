interface ClientData {
  industry?: string;
  revenue_range?: string;
  employee_count?: number;
  growth_stage?: string;
  financial_amount?: number;
}

interface ROIDefaults {
  currentHourlyRate: number;
  hoursPerWeek: number;
  errorRate: number;
  automationSavings: number;
  implementationCost: number;
  timeToImplement: number;
}

// Industry-based hourly rates mapping
const INDUSTRY_HOURLY_RATES = {
  'technology': { min: 95, max: 120 },
  'healthcare': { min: 80, max: 95 },
  'finance': { min: 90, max: 110 },
  'manufacturing': { min: 70, max: 85 },
  'retail': { min: 65, max: 80 },
  'consulting': { min: 100, max: 130 },
  'real estate': { min: 75, max: 90 },
  'education': { min: 60, max: 75 },
  'legal': { min: 110, max: 140 },
  'marketing': { min: 80, max: 100 },
  'default': { min: 75, max: 90 }
};

// Revenue range multipliers for hourly rates
const REVENUE_MULTIPLIERS = {
  'under-1m': 0.8,
  '1m-5m': 0.9,
  '5m-10m': 1.0,
  '10m-50m': 1.1,
  '50m-100m': 1.2,
  'over-100m': 1.3,
  'default': 1.0
};

// Growth stage error rates
const GROWTH_STAGE_ERROR_RATES = {
  'startup': 25,
  'growth': 18,
  'scale-up': 15,
  'mature': 12,
  'enterprise': 10,
  'default': 18
};

// Industry automation potential
const INDUSTRY_AUTOMATION_POTENTIAL = {
  'technology': 70,
  'finance': 65,
  'manufacturing': 60,
  'healthcare': 55,
  'retail': 55,
  'consulting': 50,
  'real estate': 45,
  'education': 40,
  'legal': 60,
  'marketing': 65,
  'default': 55
};

function normalizeIndustry(industry?: string): string {
  if (!industry) return 'default';
  
  const normalized = industry.toLowerCase().trim();
  
  // Map common variations to our standard keys
  if (normalized.includes('tech') || normalized.includes('software') || normalized.includes('it')) return 'technology';
  if (normalized.includes('health') || normalized.includes('medical')) return 'healthcare';
  if (normalized.includes('financ') || normalized.includes('bank')) return 'finance';
  if (normalized.includes('manufact') || normalized.includes('production')) return 'manufacturing';
  if (normalized.includes('retail') || normalized.includes('ecommerce') || normalized.includes('e-commerce')) return 'retail';
  if (normalized.includes('consult')) return 'consulting';
  if (normalized.includes('real estate') || normalized.includes('property')) return 'real estate';
  if (normalized.includes('educat') || normalized.includes('school')) return 'education';
  if (normalized.includes('legal') || normalized.includes('law')) return 'legal';
  if (normalized.includes('market') || normalized.includes('advertis')) return 'marketing';
  
  return 'default';
}

function normalizeRevenueRange(revenue?: string): string {
  if (!revenue) return 'default';
  
  const normalized = revenue.toLowerCase().trim();
  
  if (normalized.includes('under') || normalized.includes('<') || normalized.includes('less than 1')) return 'under-1m';
  if (normalized.includes('1') && (normalized.includes('5') || normalized.includes('million'))) return '1m-5m';
  if (normalized.includes('5') && normalized.includes('10')) return '5m-10m';
  if (normalized.includes('10') && normalized.includes('50')) return '10m-50m';
  if (normalized.includes('50') && normalized.includes('100')) return '50m-100m';
  if (normalized.includes('over') || normalized.includes('>') || normalized.includes('100')) return 'over-100m';
  
  return 'default';
}

function normalizeGrowthStage(stage?: string): string {
  if (!stage) return 'default';
  
  const normalized = stage.toLowerCase().trim();
  
  if (normalized.includes('startup') || normalized.includes('early')) return 'startup';
  if (normalized.includes('growth') || normalized.includes('expanding')) return 'growth';
  if (normalized.includes('scale')) return 'scale-up';
  if (normalized.includes('mature') || normalized.includes('established')) return 'mature';
  if (normalized.includes('enterprise') || normalized.includes('large')) return 'enterprise';
  
  return 'default';
}

export function calculateClientROIDefaults(clientData?: ClientData): ROIDefaults {
  // Fallback to generic defaults if no client data
  if (!clientData) {
    return {
      currentHourlyRate: 85,
      hoursPerWeek: 32,
      errorRate: 18,
      automationSavings: 65,
      implementationCost: 45000,
      timeToImplement: 16
    };
  }

  const industry = normalizeIndustry(clientData.industry);
  const revenueRange = normalizeRevenueRange(clientData.revenue_range);
  const growthStage = normalizeGrowthStage(clientData.growth_stage);

  // Calculate hourly rate based on industry and revenue
  const industryRates = INDUSTRY_HOURLY_RATES[industry] || INDUSTRY_HOURLY_RATES.default;
  const revenueMultiplier = REVENUE_MULTIPLIERS[revenueRange] || REVENUE_MULTIPLIERS.default;
  const baseHourlyRate = (industryRates.min + industryRates.max) / 2;
  const currentHourlyRate = Math.round(baseHourlyRate * revenueMultiplier);

  // Calculate hours per week based on employee count and industry
  let hoursPerWeek = 32; // Base hours for automation tasks
  if (clientData.employee_count) {
    if (clientData.employee_count < 10) hoursPerWeek = 20;
    else if (clientData.employee_count < 50) hoursPerWeek = 32;
    else if (clientData.employee_count < 200) hoursPerWeek = 45;
    else hoursPerWeek = 60;
  }

  // Error rate based on growth stage
  const errorRate = GROWTH_STAGE_ERROR_RATES[growthStage] || GROWTH_STAGE_ERROR_RATES.default;

  // Automation savings potential based on industry
  const automationSavings = INDUSTRY_AUTOMATION_POTENTIAL[industry] || INDUSTRY_AUTOMATION_POTENTIAL.default;

  // Implementation cost - use proposal amount if available, otherwise calculate based on company size
  let implementationCost = 45000; // Default
  if (clientData.financial_amount) {
    implementationCost = Math.round(clientData.financial_amount * 0.75); // 75% of proposal amount
  } else if (clientData.employee_count) {
    if (clientData.employee_count < 10) implementationCost = 25000;
    else if (clientData.employee_count < 50) implementationCost = 45000;
    else if (clientData.employee_count < 200) implementationCost = 75000;
    else implementationCost = 120000;
  }

  // Implementation time based on company size and complexity
  let timeToImplement = 16; // Default weeks
  if (clientData.employee_count) {
    if (clientData.employee_count < 10) timeToImplement = 8;
    else if (clientData.employee_count < 50) timeToImplement = 12;
    else if (clientData.employee_count < 200) timeToImplement = 16;
    else timeToImplement = 24;
  }

  return {
    currentHourlyRate,
    hoursPerWeek,
    errorRate,
    automationSavings,
    implementationCost,
    timeToImplement
  };
}

export function getClientContextLabels(clientData?: ClientData) {
  if (!clientData) return {};

  const industry = normalizeIndustry(clientData.industry);
  const growthStage = normalizeGrowthStage(clientData.growth_stage);
  const revenueRange = normalizeRevenueRange(clientData.revenue_range);

  return {
    hourlyRateContext: clientData.industry ? `Based on ${clientData.industry} industry standards` : '',
    errorRateContext: clientData.growth_stage ? `Typical for ${clientData.growth_stage} companies` : '',
    automationContext: clientData.industry ? `${clientData.industry} automation potential` : '',
    implementationContext: clientData.employee_count ? `Scaled for ${clientData.employee_count} employees` : ''
  };
}