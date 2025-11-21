/**
 * Cron Jobs Configuration
 * Automated tasks scheduled to run at specific times
 */

import { processNewsletterSequence } from './emailAutomation';

/**
 * Newsletter Sequence Cron Job
 * Runs daily at 9:00 AM to send scheduled emails
 * 
 * To activate this cron job, use the `schedule` tool with:
 * - type: "cron"
 * - cron: "0 0 9 * * *" (9:00 AM every day)
 * - repeat: true
 * - name: "Newsletter Sequence Automation"
 * - prompt: "Execute processNewsletterSequence() from server/emailAutomation.ts to send scheduled newsletter emails based on subscriber subscription dates"
 */
export async function runNewsletterSequenceCron() {
  console.log('[Cron] Starting newsletter sequence cron job...');
  
  try {
    const result = await processNewsletterSequence();
    
    if (result.success) {
      console.log(`[Cron] Newsletter sequence completed successfully. Sent ${result.emailsSent} emails.`);
    } else {
      console.error('[Cron] Newsletter sequence failed:', result.error);
    }
    
    return result;
    
  } catch (error) {
    console.error('[Cron] Error running newsletter sequence cron job:', error);
    return { success: false, error };
  }
}

/**
 * Manual trigger for testing
 * Call this function to test the cron job without waiting for the scheduled time
 */
export async function testNewsletterCron() {
  console.log('[Test] Manually triggering newsletter sequence...');
  return await runNewsletterSequenceCron();
}
