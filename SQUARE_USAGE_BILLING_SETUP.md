# Square Usage-Based Billing Setup Guide

## AI Flow Usage-Based Add-On Configuration

### Square Item Setup

**Item Details:**

- **Name:** AI Flow Usage-Based Add-On
- **Category:** AI Flow Add-Ons
- **SKU:** ai_flow_usage_addon
- **Type:** Subscription Item

**Variations:**

1. **Monthly Base**
   - Name: "Monthly Base"
   - Price: $0.00
   - Billing: Monthly

2. **Annual Base**
   - Name: "Annual Base"
   - Price: $0.00
   - Billing: Yearly

**Description:**

```
AI Flow Usage-Based Add-On - Pay-Per-Operation AI Automation

Enterprise-grade AI automation with usage-based pricing:

• $0 monthly base fee - no minimums
• $0.10 per 1,000 AI operations
• Unlimited AI workflows and features
• All enterprise AI capabilities included
• Volume discounts available
• Enterprise SLA included

Perfect for businesses with variable AI usage who prefer pay-as-you-go pricing.

Usage is tracked automatically and billed monthly based on actual AI operations performed.
```

### Technical Implementation

**1. Square Subscription:**

- Customer subscribes to $0 base plan
- FleetFlow tracks usage in real-time
- Monthly usage calculated automatically

**2. Usage Billing Process:**

```typescript
// Monthly billing automation
const monthlyUsage = await trackAIOperations(customerId);
const usageCharge = Math.floor(monthlyUsage / 1000) * 0.10;

// Add usage charge to Square invoice
await squareService.addInvoiceAdjustment(customerId, {
  amount: usageCharge,
  description: `AI Operations: ${monthlyUsage.toLocaleString()} ops @ $0.10/1k`
});
```

**3. Customer Communication:**

- Real-time usage dashboard
- Monthly usage reports
- Billing transparency
- Usage alerts and limits

### Alternative: Tiered Usage Plans

If pure usage-based is complex, create tiered plans:

**Tier 1: AI Flow Light**

- $25/month (250,000 operations included)
- $0.10/1,000 additional operations

**Tier 2: AI Flow Standard**

- $75/month (750,000 operations included)
- $0.08/1,000 additional operations

**Tier 3: AI Flow Enterprise**

- $200/month (2,000,000 operations included)
- $0.05/1,000 additional operations

This provides predictable base revenue with usage flexibility.

### Billing Automation

FleetFlow handles:

- ✅ Real-time usage tracking
- ✅ Monthly usage calculations
- ✅ Automatic invoice adjustments
- ✅ Usage reporting and analytics
- ✅ Customer notifications

Square handles:

- ✅ Base subscription billing
- ✅ Payment processing
- ✅ Invoice delivery
- ✅ Payment failures and retries

