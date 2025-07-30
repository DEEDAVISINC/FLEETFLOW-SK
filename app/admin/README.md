# FleetFlow Admin Section

This directory houses administrative pages and tools that require management-level access.

## Pages

### `/admin/driver-otr-flow/`

- **Purpose**: Administrative interface for the Driver OTR Flow system
- **Access**: Requires `hasManagementAccess` permission
- **Features**:
  - Driver management and monitoring
  - Load assignment workflow
  - Real-time driver location tracking
  - Emergency dispatch coordination
- **Navigation**: Available in Management dropdown menu
- **Moved from**: `/drivers/enhanced-portal/` (relocated for proper admin access control)

### `/admin/business-intelligence/`

- **Purpose**: Business intelligence and analytics dashboard
- **Access**: Administrative users only
- **Features**: Advanced analytics and reporting tools

## Access Control

All pages in this directory should implement proper access control checks using:

```typescript
import { checkPermission } from '../../config/access';

// Check admin permissions
if (!checkPermission('hasManagementAccess')) {
  return <AccessRestricted />;
}
```

## Navigation Integration

Admin pages are integrated into the main navigation through:

- **Management Dropdown**: `/components/Navigation_clean.tsx` - managementItems array
- **Driver Management Dropdown**: `/components/TestNavigation.tsx` - for legacy navigation support

## Migration Notes

- Driver OTR Flow was moved from driver section to admin section on user request
- All navigation references have been updated to point to new admin location
- Old `/drivers/enhanced-portal/` directory has been removed
- Redirects in driver portal pages have been updated to point to admin location
