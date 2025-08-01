# 💳 Dispatch Fee Collection System - Complete Implementation

## 🎯 **SYSTEM OVERVIEW**

The **Dispatch Fee Collection System** is a comprehensive payment processing solution that mirrors
the shipper payment system but specifically handles **carriers/drivers paying dispatch fees to their
companies**. This ensures that dispatch fees are properly collected and distributed to the correct
companies rather than individual dispatchers.

---

## 🏗️ **SYSTEM ARCHITECTURE**

### **Core Components:**

1. **DispatchFeeCollectionService**
   (`app/services/dispatch-fee-collection/DispatchFeeCollectionService.ts`)
   - Central service handling all dispatch fee payment processing
   - Integrates with Stripe and Bill.com for payment processing
   - Manages company accounts and payment configurations

2. **API Routes** (`app/api/dispatch-fee-collection/route.ts`)
   - RESTful API endpoints for payment operations
   - Handles payment creation, processing, and retrieval
   - Manages company accounts and configuration

3. **React Component** (`app/components/DispatchFeeCollectionModal.tsx`)
   - Professional UI for dispatch fee collection
   - Payment method selection and fee configuration
   - Real-time payment processing and status updates

---

## 💰 **PAYMENT PROCESSING FEATURES**

### **Payment Methods Supported:**

- **💳 Stripe (Credit Card)**: Secure online payment processing
- **🏦 ACH (Bank Transfer)**: Direct bank transfer via Bill.com
- **📄 Check**: Manual check processing with tracking
- **💸 Wire Transfer**: Wire transfer with manual processing

### **Fee Calculation:**

```typescript
// Default Configuration
defaultFeePercentage: 10.0%        // Standard dispatch fee
minimumFeePercentage: 5.0%         // Minimum allowed fee
maximumFeePercentage: 15.0%        // Maximum allowed fee
processingFeePercentage: 2.9%      // Payment processing fee
lateFeePercentage: 2.0%           // Late payment penalty
```

### **Payment Flow:**

1. **Load Assignment** → Driver assigned to load
2. **Fee Calculation** → System calculates dispatch fee (10% default)
3. **Payment Creation** → Payment record created with company details
4. **Payment Processing** → Automatic processing based on selected method
5. **Company Distribution** → Payment sent directly to company account
6. **Confirmation** → Payment confirmation and receipt generation

---

## 🏢 **COMPANY MANAGEMENT**

### **DispatchFeeCompany Interface:**

```typescript
interface DispatchFeeCompany {
  id: string;
  companyName: string;
  stripeAccountId?: string;        // For direct Stripe payments
  billComAccountId?: string;       // For ACH payments
  paymentMethods: {
    stripe?: boolean;
    ach?: boolean;
    check?: boolean;
    wire?: boolean;
  };
  defaultPaymentMethod: 'stripe' | 'ach' | 'check' | 'wire';
  bankInfo?: {
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
  };
  contactInfo: {
    email: string;
    phone: string;
    address: AddressInfo;
  };
  taxId?: string;
  status: 'active' | 'suspended' | 'inactive';
}
```

### **Company Account Features:**

- **Multiple Payment Methods**: Each company can accept different payment types
- **Direct Account Integration**: Payments go directly to company accounts
- **Bank Information Management**: Secure storage of banking details
- **Tax ID Tracking**: Proper tax reporting and compliance
- **Status Management**: Active, suspended, or inactive account states

---

## 📊 **PAYMENT TRACKING & ANALYTICS**

### **DispatchFeePayment Interface:**

```typescript
interface DispatchFeePayment {
  id: string;
  loadId: string;
  carrierId: string;
  driverId: string;
  companyId: string;               // Company receiving the payment
  amount: number;
  feePercentage: number;
  loadAmount: number;
  paymentMethod: 'stripe' | 'ach' | 'check' | 'wire';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentDate?: Date;
  transactionId?: string;
  stripePaymentIntentId?: string;
  billComInvoiceId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Analytics & Reporting:**

- **Total Collected**: Sum of all successful payments
- **Total Pending**: Outstanding payments awaiting processing
- **Total Failed**: Failed payment attempts
- **Average Payment Time**: Time from creation to completion
- **Collection Rate**: Success rate percentage
- **Monthly Revenue**: Revenue tracking by time period
- **Top Companies**: Companies with highest payment volumes

---

## 🔧 **INTEGRATION WITH EXISTING SYSTEMS**

### **Stripe Integration:**

```typescript
// Direct payment to company Stripe account
const paymentIntent = await this.stripeService.createPaymentIntent(
  Math.round(payment.amount * 100), // Convert to cents
  company.stripeAccountId || 'default',
  `Dispatch Fee - Load ${payment.loadId}`,
  {
    loadId: payment.loadId,
    carrierId: payment.carrierId,
    driverId: payment.driverId,
    companyId: payment.companyId,
    paymentType: 'dispatch_fee',
  }
);
```

### **Bill.com Integration:**

```typescript
// ACH payment processing through Bill.com
const achPayment = await this.billComService.createACHPayment({
  amount: payment.amount,
  customerId: company.billComAccountId || payment.companyId,
  description: `Dispatch Fee - Load ${payment.loadId}`,
  metadata: {
    loadId: payment.loadId,
    carrierId: payment.carrierId,
    driverId: payment.driverId,
    paymentType: 'dispatch_fee',
  },
});
```

### **Load Workflow Integration:**

- **Step 5**: Dispatcher assigns carrier/driver
- **Step 6**: Load assignment confirmation
- **Dispatch Fee Collection**: Automatic trigger after assignment
- **Payment Processing**: Real-time payment processing
- **Confirmation**: Payment confirmation in workflow

---

## 🎨 **USER INTERFACE FEATURES**

### **DispatchFeeCollectionModal Features:**

- **Load Information Display**: Complete load details
- **Fee Configuration**: Adjustable fee percentage (5-15%)
- **Payment Method Selection**: Visual payment method cards
- **Real-time Calculation**: Live fee and total calculation
- **Payment Processing**: Real-time status updates
- **Success/Failure Handling**: Professional status feedback

### **Payment Method Cards:**

```typescript
const paymentMethods: PaymentMethod[] = [
  {
    id: 'stripe',
    type: 'stripe',
    label: 'Credit Card',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Secure online payment',
  },
  {
    id: 'ach',
    type: 'ach',
    label: 'Bank Transfer',
    icon: <Building className="w-5 h-5" />,
    description: 'Direct bank transfer',
  },
  // ... additional methods
];
```

---

## 🔄 **API ENDPOINTS**

### **GET Endpoints:**

- `GET /api/dispatch-fee-collection?action=payments` - Retrieve payments with filters
- `GET /api/dispatch-fee-collection?action=metrics` - Get payment analytics
- `GET /api/dispatch-fee-collection?action=config` - Get system configuration
- `GET /api/dispatch-fee-collection?action=company&companyId=xxx` - Get company details

### **POST Endpoints:**

- `POST /api/dispatch-fee-collection` - Create payment or company
  - `action: 'create_payment'` - Create new dispatch fee payment
  - `action: 'process_payment'` - Process existing payment
  - `action: 'create_company'` - Create new company account

### **PUT Endpoints:**

- `PUT /api/dispatch-fee-collection` - Update company or configuration
  - `action: 'update_company'` - Update company information
  - `action: 'update_config'` - Update system configuration

---

## 🛡️ **SECURITY & COMPLIANCE**

### **Payment Security:**

- **Stripe PCI Compliance**: All credit card processing through Stripe
- **Encrypted Data**: Sensitive information encrypted at rest
- **Secure API**: All endpoints require proper authentication
- **Audit Trail**: Complete payment history and tracking

### **Data Protection:**

- **Bank Information**: Encrypted storage of banking details
- **Tax Information**: Secure handling of tax IDs
- **Payment History**: Complete audit trail for all transactions
- **Access Control**: Role-based access to payment data

---

## 📈 **BUSINESS BENEFITS**

### **For Companies:**

- **Direct Payment Receipt**: Payments go directly to company accounts
- **Multiple Payment Options**: Flexibility in payment acceptance
- **Automated Processing**: Reduced manual payment handling
- **Complete Tracking**: Full payment history and analytics

### **For Dispatchers:**

- **Automated Collection**: No manual payment collection required
- **Professional Process**: Standardized payment procedures
- **Reduced Administrative Burden**: Automated payment processing
- **Clear Documentation**: Complete payment records

### **For Drivers/Carriers:**

- **Multiple Payment Methods**: Flexibility in payment options
- **Transparent Fees**: Clear fee calculation and breakdown
- **Professional Receipts**: Complete payment documentation
- **Secure Processing**: Safe and secure payment handling

---

## 🔗 **SYSTEM INTEGRATION MAP**

### **Connected Systems:**

1. **Load Management System** → Triggers dispatch fee collection
2. **Stripe Payment Processing** → Handles credit card payments
3. **Bill.com Integration** → Processes ACH and check payments
4. **Company Management** → Manages company accounts and preferences
5. **Analytics Engine** → Provides payment metrics and reporting
6. **Notification System** → Sends payment confirmations and alerts

### **Data Flow:**

```
Load Assignment → Fee Calculation → Payment Creation →
Payment Processing → Company Distribution → Confirmation → Analytics
```

---

## 🎯 **IMPLEMENTATION STATUS**

### **✅ Completed Features:**

- **DispatchFeeCollectionService**: Complete payment processing service
- **API Routes**: Full RESTful API implementation
- **React Component**: Professional UI for payment collection
- **Stripe Integration**: Secure credit card processing
- **Bill.com Integration**: ACH and check payment processing
- **Company Management**: Complete company account system
- **Analytics**: Payment metrics and reporting
- **Configuration**: Flexible fee and payment settings

### **🚀 Ready for Production:**

- **Payment Processing**: All payment methods implemented
- **Security**: PCI-compliant payment handling
- **UI/UX**: Professional payment interface
- **API**: Complete RESTful API endpoints
- **Documentation**: Comprehensive system documentation

---

## 💡 **USAGE EXAMPLES**

### **Creating a Dispatch Fee Payment:**

```typescript
const dispatchFeeService = new DispatchFeeCollectionService();

const payment = await dispatchFeeService.createDispatchFeePayment({
  loadId: 'LOAD-12345',
  carrierId: 'CARRIER-001',
  driverId: 'DRIVER-001',
  companyId: 'COMPANY-001',
  loadAmount: 5000.00,
  feePercentage: 10.0,
  paymentMethod: 'stripe',
  notes: 'Dispatch fee for load LOAD-12345',
});
```

### **Processing Payment:**

```typescript
const result = await dispatchFeeService.processPayment(payment);

if (result.success) {
  console.log('Payment processed successfully');
} else {
  console.error('Payment failed:', result.error);
}
```

### **Getting Payment Metrics:**

```typescript
const metrics = await dispatchFeeService.getDispatchFeeMetrics('month');

console.log('Total collected:', metrics.totalCollected);
console.log('Collection rate:', metrics.collectionRate);
```

---

This **Dispatch Fee Collection System** ensures that dispatch fees are properly collected and
distributed to the correct companies, providing a professional and automated payment processing
solution that integrates seamlessly with FleetFlow's comprehensive load management workflow.
