/**
 * Adaptive BPA Training System for FreightFlow RFx
 * Provides contextual, step-by-step training that adapts to user progress
 * Integrates with the NAWCAD BPA Tool workflow
 */

export interface UserProgress {
  userId: string;
  completedSteps: string[];
  currentPhase:
    | 'setup'
    | 'awaiting_solicitations'
    | 'active_bidding'
    | 'post_award'
    | 'expert';
  bpaEstablished: boolean;
  bidsSubmitted: number;
  awardsReceived: number;
  lastActivity: Date;
  knowledgeChecks: {
    [key: string]: boolean;
  };
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  phase: string;
  priority: 'critical' | 'important' | 'helpful';
  estimatedMinutes: number;
  prerequisites: string[];
  content: string;
  checkpoints: string[];
  nextSteps: string[];
}

export interface ContextualHelp {
  context: string;
  title: string;
  quickTip: string;
  detailedHelp: string;
  relatedModules: string[];
  actions?: Array<{
    label: string;
    action: string;
    type: 'primary' | 'secondary';
  }>;
}

export class AdaptiveBPATrainingSystem {
  private readonly modules: TrainingModule[] = [
    // PHASE 1: SETUP MODULES
    {
      id: 'bpa-overview',
      title: 'What is a Blanket Purchase Agreement (BPA)?',
      description:
        'Understanding the BPA concept and how it differs from traditional contracts',
      phase: 'setup',
      priority: 'critical',
      estimatedMinutes: 5,
      prerequisites: [],
      content: `
# What is a Blanket Purchase Agreement (BPA)?

## 🎯 Key Concept
A BPA is NOT a contract. It's a **streamlined method** for acquiring supplies and services on an **as-needed basis** from qualified sources.

## How It Works
1. **One-Time Setup**: You submit qualifications and get approved
2. **Ongoing Opportunities**: Government sends you specific requirements (called "calls" or "orders")
3. **Competitive Bidding**: You bid on each call individually
4. **No Obligation**: Government has no minimum purchase requirement

## Think of it like this:
- Traditional RFP = One big project, one competition, one contract
- BPA = Approved vendor list → Many small projects → Compete for each one

## Benefits for DEPOINTE
✅ Less paperwork for each opportunity (already pre-qualified)
✅ Faster awards (simplified acquisition procedures)
✅ Multiple opportunities from same agency
✅ Builds relationship with government buyer
✅ Perfect for freight/trucking (many small shipments vs. one big contract)

## NAWCAD BPA Specifics
- **Location**: Naval Air Warfare Center Aircraft Division (Lakehurst, NJ)
- **Commodity**: General Freight and Trucking
- **Tool**: Lakehurst BPA Tool (email-based, Excel submissions)
- **Set-Aside**: Small Business (WOSB qualifies!)
- **Individual Order Limit**: Up to $7.5M per order (most will be much smaller)
`,
      checkpoints: [
        'I understand a BPA is not a contract',
        'I understand we compete for individual calls/orders',
        'I understand there is no guaranteed minimum business',
      ],
      nextSteps: ['bpa-initial-submission', 'sam-gov-registration'],
    },

    {
      id: 'sam-gov-registration',
      title: 'SAM.gov Registration Requirements',
      description: 'How to verify and maintain your SAM.gov registration',
      phase: 'setup',
      priority: 'critical',
      estimatedMinutes: 10,
      prerequisites: [],
      content: `
# SAM.gov Registration - REQUIRED for BPA

## ⚠️ Critical Requirement
You CANNOT participate in federal BPAs without an active SAM.gov registration.

## What You Need

### 1. CAGE Code
- Commercial and Government Entity Code
- Unique identifier for your business
- **How to Get**: Automatically assigned when you register in SAM.gov
- **Status for DEPOINTE**: ${this.getCageCodeStatus()}

### 2. UEI (Unique Entity Identifier)
- Replaced DUNS number in April 2022
- 12-character alphanumeric identifier
- **How to Get**: Automatically assigned via SAM.gov
- **Status for DEPOINTE**: ${this.getUEIStatus()}

### 3. Active SAM.gov Registration
- Must be renewed ANNUALLY
- Expires if not renewed
- **Check Status**: https://sam.gov/content/entity-registration
- **Status for DEPOINTE**: ${this.getSAMStatus()}

## Registration Process (If Needed)

### Step 1: Gather Information
- Business legal name and DBA
- Tax ID (EIN)
- Business address and mailing address
- Banking information (for EFT payments)
- NAICS codes (484110, 484121, 488510)
- Business point of contact
- Electronic Business POC (EBusiness)

### Step 2: Register at SAM.gov
1. Go to https://sam.gov
2. Click "Get Started" → "Register Entity"
3. Follow the step-by-step wizard
4. Complete all required fields
5. Submit for review

### Step 3: Validation Period
- Takes 7-10 business days for initial registration
- IRS TIN validation required
- Banking information validation required
- **TIP**: Don't wait until last minute!

### Step 4: Representations & Certifications
- Complete FAR 52.212-3 (Commercial Items)
- Complete DFARS 252.212-7000 (DoD)
- Select WOSB designation
- Select applicable set-asides
- **These are in SAM.gov under "Representations and Certifications"**

## Annual Renewal
⚠️ SAM.gov registration expires every 365 days

**Set Multiple Reminders:**
- 90 days before expiration
- 60 days before expiration
- 30 days before expiration
- 7 days before expiration

**Renewal Process**: Log in to SAM.gov → Update → Review → Submit

## For NAWCAD BPA Submission
You will need to provide:
✓ CAGE Code: ______________
✓ UEI Number: ______________
✓ SAM.gov Expiration Date: ______________

## Verification Before Submitting BPA
1. Log in to SAM.gov
2. View your entity registration
3. Screenshot or print your entity summary
4. Confirm "Active" status
5. Include in BPA submission package
`,
      checkpoints: [
        'I have verified our SAM.gov registration is active',
        'I have our CAGE Code documented',
        'I have our UEI documented',
        'I have set reminders for annual renewal',
      ],
      nextSteps: ['dd-form-2345', 'bpa-initial-submission'],
    },

    {
      id: 'dd-form-2345',
      title: 'DD Form 2345 - Export Control Compliance',
      description:
        'Understanding and obtaining DD Form 2345 for access to controlled drawings',
      phase: 'setup',
      priority: 'important',
      estimatedMinutes: 15,
      prerequisites: [],
      content: `
# DD Form 2345 - Militarily Critical Technical Data Agreement

## What Is It?
DD Form 2345 is a certification that allows your company to access drawings and technical data that are subject to export control laws.

## Why NAWCAD Requires It
Many NAWCAD requirements involve equipment and systems with:
- Military specifications
- Controlled technical data
- Export-controlled drawings
- ITAR (International Traffic in Arms Regulations) materials

## ⚠️ Important to Know
✅ You CAN be issued a BPA without DD Form 2345
❌ You may NOT be eligible to receive controlled drawings until approved
💡 This means you might miss bidding opportunities that require technical drawings

## How to Apply

### Step 1: Visit the Joint Certification Program (JCP)
URL: https://public.logisticsinformationservice.dla.mil/PublicHome/jcp/default.aspx

### Step 2: Create Account
- Click "Register"
- Complete company information
- Designate company representative

### Step 3: Complete DD Form 2345 Application
**Required Information:**
- Company legal name and address
- CAGE Code (must have SAM.gov registration first)
- Points of contact
- Facility Security Clearance (if applicable)
- Foreign ownership disclosure
- Technology Security/Transfer Control Plan

### Step 4: Submit Supporting Documents
- Articles of Incorporation
- Organizational chart
- Security procedures document
- Foreign national employee disclosure
- Training records (ITAR/EAR compliance)

### Step 5: Wait for Approval
- Processing time: 30-60 days typically
- May require additional documentation
- Approval is facility-specific
- Valid for 2 years (renewable)

## What If I Don't Have It Yet?

### Option 1: Apply Immediately (Recommended)
Start the application process NOW, even before submitting BPA response.

### Option 2: Disclose Status in BPA Submission
In your BPA response, state:

"DD Form 2345 application submitted on [DATE] via Joint Certification Program.
Currently pending approval. We commit to completing this certification within
60 days and will notify NAWCAD upon approval. We acknowledge that we may not
be eligible to bid on requirements involving controlled technical data until
approval is obtained."

### Option 3: Bid on Non-Drawing Requirements
Many freight/trucking requirements don't involve technical drawings:
✓ Point-to-point transportation
✓ Commercial items shipment
✓ Standard logistics services
✓ Emergency deliveries

## For DEPOINTE (Freight/Trucking)
**Good News**: Many general freight BPA calls won't require DD Form 2345 because:
- You're transporting items, not manufacturing them
- Standard trucking services don't need technical drawings
- Commercial freight specifications are not export-controlled

**However**: Having DD Form 2345 opens MORE opportunities, including:
- Shipping of sensitive military equipment
- Deliveries requiring technical specs knowledge
- Higher-value, specialized shipments

## Action Items
☐ Decide: Apply for DD Form 2345 now OR wait and see?
☐ If applying: Gather required documents
☐ If waiting: Prepare disclosure statement for BPA submission
☐ Track application status if submitted
`,
      checkpoints: [
        'I understand what DD Form 2345 is for',
        'I know we can get BPA without it but may miss some opportunities',
        'I have decided our approach (apply now or disclose pending)',
      ],
      nextSteps: ['bpa-initial-submission'],
    },

    {
      id: 'bpa-initial-submission',
      title: 'Submitting Your Initial BPA Response',
      description:
        'Step-by-step guide to submitting your BPA qualification package',
      phase: 'setup',
      priority: 'critical',
      estimatedMinutes: 30,
      prerequisites: ['bpa-overview', 'sam-gov-registration'],
      content: `
# Initial BPA Response Submission - Complete Checklist

## 📧 Submission Details

**TO**: karin.a.quagliato.civ@us.navy.mil
**SUBJECT**: N6833525Q0321 - BPA Response from DEPOINTE (WOSB)
**SOLICITATION**: N6833525Q0321-26
**DEADLINE**: March 11, 2026, 1:00 PM EST

## 📋 Required Documents Checklist

### 1. Cover Letter / Email Body
✓ Introduction of DEPOINTE (DEE DAVIS INC dba DEPOINTE)
✓ WOSB certification status
✓ Intent to participate in BPA program
✓ Commitment to respond to call orders

**Template Available**: Click "Generate Cover Letter" below

### 2. Required Information (FAR 13.303)
✓ **CAGE Code**: _________________
✓ **UEI Number**: _________________
✓ **SAM.gov Status**: Active (include expiration date)

### 3. Capabilities Statement
Must include:
✓ **Primary Business Practice/Trade**: "Freight Transportation and Logistics Services"
✓ **Manufacturer or Supplier/Distributor**: "Supplier/Distributor"
✓ **Core Capabilities**:
  - Fleet specifications (48-53 ft trailers)
  - Geographic coverage
  - DOT/MC numbers (4250594 / 1647572)
  - 24/7 operations
  - GPS tracking
  - WOSB certification

**Template Available**: Click "Generate Capabilities Statement" below

### 4. SAM.gov Registration Confirmation
✓ Screenshot or PDF of SAM.gov entity summary
✓ Shows "Active" status
✓ Shows expiration date
✓ Shows WOSB designation

**How to Get**: Log in to SAM.gov → Entity Management → View Entity → Print/Screenshot

### 5. DD Form 2345 (or Status Disclosure)
Choose one:
☐ Copy of approved DD Form 2345 (if you have it)
☐ Status disclosure: "Application submitted [DATE], pending approval"
☐ Status disclosure: "Will apply within 30 days of BPA award"

### 6. WOSB Certification
✓ SBA WOSB certification letter/document
✓ Or SAM.gov screenshot showing WOSB designation

### 7. Past Performance References
Minimum 3 references demonstrating:
✓ Transportation services experience
✓ Government or large enterprise clients
✓ On-time performance
✓ Safety record

**Format**:
- Client name
- Point of contact name & phone
- Services provided
- Contract value
- Performance period
- Key achievements

### 8. Supporting Documents (Optional but Recommended)
☐ Certificate of Insurance (Liability, Cargo, Workers Comp)
☐ DOT/MC Authority documentation
☐ Company profile / brochure
☐ Key personnel resumes
☐ Equipment list
☐ Safety records / DOT ratings

## 📝 Writing Your Response

### Email Body Template:

\`\`\`
Subject: N6833525Q0321 - BPA Response from DEPOINTE (WOSB)

Dear Ms. Quagliato,

DEE DAVIS INC dba DEPOINTE, a certified Woman-Owned Small Business (WOSB),
respectfully submits this response to Synopsis/Solicitation N6833525Q0321-26
for General Freight and Trucking.

We are interested in establishing a Blanket Purchase Agreement with NAVAIR
NAWC AD to provide transportation and logistics services in support of your
mission. We understand this BPA will allow us to compete for individual call
orders through the Lakehurst BPA Tool.

REQUIRED INFORMATION:
• CAGE Code: [YOUR CAGE CODE]
• UEI Number: [YOUR UEI]
• SAM.gov Status: Active (Expires: [DATE])
• Business Type: Woman-Owned Small Business (WOSB)
• Primary Trade: Freight Transportation and Logistics Services
• Classification: Supplier/Distributor (Non-Manufacturer)

CORE QUALIFICATIONS:
✓ DOT #4250594 / MC #1647572
✓ Active SAM.gov registration with WOSB designation
✓ 99.8% on-time delivery performance
✓ Zero safety incidents (past 3 years)
✓ 24/7 operations with nationwide coverage
✓ Real-time GPS tracking and monitoring
✓ Experience with military installations and federal agencies

ATTACHED DOCUMENTS:
1. Complete BPA Response Package (PDF)
2. Capabilities Statement
3. SAM.gov Registration Confirmation
4. WOSB Certification
5. DD Form 2345 Status: [STATUS]
6. Past Performance References (3)
7. Insurance Certificates
8. DOT/MC Authority Documents

We commit to actively participating in the BPA program by:
• Monitoring for call orders through the Lakehurst BPA Tool
• Submitting competitive bids on relevant opportunities
• Acknowledging all awarded orders promptly
• Maintaining excellent performance on all deliveries
• Keeping our SAM.gov registration current

Thank you for your consideration. We look forward to supporting NAWCAD's
mission and demonstrating the same level of excellence that has earned us a
perfect compliance record and outstanding customer satisfaction ratings.

Please contact me if you require any additional information.

Respectfully,

[YOUR NAME]
[YOUR TITLE]
DEE DAVIS INC dba DEPOINTE
[PHONE]
[EMAIL]
\`\`\`

## 🚀 Before You Hit Send

### Final Checklist:
☐ All required information provided (CAGE, UEI, SAM.gov status)
☐ All required documents attached
☐ Email subject line correct: "N6833525Q0321 - BPA Response from DEPOINTE (WOSB)"
☐ Sending to: karin.a.quagliato.civ@us.navy.mil
☐ Submitting BEFORE deadline: March 11, 2026, 1:00 PM EST
☐ Request read receipt (optional)
☐ Copy saved for records

### After Submission:
✓ Save sent email confirmation
✓ Save all attachments in permanent folder
✓ Set reminder to follow up in 2 weeks if no response
✓ Begin monitoring email for NAVAIR_Acquisition@us.navy.mil
✓ Complete training modules for "Awaiting Solicitations" phase

## ⏱️ Timeline Expectations

**Immediate**: You receive auto-reply (if configured)
**1-2 weeks**: Contracting officer reviews submissions
**2-4 weeks**: You may be contacted for clarifications or approval
**Variable**: Rolling submissions accepted throughout BPA program lifetime

**No response?** Follow up after 2-3 weeks:
"Following up on our BPA response submitted [DATE] for N6833525Q0321.
Please confirm receipt and advise if any additional information is needed."
`,
      checkpoints: [
        'I have gathered all required information (CAGE, UEI, SAM.gov)',
        'I have prepared all required documents',
        'I have reviewed the email template and customized it',
        'I am ready to submit before the deadline',
      ],
      nextSteps: ['post-submission-monitoring', 'email-setup'],
    },

    // PHASE 2: AWAITING SOLICITATIONS
    {
      id: 'email-setup',
      title: 'Email Setup for BPA Notifications',
      description: 'Configure your email to never miss a solicitation',
      phase: 'awaiting_solicitations',
      priority: 'critical',
      estimatedMinutes: 10,
      prerequisites: ['bpa-initial-submission'],
      content: `
# Email Setup - Never Miss a Solicitation!

## 🎯 Goal
Ensure you receive and promptly act on ALL solicitations from NAWCAD.

## 📧 Key Email Address to Monitor

**Primary**: NAVAIR_Acquisition@us.navy.mil
- This is where ALL solicitations will come from
- Subject line will contain: [Buy Number] - [Your Vendor Number]
- Email will have Excel attachment

**Secondary**: karin.a.quagliato.civ@us.navy.mil
- BPA program manager
- General communications

## 🔔 Email Filter Setup

### Gmail
1. Click gear icon → "See all settings"
2. Go to "Filters and Blocked Addresses"
3. Click "Create a new filter"
4. **From**: NAVAIR_Acquisition@us.navy.mil
5. Click "Create filter"
6. Select:
   ☑ Star it
   ☑ Apply label "NAWCAD-BPA-Solicitations"
   ☑ Never send to spam
   ☑ Mark as important
7. Optional: Forward to additional addresses
8. Click "Create filter"

### Outlook
1. Right-click any email from NAVAIR_Acquisition@us.navy.mil
2. Select "Rules" → "Create Rule"
3. From: NAVAIR_Acquisition@us.navy.mil
4. Actions:
   ☑ Move to folder: "NAWCAD BPA Solicitations"
   ☑ Flag message
   ☑ Play a sound (optional)
   ☑ Display a Desktop Alert
5. Click "OK"

### Apple Mail
1. Mail → Preferences → Rules
2. Click "Add Rule"
3. Description: "NAWCAD BPA Solicitations"
4. If: From → Contains → NAVAIR_Acquisition@us.navy.mil
5. Perform actions:
   - Move to mailbox: "NAWCAD BPA"
   - Mark as Flagged
   - Play sound (optional)
6. Click "OK"

## 📁 Folder Organization

Create these folders/labels:

\`\`\`
📁 NAWCAD BPA Program
   📁 Active Solicitations (Awaiting Action)
   📁 Bids Submitted (Awaiting Award)
   📁 Awarded Orders (Active Deliveries)
   📁 Completed Orders (Archive)
   📁 Not Bid (Declined Opportunities)
   📁 Program Communications
\`\`\`

## ⏰ Notification Setup

### Mobile Notifications
1. Install email app on phone
2. Enable push notifications for NAWCAD folder
3. Set VIP/Priority for NAVAIR_Acquisition@us.navy.mil
4. Consider: Text-to-email forwarding for urgent solicitations

### Desktop Notifications
✓ Enable browser notifications
✓ Enable desktop app notifications
✓ Set custom sound for NAWCAD emails

### Backup Monitoring
- Assign backup person to monitor this email
- Share folder access with dispatch team
- Create distribution list for urgent solicitations

## 🚨 Alert Protocol

When you receive solicitation email:

**Within 1 Hour:**
☐ Acknowledge receipt (internally)
☐ Download Excel attachment
☐ Note deadline in calendar
☐ Set reminder for bid submission (24-48 hours before deadline)

**Within 4 Hours:**
☐ Review all tabs in Excel file
☐ Assess if we can bid (requirements, terms, capability)
☐ Assign to appropriate team member

**Within 24 Hours:**
☐ Begin pricing analysis
☐ Submit any clarification questions
☐ Prepare bid response

## 📱 Mobile Access Setup

### Add to Contacts
Save these as high-priority contacts:
- NAVAIR Acquisition (NAVAIR_Acquisition@us.navy.mil)
- Karin Quagliato (karin.a.quagliato.civ@us.navy.mil)

### Email App Configuration
- Add email account to mobile device
- Enable "Fetch New Data" → Push
- Set fetch interval: Every 15 minutes minimum
- Allow background app refresh

## ⚠️ Common Mistakes to Avoid

❌ Spam folder: Check weekly, mark NAVAIR emails as "Not Spam"
❌ Overlooked deadlines: Always calendar deadline + set reminder
❌ Missed attachments: Always download Excel immediately
❌ Single point of failure: Have backup person monitoring
❌ Weekend emails: Check email on weekends (government works Mon-Fri but emails can arrive anytime)

## ✅ Weekly Verification

Every Monday morning:
☐ Check spam/junk folder for NAVAIR emails
☐ Verify filter still working
☐ Review any pending solicitations
☐ Confirm no missed opportunities from previous week
`,
      checkpoints: [
        'I have set up email filters for NAVAIR_Acquisition@us.navy.mil',
        'I have created folder structure',
        'I have enabled mobile notifications',
        'I have assigned backup monitoring',
      ],
      nextSteps: ['understanding-excel-solicitation', 'bid-evaluation-process'],
    },

    {
      id: 'understanding-excel-solicitation',
      title: 'Understanding the Excel Solicitation File',
      description: 'Deep dive into each tab of the BPA solicitation Excel file',
      phase: 'awaiting_solicitations',
      priority: 'critical',
      estimatedMinutes: 15,
      prerequisites: ['email-setup'],
      content: `
# Understanding the Excel Solicitation File

## 📊 Overview
Every solicitation will come as an Excel file with 4 tabs. Understanding each tab is CRITICAL to submitting a winning bid.

## Tab 1: General Information

### What's in it:
- **Buy Number**: The solicitation ID (e.g., BUY-2024-12345)
- **Vendor Number**: YOUR unique bid identifier for THIS solicitation
- **Description**: What they need shipped/transported
- **Delivery Location**: Where to deliver
- **Delivery Deadline**: When it must arrive
- **Point of Contact**: Buyer name and phone
- **Submission Deadline**: When bid is due

### What to look for:
✓ Can we deliver to this location?
✓ Can we meet the delivery deadline?
✓ Do we need special equipment (lift gate, temperature control, etc.)?
✓ Are there access restrictions (military base, after-hours, etc.)?
✓ Who to contact for questions?

### Red Flags:
🚩 Location we can't reach
🚩 Impossible timeline
🚩 Requires capabilities we don't have
🚩 Delivery restrictions we can't meet

## Tab 2: Bidding Requirements

### What's in it:
Specific requirements you MUST meet to bid, such as:
- Insurance minimums
- Certifications needed
- Equipment specifications
- Driver qualifications
- Security clearances
- Special handling procedures

### Examples you might see:
- "Carrier must have $2M liability insurance"
- "Require TSA security clearance"
- "Must have temperature-controlled equipment"
- "Hazmat certification required"
- "Must be able to deliver to military installations"
- "TWIC card required for port access"

### What to do:
☐ Read EVERY requirement carefully
☐ Confirm DEPOINTE meets ALL requirements
☐ Document proof (insurance cert, driver certs, etc.)
☐ If you don't meet a requirement, DON'T BID
☐ If uncertain, SUBMIT QUESTION immediately

### Decision Point:
**Can we meet 100% of requirements?**
- YES → Proceed to Tab 3
- NO → Either ask for clarification OR don't bid
- UNSURE → Submit question before bidding

## Tab 3: Buy Terms

### What's in it:
Terms and conditions for THIS specific solicitation:
- Payment terms (Net 30, Net 45, etc.)
- Invoice submission method (WAWF, credit card)
- Delivery terms (FOB Destination, FOB Origin)
- Inspection and acceptance criteria
- Warranty or guarantee requirements
- Cancellation provisions
- Dispute resolution

### Common Terms:
- **FOB Destination**: You're responsible until delivery at destination
- **FOB Origin**: Customer takes responsibility at pickup
- **Net 30**: Payment within 30 days of invoice
- **WAWF**: Wide Area Workflow - electronic invoicing system

### What to do:
☐ Read EVERY term carefully
☐ Confirm DEPOINTE accepts ALL terms
☐ Understand payment timing impact on cash flow
☐ Note any special invoicing requirements
☐ If you can't accept a term, DON'T BID

### Red Flags:
🚩 Terms we've never seen before (ask for clarification)
🚩 Unusual warranty requirements
🚩 Payment terms beyond Net 60
🚩 Liability provisions beyond normal scope

## Tab 4: Line Item Input (THE BID TAB)

### What's in it:
**White columns (government provides):**
- Line Item Number
- Part Number / NSN
- Item Description
- Quantity
- Unit of Measure

**Green columns (YOU fill in):**
- 📝 **Seller Description**: Your description of what you're providing
- 📅 **Delivery Days**: Number of days to deliver
- 💵 **Unit Price**: Your price per unit

### How to Complete:

#### Seller Description
What to write:
✓ "Standard freight delivery via 53' dry van"
✓ "Expedited delivery with lift gate service"
✓ "Temperature-controlled transport (35-40°F)"
✓ "White glove inside delivery"

Keep it:
✓ Clear and specific
✓ Matches what they need
✓ Highlights any value-adds
✓ Professional tone

#### Delivery Days
What it means:
- Number of CALENDAR days from order receipt to delivery
- Includes weekends and holidays
- Clock starts when you receive the order

Examples:
- Same day: "0" or "1"
- Next day: "1"
- 3 business days: "3-5" (accounting for weekends)
- One week: "7"

Tips:
✓ Be realistic (don't overpromise)
✓ Be competitive (but achievable)
✓ Consider distance and route
✓ Factor in loading/unloading time
✓ Add buffer for unexpected delays

#### Unit Price
What it means:
- Price per unit (each, pound, pallet, shipment, etc.)
- Should be ALL-INCLUSIVE of:
  ✓ Transportation
  ✓ Fuel
  ✓ Labor (loading/unloading if required)
  ✓ Special services (lift gate, inside delivery, etc.)
  ✓ Insurance
  ✓ Administrative costs
  ✓ Your profit margin

How to calculate:
1. Base transportation cost
2. + Fuel surcharge (current GSA rate or calculated)
3. + Special services (lift gate $75, inside delivery $100, etc.)
4. + Insurance (if extra coverage needed)
5. + Administrative overhead (permits, documentation, etc.)
6. + Profit margin (10-20% typical)
7. = TOTAL UNIT PRICE

Format:
- Enter as number: "150.00" (not "$150.00")
- Two decimal places
- No dollar signs, commas, or other symbols

⚠️ CRITICAL: This is your BEST and FINAL price
- No reverse auction
- No negotiation
- Lowest technically acceptable bid wins

### Validation Before Submission:
☐ All green cells completed for all line items
☐ Seller Description matches what's needed
☐ Delivery Days is realistic and competitive
☐ Unit Price includes ALL costs
☐ Pricing represents our BEST OFFER
☐ Math is correct (if multiple units)
☐ No blank cells
☐ No errors or #REF!

## 🎯 Complete Example

**Line Item 1:**
- Government provides: "Transport 10 pallets from Lakehurst to Philadelphia"
- Quantity: 10 pallets
- Unit of Measure: per pallet

**You enter:**
- Seller Description: "LTL freight delivery via 53' van, lift gate service included"
- Delivery Days: "2"
- Unit Price: "85.00"

**This means**:
- You'll deliver 10 pallets
- 2 days from order receipt
- $85 per pallet
- Total order value: $850.00

## 📋 Practice Exercise

Review sample Excel file (available in training materials) and:
1. Identify all requirements in Tab 2
2. Confirm you understand all terms in Tab 3
3. Practice completing Line Item Input in Tab 4
4. Calculate total bid value
5. Validate all cells complete

**Ready to practice?** Click "Download Sample Solicitation" below.
`,
      checkpoints: [
        'I understand what information is in each tab',
        'I know how to determine if we can meet requirements',
        'I know how to complete the Line Item Input tab',
        'I understand how to price competitively',
      ],
      nextSteps: ['bid-evaluation-process', 'pricing-strategy'],
    },

    {
      id: 'bid-evaluation-process',
      title: 'Bid Evaluation Process: Go/No-Go Decision',
      description:
        'How to quickly evaluate if you should bid on a solicitation',
      phase: 'active_bidding',
      priority: 'critical',
      estimatedMinutes: 10,
      prerequisites: ['understanding-excel-solicitation'],
      content: `
# Bid Evaluation Process - Go/No-Go Decision

## ⏱️ Time-Critical Process
When a solicitation arrives, you must quickly evaluate whether to bid. Use this checklist EVERY TIME.

## 🎯 The 5-Minute Evaluation

### Step 1: Deadline Check (30 seconds)
- When is bid due?
- Do we have enough time to prepare quality bid?
- Minimum 24 hours needed for proper evaluation

**STOP if**: Deadline is <24 hours and we haven't analyzed yet

### Step 2: Delivery Evaluation (2 minutes)
☐ Can we reach the delivery location?
☐ Can we meet the delivery timeline?
☐ Do we have appropriate equipment?
☐ Any special access requirements (military base, port, etc.)?
☐ Delivery window compatible with our schedule?

**STOP if**: ANY delivery requirement we can't meet

### Step 3: Requirements Check (2 minutes)
Go through Tab 2 (Bidding Requirements):
☐ Insurance levels - do we meet or exceed?
☐ Certifications - do we have all required?
☐ Equipment specs - do we have it?
☐ Security clearances - do we have them?
☐ Special qualifications - are we qualified?

**STOP if**: We don't meet even ONE requirement

### Step 4: Terms Review (30 seconds)
Quick scan of Tab 3 (Buy Terms):
☐ Payment terms acceptable (Net 30, Net 45)?
☐ Any unusual liability provisions?
☐ Can we comply with invoicing method?
☐ Any deal-breaker terms?

**STOP if**: Any term we can't accept

### Step 5: Profitability Quick Check (1 minute)
Rough calculation:
- Can we do this job profitably?
- Is the likely winning price worth our time?
- Will we need to price so low it's not worth it?

**STOP if**: This will lose money or break-even only

## ✅ GO Decision Path

If you answered YES to all above:
1. **Assign to team member** for detailed pricing
2. **Block time** for bid preparation
3. **Calendar deadline** with reminders
4. **Note any questions** to submit
5. **Proceed to bid preparation**

## ❌ NO-GO Decision Path

If you answered NO to anything:
1. **Document reason** for not bidding
2. **File in "Not Bid" folder** with notes
3. **Send decline notification** (optional but professional):

\`\`\`
Subject: [BUY NUMBER] - [VENDOR NUMBER] - Declining to Bid

Dear Contracting Officer,

Thank you for the opportunity to bid on [BUY NUMBER]. After careful review,
DEPOINTE must respectfully decline to submit a bid for the following reason:

[SELECT ONE:]
- Unable to meet delivery location requirements
- Cannot meet delivery timeline required
- Do not have required certifications/equipment
- Cannot comply with specific buy terms
- Capacity constraints prevent us from taking this work
- Outside our service area/capability

We appreciate being included in the solicitation and look forward to future
opportunities that align with our capabilities.

Respectfully,
[NAME]
DEPOINTE
\`\`\`

**Why decline professionally?**
✓ Shows you're engaged
✓ Helps buyer understand vendor pool
✓ Maintains good relationship
✓ May lead to better-fit opportunities

## 🤔 MAYBE Decision Path

If you're UNSURE about requirements or terms:

### Submit Question Immediately

\`\`\`
Subject: [BUY NUMBER] - [VENDOR NUMBER] - QUESTION

Dear Contracting Officer,

We are evaluating [BUY NUMBER] and require clarification on [SPECIFIC ITEM]:

QUESTION: [State your specific question]

Example: "Line Item 1 requires 'TSA security clearance.' Can you clarify if
this refers to driver TSA background check or company facility clearance?"

This clarification will help us determine if we can submit a compliant bid.

Thank you,
[NAME]
DEPOINTE
\`\`\`

### Then:
☐ Wait for response before bidding
☐ Set reminder to follow up if no response in 24-48 hours
☐ If no response by deadline, consider no-bid

## 📊 Tracking Your Decisions

Keep a simple log:

| Buy # | Date | Delivery | GO/NO-GO | Reason | Bid Amount | Result |
|-------|------|----------|----------|---------|------------|--------|
| BUY-001 | 1/15 | Lakehurst | GO | Met all reqs | $850 | Awaiting |
| BUY-002 | 1/16 | California | NO-GO | Outside service area | - | - |
| BUY-003 | 1/17 | Philadelphia | GO | Good fit | $1,200 | Awarded! |

**Benefits:**
- Track win rate
- Identify patterns in what you win
- Improve evaluation speed
- Show active participation to NAWCAD

## 🎯 Quick Reference Card

Print and keep by your desk:

\`\`\`
╔══════════════════════════════════════╗
║   BPA SOLICITATION GO/NO-GO CARD     ║
╠══════════════════════════════════════╣
║ ☐ Enough time? (24+ hrs)             ║
║ ☐ Can reach location?                ║
║ ☐ Can meet timeline?                 ║
║ ☐ Have equipment?                    ║
║ ☐ Meet ALL requirements?             ║
║ ☐ Accept ALL terms?                  ║
║ ☐ Can be profitable?                 ║
║                                      ║
║ ALL YES? → BID                       ║
║ ANY NO? → NO-BID or QUESTION         ║
╚══════════════════════════════════════╝
\`\`\`

## ⚠️ Common Mistakes

❌ Bidding when requirements not met → Waste of time, may hurt reputation
❌ Bidding on unprofitable work → Lose money
❌ Not asking questions when unsure → Submit bad bid or miss opportunity
❌ Rushing evaluation → Miss critical details
❌ Not documenting decisions → Can't learn from patterns

## ✅ Best Practices

✓ Evaluate within 4 hours of receiving solicitation
✓ Document ALL decisions (bid or no-bid)
✓ Submit questions early (within 24 hours)
✓ Decline professionally if not bidding
✓ Track patterns to improve decision-making
✓ Review decisions monthly with team
`,
      checkpoints: [
        'I understand the 5-minute evaluation process',
        'I know when to bid and when not to bid',
        'I know how to submit questions',
        'I will track all bid decisions',
      ],
      nextSteps: ['pricing-strategy', 'bid-submission-process'],
    },

    {
      id: 'pricing-strategy',
      title: 'Competitive Pricing Strategy for BPA Bids',
      description: 'How to price to win while maintaining profitability',
      phase: 'active_bidding',
      priority: 'important',
      estimatedMinutes: 20,
      prerequisites: ['bid-evaluation-process'],
      content: `
# Competitive Pricing Strategy for BPA Bids

## 🎯 The Pricing Challenge

You must balance:
- **Low enough** to be the winning bid
- **High enough** to be profitable
- **Accurate enough** to avoid losses

Remember: ⚠️ **NO REVERSE AUCTION** - This is your only chance to price!

## 💰 Full Cost Calculation

### Base Transportation Cost
**Factors:**
- Distance (miles)
- Route (direct vs. circuitous)
- Time (hours driving + loading/unloading)
- Fuel consumption (MPG × distance × fuel price)
- Driver wages (hours × rate)
- Tolls and permits

**Example Calculation:**
\`\`\`
Distance: 150 miles
Time: 3 hours (driving) + 2 hours (loading/unloading) = 5 hours
Driver: $25/hour × 5 hours = $125
Fuel: 150 miles ÷ 6 MPG × $4.00/gal = $100
Tolls: $15
Base Cost: $240
\`\`\`

### Equipment Costs
**Add if applicable:**
- Lift gate service: $50-$100
- Temperature-controlled trailer: $150-$300
- Special handling equipment: $25-$100
- Oversized load permits: $50-$200

### Insurance & Liability
**Consider:**
- Cargo insurance (if high-value): 2-5% of cargo value
- Additional liability coverage: $25-$50
- Risk factor (hazmat, fragile, etc.): 5-10% markup

### Administrative Overhead
**Include:**
- Dispatch coordination: $15-$30
- Documentation/paperwork: $10-$20
- WAWF invoice processing: $10-$15
- Phone/communication: $5-$10

### Fuel Surcharge
**Current GSA Fuel Surcharge** (check weekly):
- https://www.gsa.gov/travel/plan-book/transportation-rates-pov-rates-etc/fuel-surcharge
- Typically 10-30% of base transportation cost

**Example:**
\`\`\`
Base Transportation: $240
GSA Fuel Surcharge (20%): $48
Subtotal: $288
\`\`\`

### Profit Margin
**Industry Standards:**
- Simple local delivery: 10-15%
- Complex logistics: 15-20%
- Specialized services: 20-30%
- Emergency/expedited: 25-40%

**For BPA competitive bidding:**
Recommend: **10-15%** to stay competitive while profitable

**Example:**
\`\`\`
Subtotal (with fuel): $288
Equipment (lift gate): $75
Insurance/liability: $20
Administrative: $25
TOTAL COST: $408
Profit Margin (12%): $49
BID PRICE: $457
Round to: $450.00 or $475.00
\`\`\`

## 🏆 Competitive Intelligence

### Know Your Competition
Who else might be on this BPA?
- Local trucking companies
- National freight carriers
- Specialized transporters

### Typical Pricing Ranges (General Freight)
Based on distance:
- **0-50 miles**: $150-$300
- **51-100 miles**: $250-$450
- **101-200 miles**: $400-$700
- **201-500 miles**: $650-$1,500
- **500+ miles**: Call for quote

### Factors That Lower Competition Price
🔻 Standard delivery window (not expedited)
🔻 Common route (major highways)
🔻 Standard equipment (dry van)
🔻 Flexible timing
🔻 Military base (some carriers can't access)

### Factors That Raise Competition Price
🔺 Expedited/same-day
🔺 Remote location
🔺 Special equipment needed
🔺 After-hours delivery
🔺 Security requirements

## 💡 Strategic Pricing Decisions

### When to Bid VERY Competitively (Low Margin 8-10%)
✓ First few BPA calls (establish performance record)
✓ Slow business period (need revenue)
✓ Return trip opportunity (already going that direction)
✓ Simple, easy job (low risk)
✓ Want to build relationship with this buyer

### When to Bid MODERATELY (Standard Margin 12-15%)
✓ Normal business conditions
✓ Standard job complexity
✓ Fair profit needed
✓ Established relationship with buyer

### When to Bid HIGHER (Premium Margin 18-25%)
✓ Complex requirements
✓ High risk or liability
✓ Specialized equipment needed
✓ After-hours or weekend delivery
✓ You're uniquely qualified (less competition)

### When to Bid PREMIUM (High Margin 25%+)
✓ Emergency/expedited service
✓ Very high value or sensitive cargo
✓ Extensive special handling
✓ You're the only one who can do it

## 🎲 Pricing Psychology

### The "Magic Number" Theory
- Avoid round numbers ($500)
- Use: $495 or $485 (feels lower)
- Or: $497 or $487 (precise, calculated feel)

### The "Lowest by a Dollar" Strategy
If you think competition will bid $500:
- Bid $499 or $495
- Small difference but you win

**Risk**: You don't know what others will bid!

### The "Value Price" Strategy
Price 5-10% higher but emphasize VALUE in Seller Description:
- "Expedited delivery with 24/7 tracking"
- "White glove service with inside delivery"
- "Perfect safety record - zero claims"

Sometimes buyers pay slightly more for reliability.

## 📊 Pricing Worksheet

Use this for EVERY bid:

\`\`\`
═══════════════════════════════════════
BPA PRICING WORKSHEET
Buy Number: ___________
Date: ___________
═══════════════════════════════════════

BASE TRANSPORTATION
Distance: _____ miles
Drive Time: _____ hours
Load/Unload: _____ hours
Driver Cost: $_____ × _____ hrs = $_____
Fuel: _____ miles ÷ ___ MPG × $___ = $_____
Tolls/Permits: $_____
Base Subtotal: $_____

EQUIPMENT & SERVICES
Lift Gate: $_____
Temp Control: $_____
Special Handling: $_____
Other: $_____
Equipment Subtotal: $_____

ADDITIONAL COSTS
Insurance/Liability: $_____
Admin Overhead: $_____
Risk Factor: $_____
Other: $_____
Additional Subtotal: $_____

FUEL SURCHARGE
GSA Rate (___%): $_____

───────────────────────────────────────
TOTAL COST: $_____

PROFIT MARGIN
Target % (___%): $_____

═══════════════════════════════════════
BID PRICE: $_____
═══════════════════════════════════════

COMPETITIVE ANALYSIS:
☐ Simple job - bid low
☐ Complex job - bid higher
☐ Lots of competition - bid low
☐ Few can do this - bid higher
☐ Need this work - bid low
☐ Slow period - bid low

FINAL DECISION: $_____
\`\`\`

## ⚠️ Common Pricing Mistakes

❌ **Forgetting fuel surcharge** → Lose 10-30% profit
❌ **Underestimating time** → Driver works longer, costs more
❌ **Not including admin costs** → Death by 1000 cuts
❌ **Bidding too high** → Never win any bids
❌ **Bidding too low** → Win bids, lose money
❌ **Not tracking** → Don't know if pricing works

## ✅ Pricing Best Practices

✓ Use worksheet for EVERY bid (consistency)
✓ Track actual costs vs. bid (learn from reality)
✓ Review monthly: Are we profitable?
✓ Adjust strategy based on win/loss rate
✓ Start conservative (higher prices) and adjust down if needed
✓ Factor in opportunity cost (is this the best use of equipment/driver?)

## 📈 Tracking Your Pricing Success

Keep a log:

| Buy # | Bid Price | Won? | Actual Cost | Actual Profit | Margin % | Notes |
|-------|-----------|------|-------------|---------------|----------|-------|
| BUY-001 | $450 | YES | $380 | $70 | 15.6% | Easy delivery |
| BUY-002 | $700 | NO | - | - | - | Bid too high? |
| BUY-003 | $525 | YES | $520 | $5 | 0.95% | Took too long! |

**Learning from data:**
- If you win <20%: You're bidding too high
- If you win >60%: You might be bidding too low (leaving money on table)
- Target: 30-40% win rate with 12-15% profit margins

## 🎯 Quick Pricing Guide

For DEPOINTE's standard service area (NJ/PA/DE/NY):

**Local (0-50 mi):**
- Simple: $150-$200
- w/ Lift Gate: $200-$250
- Expedited: $250-$350

**Regional (51-150 mi):**
- Simple: $300-$450
- w/ Lift Gate: $400-$550
- Expedited: $500-$700

**Extended (151-300 mi):**
- Simple: $550-$850
- w/ Lift Gate: $700-$1,000
- Expedited: $900-$1,400

*Adjust based on specific job requirements*
`,
      checkpoints: [
        'I understand how to calculate full costs',
        'I know how to apply profit margins',
        'I understand competitive pricing strategies',
        'I will use the pricing worksheet for every bid',
      ],
      nextSteps: ['bid-submission-process'],
    },

    {
      id: 'bid-submission-process',
      title: 'Bid Submission Process Step-by-Step',
      description: 'How to complete and submit your bid correctly',
      phase: 'active_bidding',
      priority: 'critical',
      estimatedMinutes: 10,
      prerequisites: ['pricing-strategy'],
      content: `
# Bid Submission Process - Step-by-Step

## ⏱️ Timeline: Allow 1-2 Hours for Complete Process

## 📝 Step 1: Open and Prepare Excel File (5 min)

### Download
☐ Open email from NAVAIR_Acquisition@us.navy.mil
☐ Download Excel attachment to your computer
☐ Save to: "NAWCAD BPA/Active Solicitations/[BUY NUMBER]"

### Initial File Setup
☐ Rename file: "[BUY NUMBER]_DEPOINTE_Bid_v1.xlsx"
☐ Make a backup copy (save as v0 for reference)
☐ Enable editing if prompted

### Note Key Information
☐ Buy Number: _______________
☐ Vendor Number: _______________
☐ Bid Deadline: _______________
☐ Set calendar reminder: 24 hours before deadline

## 📋 Step 2: Complete Your Evaluation (10-15 min)

### Review All Tabs
☐ Tab 1: General Information - understand the requirement
☐ Tab 2: Bidding Requirements - confirm we meet ALL
☐ Tab 3: Buy Terms - confirm we accept ALL
☐ Tab 4: Line Item Input - identify what needs pricing

### Document Questions
If anything unclear:
☐ Write down questions immediately
☐ Submit questions via email (reply to solicitation)
☐ Don't wait - submit within 24 hours of receiving solicitation

## 💰 Step 3: Calculate Pricing (20-40 min)

### Use Pricing Worksheet
☐ Calculate base transportation cost
☐ Add equipment/service costs
☐ Add administrative overhead
☐ Apply fuel surcharge
☐ Add profit margin
☐ Arrive at total bid price

### Double-Check Math
☐ Verify all calculations
☐ Ensure pricing is competitive
☐ Confirm includes ALL costs
☐ Get second opinion if high-value bid

### Strategic Review
☐ Is this our BEST offer?
☐ Can we do better?
☐ Can we afford to do worse?
☐ What's our competition likely to bid?

## ✏️ Step 4: Complete Line Item Input Tab (15-20 min)

### For Each Line Item:

#### Column 1: Seller Description
What to write:
- Specific description of your service
- Include key features/benefits
- Mention equipment type if relevant
- Note any value-adds

✅ Good examples:
- "Standard freight delivery via 53' dry van with GPS tracking"
- "Expedited same-day delivery with lift gate service"
- "Temperature-controlled transport (35-40°F) with real-time monitoring"

❌ Bad examples:
- "Delivery" (too vague)
- "Same as above" (unclear)
- Blank (will be rejected)

#### Column 2: Delivery Days
Enter number:
- Calendar days from order receipt to delivery
- Be realistic but competitive
- Common: 1, 2, 3, 5, 7
- Can use decimals: 0.5 (half day), 1.5

Examples:
- Same day / emergency: "0" or "1"
- Next day: "1"
- 2-3 business days: "3"
- One week: "7"

#### Column 3: Unit Price
Enter number:
- Two decimal places: "450.00"
- No dollar sign: NOT "$450.00"
- No commas: NOT "1,450.00"
- Just the number: "1450.00"

### Complete ALL Rows
☐ No blank cells in green columns
☐ All descriptions clear and specific
☐ All delivery days realistic
☐ All prices calculated and entered

## ✅ Step 5: Validation and QA (10 min)

### File Validation
☐ All green cells completed
☐ No #REF! or #VALUE! errors
☐ No blank cells
☐ Formulas working (if any total rows)
☐ No typos in descriptions

### Logic Check
☐ Delivery days make sense for distance
☐ Prices are reasonable (not $50 or $50,000 for typical delivery)
☐ Consistent pricing across similar line items
☐ All requirements can be met
☐ All terms accepted

### Final Review
☐ Is this our best offer?
☐ Is this profitable if we win?
☐ Can we actually deliver as promised?
☐ Do prices include EVERYTHING needed?

### Get Second Set of Eyes
☐ Have colleague review
☐ Check for obvious errors
☐ Confirm pricing competitive

## 💾 Step 6: Save Final File (2 min)

### File Naming
Save as: "[BUY NUMBER]_DEPOINTE_Bid_FINAL.xlsx"

Example: "BUY-2024-12345_DEPOINTE_Bid_FINAL.xlsx"

### Backup
☐ Save to computer
☐ Upload to cloud backup (if used)
☐ Keep working version separate

## 📧 Step 7: Prepare Submission Email (5 min)

### Email Setup
☐ **REPLY** to original solicitation email (don't create new email)
☐ Keep original subject line: "[BUY NUMBER] - [VENDOR NUMBER]"
☐ Attach your completed Excel file

### Email Body Template:

\`\`\`
Subject: [Keep original: BUY-2024-12345 - VENDOR-98765]

Dear Contracting Officer,

Please find attached our bid response for [BUY NUMBER].

DEE DAVIS INC dba DEPOINTE confirms:
✓ We meet all Bidding Requirements stated in the solicitation
✓ We accept all Buy Terms as specified
✓ We can deliver within the specified timeframe to [LOCATION]
✓ Our pricing reflects our best and final offer
✓ All line items have been completed in the attached Excel file

Key highlights of our bid:
• Delivery timeline: [X] days
• Total bid value: $[AMOUNT]
• Service level: [Standard/Expedited/Specialized]
• Equipment: [Truck type, special features]

We are prepared to execute this requirement with the same level of excellence
that has earned us a 99.8% on-time delivery record and zero safety incidents.

If you have any questions or require additional information, please contact us
immediately.

Respectfully submitted,

[YOUR NAME]
[YOUR TITLE]
DEE DAVIS INC dba DEPOINTE
DOT: 4250594 | MC: 1647572 | WOSB Certified
Phone: [PHONE]
Email: [EMAIL]
Available 24/7 for urgent matters

Attachment: [BUY NUMBER]_DEPOINTE_Bid_FINAL.xlsx
\`\`\`

## 🚀 Step 8: Submit Bid (2 min)

### Pre-Send Checklist
☐ Excel file attached (check file size uploaded)
☐ Subject line unchanged from original
☐ Email body complete and professional
☐ Contact information correct
☐ Sending from correct email address
☐ Submitting before deadline

### Send
☐ Click Send
☐ Request read receipt (optional)
☐ Watch for any bounce-back or error messages

### Immediately After Sending
☐ Check "Sent" folder - confirm email sent
☐ Verify attachment included
☐ Note submission time/date
☐ Save sent email to "Bids Submitted" folder

## 📁 Step 9: Post-Submission Organization (5 min)

### File Management
☐ Move original solicitation email to "Bids Submitted - Awaiting Award"
☐ Move Excel file to same folder
☐ Keep sent email in same folder
☐ Update bid tracking log

### Tracking
Update your bid log:

| Buy # | Submitted Date | Delivery | Bid Amount | Status | Notes |
|-------|----------------|----------|------------|--------|-------|
| BUY-XXX | [DATE] | [LOCATION] | $XXX | Awaiting | [NOTES] |

### Calendar
☐ Add to calendar: "Bid submitted - Awaiting award decision"
☐ Set reminder: Follow up if no response in 2 weeks
☐ Note expected award timeframe (if provided)

## ⏰ Step 10: Post-Submission Actions

### If No Response After 1 Week:
Nothing to do - buyer reviews on their timeline

### If No Response After 2 Weeks:
Consider gentle follow-up (optional):

\`\`\`
Subject: [BUY NUMBER] - [VENDOR NUMBER] - Bid Status Inquiry

Dear Contracting Officer,

We submitted a bid for [BUY NUMBER] on [DATE] and wanted to confirm receipt.

If a decision has been made or if you need any additional information from us,
please let us know.

Thank you,
[NAME]
DEPOINTE
\`\`\`

### If You Win:
✅ Buyer will contact you directly
✅ Acknowledge immediately
✅ Confirm delivery details
✅ Execute with excellence
✅ Update tracking: "AWARDED"

### If You Don't Win:
- No notification (you just won't hear anything)
- Move on to next opportunity
- Review pricing (were we too high?)
- Learn for next time

## ⚠️ Common Submission Errors to Avoid

❌ Creating NEW email instead of replying → Buyer may miss it
❌ Changing subject line → Hard to track
❌ Submitting after deadline → Automatic rejection
❌ Missing attachment → Incomplete bid
❌ Blank cells in Excel → Incomplete bid
❌ Wrong format (PDF instead of Excel) → May be rejected
❌ Submitting without QA → Errors in bid

## ✅ Submission Best Practices

✓ Submit 24-48 hours before deadline (don't wait until last minute)
✓ Use reply, not new email
✓ Keep original subject line
✓ Professional email body
✓ Complete QA before sending
✓ Save everything for records
✓ Track all submissions
✓ Learn from each bid (win or lose)

## 🎯 Quick Reference: Pre-Send Checklist

Print and keep by your desk:

\`\`\`
╔══════════════════════════════════════╗
║     BID SUBMISSION CHECKLIST         ║
╠══════════════════════════════════════╣
║ ☐ Excel file complete (all green    ║
║   columns filled)                    ║
║ ☐ No blank cells or errors           ║
║ ☐ Pricing is our BEST offer          ║
║ ☐ Delivery days realistic            ║
║ ☐ File saved with correct name       ║
║ ☐ Email is REPLY (not new)           ║
║ ☐ Subject line unchanged             ║
║ ☐ Excel file attached                ║
║ ☐ Email body professional            ║
║ ☐ Submitting before deadline         ║
║ ☐ Second person reviewed             ║
║                                      ║
║ ALL CHECKED? → SEND!                 ║
╚══════════════════════════════════════╝
\`\`\`
`,
      checkpoints: [
        'I understand how to complete the Excel file correctly',
        'I know how to format the submission email',
        'I will use the pre-send checklist every time',
        'I understand post-submission organization',
      ],
      nextSteps: ['award-notification', 'performance-excellence'],
    },

    // PHASE 3: POST-AWARD
    {
      id: 'award-notification',
      title: 'Award Notification and Order Acknowledgment',
      description: 'What happens when you win a bid',
      phase: 'post_award',
      priority: 'critical',
      estimatedMinutes: 10,
      prerequisites: ['bid-submission-process'],
      content: `
# Award Notification and Order Acknowledgment

## 🏆 How You'll Know You Won

### Notification Method
📞 **Direct contact from buyer**
- Email from buyer or NAVAIR_Acquisition@us.navy.mil
- Phone call from contracting officer
- May be informal: "You're the winner!"
- Or formal: Purchase order document

### What the Notification Contains
✓ Award confirmation
✓ Purchase order number
✓ Order details (what, when, where)
✓ Delivery instructions
✓ Special requirements
✓ Payment information
✓ Point of contact

### If You DON'T Win
❌ No notification
- You simply won't hear anything
- This is normal for "not selected" vendors
- Move on to next opportunity

## ✅ Immediate Response Required

### Within 1 Hour of Award Notification:

#### 1. Acknowledge Receipt
Reply immediately:

\`\`\`
Subject: [BUY/PO NUMBER] - Award Acknowledgment

Dear [Buyer Name],

Thank you for awarding [BUY/PO NUMBER] to DEPOINTE.

We acknowledge receipt of this order and confirm:
✓ We can deliver to [LOCATION]
✓ We will deliver by [DATE/TIME]
✓ Our equipment and team are ready
✓ We accept all terms and conditions

We will provide tracking information and status updates throughout the delivery
process.

Point of Contact for this delivery:
Name: [NAME]
Phone: [24/7 NUMBER]
Email: [EMAIL]

Thank you for this opportunity to serve.

Respectfully,
[YOUR NAME]
DEPOINTE
\`\`\`

#### 2. Internal Coordination
☐ Alert dispatch immediately
☐ Assign driver/equipment
☐ Schedule pickup and delivery
☐ Block time on calendar
☐ Prepare any special equipment needed

#### 3. Create Order File
☐ Create folder: "NAWCAD BPA/Awarded Orders/[PO NUMBER]"
☐ Save purchase order document
☐ Save original solicitation
☐ Save your bid
☐ Save award notification

## 📋 Order Verification

### Review Purchase Order Details
☐ PO Number matches
☐ Delivery address correct
☐ Delivery date/time realistic
☐ Price matches your bid
☐ Line items match
☐ Special instructions noted

### Discrepancy Resolution
If anything doesn't match your bid:
1. Contact buyer immediately
2. Point out discrepancy professionally
3. Get correction before proceeding

Example:
\`\`\`
"We notice the PO shows delivery to Building A, but the original solicitation
specified Building B. Can you please clarify the correct delivery location?"
\`\`\`

## 📅 Delivery Coordination

### Timeline Confirmation
☐ Confirm exact pickup date/time
☐ Confirm exact delivery date/time
☐ Identify delivery window if specified
☐ Note any access restrictions
☐ Identify after-hours or weekend requirements

### Logistics Planning
☐ Route planning (most efficient path)
☐ Driver assignment (qualified, available)
☐ Equipment assignment (appropriate type)
☐ Backup plan (if delays occur)
☐ Contact information exchange

### Customer Communication
☐ Provide your dispatch contact
☐ Ask for receiver contact
☐ Confirm delivery protocol
☐ Set up tracking notifications
☐ Establish communication preferences

## 🚚 Pre-Delivery Preparation

### 48 Hours Before Pickup:
☐ Reconfirm pickup details with shipper
☐ Verify driver and equipment assigned
☐ Check route and timing
☐ Ensure all special equipment ready
☐ Review delivery instructions with driver

### 24 Hours Before Delivery:
☐ Notify receiver of expected arrival
☐ Provide tracking information
☐ Confirm delivery window
☐ Verify access requirements (gate codes, contacts, etc.)
☐ Confirm any special unloading needs

### Day of Delivery:
☐ Driver checks in with dispatch before departure
☐ Provide real-time tracking to customer
☐ Notify customer 1-2 hours before arrival
☐ Update any delays immediately
☐ Coordinate final delivery logistics

## 📞 Communication Protocol

### Keep Customer Informed
✓ Pickup completed: "Load secured, en route"
✓ In transit: GPS tracking link
✓ 2 hours out: "ETA [TIME]"
✓ Arrival: "On-site for delivery"
✓ Completed: "Delivery complete, POD attached"

### If Problems Arise
Communicate immediately:
- Traffic delays
- Weather issues
- Equipment problems
- Access issues
- Any other delays

**Never go dark** - customer should always know status

## 📄 Documentation Requirements

### During Delivery:
☐ Bill of Lading (BOL) - signed by shipper
☐ Photos of cargo (before loading)
☐ Chain of custody (if required)
☐ Temperature logs (if temp-controlled)
☐ Inspection documents (if applicable)

### Upon Delivery:
☐ Proof of Delivery (POD) - signed by receiver
☐ Photos of cargo (after unloading)
☐ Delivery receipt with date/time
☐ Any discrepancy notes
☐ Condition report (if damage)

### Post-Delivery:
☐ Upload all documents to order file
☐ Prepare invoice
☐ Send POD to customer
☐ File for records

## 💵 Invoicing and Payment

### Invoice Preparation
Within 24 hours of delivery:
☐ Create invoice with PO number
☐ Include all line items
☐ Match prices to PO exactly
☐ Attach POD and BOL
☐ Include delivery date

### Submission Method
Per PO instructions:
- **WAWF** (Wide Area Workflow): Submit electronically
- **Credit Card**: Charge per agreement
- **Email**: Send to buyer's email
- **Portal**: Upload to specified system

### WAWF Submission (If Required)
1. Log in to https://wawf.eb.mil/
2. Create invoice linked to PO number
3. Attach supporting documents (POD, BOL)
4. Submit for approval
5. Track approval status

### Payment Timeline
- Government typically pays within 30 days
- Track in your accounting system
- Follow up if payment delayed beyond terms

## ✅ Order Completion Checklist

### Immediately After Delivery:
☐ Driver debriefs with dispatch
☐ All documents collected and scanned
☐ POD sent to customer
☐ Invoice prepared and submitted
☐ Any issues documented and reported

### Within 24 Hours:
☐ Order file updated with all documents
☐ Customer follow-up: "Delivery complete, everything satisfactory?"
☐ Invoice submitted via correct method
☐ Performance metrics recorded (on-time? any issues?)
☐ Move order file to "Completed Orders"

### Within 1 Week:
☐ Payment received or tracked
☐ Customer satisfaction confirmed
☐ Any claims or issues resolved
☐ Lessons learned documented
☐ Update bid tracking log: "COMPLETED"

## 📊 Performance Tracking

Track every order:

| PO # | Delivery Date | On-Time? | Issues? | Customer Feedback | Paid? |
|------|---------------|----------|---------|-------------------|-------|
| PO-001 | 1/15 | YES | None | Excellent | YES |
| PO-002 | 1/17 | NO (weather) | Delay | Understanding | YES |

**Why track?**
- Maintain BPA standing (poor performance = cancellation)
- Improve operations
- Demonstrate reliability to buyer
- Build case for future opportunities

## 🌟 Excellence in Execution

### Goal: Perfect Performance
✓ 100% on-time delivery
✓ Zero damage/claims
✓ Professional communication
✓ Accurate documentation
✓ Prompt invoicing
✓ Positive customer feedback

### This Leads To:
- More awards in future
- Buyer requests you specifically
- BPA renewal
- Increased opportunities
- Referrals to other buyers
- Long-term relationship

### Remember:
**Every delivery is an audition for the next opportunity!**
`,
      checkpoints: [
        'I know how to respond to award notifications',
        'I understand delivery coordination requirements',
        'I know what documentation is needed',
        'I understand invoicing procedures',
      ],
      nextSteps: ['performance-excellence', 'bpa-maintenance'],
    },
  ];

  /**
   * Get personalized learning path based on user progress
   */
  getPersonalizedLearningPath(progress: UserProgress): TrainingModule[] {
    // Filter modules based on current phase
    let relevantModules = this.modules.filter(
      (m) => m.phase === progress.currentPhase || m.priority === 'critical'
    );

    // Remove already completed modules
    relevantModules = relevantModules.filter(
      (m) => !progress.completedSteps.includes(m.id)
    );

    // Check prerequisites
    relevantModules = relevantModules.filter((m) =>
      m.prerequisites.every((prereq) =>
        progress.completedSteps.includes(prereq)
      )
    );

    // Sort by priority
    const priorityOrder = { critical: 0, important: 1, helpful: 2 };
    relevantModules.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    return relevantModules;
  }

  /**
   * Get contextual help based on current user action
   */
  getContextualHelp(context: string): ContextualHelp | null {
    const helpContent: { [key: string]: ContextualHelp } = {
      'viewing-government-opportunity': {
        context: 'viewing-government-opportunity',
        title: 'Federal Government Opportunity Detected',
        quickTip:
          'This is a federal opportunity from SAM.gov. Check if it requires a BPA or if you can bid directly.',
        detailedHelp: `
**What you're looking at:** A federal government solicitation from SAM.gov.

**Key things to check:**
1. **Solicitation Type**: Is this a BPA establishment or a specific contract?
   - If BPA: Follow BPA setup process (one-time qualification)
   - If direct contract: Submit proposal directly

2. **Requirements**:
   - CAGE Code required? (get from SAM.gov)
   - SAM.gov registration required? (must be active)
   - Small business set-aside? (WOSB qualifies!)

3. **Next Steps**:
   - Click "Retrieve Solicitation" to get full details
   - Review all requirements carefully
   - Generate response using AI assistant
`,
        relatedModules: [
          'bpa-overview',
          'sam-gov-registration',
          'bpa-initial-submission',
        ],
        actions: [
          {
            label: 'Retrieve Full Solicitation',
            action: 'retrieve-solicitation',
            type: 'primary',
          },
          {
            label: 'Learn About BPAs',
            action: 'open-module:bpa-overview',
            type: 'secondary',
          },
        ],
      },

      'received-bpa-solicitation-email': {
        context: 'received-bpa-solicitation-email',
        title: 'BPA Solicitation Email Received!',
        quickTip:
          'Download the Excel file, review all 4 tabs, and complete the green columns in "Line Item Input".',
        detailedHelp: `
**You've received a BPA call order!** Here's what to do:

**IMMEDIATE (Within 1 Hour):**
1. Download the Excel attachment
2. Note the deadline
3. Set calendar reminder

**WITHIN 4 HOURS:**
1. Review Tab 1: General Information
2. Review Tab 2: Bidding Requirements - can we meet ALL?
3. Review Tab 3: Buy Terms - can we accept ALL?
4. Decide: GO or NO-GO

**IF GO - WITHIN 24 HOURS:**
1. Calculate pricing (use pricing worksheet)
2. Complete Line Item Input tab (green columns)
3. QA your bid
4. REPLY to email with completed Excel file

**Need help?** Use the training modules to guide you through each step.
`,
        relatedModules: [
          'understanding-excel-solicitation',
          'bid-evaluation-process',
          'pricing-strategy',
          'bid-submission-process',
        ],
        actions: [
          {
            label: 'Start Bid Evaluation',
            action: 'open-module:bid-evaluation-process',
            type: 'primary',
          },
          {
            label: 'Calculate Pricing',
            action: 'open-pricing-calculator',
            type: 'primary',
          },
        ],
      },

      'preparing-initial-bpa-response': {
        context: 'preparing-initial-bpa-response',
        title: 'Preparing Your BPA Response',
        quickTip:
          'You need: CAGE Code, UEID, SAM.gov confirmation, capabilities statement, and past performance references.',
        detailedHelp: `
**Setting up your BPA is a one-time process.** Here's your checklist:

**REQUIRED INFORMATION:**
☐ CAGE Code (from SAM.gov)
☐ UEID (from SAM.gov)
☐ SAM.gov active status confirmation
☐ Capabilities statement (what you do)
☐ WOSB certification
☐ Past performance references (3 minimum)

**OPTIONAL BUT RECOMMENDED:**
☐ DD Form 2345 (or disclose application status)
☐ Insurance certificates
☐ DOT/MC authority docs

**USE THE AI ASSISTANT:**
The "Generate BPA Response" button will create a complete, professional
response package with all required sections. Just fill in your specific
information (CAGE, UEID, etc.) and submit!
`,
        relatedModules: [
          'sam-gov-registration',
          'dd-form-2345',
          'bpa-initial-submission',
        ],
        actions: [
          {
            label: 'Generate BPA Response',
            action: 'generate-bpa-response',
            type: 'primary',
          },
          {
            label: 'Check SAM.gov Status',
            action: 'open-url:https://sam.gov',
            type: 'secondary',
          },
        ],
      },
    };

    return helpContent[context] || null;
  }

  /**
   * Get next recommended action for user
   */
  getNextRecommendedAction(progress: UserProgress): string {
    if (!progress.bpaEstablished) {
      if (progress.completedSteps.includes('sam-gov-registration')) {
        return 'Complete and submit your BPA qualification package';
      }
      return 'Verify your SAM.gov registration and gather required information';
    }

    if (progress.bidsSubmitted === 0) {
      return 'Set up email monitoring for NAVAIR_Acquisition@us.navy.mil';
    }

    if (progress.bidsSubmitted < 5) {
      return 'Continue bidding on opportunities to build your track record';
    }

    return 'Maintain excellent performance and active participation';
  }

  /**
   * Helper methods for dynamic content
   */
  private getCageCodeStatus(): string {
    return '[CHECK IN SAM.GOV - Entity Management → View Entity]';
  }

  private getUEIStatus(): string {
    return '[CHECK IN SAM.GOV - Entity Management → View Entity]';
  }

  private getSAMStatus(): string {
    return '[CHECK IN SAM.GOV - Shows "Active" or "Expired"]';
  }
}

export default AdaptiveBPATrainingSystem;
