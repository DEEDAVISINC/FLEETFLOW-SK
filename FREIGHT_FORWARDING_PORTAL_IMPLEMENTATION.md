# 🚢 Freight Forwarding & Customs Agent Portal - Complete Implementation Guide

## 📋 Overview

This document explains the complete implementation of the freight forwarding and customs agent
portal system with all features, including authentication, WebSocket communication, reports,
analytics, and payments.

---

## 🎯 Key Features Implemented

### **1. Authentication System for Client Users**

#### **Service:** `ClientAuthService.ts`

**Purpose:** Mock authentication system that can easily be upgraded to real database

**Features:**

- Email/password login
- Magic link authentication (passwordless)
- Session management with tokens
- Role-based access (ADMIN, MANAGER, USER, VIEWER)
- Permission checking
- Auto-logout on session expiry

**Usage Example:**

```typescript
import { clientAuthService } from '../services/ClientAuthService';

// Login
const session = await clientAuthService.login('john@example.com', 'password');

// Get current user
const user = clientAuthService.getCurrentUser();

// Check permission
if (clientAuthService.hasPermission('documents:write')) {
  // Allow document upload
}

// Logout
clientAuthService.logout();
```

**Mock Users (for testing):**

- john.smith@abcshipping.com (ADMIN) - Full access
- jane.doe@abcshipping.com (USER) - Read/write documents and shipments
- viewer@abcshipping.com (VIEWER) - Read-only access

**Storage:** Uses localStorage (can be upgraded to HTTP-only cookies for production)

**Upgrade Path:** Replace mock users Map with database queries, add real password hashing (bcrypt),
implement refresh tokens

---

### **2. WebSocket Service (Real-Time Updates)**

#### **Service:** `WebSocketService.ts`

**Purpose:** Reliable WebSocket connection with auto-reconnection for real-time updates

**Features:**

- Auto-reconnection with exponential backoff
- Connection status tracking
- Subscribe/unsubscribe pattern
- Error handling
- Message type routing

**Usage Example:**

```typescript
import { webSocketService } from '../services/WebSocketService';

// Connect
webSocketService.connect('user-id-123');

// Subscribe to messages
const unsubscribe = webSocketService.subscribe((message) => {
  if (message.type === 'NOTIFICATION') {
    // Show notification
    showNotification(message.data);
  } else if (message.type === 'SHIPMENT_UPDATE') {
    // Update shipment status
    updateShipment(message.data);
  }
});

// Later: Unsubscribe
unsubscribe();

// Disconnect
webSocketService.disconnect();
```

**Message Types:**

- `NOTIFICATION` - New notifications
- `SHIPMENT_UPDATE` - Shipment status changes
- `DOCUMENT_UPDATE` - Document approvals/rejections
- `MESSAGE` - New messages

**Configuration:** Set `NEXT_PUBLIC_WS_URL` in your `.env` file:

```
NEXT_PUBLIC_WS_URL=ws://your-websocket-server.com
```

**Why This Avoids Previous Issues:**

1. **Proper Connection Management:** Only one connection at a time
2. **Graceful Reconnection:** Exponential backoff prevents overwhelming server
3. **Connection State Tracking:** Prevents duplicate connection attempts
4. **Error Boundaries:** Listener errors don't crash the service
5. **Clean Disconnect:** Properly closes connections and clears listeners

---

### **3. Reports & Analytics (Client-Specific)**

#### **Service:** `ReportsAnalyticsService.ts`

**Purpose:** Generate performance reports and analytics for specific clients

**Key Principle:**

- **Clients see ONLY their own data**
- **Freight Forwarders see ALL client data**

**Features:**

#### **For Client Users:**

```typescript
// Get client's own performance report
const report = await reportsAnalyticsService.getClientPerformanceReport(
  clientId,
  startDate,
  endDate
);

// Get client's analytics
const analytics = await reportsAnalyticsService.getClientAnalytics(
  clientId,
  startDate,
  endDate
);

// Export report
reportsAnalyticsService.exportReportToCSV(report);
```

**Report Includes:**

- Shipment statistics (total, active, completed, on-time rate)
- Document statistics (pending, approved, rejection rate)
- Customs clearance metrics
- Cost breakdown (freight, customs, additional charges)

**Analytics Include:**

- Shipments by month (trend chart)
- Shipments by status (pie chart)
- Top origins and destinations
- Cost trends over time

#### **For Freight Forwarders:**

```typescript
// Get all clients' performance
const allReports = await reportsAnalyticsService.getAllClientsPerformance(
  freightForwarderId,
  startDate,
  endDate
);
```

**Access Control:**

- Reports are scoped by `clientId`
- Authentication service ensures users can only access their own `clientId`
- Freight forwarders can access all client reports

---

### **4. Payment Viewing (Client-Specific)**

#### **Service:** `ClientPaymentService.ts`

**Purpose:** View invoices and payment status

**Key Principle:**

- **Clients see ONLY their own invoices**
- **Freight Forwarders see ALL invoices**

**Features:**

#### **For Client Users:**

```typescript
// Get client's invoices
const invoices = await clientPaymentService.getClientInvoices(clientId, {
  status: 'PENDING',
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-12-31'),
});

// Get payment summary
const summary = await clientPaymentService.getPaymentSummary(clientId);

// Download invoice
clientPaymentService.downloadInvoice(invoice);
```

**Invoice Data:**

- Invoice number, dates, status
- Line items (freight, customs, documentation, storage)
- Subtotal, tax, total
- Payment status and method
- Linked shipment information

**Payment Summary:**

- Total invoiced amount
- Total paid
- Total pending
- Total overdue
- Invoice counts by status

**Access Control:**

- All queries require `clientId`
- `getInvoiceById()` validates client has access
- Download restricted to client's own invoices

---

## 🏗️ Architecture & Data Flow

### **Authentication Flow:**

```
1. User visits /customs-agent-portal
2. Check ClientAuthService.getCurrentUser()
3. If no user:
   - Show login form
   - User enters email/password or requests magic link
   - ClientAuthService.login() creates session
   - Store token in localStorage
4. If user exists:
   - Load user's clientId and permissions
   - Pass to all components for access control
```

### **WebSocket Flow:**

```
1. User authenticates
2. Connect WebSocket with userId
3. Server authenticates and subscribes user to their channels
4. Server sends real-time updates:
   - New notification → Update NotificationPanel
   - Shipment update → Refresh shipments list
   - Document approved → Update DocumentManagementPanel
5. On disconnect: Auto-reconnect with backoff
```

### **Data Access Flow:**

```
For Client Users:
1. Get clientId from authenticated user
2. Pass clientId to all service calls
3. Services filter data by clientId
4. Return ONLY client's own data

For Freight Forwarders:
1. Get freightForwarderId from user
2. Can query by clientId (specific) or freightForwarderId (all)
3. Return all clients' data for that forwarder
```

---

## 🔒 Security & Access Control

### **Permission Levels:**

| Role              | Shipments     | Documents      | Reports     | Payments    | Client Mgmt |
| ----------------- | ------------- | -------------- | ----------- | ----------- | ----------- |
| ADMIN             | Read/Write    | Approve/Reject | View        | View        | No Access   |
| MANAGER           | Read/Write    | Read/Write     | View        | View        | No Access   |
| USER              | Read/Assigned | Read/Write     | View Own    | View Own    | No Access   |
| VIEWER            | Read Only     | Read Only      | View Own    | View Own    | No Access   |
| FREIGHT_FORWARDER | All           | All            | All Clients | All Clients | Full Access |

### **Implementation:**

```typescript
// In components
const user = clientAuthService.getCurrentUser();

if (!user) {
  return <LoginPage />;
}

// Check permission
if (!clientAuthService.hasPermission('documents:write')) {
  return <AccessDenied />;
}

// Use clientId for data access
const shipments = await getClientShipments(user.clientId);
```

---

## 📱 UI Components

### **New Components to Add:**

#### **1. LoginPage Component**

```typescript
// app/customs-agent-portal/login/page.tsx
// - Email/password form
// - Magic link request
// - "Forgot password" link
// - Auto-redirect after login
```

#### **2. ReportsPanel Component**

```typescript
// app/components/ReportsPanel.tsx
// - Date range selector
// - Report type selector
// - Charts (shipments by month, status pie chart)
// - Export buttons
// - KPI cards
```

#### **3. PaymentsPanel Component**

```typescript
// app/components/PaymentsPanel.tsx
// - Invoice list with filters
// - Payment summary cards
// - Invoice detail modal
// - Download invoice button
// - Pay now button (future)
```

#### **4. WebSocketStatus Component**

```typescript
// app/components/WebSocketStatus.tsx
// - Connection status indicator
// - Reconnection countdown
// - Error messages
```

---

## 🚀 Integration Steps

### **Step 1: Add Authentication to Customs Agent Portal**

```typescript
// app/customs-agent-portal/page.tsx
import { clientAuthService } from '../services/ClientAuthService';

function CustomsAgentPortalContent() {
  const [user, setUser] = useState(clientAuthService.getCurrentUser());

  useEffect(() => {
    // Check authentication
    const currentUser = clientAuthService.getCurrentUser();
    if (!currentUser) {
      router.push('/customs-agent-portal/login');
      return;
    }
    setUser(currentUser);

    // Connect WebSocket
    webSocketService.connect(currentUser.id);

    // Subscribe to updates
    const unsubscribe = webSocketService.subscribe((message) => {
      if (message.type === 'NOTIFICATION') {
        // Refresh notifications
        loadNotifications();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Rest of component uses user.clientId for all data access
}
```

### **Step 2: Add Reports Tab**

```typescript
// In customs-agent-portal/page.tsx
{selectedTab === 'reports' && user && (
  <ReportsPanel
    clientId={user.clientId}
    userRole={user.role}
  />
)}
```

### **Step 3: Add Payments Tab**

```typescript
{selectedTab === 'payments' && user && (
  <PaymentsPanel
    clientId={user.clientId}
    userRole={user.role}
  />
)}
```

---

## 🔄 Upgrade to Real Database

### **When You're Ready:**

1. **Replace Mock Data:**

```typescript
// Instead of:
const user = this.users.get(email);

// Use:
const user = await supabase
  .from('client_users')
  .select('*')
  .eq('email', email)
  .single();
```

2. **Add Password Hashing:**

```typescript
import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, user.hashedPassword);
```

3. **Use HTTP-Only Cookies:**

```typescript
// In API route
res.setHeader('Set-Cookie', `auth_token=${token}; HttpOnly; Secure; SameSite=Strict`);
```

4. **Connect WebSocket to Your Backend:**

```typescript
// Set environment variable
NEXT_PUBLIC_WS_URL=wss://your-backend.com/ws
```

---

## 📊 Summary

✅ **Authentication:** Mock system ready, easy to upgrade ✅ **WebSocket:** Reliable real-time
updates with auto-reconnection ✅ **Reports:** Client-specific performance and analytics ✅
**Payments:** Invoice viewing and download ✅ **Access Control:** Role-based permissions throughout
✅ **Scalability:** All services are singletons, easy to integrate

**All services use mock data that can be swapped for database queries without changing the UI
layer!**

---

## 🎯 Next Actions

1. Test authentication flow in customs agent portal
2. Create LoginPage component
3. Create ReportsPanel component
4. Create PaymentsPanel component
5. Test WebSocket with a simple local server
6. Integrate with your Supabase database when ready

All the infrastructure is in place - you just need to add the UI components and connect to your real
data sources! 🚀
