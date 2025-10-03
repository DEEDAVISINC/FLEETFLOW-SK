/**
 * FLEETFLOW CLIENT PAYMENT SERVICE
 * View invoices and payment status (client-specific access)
 */

export interface ClientInvoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  freightForwarderId: string;
  shipmentId?: string;
  shipmentNumber?: string;
  issueDate: Date;
  dueDate: Date;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  paidAmount: number;
  paidDate?: Date;
  paymentMethod?: string;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category: 'FREIGHT' | 'CUSTOMS' | 'DOCUMENTATION' | 'STORAGE' | 'OTHER';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentSummary {
  totalInvoiced: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  currency: string;
  invoiceCount: {
    total: number;
    pending: number;
    paid: number;
    overdue: number;
  };
}

class ClientPaymentService {
  private static instance: ClientPaymentService;
  private invoices: Map<string, ClientInvoice[]> = new Map();

  private constructor() {
    this.initializeMockInvoices();
  }

  public static getInstance(): ClientPaymentService {
    if (!ClientPaymentService.instance) {
      ClientPaymentService.instance = new ClientPaymentService();
    }
    return ClientPaymentService.instance;
  }

  private initializeMockInvoices(): void {
    const mockInvoices: ClientInvoice[] = [
      {
        id: 'INV-001',
        invoiceNumber: 'FF-2025-001',
        clientId: 'CLIENT-001',
        freightForwarderId: 'FF-001',
        shipmentId: 'SHIP-001',
        shipmentNumber: 'SHIP-2025-001',
        issueDate: new Date('2025-01-15'),
        dueDate: new Date('2025-02-15'),
        status: 'PAID',
        items: [
          {
            id: 'ITEM-001',
            description: 'Ocean Freight - Shanghai to Long Beach (40HQ)',
            category: 'FREIGHT',
            quantity: 1,
            unitPrice: 2500,
            total: 2500,
          },
          {
            id: 'ITEM-002',
            description: 'Customs Clearance & Broker Fees',
            category: 'CUSTOMS',
            quantity: 1,
            unitPrice: 450,
            total: 450,
          },
          {
            id: 'ITEM-003',
            description: 'Documentation & Filing Fees',
            category: 'DOCUMENTATION',
            quantity: 1,
            unitPrice: 150,
            total: 150,
          },
        ],
        subtotal: 3100,
        tax: 310,
        total: 3410,
        currency: 'USD',
        paidAmount: 3410,
        paidDate: new Date('2025-01-25'),
        paymentMethod: 'Wire Transfer',
      },
      {
        id: 'INV-002',
        invoiceNumber: 'FF-2025-002',
        clientId: 'CLIENT-001',
        freightForwarderId: 'FF-001',
        shipmentId: 'SHIP-002',
        shipmentNumber: 'SHIP-2025-002',
        issueDate: new Date('2025-01-20'),
        dueDate: new Date('2025-02-20'),
        status: 'PENDING',
        items: [
          {
            id: 'ITEM-004',
            description: 'Air Freight - Hong Kong to New York',
            category: 'FREIGHT',
            quantity: 1,
            unitPrice: 4200,
            total: 4200,
          },
          {
            id: 'ITEM-005',
            description: 'Customs Duties & Fees',
            category: 'CUSTOMS',
            quantity: 1,
            unitPrice: 850,
            total: 850,
          },
        ],
        subtotal: 5050,
        tax: 505,
        total: 5555,
        currency: 'USD',
        paidAmount: 0,
        notes: 'Payment due within 30 days',
      },
      {
        id: 'INV-003',
        invoiceNumber: 'FF-2024-095',
        clientId: 'CLIENT-001',
        freightForwarderId: 'FF-001',
        shipmentId: 'SHIP-003',
        shipmentNumber: 'SHIP-2024-095',
        issueDate: new Date('2024-12-01'),
        dueDate: new Date('2025-01-01'),
        status: 'OVERDUE',
        items: [
          {
            id: 'ITEM-006',
            description: 'Ocean Freight - Singapore to Houston',
            category: 'FREIGHT',
            quantity: 1,
            unitPrice: 2800,
            total: 2800,
          },
          {
            id: 'ITEM-007',
            description: 'Port Storage Fees (7 days)',
            category: 'STORAGE',
            quantity: 7,
            unitPrice: 50,
            total: 350,
          },
        ],
        subtotal: 3150,
        tax: 315,
        total: 3465,
        currency: 'USD',
        paidAmount: 0,
        notes: 'OVERDUE - Please remit payment immediately',
      },
    ];

    this.invoices.set('CLIENT-001', mockInvoices);
  }

  /**
   * Get invoices for a specific client
   */
  public async getClientInvoices(
    clientId: string,
    filters?: {
      status?: ClientInvoice['status'];
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<ClientInvoice[]> {
    try {
      let clientInvoices = this.invoices.get(clientId) || [];

      // Apply filters
      if (filters?.status) {
        clientInvoices = clientInvoices.filter(
          (inv) => inv.status === filters.status
        );
      }

      if (filters?.startDate) {
        clientInvoices = clientInvoices.filter(
          (inv) => inv.issueDate >= filters.startDate!
        );
      }

      if (filters?.endDate) {
        clientInvoices = clientInvoices.filter(
          (inv) => inv.issueDate <= filters.endDate!
        );
      }

      // Sort by issue date (most recent first)
      return clientInvoices.sort(
        (a, b) => b.issueDate.getTime() - a.issueDate.getTime()
      );
    } catch (error) {
      console.error('Error getting client invoices:', error);
      throw new Error('Failed to retrieve invoices');
    }
  }

  /**
   * Get payment summary for a client
   */
  public async getPaymentSummary(clientId: string): Promise<PaymentSummary> {
    try {
      const invoices = await this.getClientInvoices(clientId);

      const summary: PaymentSummary = {
        totalInvoiced: 0,
        totalPaid: 0,
        totalPending: 0,
        totalOverdue: 0,
        currency: 'USD',
        invoiceCount: {
          total: invoices.length,
          pending: 0,
          paid: 0,
          overdue: 0,
        },
      };

      invoices.forEach((invoice) => {
        summary.totalInvoiced += invoice.total;

        if (invoice.status === 'PAID') {
          summary.totalPaid += invoice.paidAmount;
          summary.invoiceCount.paid++;
        } else if (invoice.status === 'PENDING') {
          summary.totalPending += invoice.total;
          summary.invoiceCount.pending++;
        } else if (invoice.status === 'OVERDUE') {
          summary.totalOverdue += invoice.total;
          summary.invoiceCount.overdue++;
        }
      });

      return summary;
    } catch (error) {
      console.error('Error getting payment summary:', error);
      throw new Error('Failed to generate payment summary');
    }
  }

  /**
   * Get invoice by ID (with access control)
   */
  public async getInvoiceById(
    invoiceId: string,
    clientId: string
  ): Promise<ClientInvoice | null> {
    try {
      const clientInvoices = this.invoices.get(clientId) || [];
      return clientInvoices.find((inv) => inv.id === invoiceId) || null;
    } catch (error) {
      console.error('Error getting invoice:', error);
      return null;
    }
  }

  /**
   * Download invoice as PDF
   */
  public downloadInvoice(invoice: ClientInvoice): void {
    const htmlContent = `
      <h1>INVOICE</h1>
      <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
      <p><strong>Issue Date:</strong> ${invoice.issueDate.toLocaleDateString()}</p>
      <p><strong>Due Date:</strong> ${invoice.dueDate.toLocaleDateString()}</p>
      <p><strong>Status:</strong> ${invoice.status}</p>
      ${invoice.shipmentNumber ? `<p><strong>Shipment:</strong> ${invoice.shipmentNumber}</p>` : ''}

      <h2>Items</h2>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items
            .map(
              (item) => `
            <tr>
              <td>${item.description}</td>
              <td>${item.category}</td>
              <td>${item.quantity}</td>
              <td>${invoice.currency} ${item.unitPrice.toFixed(2)}</td>
              <td>${invoice.currency} ${item.total.toFixed(2)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div style="text-align: right; margin-top: 20px;">
        <p><strong>Subtotal:</strong> ${invoice.currency} ${invoice.subtotal.toFixed(2)}</p>
        <p><strong>Tax:</strong> ${invoice.currency} ${invoice.tax.toFixed(2)}</p>
        <p><strong>Total:</strong> ${invoice.currency} ${invoice.total.toFixed(2)}</p>
        ${invoice.paidAmount > 0 ? `<p><strong>Paid:</strong> ${invoice.currency} ${invoice.paidAmount.toFixed(2)}</p>` : ''}
        ${invoice.paidAmount < invoice.total ? `<p><strong>Amount Due:</strong> ${invoice.currency} ${(invoice.total - invoice.paidAmount).toFixed(2)}</p>` : ''}
      </div>

      ${invoice.notes ? `<p><em>Notes: ${invoice.notes}</em></p>` : ''}
    `;

    // Create printable window
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) {
      alert('Please allow popups to download invoice');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #4a5568; color: white; }
            h1, h2 { color: #2d3748; }
          </style>
        </head>
        <body>${htmlContent}</body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
}

export const clientPaymentService = ClientPaymentService.getInstance();
export default clientPaymentService;
