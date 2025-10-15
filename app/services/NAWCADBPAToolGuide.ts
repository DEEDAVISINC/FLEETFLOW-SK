/**
 * NAWCAD BPA Tool Guide
 * Complete guide for using the Lakehurst BPA Tool system
 * Based on official NAWCAD Vendor Training (Oct 2023)
 */

export interface BPAToolProcess {
  stage: 'initial_bpa_response' | 'awaiting_solicitations' | 'bid_submission' | 'questions' | 'award';
  description: string;
  actions: string[];
}

export class NAWCADBPAToolGuide {
  /**
   * Complete step-by-step guide for NAWCAD BPA Tool
   */
  getCompleteGuide(): string {
    return `
═══════════════════════════════════════════════════════════════════
           NAWCAD LAKEHURST BPA TOOL - COMPLETE GUIDE
           For DEPOINTE (DEE DAVIS INC dba DEPOINTE)
═══════════════════════════════════════════════════════════════════

📋 OVERVIEW

The Naval Air Warfare Center – Aircraft Division (NAWCAD) uses a Blanket
Purchase Agreement (BPA) Tool to manage acquisitions. This replaced the
Unison platform as of September 30, 2023.

The BPA Tool ensures:
✓ New solicitations are consistently communicated to vendors
✓ Vendor responses are collected and fairly evaluated
✓ All correspondence is preserved for audit readiness

⚠️ IMPORTANT: The tool does NOT support reverse auctions. You must provide
your BEST OFFER in your initial bid response.

═══════════════════════════════════════════════════════════════════

STEP 1: ESTABLISH YOUR BPA (ONE-TIME SETUP)
═══════════════════════════════════════════════════════════════════

1.1 SUBMIT INITIAL BPA RESPONSE

   Submit your BPA qualification package to:
   📧 Email: karin.a.quagliato.civ@us.navy.mil
   📋 Subject: N6833525Q0321 - BPA Response from DEPOINTE (WOSB)

   Include:
   ☐ CAGE Code
   ☐ UEID (Unique Entity Identifier)
   ☐ SAM.gov registration confirmation
   ☐ Capabilities statement
   ☐ DD Form 2345 (or application status)
   ☐ WOSB certification
   ☐ Past performance references

1.2 AWAIT BPA ESTABLISHMENT NOTIFICATION

   Once approved, you will be added to the BPA calling list for:
   📦 General Freight and Trucking

   You will then receive solicitations via email as they become available.

═══════════════════════════════════════════════════════════════════

STEP 2: RECEIVING NEW SOLICITATIONS (ONGOING PROCESS)
═══════════════════════════════════════════════════════════════════

2.1 EMAIL NOTIFICATIONS

   When a new solicitation is released, you will receive an email:

   📧 FROM: NAVAIR_Acquisition@us.navy.mil
   📋 SUBJECT: [Buy Number] - [Assigned Vendor Specific Number]

   Example Subject: "BUY-2024-12345 - VENDOR-98765"

   ▸ Buy Number = The solicitation/requirement number
   ▸ Assigned Vendor Specific Number = YOUR unique bid identifier
     (randomly generated for each solicitation)

2.2 EMAIL ATTACHMENT

   Each email will contain an EXCEL file with 4 tabs:

   📑 TAB 1: GENERAL INFORMATION
      • Request details
      • Delivery information
      • Shipping requirements
      • Vendor-specific information
      • Point of contact

   📑 TAB 2: BIDDING REQUIREMENTS
      • Specific requirements for THIS solicitation
      • ⚠️ REVIEW CAREFULLY before bidding
      • May include special certifications, capabilities, etc.

   📑 TAB 3: BUY TERMS
      • Terms and conditions for THIS solicitation
      • Payment terms
      • Delivery terms
      • ⚠️ REVIEW CAREFULLY before bidding

   📑 TAB 4: LINE ITEM INPUT
      • Specific items being requested
      • **THIS IS WHERE YOU ENTER YOUR BID**
      • Green column headings indicate where to input:
        ✏️ Seller Description
        ✏️ Delivery Days
        ✏️ Unit Price

═══════════════════════════════════════════════════════════════════

STEP 3: PREPARING YOUR BID
═══════════════════════════════════════════════════════════════════

3.1 REVIEW THE SOLICITATION

   ✓ Open the Excel file attachment
   ✓ Read General Information tab
   ✓ Review Bidding Requirements tab (all requirements must be met)
   ✓ Review Buy Terms tab (ensure you can comply)
   ✓ Note delivery location, deadline, and special instructions

3.2 DETERMINE IF YOU CAN BID

   Ask yourself:
   ☐ Do we meet all Bidding Requirements?
   ☐ Can we comply with all Buy Terms?
   ☐ Can we deliver to the specified location?
   ☐ Can we meet the delivery timeframe?
   ☐ Is this within our capability and capacity?

   If NO to any question, do NOT submit a bid or contact buyer to clarify.

3.3 CALCULATE YOUR PRICING

   ⚠️ CRITICAL: Provide your BEST OFFER

   The BPA Tool does NOT support reverse auctions. You will NOT have an
   opportunity to lower your price after submission.

   Consider:
   • Item weight, dimensions, and quantity
   • Delivery location and distance
   • Delivery timeframe required
   • Special handling requirements
   • Fuel costs (current GSA rates)
   • Insurance and liability
   • Administrative costs
   • Profit margin

   🎯 GOAL: Submit the LOWEST price you can while maintaining quality service

3.4 COMPLETE THE LINE ITEM INPUT TAB

   For EACH line item, fill in the GREEN columns:

   ✏️ Seller Description:
      • Your description of what you're providing
      • Part numbers (if applicable)
      • Any relevant specifications

   ✏️ Delivery Days:
      • Number of calendar days from order receipt to delivery
      • Be realistic but competitive
      • Examples: 1 day, 3 days, 5 days, etc.

   ✏️ Unit Price:
      • Price per unit (each, pound, mile, etc.)
      • Enter as a number (e.g., 150.00, not $150.00)
      • Ensure pricing is complete and accurate

3.5 SAVE YOUR BID FILE

   📁 File > Save As
   📁 Recommended naming: BuyNumber_DEPOINTE_Bid.xlsx
   📁 Example: BUY-2024-12345_DEPOINTE_Bid.xlsx

   ✓ Save to a location you can easily find
   ✓ Keep a copy for your records

═══════════════════════════════════════════════════════════════════

STEP 4: SUBMITTING YOUR BID
═══════════════════════════════════════════════════════════════════

4.1 HOW TO SUBMIT

   📧 REPLY to the original solicitation email
      (from NAVAIR_Acquisition@us.navy.mil)

   📎 ATTACH your completed Excel file

   ✏️ SUBJECT: Keep the original subject line
      (Buy Number - Assigned Vendor Specific Number)

   ✏️ EMAIL BODY (suggested):

      "Dear Contracting Officer,

      Please find attached our bid response for [Buy Number].

      DEE DAVIS INC dba DEPOINTE confirms:
      ✓ We meet all Bidding Requirements
      ✓ We accept all Buy Terms
      ✓ We can deliver within the specified timeframe
      ✓ Our pricing reflects our best offer

      Please contact us if you have any questions.

      Respectfully,
      [Your Name]
      [Your Title]
      DEPOINTE
      [Phone Number]
      [Email]"

4.2 SUBMISSION DEADLINE

   ⚠️ Submit BEFORE the deadline specified in the General Information tab

   Tips:
   • Submit early when possible
   • Don't wait until the last minute
   • Technical issues may occur
   • Email delivery times may vary

4.3 CONFIRMATION

   ✓ Request a read receipt (optional but recommended)
   ✓ Save a copy of your sent email
   ✓ Note the submission date/time
   ✓ Keep the original solicitation email

═══════════════════════════════════════════════════════════════════

STEP 5: ASKING QUESTIONS
═══════════════════════════════════════════════════════════════════

5.1 HOW TO SUBMIT QUESTIONS

   If you need clarification on any requirement:

   📧 REPLY to the original solicitation email
      (from NAVAIR_Acquisition@us.navy.mil)

   ✏️ SUBJECT: Keep the original subject line + "QUESTION"
      Example: "BUY-2024-12345 - VENDOR-98765 - QUESTION"

   ✏️ EMAIL BODY:
      • State your question clearly
      • Reference the specific requirement or line item
      • Provide your contact information

5.2 QUESTION RESPONSE TIMELINE

   • Questions are periodically reviewed by the assigned buyer
   • Response time varies by buyer availability
   • Submit questions EARLY to allow time for clarification
   • Answers may be shared with all vendors (if they affect competition)

5.3 QUESTION EXAMPLES

   Good Questions:
   ✓ "For Line Item 1, is the delivery location inside or outside the gate?"
   ✓ "Does the shipment require security clearance or escort?"
   ✓ "Can delivery be scheduled for a specific time window?"
   ✓ "Are there any restrictions on carrier type or equipment?"

═══════════════════════════════════════════════════════════════════

STEP 6: AWARD NOTIFICATION
═══════════════════════════════════════════════════════════════════

6.1 HOW YOU'LL BE NOTIFIED

   If your bid is selected as the LOWEST and TECHNICALLY ACCEPTABLE:

   📧 The buyer will contact you DIRECTLY
   📞 May be via email or phone
   🏆 Notification typically includes:
      • Award confirmation
      • Purchase order number
      • Delivery instructions
      • Payment information
      • Point of contact

6.2 AWARD CRITERIA

   Your bid must be BOTH:
   1️⃣ LOWEST PRICE among all qualifying bids
   2️⃣ TECHNICALLY ACCEPTABLE (meets all requirements)

   If you're not the lowest bidder, you will NOT be notified.

6.3 AFTER AWARD

   ✓ Acknowledge the award immediately
   ✓ Confirm delivery date/time
   ✓ Coordinate with buyer if needed
   ✓ Execute the delivery with excellence
   ✓ Submit invoice per instructions (WAWF or credit card)
   ✓ Maintain performance records

═══════════════════════════════════════════════════════════════════

STEP 7: MAINTAINING YOUR BPA STATUS
═══════════════════════════════════════════════════════════════════

7.1 ACTIVE PARTICIPATION REQUIRED

   ⚠️ Your BPA may be CANCELLED if:
   • You consistently do NOT submit bids
   • You have poor performance on awarded orders
   • You fail to acknowledge orders
   • Your SAM.gov registration expires

   🎯 Best Practices:
   ✓ Monitor your email daily for new solicitations
   ✓ Set up email filters for NAVAIR_Acquisition@us.navy.mil
   ✓ Respond to ALL solicitations (bid or decline with reason)
   ✓ Maintain excellent performance on all awards
   ✓ Keep SAM.gov registration current

7.2 SAM.GOV MAINTENANCE

   ✓ Renew SAM.gov registration ANNUALLY
   ✓ Update any changes to:
      • Business address
      • Points of contact
      • Banking information
      • Certifications (WOSB, etc.)
      • NAICS codes
   ✓ Notify NAWCAD of major changes

7.3 COMMUNICATION

   Always respond to communications from:
   📧 NAVAIR_Acquisition@us.navy.mil
   📧 karin.a.quagliato.civ@us.navy.mil (BPA Program Manager)

   Keep your contact information current!

═══════════════════════════════════════════════════════════════════

EMAIL FILTERS & ORGANIZATION
═══════════════════════════════════════════════════════════════════

RECOMMENDED EMAIL SETUP:

1. Create folder: "NAWCAD BPA - Active Solicitations"
2. Create folder: "NAWCAD BPA - Awarded"
3. Create folder: "NAWCAD BPA - Not Awarded"

Email Filter Rules:
• FROM: NAVAIR_Acquisition@us.navy.mil
  → Move to "NAWCAD BPA - Active Solicitations"
  → Flag for follow-up
  → Set reminder for deadline

When you submit a bid:
• Move to subfolder: "Submitted - Awaiting Award"

When awarded:
• Move to "NAWCAD BPA - Awarded"
• Add to performance tracking system

═══════════════════════════════════════════════════════════════════

QUICK REFERENCE CHECKLIST
═══════════════════════════════════════════════════════════════════

☐ STEP 1: Submit initial BPA qualification package (ONE TIME)
☐ STEP 2: Monitor email for solicitations from NAVAIR_Acquisition@us.navy.mil
☐ STEP 3: Review Excel attachment (4 tabs)
☐ STEP 4: Complete Line Item Input tab (green columns)
☐ STEP 5: Reply to email with completed Excel file
☐ STEP 6: Await award notification from buyer
☐ STEP 7: Maintain active participation and SAM.gov registration

═══════════════════════════════════════════════════════════════════

CONTACT INFORMATION
═══════════════════════════════════════════════════════════════════

BPA Program Manager:
Karin Quagliato
karin.a.quagliato.civ@us.navy.mil
(240) 587-2339

Solicitation Notifications:
NAVAIR_Acquisition@us.navy.mil

Your Company (DEPOINTE):
[YOUR EMAIL]
[YOUR PHONE]
Available: 24/7 for urgent matters

═══════════════════════════════════════════════════════════════════

                      END OF BPA TOOL GUIDE

═══════════════════════════════════════════════════════════════════
`;
  }

  /**
   * Get quick start guide for immediate action
   */
  getQuickStartGuide(): string {
    return `
🚀 NAWCAD BPA TOOL - QUICK START GUIDE

1️⃣ FIRST TIME? Submit your BPA qualification package to:
   karin.a.quagliato.civ@us.navy.mil
   Subject: N6833525Q0321 - BPA Response from DEPOINTE (WOSB)

2️⃣ GOT A SOLICITATION EMAIL from NAVAIR_Acquisition@us.navy.mil?
   → Open the Excel attachment
   → Review all 4 tabs
   → Complete the green columns in "Line Item Input" tab
   → Reply to the email with your completed file

3️⃣ QUESTIONS? Reply to the original email with "QUESTION" in subject

4️⃣ AWARD? Buyer will contact you directly if you win

⚠️ REMEMBER: Provide your BEST OFFER - no reverse auctions!
`;
  }

  /**
   * Get bid submission template email
   */
  getBidSubmissionTemplate(buyNumber: string, vendorNumber: string): string {
    return `
Subject: ${buyNumber} - ${vendorNumber} - BID RESPONSE

Dear Contracting Officer,

Please find attached our bid response for ${buyNumber}.

DEE DAVIS INC dba DEPOINTE confirms:
✓ We meet all Bidding Requirements stated in the solicitation
✓ We accept all Buy Terms as specified
✓ We can deliver within the specified timeframe
✓ Our pricing reflects our best and final offer
✓ All line items have been completed in the attached Excel file

We are prepared to execute this requirement with the same level of excellence
that has earned us a 99.8% on-time delivery record and zero safety incidents
over the past three years.

If you have any questions or require additional information, please contact us
immediately at the number below.

Respectfully submitted,

[YOUR NAME]
[YOUR TITLE]
DEE DAVIS INC dba DEPOINTE
DOT: 4250594 | MC: 1647572 | WOSB Certified
Phone: [YOUR PHONE]
Email: [YOUR EMAIL]
Available 24/7 for urgent matters

Attachment: ${buyNumber}_DEPOINTE_Bid.xlsx
`;
  }

  /**
   * Get question submission template
   */
  getQuestionTemplate(buyNumber: string, vendorNumber: string, lineItem?: string): string {
    return `
Subject: ${buyNumber} - ${vendorNumber} - QUESTION

Dear Contracting Officer,

We are preparing our bid response for ${buyNumber} and require clarification
on the following:

${lineItem ? `REGARDING: Line Item ${lineItem}` : 'REGARDING: General Requirements'}

QUESTION:
[State your specific question here]

This clarification will help ensure we provide an accurate and compliant bid.

Thank you for your assistance.

Respectfully,

[YOUR NAME]
[YOUR TITLE]
DEE DAVIS INC dba DEPOINTE
Phone: [YOUR PHONE]
Email: [YOUR EMAIL]
`;
  }

  /**
   * Validate bid submission checklist
   */
  getBidSubmissionChecklist(): string[] {
    return [
      '☐ Reviewed General Information tab',
      '☐ Reviewed all Bidding Requirements - we meet ALL requirements',
      '☐ Reviewed all Buy Terms - we can comply with ALL terms',
      '☐ Completed Seller Description for all line items',
      '☐ Entered realistic Delivery Days for all line items',
      '☐ Calculated and entered Unit Price for all line items',
      '☐ Pricing represents our BEST OFFER (no reverse auction opportunity)',
      '☐ Saved Excel file with completed green columns',
      '☐ File saved as: [BuyNumber]_DEPOINTE_Bid.xlsx',
      '☐ Prepared email reply to NAVAIR_Acquisition@us.navy.mil',
      '☐ Kept original subject line with Buy Number and Vendor Number',
      '☐ Attached completed Excel file to reply',
      '☐ Submitting BEFORE the deadline',
      '☐ Kept copy of bid for our records',
      '☐ Set reminder to follow up if no response in reasonable time',
    ];
  }
}

export default NAWCADBPAToolGuide;
`;
  }
}

export default NAWCADBPAToolGuide;
