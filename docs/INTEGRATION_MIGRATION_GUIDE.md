# 🔄 Multi-Tenant Payment System Integration Guide

**Step-by-step guide to integrate multi-tenant payments into existing FleetFlow pages**

---

## 🎯 **Migration Overview**

Transform your existing single-provider payment integrations into a flexible multi-tenant system that supports Square, Bill.com, QuickBooks, and Stripe.

### **Before & After:**

**❌ Old Approach (Single-tenant Square):**
```typescript
// Limited to Square only
const createSquareInvoice = async (invoiceData) => {
  const response = await fetch('/api/payments/square', {
    method: 'POST',
    body: JSON.stringify({ action: 'create-invoice', ...invoiceData })
  });
};
```

**✅ New Approach (Multi-tenant):**
```typescript
// Works with any provider
const { createInvoice } = useMultiTenantPayments(tenantId);
const result = await createInvoice({
  tenantId,
  provider: 'square', // or 'billcom', 'quickbooks', 'stripe'
  ...invoiceData
});
```

---

## 📋 **Step-by-Step Migration**

### **Step 1: Import Multi-Tenant Components**

Replace single-provider imports with multi-tenant equivalents:

```typescript
// ❌ Remove old imports
import SquareService from '../services/SquareService';

// ✅ Add new imports
import { useMultiTenantPayments } from '../hooks/useMultiTenantPayments';
import { UnifiedInvoiceRequest } from '../services/MultiTenantPaymentService';
import MultiTenantPaymentProviders from '../components/MultiTenantPaymentProviders';
```

### **Step 2: Replace State Management**

**❌ Old state (single provider):**
```typescript
const [integrations, setIntegrations] = useState({
  square: {
    enabled: false,
    connected: false,
    applicationId: '',
    locationId: '',
  }
});
```

**✅ New state (multi-tenant):**
```typescript
const tenantId = 'acme-logistics'; // Get from auth context
const {
  config,
  availableProviders,
  activeProviders,
  primaryProvider,
  createInvoice,
  enableProvider,
  setPrimaryProvider,
} = useMultiTenantPayments(tenantId);
```

### **Step 3: Update Invoice Creation**

**❌ Old invoice creation:**
```typescript
const createSquareInvoice = async (invoiceData) => {
  if (!integrations.square.connected) {
    alert('Please connect Square first.');
    return;
  }
  
  const response = await fetch('/api/payments/square', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'create-fleetflow-invoice',
      customerId: '',
      invoiceTitle: invoiceData.title,
      description: invoiceData.description,
      lineItems: invoiceData.lineItems,
    }),
  });
  
  const result = await response.json();
  // Handle result...
};
```

**✅ New invoice creation:**
```typescript
const handleCreateInvoice = async (invoiceData, provider?: string) => {
  const targetProvider = provider || primaryProvider;
  
  if (!targetProvider) {
    alert('Please select a payment provider');
    return;
  }

  const invoiceRequest: UnifiedInvoiceRequest = {
    tenantId,
    provider: targetProvider as any,
    customerName: invoiceData.customerName,
    companyName: invoiceData.companyName,
    email: invoiceData.email,
    title: invoiceData.title,
    description: invoiceData.description,
    lineItems: invoiceData.lineItems,
    customFields: [
      { label: 'Tenant', value: tenantId },
      { label: 'Department', value: 'Operations' },
    ],
  };

  const result = await createInvoice(invoiceRequest);
  
  if (result.success) {
    alert(`✅ Invoice created with ${result.provider}!
    
Invoice ID: ${result.invoiceId}
Invoice Number: ${result.invoiceNumber}
Amount: $${result.amount?.toLocaleString()}
Public URL: ${result.publicUrl}`);
  } else {
    alert(`❌ Failed to create invoice: ${result.error}`);
  }
};
```

### **Step 4: Update UI Components**

**❌ Old UI (Square-specific):**
```tsx
{/* Square Integration */}
<div style={{ ... }}>
  <h3>Square Payments</h3>
  <div>Status: {integrations.square.connected ? 'Connected' : 'Disconnected'}</div>
  
  {!integrations.square.connected ? (
    <button onClick={connectSquare}>
      🔗 Connect Square
    </button>
  ) : (
    <button onClick={() => createSquareInvoice(invoiceData)}>
      🧾 Create Square Invoice
    </button>
  )}
</div>
```

**✅ New UI (Multi-provider):**
```tsx
{/* Multi-Provider Payment Integration */}
<div style={{ ... }}>
  <h3>Payment Providers ({activeProviders.length} active)</h3>
  
  {activeProviders.length === 0 ? (
    <div>
      <p>No payment providers configured</p>
      <MultiTenantPaymentProviders tenantId={tenantId} userRole="Manager" />
    </div>
  ) : (
    <div>
      {/* Provider Selection */}
      <select 
        value={selectedProvider} 
        onChange={(e) => setSelectedProvider(e.target.value)}
      >
        {activeProviders.map(provider => (
          <option key={provider} value={provider}>
            {availableProviders.find(p => p.name === provider)?.displayName}
          </option>
        ))}
      </select>
      
      {/* Invoice Creation Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => handleCreateInvoice(invoiceData)}>
          📧 Create Invoice ({selectedProvider})
        </button>
        
        {/* Alternative providers */}
        {activeProviders.filter(p => p !== selectedProvider).map(provider => (
          <button 
            key={provider}
            onClick={() => handleCreateInvoice(invoiceData, provider)}
            style={{ background: getProviderColor(provider) }}
          >
            {getProviderIcon(provider)} {getProviderDisplayName(provider)}
          </button>
        ))}
      </div>
    </div>
  )}
</div>
```

---

## 🔧 **Common Integration Patterns**

### **Pattern 1: Billing/Invoice Pages**

```typescript
export default function BillingPage() {
  const tenantId = getCurrentTenantId();
  const {
    config,
    activeProviders,
    primaryProvider,
    createInvoice,
  } = useMultiTenantPayments(tenantId);

  const [selectedProvider, setSelectedProvider] = useState('');

  useEffect(() => {
    if (primaryProvider && !selectedProvider) {
      setSelectedProvider(primaryProvider);
    }
  }, [primaryProvider, selectedProvider]);

  return (
    <div>
      {/* Provider status */}
      <div>Active Providers: {activeProviders.length}</div>
      <div>Primary: {primaryProvider || 'Not set'}</div>
      
      {/* Provider configuration */}
      {activeProviders.length === 0 && (
        <MultiTenantPaymentProviders tenantId={tenantId} userRole="Manager" />
      )}
      
      {/* Invoice management */}
      <InvoiceManagement 
        tenantId={tenantId}
        selectedProvider={selectedProvider}
        onProviderChange={setSelectedProvider}
      />
    </div>
  );
}
```

### **Pattern 2: Dispatch Integration**

```typescript
export default function DispatchPage() {
  const tenantId = getCurrentTenantId();
  const { createInvoice, activeProviders } = useMultiTenantPayments(tenantId);

  const handleInvoiceForLoad = async (load: Load) => {
    const result = await createInvoice({
      tenantId,
      provider: 'square', // or get from user preference
      customerName: load.customer,
      email: `billing@${load.customer.toLowerCase()}.com`,
      title: `Load ${load.id} - Transportation Services`,
      description: `Transportation from ${load.origin} to ${load.destination}`,
      lineItems: [{
        name: 'Load Transportation',
        quantity: 1,
        rate: load.rate,
        amount: load.rate,
      }],
      customFields: [
        { label: 'Load ID', value: load.id },
        { label: 'Driver', value: load.driver },
      ],
    });

    if (result.success) {
      // Update load status, show notification, etc.
    }
  };

  return (
    <div>
      {/* Load management UI */}
      <LoadTable 
        loads={loads}
        onCreateInvoice={handleInvoiceForLoad}
        activeProviders={activeProviders}
      />
    </div>
  );
}
```

### **Pattern 3: Settings Integration**

```typescript
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const tenantId = getCurrentTenantId();

  return (
    <div>
      {/* Navigation tabs */}
      <div>
        <button onClick={() => setActiveTab('account')}>Account</button>
        <button onClick={() => setActiveTab('payments')}>Payment Providers</button>
        <button onClick={() => setActiveTab('integrations')}>Integrations</button>
      </div>

      {/* Content */}
      {activeTab === 'payments' && (
        <MultiTenantPaymentProviders tenantId={tenantId} userRole="Admin" />
      )}
    </div>
  );
}
```

---

## 🎯 **Helper Functions**

Create reusable utility functions:

```typescript
// app/utils/payment-helpers.ts
export function getProviderDisplayName(providerName: string): string {
  const names = {
    square: 'Square',
    billcom: 'Bill.com',
    quickbooks: 'QuickBooks',
    stripe: 'Stripe',
  };
  return names[providerName as keyof typeof names] || providerName;
}

export function getProviderIcon(providerName: string): string {
  const icons = {
    square: '🟨',
    billcom: '💸',
    quickbooks: '📊',
    stripe: '💳',
  };
  return icons[providerName as keyof typeof icons] || '💰';
}

export function getProviderColor(providerName: string): string {
  const colors = {
    square: '#3b82f6',
    billcom: '#10b981',
    quickbooks: '#f59e0b',
    stripe: '#8b5cf6',
  };
  return colors[providerName as keyof typeof colors] || '#6b7280';
}

export function getCurrentTenantId(): string {
  // In production, get from auth context/session
  return localStorage.getItem('tenantId') || 'default-tenant';
}
```

---

## ✅ **Migration Checklist**

### **Phase 1: Setup (1-2 hours)**
- [ ] Import multi-tenant payment service and hooks
- [ ] Replace single-provider state with multi-tenant hooks
- [ ] Update environment variables for all providers
- [ ] Test connection to multi-tenant API endpoints

### **Phase 2: Invoice Creation (2-3 hours)**
- [ ] Replace provider-specific invoice functions with unified approach
- [ ] Update invoice data mapping for UnifiedInvoiceRequest format
- [ ] Add error handling for multi-provider scenarios
- [ ] Test invoice creation across all active providers

### **Phase 3: UI Updates (3-4 hours)**
- [ ] Replace single-provider UI with multi-provider components
- [ ] Add provider selection controls
- [ ] Update status indicators for multiple providers
- [ ] Add provider configuration UI (MultiTenantPaymentProviders)

### **Phase 4: Testing & Polish (2-3 hours)**
- [ ] Test all provider connections
- [ ] Verify invoice creation across different providers
- [ ] Test failover scenarios (primary provider fails)
- [ ] Validate tenant isolation
- [ ] Test provider enable/disable functionality

### **Phase 5: Documentation (1 hour)**
- [ ] Update internal documentation
- [ ] Add user guides for provider configuration
- [ ] Document troubleshooting procedures
- [ ] Update API documentation

---

## 🚨 **Common Pitfalls & Solutions**

### **Pitfall 1: Tenant ID Not Provided**
```typescript
// ❌ Missing tenant ID
const result = await createInvoice({ provider: 'square', ... });

// ✅ Always include tenant ID
const result = await createInvoice({ tenantId, provider: 'square', ... });
```

### **Pitfall 2: Provider Not Active**
```typescript
// ❌ Not checking if provider is active
const result = await createInvoice({ tenantId, provider: 'stripe', ... });

// ✅ Validate provider is active first
if (!activeProviders.includes('stripe')) {
  alert('Stripe is not configured for this tenant');
  return;
}
```

### **Pitfall 3: Missing Error Handling**
```typescript
// ❌ No error handling
const result = await createInvoice(request);
alert('Invoice created!');

// ✅ Proper error handling
const result = await createInvoice(request);
if (result.success) {
  alert(`✅ Invoice created with ${result.provider}!`);
} else {
  alert(`❌ Failed: ${result.error}`);
  if (config?.preferences.fallbackProvider) {
    // Try fallback provider
  }
}
```

### **Pitfall 4: Hard-coded Provider References**
```typescript
// ❌ Hard-coded Square references
<button onClick={createSquareInvoice}>Create Square Invoice</button>

// ✅ Dynamic provider references
<button onClick={() => createInvoice(data, selectedProvider)}>
  Create {getProviderDisplayName(selectedProvider)} Invoice
</button>
```

---

## 🎉 **Migration Benefits**

After migration, you'll have:

✅ **Provider Flexibility** - Switch between Square, Bill.com, QuickBooks, Stripe  
✅ **Tenant Isolation** - Complete data separation between organizations  
✅ **Automatic Failover** - Backup providers prevent payment disruptions  
✅ **Unified API** - Same code works across all payment providers  
✅ **Easy Configuration** - Visual provider setup and management  
✅ **Better UX** - Customers can use their preferred payment methods  

---

## 📚 **Next Steps**

1. **Review Examples**: Check `app/billing-invoices/integrated-multitenant/page.tsx` and `app/dispatch/multitenant-integration-example.tsx`
2. **Start Migration**: Begin with your most critical payment pages
3. **Test Thoroughly**: Validate all providers work correctly
4. **Train Users**: Provide guidance on new multi-provider capabilities
5. **Monitor Usage**: Track which providers are most popular with your tenants

The multi-tenant payment system is designed to be a drop-in replacement that enhances your existing functionality while maintaining backward compatibility.

**Happy migrating! 🚀**






















