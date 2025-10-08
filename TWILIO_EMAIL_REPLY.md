# EMAIL REPLY TO TWILIO SUPPORT

**To:** Twilio Support (Uzi) **Subject:** Re: Toll-Free Verification - Updated Submission with SMS
Consent Documentation **Case Reference:** [Your Ticket Number]

---

## EMAIL DRAFT

---

**Subject:** Re: Toll-Free Verification - Updated Submission with SMS Consent Documentation

Hi Uzi,

Thank you for your feedback regarding our toll-free verification submission. I appreciate you taking
the time to review and identify the missing consent documentation.

I have addressed all the issues you mentioned and am ready to resubmit our toll-free verification
with the correct opt-in information. Here's what I've implemented:

## SMS Consent & Opt-In Documentation

### 1. Public Consent Page (NEW)

I have created a comprehensive SMS consent page that is now live and publicly accessible:

**URL:** https://fleetflowapp.com/sms-consent

This page clearly demonstrates:

- How users consent to receive SMS messages (registration checkbox + account settings)
- The exact opt-in language shown to users
- Types of messages we send (load alerts, shipment updates, dispatch notifications, payment
  reminders, service updates)
- Message frequency information (5-20 messages per week for active users)
- Message & data rates disclosure
- Opt-out instructions (STOP, UNSUBSCRIBE, CANCEL, END, QUIT)
- HELP keyword information
- Our contact information

### 2. How Users Consent to Receive Messages

Users consent to receive SMS messages in two ways:

**A. During Registration:** When creating a FleetFlow account, users must check a consent checkbox
that reads:

_"I agree to receive SMS text messages from FleetFlow regarding load alerts, shipment updates,
dispatch notifications, payment reminders, and service updates. Message frequency varies based on
your activity and preferences. Message and data rates may apply. You can opt-out at any time by
replying STOP to any message. Reply HELP for assistance."_

This checkbox is not pre-checked and requires active user consent. We record:

- Timestamp of consent
- IP address
- User agent
- The exact opt-in text shown to the user

**B. Through Account Settings:** Existing users can opt-in by navigating to their account settings,
enabling SMS notifications, and reviewing/accepting the same consent agreement.

### 3. Opt-Out Process

Users can opt-out at any time by:

- **SMS Reply:** Texting STOP, UNSUBSCRIBE, CANCEL, END, or QUIT to any message (processed
  automatically via webhook)
- **Account Settings:** Disabling SMS notifications in their FleetFlow account

We have implemented an automated webhook at `/api/twilio/sms-webhook` that:

- Immediately processes opt-out requests
- Revokes SMS consent in our database
- Sends confirmation message
- Blocks all future SMS to that user

### 4. Sample Message Examples

Here are three examples of actual SMS messages we send:

**Example 1 (Load Alert):** "New load available: Chicago, IL → Dallas, TX | Dry Van | 45,000 lbs |
$2,850 | Pickup: 10/15 | View: fleetflowapp.com/loads/12345"

**Example 2 (Shipment Update):** "Shipment #FF-2025-0042 status update: Delivered successfully at
2:30 PM. POD uploaded. Invoice ready for processing."

**Example 3 (Payment Reminder):** "Payment reminder: Invoice #INV-2025-0125 ($3,200) is due in 3
days. Pay now: fleetflowapp.com/invoices"

### 5. Message Frequency

Message frequency varies based on user activity and business operations. Active users receive
approximately 5-20 messages per week. Users can adjust notification preferences in their account
settings at any time.

### 6. HELP Keyword Response

When users text HELP to our number, they receive: "FleetFlow SMS Help: You are receiving logistics
notifications. Reply STOP to unsubscribe. Msg&data rates may apply. Support:
support@fleetflowapp.com or 1-800-FLEETFLOW"

## Additional Information

**Business Name:** FleetFlow **Business Website:** https://fleetflowapp.com **Business Type:**
Technology/SaaS Platform - Logistics Management **Contact Email:** support@fleetflowapp.com
**Support Phone:** 1-800-FLEETFLOW (1-800-353-3835)

**Use Case:** FleetFlow is a logistics management SaaS platform that sends SMS notifications to
freight brokers, dispatchers, and carriers. Messages include load alerts, shipment updates, dispatch
notifications, payment reminders, and critical operational alerts.

**Compliance Documentation:**

- SMS Consent Page: https://fleetflowapp.com/sms-consent
- Privacy Policy: https://fleetflowapp.com/privacy-policy
- Terms of Service: https://fleetflowapp.com/terms-of-service

## Next Steps

I am ready to resubmit our toll-free verification with this updated information. I have also
implemented:

✅ Automated STOP/HELP/START keyword processing ✅ Consent tracking with audit trails ✅ Pre-send
consent validation (blocks SMS if no consent) ✅ Comprehensive consent documentation

Please let me know if you need any additional information or clarification. I'm happy to provide
screenshots of our opt-in form or any other documentation you may require.

I strongly believe this updated submission addresses all the requirements outlined in the Twilio
toll-free verification guidelines, and I look forward to approval so we can continue providing
critical logistics notifications to our users.

Thank you for your assistance!

Best regards, Dee Davis FleetFlow support@fleetflowapp.com

---

## TIPS FOR SENDING THIS EMAIL

1. **Replace [Your Ticket Number]** with the actual case/ticket number from Uzi's email

2. **Before sending**, make sure:
   - [ ] `/sms-consent` page is deployed and live
   - [ ] You can access https://fleetflowapp.com/sms-consent without login
   - [ ] All links work properly

3. **Consider adding**:
   - A screenshot of your registration form showing the SMS consent checkbox
   - A screenshot of the consent page
   - These visuals help Twilio reviewers quickly verify your implementation

4. **After sending the email**, immediately:
   - Edit your rejected Twilio submission with this info
   - Or delete and create a new submission
   - Reference this email in your submission notes

5. **Keep it professional** - Twilio support appreciates clear, well-documented responses

---

## ALTERNATIVE: Shorter Version

If you prefer a more concise email:

---

Hi Uzi,

Thank you for the feedback on our toll-free verification.

I've implemented all required SMS consent documentation:

**Consent Page (Live):** https://fleetflowapp.com/sms-consent

This page shows:

- How users opt-in (registration checkbox with explicit consent language)
- Message types and frequency
- Opt-out instructions (STOP keyword)
- All required disclosures

**Key Points:**

- Users must actively check consent box during registration
- We record timestamp, IP, and user agent for each consent
- Automated webhook processes STOP/HELP/START keywords
- Sample messages and full documentation available on consent page

I'm resubmitting the verification now with this information. Please let me know if you need anything
else.

Best regards, Dee Davis FleetFlow support@fleetflowapp.com

---

Choose whichever version fits your communication style better!
