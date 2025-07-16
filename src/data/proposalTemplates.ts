import { ProposalData } from './types';

export interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  estimatedValue: { min: number; max: number };
  duration: string;
  sections: Array<{
    id: string;
    type: 'text' | 'list' | 'pricing' | 'roi_calculator';
    title: string;
    content: any;
    order: number;
  }>;
  financial: {
    currency: string;
    paymentTerms: string;
  };
}

export const proposalTemplates: ProposalTemplate[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Complete website development with modern technologies, responsive design, and CMS integration.',
    category: 'Development',
    icon: '💻',
    estimatedValue: { min: 15000, max: 50000 },
    duration: '8-16 weeks',
    financial: {
      currency: 'USD',
      paymentTerms: '50% upfront, 25% at milestone, 25% upon completion'
    },
    sections: [
      {
        id: 'project-overview',
        type: 'text',
        title: 'Project Overview',
        content: 'We propose to develop a modern, responsive website that will transform your online presence and drive business growth. Our comprehensive solution includes custom design, advanced functionality, and seamless user experience optimization tailored to your specific industry needs.\n\nOur approach combines cutting-edge technologies with proven design principles to create a website that not only looks exceptional but performs at the highest level across all devices and platforms.',
        order: 1
      },
      {
        id: 'technical-specifications',
        type: 'list',
        title: 'Technical Specifications',
        content: [
          'React.js or Next.js frontend with TypeScript for type safety',
          'Node.js backend with Express.js framework',
          'PostgreSQL or MongoDB database with proper indexing',
          'RESTful API design with comprehensive documentation',
          'AWS or Vercel hosting with CDN integration',
          'SSL certificate and security best practices',
          'Mobile-responsive design optimized for all devices',
          'SEO optimization and performance monitoring',
          'Google Analytics and conversion tracking setup',
          'GDPR compliance and accessibility standards (WCAG 2.1)'
        ],
        order: 2
      },
      {
        id: 'development-phases',
        type: 'text',
        title: 'Development Phases',
        content: 'Phase 1: Discovery & Planning (2-3 weeks)\n- Requirements gathering and analysis\n- User experience research and competitor analysis\n- Technical architecture planning\n- Project timeline and milestone definition\n\nPhase 2: Design & Prototyping (3-4 weeks)\n- Wireframing and user flow mapping\n- Visual design and brand integration\n- Interactive prototypes and user testing\n- Design system creation\n\nPhase 3: Development & Implementation (6-8 weeks)\n- Frontend development with responsive design\n- Backend API development and database setup\n- Content management system integration\n- Third-party service integrations\n\nPhase 4: Testing & Launch (1-2 weeks)\n- Comprehensive testing across devices and browsers\n- Performance optimization and security audits\n- Content migration and final reviews\n- Launch coordination and post-launch monitoring',
        order: 3
      },
      {
        id: 'hosting-maintenance',
        type: 'text',
        title: 'Hosting & Maintenance',
        content: 'We provide comprehensive hosting and maintenance solutions to ensure your website remains secure, fast, and up-to-date.\n\nHosting Package Includes:\n- Premium cloud hosting with 99.9% uptime guarantee\n- SSL certificate and daily automated backups\n- Content Delivery Network (CDN) for global performance\n- Advanced security monitoring and malware protection\n\nMaintenance Services:\n- Monthly security updates and patches\n- Performance monitoring and optimization\n- Content updates and technical support\n- Analytics reporting and recommendations\n\nFirst 3 months of hosting and maintenance included in project cost.',
        order: 4
      },
      {
        id: 'roi-calculator',
        type: 'roi_calculator',
        title: 'Website ROI Calculator',
        content: '',
        order: 5
      }
    ]
  },
  {
    id: 'marketing-services',
    name: 'Marketing Services',
    description: 'Comprehensive digital marketing strategy with multi-channel campaigns, content creation, and performance analytics.',
    category: 'Marketing',
    icon: '📈',
    estimatedValue: { min: 5000, max: 25000 },
    duration: '3-6 months',
    financial: {
      currency: 'USD',
      paymentTerms: 'Monthly retainer with 3-month minimum commitment'
    },
    sections: [
      {
        id: 'marketing-strategy',
        type: 'text',
        title: 'Digital Marketing Strategy',
        content: 'Our comprehensive digital marketing strategy is designed to position your brand as an industry leader, drive qualified leads, and accelerate sustainable business growth through data-driven campaigns and strategic content marketing.\n\nWe begin with a thorough analysis of your current market position, competitor landscape, and target audience behavior to develop a customized approach that maximizes ROI and delivers measurable results within the first 90 days.',
        order: 1
      },
      {
        id: 'target-audience',
        type: 'text',
        title: 'Target Audience Analysis',
        content: 'Primary Audience: Decision-makers and C-suite executives in mid-market companies (50-500 employees) seeking innovative solutions to drive growth and operational efficiency.\n\nSecondary Audience: Department heads and managers responsible for vendor selection and budget allocation, particularly in technology, finance, and operations.\n\nTertiary Audience: Industry consultants, partners, and influencers who can amplify your message and provide valuable referrals.\n\nKey Pain Points Addressed:\n- Inefficient processes and outdated systems\n- Scalability challenges and resource constraints\n- Budget optimization and ROI measurement\n- Competitive differentiation and market positioning',
        order: 2
      },
      {
        id: 'marketing-channels',
        type: 'list',
        title: 'Marketing Channels & Tactics',
        content: [
          'Content Marketing: Blog posts, whitepapers, case studies, and industry reports',
          'Search Engine Optimization (SEO) with targeted keyword strategies',
          'LinkedIn and Twitter social media management and thought leadership',
          'Email marketing automation with personalized nurture sequences',
          'Google Ads and LinkedIn advertising with precise audience targeting',
          'Marketing automation setup using HubSpot or similar platforms',
          'Webinar series and virtual event marketing',
          'Industry conference participation and speaking opportunities',
          'Influencer partnerships and guest posting campaigns',
          'Conversion rate optimization for website and landing pages'
        ],
        order: 3
      },
      {
        id: 'deliverables-timeline',
        type: 'text',
        title: 'Deliverables & Timeline',
        content: 'Month 1: Foundation & Setup\n- Marketing audit and competitive analysis\n- Brand messaging and positioning refinement\n- Content calendar development (3 months ahead)\n- Marketing automation setup and lead scoring\n- Initial campaign launches (SEO, social media)\n\nMonth 2-3: Content Creation & Optimization\n- 8-12 blog posts and thought leadership articles\n- 2-3 comprehensive whitepapers or case studies\n- Social media content creation and community building\n- Email campaign development and segmentation\n- Paid advertising campaign optimization\n\nMonth 4-6: Scale & Optimize\n- Advanced lead nurturing campaigns\n- Webinar series and event marketing\n- Performance analysis and strategy refinement\n- A/B testing for all marketing materials\n- ROI reporting and future planning\n\nWeekly progress calls and monthly comprehensive performance reports included.',
        order: 4
      },
      {
        id: 'success-metrics',
        type: 'list',
        title: 'Success Metrics & KPIs',
        content: [
          '200% increase in qualified leads within 90 days',
          '150% improvement in website organic traffic and search rankings',
          '75+ new high-value LinkedIn connections with target personas',
          '35% increase in email engagement rates and list growth',
          'Establishment of thought leadership with 50+ industry mentions',
          '25% improvement in cost-per-acquisition across all channels',
          '300% increase in content engagement and social media following',
          'Achievement of top 3 search rankings for 10+ target keywords'
        ],
        order: 5
      }
    ]
  },
  {
    id: 'consulting-services',
    name: 'Consulting Services',
    description: 'Business process optimization and strategic consulting with deliverable-based milestones and expert guidance.',
    category: 'Consulting',
    icon: '🎯',
    estimatedValue: { min: 10000, max: 75000 },
    duration: '6-12 weeks',
    financial: {
      currency: 'USD',
      paymentTerms: 'Weekly invoicing based on hours worked, with milestone bonuses'
    },
    sections: [
      {
        id: 'consulting-overview',
        type: 'text',
        title: 'Consulting Engagement Overview',
        content: 'This strategic consulting engagement focuses on comprehensive business process optimization, operational efficiency improvement, and sustainable growth strategy development. Our proven methodology combines industry best practices with innovative solutions tailored to your specific business challenges.\n\nOur team of senior consultants brings over 15 years of combined experience across multiple industries, ensuring you receive expert guidance that delivers measurable results and long-term competitive advantages.',
        order: 1
      },
      {
        id: 'scope-deliverables',
        type: 'list',
        title: 'Scope of Work & Deliverables',
        content: [
          'Comprehensive business process audit and current state assessment',
          'Stakeholder interviews and cross-functional team workshops',
          'Data analysis and performance benchmarking against industry standards',
          'Process mapping and workflow optimization recommendations',
          'Technology assessment and digital transformation roadmap',
          'Change management strategy and employee training programs',
          'Implementation timeline with detailed project plans and milestones',
          'KPI framework development and performance monitoring systems',
          'Risk assessment and mitigation strategies',
          'Post-implementation review and continuous improvement protocols'
        ],
        order: 2
      },
      {
        id: 'consulting-methodology',
        type: 'text',
        title: 'Methodology & Approach',
        content: 'Week 1-2: Discovery & Assessment\n- Current state analysis and documentation\n- Stakeholder interviews and requirement gathering\n- Data collection and process observation\n- Initial findings presentation and validation\n\nWeek 3-4: Analysis & Design\n- Process mapping and bottleneck identification\n- Root cause analysis and impact assessment\n- Solution design and recommendation development\n- Technology evaluation and vendor assessment\n\nWeek 5-6: Implementation Planning\n- Detailed project roadmap creation\n- Resource allocation and timeline development\n- Change management strategy formulation\n- Training program design and material creation\n\nWeek 7-8: Execution Support & Knowledge Transfer\n- Implementation guidance and oversight\n- Team training and skill development\n- Documentation and standard operating procedures\n- Success metrics establishment and monitoring setup\n\nWe follow Lean Six Sigma principles and utilize proven change management frameworks including Kotter\'s 8-Step Process and ADKAR methodology.',
        order: 3
      },
      {
        id: 'pricing-structure',
        type: 'pricing',
        title: 'Investment Structure',
        content: {
          headers: ['Service Component', 'Hours', 'Rate', 'Total'],
          rows: [
            { 'Service Component': 'Senior Consultant (Lead)', 'Hours': 160, 'Rate': '$250', 'Total': '$40,000' },
            { 'Service Component': 'Business Analyst', 'Hours': 120, 'Rate': '$175', 'Total': '$21,000' },
            { 'Service Component': 'Project Coordination', 'Hours': 80, 'Rate': '$125', 'Total': '$10,000' },
            { 'Service Component': 'Documentation & Training', 'Hours': 60, 'Rate': '$150', 'Total': '$9,000' }
          ],
          total: 80000
        },
        order: 4
      },
      {
        id: 'expected-outcomes',
        type: 'list',
        title: 'Expected Outcomes & Benefits',
        content: [
          '25-40% reduction in operational processing time and costs',
          'Improved data accuracy and real-time reporting capabilities',
          'Enhanced customer service response times and satisfaction scores',
          'Standardized workflows and procedures across all departments',
          'Clear performance metrics and KPI dashboard implementation',
          'Comprehensive documentation for future scaling and onboarding',
          'Employee training programs and adoption support',
          'ROI measurement framework with quarterly review processes',
          'Risk mitigation strategies and contingency planning',
          'Competitive advantage through operational excellence'
        ],
        order: 5
      }
    ]
  },
  {
    id: 'saas-product',
    name: 'SaaS Product',
    description: 'Software-as-a-Service solution with tiered pricing, feature roadmap, and comprehensive onboarding support.',
    category: 'Software',
    icon: '☁️',
    estimatedValue: { min: 2000, max: 15000 },
    duration: 'Ongoing subscription',
    financial: {
      currency: 'USD',
      paymentTerms: 'Monthly or annual subscription with 14-day free trial'
    },
    sections: [
      {
        id: 'product-overview',
        type: 'text',
        title: 'Product Overview',
        content: 'Our comprehensive SaaS platform is designed to streamline your business operations, enhance team collaboration, and drive measurable growth through intelligent automation and data-driven insights.\n\nBuilt with enterprise-grade security and scalability in mind, our solution integrates seamlessly with your existing tools and workflows, providing immediate value while supporting your long-term business objectives. With over 10,000 satisfied customers and a 99.9% uptime guarantee, you can trust our platform to power your success.',
        order: 1
      },
      {
        id: 'core-features',
        type: 'list',
        title: 'Core Features & Capabilities',
        content: [
          'Advanced dashboard with real-time analytics and customizable reporting',
          'Workflow automation with visual builder and pre-built templates',
          'Team collaboration tools with file sharing and communication',
          'API integrations with 500+ popular business applications',
          'Role-based access control and enterprise-grade security',
          'Mobile applications for iOS and Android with offline capabilities',
          'Advanced data export and backup with multiple format options',
          'Custom branding and white-label options for enterprise clients',
          'AI-powered insights and predictive analytics',
          '24/7 customer support with dedicated success manager'
        ],
        order: 2
      },
      {
        id: 'pricing-tiers',
        type: 'pricing',
        title: 'Pricing Plans',
        content: {
          headers: ['Plan', 'Users', 'Features', 'Monthly Price'],
          rows: [
            { 'Plan': 'Starter', 'Users': 'Up to 5', 'Features': 'Basic features + Email support', 'Monthly Price': '$49' },
            { 'Plan': 'Professional', 'Users': 'Up to 25', 'Features': 'Advanced features + Priority support', 'Monthly Price': '$149' },
            { 'Plan': 'Business', 'Users': 'Up to 100', 'Features': 'Premium features + Phone support', 'Monthly Price': '$349' },
            { 'Plan': 'Enterprise', 'Users': 'Unlimited', 'Features': 'All features + Dedicated manager', 'Monthly Price': '$999' }
          ],
          total: 0
        },
        order: 3
      },
      {
        id: 'onboarding-support',
        type: 'text',
        title: 'Onboarding & Implementation',
        content: 'Week 1: Account Setup & Configuration\n- Dedicated onboarding specialist assignment\n- Initial system configuration and customization\n- User account creation and permission setup\n- Basic training session for administrators\n\nWeek 2: Data Migration & Integration\n- Secure data migration from existing systems\n- Third-party application integrations\n- Workflow automation setup and testing\n- Advanced user training and best practices\n\nWeek 3: Go-Live & Optimization\n- System go-live with real-time monitoring\n- User adoption tracking and support\n- Performance optimization and fine-tuning\n- Success metrics establishment and reporting\n\nOngoing Support:\n- 24/7 technical support via chat, email, and phone\n- Regular check-ins with your dedicated success manager\n- Quarterly business reviews and optimization recommendations\n- Access to exclusive webinars and training resources',
        order: 4
      },
      {
        id: 'roi-benefits',
        type: 'list',
        title: 'ROI & Business Benefits',
        content: [
          '74% of employees report working faster with automation',
          '40% productivity boost with AI workflows for businesses',
          '60-95% reduction in repetitive tasks',
          '25% reduction in operational costs within first 6 months',
          '90% improvement in process visibility and accountability',
          '50% faster onboarding for new team members',
          '35% increase in customer satisfaction through better service delivery',
          'Over 90% of SMBs considering automation solutions in 2025',
          'Payback period of 4-6 months for most implementations',
          'Scalable solution that grows with your business needs',
          'Compliance with SOC 2, GDPR, and other industry standards',
          'Source: 2025 Business Automation Industry Report - Vena Solutions'
        ],
        order: 5
      }
    ]
  }
];

export const getTemplateById = (id: string): ProposalTemplate | undefined => {
  return proposalTemplates.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): ProposalTemplate[] => {
  return proposalTemplates.filter(template => template.category === category);
};

export const getAllCategories = (): string[] => {
  return [...new Set(proposalTemplates.map(template => template.category))];
};