// 🔄 FleetFlow Workflow Types Configuration
// Comprehensive list of all workflows in the FleetFlow system
// Organized by category: Operational, Business, Onboarding

export const FLEETFLOW_WORKFLOWS = {
  // OPERATIONAL WORKFLOWS (Driver/Dispatcher Operations)
  LOAD_WORKFLOW: {
    id: 'load_workflow',
    name: 'Load Execution Workflow',
    description: 'Complete load lifecycle from assignment to delivery',
    steps: [
      'load_assignment_confirmation',
      'rate_confirmation_review',
      'rate_confirmation_verification',
      'bol_receipt_confirmation',
      'bol_verification',
      'pickup_authorization',
      'pickup_arrival',
      'pickup_completion',
      'transit_start',
      'transit_tracking',
      'delivery_arrival',
      'delivery_completion',
      'pod_submission',
    ],
    category: 'operational',
    users: ['driver', 'dispatcher'],
  },

  // BUSINESS WORKFLOWS (Broker/Management Operations)
  QUOTE_ACCEPTANCE_WORKFLOW: {
    id: 'quote_acceptance_workflow',
    name: 'Quote Acceptance Workflow',
    description: 'Quote generation to contract signing process',
    steps: [
      'quote_generated',
      'quote_sent_to_shipper',
      'quote_reviewed_by_shipper',
      'quote_accepted_by_shipper',
      'contract_generation_triggered',
      'contract_sent_to_shipper',
      'contract_signed_by_shipper',
      'contract_signed_by_broker',
      'relationship_established',
    ],
    category: 'business',
    users: ['broker', 'management'],
  },

  INVOICE_APPROVAL_WORKFLOW: {
    id: 'invoice_approval_workflow',
    name: 'Invoice Approval Workflow',
    description: 'Invoice creation to payment processing',
    steps: [
      'invoice_created',
      'invoice_submitted_for_approval',
      'invoice_reviewed_by_management',
      'invoice_approved',
      'invoice_sent_to_customer',
      'payment_received',
    ],
    category: 'business',
    users: ['broker', 'management', 'accounting'],
  },

  PAYMENT_PROCESSING_WORKFLOW: {
    id: 'payment_processing_workflow',
    name: 'Payment Processing Workflow',
    description: 'Payment initiation to distribution',
    steps: [
      'payment_initiated',
      'payment_processed',
      'payment_confirmed',
      'payment_distributed',
    ],
    category: 'business',
    users: ['accounting', 'management'],
  },

  COMPLIANCE_REVIEW_WORKFLOW: {
    id: 'compliance_review_workflow',
    name: 'Compliance Review Workflow',
    description: 'Compliance document review and approval',
    steps: [
      'compliance_document_submitted',
      'compliance_reviewed',
      'compliance_approved',
      'compliance_documentation_complete',
    ],
    category: 'business',
    users: ['compliance', 'management'],
  },

  LOAD_ASSIGNMENT_WORKFLOW: {
    id: 'load_assignment_workflow',
    name: 'Load Assignment Workflow',
    description: 'Load creation to carrier assignment',
    steps: [
      'load_created',
      'load_assigned_to_carrier',
      'carrier_confirmed_assignment',
      'load_authorized_for_pickup',
      'load_in_transit',
      'load_delivered',
    ],
    category: 'business',
    users: ['dispatcher', 'broker'],
  },

  // ONBOARDING WORKFLOWS
  CARRIER_ONBOARDING_WORKFLOW: {
    id: 'carrier_onboarding_workflow',
    name: 'Carrier Onboarding Workflow',
    description: 'Carrier application to portal access',
    steps: [
      'carrier_application_submitted',
      'carrier_credentials_verified',
      'carrier_insurance_verified',
      'carrier_contract_signed',
      'carrier_portal_access_granted',
      'carrier_onboarding_complete',
    ],
    category: 'onboarding',
    users: ['management', 'compliance'],
  },

  SHIPPER_ONBOARDING_WORKFLOW: {
    id: 'shipper_onboarding_workflow',
    name: 'Shipper Onboarding Workflow',
    description: 'Shipper application to portal access',
    steps: [
      'shipper_application_submitted',
      'shipper_credit_verified',
      'shipper_contract_signed',
      'shipper_portal_access_granted',
      'shipper_onboarding_complete',
    ],
    category: 'onboarding',
    users: ['broker', 'management'],
  },

  // DISPATCHER FEE WORKFLOW
  DISPATCHER_FEE_WORKFLOW: {
    id: 'dispatcher_fee_workflow',
    name: 'Dispatcher Fee Workflow',
    description: 'Dispatcher fee generation and approval',
    steps: [
      'fee_generated',
      'fee_submitted_for_approval',
      'fee_reviewed_by_management',
      'fee_approved',
      'fee_sent_to_carrier',
      'payment_processed',
    ],
    category: 'business',
    users: ['dispatcher', 'management'],
  },

  // DOCUMENT EDITING WORKFLOW
  DOCUMENT_EDITING_WORKFLOW: {
    id: 'document_editing_workflow',
    name: 'Document Editing Workflow',
    description: 'Document creation, editing, and approval',
    steps: [
      'document_created',
      'document_edited',
      'document_reviewed',
      'document_approved',
      'document_published',
    ],
    category: 'business',
    users: ['broker', 'management', 'dispatcher'],
  },
};

export const WORKFLOW_CATEGORIES = {
  OPERATIONAL: 'operational',
  BUSINESS: 'business',
  ONBOARDING: 'onboarding',
};

export const WORKFLOW_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  OVERRIDE_REQUIRED: 'override_required',
};

export const WORKFLOW_USERS = {
  DRIVER: 'driver',
  DISPATCHER: 'dispatcher',
  BROKER: 'broker',
  MANAGEMENT: 'management',
  ACCOUNTING: 'accounting',
  COMPLIANCE: 'compliance',
};

// Helper functions for workflow management
export const getWorkflowsByCategory = (category: string) => {
  return Object.values(FLEETFLOW_WORKFLOWS).filter(
    (workflow) => workflow.category === category
  );
};

export const getWorkflowsByUser = (userType: string) => {
  return Object.values(FLEETFLOW_WORKFLOWS).filter((workflow) =>
    workflow.users.includes(userType)
  );
};

export const getWorkflowById = (id: string) => {
  return Object.values(FLEETFLOW_WORKFLOWS).find(
    (workflow) => workflow.id === id
  );
};
