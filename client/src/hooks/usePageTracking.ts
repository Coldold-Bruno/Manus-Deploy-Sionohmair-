import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

/**
 * Hook to automatically track page views for lead scoring
 * 
 * Usage: Add `usePageTracking()` at the top of any page component
 * 
 * This hook will:
 * - Track page views with duration
 * - Send tracking data to the backend for lead scoring
 * - Only track if user has an email (from newsletter or auth)
 */
export function usePageTracking() {
  const [location] = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const lastLocationRef = useRef<string>(location);
  
  const trackMutation = trpc.leadScoring.trackActivity.useMutation();

  useEffect(() => {
    // Reset start time when location changes
    if (location !== lastLocationRef.current) {
      startTimeRef.current = Date.now();
      lastLocationRef.current = location;
    }

    // Track page view on mount and location change
    const trackPageView = () => {
      // Try to get email from localStorage (newsletter subscription or auth)
      const email = localStorage.getItem("userEmail");
      
      if (!email) {
        // No email available, skip tracking
        return;
      }

      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000); // seconds

      trackMutation.mutate({
        email,
        activityType: "page_view",
        activityData: {
          page: location,
          duration,
          timestamp: new Date().toISOString(),
        },
      });
    };

    // Track on location change
    trackPageView();

    // Track on page unload (when leaving the page)
    const handleBeforeUnload = () => {
      const email = localStorage.getItem("userEmail");
      if (!email) return;

      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);

      // Use sendBeacon for reliable tracking on page unload
      if (typeof navigator.sendBeacon === 'function') {
        const data = JSON.stringify({
          email,
          activityType: "page_view",
          activityData: {
            page: location,
            duration,
            timestamp: new Date().toISOString(),
          },
        });
        
        // Note: This would need a separate endpoint, for now we skip it
        // navigator.sendBeacon('/api/track', data);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location, trackMutation]);
}

/**
 * Helper function to track specific actions (calculator, download, form submit)
 */
export function trackAction(
  email: string,
  activityType: "calculator_use" | "download" | "form_submit" | "payment_intent" | "payment_completed",
  activityData?: Record<string, any>
) {
  // Store email in localStorage for future page tracking
  if (email) {
    localStorage.setItem("userEmail", email);
  }

  // This will be called directly from components
  // The actual mutation will be triggered from the component
  return {
    email,
    activityType,
    activityData,
  };
}
