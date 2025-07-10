// Invoice Management Service
// Handles invoice creation, storage, and retrieval

export interface InvoiceData {
  id: string;
  loadId: string;
  carrierName: string;
  carrierAddress?: string;
  carrierEmail?: string;
  carrierPhone?: string;
  loadAmount: number;
  dispatchFee: number;
  feePercentage: number;
  invoiceDate: string;
  dueDate: string;
  status: 'Pending' | 'Sent' | 'Paid' | 'Overdue';
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
export const createInvoice = (invoiceData: Omit<InvoiceData, 'createdAt' | 'updatedAt'>): InvoiceData => {
  const now = new Date().toISOString();
  const invoice: InvoiceData = {
    ...invoiceData,
    createdAt: now,
    updatedAt: now
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
  return INVOICES_DB.filter(invoice => invoice.loadId === loadId);
};

// Get invoice by ID
export const getInvoiceById = (invoiceId: string): InvoiceData | null => {
  return INVOICES_DB.find(invoice => invoice.id === invoiceId) || null;
};

// Update invoice status
export const updateInvoiceStatus = (invoiceId: string, status: InvoiceData['status']): boolean => {
  const invoiceIndex = INVOICES_DB.findIndex(invoice => invoice.id === invoiceId);
  if (invoiceIndex === -1) return false;
  
  INVOICES_DB[invoiceIndex] = {
    ...INVOICES_DB[invoiceIndex],
    status,
    updatedAt: new Date().toISOString()
  };
  
  saveInvoicesToStorage(INVOICES_DB);
  return true;
};

// Update invoice
export const updateInvoice = (invoiceId: string, updates: Partial<Omit<InvoiceData, 'id' | 'createdAt'>>): InvoiceData | null => {
  const invoiceIndex = INVOICES_DB.findIndex(invoice => invoice.id === invoiceId);
  if (invoiceIndex === -1) return null;
  
  INVOICES_DB[invoiceIndex] = {
    ...INVOICES_DB[invoiceIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  saveInvoicesToStorage(INVOICES_DB);
  return INVOICES_DB[invoiceIndex];
};

// Delete invoice
export const deleteInvoice = (invoiceId: string): boolean => {
  const invoiceIndex = INVOICES_DB.findIndex(invoice => invoice.id === invoiceId);
  if (invoiceIndex === -1) return false;
  
  INVOICES_DB.splice(invoiceIndex, 1);
  saveInvoicesToStorage(INVOICES_DB);
  return true;
};

// Get invoice statistics
export const getInvoiceStats = () => {
  const total = INVOICES_DB.length;
  const pending = INVOICES_DB.filter(i => i.status === 'Pending').length;
  const sent = INVOICES_DB.filter(i => i.status === 'Sent').length;
  const paid = INVOICES_DB.filter(i => i.status === 'Paid').length;
  const overdue = INVOICES_DB.filter(i => i.status === 'Overdue').length;
  
  const totalAmount = INVOICES_DB.reduce((sum, invoice) => sum + invoice.dispatchFee, 0);
  const pendingAmount = INVOICES_DB
    .filter(i => i.status === 'Pending' || i.status === 'Sent')
    .reduce((sum, invoice) => sum + invoice.dispatchFee, 0);
  const paidAmount = INVOICES_DB
    .filter(i => i.status === 'Paid')
    .reduce((sum, invoice) => sum + invoice.dispatchFee, 0);
  
  return {
    counts: { total, pending, sent, paid, overdue },
    amounts: { total: totalAmount, pending: pendingAmount, paid: paidAmount }
  };
};

// Check if load has existing invoices
export const hasExistingInvoice = (loadId: string): boolean => {
  return INVOICES_DB.some(invoice => invoice.loadId === loadId);
};
