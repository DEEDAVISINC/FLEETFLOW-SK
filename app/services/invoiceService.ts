// Invoice Service with AI Review Integration
// Handles invoice creation, storage, and retrieval with AI validation

import { AIReviewService } from './ai-review/AIReviewService';

export interface InvoiceData {
  id: string;
  loadId: string;
  carrierName: string;
  loadAmount: number;
  dispatchFee: number;
  feePercentage: number;
  dispatcherUserIdentifier: string;
  status:
    | 'Pending'
    | 'pending_management_review'
    | 'approved'
    | 'rejected'
    | 'Paid'
    | 'Overdue';
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  aiReviewResult?: {
    isValid: boolean;
    confidence: number;
    errors: string[];
    warnings: string[];
    autoApproved: boolean;
    requiresHumanReview: boolean;
  };
}

const aiReviewService = new AIReviewService();

// Mock invoice storage
const invoices: Map<string, InvoiceData> = new Map();

export function createInvoice(
  invoiceData: Omit<InvoiceData, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): InvoiceData {
  const invoice: InvoiceData = {
    ...invoiceData,
    id: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: 'Pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Perform AI review on invoice creation
  performAIReview(invoice);

  invoices.set(invoice.id, invoice);
  return invoice;
}

async function performAIReview(invoice: InvoiceData): Promise<void> {
  try {
    const reviewResult = await aiReviewService.reviewDispatchInvoice(invoice);

    // Store AI review result
    invoice.aiReviewResult = {
      isValid: reviewResult.isValid,
      confidence: reviewResult.confidence,
      errors: reviewResult.errors,
      warnings: reviewResult.warnings,
      autoApproved: reviewResult.autoApproved,
      requiresHumanReview: reviewResult.requiresHumanReview,
    };

    // Update invoice status based on AI review
    if (reviewResult.autoApproved) {
      invoice.status = 'approved';
    } else if (reviewResult.requiresHumanReview) {
      invoice.status = 'pending_management_review';
    } else if (!reviewResult.isValid) {
      invoice.status = 'rejected';
    }

    invoice.updatedAt = new Date();
    invoices.set(invoice.id, invoice);
  } catch (error) {
    console.error('AI Review failed:', error);
    // If AI review fails, keep invoice as pending for manual review
    invoice.status = 'pending_management_review';
    invoice.updatedAt = new Date();
    invoices.set(invoice.id, invoice);
  }
}

export function getInvoiceById(id: string): InvoiceData | null {
  return invoices.get(id) || null;
}

export function updateInvoiceStatus(
  id: string,
  status: InvoiceData['status']
): void {
  const invoice = invoices.get(id);
  if (invoice) {
    invoice.status = status;
    invoice.updatedAt = new Date();
    invoices.set(id, invoice);
  }
}

export function getAllInvoices(): InvoiceData[] {
  return Array.from(invoices.values());
}

export function getInvoicesByStatus(
  status: InvoiceData['status']
): InvoiceData[] {
  return Array.from(invoices.values()).filter(
    (invoice) => invoice.status === status
  );
}

export function getInvoicesByDispatcher(dispatcherId: string): InvoiceData[] {
  return Array.from(invoices.values()).filter(
    (invoice) => invoice.dispatcherUserIdentifier === dispatcherId
  );
}

export function getInvoicesByCarrier(carrierName: string): InvoiceData[] {
  return Array.from(invoices.values()).filter(
    (invoice) => invoice.carrierName === carrierName
  );
}

export function getInvoicesByLoad(loadId: string): InvoiceData[] {
  return Array.from(invoices.values()).filter(
    (invoice) => invoice.loadId === loadId
  );
}

export function deleteInvoice(id: string): boolean {
  return invoices.delete(id);
}

export function getInvoiceMetrics(): {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  paid: number;
  overdue: number;
  aiReviewed: number;
  autoApproved: number;
  humanReviewRequired: number;
} {
  const allInvoices = Array.from(invoices.values());

  return {
    total: allInvoices.length,
    pending: allInvoices.filter((inv) => inv.status === 'Pending').length,
    approved: allInvoices.filter((inv) => inv.status === 'approved').length,
    rejected: allInvoices.filter((inv) => inv.status === 'rejected').length,
    paid: allInvoices.filter((inv) => inv.status === 'Paid').length,
    overdue: allInvoices.filter((inv) => inv.status === 'Overdue').length,
    aiReviewed: allInvoices.filter((inv) => inv.aiReviewResult).length,
    autoApproved: allInvoices.filter((inv) => inv.aiReviewResult?.autoApproved)
      .length,
    humanReviewRequired: allInvoices.filter(
      (inv) => inv.aiReviewResult?.requiresHumanReview
    ).length,
  };
}
