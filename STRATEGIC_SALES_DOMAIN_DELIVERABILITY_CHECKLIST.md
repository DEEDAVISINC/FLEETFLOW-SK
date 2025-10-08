# 🛡️ Strategic Sales Campaign System - Domain Setup & Deliverability Checklist

**CRITICAL: Follow this checklist BEFORE launching any Strategic Sales campaigns to protect your
domain reputation and ensure emails land in the inbox, not spam.**

---

## 📋 Pre-Launch Checklist (MANDATORY)

### ✅ Phase 1: Domain Authentication (Week 1)

**Status: REQUIRED before sending ANY sales emails**

#### 1.1 SPF Record Setup

- [ ] **Generate SPF record** using `EmailAuthenticationSetupGuide`
- [ ] **Add SPF record to DNS** (fleetflowapp.com)
- [ ] **Verify SPF** using MXToolbox (https://mxtoolbox.com/spf.aspx)

**Expected SPF Record:**

```
v=spf1 mx include:sendgrid.net ~all
```

**Why This Matters:**

- SPF tells receiving servers which IPs can send email from your domain
- Without SPF, 40-60% of emails go to spam immediately
- **Impact: +30% deliverability**

---

#### 1.2 DKIM Record Setup

- [ ] **Get DKIM keys from SendGrid** (SendGrid Dashboard → Settings → Sender Authentication)
- [ ] **Add DKIM records to DNS** (3 CNAME records from SendGrid)
- [ ] **Verify DKIM** using MXToolbox (https://mxtoolbox.com/dkim.aspx)

**Why This Matters:**

- DKIM cryptographically signs your emails to prove they're legitimate
- Gmail/Outlook require DKIM for inbox delivery
- **Impact: +40% deliverability**

---

#### 1.3 DMARC Record Setup

- [ ] **Generate DMARC record** using `EmailAuthenticationSetupGuide`
- [ ] **Add DMARC record to DNS**
- [ ] **Verify DMARC** using MXToolbox (https://mxtoolbox.com/dmarc.aspx)

**Recommended DMARC Record (Start Conservative):**

```
v=DMARC1; p=none; sp=none; pct=100; rua=mailto:dmarc@fleetflowapp.com; ruf=mailto:dmarc@fleetflowapp.com; fo=1; adkim=r; aspf=r;
```

**DMARC Policy Progression:**

1. **Week 1-2:** `p=none` (monitoring only)
2. **Week 3-4:** `p=quarantine; pct=10` (quarantine 10% of failures)
3. **Week 5-6:** `p=quarantine; pct=50` (quarantine 50% of failures)
4. **Week 7+:** `p=quarantine; pct=100` (quarantine all failures)
5. **Month 3+:** `p=reject` (reject all failures - ONLY after perfect track record)

**Why This Matters:**

- DMARC protects your domain from spoofing and phishing
- Gmail/Outlook prioritize DMARC-protected domains
- **Impact: +30% deliverability, +100% brand protection**

---

### ✅ Phase 2: Email Warm-up (Weeks 2-5)

**Status: REQUIRED before sending to cold prospects**

#### 2.1 Start Email Warm-up Process

- [ ] **Initialize EmailWarmupService** with Strategic Sales sending domain
- [ ] **Add 10-20 friendly accounts** (partners, internal team, test accounts)
- [ ] **Start 30-day warm-up schedule**

**FleetFlow Already Has This Built:**

```typescript
import { emailWarmupService } from './services/EmailWarmupService';

// Start warm-up for Strategic Sales domain
await emailWarmupService.startWarmup();
```

**Warm-up Schedule (30 Days):** | Day | Volume | Target Accounts | Expected Engagement |
|-----|--------|-----------------|---------------------| | 1-6 | 5-20 | Internal only | 90%+ open
rate | | 7-15 | 20-50 | Friendly partners | 70%+ open rate | | 16-22 | 50-100 | Mixed (70% friendly,
30% new) | 50%+ open rate | | 23-30 | 100-200 | All (50% friendly, 50% new) | 40%+ open rate |

**Why This Matters:**

- Gmail/Outlook track NEW sending patterns and flag sudden volume spikes
- Warm-up establishes your domain as a legitimate sender
- **Impact: Prevents immediate spam folder placement**

---

#### 2.2 Monitor Warm-up Metrics

- [ ] **Daily deliverability check** (target: 95%+)
- [ ] **Daily engagement check** (target: 40%+ open rate during warm-up)
- [ ] **Bounce rate monitoring** (target: <2%)
- [ ] **Complaint rate monitoring** (target: <0.1%)

**FleetFlow Dashboard:**

```typescript
const warmupStatus = emailWarmupService.getWarmupStatus();
console.log('Deliverability:', warmupStatus.overallStats.deliverability);
console.log('Engagement:', warmupStatus.overallStats.engagement);
console.log('Progress:', warmupStatus.overallStats.progress);
```

---

### ✅ Phase 3: Sending Infrastructure (Week 3)

**Status: REQUIRED for high-volume campaigns**

#### 3.1 IP Pool Setup (SendGrid)

- [ ] **Dedicated IP for marketing** (if sending 100K+ emails/month)
- [ ] **Separate IP for transactional** (protect critical emails)
- [ ] **Warm-up IP separately** (30-day IP warm-up process)

**FleetFlow Already Has This Built:**

```typescript
import { sendingIPManager } from './services/SendingIPManager';

// Initialize IP pools
await sendingIPManager.initialize();

// Select optimal IP for campaign
const optimalIP = sendingIPManager.selectOptimalIP('marketing');
```

**Why This Matters:**

- Shared IPs can be contaminated by other senders
- Dedicated IPs give you full control over reputation
- **Impact: +20% deliverability for high-volume senders**

**Cost:**

- SendGrid Dedicated IP: $79.95/month
- **ROI:** If you're sending 10K+ emails/month, this pays for itself

---

#### 3.2 IP Reputation Monitoring

- [ ] **Daily IP reputation check** (target: 90+ score)
- [ ] **Auto-quarantine IPs** with poor reputation (<60 score)
- [ ] **Rotate IPs** for load balancing

**FleetFlow Dashboard:**

```typescript
const reputationOverview = sendingIPManager.getReputationOverview();
console.log('Excellent IPs:', reputationOverview.excellent);
console.log('Quarantined IPs:', reputationOverview.quarantined);
```

---

### ✅ Phase 4: Content & Sending Best Practices (Ongoing)

**Status: REQUIRED for every campaign**

#### 4.1 Email Content Checklist

- [ ] **Avoid spam trigger words** (free, guarantee, act now, limited time, click here)
- [ ] **Personalize every email** (use {firstName}, {companyName}, {painPoint})
- [ ] **Include plain text version** (not just HTML)
- [ ] **Add unsubscribe link** (REQUIRED by CAN-SPAM)
- [ ] **Include physical address** (REQUIRED by CAN-SPAM)
- [ ] **Use professional from name** (e.g., "Sarah from FleetFlow" not "noreply@")
- [ ] **Match reply-to address** (use real email that you monitor)

**Spam Score Checker:**

- https://www.mail-tester.com/ (send test email, get spam score)
- **Target: 8/10 or higher**

---

#### 4.2 Sending Volume Limits

- [ ] **Start with 100-200 emails/day** (first 2 weeks)
- [ ] **Increase by 20% per week** (gradual ramp-up)
- [ ] **Never exceed 1,000 emails/day** (without dedicated IP)
- [ ] **Spread sends throughout the day** (not all at once)

**FleetFlow Rate Limiting (Already Built):**

```typescript
// Strategic Sales Campaign Service automatically enforces:
// - Max 1,000 emails/day (configurable)
// - 15-45 second delay between emails
// - Spread sends over 8-hour window
```

**Why This Matters:**

- Sudden volume spikes = spam filter trigger
- Gmail/Outlook throttle senders who blast emails
- **Impact: Prevents domain blacklisting**

---

#### 4.3 List Hygiene

- [ ] **Verify email addresses** before sending (use NeverBounce, ZeroBounce)
- [ ] **Remove bounces immediately** (hard bounces = dead emails)
- [ ] **Honor unsubscribes within 10 days** (REQUIRED by CAN-SPAM)
- [ ] **Remove complainers immediately** (spam complaints = reputation killer)
- [ ] **Segment by engagement** (don't email non-openers repeatedly)

**Bounce Rate Thresholds:**

- **<2% = Excellent** ✅
- **2-5% = Acceptable** ⚠️
- **>5% = DANGER** 🚨 (stop sending, clean list)

**Complaint Rate Thresholds:**

- **<0.1% = Excellent** ✅
- **0.1-0.3% = Acceptable** ⚠️
- **>0.3% = DANGER** 🚨 (stop sending, review content)

---

### ✅ Phase 5: Monitoring & Optimization (Daily)

**Status: REQUIRED for every active campaign**

#### 5.1 Daily Deliverability Monitoring

- [ ] **Check SendGrid delivery stats** (delivered, bounced, spam reports)
- [ ] **Monitor Google Postmaster Tools** (https://postmaster.google.com/)
- [ ] **Check Microsoft SNDS** (https://sendersupport.olc.protection.outlook.com/snds/)
- [ ] **Review DMARC reports** (weekly)

**Key Metrics to Track:** | Metric | Target | Warning | Danger |
|--------|--------|---------|--------| | **Deliverability Rate** | 95%+ | 90-95% | <90% | | **Open
Rate** | 15-25% | 10-15% | <10% | | **Bounce Rate** | <2% | 2-5% | >5% | | **Complaint Rate** |
<0.1% | 0.1-0.3% | >0.3% | | **Unsubscribe Rate** | <0.5% | 0.5-1% | >1% |

---

#### 5.2 A/B Testing for Deliverability

- [ ] **Test subject lines** (avoid spam triggers)
- [ ] **Test from names** (personal vs. company)
- [ ] **Test send times** (Tuesday-Thursday, 10am-2pm EST best)
- [ ] **Test email length** (150-300 words ideal)
- [ ] **Test link count** (max 3-5 links per email)

**FleetFlow Strategic Sales System (Already Built):**

```typescript
// Automatically generates 3 variants per funnel stage
// Tracks performance metrics per variant
// Optimizes based on reply rates
```

---

## 🚨 RED FLAGS: Stop Sending Immediately If...

### Critical Issues (STOP ALL CAMPAIGNS)

- [ ] **Bounce rate >5%** → Clean list, verify emails
- [ ] **Complaint rate >0.3%** → Review content, check targeting
- [ ] **Deliverability <90%** → Check SPF/DKIM/DMARC, review IP reputation
- [ ] **Domain blacklisted** → Check https://mxtoolbox.com/blacklists.aspx
- [ ] **IP reputation <60** → Quarantine IP, investigate cause

### Warning Signs (Pause & Investigate)

- [ ] **Open rate <10%** → Subject lines may be spam-triggering
- [ ] **Reply rate <1%** → Targeting or messaging issue
- [ ] **Unsubscribe rate >1%** → Content not resonating with audience
- [ ] **Sudden drop in deliverability** → Check for blacklist, review recent sends

---

## 📊 FleetFlow's Built-In Deliverability Tools

### ✅ You Already Have These Services:

1. **EmailAuthenticationSetupGuide** (`/app/services/EmailAuthenticationSetupGuide.ts`)
   - Generate SPF, DKIM, DMARC records
   - Check authentication status
   - Get DNS setup instructions

2. **EmailWarmupService** (`/app/services/EmailWarmupService.ts`)
   - 30-day warm-up schedule
   - Gradual volume increase
   - Engagement tracking

3. **SendingIPManager** (`/app/services/SendingIPManager.ts`)
   - IP pool management
   - Reputation monitoring
   - Auto-quarantine bad IPs

4. **SendGridService** (`/app/services/sendgrid-service.ts`)
   - Email sending with tracking
   - Bounce/complaint handling
   - Category tagging

---

## 🎯 Strategic Sales Campaign-Specific Settings

### Recommended Configuration for FleetFlow Sales:

```typescript
// Strategic Sales Campaign Service Configuration
const strategicSalesConfig = {
  // Domain & Authentication
  sendingDomain: 'fleetflowapp.com',
  fromEmail: 'sarah@fleetflowapp.com', // Use real AI staff email
  fromName: 'Sarah from FleetFlow',
  replyTo: 'sarah@fleetflowapp.com',

  // Volume Limits (Conservative Start)
  maxDailyVolume: 200, // Start low, increase weekly
  maxWeeklyVolume: 1000,

  // Sending Schedule
  sendingHours: { start: 9, end: 17 }, // 9am-5pm EST
  sendingDays: ['Tuesday', 'Wednesday', 'Thursday'], // Best days
  delayBetweenEmails: { min: 15000, max: 45000 }, // 15-45 seconds

  // List Hygiene
  verifyEmailsBeforeSending: true,
  removeBouncesImmediately: true,
  honorUnsubscribesWithin: 24, // hours

  // Engagement Tracking
  trackOpens: true,
  trackClicks: true,
  trackReplies: true,

  // Deliverability Protection
  maxBounceRate: 0.02, // 2%
  maxComplaintRate: 0.001, // 0.1%
  minDeliverabilityRate: 0.95, // 95%

  // A/B Testing
  enableABTesting: true,
  variantsPerStage: 3,
  testDuration: 7, // days
};
```

---

## 📅 30-Day Launch Timeline

### Week 1: Authentication Setup

- **Day 1-2:** Generate and add SPF, DKIM, DMARC records
- **Day 3-4:** Verify all DNS records
- **Day 5-7:** Monitor DMARC reports, fix any issues

### Week 2-5: Email Warm-up

- **Day 8-14:** Send 5-20 emails/day to internal accounts
- **Day 15-21:** Send 20-50 emails/day to friendly partners
- **Day 22-28:** Send 50-100 emails/day to mixed audience
- **Day 29-35:** Send 100-200 emails/day to all audiences

### Week 6+: Strategic Sales Launch

- **Day 36:** Launch first Strategic Sales campaign (200 emails/day)
- **Day 43:** Increase to 300 emails/day (if metrics are good)
- **Day 50:** Increase to 500 emails/day (if metrics are good)
- **Day 57:** Increase to 1,000 emails/day (if metrics are good)

---

## 🛡️ Domain Protection Strategy

### Primary Domain: fleetflowapp.com

- **Use For:** Transactional emails, customer communications, critical notifications
- **Protect:** NEVER use for cold outreach without proper warm-up
- **Reputation:** Keep pristine (95%+ deliverability)

### Marketing Subdomain: marketing.fleetflowapp.com (RECOMMENDED)

- **Use For:** Strategic Sales campaigns, newsletters, promotions
- **Benefit:** Protects primary domain reputation
- **Setup:** Separate SPF/DKIM/DMARC records

### Backup Domain: fleetflow.io or fleetflow.co (OPTIONAL)

- **Use For:** High-volume campaigns, testing, aggressive outreach
- **Benefit:** Ultimate protection for primary domain
- **Cost:** $10-15/year per domain

---

## 📈 Expected Results Timeline

### Month 1: Foundation

- **Deliverability:** 90-95%
- **Open Rate:** 15-20%
- **Reply Rate:** 2-3%
- **Meetings Booked:** 5-10

### Month 2: Optimization

- **Deliverability:** 95-97%
- **Open Rate:** 20-25%
- **Reply Rate:** 3-5%
- **Meetings Booked:** 15-25

### Month 3+: Scale

- **Deliverability:** 97-99%
- **Open Rate:** 25-30%
- **Reply Rate:** 5-8%
- **Meetings Booked:** 25-50+

---

## 🎓 Resources & Tools

### Email Authentication Checkers

- **MXToolbox:** https://mxtoolbox.com/SuperTool.aspx
- **Mail Tester:** https://www.mail-tester.com/
- **DMARC Analyzer:** https://www.dmarcanalyzer.com/

### Reputation Monitoring

- **Google Postmaster Tools:** https://postmaster.google.com/
- **Microsoft SNDS:** https://sendersupport.olc.protection.outlook.com/snds/
- **Sender Score:** https://www.senderscore.org/

### Email Verification Services

- **NeverBounce:** https://neverbounce.com/ ($8 per 1,000 verifications)
- **ZeroBounce:** https://www.zerobounce.net/ ($16 per 1,000 verifications)
- **Hunter.io:** https://hunter.io/email-verifier (Free tier: 50/month)

### Blacklist Checkers

- **MXToolbox Blacklist Check:** https://mxtoolbox.com/blacklists.aspx
- **MultiRBL:** http://multirbl.valli.org/

---

## ✅ Final Pre-Launch Checklist

Before launching ANY Strategic Sales campaign:

- [ ] **SPF record configured and verified** ✅
- [ ] **DKIM record configured and verified** ✅
- [ ] **DMARC record configured and verified** ✅
- [ ] **30-day email warm-up completed** ✅
- [ ] **Deliverability >95%** ✅
- [ ] **Bounce rate <2%** ✅
- [ ] **Complaint rate <0.1%** ✅
- [ ] **IP reputation >90** ✅
- [ ] **Email content tested (spam score 8+)** ✅
- [ ] **Unsubscribe link working** ✅
- [ ] **Physical address included** ✅
- [ ] **List verified (no invalid emails)** ✅
- [ ] **Sending volume limits configured** ✅
- [ ] **Monitoring dashboard active** ✅

---

## 🚀 You're Ready When...

✅ All DNS records verified (SPF, DKIM, DMARC) ✅ 30-day warm-up completed with 95%+ deliverability
✅ Bounce rate <2%, complaint rate <0.1% ✅ IP reputation >90 ✅ Email content passes spam filters
(8+ score) ✅ Monitoring tools active (Google Postmaster, SNDS) ✅ List verified and segmented ✅
Sending limits configured and tested

**Then and ONLY then, launch your Strategic Sales campaigns with confidence!**

---

## 💡 Pro Tips from FleetFlow's Email Infrastructure

1. **Use Real People's Names** → "Sarah from FleetFlow" not "FleetFlow Marketing"
2. **Reply-To Must Be Monitored** → Use sarah@fleetflowapp.com, not noreply@
3. **Personalize Beyond {firstName}** → Reference company, industry, pain points
4. **Send from Consistent Address** → Don't switch between sarah@, sales@, marketing@
5. **Warm Up Each New Sender** → If adding Marcus, warm up his email separately
6. **Monitor Engagement by Segment** → Stop emailing non-engagers after 3 attempts
7. **Use Subdomain for Marketing** → Protects primary domain reputation
8. **Test Everything** → Subject lines, send times, content length, link count
9. **Honor Unsubscribes FAST** → Process within 24 hours, not 10 days
10. **Track Sender Reputation Daily** → Use Google Postmaster Tools religiously

---

## 📞 Need Help?

**FleetFlow Email Infrastructure Team:**

- **Primary:** ddavis@fleetflowapp.com
- **Technical:** security@fleetflowapp.com
- **Deliverability Issues:** support@fleetflowapp.com

**SendGrid Support:**

- **Dashboard:** https://app.sendgrid.com/
- **Support:** https://support.sendgrid.com/
- **Phone:** 1-877-969-5535

---

## 🎉 Summary

**You have EXCELLENT email infrastructure already built into FleetFlow!**

✅ EmailAuthenticationSetupGuide → SPF/DKIM/DMARC generation ✅ EmailWarmupService → 30-day warm-up
automation ✅ SendingIPManager → IP reputation monitoring ✅ SendGridService → Professional email
sending

**Just follow this checklist to ensure you:**

1. ✅ Authenticate your domain properly (SPF, DKIM, DMARC)
2. ✅ Warm up your sending reputation (30 days)
3. ✅ Monitor deliverability metrics daily
4. ✅ Follow sending best practices
5. ✅ Protect your domain reputation

**Result: 95%+ deliverability, inbox placement, and predictable pipeline generation!**

---

**Last Updated:** October 6, 2025 **Version:** 1.0 **Owner:** DEPOINTE AI Company Dashboard -
Strategic Sales Team

