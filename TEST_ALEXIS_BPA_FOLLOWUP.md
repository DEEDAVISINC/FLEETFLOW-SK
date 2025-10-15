# Testing Alexis BPA Follow-Up System

## Quick Test Guide

### Test 1: Check if System is Initialized

Open browser console on any page and run:

```javascript
// Check if calendar reminder service is available
console.log(
  'Calendar Service:',
  typeof window !== 'undefined' && localStorage.getItem('alexis-calendar-events')
);

// Check if email monitoring service is available
console.log(
  'Email Monitor:',
  typeof window !== 'undefined' && localStorage.getItem('alexis-email-monitors')
);
```

### Test 2: Initialize BPA Follow-Up via API

```bash
# From terminal
curl -X POST http://localhost:3000/api/alexis/initialize-bpa-followup
```

Or from browser console:

```javascript
fetch('/api/alexis/initialize-bpa-followup', {
  method: 'POST',
})
  .then((res) => res.json())
  .then((data) => {
    console.log('✅ Initialization Result:', data);
    if (data.success) {
      console.log(`📅 Calendar Event ID: ${data.data.calendarEventId}`);
      console.log(`📧 Email Monitor ID: ${data.data.emailMonitorId}`);
      console.log(`⏱️ Days until follow-up: ${data.data.daysUntilFollowUp}`);
    }
  });
```

### Test 3: Check BPA Status

```javascript
fetch('/api/alexis/initialize-bpa-followup')
  .then((res) => res.json())
  .then((data) => {
    console.log('📊 BPA Status:', data);
    if (data.data.initialized) {
      console.log(`✅ System Active`);
      console.log(`📅 Follow-up Date: ${data.data.followUpDate}`);
      console.log(`⏱️ Days Until: ${data.data.daysUntilFollowUp}`);
      console.log(`📧 Email Monitor: ${data.data.emailMonitorActive ? 'Active' : 'Inactive'}`);
    }
  });
```

### Test 4: Access Dashboard Widget

1. Navigate to: `http://localhost:3000/depointe-dashboard`
2. Click on **"Follow-Ups (Alexis)"** tab
3. Verify you see the NAWCAD BPA follow-up card
4. Check for:
   - Title: "BPA Follow-Up: N6833525Q0321"
   - Status badge showing days remaining
   - Submitted date: October 12, 2025
   - Follow-up due date: October 26, 2025
   - Contact: karin.a.quagliato.civ@us.navy.mil
   - Action buttons: Send Email, Mark Received, Postpone

### Test 5: Preview Follow-Up Email

1. In the Dashboard widget, click **"Send Follow-Up Email"** button
2. Modal should open with:
   - Subject: "Following Up: BPA Application N6833525Q0321"
   - To: karin.a.quagliato.civ@us.navy.mil
   - BCC: info@deedavis.biz
   - Full email body with DEPOINTE details
3. Click **Cancel** (don't send yet unless it's actually time)

### Test 6: Test Daily Briefing

```javascript
// Import and test (in browser console after page load)
import { dailyBriefingService } from '/app/services/DailyBriefingService';

// Generate morning briefing
const morningBriefing = dailyBriefingService.generateMorningBriefing();
console.log('🌅 Morning Briefing:', morningBriefing);

// Check pending follow-ups
const followUps = dailyBriefingService.getPendingFollowUps();
console.log('📧 Pending Follow-Ups:', followUps);
```

### Test 7: Verify Calendar Event

```javascript
// Check calendar events in localStorage
const eventsData = localStorage.getItem('alexis-calendar-events');
if (eventsData) {
  const events = JSON.parse(eventsData);
  const bpaEvent = events.find(
    ([id, event]) => event.metadata?.solicitationNumber === 'N6833525Q0321'
  );

  if (bpaEvent) {
    console.log('✅ BPA Calendar Event Found:', bpaEvent[1]);
    console.log('   Title:', bpaEvent[1].title);
    console.log('   Follow-up Date:', bpaEvent[1].startDate);
    console.log('   Reminders:', bpaEvent[1].reminderDates.length);
  } else {
    console.log('❌ BPA event not found');
  }
}
```

### Test 8: Verify Email Monitor

```javascript
// Check email monitors in localStorage
const monitorsData = localStorage.getItem('alexis-email-monitors');
if (monitorsData) {
  const monitors = JSON.parse(monitorsData);
  const bpaMonitor = monitors.find(([id, monitor]) =>
    monitor.subjectContains.includes('N6833525Q0321')
  );

  if (bpaMonitor) {
    console.log('✅ BPA Email Monitor Found:', bpaMonitor[1]);
    console.log('   Monitoring:', bpaMonitor[1].fromAddress);
    console.log('   Subject Keywords:', bpaMonitor[1].subjectContains);
    console.log('   Active:', bpaMonitor[1].active);
  } else {
    console.log('❌ BPA monitor not found');
  }
}
```

## Expected Results

### Successful Setup Should Show:

1. ✅ Calendar event created for October 26, 2025
2. ✅ Email monitor active for karin.a.quagliato.civ@us.navy.mil
3. ✅ Dashboard widget displays BPA follow-up with countdown
4. ✅ Daily briefing includes pending follow-up
5. ✅ Email template ready with all correct details
6. ✅ BCC to info@deedavis.biz included
7. ✅ 4 reminders set (7, 3, 1 days before + day of)
8. ✅ Action buttons functional (Send, Mark Received, Postpone)

## Troubleshooting

### Issue: Nothing shows in dashboard

**Solution**:

1. Refresh the page
2. Click "Refresh" button in the widget
3. Run initialization API: `POST /api/alexis/initialize-bpa-followup`

### Issue: Cannot see Follow-Ups tab

**Solution**:

1. Verify you're on `/depointe-dashboard` (not `/app/depointe-dashboard/page.tsx`)
2. Check that DEPOINTEAICompanyDashboard component is rendering
3. Look for "Follow-Ups (Alexis)" in the navigation tabs

### Issue: Email template not showing

**Solution**:

1. Ensure follow-up date has been reached (Oct 26, 2025)
2. Check that event status is 'pending' not 'completed'
3. Verify templateId is set in event metadata

### Issue: Days countdown incorrect

**Solution**:

1. Check system date/time
2. Verify followUpDate in calendar event is '2025-10-26'
3. Recalculate: should be Oct 26, 2025 - current date

## Manual Reset (if needed)

To completely reset the system:

```javascript
// Clear all Alexis data
localStorage.removeItem('alexis-calendar-events');
localStorage.removeItem('alexis-calendar-reminders');
localStorage.removeItem('alexis-email-monitors');
localStorage.removeItem('alexis-email-alerts');

// Re-initialize
fetch('/api/alexis/initialize-bpa-followup', { method: 'POST' })
  .then((res) => res.json())
  .then((data) => console.log('Re-initialized:', data));
```

## Success Criteria

The system is working correctly if:

- [x] BPA follow-up appears in dashboard with 13-14 days countdown (from Oct 13)
- [x] Email template is pre-populated and correct
- [x] Reminders are set for 7, 3, 1 days before + day of
- [x] Email monitor is watching for responses
- [x] BCC to info@deedavis.biz is included
- [x] Action buttons are functional
- [x] Daily briefings include the follow-up
- [x] System persists across page refreshes

## Next Steps After Testing

Once verified working:

1. ✅ System will automatically remind on Oct 19, 23, 25, and 26
2. ✅ Daily briefings will show countdown
3. ✅ Email template will be ready to send on Oct 26
4. ✅ If response received, reminder auto-cancels
5. ✅ Can manually send, postpone, or mark received anytime

## Production Use

On **October 26, 2025**:

1. Check dashboard for the follow-up alert
2. Click "Send Follow-Up Email"
3. Review the pre-drafted email
4. Click "Send Email" to deliver with BCC
5. System will auto-mark as complete

---

**System implemented and ready for testing!** 🚀
