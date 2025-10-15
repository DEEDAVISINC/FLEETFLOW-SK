/**
 * Initialize NAWCAD BPA Follow-Up System
 * This script sets up the follow-up automation for the submitted BPA application
 */

import { calendarReminderService } from './CalendarReminderService';
import { emailMonitoringService } from './EmailMonitoringService';

/**
 * Initialize the NAWCAD BPA follow-up system
 */
export function initializeNAWCADBPAFollowUp() {
  console.log('🏛️ Initializing NAWCAD BPA Follow-Up System for Alexis Best...');

  // BPA Details
  const solicitationNumber = 'N6833525Q0321';
  const submissionDate = 'October 12, 2025';
  const followUpDate = '2025-10-26'; // 14 days after submission
  const contactEmail = 'karin.a.quagliato.civ@us.navy.mil';
  const contactName = 'Karin Quagliato';

  try {
    // 1. Create calendar event with reminders
    const calendarEvent = calendarReminderService.createBPAFollowUpEvent(
      solicitationNumber,
      submissionDate,
      followUpDate,
      contactEmail
    );

    console.log(`✅ Calendar event created: ${calendarEvent.title}`);
    console.log(`   Event ID: ${calendarEvent.id}`);
    console.log(`   Follow-up due: ${followUpDate}`);
    console.log(
      `   Reminders set for: 7, 3, and 1 days before, plus on the day`
    );

    // 2. Create email monitor
    const emailMonitor = emailMonitoringService.createBPAResponseMonitor(
      solicitationNumber,
      contactEmail,
      calendarEvent.id
    );

    console.log(`✅ Email monitor created for: ${contactEmail}`);
    console.log(`   Monitor ID: ${emailMonitor.id}`);
    console.log(`   Watching for subject containing: ${solicitationNumber}`);
    console.log(`   Action on receive: Cancel follow-up reminder`);

    // 3. Log summary
    console.log('\n📊 NAWCAD BPA Follow-Up System Summary:');
    console.log('─────────────────────────────────────────');
    console.log(`   Solicitation: ${solicitationNumber}`);
    console.log(`   Submitted: ${submissionDate}`);
    console.log(`   Follow-up Due: ${followUpDate}`);
    console.log(`   Contact: ${contactName} (${contactEmail})`);
    console.log(`   Calendar Event ID: ${calendarEvent.id}`);
    console.log(`   Email Monitor ID: ${emailMonitor.id}`);
    console.log('─────────────────────────────────────────');
    console.log('\n✅ Alexis Best is now monitoring this BPA application');
    console.log('   - Daily briefings will include countdown');
    console.log('   - Email template ready for Oct 26, 2025');
    console.log('   - Automatic cancellation if response received');
    console.log('   - BCC to info@deedavis.biz included\n');

    return {
      success: true,
      calendarEventId: calendarEvent.id,
      emailMonitorId: emailMonitor.id,
      followUpDate,
      daysUntilFollowUp: Math.ceil(
        (new Date(followUpDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ),
    };
  } catch (error) {
    console.error('❌ Failed to initialize BPA follow-up system:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if BPA follow-up is already initialized
 */
export function isBPAFollowUpInitialized(): boolean {
  const events = calendarReminderService.getAllEvents();
  return events.some(
    (event) =>
      event.metadata?.solicitationNumber === 'N6833525Q0321' &&
      event.status === 'pending'
  );
}

/**
 * Get BPA follow-up status
 */
export function getBPAFollowUpStatus() {
  const events = calendarReminderService.getAllEvents();
  const bpaEvent = events.find(
    (event) =>
      event.metadata?.solicitationNumber === 'N6833525Q0321' &&
      event.status === 'pending'
  );

  if (!bpaEvent) {
    return {
      initialized: false,
      message: 'BPA follow-up not initialized',
    };
  }

  const daysUntil = calendarReminderService.getDaysUntilEvent(bpaEvent.id);
  const monitors = emailMonitoringService.getActiveMonitors();
  const emailMonitor = monitors.find((m) =>
    m.subjectContains.includes('N6833525Q0321')
  );

  return {
    initialized: true,
    eventId: bpaEvent.id,
    monitorId: emailMonitor?.id,
    followUpDate: bpaEvent.startDate,
    daysUntilFollowUp: daysUntil,
    status: daysUntil !== null && daysUntil < 0 ? 'overdue' : 'pending',
    emailMonitorActive: emailMonitor?.active || false,
  };
}

// Auto-initialize on module load if in browser and not already set up
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!isBPAFollowUpInitialized()) {
        initializeNAWCADBPAFollowUp();
      }
    });
  } else {
    // DOM is already ready
    if (!isBPAFollowUpInitialized()) {
      initializeNAWCADBPAFollowUp();
    }
  }
}
