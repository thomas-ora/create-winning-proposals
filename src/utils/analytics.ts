import { ProposalData } from '@/data/types';

export interface ProposalEvent {
  id: string;
  proposalId: string;
  eventType: 'view' | 'pdf_download' | 'accept' | 'section_view' | 'calculator_use';
  timestamp: string;
  userAgent?: string;
  referrer?: string;
  metadata?: Record<string, any>;
}

export const trackProposalEvent = async (
  proposalId: string, 
  eventType: ProposalEvent['eventType'],
  metadata?: Record<string, any>
): Promise<ProposalEvent> => {
  const event: ProposalEvent = {
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    proposalId,
    eventType,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    referrer: document.referrer || 'direct',
    metadata
  };

  try {
    // Store in localStorage for demo purposes
    // In a real application, this would be an API call to your analytics service
    const existingEvents = JSON.parse(localStorage.getItem('proposalEvents') || '[]');
    existingEvents.push(event);
    localStorage.setItem('proposalEvents', JSON.stringify(existingEvents));

    console.log('Proposal event tracked:', event);
    return event;
  } catch (error) {
    console.error('Error tracking proposal event:', error);
    throw error;
  }
};

export const getProposalEvents = (proposalId: string): ProposalEvent[] => {
  try {
    const events = JSON.parse(localStorage.getItem('proposalEvents') || '[]');
    return events.filter((event: ProposalEvent) => event.proposalId === proposalId);
  } catch (error) {
    console.error('Error retrieving proposal events:', error);
    return [];
  }
};

export const getProposalAnalytics = (proposalId: string) => {
  const events = getProposalEvents(proposalId);
  
  const analytics = {
    totalViews: events.filter(e => e.eventType === 'view').length,
    pdfDownloads: events.filter(e => e.eventType === 'pdf_download').length,
    sectionViews: events.filter(e => e.eventType === 'section_view').length,
    calculatorUses: events.filter(e => e.eventType === 'calculator_use').length,
    lastActivity: events.length > 0 ? new Date(Math.max(...events.map(e => new Date(e.timestamp).getTime()))) : null,
    timeSpent: calculateTimeSpent(events),
    engagementScore: calculateEngagementScore(events)
  };

  return analytics;
};

const calculateTimeSpent = (events: ProposalEvent[]): number => {
  // Simple calculation based on time between first and last event
  if (events.length < 2) return 0;
  
  const viewEvents = events.filter(e => e.eventType === 'view').sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  if (viewEvents.length < 2) return 0;
  
  const firstView = new Date(viewEvents[0].timestamp).getTime();
  const lastView = new Date(viewEvents[viewEvents.length - 1].timestamp).getTime();
  
  return Math.round((lastView - firstView) / 1000); // Return seconds
};

const calculateEngagementScore = (events: ProposalEvent[]): number => {
  // Simple engagement scoring algorithm
  let score = 0;
  
  score += events.filter(e => e.eventType === 'view').length * 10;
  score += events.filter(e => e.eventType === 'section_view').length * 15;
  score += events.filter(e => e.eventType === 'calculator_use').length * 25;
  score += events.filter(e => e.eventType === 'pdf_download').length * 30;
  score += events.filter(e => e.eventType === 'accept').length * 100;
  
  return Math.min(score, 100); // Cap at 100
};