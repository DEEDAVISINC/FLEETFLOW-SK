# 📧 FleetFlow Email System Integration Guide

## Overview

The FleetFlow Email System integrates ImprovMX email forwarding with your FleetFlow business
departments, creating a professional email infrastructure that routes emails to the appropriate
teams based on your business functions.

## 🏢 Department Structure

### Core Business Departments

| Department                | Primary Email            | Aliases                                                     | Purpose                                  |
| ------------------------- | ------------------------ | ----------------------------------------------------------- | ---------------------------------------- |
| **Dispatch Central**      | `dispatch@company.com`   | dispatch, loads, routing, tracking, drivers                 | Load management and driver coordination  |
| **Broker Operations**     | `brokers@company.com`    | brokers, broker, shippers, quotes, rates, rfx               | Customer relations and freight brokerage |
| **Fleet Management**      | `fleet@company.com`      | fleet, vehicles, maintenance, fuel, equipment               | Vehicle and asset management             |
| **Driver Services**       | `drivers@company.com`    | driver-services, driver-support, onboarding, recruiting     | Driver management and support            |
| **Compliance & Safety**   | `compliance@company.com` | compliance, safety, dot, inspections, violations, csa       | DOT compliance and safety records        |
| **Accounting & Finance**  | `accounting@company.com` | accounting, finance, billing, invoices, payroll, payments   | Financial operations                     |
| **Analytics & Reporting** | `analytics@company.com`  | analytics, reports, data, metrics, insights                 | Business intelligence                    |
| **FleetFlow University**  | `university@company.com` | university, training, education, certification, instructors | Training and certification               |
| **System Administration** | `admin@company.com`      | admin, it, tech-support, systems, integrations              | IT support and system management         |
| **Customer Support**      | `support@company.com`    | support, help, customer-service, helpdesk                   | Customer service and support             |

### Common Business Aliases

| Alias                         | Forwards To           | Purpose              |
| ----------------------------- | --------------------- | -------------------- |
| `contact@fleetflowapp.com`    | Customer Support      | General inquiries    |
| `info@fleetflowapp.com`       | Customer Support      | Information requests |
| `sales@fleetflowapp.com`      | Broker Operations     | Sales inquiries      |
| `operations@fleetflowapp.com` | Dispatch Central      | Operational matters  |
| `legal@fleetflowapp.com`      | Compliance & Safety   | Legal matters        |
| `privacy@fleetflowapp.com`    | Compliance & Safety   | Privacy concerns     |
| `security@fleetflowapp.com`   | System Administration | Security issues      |

## 🚀 Setup Instructions

### 1. Configure Department Contacts

Edit `/app/config/departmentEmails.ts` and update the `primaryContact` fields with your actual
department email addresses:

```typescript
dispatch: {
  name: 'Dispatch Central',
  description: 'Load management, driver coordination, route planning',
  primaryContact: 'your-dispatch-team@yourcompany.com', // Update this
  aliases: ['dispatch', 'loads', 'routing', 'tracking', 'drivers'],
  // ...
},
```

### 2. Setup ImprovMX API Key

Add your ImprovMX API key to your environment variables:

```bash
IMPROVMX_API_KEY=your_improvmx_api_key_here
```

### 3. Run the Setup

Access the admin interface at `/admin/email-management` and:

1. Set your default forwarding email
2. Click "🚀 Setup All Departments"
3. Test the configuration with "🧪 Test Configuration"

### 4. Verify Setup

Check that all aliases are working:

- Send test emails to various aliases (e.g., `support@fleetflowapp.com`)
- Verify they forward to the correct department contacts
- Monitor the alias status in the admin panel

## 💻 Programmatic Usage

### Setup All Department Emails

```typescript
import { fleetFlowEmailService } from '../services/FleetFlowEmailService';

const setupResult = await fleetFlowEmailService.setupAllDepartmentEmails(
  'admin@yourcompany.com' // Default forwarding email
);

if (setupResult.success) {
  console.log(`Created ${setupResult.aliasesCreated} email aliases`);
} else {
  console.error('Setup failed:', setupResult.errors);
}
```

### Create Individual Alias

```typescript
const result = await fleetFlowEmailService.createDepartmentAlias(
  'newdept',
  'newdept@yourcompany.com'
);
```

### Check Email Status

```typescript
const status = await fleetFlowEmailService.getAliasStatus();
console.log('Active aliases:', status.aliases);
```

### Get Department Info

```typescript
const deptInfo = fleetFlowEmailService.getDepartmentInfo('support');
console.log('Support department:', deptInfo);
```

## 🔧 API Endpoints

### GET `/api/email/departments`

**Query Parameters:**

- `action=status` - Get current alias status
- `action=directory` - Get email directory
- `action=test` - Test configuration
- `action=contacts` - Get department contacts

### POST `/api/email/departments`

**Actions:**

- `setup-all` - Setup all department emails
- `create-alias` - Create new alias
- `update-alias` - Update existing alias

### DELETE `/api/email/departments?alias=<alias>`

Delete an email alias.

## 📋 Admin Interface

Access the admin interface at `/admin/email-management` to:

- ✅ Setup all department emails at once
- ✅ Create individual email aliases
- ✅ View active aliases and forwarding
- ✅ Test email configuration
- ✅ Delete unwanted aliases
- ✅ View department directory

## 🔍 Troubleshooting

### Common Issues

1. **Aliases not working**
   - Check ImprovMX API key is set correctly
   - Verify domain is active in ImprovMX
   - Ensure DNS records are properly configured

2. **Setup failing**
   - Check department contact emails are valid
   - Verify ImprovMX account has sufficient quota
   - Review API rate limits

3. **Emails not forwarding**
   - Check spam folders on receiving addresses
   - Verify ImprovMX forwarding settings
   - Test with different email providers

### Testing

Use the built-in test function:

```typescript
const testResults = await fleetFlowEmailService.testEmailConfiguration();
console.log('Test results:', testResults);
```

## 🛡️ Security Considerations

- Keep ImprovMX API key secure in environment variables
- Regularly audit email aliases and forwarding
- Monitor for unauthorized alias creation
- Use role-based access for email management
- Consider implementing email encryption for sensitive departments

## 📞 Support

For issues with the email system:

- Check the admin interface for status and errors
- Review logs for detailed error information
- Contact your system administrator
- Refer to ImprovMX documentation for API issues

## 🔄 Updates and Maintenance

- Regularly review and update department contacts
- Monitor alias usage and clean up unused aliases
- Update forwarding addresses when staff changes
- Backup your email configuration periodically
- Keep ImprovMX API integration updated

---

**Last Updated:** January 2025 **Version:** 1.0 **FleetFlow Email System** - Professional Email
Management







