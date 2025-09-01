// Shipper Management Service - Centralized shipper operations with CORRECT 9-CHARACTER IDENTIFIERS
import { logger } from '../utils/logger';
import { ShipperInfo } from './loadService';

// Generate proper 9-character freight industry identifiers for shippers
const generateShipperIdentifier = (
  companyName: string,
  businessType: string
): string => {
  // Map business types to commodity codes
  const commodityCodes: Record<string, string> = {
    Manufacturing: '070', // Manufacturing/Steel products
    Automotive: '065', // Auto parts
    'Food Processing': '040', // Food products
    Technology: '085', // Electronics
    'Retail Distribution': '050', // General merchandise
    Construction: '075', // Construction materials
    'Chemical Manufacturing': '080', // Chemicals
    Pharmaceutical: '090', // Pharmaceuticals
  };

  const commodityCode = commodityCodes[businessType] || '070';

  // Extract company initials (up to 3 characters)
  const initials = companyName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .substring(0, 3)
    .toUpperCase();

  return `${initials}-204-${commodityCode}`; // 9-character format: ABC-204-070
};

// Mock shipper database - NOW USING CORRECT 9-CHARACTER IDENTIFIERS
const SHIPPERS_DB: ShipperInfo[] = [
  {
    id: 'ABC-204-070', // ABC Manufacturing Corp - Manufacturing
    companyName: 'ABC Manufacturing Corp',
    contactName: 'John Smith',
    email: 'john.smith@abcmfg.com',
    phone: '+1 (555) 123-4567',
    address: '123 Industrial Blvd',
    city: 'Atlanta',
    state: 'GA',
    zipCode: '30309',
    businessType: 'Manufacturing',
    paymentTerms: 'Net 30',
    creditRating: 'A+',
    specialInstructions: 'Loading dock available 6 AM - 6 PM weekdays',
  },
  {
    id: 'RDI-204-050', // Retail Distribution Inc - Retail Distribution
    companyName: 'Retail Distribution Inc',
    contactName: 'Sarah Johnson',
    email: 'sarah.johnson@retaildist.com',
    phone: '+1 (555) 234-5678',
    address: '456 Commerce Street',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    businessType: 'Retail Distribution',
    paymentTerms: 'Net 15',
    creditRating: 'A',
    specialInstructions: 'Requires appointment for pickup',
  },
  {
    id: 'TSL-204-085', // Tech Solutions LLC - Technology
    companyName: 'Tech Solutions LLC',
    contactName: 'Mike Davis',
    email: 'mike.davis@techsolutions.com',
    phone: '+1 (555) 345-6789',
    address: '789 Technology Drive',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    businessType: 'Technology',
    paymentTerms: 'Net 30',
    creditRating: 'A-',
    specialInstructions: 'Fragile electronics - handle with care',
  },
  {
    id: 'FPC-204-040', // Food Processing Co - Food Processing
    companyName: 'Food Processing Co',
    contactName: 'Lisa Wilson',
    email: 'lisa.wilson@foodprocessing.com',
    phone: '+1 (555) 456-7890',
    address: '321 Processing Plant Rd',
    city: 'Phoenix',
    state: 'AZ',
    zipCode: '85001',
    businessType: 'Food Processing',
    paymentTerms: 'Net 21',
    creditRating: 'B+',
    specialInstructions: 'Temperature controlled required - keep frozen',
  },
  {
    id: 'APD-204-065', // Automotive Parts Direct - Automotive
    companyName: 'Automotive Parts Direct',
    contactName: 'Robert Brown',
    email: 'robert.brown@autoparts.com',
    phone: '+1 (555) 567-8901',
    address: '654 Auto Parts Way',
    city: 'Detroit',
    state: 'MI',
    zipCode: '48201',
    businessType: 'Automotive',
    paymentTerms: 'Net 45',
    creditRating: 'A',
    specialInstructions: 'Heavy parts - ensure proper loading equipment',
  },
];

// Service functions
export const shipperService = {
  // Get all shippers
  getAllShippers: (): ShipperInfo[] => {
    return [...SHIPPERS_DB];
  },

  // Get shipper by ID
  getShipperById: (id: string): ShipperInfo | null => {
    return SHIPPERS_DB.find((shipper) => shipper.id === id) || null;
  },

  // Search shippers by company name
  searchShippers: (searchTerm: string): ShipperInfo[] => {
    const term = searchTerm.toLowerCase();
    return SHIPPERS_DB.filter(
      (shipper) =>
        shipper.companyName.toLowerCase().includes(term) ||
        shipper.contactName.toLowerCase().includes(term) ||
        shipper.city.toLowerCase().includes(term) ||
        shipper.state.toLowerCase().includes(term)
    );
  },

  // Add new shipper - NOW GENERATES PROPER 9-CHARACTER ID
  addShipper: (shipperData: Omit<ShipperInfo, 'id'>): ShipperInfo => {
    const newShipper: ShipperInfo = {
      id: generateShipperIdentifier(
        shipperData.companyName,
        shipperData.businessType || 'Manufacturing'
      ),
      ...shipperData,
    };
    SHIPPERS_DB.push(newShipper);
    return newShipper;
  },

  // Update shipper
  updateShipper: (
    id: string,
    updates: Partial<ShipperInfo>
  ): ShipperInfo | null => {
    const index = SHIPPERS_DB.findIndex((shipper) => shipper.id === id);
    if (index === -1) return null;

    SHIPPERS_DB[index] = { ...SHIPPERS_DB[index], ...updates };
    return SHIPPERS_DB[index];
  },

  // Delete shipper
  deleteShipper: (id: string): boolean => {
    const index = SHIPPERS_DB.findIndex((shipper) => shipper.id === id);
    if (index === -1) return false;

    SHIPPERS_DB.splice(index, 1);
    return true;
  },

  // Get shippers by broker (if needed for broker-specific relationships)
  getShippersByBroker: (brokerId: string): ShipperInfo[] => {
    // In a real implementation, this would filter by broker relationships
    // For now, return all shippers as available to all brokers
    return [...SHIPPERS_DB];
  },
};

// ========================================
// 🔐 SHIPPER PORTAL AUTHENTICATION SYSTEM
// ========================================

export interface ShipperPortalCredentials {
  shipperId: string;
  username: string;
  password: string; // In production, this would be hashed
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  loginAttempts: number;
  lockedUntil?: string;
  resetToken?: string;
  resetTokenExpiry?: string;
}

// Mock portal credentials database - UPDATED WITH CORRECT 9-CHARACTER IDs
const SHIPPER_PORTAL_CREDENTIALS: ShipperPortalCredentials[] = [
  {
    shipperId: 'ABC-204-070', // ABC Manufacturing Corp
    username: 'abcmfg',
    password: 'temp123', // In production: bcrypt.hash()
    isActive: true,
    createdAt: '2024-12-30T10:00:00Z',
    lastLogin: '2024-12-30T14:30:00Z',
    loginAttempts: 0,
  },
  {
    shipperId: 'RDI-204-050', // Retail Distribution Inc
    username: 'retaildist',
    password: 'temp456',
    isActive: true,
    createdAt: '2024-12-30T11:00:00Z',
    loginAttempts: 0,
  },
  {
    shipperId: 'TSL-204-085', // Tech Solutions LLC
    username: 'techsolutions',
    password: 'temp789',
    isActive: true,
    createdAt: '2024-12-30T12:00:00Z',
    loginAttempts: 0,
  },
];

// Generate username from company name
const generateUsername = (companyName: string): string => {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 20);
};

// Generate temporary password
const generateTempPassword = (): string => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Create portal credentials for new shipper
const createShipperPortalCredentials = (
  shipper: ShipperInfo
): ShipperPortalCredentials => {
  const username = generateUsername(shipper.companyName);
  const tempPassword = generateTempPassword();

  const credentials: ShipperPortalCredentials = {
    shipperId: shipper.id,
    username,
    password: tempPassword, // In production: await bcrypt.hash(tempPassword, 10)
    isActive: true,
    createdAt: new Date().toISOString(),
    loginAttempts: 0,
  };

  SHIPPER_PORTAL_CREDENTIALS.push(credentials);

  // Send welcome email with login credentials
  sendWelcomeEmail(shipper, credentials);

  return credentials;
};

// Send welcome email to shipper
const sendWelcomeEmail = (
  shipper: ShipperInfo,
  credentials: ShipperPortalCredentials
) => {
  // In production, integrate with email service (SendGrid, AWS SES, etc.)
  logger.info(
    'Welcome email sent to shipper',
    {
      shipperEmail: shipper.email,
      companyName: shipper.companyName,
    },
    'ShipperService'
  );

  // Email template logged for development
  const emailContent = `🚚 Welcome to FleetFlow Shipper Portal!

  Dear ${shipper.contactName},

  Your shipper portal account has been created successfully!

  Portal Login Details:
  🌐 URL: https://app.fleetflow.com/vendor-login
  👤 Username: ${credentials.username}
  🔐 Temporary Password: ${credentials.password}

  Portal Features:
  📋 Track all your loads in real-time
  🛣️ View delivery status and ETAs
  📞 Direct contact with your broker team
  📊 Performance metrics and reporting

  Please log in and change your password on first use.

  Best regards,
  FleetFlow Team`;

  // In production, send actual email using emailContent
};

// ========================================
// 🎯 ENHANCED INVITATION-BASED WORKFLOW
// ========================================

export interface ShipperInvitation {
  invitationId: string;
  shipperId: string;
  email: string;
  invitationToken: string;
  expiresAt: string;
  isUsed: boolean;
  sentAt: string;
  invitedBy: string;
  setupCompletedAt?: string;
}

// Mock invitation database
const SHIPPER_INVITATIONS: ShipperInvitation[] = [];

// Generate secure invitation token
const generateSecureToken = (): string => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Create shipper invitation (instead of auto-credentials)
const createShipperInvitation = (
  shipper: ShipperInfo,
  invitedBy: string = 'system'
): ShipperInvitation => {
  const invitationToken = generateSecureToken();
  const invitation: ShipperInvitation = {
    invitationId: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    shipperId: shipper.id,
    email: shipper.email,
    invitationToken,
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours
    isUsed: false,
    sentAt: new Date().toISOString(),
    invitedBy,
  };

  SHIPPER_INVITATIONS.push(invitation);

  // Create portal credentials record (but leave login fields empty)
  const portalCredentials: ShipperPortalCredentials = {
    shipperId: shipper.id,
    username: '', // Will be set during self-registration
    password: '', // Will be set during self-registration
    isActive: false, // Inactive until setup complete
    createdAt: new Date().toISOString(),
    loginAttempts: 0,
    // NEW: Invitation tracking fields
    invitationSent: true,
    invitationToken,
    setupCompleted: false,
  };

  SHIPPER_PORTAL_CREDENTIALS.push(portalCredentials);

  // Send invitation email
  sendInvitationEmail(shipper, invitation);

  // Send notification to admin who created the shipper
  sendAdminNotification(invitedBy, shipper, invitation);

  return invitation;
};

// Send invitation email to shipper
const sendInvitationEmail = (
  shipper: ShipperInfo,
  invitation: ShipperInvitation
) => {
  console.info(`📧 Invitation Email Sent to ${shipper.email}:

  🚚 FleetFlow Vendor Portal - Account Setup Invitation

  Dear ${shipper.contactName},

  You've been invited to set up your FleetFlow Vendor Portal account for ${shipper.companyName}.

  🔗 Complete Your Account Setup:
  https://app.fleetflow.com/vendor-setup?token=${invitation.invitationToken}

  This link expires in 48 hours.

  Portal Benefits:
  ✅ Real-time load tracking
  ✅ Direct broker communication
  ✅ Performance analytics
  ✅ Document management

  Create your own secure username and password to get started.

  Questions? Contact your broker team.

  Best regards,
  FleetFlow Team
  `);
};

// Send notification to admin about invitation sent
const sendAdminNotification = (
  adminId: string,
  shipper: ShipperInfo,
  invitation: ShipperInvitation
) => {
  // In production, this would integrate with the notification system
  console.info(`🔔 Admin Notification to ${adminId}:

  📧 Vendor Portal Invitation Sent

  Invitation sent to ${shipper.companyName} (${shipper.email})
  Status: Pending Setup
  Expires: ${new Date(invitation.expiresAt).toLocaleDateString()}

  The shipper will receive an email to create their own login credentials.
  You'll be notified when they complete their account setup.
  `);
};

// Complete shipper self-registration
const completeShipperSetup = (
  invitationToken: string,
  setupData: {
    username: string;
    password: string;
    confirmPassword: string;
  }
): { success: boolean; message: string; shipperId?: string } => {
  // Find invitation
  const invitation = SHIPPER_INVITATIONS.find(
    (inv) => inv.invitationToken === invitationToken && !inv.isUsed
  );

  if (!invitation) {
    return { success: false, message: 'Invalid or expired invitation token' };
  }

  if (new Date(invitation.expiresAt) < new Date()) {
    return { success: false, message: 'Invitation has expired' };
  }

  if (setupData.password !== setupData.confirmPassword) {
    return { success: false, message: 'Passwords do not match' };
  }

  // Update portal credentials
  const credentialsIndex = SHIPPER_PORTAL_CREDENTIALS.findIndex(
    (cred) => cred.shipperId === invitation.shipperId
  );

  if (credentialsIndex === -1) {
    return { success: false, message: 'Portal credentials not found' };
  }

  // Complete the setup
  SHIPPER_PORTAL_CREDENTIALS[credentialsIndex] = {
    ...SHIPPER_PORTAL_CREDENTIALS[credentialsIndex],
    username: setupData.username,
    password: setupData.password, // In production: await bcrypt.hash(password, 10)
    isActive: true,
    setupCompleted: true,
    invitationToken: undefined, // Clear token
  };

  // Mark invitation as used
  invitation.isUsed = true;
  invitation.setupCompletedAt = new Date().toISOString();

  // Send completion notifications
  const shipper = shipperService.getShipperById(invitation.shipperId);
  if (shipper) {
    sendSetupCompletionNotifications(shipper, invitation);
  }

  return {
    success: true,
    message: 'Account setup completed successfully!',
    shipperId: invitation.shipperId,
  };
};

// Send notifications when setup is completed
const sendSetupCompletionNotifications = (
  shipper: ShipperInfo,
  invitation: ShipperInvitation
) => {
  // Email to shipper
  console.info(`📧 Setup Confirmation Email to ${shipper.email}:

  🎉 FleetFlow Vendor Portal - Account Activated!

  Dear ${shipper.contactName},

  Your FleetFlow Vendor Portal account has been successfully activated!

  🌐 Login at: https://app.fleetflow.com/vendor-login
  👤 Username: [Your chosen username]

  You can now:
  ✅ Track your loads in real-time
  ✅ Communicate directly with your broker team
  ✅ Access performance analytics
  ✅ Manage your documents

  Welcome to FleetFlow!

  Best regards,
  FleetFlow Team
  `);

  // Notification to admin who sent invitation
  console.info(`🔔 Admin Notification to ${invitation.invitedBy}:

  ✅ Vendor Portal Setup Completed

  ${shipper.companyName} has completed their portal setup!

  Shipper: ${shipper.contactName} (${shipper.email})
  Company: ${shipper.companyName}
  Setup Completed: ${new Date().toLocaleDateString()}
  Status: Active Portal Access

  The shipper can now access their vendor portal with their chosen credentials.
  `);
};

// Extended shipper service with invitation functionality
export const extendedShipperService = {
  ...shipperService,

  // Add shipper with invitation-based portal setup
  addShipperWithInvitation: (
    shipperData: Omit<ShipperInfo, 'id'>,
    invitedBy: string = 'system'
  ): { shipper: ShipperInfo; invitation: ShipperInvitation } => {
    const shipper = shipperService.addShipper(shipperData);
    const invitation = createShipperInvitation(shipper, invitedBy);

    return { shipper, invitation };
  },

  // Legacy method for backward compatibility
  addShipperWithPortal: (
    shipperData: Omit<ShipperInfo, 'id'>
  ): { shipper: ShipperInfo; credentials: ShipperPortalCredentials } => {
    const shipper = shipperService.addShipper(shipperData);
    const credentials = createShipperPortalCredentials(shipper);

    return { shipper, credentials };
  },

  // Complete shipper self-registration
  completeShipperSetup,

  // Get shipper invitation status
  getShipperInvitation: (shipperId: string): ShipperInvitation | null => {
    return (
      SHIPPER_INVITATIONS.find((inv) => inv.shipperId === shipperId) || null
    );
  },

  // Get all pending invitations (for admin dashboard)
  getPendingInvitations: (): ShipperInvitation[] => {
    return SHIPPER_INVITATIONS.filter(
      (inv) => !inv.isUsed && new Date(inv.expiresAt) > new Date()
    );
  },

  // Resend invitation
  resendInvitation: (
    shipperId: string,
    invitedBy: string
  ): { success: boolean; message: string } => {
    const shipper = shipperService.getShipperById(shipperId);
    if (!shipper) {
      return { success: false, message: 'Shipper not found' };
    }

    // Find existing invitation
    const existingInvitation = SHIPPER_INVITATIONS.find(
      (inv) => inv.shipperId === shipperId
    );
    if (existingInvitation && !existingInvitation.isUsed) {
      // Update expiry and resend
      existingInvitation.expiresAt = new Date(
        Date.now() + 48 * 60 * 60 * 1000
      ).toISOString();
      existingInvitation.sentAt = new Date().toISOString();
      sendInvitationEmail(shipper, existingInvitation);
      return { success: true, message: 'Invitation resent successfully' };
    }

    // Create new invitation if previous was used or doesn't exist
    const newInvitation = createShipperInvitation(shipper, invitedBy);
    return { success: true, message: 'New invitation sent successfully' };
  },

  // Get shipper portal credentials
  getShipperCredentials: (
    shipperId: string
  ): ShipperPortalCredentials | null => {
    return (
      SHIPPER_PORTAL_CREDENTIALS.find((cred) => cred.shipperId === shipperId) ||
      null
    );
  },

  // Authenticate shipper login
  authenticateShipper: (
    username: string,
    password: string
  ): { success: boolean; shipper?: ShipperInfo; error?: string } => {
    const credentials = SHIPPER_PORTAL_CREDENTIALS.find(
      (cred) => cred.username === username
    );

    if (!credentials) {
      return { success: false, error: 'Invalid username or password' };
    }

    if (!credentials.isActive) {
      return { success: false, error: 'Account is disabled' };
    }

    if (
      credentials.lockedUntil &&
      new Date(credentials.lockedUntil) > new Date()
    ) {
      return { success: false, error: 'Account is temporarily locked' };
    }

    // Check password (in production: await bcrypt.compare(password, credentials.password))
    if (password !== credentials.password) {
      credentials.loginAttempts++;

      // Lock account after 5 failed attempts
      if (credentials.loginAttempts >= 5) {
        credentials.lockedUntil = new Date(
          Date.now() + 30 * 60 * 1000
        ).toISOString(); // 30 minutes
      }

      return { success: false, error: 'Invalid username or password' };
    }

    // Successful login
    credentials.lastLogin = new Date().toISOString();
    credentials.loginAttempts = 0;
    credentials.lockedUntil = undefined;

    const shipper = shipperService.getShipperById(credentials.shipperId);
    return { success: true, shipper: shipper! };
  },

  // Reset password
  resetShipperPassword: (email: string): boolean => {
    const shipper = SHIPPERS_DB.find((s) => s.email === email);
    if (!shipper) return false;

    const credentials = SHIPPER_PORTAL_CREDENTIALS.find(
      (cred) => cred.shipperId === shipper.id
    );
    if (!credentials) return false;

    const resetToken = generateTempPassword() + Date.now();
    const newTempPassword = generateTempPassword();

    credentials.resetToken = resetToken;
    credentials.resetTokenExpiry = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString(); // 24 hours
    credentials.password = newTempPassword;

    // Send reset email
    console.info(`📧 Password Reset Email Sent to ${email}:

    Your FleetFlow Shipper Portal password has been reset.
    New temporary password: ${newTempPassword}
    Please log in and change your password immediately.
    `);

    return true;
  },

  // Change password
  changeShipperPassword: (
    shipperId: string,
    currentPassword: string,
    newPassword: string
  ): boolean => {
    const credentials = SHIPPER_PORTAL_CREDENTIALS.find(
      (cred) => cred.shipperId === shipperId
    );
    if (!credentials) return false;

    if (credentials.password !== currentPassword) return false;

    credentials.password = newPassword; // In production: await bcrypt.hash(newPassword, 10)
    return true;
  },

  // Disable shipper portal access
  disableShipperPortal: (shipperId: string): boolean => {
    const credentials = SHIPPER_PORTAL_CREDENTIALS.find(
      (cred) => cred.shipperId === shipperId
    );
    if (!credentials) return false;

    credentials.isActive = false;
    return true;
  },

  // Enable shipper portal access
  enableShipperPortal: (shipperId: string): boolean => {
    const credentials = SHIPPER_PORTAL_CREDENTIALS.find(
      (cred) => cred.shipperId === shipperId
    );
    if (!credentials) return false;

    credentials.isActive = true;
    credentials.loginAttempts = 0;
    credentials.lockedUntil = undefined;
    return true;
  },
};

export default extendedShipperService;
