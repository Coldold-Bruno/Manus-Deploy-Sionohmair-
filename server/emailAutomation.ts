/**
 * Email Automation System
 * Automatically sends newsletter sequence emails based on subscriber's subscription date
 */

import { getDb } from './db';
import { subscribers } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { onboardingSequence } from './emailSequences';
import { sendEmail } from './emailService';

/**
 * Calculate which day of the sequence a subscriber is on
 * @param subscribedAt - Subscription timestamp
 * @returns Day number (0, 1, 3, 5, 7, 10, 14) or null if no email should be sent
 */
function calculateSequenceDay(subscribedAt: Date): number | null {
  const now = new Date();
  const daysSinceSubscription = Math.floor((now.getTime() - subscribedAt.getTime()) / (1000 * 60 * 60 * 24));
  
  // Sequence days: 0, 1, 3, 5, 7, 10, 14
  const sequenceDays = [0, 1, 3, 5, 7, 10, 14];
  
  // Find the appropriate day in the sequence
  for (const day of sequenceDays) {
    if (daysSinceSubscription === day) {
      return day;
    }
  }
  
  return null;
}

/**
 * Process newsletter sequence for all active subscribers
 * Should be run daily via cron job
 */
export async function processNewsletterSequence() {
  try {
    console.log('[Email Automation] Starting newsletter sequence processing...');
    
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }
    
    // Get all active subscribers
    const activeSubscribers = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.status, 'active'));
    
    console.log(`[Email Automation] Found ${activeSubscribers.length} active subscribers`);
    
    let emailsSent = 0;
    
    for (const subscriber of activeSubscribers) {
      const sequenceDay = calculateSequenceDay(subscriber.subscribedAt);
      
      // Skip if no email should be sent today
      if (sequenceDay === null) {
        continue;
      }
      
      // Skip if this email was already sent
      if (subscriber.lastEmailSent !== null && subscriber.lastEmailSent >= sequenceDay) {
        continue;
      }
      
      // Find the email template for this day
      const emailTemplate = onboardingSequence.find(email => email.day === sequenceDay);
      
      if (!emailTemplate) {
        console.warn(`[Email Automation] No template found for day ${sequenceDay}`);
        continue;
      }
      
      try {
        // Generate email content
        const htmlContent = emailTemplate.getContent({
          name: subscriber.name || undefined,
          email: subscriber.email,
        });
        
        // Send email
        await sendEmail({
          to: subscriber.email,
          subject: emailTemplate.subject,
          html: htmlContent,
        });
        
        // Update subscriber's lastEmailSent
        await db
          .update(subscribers)
          .set({ lastEmailSent: sequenceDay })
          .where(eq(subscribers.id, subscriber.id));
        
        emailsSent++;
        console.log(`[Email Automation] Sent day ${sequenceDay} email to ${subscriber.email}`);
        
      } catch (error) {
        console.error(`[Email Automation] Failed to send email to ${subscriber.email}:`, error);
      }
    }
    
    console.log(`[Email Automation] Processing complete. Sent ${emailsSent} emails.`);
    return { success: true, emailsSent };
    
  } catch (error) {
    console.error('[Email Automation] Error processing newsletter sequence:', error);
    return { success: false, error };
  }
}

/**
 * Update engagement score based on subscriber activity
 * @param subscriberId - Subscriber ID
 * @param action - Action type: 'open', 'click', 'conversion'
 */
export async function updateEngagementScore(
  subscriberId: number,
  action: 'open' | 'click' | 'conversion'
) {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }
    
    const subscriber = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.id, subscriberId))
      .limit(1);
    
    if (subscriber.length === 0) {
      return { success: false, error: 'Subscriber not found' };
    }
    
    const currentScore = subscriber[0].engagementScore || 0;
    
    // Score increments
    const scoreIncrements = {
      open: 5,
      click: 15,
      conversion: 50,
    };
    
    const newScore = Math.min(100, currentScore + scoreIncrements[action]);
    
    await db
      .update(subscribers)
      .set({ engagementScore: newScore })
      .where(eq(subscribers.id, subscriberId));
    
    console.log(`[Engagement] Updated score for subscriber ${subscriberId}: ${currentScore} → ${newScore}`);
    
    return { success: true, newScore };
    
  } catch (error) {
    console.error('[Engagement] Error updating engagement score:', error);
    return { success: false, error };
  }
}

/**
 * Segment subscribers by interest and engagement
 * @returns Segmented subscriber lists
 */
export async function segmentSubscribers() {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }
    
    const allSubscribers = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.status, 'active'));
    
    const segments = {
      diagnostic: allSubscribers.filter((s: any) => s.interests === 'diagnostic'),
      formation: allSubscribers.filter((s: any) => s.interests === 'formation'),
      transformation: allSubscribers.filter((s: any) => s.interests === 'transformation'),
      general: allSubscribers.filter((s: any) => s.interests === 'general'),
      
      // Engagement-based segments
      highEngagement: allSubscribers.filter((s: any) => (s.engagementScore || 0) >= 70),
      mediumEngagement: allSubscribers.filter((s: any) => (s.engagementScore || 0) >= 30 && (s.engagementScore || 0) < 70),
      lowEngagement: allSubscribers.filter((s: any) => (s.engagementScore || 0) < 30),
    };
    
    return segments;
    
  } catch (error) {
    console.error('[Segmentation] Error segmenting subscribers:', error);
    return null;
  }
}
