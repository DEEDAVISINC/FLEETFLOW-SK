# 🏛️ GOVERNMENT CONTRACT PRICING - EXAMPLE WORKFLOW

## SCENARIO: County Public Works Trucking Contract

### **User Action:**

User uploads: `"County_Public_Works_Stone_Trucking_RFB.pdf"`

---

## 📋 STEP 1: DOCUMENT ANALYSIS

**System reads PDF and finds:**

- "Oakland County Department of Public Works"
- "Request for Bid (RFB) PW-26-107-B"
- "Firm Fixed Price Contract"
- "Evaluation Method: Lowest Price Technically Acceptable (LPTA)"
- "50 loads per day, 5 days/week"
- "10-yard dump trucks required"
- "Average haul: 25 miles each way"

**🔍 Detection Result:** ✅ GOVERNMENT SOLICITATION (3 indicators found)

- Government entity: County
- Contract type: Firm Fixed Price
- Evaluation method: LPTA

---

## 📊 STEP 2: COST CALCULATION

### **Direct Labor:**

**Drivers:**

- Loads/day: 50
- Hours per load cycle: 4 hours (50 miles @ 12.5 mph avg)
- Loads per driver/day: 2.5
- Drivers needed: 50 ÷ 2.5 = **20 drivers** → rounds to **9 drivers** (realistic)
- Hours/month: 9 drivers × 176 hours = **1,584 hours**
- Wage: $25/hour (BLS median for Michigan)
- Base pay: 1,584 × $25 = **$39,600/month**
- Fringe (30%): **$11,880/month**
- **Total: $51,480/month**

**Dispatchers:**

- Need: 1 dispatcher per 15-20 drivers
- 9 drivers ÷ 15 = **2 dispatchers**
- Hours: 2 × 176 = 352 hours
- Wage: $30/hour
- Base pay: **$10,560/month**
- Fringe: **$3,168/month**
- **Total: $13,728/month**

**Supervisor:**

- Need: **1 operations supervisor**
- Hours: 176
- Wage: $35/hour
- Base pay: **$6,160/month**
- Fringe: **$1,848/month**
- **Total: $8,008/month**

**Total Direct Labor: $73,216/month**

### **Direct Materials:**

**Fuel:**

- Miles/month: 50 loads/day × 22 days × 50 miles = **55,000 miles**
- MPG: 6.5 (loaded dump truck)
- Gallons: 55,000 ÷ 6.5 = **8,462 gallons**
- Price: $3.80/gallon (DOE current Michigan average)
- **Total: $32,155/month**

**Supplies:**

- Maintenance supplies: $500
- Safety equipment: $300
- Office supplies: $200
- **Total: $1,000/month**

**Total Direct Materials: $33,155/month**

### **Subcontractors:**

- Contracted maintenance: $3,000/month
- Backup equipment rental: $1,500/month
- **Total: $4,500/month**

**Total Direct Costs: $110,871/month**

### **Indirect Costs (Overhead):**

- Rate: 37.8% of Direct Labor
- $73,216 × 0.378 = **$27,700/month**

### **Total Cost:**

- $110,871 + $27,700 = **$138,571/month**

### **Profit:**

Using FAR 15.404-4 Weighted Guidelines:

- Base profit: 10.0%
- FFP risk premium: +2.0%
- **Total profit rate: 12.0%**
- $138,571 × 0.12 = **$16,628/month**

### **Total Price:**

- $138,571 + $16,628 = **$155,199/month**

**Annual:** $1,862,388

**Per Load:** $155,199 ÷ 1,100 = **$141.09/load**

---

## 🎯 STEP 3: PRICING STRATEGY

### **Evaluation Method: LPTA** ⚠️

**Market Comparison:**

- Spot market average: $95/load
- Your calculated price: $141.09/load
- **Difference: +48.5% above market**

### **⚠️ COMPETITIVE RISK: HIGH**

**System Recommendations:**

1. **DECLINE TO BID (Recommended if unprofitable at market rates)**
   - Market rate ($95/load) is below your cost ($126/load)
   - You would lose money on every load

2. **REDUCE COSTS to compete:**
   - Switch to broker model (coordinate carriers vs own trucks)
   - Use owner-operators vs W-2 drivers
   - Reduce overhead allocation
   - **Target price: $100-110/load to be competitive**

3. **PARTNER with lower-cost provider:**
   - Subcontract actual hauling
   - Focus on dispatch/coordination value-add

### **Strategic Decision:**

**For LPTA:** You MUST be the lowest price to win. Your current cost structure cannot compete
profitably.

**Options:**

- **Decline bid** (recommended)
- **Restructure costs** (broker model, reduce overhead)
- **Partner with asset carrier** (subcontract hauling)

---

## 📄 STEP 4: GENERATED SCHEDULES

System automatically generates all 5 FAR-compliant schedules:

### **Schedule 1: Labor Detail**

- Complete breakdown of all 3 labor categories
- Hourly rates, hours, fringe benefit details
- 2 pages

### **Schedule 2: Bill of Materials**

- Fuel (8,462 gallons @ $3.80)
- All supplies with sources
- Subcontractor services
- 2 pages

### **Schedule 3: Indirect Rate Computation**

- Annual overhead pool: $332,400
- Direct labor base: $878,592
- Rate calculation: 37.8%
- Industry benchmark validation
- 2 pages

### **Schedule 4: Basis of Estimate**

- Detailed justification for every cost element
- BLS wage data references
- DOE fuel pricing sources
- Industry standards
- 4 pages

### **Schedule 5: Pricing Narrative**

- Fair and reasonable price determination
- Cost-based pricing methodology
- Value proposition (quality, WOSB, technology)
- Risk mitigation
- Contract-specific considerations
- 3 pages

**Total Documentation: 13 pages of professional, audit-ready pricing**

---

## ✅ STEP 5: VERIFICATION

**System checks:**

✅ Labor costs calculated ✅ Material costs included ✅ Overhead rate reasonable (30-45%) ✅ Profit
margin within FAR guidelines (8-15%) ✅ Pricing strategy developed ✅ Mathematical accuracy
confirmed

**Warnings:** ⚠️ HIGH competitive risk - price significantly above market average ⚠️ LPTA
evaluation - lowest price wins, not best value

**Recommendation:** ⚠️ REVIEW BEFORE SUBMISSION - Consider declining bid or restructuring costs

---

## 💼 STEP 6: USER DECISION

**User sees complete analysis and decides:**

**Option A: Decline Bid**

- Cannot compete profitably at market rates
- Save time and focus on better opportunities

**Option B: Restructure as Broker**

- Switch to broker model
- Coordinate with asset carriers @ $100/load
- Add 8% broker margin
- New price: $108/load (competitive!)
- Submit revised bid

**Option C: Partner**

- Team with asset carrier who owns trucks
- Split work 50/50
- Carrier handles equipment, you handle dispatch/coordination
- Joint pricing: $105/load
- Submit teaming agreement

---

## 🎉 RESULT

**System saved user:**

- ✅ 10+ hours of manual pricing calculations
- ✅ 5+ hours creating schedules
- ✅ Risk of non-compliant proposal (rejection)
- ✅ Risk of unprofitable bid (winning at a loss)

**User gained:**

- ✅ Complete cost transparency
- ✅ Strategic decision support
- ✅ Professional FAR-compliant documentation
- ✅ Confidence in pricing accuracy

**Total Time: 30 minutes vs. 15+ hours manual**

---

## 🔄 COMPARISON: BEST VALUE SCENARIO

**What if evaluation method was Best Value instead of LPTA?**

**Evaluation Factors:**

- Technical: 40%
- Past Performance: 30%
- Price: 30%

**System Analysis:**

### **Competitive Risk: LOW** ✅

**Recommendations:**

- ✅ Best Value with price at 30% allows premium pricing for quality
- Submit at calculated price: $141.09/load
- **Strong value justification:**
  - WOSB certification (diversity goals)
  - FleetFlow™ technology (real-time tracking)
  - 99.8% on-time delivery rate
  - Zero safety violations
  - W-2 employed drivers (consistent quality)

**Pricing Strategy:** "Your 48% premium over spot market is JUSTIFIED by superior quality,
reliability, and socioeconomic value. Focus technical proposal on differentiators."

**Decision: SUBMIT BID with confidence!**

---

## 🎯 KEY TAKEAWAY

**Same cost structure, different evaluation methods = completely different strategy!**

- **LPTA:** Must be lowest price → Decline or restructure
- **Best Value:** Can justify premium → Submit with value emphasis

**The Government Pricing System analyzes BOTH cost AND strategy to help you make smart decisions!**

---

_This example demonstrates the power of intelligent government contract pricing analysis._
