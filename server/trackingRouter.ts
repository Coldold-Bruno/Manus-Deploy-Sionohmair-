/**
 * Email Tracking Router
 * Tracks email opens and clicks for engagement scoring
 */

import { router, publicProcedure } from './_core/trpc';
import { z } from 'zod';
import { updateEngagementScore } from './emailAutomation';

export const trackingRouter = router({
  /**
   * Track email open
   * Called when the tracking pixel is loaded
   */
  trackOpen: publicProcedure
    .input(
      z.object({
        subscriberId: z.number(),
      })
    )
    .query(async ({ input }) => {
      try {
        await updateEngagementScore(input.subscriberId, 'open');
        
        // Return a 1x1 transparent pixel
        return {
          success: true,
          pixel: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        };
        
      } catch (error) {
        console.error('[Tracking] Error tracking email open:', error);
        return {
          success: false,
          pixel: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        };
      }
    }),

  /**
   * Track email click
   * Called when a tracked link is clicked
   */
  trackClick: publicProcedure
    .input(
      z.object({
        subscriberId: z.number(),
        url: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await updateEngagementScore(input.subscriberId, 'click');
        
        return {
          success: true,
          redirectUrl: input.url,
        };
        
      } catch (error) {
        console.error('[Tracking] Error tracking email click:', error);
        return {
          success: false,
          redirectUrl: input.url,
        };
      }
    }),

  /**
   * Track conversion
   * Called when a subscriber makes a purchase
   */
  trackConversion: publicProcedure
    .input(
      z.object({
        subscriberId: z.number(),
        orderId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await updateEngagementScore(input.subscriberId, 'conversion');
        
        return {
          success: true,
        };
        
      } catch (error) {
        console.error('[Tracking] Error tracking conversion:', error);
        return {
          success: false,
        };
      }
    }),
});
