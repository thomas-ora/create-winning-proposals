import { ProposalData } from './types';

export const mockProposals: ProposalData[] = [
  {
    id: 'web-dev-001',
    title: 'E-commerce Website Development',
    client: {
      name: 'Sarah Johnson',
      email: 'sarah@acmecorp.com',
      company: 'Acme Corporation'
    },
    author: {
      name: 'Alex Rodriguez',
      email: 'alex@webstudio.com',
      company: 'WebStudio Pro'
    },
    financial: {
      amount: 25000,
      currency: 'USD',
      paymentTerms: '50% upfront, 25% at milestone, 25% completion'
    },
    timeline: {
      createdAt: new Date('2024-12-10'),
      expiresAt: new Date('2025-01-10'),
      estimatedDuration: '12 weeks'
    },
    status: 'sent',
    template: 'web-development',
    branding: {
      primaryColor: '#7B7FEB'
    },
    analytics: {
      views: 3,
      lastViewed: new Date('2024-12-12'),
      timeSpent: 450
    },
    sections: [
      {
        id: 'overview',
        type: 'text',
        title: 'Project Overview',
        content: 'We propose to develop a modern, responsive e-commerce website that will transform your online presence and drive sales growth. This comprehensive solution includes custom design, advanced functionality, and seamless user experience optimization.',
        order: 1
      },
      {
        id: 'technical-specs',
        type: 'list',
        title: 'Technical Specifications',
        content: [
          'React.js frontend with TypeScript',
          'Node.js backend with Express framework',
          'PostgreSQL database with Redis caching',
          'Stripe payment integration',
          'AWS hosting with CloudFront CDN',
          'Mobile-responsive design (iOS/Android)',
          'SEO optimization and performance monitoring',
          'SSL security and GDPR compliance'
        ],
        order: 2
      },
      {
        id: 'deliverables',
        type: 'list',
        title: 'Project Deliverables',
        content: [
          'Custom website design and development',
          'Admin dashboard for inventory management',
          'Payment processing system',
          'User authentication and profiles',
          'Order tracking and notifications',
          'Analytics and reporting dashboard',
          'Documentation and training materials',
          '3 months post-launch support'
        ],
        order: 3
      },
      {
        id: 'timeline',
        type: 'text',
        title: 'Development Timeline',
        content: 'Phase 1: Discovery & Design (3 weeks)\nPhase 2: Core Development (6 weeks)\nPhase 3: Testing & Integration (2 weeks)\nPhase 4: Launch & Training (1 week)\n\nRegular milestone reviews every 2 weeks with demo presentations.',
        order: 4
      },
      {
        id: 'investment',
        type: 'text',
        title: 'Investment Breakdown',
        content: 'Total Investment: $25,000\n\nDesign & UX: $5,000\nFrontend Development: $8,000\nBackend Development: $7,000\nTesting & QA: $3,000\nDeployment & Setup: $2,000\n\nPayment Schedule:\n50% ($12,500) - Project initiation\n25% ($6,250) - Mid-project milestone\n25% ($6,250) - Project completion',
        order: 5
      }
    ]
  },
  {
    id: 'marketing-001',
    title: 'Digital Marketing Strategy & Implementation',
    client: {
      name: 'Michael Chen',
      email: 'michael@techstart.io',
      company: 'TechStart Solutions'
    },
    author: {
      name: 'Emma Thompson',
      email: 'emma@marketingpro.com',
      company: 'Marketing Pro Agency'
    },
    financial: {
      amount: 15000,
      currency: 'USD',
      paymentTerms: 'Monthly retainer: $5,000 for 3 months'
    },
    timeline: {
      createdAt: new Date('2024-12-08'),
      expiresAt: new Date('2024-12-22'),
      estimatedDuration: '3 months'
    },
    status: 'viewed',
    template: 'marketing-services',
    branding: {
      primaryColor: '#9D7FE6'
    },
    analytics: {
      views: 5,
      lastViewed: new Date('2024-12-13'),
      timeSpent: 620
    },
    sections: [
      {
        id: 'strategy-overview',
        type: 'text',
        title: 'Marketing Strategy Overview',
        content: 'Our comprehensive digital marketing strategy will position TechStart Solutions as a thought leader in the B2B technology space, drive qualified leads, and accelerate business growth through targeted campaigns and content marketing.',
        order: 1
      },
      {
        id: 'target-audience',
        type: 'text',
        title: 'Target Audience Analysis',
        content: 'Primary: CTOs and IT Directors at mid-market companies (50-500 employees)\nSecondary: Business owners and entrepreneurs in tech-adjacent industries\nTertiary: Technical consultants and system integrators\n\nKey pain points: Legacy system modernization, scalability challenges, security concerns, budget constraints.',
        order: 2
      },
      {
        id: 'services-included',
        type: 'list',
        title: 'Services Included',
        content: [
          'Content strategy and creation (blog posts, whitepapers, case studies)',
          'SEO optimization and keyword research',
          'LinkedIn and Twitter social media management',
          'Email marketing campaigns and automation',
          'Google Ads and LinkedIn advertising',
          'Marketing automation setup (HubSpot/Mailchimp)',
          'Analytics and performance reporting',
          'Monthly strategy consultations'
        ],
        order: 3
      },
      {
        id: 'deliverables-timeline',
        type: 'text',
        title: 'Deliverables & Timeline',
        content: 'Month 1: Strategy development, audience research, content calendar, website audit\nMonth 2: Content creation, ad campaign launch, social media execution, email sequences\nMonth 3: Campaign optimization, performance analysis, recommendations for ongoing growth\n\nWeekly check-ins and monthly comprehensive reports included.',
        order: 4
      },
      {
        id: 'expected-results',
        type: 'list',
        title: 'Expected Results',
        content: [
          '150% increase in qualified leads within 90 days',
          '300% improvement in website organic traffic',
          '50+ new LinkedIn connections with target personas',
          '25% increase in email engagement rates',
          'Establishment of thought leadership presence',
          'Improved search engine rankings for key terms'
        ],
        order: 5
      }
    ]
  },
  {
    id: 'consulting-001',
    title: 'Business Process Optimization Consulting',
    client: {
      name: 'Jennifer Williams',
      email: 'jennifer@retailplus.com',
      company: 'RetailPlus Enterprises'
    },
    author: {
      name: 'David Park',
      email: 'david@bizconsult.com',
      company: 'Business Solutions Consulting'
    },
    financial: {
      amount: 18000,
      currency: 'USD',
      paymentTerms: 'Hourly rate: $200/hour, estimated 90 hours over 8 weeks'
    },
    timeline: {
      createdAt: new Date('2024-12-11'),
      expiresAt: new Date('2024-12-25'),
      estimatedDuration: '8 weeks'
    },
    status: 'sent',
    template: 'consulting',
    branding: {
      primaryColor: '#4CAF50'
    },
    analytics: {
      views: 1,
      lastViewed: new Date('2024-12-11'),
      timeSpent: 180
    },
    sections: [
      {
        id: 'engagement-overview',
        type: 'text',
        title: 'Engagement Overview',
        content: 'This consulting engagement focuses on optimizing RetailPlus Enterprises\' operational processes to improve efficiency, reduce costs, and enhance customer satisfaction. We will conduct a comprehensive analysis and implement strategic improvements across key business functions.',
        order: 1
      },
      {
        id: 'scope-of-work',
        type: 'list',
        title: 'Scope of Work',
        content: [
          'Current state assessment and process mapping',
          'Stakeholder interviews and data analysis',
          'Identification of bottlenecks and inefficiencies',
          'Development of optimized process workflows',
          'Technology recommendations and integration planning',
          'Change management strategy and training materials',
          'Implementation roadmap with success metrics',
          'Post-implementation review and adjustments'
        ],
        order: 2
      },
      {
        id: 'methodology',
        type: 'text',
        title: 'Methodology & Approach',
        content: 'Week 1-2: Discovery and current state analysis\nWeek 3-4: Process mapping and stakeholder interviews\nWeek 5-6: Solution design and recommendations\nWeek 7: Implementation planning and documentation\nWeek 8: Training delivery and knowledge transfer\n\nWe follow Lean Six Sigma principles and use proven change management frameworks.',
        order: 3
      },
      {
        id: 'pricing-structure',
        type: 'pricing',
        title: 'Investment Structure',
        content: {
          headers: ['Service Component', 'Hours', 'Rate', 'Total'],
          rows: [
            { 'Service Component': 'Discovery & Analysis', 'Hours': 25, 'Rate': '$200', 'Total': '$5,000' },
            { 'Service Component': 'Process Design', 'Hours': 30, 'Rate': '$200', 'Total': '$6,000' },
            { 'Service Component': 'Implementation Planning', 'Hours': 20, 'Rate': '$200', 'Total': '$4,000' },
            { 'Service Component': 'Training & Support', 'Hours': 15, 'Rate': '$200', 'Total': '$3,000' }
          ],
          total: 18000
        },
        order: 4
      },
      {
        id: 'expected-outcomes',
        type: 'list',
        title: 'Expected Outcomes',
        content: [
          '20-30% reduction in operational processing time',
          'Improved data accuracy and reporting capabilities',
          'Enhanced customer service response times',
          'Standardized workflows across departments',
          'Clear performance metrics and KPIs',
          'Documented processes for future scaling',
          'Employee training and adoption plan',
          'ROI measurement framework'
        ],
        order: 5
      }
    ]
  }
];

export const getProposalById = (id: string): ProposalData | undefined => {
  return mockProposals.find(proposal => proposal.id === id);
};