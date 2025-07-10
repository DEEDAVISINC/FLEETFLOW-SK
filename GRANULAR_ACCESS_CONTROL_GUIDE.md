# Granular Access Control System - Implementation Guide

## Overview

FleetFlow now implements a comprehensive, granular access control system that allows administrators to grant or deny access to specific areas, features, and even individual UI components within each page of the application.

## 🔒 System Architecture

### Core Components

1. **`app/config/granularAccess.ts`** - Permission definitions and access logic
2. **`app/utils/accessControl.ts`** - Utility classes and helper functions
3. **`app/components/ExampleDashboard.tsx`** - Implementation example
4. **`app/settings/page.tsx`** - Admin interface for permission management

## 📋 Permission Structure

### Permission Naming Convention
Permissions follow the format: `{page}.{action}`

Examples:
- `dashboard.view` - View dashboard page
- `dashboard.revenue` - View revenue metrics on dashboard
- `dispatch.create` - Create new loads in dispatch
- `financial.view_invoices` - View invoices in financial section
- `settings.manage_permissions` - Manage user permissions

### Available Permission Categories

#### Dashboard Permissions
- `dashboard.view` - Access to main dashboard
- `dashboard.revenue` - View revenue metrics
- `dashboard.loads` - View load statistics
- `dashboard.performance` - View performance charts
- `dashboard.create_load` - Create new loads
- `dashboard.export` - Export dashboard data

#### Dispatch Permissions
- `dispatch.view` - Access dispatch board
- `dispatch.view_all` - View all loads
- `dispatch.view_assigned` - View only assigned loads
- `dispatch.create` - Create new loads
- `dispatch.edit` - Edit existing loads
- `dispatch.delete` - Delete loads
- `dispatch.assign_drivers` - Assign drivers to loads
- `dispatch.view_rates` - View freight rates
- `dispatch.edit_rates` - Edit freight rates

#### Analytics Permissions
- `analytics.view` - Access analytics dashboard
- `analytics.revenue` - View revenue analytics
- `analytics.performance` - View performance metrics
- `analytics.export` - Export analytics data
- `analytics.custom_reports` - Create custom reports

#### Financial Permissions
- `financial.view` - Access financial dashboard
- `financial.view_invoices` - View invoices
- `financial.create_invoices` - Create invoices
- `financial.edit_invoices` - Edit invoices
- `financial.process_payments` - Process payments
- `financial.audit_trail` - View audit trails

#### Training Permissions
- `training.view` - Access training center
- `training.take_quizzes` - Take training quizzes
- `training.all_progress` - View all users' progress
- `training.manage_content` - Manage training content
- `training.assign_modules` - Assign training modules
- `training.manage_instructors` - Manage instructors

#### Settings Permissions
- `settings.view` - Access settings page
- `settings.user_management` - Manage user accounts
- `settings.create_users` - Create new users
- `settings.edit_users` - Edit user accounts
- `settings.manage_permissions` - Assign permissions
- `settings.system_settings` - Configure system settings

## 🛠 Implementation Guide

### 1. Basic Permission Check

```typescript
import { useAccessControl } from '../utils/accessControl';

function MyComponent({ user }) {
  const accessControl = useAccessControl(user);
  
  if (!accessControl.can('dashboard.view')) {
    return <div>Access Denied</div>;
  }
  
  return <div>Dashboard Content</div>;
}
```

### 2. Component-Level Access Control

```typescript
import { AccessControlled } from '../utils/accessControl';

function MyPage({ user }) {
  return (
    <div>
      <h1>Page Title</h1>
      
      {/* Only show revenue section to users with revenue permission */}
      <AccessControlled
        user={user}
        requiredPermission="dashboard.revenue"
        fallbackComponent={<div>Revenue data restricted</div>}
      >
        <RevenueMetrics />
      </AccessControlled>
      
      {/* Show if user has ANY of these permissions */}
      <AccessControlled
        user={user}
        requiredPermissions={['dispatch.view', 'analytics.view']}
      >
        <OperationalData />
      </AccessControlled>
    </div>
  );
}
```

### 3. Button and Action Controls

```typescript
import { FeatureAccess } from '../utils/accessControl';

function ActionBar({ user }) {
  return (
    <div>
      {FeatureAccess.Buttons.canShowCreateButton(user, 'dispatch') && (
        <button>Create Load</button>
      )}
      
      {FeatureAccess.Buttons.canShowEditButton(user, 'dispatch') && (
        <button>Edit Load</button>
      )}
      
      {FeatureAccess.Buttons.canShowDeleteButton(user, 'dispatch') && (
        <button>Delete Load</button>
      )}
    </div>
  );
}
```

### 4. Page-Level Access Control

```typescript
import { PageAccess } from '../utils/accessControl';

function AnalyticsPage({ user }) {
  // Early return if user cannot access page
  if (!PageAccess.Analytics.canView(user)) {
    return <AccessDeniedPage />;
  }
  
  return (
    <div>
      <h1>Analytics Dashboard</h1>
      
      {PageAccess.Analytics.canViewRevenue(user) && (
        <RevenueAnalytics />
      )}
      
      {PageAccess.Analytics.canExport(user) && (
        <ExportButton />
      )}
    </div>
  );
}
```

### 5. Navigation Menu Controls

```typescript
import { FeatureAccess } from '../utils/accessControl';

function NavigationMenu({ user }) {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      
      {FeatureAccess.Navigation.shouldShowAnalyticsMenu(user) && (
        <Link href="/analytics">Analytics</Link>
      )}
      
      {FeatureAccess.Navigation.shouldShowFinancialMenu(user) && (
        <Link href="/financial">Financial</Link>
      )}
      
      {FeatureAccess.Navigation.shouldShowSettingsMenu(user) && (
        <Link href="/settings">Settings</Link>
      )}
    </nav>
  );
}
```

## 👥 User Management

### Role-Based Default Permissions

Each role has default permissions that can be overridden with custom assignments:

- **Driver**: `dashboard.view`, `routes.view_assigned`, `training.view`
- **Dispatcher**: `dashboard.view`, `dispatch.view_all`, `dispatch.create`, `dispatch.edit`
- **Manager**: `dashboard.view`, `dashboard.revenue`, `analytics.view`, `financial.view`
- **Admin**: `all` (access to everything)

### Custom Permission Assignment

Admins can assign specific permissions to users through the Settings page:

1. Go to Settings → Users
2. Create new user or edit existing user
3. Select specific permissions from the comprehensive list
4. Save user - permissions take effect immediately

### Permission Inheritance

- Users with `all` permission have access to everything
- Custom permissions override role-based defaults
- No permission assignment means user gets role-based defaults

## 🔧 Advanced Features

### Multiple Permission Checks

```typescript
const accessControl = useAccessControl(user);

// Check if user has ANY of these permissions
if (accessControl.canAny(['financial.view', 'analytics.view'])) {
  // Show financial or analytics data
}

// Check if user has ALL of these permissions
if (accessControl.canAll(['dispatch.create', 'dispatch.assign_drivers'])) {
  // Show full dispatch management
}
```

### Dynamic Permission Checking

```typescript
function DynamicButton({ user, context, action }) {
  const accessControl = useAccessControl(user);
  const permission = `${context}.${action}`;
  
  if (!accessControl.can(permission)) {
    return null;
  }
  
  return <button>Perform {action}</button>;
}

// Usage
<DynamicButton user={user} context="dispatch" action="create" />
<DynamicButton user={user} context="financial" action="edit_invoices" />
```

### Data Filtering Based on Permissions

```typescript
function FilteredDataTable({ user, data }) {
  const accessControl = useAccessControl(user);
  
  // Filter columns based on permissions
  const visibleColumns = columns.filter(column => {
    if (column.requiresPermission) {
      return accessControl.can(column.requiresPermission);
    }
    return true;
  });
  
  // Filter actions based on permissions
  const availableActions = actions.filter(action => 
    accessControl.can(action.permission)
  );
  
  return (
    <Table 
      columns={visibleColumns}
      data={data}
      actions={availableActions}
    />
  );
}
```

## 🎯 Best Practices

### 1. Fail Secure
Always default to denying access when in doubt.

```typescript
// Good
const canAccess = accessControl.can(permission) || false;

// Bad
const canAccess = accessControl.can(permission) || true;
```

### 2. Check Permissions Early
Check page-level permissions before rendering expensive components.

```typescript
// Good
function ExpensivePage({ user }) {
  if (!PageAccess.Analytics.canView(user)) {
    return <AccessDenied />;
  }
  
  return <ExpensiveAnalyticsComponent />;
}
```

### 3. Use Descriptive Permission Names
Make permission names clear and specific.

```typescript
// Good
'financial.view_invoices'
'dispatch.assign_drivers'
'analytics.export_data'

// Bad
'financial'
'dispatch_stuff'
'export'
```

### 4. Provide Fallback Components
Always provide meaningful feedback when access is denied.

```typescript
<AccessControlled
  user={user}
  requiredPermission="financial.view"
  fallbackComponent={
    <div>Contact your administrator for financial data access.</div>
  }
>
  <FinancialData />
</AccessControlled>
```

### 5. Test Permission Scenarios
Test your components with different user roles and permission sets.

```typescript
// Test with different user types
const adminUser = { role: 'admin', assignedPermissions: ['all'] };
const managerUser = { role: 'manager', assignedPermissions: ['dashboard.view', 'analytics.view'] };
const driverUser = { role: 'driver', assignedPermissions: ['dashboard.view', 'training.view'] };
```

## 🚀 Migration Guide

### For Existing Components

1. **Identify Access Points**: Determine what needs access control
2. **Add Permission Checks**: Wrap sections with `AccessControlled` or use `useAccessControl`
3. **Update Navigation**: Add permission checks to menu items
4. **Test Thoroughly**: Verify access control works with different user roles

### Example Migration

**Before:**
```typescript
function DispatchPage() {
  return (
    <div>
      <h1>Dispatch Board</h1>
      <CreateLoadButton />
      <LoadList />
      <RateManagement />
    </div>
  );
}
```

**After:**
```typescript
function DispatchPage({ user }) {
  const accessControl = useAccessControl(user);
  
  if (!accessControl.canAccessPage('dispatch')) {
    return <AccessDenied />;
  }
  
  return (
    <div>
      <h1>Dispatch Board</h1>
      
      {accessControl.can('dispatch.create') && <CreateLoadButton />}
      
      <LoadList 
        showAll={accessControl.can('dispatch.view_all')}
        canEdit={accessControl.can('dispatch.edit')}
      />
      
      <AccessControlled
        user={user}
        requiredPermission="dispatch.view_rates"
      >
        <RateManagement />
      </AccessControlled>
    </div>
  );
}
```

## 🔍 Debugging and Monitoring

### Debug Information
Use the admin debug panel to see user permissions:

```typescript
{accessControl.isAdmin() && (
  <div className="debug-panel">
    <h4>Debug Info</h4>
    <p>Role: {user.role}</p>
    <p>Permissions: {JSON.stringify(user.assignedPermissions)}</p>
  </div>
)}
```

### Permission Auditing
Log permission checks for auditing:

```typescript
const checkPermission = (permission: string) => {
  const hasAccess = accessControl.can(permission);
  console.log(`Permission Check: ${permission} - ${hasAccess ? 'GRANTED' : 'DENIED'}`);
  return hasAccess;
};
```

## 📈 Future Enhancements

1. **Time-based Permissions**: Permissions that expire after a certain time
2. **Resource-based Permissions**: Permissions tied to specific resources (e.g., specific loads)
3. **Delegation**: Allow users to temporarily delegate permissions to others
4. **Permission Groups**: Group related permissions for easier management
5. **API Integration**: Sync permissions with external systems

---

This granular access control system provides fine-grained security while maintaining flexibility and ease of use. Every component, button, and data element can be individually controlled based on user permissions, ensuring that users only see and can access the features they're authorized to use.
