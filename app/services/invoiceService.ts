// Invoice Management Service
// Handles invoice creation, storage, and retrieval

export interface InvoiceData {
  id: string;
  loadId: string;
  loadBoardNumber?: string; // Phone reference - the 6-digit number customers call about (e.g., "100001")
  bolNumber?: string; // BOL number for document tracking (e.g., "BOL-MJ25015-001")
  departmentCode?: string; // Department code: DC (dispatcher), BB (broker)
  userInitials?: string; // User initials for accountability (e.g., "SJ")
  dispatcherName?: string; // Name of the dispatcher handling the load
  dispatcherUserIdentifier?: string; // Dispatcher user identifier (e.g., "SJ-DC-2024014")
  dispatcherCompanyInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
  }; // Dispatcher/tenant company information
  loadIdentifier?: string; // Added for EDI compliance
  shipperId?: string; // Added for shipper traceability
  carrierName: string;
  carrierAddress?: string;
  carrierEmail?: string;
  carrierPhone?: string;
  loadAmount: number;
  dispatchFee: number;
  feePercentage: number;
  invoiceDate: string;
  dueDate: string;
  status:
    | 'Pending'
    | 'Sent'
    | 'Paid'
    | 'Overdue'
    | 'pending_management_review'
    | 'approved'
    | 'rejected'
    | 'auto_approved';
  managementSubmissionId?: string;
  approvedAt?: string;
  approvedBy?: string;
  loadDetails?: {
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    equipment: string;
    weight?: string;
    miles?: number;
  };
  paymentTerms?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock invoice storage - in production this would be a real database
let INVOICES_DB: InvoiceData[] = [];

// Load invoices from localStorage on startup
const loadInvoicesFromStorage = (): InvoiceData[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('fleetflow_invoices');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored invoices:', error);
        return [];
      }
    }
  }
  return [];
};

// Save invoices to localStorage
const saveInvoicesToStorage = (invoices: InvoiceData[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('fleetflow_invoices', JSON.stringify(invoices));
  }
};

// Initialize invoices from storage
INVOICES_DB = loadInvoicesFromStorage();

// Create a new invoice
export const createInvoice = (
  invoiceData: Omit<InvoiceData, 'createdAt' | 'updatedAt'>
): InvoiceData => {
  const now = new Date().toISOString();
  const invoice: InvoiceData = {
    ...invoiceData,
    createdAt: now,
    updatedAt: now,
  };

  INVOICES_DB.push(invoice);
  saveInvoicesToStorage(INVOICES_DB);

  return invoice;
};

// Get all invoices
export const getAllInvoices = (): InvoiceData[] => {
  return [...INVOICES_DB];
};

// Get invoices by load ID
export const getInvoicesByLoadId = (loadId: string): InvoiceData[] => {
  return INVOICES_DB.filter((invoice) => invoice.loadId === loadId);
};

// Get invoice by ID
export const getInvoiceById = (invoiceId: string): InvoiceData | null => {
  return INVOICES_DB.find((invoice) => invoice.id === invoiceId) || null;
};

// Update invoice status
export const updateInvoiceStatus = (
  invoiceId: string,
  status: InvoiceData['status']
): boolean => {
  const invoiceIndex = INVOICES_DB.findIndex(
    (invoice) => invoice.id === invoiceId
  );
  if (invoiceIndex === -1) return false;

  INVOICES_DB[invoiceIndex] = {
    ...INVOICES_DB[invoiceIndex],
    status,
    updatedAt: new Date().toISOString(),
  };

  saveInvoicesToStorage(INVOICES_DB);
  return true;
};

// Update invoice
export const updateInvoice = (
  invoiceId: string,
  updates: Partial<Omit<InvoiceData, 'id' | 'createdAt'>>
): InvoiceData | null => {
  const invoiceIndex = INVOICES_DB.findIndex(
    (invoice) => invoice.id === invoiceId
  );
  if (invoiceIndex === -1) return null;

  INVOICES_DB[invoiceIndex] = {
    ...INVOICES_DB[invoiceIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveInvoicesToStorage(INVOICES_DB);
  return INVOICES_DB[invoiceIndex];
};

// Delete invoice
export const deleteInvoice = (invoiceId: string): boolean => {
  const invoiceIndex = INVOICES_DB.findIndex(
    (invoice) => invoice.id === invoiceId
  );
  if (invoiceIndex === -1) return false;

  INVOICES_DB.splice(invoiceIndex, 1);
  saveInvoicesToStorage(INVOICES_DB);
  return true;
};

// Get invoice statistics
export const getInvoiceStats = () => {
  const total = INVOICES_DB.length;
  const pending = INVOICES_DB.filter((i) => i.status === 'Pending').length;
  const sent = INVOICES_DB.filter((i) => i.status === 'Sent').length;
  const paid = INVOICES_DB.filter((i) => i.status === 'Paid').length;
  const overdue = INVOICES_DB.filter((i) => i.status === 'Overdue').length;

  const totalAmount = INVOICES_DB.reduce(
    (sum, invoice) => sum + invoice.dispatchFee,
    0
  );
  const pendingAmount = INVOICES_DB.filter(
    (i) => i.status === 'Pending' || i.status === 'Sent'
  ).reduce((sum, invoice) => sum + invoice.dispatchFee, 0);
  const paidAmount = INVOICES_DB.filter((i) => i.status === 'Paid').reduce(
    (sum, invoice) => sum + invoice.dispatchFee,
    0
  );

  return {
    counts: { total, pending, sent, paid, overdue },
    amounts: { total: totalAmount, pending: pendingAmount, paid: paidAmount },
  };
};

// Check if load has existing invoices
export const hasExistingInvoice = (loadId: string): boolean => {
  return INVOICES_DB.some((invoice) => invoice.loadId === loadId);
};

// Global ID registry to ensure absolute uniqueness
const globalIdRegistry = new Set<string>();

// Clear registry on app reload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    globalIdRegistry.clear();
  });
}

export function generateInvoiceNumber(
  loadId: string,
  departmentCode: string,
  userInitials: string
): string {
  // Extract core ID from load ID (remove non-digits and take meaningful part)
  const coreId = loadId.replace(/\D/g, '').slice(-6) || '000001';

  // Generate unique ID with multiple attempts
  let attempts = 0;
  const maxAttempts = 1000;

  while (attempts < maxAttempts) {
    // Add high-precision timestamp with microsecond precision
    const now = Date.now();
    const microseconds = performance
      .now()
      .toString()
      .replace('.', '')
      .slice(-6);
    const timestamp = `${now}${microseconds}`;

    // Add multiple random components for maximum uniqueness
    const randomComponent1 = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    const randomComponent2 = Math.random()
      .toString(16)
      .substring(2, 6)
      .toUpperCase();
    const randomComponent3 = (Math.random() * 9999).toFixed(0).padStart(4, '0');

    // Create unique ID
    const uniqueId = `INV-${departmentCode}-${userInitials}-${coreId}-${timestamp}-${randomComponent1}${randomComponent2}${randomComponent3}-${attempts.toString().padStart(3, '0')}`;

    // Check against global registry and localStorage
    try {
      const existingInvoices = JSON.parse(
        localStorage.getItem('invoices') || '[]'
      );
      const existingIds = new Set(existingInvoices.map((inv: any) => inv.id));

      if (!globalIdRegistry.has(uniqueId) && !existingIds.has(uniqueId)) {
        globalIdRegistry.add(uniqueId);
        console.log(`✅ Generated unique invoice ID: ${uniqueId}`);
        return uniqueId;
      }
    } catch (error) {
      console.warn('Error checking invoice uniqueness:', error);
    }

    attempts++;

    // Add small delay to ensure timestamp changes
    const start = Date.now();
    while (Date.now() - start < 1) {
      // Brief pause
    }
  }

  // Fallback: use timestamp + random + current time for absolute uniqueness
  const fallbackId = `INV-FALLBACK-${Date.now()}-${Math.random().toString(36).substring(2)}-${performance.now().toString().replace('.', '')}`;
  globalIdRegistry.add(fallbackId);
  console.warn(
    `⚠️ Used fallback ID after ${maxAttempts} attempts: ${fallbackId}`
  );
  return fallbackId;
}

// Get department code from user role
export const getDepartmentCode = (userRole: string): string => {
  switch (userRole?.toLowerCase()) {
    case 'dispatcher':
      return 'DC';
    case 'broker':
      return 'BB';
    case 'admin':
      return 'ADM';
    case 'manager':
      return 'MGR';
    default:
      return 'DC'; // Default to dispatcher
  }
};

// Extract user initials from name
export const getUserInitials = (userName: string): string => {
  if (!userName) return 'XX';

  return userName
    .split(' ')
    .map((name) => name.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2); // Limit to 2 characters
};

// Pre-populate global registry with existing IDs
export function initializeGlobalRegistry(): void {
  try {
    const existingInvoices = JSON.parse(
      localStorage.getItem('invoices') || '[]'
    );
    existingInvoices.forEach((invoice: any) => {
      if (invoice.id) {
        globalIdRegistry.add(invoice.id);
      }
    });
    console.log(
      `🔧 Initialized global registry with ${globalIdRegistry.size} existing invoice IDs`
    );
  } catch (error) {
    console.error('Error initializing global registry:', error);
  }
}

// Clean up duplicate invoices from localStorage
export function cleanupDuplicateInvoices(): void {
  try {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const uniqueInvoices: any[] = [];
    const seenIds = new Set<string>();

    console.log(`Starting cleanup: ${invoices.length} invoices found`);

    invoices.forEach((invoice: any, index: number) => {
      if (!seenIds.has(invoice.id)) {
        seenIds.add(invoice.id);
        uniqueInvoices.push(invoice);
      } else {
        console.warn(
          `Removing duplicate invoice at index ${index}:`,
          invoice.id
        );
      }
    });

    if (uniqueInvoices.length !== invoices.length) {
      localStorage.setItem('invoices', JSON.stringify(uniqueInvoices));
      console.log(
        `✅ Cleaned up ${invoices.length - uniqueInvoices.length} duplicate invoices. ${uniqueInvoices.length} unique invoices remaining.`
      );
    } else {
      console.log('✅ No duplicate invoices found');
    }
  } catch (error) {
    console.error('Error cleaning up duplicate invoices:', error);
  }
}

// Debug utility: Clear all invoices from localStorage
export function clearAllInvoices(): void {
  try {
    localStorage.removeItem('invoices');
    localStorage.removeItem('requireManagementApproval');
    console.log('🗑️ All invoices and settings cleared from localStorage');
  } catch (error) {
    console.error('Error clearing invoices:', error);
  }
}

// Debug utility: Reset invoice system completely
export function resetInvoiceSystem(): void {
  clearAllInvoices();
  globalIdRegistry.clear();
  console.log(
    '🔄 Invoice system completely reset - all IDs cleared from registry'
  );
}

// Ultimate cleanup: Remove all duplicates and ensure uniqueness
export function ultimateCleanup(): any[] {
  try {
    // Clear global registry
    globalIdRegistry.clear();

    // Get all invoices
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const uniqueInvoices: any[] = [];
    const seenIds = new Set<string>();

    console.log(`🧹 Starting ultimate cleanup of ${invoices.length} invoices`);

    invoices.forEach((invoice: any, index: number) => {
      if (!invoice.id) {
        // Generate new ID for invoices without IDs
        const newId = `INV-FIXED-${Date.now()}-${index}-${Math.random().toString(36).substring(2)}`;
        invoice.id = newId;
        console.warn(
          `Generated new ID for invoice at index ${index}: ${newId}`
        );
      }

      if (!seenIds.has(invoice.id)) {
        seenIds.add(invoice.id);
        globalIdRegistry.add(invoice.id);
        uniqueInvoices.push(invoice);
      } else {
        // Force regenerate ID for duplicates
        const newId = `${invoice.id}-FIXED-${Date.now()}-${index}-${Math.random().toString(36).substring(2)}`;
        console.warn(
          `Force fixing duplicate invoice ID: ${invoice.id} -> ${newId}`
        );
        invoice.id = newId;
        seenIds.add(newId);
        globalIdRegistry.add(newId);
        uniqueInvoices.push(invoice);
      }
    });

    // Save cleaned invoices
    localStorage.setItem('invoices', JSON.stringify(uniqueInvoices));

    console.log(
      `✅ Ultimate cleanup complete: ${uniqueInvoices.length} unique invoices, ${globalIdRegistry.size} IDs in registry`
    );
    return uniqueInvoices;
  } catch (error) {
    console.error('Error in ultimate cleanup:', error);
    return [];
  }
}

// Force cleanup duplicate invoices synchronously before rendering
export function forceCleanupDuplicates(): any[] {
  try {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const uniqueInvoices: any[] = [];
    const seenIds = new Set<string>();

    invoices.forEach((invoice: any, index: number) => {
      if (!seenIds.has(invoice.id)) {
        seenIds.add(invoice.id);
        uniqueInvoices.push(invoice);
      } else {
        // Force regenerate ID for duplicates
        const newId = `${invoice.id}-FIXED-${Date.now()}-${index}`;
        console.warn(
          `Force fixing duplicate invoice ID: ${invoice.id} -> ${newId}`
        );
        uniqueInvoices.push({
          ...invoice,
          id: newId,
        });
        seenIds.add(newId);
      }
    });

    if (
      uniqueInvoices.length !== invoices.length ||
      uniqueInvoices.some((inv, idx) => inv.id !== invoices[idx]?.id)
    ) {
      localStorage.setItem('invoices', JSON.stringify(uniqueInvoices));
      console.log(
        `🔧 Force-fixed invoice duplicates: ${uniqueInvoices.length} invoices processed`
      );
    }

    return uniqueInvoices;
  } catch (error) {
    console.error('Error in force cleanup:', error);
    return [];
  }
}

// Ensure React key uniqueness for invoice rendering
export function ensureUniqueKey(invoice: any, index: number): string {
  if (!invoice || !invoice.id) {
    return `invoice-fallback-${Date.now()}-${index}-${Math.random().toString(36).substring(2)}`;
  }

  // Add index as additional uniqueness guarantee
  return `${invoice.id}-idx-${index}`;
}
