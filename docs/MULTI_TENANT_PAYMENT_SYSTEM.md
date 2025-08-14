# 🚀 Multi-Tenant Payment Provider System

**FleetFlow's Unified Payment Platform supporting Square, Bill.com, QuickBooks & Stripe**

---

## 🎯 **Overview**

FleetFlow now supports **multiple payment providers per tenant**, allowing each organization to
choose their preferred payment processing solution. Each tenant can configure multiple providers and
set preferences for primary/fallback providers.

### **Supported Providers:**

- 🟨 **Square** - Payments, Invoicing, Customers, Reporting
- 💸 **Bill.com** - Payments, Invoicing, Customers, Reporting
- 📊 **QuickBooks** - Payments, Invoicing, Customers, Reporting
- 💳 **Stripe** - Payments, Invoicing, Customers, Reporting, Subscriptions

---

## 📋 **Features**

### **🏢 Multi-Tenant Architecture**

- **Tenant Isolation**: Each tenant has completely isolated payment configurations
- **Provider Choice**: Tenants can choose which providers to enable
- **Primary/Fallback**: Set primary provider with automatic fallback option
- **Role-Based Access**: User permissions control access to payment features

### **🔄 Unified API**

- **Single Interface**: One API for all payment providers
- **Automatic Routing**: Invoices automatically routed to correct provider
- **Error Handling**: Graceful fallback when primary provider fails
- **Provider Testing**: Test connections and functionality across providers

### **💼 Enterprise Features**

- **Configuration Management**: Easy setup and credential management
- **Provider Comparison**: Side-by-side testing and comparison
- **Audit Trail**: Complete tracking with tenant context
- **Scalable Architecture**: Supports unlimited tenants and providers

---

## 🏗️ **Architecture**

### **Core Components:**

1. **`MultiTenantPaymentService.ts`** - Central service managing all providers
2. **`/api/payments/multitenant/route.ts`** - API endpoints for payment operations
3. **`useMultiTenantPayments.ts`** - React hook for frontend integration
4. **`MultiTenantPaymentProviders.tsx`** - Configuration UI component
5. **Database Schema** - Multi-tenant payment provider storage

### **Data Flow:**

```
Tenant Request → API Route → Payment Service → Provider API → Response
     ↓              ↓             ↓              ↓
Tenant ID → Validate Config → Route to Provider → Format Response
```

---

## 💾 **Database Schema**

### **Key Tables:**

**`tenant_payment_integrations`** - Provider configurations per tenant

```sql
- tenant_id (UUID) - Links to organization
- provider (VARCHAR) - square, billcom, quickbooks, stripe
- provider_config (JSONB) - Provider-specific credentials
- is_primary (BOOLEAN) - Primary provider flag
- is_enabled/is_connected (BOOLEAN) - Status flags
```

**`tenant_payment_preferences`** - Tenant payment preferences

```sql
- default_provider - Primary provider choice
- fallback_provider - Backup provider
- auto_switch_on_failure - Automatic failover enabled
```

**`tenant_invoices`** - Unified invoice storage

```sql
- payment_provider - Which provider was used
- provider_invoice_id - Provider-specific ID
- provider_data (JSONB) - Provider-specific response data
```

---

## 🔧 **Implementation Guide**

### **1. Service Configuration**

```typescript
// Initialize the service
const paymentService = new MultiTenantPaymentService();

// Create unified invoice
const result = await paymentService.createInvoice({
  tenantId: 'acme-logistics',
  provider: 'square', // or 'billcom', 'quickbooks', 'stripe'
  customerName: 'ABC Company',
  email: 'billing@abc.com',
  title: 'Load Transportation Services',
  lineItems: [
    { name: 'Load Transport', quantity: 1, rate: 2500, amount: 2500 }
  ]
});
```

### **2. React Hook Usage**

```typescript
// Use the hook in components
const {
  activeProviders,
  primaryProvider,
  createInvoice,
  enableProvider,
  setPrimaryProvider
} = useMultiTenantPayments(tenantId);

// Create invoice with automatic provider routing
const invoice = await createInvoice(invoiceData);
```

### **3. API Endpoints**

```typescript
// Get tenant configuration
GET /api/payments/multitenant?tenantId=acme&action=config

// Create invoice
POST /api/payments/multitenant
{
  "action": "create-invoice",
  "tenantId": "acme-logistics",
  "invoice": { ...invoiceData }
}

// Enable provider
POST /api/payments/multitenant
{
  "action": "enable-provider",
  "tenantId": "acme-logistics",
  "provider": "square",
  "credentials": { ...squareCredentials }
}
```

---

## 🎨 **UI Components**

### **MultiTenantPaymentProviders Component**

**Features:**

- **Overview Tab**: Visual provider status and management
- **Configure Tab**: Step-by-step provider setup
- **Preferences Tab**: Primary/fallback provider settings

**Usage:**

```tsx
<MultiTenantPaymentProviders
  tenantId="acme-logistics"
  userRole="Manager"
/>
```

### **Provider Status Indicators:**

- 🟨 **Square**: Blue theme, sandbox/production environments
- 💸 **Bill.com**: Green theme, API key authentication
- 📊 **QuickBooks**: Yellow theme, OAuth integration
- 💳 **Stripe**: Purple theme, test/live environments

---

## 🔐 **Security & Compliance**

### **Data Isolation:**

- **Row Level Security (RLS)** enforces tenant data separation
- **Encrypted Storage** for sensitive provider credentials
- **API Key Management** with environment-specific configurations
- **Audit Logging** for all payment operations with tenant context

### **Access Control:**

- **Role-Based Permissions** control provider access
- **Tenant Validation** ensures users can only access their tenant's data
- **Connection Testing** validates credentials before enabling providers

---

## 🧪 **Testing & Validation**

### **Provider Testing Features:**

```typescript
// Test individual provider connection
const result = await testConnection('square');

// Test all providers with same invoice
const results = await testAllProviders(invoiceData);

// Compare provider responses
const comparison = compareProviderResponses(results);
```

### **Demo Page Features:**

- **Side-by-Side Testing**: Test same invoice across all providers
- **Response Comparison**: Compare success rates and response times
- **Provider Switching**: Easy switching between providers for testing
- **Result History**: Track all test results with timestamps

---

## 📊 **Provider Comparison**

| Feature              | Square   | Bill.com | QuickBooks | Stripe |
| -------------------- | -------- | -------- | ---------- | ------ |
| **Invoicing**        | ✅       | ✅       | ✅         | ✅     |
| **Payments**         | ✅       | ✅       | ✅         | ✅     |
| **Customers**        | ✅       | ✅       | ✅         | ✅     |
| **Reporting**        | ✅       | ✅       | ✅         | ✅     |
| **Subscriptions**    | ❌       | ❌       | ❌         | ✅     |
| **Setup Complexity** | Medium   | Medium   | High       | Low    |
| **Integration Time** | 1-2 days | 2-3 days | 3-5 days   | 1 day  |

---

## 🚀 **Getting Started**

### **1. Database Setup**

```bash
# Run the multi-tenant payment schema
psql -d fleetflow -f scripts/multitenant-payment-schema.sql
```

### **2. Environment Variables**

```env
# Square Configuration
SQUARE_APPLICATION_ID_ACME=sq0idb-xxx
SQUARE_ACCESS_TOKEN_ACME=EAAAxxxx
SQUARE_LOCATION_ID_ACME=location-xxx

# Bill.com Configuration
BILLCOM_API_KEY_ACME=01ICBWLWxxx
BILLCOM_USERNAME_ACME=user@company.com
BILLCOM_ORG_ID_ACME=029720xxx

# QuickBooks Configuration
QB_CLIENT_ID_ACME=qb_client_xxx
QB_CLIENT_SECRET_ACME=qb_secret_xxx

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY_ACME=pk_test_xxx
STRIPE_SECRET_KEY_ACME=sk_test_xxx
```

### **3. Component Integration**

```tsx
// Add to your billing page
import { useMultiTenantPayments } from '../hooks/useMultiTenantPayments';
import MultiTenantPaymentProviders from '../components/MultiTenantPaymentProviders';

// Use in your component
const { createInvoice, activeProviders } = useMultiTenantPayments(tenantId);
```

---

## 🎯 **Business Benefits**

### **For FleetFlow:**

- **Competitive Advantage**: Only TMS with multi-provider payment support
- **Customer Retention**: Tenants can use their preferred payment solutions
- **Revenue Growth**: Support for multiple payment processor relationships
- **Market Expansion**: Appeal to customers with existing provider relationships

### **For Tenants:**

- **Provider Choice**: Use preferred payment processor
- **Redundancy**: Automatic failover prevents payment disruptions
- **Cost Optimization**: Compare rates across providers
- **Integration**: Seamless integration with existing accounting systems

### **For Customers:**

- **Familiar Experience**: Receive invoices from recognized providers
- **Payment Options**: Multiple payment methods and experiences
- **Trust**: Invoices from established, trusted payment processors

---

## 📈 **Future Enhancements**

### **Phase 2 Features:**

- **Payment Analytics**: Cross-provider payment insights
- **Smart Routing**: AI-powered provider selection based on customer preferences
- **Bulk Operations**: Batch invoice creation across multiple providers
- **Advanced Reporting**: Unified reporting across all payment providers

### **Additional Providers:**

- **PayPal Business** - Popular payment processor
- **Authorize.Net** - Enterprise payment gateway
- **Braintree** - PayPal's advanced payment platform
- **Adyen** - Global payment platform

---

## 🔗 **File Structure**

```
app/
├── services/
│   └── MultiTenantPaymentService.ts     # Core payment service
├── hooks/
│   └── useMultiTenantPayments.ts        # React hook
├── components/
│   └── MultiTenantPaymentProviders.tsx  # Configuration UI
├── api/payments/
│   └── multitenant/route.ts             # API endpoints
├── billing-invoices/
│   └── unified-payment-demo/page.tsx    # Demo page
└── scripts/
    └── multitenant-payment-schema.sql   # Database schema
```

---

## ✅ **Implementation Status**

All major components have been implemented and are ready for use:

- ✅ **Multi-Tenant Payment Service** - Core service supporting all 4 providers
- ✅ **Database Schema** - Complete multi-tenant payment provider schema
- ✅ **API Routes** - Full CRUD operations for provider management
- ✅ **React Hook** - Frontend integration for payment operations
- ✅ **UI Components** - Provider configuration and management interface
- ✅ **Demo Page** - Complete testing and demonstration interface
- ✅ **Documentation** - Comprehensive implementation guide

**🎉 The multi-tenant payment provider system is production-ready!**




































