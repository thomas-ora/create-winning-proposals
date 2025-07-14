import { useEffect, useCallback, useRef } from 'react';
import { trackProposalEvent } from '@/utils/analytics';
import { proposalService } from '@/services/proposalService';

interface TrackingState {
  sessionStart: number;
  lastActivity: number;
  sectionsViewed: Set<string>;
  scrollPosition: number;
}

export const useProposalTracking = (proposalId: string) => {
  const trackingState = useRef<TrackingState>({
    sessionStart: Date.now(),
    lastActivity: Date.now(),
    sectionsViewed: new Set(),
    scrollPosition: 0
  });

  // Track initial page view
  useEffect(() => {
    if (proposalId) {
      trackProposalEvent(proposalId, 'view', {
        sessionStart: trackingState.current.sessionStart,
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer || 'direct'
      });
    }
  }, [proposalId]);

  // Track session end on unmount
  useEffect(() => {
    return () => {
      if (proposalId) {
        const sessionDuration = Date.now() - trackingState.current.sessionStart;
        trackProposalEvent(proposalId, 'view', {
          sessionEnd: Date.now(),
          sessionDuration,
          sectionsViewed: Array.from(trackingState.current.sectionsViewed),
          maxScrollPosition: trackingState.current.scrollPosition
        });
      }
    };
  }, [proposalId]);

  // Track scroll position and section views
  const trackScroll = useCallback(() => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    trackingState.current.scrollPosition = Math.max(
      trackingState.current.scrollPosition, 
      scrollPercent
    );
    trackingState.current.lastActivity = Date.now();

    // Check which sections are in view
    const sections = document.querySelectorAll('[data-section-id]');
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInView) {
        const sectionId = section.getAttribute('data-section-id');
        if (sectionId && !trackingState.current.sectionsViewed.has(sectionId)) {
          trackingState.current.sectionsViewed.add(sectionId);
          trackProposalEvent(proposalId, 'section_view', {
            sectionId,
            sectionTitle: section.getAttribute('data-section-title'),
            scrollPosition: scrollPercent,
            timeToView: Date.now() - trackingState.current.sessionStart
          });
        }
      }
    });
  }, [proposalId]);

  // Set up scroll tracking
  useEffect(() => {
    const throttledTrackScroll = throttle(trackScroll, 1000);
    window.addEventListener('scroll', throttledTrackScroll);
    return () => window.removeEventListener('scroll', throttledTrackScroll);
  }, [trackScroll]);

  // Track specific interactions
  const trackInteraction = useCallback((interactionType: string, metadata?: Record<string, any>) => {
    trackProposalEvent(proposalId, 'calculator_use', {
      interactionType,
      timestamp: Date.now(),
      sessionTime: Date.now() - trackingState.current.sessionStart,
      ...metadata
    });
    trackingState.current.lastActivity = Date.now();
  }, [proposalId]);

  const trackCalculatorUse = useCallback((calculatorData: Record<string, any>) => {
    trackInteraction('calculator_interaction', calculatorData);
  }, [trackInteraction]);

  const trackLinkClick = useCallback((linkUrl: string, linkText?: string) => {
    trackInteraction('link_click', {
      url: linkUrl,
      text: linkText,
      external: !linkUrl.startsWith('/') && !linkUrl.startsWith('#')
    });
  }, [trackInteraction]);

  const trackCTAClick = useCallback((ctaType: 'accept' | 'contact' | 'download', metadata?: Record<string, any>) => {
    // Track with both systems for now
    trackProposalEvent(proposalId, ctaType === 'accept' ? 'accept' : 'calculator_use', {
      ctaType,
      ...metadata
    });
    
    // Also track with new Supabase service
    proposalService.trackEvent(proposalId, {
      event_type: ctaType === 'accept' ? 'cta_click' : 'click',
      event_data: {
        ctaType,
        ...metadata
      }
    }).catch(console.error);
  }, [proposalId]);

  return {
    trackCalculatorUse,
    trackLinkClick,
    trackCTAClick,
    trackInteraction
  };
};

// Throttle utility function
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}