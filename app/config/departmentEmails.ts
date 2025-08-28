// FleetFlow Department Email Configuration
// Maps business departments to email aliases for ImprovMX forwarding

import { DepartmentEmailMapping } from '../services/improvmx-service';

export interface DepartmentInfo {
  name: string;
  description: string;
  primaryContact: string;
  backupContact?: string;
  aliases: string[];
  responsibilities: string[];
}

export interface FleetFlowDepartments {
  [departmentKey: string]: DepartmentInfo;
}

// FleetFlow Business Department Structure
export const FLEETFLOW_DEPARTMENTS: FleetFlowDepartments = {
  // 🚛 DISPATCH CENTRAL - Core dispatch operations
  dispatch: {
    name: 'Dispatch Central',
    description: 'Load management, driver coordination, route planning',
    primaryContact: 'dispatch@fleetflowapp.com',
    aliases: ['dispatch', 'loads', 'routing', 'tracking', 'drivers'],
    responsibilities: [
      'Load board management',
      'Driver assignment and coordination',
      'Route optimization and planning',
      'Real-time tracking and updates',
      'Dispatch fee management',
      'Load history and documentation',
    ],
  },

  // 🤝 BROKER OPERATIONS - Customer and shipper relations
  brokerage: {
    name: 'Broker Operations',
    description: 'Shipper management, freight brokerage, market operations',
    primaryContact: 'broker@fleetflowapp.com',
    aliases: ['brokers', 'broker', 'shippers', 'quotes', 'rates', 'rfx'],
    responsibilities: [
      'Shipper relationship management',
      'Quote generation and pricing',
      'Load posting and matching',
      'Market rate analysis',
      'RFx center management',
      'Customer relations and sales',
    ],
  },

  // 🏢 FLEET MANAGEMENT - Vehicle and asset management
  fleet: {
    name: 'Fleet Management',
    description: 'Vehicle management, maintenance, fuel, fleet optimization',
    primaryContact: 'drive@fleetflowapp.com',
    aliases: ['fleet', 'vehicles', 'maintenance', 'fuel', 'equipment', 'drive'],
    responsibilities: [
      'Vehicle management and tracking',
      'Maintenance scheduling',
      'Fuel management and monitoring',
      'Fleet performance analytics',
      'Equipment documentation',
      'Asset optimization',
    ],
  },

  // 👥 DRIVER SERVICES - Driver management and support
  drivers: {
    name: 'Driver Services',
    description: 'Driver management, onboarding, performance, communication',
    primaryContact: 'onboarding@fleetflowapp.com',
    aliases: ['driver-services', 'driver-support', 'onboarding', 'recruiting'],
    responsibilities: [
      'Driver profile management',
      'Onboarding and recruitment',
      'Performance tracking',
      'Driver communication',
      'Documentation management',
      'Driver portal support',
    ],
  },

  // ⚖️ COMPLIANCE & SAFETY - DOT compliance and safety management
  compliance: {
    name: 'Compliance & Safety',
    description: 'DOT compliance, safety records, violations, inspections',
    primaryContact: 'compliance@fleetflowapp.com',
    aliases: [
      'compliance',
      'safety',
      'dot',
      'inspections',
      'violations',
      'csa',
    ],
    responsibilities: [
      'DOT compliance monitoring',
      'Safety record management',
      'Inspection report processing',
      'Violation tracking and resolution',
      'CSA score management',
      'Audit preparation',
    ],
  },

  // 💰 ACCOUNTING & FINANCE - Financial operations
  accounting: {
    name: 'Accounting & Finance',
    description: 'Invoicing, payroll, financial reporting, cash flow',
    primaryContact: 'billing@fleetflowapp.com',
    backupContact: 'claims@fleetflowapp.com',
    aliases: [
      'accounting',
      'finance',
      'billing',
      'invoices',
      'payroll',
      'payments',
      'claims',
    ],
    responsibilities: [
      'Invoice management and processing',
      'Accounts receivable/payable',
      'Payroll processing',
      'Financial reporting and analysis',
      'Cash flow management',
      'Tax documentation and compliance',
    ],
  },

  // 📊 ANALYTICS & REPORTING - Business intelligence
  analytics: {
    name: 'Analytics & Reporting',
    description: 'Business intelligence, performance metrics, data analysis',
    primaryContact: 'api@fleetflowapp.com',
    aliases: ['analytics', 'reports', 'data', 'metrics', 'insights', 'api'],
    responsibilities: [
      'Performance analytics and reporting',
      'Business intelligence dashboards',
      'Data analysis and insights',
      'Custom report generation',
      'Trend analysis and forecasting',
      'Operational metrics tracking',
    ],
  },

  // 🎓 FLEETFLOW UNIVERSITY - Training and certification
  training: {
    name: 'FleetFlow University',
    description: 'Training programs, certification, professional development',
    primaryContact: 'go@fleetflowapp.com',
    aliases: [
      'university',
      'training',
      'education',
      'certification',
      'instructors',
      'go',
    ],
    responsibilities: [
      'Training module development',
      'Certification program management',
      'Instructor coordination',
      'Progress tracking and analytics',
      'Professional development programs',
      'Educational content management',
    ],
  },

  // ⚙️ SYSTEM ADMINISTRATION - IT and system management
  admin: {
    name: 'System Administration',
    description: 'IT support, system settings, user management, integrations',
    primaryContact: 'security@fleetflowapp.com',
    backupContact: 'ddavis@fleetflowapp.com',
    aliases: [
      'admin',
      'it',
      'tech-support',
      'systems',
      'integrations',
      'security',
      'ddavis',
    ],
    responsibilities: [
      'System administration and maintenance',
      'User account management',
      'Integration management',
      'Security and backup operations',
      'Developer tools and API management',
      'Technical support',
    ],
  },

  // 🛠️ CUSTOMER SUPPORT - Customer service and support
  support: {
    name: 'Customer Support',
    description: 'Customer service, technical support, issue resolution',
    primaryContact: 'contact@fleetflowapp.com',
    backupContact: 'info@fleetflowapp.com',
    aliases: [
      'support',
      'help',
      'customer-service',
      'helpdesk',
      'contact',
      'info',
    ],
    responsibilities: [
      'Customer service and support',
      'Technical issue resolution',
      'Account assistance',
      'Feature guidance and training',
      'Bug reporting and tracking',
      'Service improvement feedback',
    ],
  },

  // 📢 SALES & MARKETING - Sales and marketing operations
  marketing: {
    name: 'Sales & Marketing',
    description: 'Sales operations, marketing campaigns, lead generation',
    primaryContact: 'sales@fleetflowapp.com',
    backupContact: 'marketing@fleetflowapp.com',
    aliases: ['sales', 'marketing', 'leads', 'campaigns', 'promotions'],
    responsibilities: [
      'Sales lead management',
      'Marketing campaign development',
      'Customer acquisition',
      'Brand management',
      'Promotional activities',
      'Market analysis',
    ],
  },

  // 🔒 PRIVACY & LEGAL - Privacy and legal matters
  privacy: {
    name: 'Privacy & Legal',
    description: 'Privacy compliance, legal matters, data protection',
    primaryContact: 'privacy@fleetflowapp.com',
    aliases: ['privacy', 'legal', 'gdpr', 'data-protection', 'terms'],
    responsibilities: [
      'Privacy policy management',
      'GDPR compliance',
      'Legal document review',
      'Data protection oversight',
      'Terms of service management',
      'Regulatory compliance',
    ],
  },

  // 🌊 FLOWHUB - FlowHub operations and management
  flowhub: {
    name: 'FlowHub Operations',
    description: 'FlowHub platform management and operations',
    primaryContact: 'flowhub@fleetflowapp.com',
    aliases: ['flowhub', 'flow-hub', 'hub', 'platform'],
    responsibilities: [
      'FlowHub platform operations',
      'Hub management',
      'Platform integrations',
      'User experience optimization',
      'Feature development coordination',
      'Platform support',
    ],
  },

  // 📧 SYSTEM EMAILS - Automated system communications
  systemEmails: {
    name: 'System Communications',
    description: 'Automated system emails and notifications',
    primaryContact: 'noreply@fleetflowapp.com',
    aliases: ['noreply', 'system', 'automated', 'notifications'],
    responsibilities: [
      'Automated email delivery',
      'System notifications',
      'Transaction confirmations',
      'Password resets',
      'Account verifications',
      'System alerts',
    ],
  },
};

// Generate email mapping for ImprovMX setup
export const generateDepartmentEmailMapping = (
  defaultForwardEmail: string = 'admin@company.com'
): DepartmentEmailMapping => {
  const mapping: DepartmentEmailMapping = {};

  // Add all department aliases
  Object.values(FLEETFLOW_DEPARTMENTS).forEach((department) => {
    department.aliases.forEach((alias) => {
      mapping[alias] = department.primaryContact || defaultForwardEmail;
    });

    // Add backup contact if available
    if (department.backupContact) {
      mapping[`${department.name.toLowerCase().replace(/\s+/g, '-')}-backup`] =
        department.backupContact;
    }
  });

  // Add common business aliases that forward to the actual emails
  mapping['contact'] = 'contact@fleetflowapp.com';
  mapping['info'] = 'info@fleetflowapp.com';
  mapping['sales'] = 'sales@fleetflowapp.com';
  mapping['marketing'] = 'marketing@fleetflowapp.com';
  mapping['operations'] = 'dispatch@fleetflowapp.com';
  mapping['legal'] = 'privacy@fleetflowapp.com';
  mapping['privacy'] = 'privacy@fleetflowapp.com';
  mapping['security'] = 'security@fleetflowapp.com';
  mapping['noreply'] = 'noreply@fleetflowapp.com';

  return mapping;
};

// Get department by alias
export const getDepartmentByAlias = (alias: string): DepartmentInfo | null => {
  for (const department of Object.values(FLEETFLOW_DEPARTMENTS)) {
    if (department.aliases.includes(alias)) {
      return department;
    }
  }
  return null;
};

// Get all aliases for a department
export const getAllAliasesForDepartment = (departmentKey: string): string[] => {
  const department = FLEETFLOW_DEPARTMENTS[departmentKey];
  return department ? department.aliases : [];
};

// Validate email configuration
export const validateEmailConfiguration = (): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  Object.entries(FLEETFLOW_DEPARTMENTS).forEach(([key, department]) => {
    // Check for required fields
    if (!department.primaryContact) {
      errors.push(`Department '${key}' missing primary contact email`);
    }

    if (!department.aliases || department.aliases.length === 0) {
      errors.push(`Department '${key}' has no email aliases defined`);
    }

    // Check for duplicate aliases across departments
    department.aliases.forEach((alias) => {
      const otherDepartments = Object.entries(FLEETFLOW_DEPARTMENTS)
        .filter(([otherKey]) => otherKey !== key)
        .filter(([, otherDept]) => otherDept.aliases.includes(alias));

      if (otherDepartments.length > 0) {
        warnings.push(
          `Alias '${alias}' is used in multiple departments: ${key}, ${otherDepartments.map(([k]) => k).join(', ')}`
        );
      }
    });

    // Check email format (basic validation)
    if (department.primaryContact && !department.primaryContact.includes('@')) {
      errors.push(
        `Department '${key}' has invalid primary contact email format`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

export default FLEETFLOW_DEPARTMENTS;
