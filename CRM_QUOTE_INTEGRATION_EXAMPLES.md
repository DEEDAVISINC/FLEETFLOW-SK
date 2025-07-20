# 🚀 FleetFlow CRM Quote Integration Examples

## Overview
This document provides comprehensive examples of how to integrate quote generation events with the FleetFlow CRM to automatically create opportunities, track sales pipeline progression, and maintain comprehensive quote-to-deal visibility.

## 🏗️ **Architecture Overview**

### Components
1. **CRMQuoteIntegrationService**: Main service for quote-CRM integration
2. **CRM API Endpoints**: `/api/crm/quote-integration/`
3. **Webhook Handlers**: For real-time quote event processing
4. **Pipeline Management**: Automatic opportunity stage progression

---

## 💰 **Basic Quote Integration**

### Example 1: Automatic Opportunity Creation When Quote is Generated

```typescript
import CRMQuoteIntegrationService from './services/CRMQuoteIntegrationService';

// Initialize the service
const quoteIntegration = new CRMQuoteIntegrationService('your-org-id');

// When quote is generated, create CRM opportunity
async function handleQuoteGeneration(quote: any, shipper: any) {
  try {
    await quoteIntegration.createQuoteOpportunity({
      id: quote.id,
      shipper_contact_id: shipper.id,
      origin: `${quote.origin_city}, ${quote.origin_state}`,
      origin_city: quote.origin_city,
      origin_state: quote.origin_state,
      destination: `${quote.destination_city}, ${quote.destination_state}`,
      destination_city: quote.destination_city,
      destination_state: quote.destination_state,
      totalRate: quote.totalRate,
      distance_miles: quote.distance,
      weight: quote.weight,
      equipment_type: quote.equipment_type,
      load_type: quote.load_type,
      pickup_date: quote.pickup_date,
      service_type: 'freight_brokerage',
      quote_status: 'sent',
      created_at: quote.created_at,
      valid_until: quote.expires_at,
      agent_id: quote.agent_id,
      quote_notes: quote.notes
    });
    
    console.log('✅ CRM opportunity created automatically from quote');
  } catch (error) {
    console.error('❌ Error creating quote opportunity:', error);
  }
}

// Example usage in your quoting system
quoteSystem.on('quote_generated', (quote, shipper) => {
  handleQuoteGeneration(quote, shipper);
});
```

### Example 2: Your Exact Implementation Pattern

```typescript
// When quote is generated, create CRM opportunity:
await crmService.createOpportunity({
    name: `Freight opportunity - ${origin} to ${destination}`,
    contact_id: shipper.id, 
    value: quote.totalRate,
    service_type: 'freight_brokerage'
});

// Enhanced version with full integration:
const quoteIntegration = new CRMQuoteIntegrationService('your-org-id');

await quoteIntegration.createQuoteOpportunity({
    id: quote.id,
    shipper_contact_id: shipper.id,
    origin: origin,
    origin_city: origin.split(',')[0],
    origin_state: origin.split(',')[1]?.trim(),
    destination: destination,
    destination_city: destination.split(',')[0],
    destination_state: destination.split(',')[1]?.trim(),
    totalRate: quote.totalRate,
    service_type: 'freight_brokerage',
    quote_status: 'sent',
    created_at: new Date().toISOString()
});
```

### Example 3: Freight Brokerage Quote Integration

```typescript
// Specifically for freight brokerage quotes
async function handleFreightBrokerageQuote(quoteData: any) {
  const quoteIntegration = new CRMQuoteIntegrationService('your-org-id');
  
  await quoteIntegration.createQuoteOpportunity({
    id: quoteData.id,
    shipper_contact_id: quoteData.shipper_id,
    origin: `${quoteData.pickup_city}, ${quoteData.pickup_state}`,
    origin_city: quoteData.pickup_city,
    origin_state: quoteData.pickup_state,
    origin_zip: quoteData.pickup_zip,
    destination: `${quoteData.delivery_city}, ${quoteData.delivery_state}`,
    destination_city: quoteData.delivery_city,
    destination_state: quoteData.delivery_state,
    destination_zip: quoteData.delivery_zip,
    totalRate: quoteData.rate,
    distance_miles: quoteData.miles,
    weight: quoteData.weight,
    equipment_type: quoteData.trailer_type,
    load_type: quoteData.commodity,
    pickup_date: quoteData.pickup_date,
    delivery_date: quoteData.delivery_date,
    service_type: 'freight_brokerage',
    quote_status: 'sent',
    created_at: quoteData.created_at,
    valid_until: quoteData.expires_at,
    agent_id: quoteData.broker_id,
    freight_class: quoteData.freight_class,
    special_requirements: quoteData.accessorials || []
  });
}
```

---

## 🔗 **API Integration Examples**

### Example 4: Using the Quote Integration API

```javascript
// Create quote opportunity via API
async function createQuoteOpportunityViaAPI(quoteData) {
  const response = await fetch('/api/crm/quote-integration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-organization-id': 'your-org-id'
    },
    body: JSON.stringify({
      id: quoteData.id,
      shipper_contact_id: quoteData.shipper_id,
      origin: quoteData.origin,
      origin_city: quoteData.origin_city,
      origin_state: quoteData.origin_state,
      destination: quoteData.destination,
      destination_city: quoteData.destination_city,
      destination_state: quoteData.destination_state,
      totalRate: quoteData.rate,
      distance_miles: quoteData.distance,
      weight: quoteData.weight,
      equipment_type: quoteData.equipment,
      load_type: quoteData.load_type,
      pickup_date: quoteData.pickup_date,
      service_type: 'freight_brokerage',
      quote_status: 'sent',
      created_at: quoteData.created_at,
      agent_id: quoteData.agent_id
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('Opportunity created:', {
      opportunity_id: result.data.opportunity_id,
      activity_id: result.data.activity_id,
      quote_value: result.data.quote_value,
      route: result.data.route
    });
  } else {
    console.error('Error:', result.error);
  }
}
```

### Example 5: Quote Status Update Integration

```javascript
// Update opportunity when quote status changes
async function updateQuoteStatus(quoteId, newStatus, notes) {
  const response = await fetch('/api/crm/quote-integration', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-organization-id': 'your-org-id'
    },
    body: JSON.stringify({
      quote_id: quoteId,
      new_status: newStatus,
      notes: notes
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log(`Quote ${quoteId} status updated to ${newStatus}`);
  }
}

// Example usage
await updateQuoteStatus('quote-123', 'accepted', 'Customer approved rate and timeline');
await updateQuoteStatus('quote-456', 'rejected', 'Rate too high, customer went with competitor');
```

---

## 🔄 **Quote Lifecycle Management**

### Example 6: Complete Quote-to-Deal Workflow

```typescript
class QuoteCRMWorkflow {
  private quoteIntegration: CRMQuoteIntegrationService;
  
  constructor(organizationId: string) {
    this.quoteIntegration = new CRMQuoteIntegrationService(organizationId);
  }
  
  async handleQuoteGenerated(quoteData: any) {
    // 1. Create CRM opportunity
    const result = await this.quoteIntegration.createQuoteOpportunity(quoteData);
    
    // 2. Schedule follow-up reminders
    await this.scheduleFollowUpReminders(quoteData, result.opportunity_id);
    
    // 3. Update shipper's lead score
    if (result.lead_score_updated) {
      console.log('Lead score updated for shipper');
    }
    
    return result;
  }
  
  async handleQuoteAccepted(quoteId: string, acceptanceNotes?: string) {
    // Update opportunity status
    await this.quoteIntegration.updateOpportunityFromQuoteStatus(
      quoteId, 
      'accepted', 
      acceptanceNotes
    );
    
    // Trigger onboarding workflow
    await this.triggerCustomerOnboarding(quoteId);
  }
  
  async handleQuoteRejected(quoteId: string, rejectionReason?: string) {
    // Update opportunity status
    await this.quoteIntegration.updateOpportunityFromQuoteStatus(
      quoteId, 
      'rejected', 
      rejectionReason
    );
    
    // Schedule future follow-up
    await this.scheduleFutureFollowUp(quoteId);
  }
  
  private async scheduleFollowUpReminders(quoteData: any, opportunityId: string) {
    // Implementation for scheduling follow-ups
  }
  
  private async triggerCustomerOnboarding(quoteId: string) {
    // Implementation for customer onboarding
  }
  
  private async scheduleFutureFollowUp(quoteId: string) {
    // Implementation for future follow-up
  }
}
```

### Example 7: LTL vs FTL Quote Handling

```typescript
// LTL Quote Integration
async function handleLTLQuote(quoteData: any) {
  const quoteIntegration = new CRMQuoteIntegrationService('your-org-id');
  
  await quoteIntegration.createQuoteOpportunity({
    id: quoteData.id,
    shipper_contact_id: quoteData.shipper_id,
    origin: quoteData.origin,
    destination: quoteData.destination,
    totalRate: quoteData.ltl_rate,
    weight: quoteData.weight,
    freight_class: quoteData.freight_class,
    service_type: 'ltl',
    quote_status: 'sent',
    created_at: quoteData.created_at,
    special_requirements: ['LTL', 'Terminal Delivery']
  });
}

// FTL Quote Integration
async function handleFTLQuote(quoteData: any) {
  const quoteIntegration = new CRMQuoteIntegrationService('your-org-id');
  
  await quoteIntegration.createQuoteOpportunity({
    id: quoteData.id,
    shipper_contact_id: quoteData.shipper_id,
    origin: quoteData.origin,
    destination: quoteData.destination,
    totalRate: quoteData.ftl_rate,
    weight: quoteData.weight,
    equipment_type: quoteData.trailer_type,
    service_type: 'ftl',
    quote_status: 'sent',
    created_at: quoteData.created_at,
    special_requirements: ['FTL', 'Dedicated Truck']
  });
}
```

---

## 📊 **Advanced Integration Patterns**

### Example 8: Bulk Quote Processing

```typescript
// Process multiple quotes at once
async function processBulkQuotes(quotesData: any[]) {
  const quoteIntegration = new CRMQuoteIntegrationService('your-org-id');
  
  const results = await quoteIntegration.bulkCreateQuoteOpportunities(quotesData);
  
  console.log(`Processed ${results.length} quotes:`);
  results.forEach(result => {
    if (result.status === 'success') {
      console.log(`✅ Quote ${result.quote_id} -> Opportunity ${result.opportunity_id}`);
    } else {
      console.log(`❌ Quote ${result.quote_id} -> Error: ${result.error}`);
    }
  });
  
  return results;
}

// Example usage
const quotes = [
  {
    id: 'quote-001',
    shipper_contact_id: 'shipper-001',
    origin: 'Chicago, IL',
    destination: 'Dallas, TX',
    totalRate: 2500,
    service_type: 'freight_brokerage',
    quote_status: 'sent',
    created_at: '2024-01-15T10:00:00Z'
  },
  // ... more quotes
];

await processBulkQuotes(quotes);
```

### Example 9: Real-time Quote Analytics

```typescript
// Get quote opportunity statistics
async function getQuotePerformanceStats() {
  const response = await fetch('/api/crm/quote-integration?action=stats&date_from=2024-01-01&date_to=2024-01-31', {
    headers: {
      'x-organization-id': 'your-org-id'
    }
  });
  
  const result = await response.json();
  
  console.log('Quote Performance:', {
    total_opportunities: result.data.total_quote_opportunities,
    total_value: result.data.total_quote_value,
    conversion_rate: result.data.conversion_rate,
    average_deal_size: result.data.average_deal_size,
    by_service_type: result.data.by_service_type,
    by_load_type: result.data.by_load_type
  });
  
  return result.data;
}
```

---

## 🎯 **Industry-Specific Examples**

### Example 10: Specialized Freight Quote

```typescript
async function handleSpecializedFreightQuote(quoteData: any) {
  const quoteIntegration = new CRMQuoteIntegrationService('your-org-id');
  
  await quoteIntegration.createQuoteOpportunity({
    id: quoteData.id,
    shipper_contact_id: quoteData.shipper_id,
    origin: quoteData.origin,
    destination: quoteData.destination,
    totalRate: quoteData.rate,
    weight: quoteData.weight,
    equipment_type: quoteData.specialized_equipment,
    load_type: quoteData.commodity_type,
    service_type: 'specialized',
    quote_status: 'sent',
    created_at: quoteData.created_at,
    special_requirements: [
      'Hazmat Certified Driver',
      'Temperature Controlled',
      'Oversized Load Permits',
      'Escort Vehicle Required'
    ],
    quote_notes: `
      Specialized Freight Requirements:
      - Commodity: ${quoteData.commodity_type}
      - Hazmat Class: ${quoteData.hazmat_class}
      - Temperature Range: ${quoteData.temp_range}
      - Permits Required: ${quoteData.permits.join(', ')}
      - Insurance: $${quoteData.insurance_coverage.toLocaleString()}
    `
  });
}
```

### Example 11: Expedited Shipping Quote

```typescript
async function handleExpeditedQuote(quoteData: any) {
  const quoteIntegration = new CRMQuoteIntegrationService('your-org-id');
  
  await quoteIntegration.createQuoteOpportunity({
    id: quoteData.id,
    shipper_contact_id: quoteData.shipper_id,
    origin: quoteData.origin,
    destination: quoteData.destination,
    totalRate: quoteData.expedited_rate,
    weight: quoteData.weight,
    equipment_type: quoteData.equipment,
    service_type: 'expedited',
    quote_status: 'sent',
    created_at: quoteData.created_at,
    pickup_date: quoteData.asap_pickup,
    delivery_date: quoteData.rush_delivery,
    special_requirements: [
      'Team Drivers',
      'Direct Route',
      'Real-time Tracking',
      'Emergency Contact'
    ],
    quote_notes: `
      Expedited Service Details:
      - Pickup: ASAP (${quoteData.pickup_window})
      - Delivery: ${quoteData.delivery_commitment}
      - Transit Time: ${quoteData.transit_hours} hours
      - Premium: ${quoteData.expedite_premium}%
    `
  });
}
```

---

## 🔄 **Automated Workflows**

### Example 12: Quote Expiration Management

```typescript
class QuoteExpirationManager {
  private quoteIntegration: CRMQuoteIntegrationService;
  
  constructor(organizationId: string) {
    this.quoteIntegration = new CRMQuoteIntegrationService(organizationId);
  }
  
  async checkExpiringQuotes() {
    // Find quotes expiring in next 24 hours
    const expiringQuotes = await this.getExpiringQuotes();
    
    for (const quote of expiringQuotes) {
      // Send reminder to customer
      await this.sendExpirationReminder(quote);
      
      // Update CRM with reminder activity
      await this.quoteIntegration.updateOpportunityFromQuoteStatus(
        quote.id,
        'expiring',
        'Quote expires in 24 hours - reminder sent'
      );
    }
  }
  
  async handleExpiredQuotes() {
    // Find quotes that have expired
    const expiredQuotes = await this.getExpiredQuotes();
    
    for (const quote of expiredQuotes) {
      // Update opportunity status
      await this.quoteIntegration.updateOpportunityFromQuoteStatus(
        quote.id,
        'expired',
        'Quote has expired without response'
      );
      
      // Schedule follow-up for new quote
      await this.scheduleNewQuoteFollowUp(quote);
    }
  }
  
  private async getExpiringQuotes() {
    // Implementation to get quotes expiring soon
    return [];
  }
  
  private async getExpiredQuotes() {
    // Implementation to get expired quotes
    return [];
  }
  
  private async sendExpirationReminder(quote: any) {
    // Implementation to send reminder
  }
  
  private async scheduleNewQuoteFollowUp(quote: any) {
    // Implementation to schedule follow-up
  }
}
```

### Example 13: Quote Comparison Analysis

```typescript
async function analyzeQuoteCompetition(quoteData: any) {
  const quoteIntegration = new CRMQuoteIntegrationService('your-org-id');
  
  // Create opportunity
  const result = await quoteIntegration.createQuoteOpportunity(quoteData);
  
  // Add competitive analysis activity
  await quoteIntegration.crmService.createActivity({
    contact_id: quoteData.shipper_contact_id,
    opportunity_id: result.opportunity_id,
    activity_type: 'note',
    subject: 'Competitive Quote Analysis',
    description: `
      Quote Analysis for ${quoteData.origin} to ${quoteData.destination}:
      
      Our Quote: $${quoteData.totalRate}
      Market Rate Range: $${quoteData.market_low} - $${quoteData.market_high}
      Position: ${quoteData.competitive_position}
      
      Competitive Advantages:
      ${quoteData.advantages?.map(adv => `- ${adv}`).join('\n')}
      
      Risk Factors:
      ${quoteData.risks?.map(risk => `- ${risk}`).join('\n')}
    `,
    activity_date: new Date().toISOString(),
    status: 'completed',
    tags: ['competitive_analysis', 'quote_analysis'],
    custom_fields: {
      quote_id: quoteData.id,
      market_position: quoteData.competitive_position,
      win_probability: quoteData.estimated_win_rate
    }
  });
}
```

---

## 📈 **Analytics & Reporting**

### Example 14: Quote Performance Dashboard

```typescript
async function generateQuotePerformanceReport() {
  const quoteIntegration = new CRMQuoteIntegrationService('your-org-id');
  
  const stats = await quoteIntegration.getQuoteOpportunityStats(
    '2024-01-01T00:00:00Z',
    '2024-01-31T23:59:59Z'
  );
  
  return {
    totalQuotes: stats.total_quote_opportunities,
    totalValue: stats.total_quote_value,
    conversionRate: stats.conversion_rate.toFixed(2) + '%',
    averageDealSize: stats.average_deal_size,
    wonDeals: stats.won_opportunities,
    lostDeals: stats.lost_opportunities,
    openDeals: stats.open_opportunities,
    serviceTypeBreakdown: stats.by_service_type,
    loadTypeBreakdown: stats.by_load_type,
    stageDistribution: stats.by_stage
  };
}
```

### Example 15: Real-time Quote Monitoring

```typescript
class QuoteMonitoringService {
  private quoteIntegration: CRMQuoteIntegrationService;
  
  constructor(organizationId: string) {
    this.quoteIntegration = new CRMQuoteIntegrationService(organizationId);
  }
  
  async monitorQuoteActivity() {
    // Get today's quote statistics
    const today = new Date().toISOString().split('T')[0];
    const stats = await this.quoteIntegration.getQuoteOpportunityStats(
      today + 'T00:00:00Z',
      today + 'T23:59:59Z'
    );
    
    // Alert if conversion rate is too low
    if (stats.conversion_rate < 20) {
      await this.sendAlert('Low quote conversion rate detected', stats);
    }
    
    // Alert if average deal size is declining
    if (stats.average_deal_size < 2000) {
      await this.sendAlert('Low average deal size detected', stats);
    }
    
    return stats;
  }
  
  private async sendAlert(message: string, stats: any) {
    console.log(`🚨 Alert: ${message}`, stats);
    // Implementation for sending alerts
  }
}
```

---

## 🔧 **Configuration & Setup**

### Example 16: Environment Configuration

```typescript
// config/quote-integration.ts
export const quoteIntegrationConfig = {
  organizationId: process.env.ORGANIZATION_ID || 'default-org',
  autoCreateOpportunities: process.env.AUTO_CREATE_OPPORTUNITIES === 'true',
  defaultFollowUpDelay: parseInt(process.env.QUOTE_FOLLOW_UP_DELAY || '86400'), // 24 hours
  expirationReminderHours: parseInt(process.env.EXPIRATION_REMINDER_HOURS || '24'),
  enableQuoteAnalytics: process.env.ENABLE_QUOTE_ANALYTICS === 'true',
  defaultServiceType: process.env.DEFAULT_SERVICE_TYPE || 'freight_brokerage'
};
```

### Example 17: Integration with Quoting System

```typescript
// Your existing quoting system integration
class QuotingSystemIntegration {
  private quoteIntegration: CRMQuoteIntegrationService;
  
  constructor() {
    this.quoteIntegration = new CRMQuoteIntegrationService('your-org-id');
  }
  
  async onQuoteGenerated(quoteData: any) {
    // Create CRM opportunity
    const result = await this.quoteIntegration.createQuoteOpportunity({
      id: quoteData.quote_id,
      shipper_contact_id: quoteData.customer_id,
      origin: quoteData.pickup_location,
      origin_city: quoteData.pickup_city,
      origin_state: quoteData.pickup_state,
      destination: quoteData.delivery_location,
      destination_city: quoteData.delivery_city,
      destination_state: quoteData.delivery_state,
      totalRate: quoteData.total_cost,
      service_type: 'freight_brokerage',
      quote_status: 'sent',
      created_at: quoteData.created_timestamp
    });
    
    console.log(`CRM opportunity ${result.opportunity_id} created for quote ${quoteData.quote_id}`);
    return result;
  }
  
  async onQuoteStatusChanged(quoteId: string, newStatus: string, notes?: string) {
    await this.quoteIntegration.updateOpportunityFromQuoteStatus(
      quoteId,
      newStatus,
      notes
    );
    
    console.log(`CRM opportunity updated for quote ${quoteId} status: ${newStatus}`);
  }
}
```

---

## 🎯 **Best Practices**

### 1. Error Handling
```typescript
async function robustQuoteIntegration(quoteData: any) {
  try {
    await quoteIntegration.createQuoteOpportunity(quoteData);
  } catch (error) {
    // Log error but don't fail the quote generation
    console.error('CRM integration failed:', error);
    
    // Queue for retry
    await queueQuoteForRetry(quoteData);
  }
}
```

### 2. Performance Optimization
```typescript
// Batch process quotes for better performance
async function processPendingQuotes() {
  const pendingQuotes = await getPendingQuotesFromQueue();
  
  if (pendingQuotes.length > 0) {
    await quoteIntegration.bulkCreateQuoteOpportunities(pendingQuotes);
  }
}
```

### 3. Data Validation
```typescript
function validateQuoteData(quoteData: any): boolean {
  const required = ['id', 'origin', 'destination', 'totalRate', 'service_type'];
  return required.every(field => quoteData[field] !== undefined);
}
```

---

This comprehensive integration system ensures that every quote automatically creates a sales opportunity in your CRM, providing complete visibility into your sales pipeline and enabling data-driven decision making for your freight brokerage operations. 