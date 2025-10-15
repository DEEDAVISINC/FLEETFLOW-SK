# R&D Tax Credit Documentation Guide

## What "Documentation" Actually Means for FleetFlow

**Date**: October 8, 2025 **Purpose**: Practical guide to documenting R&D activities for tax credit
claims

---

## 🎯 The Big Picture

When the IRS says you need "contemporaneous documentation," they mean **proof created DURING the R&D
work** (not after the fact) that shows:

1. **WHAT** you were trying to build/solve
2. **WHY** it was technically uncertain
3. **HOW** you experimented to solve it
4. **WHO** worked on it and for how long
5. **HOW MUCH** it cost

**Good News**: You're already creating most of this documentation naturally as you code! You just
need to organize it.

---

## 📋 The 5 Types of Documentation You Need

### **1. Project Documentation** (What & Why)

#### **What This Means:**

Document each major feature/component you're building and explain why it's technically challenging.

#### **What You Already Have:**

- ✅ GitHub repository with code
- ✅ README files
- ✅ Code comments
- ✅ Service files with descriptions

#### **What You Need to Add:**

**Create a simple R&D Project Log** (spreadsheet or document):

| Project Name              | Start Date | End Date   | Technical Challenge                                                   | Business Component  |
| ------------------------- | ---------- | ---------- | --------------------------------------------------------------------- | ------------------- |
| Desiree AI Agent          | 2025-01-15 | 2025-02-28 | How to train AI to identify high-quality leads from unstructured data | Lead Generation AI  |
| Multi-Tenant Architecture | 2025-02-01 | 2025-03-15 | How to isolate tenant data securely while maintaining performance     | SaaS Platform Core  |
| NEMT Healthcare Platform  | 2025-03-01 | 2025-04-30 | How to build HIPAA-compliant system with Medicaid integration         | Healthcare Division |
| 18 AI Agents Integration  | 2025-04-01 | 2025-06-30 | How to make 18 AI agents work together without conflicts              | AI Orchestration    |
| Pallet Scanning AI        | 2025-05-01 | 2025-07-15 | How to detect freight damage using computer vision                    | Premium Service     |

**Example Entry:**

```markdown
## Project: Desiree AI Agent (Lead Generation)

**Start Date**: January 15, 2025 **End Date**: February 28, 2025

**Technical Challenge (Uncertainty):** How do we train an AI agent to automatically identify
high-quality freight broker leads from unstructured data sources (LinkedIn, company websites,
industry databases) with

> 80% accuracy?

**Why This Was Uncertain:**

- No existing AI model trained on freight broker lead qualification
- Unclear which data points predict lead quality
- Unknown how to integrate multiple data sources in real-time
- Uncertain how to avoid false positives/negatives

**Business Component:** AI-powered lead generation system that replaces manual prospecting

**Qualified Expenses:**

- Developer wages: $15,000
- API costs (OpenAI, data sources): $2,000
- Cloud hosting: $500
```

#### **How to Create This:**

- Spend **2-3 hours** creating this log for all major projects
- Update it **monthly** as you start new projects
- Keep it simple (spreadsheet or Google Doc is fine)

---

### **2. Technical Uncertainty Documentation** (Why It Was Hard)

#### **What This Means:**

Prove that you didn't know how to solve the problem at the start.

#### **What You Already Have:**

- ✅ Code iterations in GitHub (shows you tried different approaches)
- ✅ Bug reports/issues
- ✅ Stack Overflow searches (browser history)

#### **What You Need to Add:**

**Create a "Technical Uncertainties" document** for each major project:

**Example:**

```markdown
## Technical Uncertainties: Multi-Tenant SaaS Architecture

### Uncertainty #1: Data Isolation

**Question**: How do we ensure Tenant A can never access Tenant B's data?

**Why Uncertain**:

- Multiple approaches exist (separate databases, row-level security, schema isolation)
- Unknown which approach scales best
- Unclear performance impact of each approach
- Security implications not fully understood

**Alternatives Evaluated**:

1. Separate database per tenant (too expensive, doesn't scale)
2. Shared database with tenant_id column (risk of query bugs exposing data)
3. PostgreSQL Row-Level Security (chosen - but required experimentation)

**Resolution**: Implemented PostgreSQL RLS after testing showed 15% performance overhead but 100%
data isolation guarantee.

### Uncertainty #2: Authentication Across Tenants

**Question**: How do users authenticate when multiple tenants share the same domain?

**Why Uncertain**:

- JWT tokens need tenant context
- Session management across subdomains unclear
- Unknown how to prevent token reuse across tenants

**Alternatives Evaluated**:

1. Separate subdomain per tenant (DNS complexity)
2. Tenant ID in JWT claims (chosen)
3. Separate auth servers per tenant (too expensive)

**Resolution**: Embedded tenant_id in JWT claims with middleware validation on every request.
```

#### **How to Create This:**

- For each major project, write **3-5 technical uncertainties**
- Describe **2-3 alternatives** you considered for each
- Explain **why you chose** the final approach
- Takes **1-2 hours per project**

---

### **3. Experimentation Documentation** (How You Solved It)

#### **What This Means:**

Show that you tested different approaches (not just built the first thing that came to mind).

#### **What You Already Have:**

- ✅ GitHub commits showing iterations
- ✅ Different branches for experiments
- ✅ Code comments like "// tried X but Y was faster"

#### **What You Need to Add:**

**Create an "Experiments Log"**:

**Example:**

```markdown
## Experiment Log: AI Agent Response Time Optimization

### Experiment #1: Parallel API Calls

**Date**: March 15, 2025 **Hypothesis**: Calling multiple AI agents in parallel will reduce response
time **Method**: Refactored sequential API calls to Promise.all() **Result**: Response time reduced
from 8.5s to 3.2s (62% improvement) **Conclusion**: SUCCESS - implemented in production

### Experiment #2: Caching AI Responses

**Date**: March 22, 2025 **Hypothesis**: Caching similar queries will reduce API costs and improve
speed **Method**: Implemented Redis cache with 24-hour TTL **Result**: Cache hit rate 45%, reduced
API costs by $400/month **Conclusion**: SUCCESS - implemented in production

### Experiment #3: Fine-Tuned Model vs. GPT-4

**Date**: April 5, 2025 **Hypothesis**: Fine-tuned model will be faster and cheaper than GPT-4
**Method**: Trained custom model on 10,000 freight broker queries **Result**: Accuracy dropped from
94% to 78%, not acceptable **Conclusion**: FAILED - continued using GPT-4

### Experiment #4: Database Query Optimization

**Date**: April 18, 2025 **Hypothesis**: Adding indexes will speed up tenant data queries
**Method**: Added composite indexes on (tenant_id, created_at) **Result**: Query time reduced from
450ms to 85ms (81% improvement) **Conclusion**: SUCCESS - implemented across all tables
```

#### **How to Create This:**

- **As you code**, keep a running log of experiments
- Note **what worked** and **what didn't**
- Include **performance metrics** (speed, cost, accuracy)
- Takes **5-10 minutes per experiment** (do it in real-time)

---

### **4. Time Tracking** (Who & How Long)

#### **What This Means:**

Track how much time you (and any employees) spend on qualified R&D activities.

#### **What You Already Have:**

- ✅ GitHub commit timestamps
- ✅ Your work schedule (you know roughly when you coded)

#### **What You Need to Add:**

**Option A: Simple Time Log** (Spreadsheet)

| Date       | Person        | Project      | Hours | Activity Type         | Qualified? |
| ---------- | ------------- | ------------ | ----- | --------------------- | ---------- |
| 2025-01-15 | Dieasha Davis | Desiree AI   | 8     | AI model training     | YES        |
| 2025-01-16 | Dieasha Davis | Desiree AI   | 6     | Testing & iteration   | YES        |
| 2025-01-17 | Dieasha Davis | UI Design    | 4     | Frontend styling      | NO         |
| 2025-01-18 | Dieasha Davis | Multi-Tenant | 8     | Database architecture | YES        |

**Option B: Use Time Tracking Software**

- Toggl Track (free)
- Clockify (free)
- Harvest (paid)

**What Qualifies as R&D Time:**

- ✅ Writing code for new features
- ✅ Testing and debugging technical issues
- ✅ Researching technical solutions
- ✅ Experimenting with different approaches
- ✅ Designing system architecture
- ✅ Integrating APIs

**What DOESN'T Qualify:**

- ❌ Marketing activities
- ❌ Sales calls
- ❌ Administrative tasks
- ❌ Basic UI styling (unless solving technical challenge)
- ❌ Writing documentation for users

#### **How to Create This:**

**Retroactive (for 2025 so far):**

1. Look at your GitHub commits (timestamps show when you worked)
2. Estimate hours per day based on commit activity
3. Assume **80-90% of development time is qualified**
4. Create a spreadsheet with estimates

**Example:**

```
January 2025: 160 hours total development
- 140 hours qualified R&D (AI agents, platform architecture)
- 20 hours non-qualified (UI tweaks, admin)

February 2025: 180 hours total development
- 160 hours qualified R&D (multi-tenant, NEMT platform)
- 20 hours non-qualified (marketing site, documentation)
```

**Going Forward:**

- Track time **daily** (takes 2 minutes per day)
- Use a simple spreadsheet or time tracking app
- Note project and whether it's qualified R&D

---

### **5. Expense Tracking** (How Much)

#### **What This Means:**

Track all costs related to R&D activities.

#### **What You Already Have:**

- ✅ Bank statements
- ✅ Credit card statements
- ✅ Invoices from vendors

#### **What You Need to Add:**

**Create an "R&D Expenses" spreadsheet**:

| Date       | Vendor        | Description           | Amount | Category  | Qualified? |
| ---------- | ------------- | --------------------- | ------ | --------- | ---------- |
| 2025-01-15 | OpenAI        | API usage (AI agents) | $450   | Supplies  | YES        |
| 2025-01-31 | Digital Ocean | Cloud hosting         | $120   | Supplies  | YES        |
| 2025-02-15 | GitHub        | Pro subscription      | $21    | Supplies  | YES        |
| 2025-02-28 | Anthropic     | Claude API usage      | $380   | Supplies  | YES        |
| 2025-03-15 | Supabase      | Database hosting      | $25    | Supplies  | YES        |
| 2025-04-01 | Mailchimp     | Email marketing       | $50    | Marketing | NO         |

**Categories:**

**Wages** (largest category):

- Your salary/draws from the business
- Any employee/contractor wages
- Calculate: Annual salary × % of time on R&D

**Supplies**:

- ✅ Cloud hosting (Digital Ocean, AWS, Vercel)
- ✅ API costs (OpenAI, Anthropic, Twilio, etc.)
- ✅ Development tools (GitHub, IDEs, testing tools)
- ✅ Database hosting (Supabase, PostgreSQL)
- ✅ Software licenses for development
- ❌ Office supplies (paper, pens - not qualified)
- ❌ Marketing tools (not qualified)

**Contract Research** (if applicable):

- Third-party developers hired for R&D tasks
- AI/ML consultants
- 65% of contract costs qualify

#### **How to Create This:**

**Retroactive (for 2025 so far):**

1. Download bank/credit card statements (Jan-Oct 2025)
2. Highlight all tech-related expenses
3. Categorize as qualified or not qualified
4. Total up qualified expenses

**Going Forward:**

- Add expenses to spreadsheet **monthly**
- Keep all receipts/invoices
- Takes **30 minutes per month**

---

## 🚀 Quick Start: 3-Hour Documentation Sprint

If you want to get 80% of the documentation done quickly, here's a **3-hour sprint**:

### **Hour 1: Project Log**

- Create spreadsheet with all major projects (18 AI agents, platform features)
- For each project, write 2-3 sentences on technical challenge
- List start/end dates (estimate if needed)

### **Hour 2: Time & Expenses**

- Review GitHub commits to estimate hours worked per month
- Calculate % of time on qualified R&D (probably 80-90%)
- Download bank statements and highlight tech expenses
- Total up qualified expenses

### **Hour 3: Technical Uncertainties**

- Pick your **top 5 projects** (biggest time/money spent)
- For each, write 2-3 technical uncertainties
- List alternatives you considered
- Explain final solution

**Result**: You'll have 80% of what you need for R&D credit claim!

---

## 📁 Recommended File Structure

Create a folder: `/FLEETFLOW/RD_TAX_CREDIT_DOCUMENTATION/`

```
RD_TAX_CREDIT_DOCUMENTATION/
├── 2025_Project_Log.xlsx
├── 2025_Time_Tracking.xlsx
├── 2025_Expenses.xlsx
├── Technical_Uncertainties/
│   ├── AI_Agents_Development.md
│   ├── Multi_Tenant_Architecture.md
│   ├── NEMT_Healthcare_Platform.md
│   ├── API_Integrations.md
│   └── Computer_Vision_Pallet_Scanning.md
├── Experiments_Log/
│   ├── AI_Performance_Optimization.md
│   ├── Database_Query_Optimization.md
│   └── Security_Testing.md
└── Supporting_Documents/
    ├── GitHub_Commit_History.pdf
    ├── Invoices/ (all tech vendor invoices)
    └── Architecture_Diagrams/
```

---

## 🎯 What Your CPA/R&D Specialist Will Do

When you hire an R&D tax credit specialist, they will:

1. **Review your documentation** (what you created above)
2. **Interview you** about technical challenges (1-2 hours)
3. **Calculate qualified expenses** using your time/expense tracking
4. **Prepare Form 6765** (Credit for Increasing Research Activities)
5. **Write technical narrative** for IRS (if audited)
6. **Calculate maximum credit** (they're experts at this)

**Your job**: Provide the raw documentation (projects, time, expenses) **Their job**: Turn it into a
compliant R&D credit claim

---

## ⏱️ Time Investment Summary

| Task                                      | Frequency | Time Required  |
| ----------------------------------------- | --------- | -------------- |
| **Initial Setup** (retroactive for 2025)  | One-time  | 3-5 hours      |
| **Monthly Project Log Update**            | Monthly   | 15 minutes     |
| **Daily Time Tracking**                   | Daily     | 2 minutes      |
| **Monthly Expense Tracking**              | Monthly   | 30 minutes     |
| **Quarterly Uncertainties Documentation** | Quarterly | 1 hour         |
| **Annual CPA Meeting**                    | Yearly    | 2 hours        |
| **TOTAL (Year 1)**                        |           | ~15 hours      |
| **TOTAL (Ongoing Years)**                 |           | ~10 hours/year |

**ROI**: 15 hours of work = $50,000-$60,000 in tax credits = **$3,000-$4,000 per hour**

---

## ✅ Simple Checklist

### **This Week:**

- [ ] Create `/RD_TAX_CREDIT_DOCUMENTATION/` folder
- [ ] Create `2025_Project_Log.xlsx` with all major projects
- [ ] Review GitHub commits to estimate hours worked
- [ ] Download bank statements and highlight tech expenses

### **This Month:**

- [ ] Write technical uncertainties for top 5 projects
- [ ] Create experiments log with 5-10 experiments
- [ ] Calculate total qualified expenses (Jan-Oct 2025)
- [ ] Estimate total qualified hours (Jan-Oct 2025)

### **Before Tax Filing (April 2026):**

- [ ] Hire R&D tax credit specialist
- [ ] Provide all documentation to specialist
- [ ] Review and approve Form 6765
- [ ] File tax return with R&D credit

### **Going Forward (2026+):**

- [ ] Track time daily (2 minutes)
- [ ] Log expenses monthly (30 minutes)
- [ ] Update project log monthly (15 minutes)
- [ ] Document uncertainties quarterly (1 hour)

---

## 💡 Pro Tips

### **1. GitHub is Your Best Friend**

Your commit history is **contemporaneous documentation** that the IRS loves:

- Shows what you worked on and when
- Proves you iterated and experimented
- Timestamps are automatic and trustworthy

### **2. Keep It Simple**

You don't need fancy software. A Google Sheet is fine:

- Project log: 1 sheet
- Time tracking: 1 sheet
- Expenses: 1 sheet

### **3. Document as You Go**

Spending 5 minutes per day documenting is WAY easier than trying to recreate 12 months of work
later.

### **4. When in Doubt, Document It**

If you're unsure whether something qualifies, document it anyway. Let your CPA decide.

### **5. Save Everything**

- GitHub commits
- Slack/email discussions about technical problems
- Architecture diagrams
- Performance benchmarks
- Bug reports
- API documentation

---

## 🚨 What NOT to Do

### **❌ Don't Recreate Documentation After the Fact**

The IRS wants "contemporaneous" documentation (created during R&D). Don't write fake dates.

### **❌ Don't Claim Everything as R&D**

Marketing, sales, admin work don't qualify. Be honest about what's R&D vs. other activities.

### **❌ Don't Skip Time Tracking**

"I worked a lot" isn't enough. You need hours (even estimates based on GitHub commits).

### **❌ Don't Lose Receipts**

Keep all invoices for tech expenses. Digital copies are fine.

### **❌ Don't DIY the Tax Forms**

Hire a specialist. Form 6765 is complex, and mistakes can trigger audits.

---

## 📞 Questions?

**"Do I really need to do all this?"** Yes, if you want to claim $50K+ in credits. The IRS requires
documentation.

**"What if I didn't track time in 2025?"** Use GitHub commits to estimate hours retroactively. Not
perfect, but acceptable.

**"Can I just have my CPA do everything?"** No. You need to provide the raw data (projects, time,
expenses). They can't create it for you.

**"What if I get audited?"** With proper documentation, you'll be fine. That's why contemporaneous
documentation matters.

**"Is this really worth it?"** YES. 15 hours of work for $50K-$60K = $3,000-$4,000 per hour. Best
ROI you'll ever get.

---

## 🎯 Bottom Line

**"Documentation" = 4 Simple Things:**

1. **Project Log**: What you built and why it was hard (3 hours one-time)
2. **Time Tracking**: How many hours on R&D (2 min/day going forward)
3. **Expense Tracking**: What you spent on R&D (30 min/month)
4. **Technical Uncertainties**: How you solved hard problems (1 hour/quarter)

**Total Time Investment**: ~15 hours in Year 1, ~10 hours/year ongoing

**Total Value**: $50K-$60K (2025), $200K-$300K/year (post-Series A), $1M+ (3 years)

**Start today. Your future self (and your bank account) will thank you.**

---

_Document Created: October 8, 2025_ _Purpose: Practical R&D tax credit documentation guide_ _Time to
Complete Initial Setup: 3-5 hours_ _Expected ROI: $3,000-$4,000 per hour invested_






